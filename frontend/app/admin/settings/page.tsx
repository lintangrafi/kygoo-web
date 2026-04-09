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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [settings, setSettings] = useState({
    siteName: 'Kygoo Group',
    siteDescription: 'Premium services across multiple business lines',
    maintenanceMode: false,
    emailNotifications: true,
    darkMode: true,
  });

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'business', label: 'Business Lines', icon: '🏢' },
    { id: 'integrations', label: 'Integrations', icon: '🔌' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  const businessLines = [
    { name: 'Studio', status: 'Active', color: '#d4af37' },
    { name: 'Photobooth', status: 'Active', color: '#ff006e' },
    { name: 'Digital', status: 'Active', color: '#00d084' },
    { name: 'Coffee', status: 'Active', color: '#6f4e37' },
  ];

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950 min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-gray-400 text-sm mt-1">Configure app settings and preferences</p>
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
        {/* Tab Navigation */}
        <motion.div
          className="flex gap-4 mb-8 border-b border-slate-800 pb-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              variants={itemVariants}
              onClick={() => setActiveTab(tab.id)}
              className="px-4 py-2 rounded-lg transition-all font-semibold text-sm"
              style={{
                background: activeTab === tab.id ? '#00d08430' : 'transparent',
                color: activeTab === tab.id ? '#00d084' : '#d1d5db',
                borderBottom: activeTab === tab.id ? '2px solid #00d084' : 'none',
              }}
              whileHover={{ scale: 1.05 }}
            >
              {tab.icon} {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* General Settings */}
        {activeTab === 'general' && (
          <motion.section
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="lg:col-span-2 space-y-6">
              {/* Site Name */}
              <motion.div variants={itemVariants} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50">
                <label className="block text-sm font-bold mb-2">Site Name</label>
                <input
                  type="text"
                  defaultValue={settings.siteName}
                  className="w-full bg-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </motion.div>

              {/* Site Description */}
              <motion.div variants={itemVariants} className="p-6 rounded-lg border border-slate-800 bg-slate-900/50">
                <label className="block text-sm font-bold mb-2">Site Description</label>
                <textarea
                  defaultValue={settings.siteDescription}
                  className="w-full bg-slate-800 rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={3}
                />
              </motion.div>

              {/* Toggles */}
              <motion.div variants={itemVariants} className="space-y-4">
                {[
                  { label: 'Maintenance Mode', key: 'maintenanceMode' },
                  { label: 'Email Notifications', key: 'emailNotifications' },
                  { label: 'Dark Mode', key: 'darkMode' },
                ].map((toggle) => (
                  <div key={toggle.key} className="p-4 rounded-lg border border-slate-800 bg-slate-900/50 flex justify-between items-center">
                    <label className="font-semibold">{toggle.label}</label>
                    <button
                      onClick={() =>
                        setSettings({
                          ...settings,
                          [toggle.key]: !settings[toggle.key as keyof typeof settings],
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-all ${
                        settings[toggle.key as keyof typeof settings]
                          ? 'bg-green-500'
                          : 'bg-slate-700'
                      }`}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-white"
                        animate={{
                          x: settings[toggle.key as keyof typeof settings] ? 22 : 2,
                        }}
                      />
                    </button>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              variants={itemVariants}
              className="p-6 rounded-lg border border-slate-800 bg-gradient-to-br from-green-900/30 to-green-900/10 h-fit"
            >
              <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {[
                  { label: 'Save Changes', action: 'save' },
                  { label: 'Export Settings', action: 'export' },
                  { label: 'Reset to Default', action: 'reset' },
                ].map((action) => (
                  <motion.button
                    key={action.action}
                    className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded font-semibold text-sm transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.section>
        )}

        {/* Business Lines Settings */}
        {activeTab === 'business' && (
          <motion.section
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {businessLines.map((line) => (
              <motion.div
                key={line.name}
                variants={itemVariants}
                className="p-6 rounded-lg border border-slate-800 bg-slate-900/50"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-bold text-lg">{line.name}</h3>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold"
                    style={{ background: `${line.color}30`, color: line.color }}
                  >
                    {line.status}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Enable/Disable</p>
                    <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-semibold transition-all">
                      Manage
                    </button>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Customization</p>
                    <button className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-semibold transition-all">
                      Edit Theme
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Integrations */}
        {activeTab === 'integrations' && (
          <motion.section
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { name: 'Payment Gateway', status: 'connected', service: 'Midtrans' },
              { name: 'Email Service', status: 'connected', service: 'SendGrid' },
              { name: 'Analytics', status: 'connected', service: 'Google Analytics' },
              { name: 'CRM', status: 'pending', service: 'HubSpot' },
            ].map((integration) => (
              <motion.div
                key={integration.name}
                variants={itemVariants}
                className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-bold text-lg">{integration.name}</h3>
                  <p className="text-gray-400 text-sm">{integration.service}</p>
                </div>
                <div className="flex gap-3 items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      integration.status === 'connected'
                        ? 'bg-green-500/30 text-green-400'
                        : 'bg-yellow-500/30 text-yellow-400'
                    }`}
                  >
                    {integration.status}
                  </span>
                  <motion.button
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded font-semibold text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    Configure
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.section>
        )}

        {/* Security */}
        {activeTab === 'security' && (
          <motion.section
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[
              { title: 'JWT Secret', description: 'Manage authentication tokens', action: 'Rotate' },
              { title: 'API Keys', description: 'Generate and revoke API keys', action: 'Manage' },
              { title: '2FA', description: 'Two-factor authentication settings', action: 'Configure' },
              { title: 'Backup', description: 'Database backup and restore', action: 'Backup Now' },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="p-6 rounded-lg border border-slate-800 bg-slate-900/50"
              >
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                <motion.button
                  className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 rounded font-semibold text-sm border border-red-500 text-red-400 transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.action}
                </motion.button>
              </motion.div>
            ))}
          </motion.section>
        )}
      </div>
    </div>
  );
}
