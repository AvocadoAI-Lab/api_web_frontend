'use client';

import { FC, useCallback, useRef, useEffect, useState } from 'react';
import { Clock, User, Target, Search } from 'lucide-react';
import * as d3 from 'd3';
import type { EventTableElement } from '../../../../../features/dashboard_v2/types';

// Constants
const SEVERITY_COLORS = {
    critical: {
        bg: 'bg-destructive/20',
        border: 'border-destructive',
        text: 'text-destructive',
        fill: 'hsl(var(--destructive))'
    },
    high: {
        bg: 'bg-chart-3/20',
        border: 'border-chart-3',
        text: 'text-chart-3',
        fill: 'hsl(var(--chart-3))'
    },
    medium: {
        bg: 'bg-chart-4/20',
        border: 'border-chart-4',
        text: 'text-chart-4',
        fill: 'hsl(var(--chart-4))'
    },
    low: {
        bg: 'bg-chart-2/20',
        border: 'border-chart-2',
        text: 'text-chart-2',
        fill: 'hsl(var(--chart-2))'
    }
} as const;

// Types
interface EventWithId extends EventTableElement {
    _id: string;
}

interface EventGroup {
    severity: keyof typeof SEVERITY_COLORS;
    count: number;
    events: EventTableElement[];
}

interface EventCardProps {
    event: EventWithId;
    isAnimating: boolean;
}

interface TimelineProps {
    timelineRef: React.RefObject<SVGSVGElement>;
    events: EventWithId[];
    isMobile: boolean;
}

// Utility Functions
let eventCounter = 0;
const generateEventId = () => {
    eventCounter += 1;
    return `event-${Date.now()}-${eventCounter}`;
};

const getSeverityLevel = (level: number): keyof typeof SEVERITY_COLORS => {
    if (level >= 10) return 'critical';
    if (level >= 7) return 'high';
    if (level >= 4) return 'medium';
    return 'low';
};

const formatTime = (timestamp: Date) => {
    return new Date(timestamp).toLocaleTimeString();
};

const groupEventsBySeverity = (events: EventWithId[]): EventGroup[] => {
    const groups: Record<string, EventGroup> = {
        critical: { severity: 'critical', count: 0, events: [] },
        high: { severity: 'high', count: 0, events: [] },
        medium: { severity: 'medium', count: 0, events: [] },
        low: { severity: 'low', count: 0, events: [] }
    };

    events.forEach(event => {
        const severity = getSeverityLevel(event.rule_level);
        groups[severity].count++;
        groups[severity].events.push(event);
    });

    return Object.values(groups);
};

const filterEventsBySeverity = (events: EventWithId[], selectedSeverity: string) => {
    return events.filter(event =>
        selectedSeverity === 'all' || getSeverityLevel(event.rule_level) === selectedSeverity
    );
};

const createEventWithId = (event: EventTableElement): EventWithId => ({
    ...event,
    _id: generateEventId()
});

// Sub-components
const Timeline: FC<TimelineProps> = ({ timelineRef, events, isMobile }) => {
    useEffect(() => {
        if (!timelineRef.current) return;

        const width = timelineRef.current.clientWidth;
        const height = isMobile ? 40 : 50;
        const margin = { top: 8, right: 8, bottom: 8, left: 8 };

        const svg = d3.select(timelineRef.current);
        svg.selectAll('*').remove();

        const grouped = groupEventsBySeverity(events);
        const total = grouped.reduce((sum, g) => sum + g.count, 0);

        if (total === 0) {
            svg.append('rect')
                .attr('x', margin.left)
                .attr('y', margin.top)
                .attr('width', width - margin.left - margin.right)
                .attr('height', height - margin.top - margin.bottom)
                .attr('fill', 'hsl(var(--muted))')
                .attr('opacity', 0.5)
                .attr('rx', 3);
            return;
        }

        let x = margin.left;
        grouped.forEach(group => {
            if (group.count === 0) return;

            const barWidth = (group.count / total) * (width - margin.left - margin.right);

            if (!isNaN(barWidth) && barWidth > 0) {
                svg.append('rect')
                    .attr('x', x)
                    .attr('y', margin.top)
                    .attr('width', barWidth)
                    .attr('height', height - margin.top - margin.bottom)
                    .attr('fill', SEVERITY_COLORS[group.severity].fill)
                    .attr('opacity', 0.7)
                    .attr('rx', 3);

                if (barWidth > 30) {
                    svg.append('text')
                        .attr('x', x + barWidth / 2)
                        .attr('y', height / 2)
                        .attr('text-anchor', 'middle')
                        .attr('dominant-baseline', 'middle')
                        .attr('fill', 'hsl(var(--background))')
                        .attr('font-size', isMobile ? '8px' : '10px')
                        .text(`${group.count}`);
                }

                x += barWidth;
            }
        });
    }, [events, isMobile, timelineRef]);

    return (
        <svg ref={timelineRef} className="w-full" height={isMobile ? "40" : "50"} />
    );
};

