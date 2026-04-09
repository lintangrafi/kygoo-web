'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function AnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('monthly');

  const metricsData = {
    monthly: [
      { name: 'Studio', orders: 45, revenue: '225M', growth: '+12%' },
      { name: 'Photobooth', orders: 32, revenue: '96M', growth: '+8%' },
      { name: 'Digital', orders: 18, revenue: '270M', growth: '+15%' },
      { name: 'Coffee', orders: 156, revenue: '234M', growth: '+5%' },
    ],
    weekly: [
      { name: 'Studio', orders: 12, revenue: '60M', growth: '+5%' },
      { name: 'Photobooth', orders: 8, revenue: '24M', growth: '+2%' },
      { name: 'Digital', orders: 4, revenue: '60M', growth: '+8%' },
      { name: 'Coffee', orders: 38, revenue: '57M', growth: '+1%' },
    ],
  };

  const trafficSources = [
    { source: 'Direct', visits: 2840, percentage: 35 },
    { source: 'Google Search', visits: 2234, percentage: 28 },
    { source: 'Social Media', visits: 1890, percentage: 23 },
    { source: 'Referral', visits: 956, percentage: 12 },
  ];

  const topPages = [
    { page: '/studio', views: 1240, avgTime: '3m 24s' },
    { page: '/coffee', views: 989, avgTime: '2m 15s' },
    { page: '/digital', views: 856, avgTime: '4m 12s' },
    { page: '/photobooth', views: 723, avgTime: '2m 50s' },
  ];

  const currentData = metricsData[selectedPeriod as keyof typeof metricsData];

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950 min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-gray-400 text-sm mt-1">Business metrics and insights</p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-2 rounded-lg border border-slate-700 hover:border-current transition-all"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Period Selector */}
        <motion.section
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex gap-4 mb-8">
            {['weekly', 'monthly'].map((period) => (
              <motion.button
                key={period}
                variants={itemVariants}
                onClick={() => setSelectedPeriod(period)}
                className="px-6 py-2 rounded-lg border-2 transition-all font-semibold"
                style={{
                  borderColor:
                    selectedPeriod === period ? '#00d084' : 'rgba(107, 114, 128, 0.3)',
                  background:
                    selectedPeriod === period ? '#00d08430' : 'rgba(30, 41, 59, 0.5)',
                  color: selectedPeriod === period ? '#00d084' : '#d1d5db',
                }}
                whileHover={{ scale: 1.05 }}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </motion.button>
            ))}
          </div>

          {/* Business Line Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {currentData.map((line, i) => (
              <motion.div
                key={line.name}
                variants={itemVariants}
                className="p-6 rounded-lg border border-slate-800 bg-slate-900/50"
              >
                <h3 className="font-bold text-lg mb-4">{line.name}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">Orders</p>
                    <p className="text-2xl font-bold">{line.orders}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">Revenue</p>
                    <p className="text-2xl font-bold text-green-400">Rp {line.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-green-500">{line.growth} Growth</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Total Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: 'Total Orders',
                value: currentData.reduce((sum, line) => sum + line.orders, 0).toString(),
                icon: '📊',
              },
              {
                label: 'Total Revenue',
                value: `Rp ${(currentData.reduce((sum, line) => {
                  const num = parseInt(line.revenue);
                  return sum + num;
                }, 0) / 1).toFixed(0)}M`,
                icon: '💰',
              },
              { label: 'Avg Order Value', value: 'Rp 1.2M', icon: '📈' },
              { label: 'Conversion', value: '3.2%', icon: '🎯' },
            ].map((metric) => (
              <motion.div
                key={metric.label}
                variants={itemVariants}
                className="p-4 rounded-lg border border-slate-800 bg-slate-900/50"
              >
                <div className="text-2xl mb-2">{metric.icon}</div>
                <p className="text-gray-400 text-xs uppercase mb-1">{metric.label}</p>
                <p className="font-bold text-lg">{metric.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Traffic Sources */}
        <motion.section
          className="mb-12 grid grid-cols-1 lg:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Traffic Chart */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-lg border border-slate-800 bg-slate-900/50"
          >
            <h2 className="text-xl font-bold mb-6">Traffic Sources</h2>
            <div className="space-y-4">
              {trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold">{source.source}</p>
                    <p className="text-gray-400">{source.visits.toLocaleString()} visits</p>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${source.percentage}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{source.percentage}%</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Pages */}
          <motion.div
            variants={itemVariants}
            className="p-8 rounded-lg border border-slate-800 bg-slate-900/50"
          >
            <h2 className="text-xl font-bold mb-6">Top Pages</h2>
            <div className="space-y-4">
              {topPages.map((page, i) => (
                <motion.div
                  key={page.page}
                  className="p-3 rounded border border-slate-700 bg-slate-800/50"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-semibold text-sm">{page.page}</p>
                    <p className="text-green-400 font-bold">{page.views.toLocaleString()}</p>
                  </div>
                  <p className="text-gray-400 text-xs">Avg time: {page.avgTime}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Performance Insights */}
        <motion.section
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            {
              title: 'Best Performer',
              value: 'Coffee ☕',
              subtitle: '156 orders this month',
              color: '#6f4e37',
            },
            {
              title: 'Fastest Growing',
              value: 'Digital 💻',
              subtitle: '+15% month-over-month',
              color: '#00d084',
            },
            {
              title: 'Peak Hours',
              value: '10 AM - 2 PM',
              subtitle: '60% of daily traffic',
              color: '#ff006e',
            },
          ].map((insight) => (
            <motion.div
              key={insight.title}
              variants={itemVariants}
              className="p-6 rounded-lg border-2"
              style={{
                borderColor: `${insight.color}40`,
                background: `${insight.color}15`,
              }}
            >
              <p className="text-gray-400 text-xs uppercase mb-2">{insight.title}</p>
              <p className="text-2xl font-bold mb-2">{insight.value}</p>
              <p className="text-graytext-sm" style={{ color: insight.color }}>
                {insight.subtitle}
              </p>
            </motion.div>
          ))}
        </motion.section>
      </div>
    </div>
  );
}
