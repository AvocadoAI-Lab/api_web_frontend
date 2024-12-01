import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Activity, Lock, Cpu, MessageSquare, BarChart2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Mobile Hero Section */}
      <section className="sm:hidden relative bg-gray-900">
        <div className="h-screen flex flex-col">
          {/* Navigation */}
          <nav className="w-full">
            <div className="px-4 py-4 flex justify-end">
              <Link
                href="/auth/login"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                登入
              </Link>
            </div>
          </nav>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {/* Image Container */}
            <div className="relative flex-1">
              <Image
                src="/HomePageVisualAvocado.webp"
                alt="ThreatCado 資安平台"
                fill
                priority
                className="object-contain"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900" />
            </div>

            {/* Text Content */}
            <div className="relative px-4 py-8 text-center bg-gray-900">
              <h1 className="text-3xl font-bold text-white mb-4">
                新世代資安智能平台
              </h1>
              <p className="text-base text-gray-200 mb-6">
                透過 AI 驅動的威脅偵測、即時監控和智能回應能力，強化您的資安運營
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-all duration-200 ease-in-out"
              >
                立即開始
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Desktop Hero Section */}
      <section className="hidden sm:block relative w-full bg-gray-900">
        <div className="relative w-full" style={{ aspectRatio: '1792/1024' }}>
          <Image
            src="/HomePageVisualAvocado.webp"
            alt="ThreatCado 資安平台"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Content */}
        <div className="absolute inset-0 flex flex-col">
          {/* Navigation */}
          <nav className="w-full">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="flex justify-end items-center h-20">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  登入
                </Link>
              </div>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="flex-grow flex items-center justify-center">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
              <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                新世代資安智能平台
              </h1>
              <p className="text-xl lg:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
                透過 AI 驅動的威脅偵測、即時監控和智能回應能力，強化您的資安運營
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-all duration-200 ease-in-out"
              >
                立即開始
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              全方位資安解決方案
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              以先進的資安功能保護您的組織
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">威脅偵測</h3>
              <p className="text-gray-600">具備即時監控和分析的進階威脅偵測</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">網路監控</h3>
              <p className="text-gray-600">全面的網路可視性和流量分析</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                <Lock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">端點防護</h3>
              <p className="text-gray-600">安全的端點管理與防護</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                <Cpu className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">工控資安</h3>
              <p className="text-gray-600">工業控制系統資安監控</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">AI 助理</h3>
              <p className="text-gray-600">提供資安洞察與協助的智能聊天機器人</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="h-12 w-12 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                <BarChart2 className="h-6 w-6 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">分析報表</h3>
              <p className="text-gray-600">進階資安分析與報表功能</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              準備好提升您的資安防護了嗎？
            </h2>
            <p className="text-lg sm:text-xl text-blue-100 mb-8">
              立即開始使用 ThreatCado XDR
            </p>
            <Link
              href="/auth/login"
              className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-base sm:text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors duration-200"
            >
              立即開始使用
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 ThreatCado XDR. 版權所有。</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
