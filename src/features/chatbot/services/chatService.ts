import { avocadoClient } from '@/core/https/AvocadoClient';
import {createSystemPrompt} from './prompts';
import {DashboardInfo, Message} from '../types/chat';

interface ChatServiceResponse {
    success: boolean;
    data?: DashboardInfo;
    error?: string;
}

export class ChatService {
    private static instance: ChatService;
    private dashboardInfo: DashboardInfo | null = null;
    private lastFetchTime: number = 0;
    private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    private constructor() {}

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    private formatToLocalDateTime(date: Date): string {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
            .toISOString()
            .slice(0, 16);
    }

    private getTimeRange(): { startTime: Date; endTime: Date } {
        const endTime = new Date();
        const startTime = new Date(endTime.getTime() - 28 * 60 * 60 * 1000);

        // 轉換為本地時間字符串，然後添加 Z 來確保正確的 UTC 轉換
        const startLocal = this.formatToLocalDateTime(startTime) + 'Z';
        const endLocal = this.formatToLocalDateTime(endTime) + 'Z';

        // 創建新的 Date 對象
        return {
            startTime: new Date(startLocal),
            endTime: new Date(endLocal)
        };
    }

    private async fetchChatbotData(): Promise<ChatServiceResponse> {
        try {
            const { startTime, endTime } = this.getTimeRange();
            console.log('Fetching data for time range:', {
                start: startTime.toISOString(),
                end: endTime.toISOString()
            });

            const params = {
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString()
            };

            // 並行請求所有需要的數據
            const [
                agentSummaryResponse,
                lineChartResponse,
                pieChartResponse,
                messagesResponse,
                totalEventResponse
            ] = await Promise.all([
                avocadoClient.get('api/wazuh/agents/summary', { params }),
                avocadoClient.get('api/wazuh/line-chart', { params }),
                avocadoClient.get('api/wazuh/pie-chart', { params }),
                avocadoClient.get('api/wazuh/messages', { params }),
                avocadoClient.get('api/wazuh/total-event', { params })
            ]);

            // 整理數據為 DashboardInfo 格式
            this.dashboardInfo = {
                totalAgents: agentSummaryResponse.agents.find((a: any) => a.agent_name === "Total agents")?.data || 0,
                activeAgents: agentSummaryResponse.agents.find((a: any) => a.agent_name === "Active agents")?.data || 0,
                topAgent: pieChartResponse.content.top_agents[0]?.name || 'N/A',
                topEvent: pieChartResponse.content.top_events[0]?.name || 'N/A',
                topMitre: pieChartResponse.content.top_mitre[0]?.name || 'N/A',
                totalEvents: parseInt(totalEventResponse.content.count),
                latestEventTrends: lineChartResponse.datas.map((d: any) => ({
                    name: d.name,
                    value: d.data[d.data.length - 1][1]
                })),
                recentEvents: messagesResponse.datas.map((msg: any) => ({
                    time: msg.time,
                    agent_name: msg.agent_name,
                    rule_description: msg.rule_description,
                    rule_mitre_tactic: msg.rule_mitre_tactic,
                    rule_mitre_id: msg.rule_mitre_id,
                    rule_level: msg.rule_level
                })),
                agentDistribution: {
                    windows: {
                        total: agentSummaryResponse.agents.find((a: any) => a.agent_name === "Windows agents")?.data || 0,
                        active: agentSummaryResponse.agents.find((a: any) => a.agent_name === "Active Windows agents")?.data || 0
                    },
                    linux: {
                        total: agentSummaryResponse.agents.find((a: any) => a.agent_name === "Linux agents")?.data || 0,
                        active: agentSummaryResponse.agents.find((a: any) => a.agent_name === "Active Linux agents")?.data || 0
                    },
                    macos: {
                        total: agentSummaryResponse.agents.find((a: any) => a.agent_name === "MacOs agents")?.data || 0,
                        active: agentSummaryResponse.agents.find((a: any) => a.agent_name === "Active MacOS agents")?.data || 0
                    }
                }
            };

            this.lastFetchTime = Date.now();

            return {
                success: true,
                data: this.dashboardInfo
            };

        } catch (error: any) {
            console.error('Error fetching chatbot data:', error);
            return {
                success: false,
                error: error.response?.data?.detail || error.message || '獲取數據時發生錯誤'
            };
        }
    }

    private shouldRefreshData(): boolean {
        return !this.dashboardInfo || (Date.now() - this.lastFetchTime) > this.CACHE_DURATION;
    }

    public async sendStreamingMessage(
        message: string,
        messageHistory: Message[],
        onChunk: (chunk: string) => void
    ): Promise<void> {
        try {
            // 如果需要，更新數據
            if (this.shouldRefreshData()) {
                const response = await this.fetchChatbotData();
                if (!response.success || !response.data) {
                    throw new Error('無法獲取系統狀態數據');
                }
                this.dashboardInfo = response.data;
            }

            if (!this.dashboardInfo) {
                throw new Error('無法獲取系統狀態數據');
            }

            const systemPrompt = createSystemPrompt(this.dashboardInfo);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    systemPrompt,
                    messageHistory: messageHistory.map(msg => ({
                        ...msg,
                        timestamp: msg.timestamp?.toISOString()
                    }))
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`聊天請求失敗: ${errorText}`);
            }

            if (!response.body) {
                throw new Error('回應沒有內容');
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                onChunk(chunk);
            }

        } catch (error: any) {
            console.error('Error in sendStreamingMessage:', error);
            throw error;
        }
    }

    public async getDashboardInfo(): Promise<DashboardInfo | null> {
        if (this.shouldRefreshData()) {
            const response = await this.fetchChatbotData();
            if (!response.success || !response.data) {
                return null;
            }
            this.dashboardInfo = response.data;
        }
        return this.dashboardInfo;
    }
}