const EventCard: FC<EventCardProps> = ({ event, isAnimating }) => {
    const severity = getSeverityLevel(event.rule_level);
    const colors = SEVERITY_COLORS[severity];

    return (
        <div
            className={`
                border-l-4 rounded p-2 sm:p-3 transition-all duration-500
                ${colors.bg} ${colors.border} ${colors.text}
                ${isAnimating ? 'animate-slide-in' : ''}
                hover:shadow-md
            `}
        >
            <div className="space-y-1.5 sm:space-y-2">
                <div className="flex justify-between items-start gap-2">
                    <div className="text-xs sm:text-sm font-medium line-clamp-2">
                        {event.rule_description}
                    </div>
                    <div className={`
                        shrink-0 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-medium
                        ${colors.bg} ${colors.text}
                    `}>
                        {window.innerWidth >= 640 ? `Level ${event.rule_level}` : event.rule_level}
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 sm:gap-1.5">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatTime(event.timestamp)}
                    </span>
                    <span className="flex items-center gap-1 sm:gap-1.5">
                        <User className="w-3 h-3 sm:w-4 sm:h-4" />
                        {event.agent_name}
                    </span>
                    {/* MITRE ATT&CK 資訊只在桌面版顯示 */}
                    {window.innerWidth >= 640 && (
                        <>
                            {event.rule_mitre_tactic && (
                                <span className="flex items-center gap-1.5">
                                    <Target className="w-4 h-4" />
                                    {event.rule_mitre_tactic}
                                </span>
                            )}
                            {event.rule_mitre_id && (
                                <span className="flex items-center gap-1.5">
                                    <Search className="w-4 h-4" />
                                    {event.rule_mitre_id}
                                </span>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// Main Component
interface Props {
    data: EventTableElement[];
    maxEvents?: number;
}

const EventStream: FC<Props> = ({ data, maxEvents = 10 }) => {
    const [events, setEvents] = useState<EventWithId[]>([]);
    const [animatingEvents, setAnimatingEvents] = useState<Set<string>>(new Set());
    const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
    const containerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<SVGSVGElement>(null);

    const addEvent = useCallback((event: EventTableElement) => {
        const eventWithId = createEventWithId(event);

        setAnimatingEvents((prev: Set<string>) => new Set(prev).add(eventWithId._id));
        setEvents((prev: EventWithId[]) => {
            const newEvents = [eventWithId, ...prev].slice(0, maxEvents);
            return newEvents;
        });

        setTimeout(() => {
            setAnimatingEvents((prev: Set<string>) => {
                const newSet = new Set(prev);
                newSet.delete(eventWithId._id);
                return newSet;
            });
        }, 500);

        if (containerRef.current) {
            containerRef.current.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [maxEvents]);

    useEffect(() => {
        if (!data.length) return;

        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex < data.length) {
                addEvent(data[currentIndex]);
                currentIndex++;
            } else {
                currentIndex = 0;
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [data, addEvent]);

    const handleSeverityChange = (severity: string) => {
        setSelectedSeverity(severity);
    };

    const filteredEvents = filterEventsBySeverity(events, selectedSeverity);
    const timelineData = groupEventsBySeverity(events);

    return (
        <div className="w-full bg-card rounded-lg shadow-sm p-3 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-card-foreground">即時事件流</h2>

            <div className="space-y-3 sm:space-y-4">
                {/* Timeline Visualization */}
                <div>
                    <Timeline
                        timelineRef={timelineRef}
                        events={events}
                        isMobile={window.innerWidth < 640}
                    />
                </div>

                {/* Severity Filter */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <button
                        onClick={() => handleSeverityChange('all')}
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${selectedSeverity === 'all'
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-muted text-muted-foreground'
                            }`}
                    >
                        {window.innerWidth >= 640 ? '全部' : 'All'}
                    </button>
                    {Object.entries(SEVERITY_COLORS).map(([severity, colors]) => {
                        const severityText = window.innerWidth >= 640
                            ? {
                                'critical': '嚴重',
                                'high': '高風險',
                                'medium': '中風險',
                                'low': '低風險'
                            }[severity]
                            : severity.charAt(0).toUpperCase() + severity.slice(1);

                        return (
                            <button
                                key={severity}
                                onClick={() => handleSeverityChange(severity)}
                                className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm ${selectedSeverity === severity
                                    ? `${colors.bg} ${colors.text} font-medium`
                                    : 'bg-muted text-muted-foreground'
                                    }`}
                            >
                                {severityText}
                            </button>
                        );
                    })}
                </div>

                {/* Event List */}
                <div className="relative">
                    <div className="absolute top-0 left-0 w-full h-6 sm:h-8 bg-gradient-to-b from-card to-transparent z-10"></div>
                    <div
                        ref={containerRef}
                        className="h-[300px] sm:h-[400px] overflow-y-auto space-y-2 sm:space-y-3"
                    >
                        {filteredEvents.map((event) => (
                            <EventCard
                                key={event._id}
                                event={event}
                                isAnimating={animatingEvents.has(event._id)}
                            />
                        ))}
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-6 sm:h-8 bg-gradient-to-t from-card to-transparent"></div>
                </div>
            </div>
        </div>
    );
};

export default EventStream;