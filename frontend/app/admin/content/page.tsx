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

export default function ContentManager() {
  const [selectedBusinessLine, setSelectedBusinessLine] = useState<string>('studio');
  const [editingContent, setEditingContent] = useState<number | null>(null);

  const businessLines = [
    { id: 'studio', name: 'Studio', color: '#d4af37', icon: '📷' },
    { id: 'photobooth', name: 'Photobooth', color: '#ff006e', icon: '📸' },
    { id: 'digital', name: 'Digital', color: '#00d084', icon: '💻' },
    { id: 'coffee', name: 'Coffee', color: '#6f4e37', icon: '☕' },
  ];

  const contentItems = {
    studio: [
      { id: 1, title: 'Hero Section Title', type: 'text', value: 'Capture Your Most Precious Moments' },
      { id: 2, title: 'Hero Description', type: 'textarea', value: 'Professional photography services...' },
      { id: 3, title: 'Services Section', type: 'section', value: '6 services defined' },
      { id: 4, title: 'Pricing Tier 1', type: 'pricing', value: 'Essential: Rp 2,500,000' },
    ],
    photobooth: [
      { id: 1, title: 'Event Packages', type: 'section', value: '3 packages defined' },
      { id: 2, title: 'Features List', type: 'list', value: '6 key features' },
      { id: 3, title: 'Gallery Images', type: 'media', value: '8 images' },
    ],
    digital: [
      { id: 1, title: 'Services', type: 'section', value: '6 digital services' },
      { id: 2, title: 'Tech Stack', type: 'list', value: '8 technologies' },
      { id: 3, title: 'Portfolio', type: 'media', value: '6 projects' },
    ],
    coffee: [
      { id: 1, title: 'Menu - Coffee', type: 'list', value: '6 coffee items' },
      { id: 2, title: 'Menu - Pastries', type: 'list', value: '6 pastry items' },
      { id: 3, title: 'Events', type: 'list', value: '6 event types' },
      { id: 4, title: 'Location Info', type: 'text', value: 'Jl. Senayan, No. 42...' },
    ],
  };

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950 min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Content Manager</h1>
            <p className="text-gray-400 text-sm mt-1">Edit content for all business lines</p>
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
        {/* Business Line Selector */}
        <motion.section
          className="mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-xl font-bold mb-4">Select Business Line</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {businessLines.map((line) => (
              <motion.button
                key={line.id}
                variants={itemVariants}
                onClick={() => setSelectedBusinessLine(line.id)}
                className="p-4 rounded-lg border-2 transition-all text-center"
                style={{
                  borderColor:
                    selectedBusinessLine === line.id ? line.color : 'rgba(107, 114, 128, 0.3)',
                  background:
                    selectedBusinessLine === line.id ? `${line.color}20` : 'rgba(30, 41, 59, 0.5)',
                }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl mb-2">{line.icon}</div>
                <p className="font-semibold text-sm">{line.name}</p>
              </motion.button>
            ))}
          </div>
        </motion.section>

        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          className="mb-6 p-6 rounded-lg border border-cyan-700/40 bg-cyan-900/10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold">Completed Projects CMS</h3>
              <p className="text-sm text-slate-300 mt-1">
                Kelola project landing page per lini bisnis dengan audit log perubahan.
              </p>
            </div>
            <Link
              href="/admin/content/projects"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-semibold text-sm transition-all"
            >
              Open Projects CMS
            </Link>
          </div>
        </motion.div>

        {/* Content Items */}
        <motion.section
          key={selectedBusinessLine}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold mb-4">Content Items</h2>
            {contentItems[selectedBusinessLine as keyof typeof contentItems]?.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="p-6 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 transition-all"
                onClick={() => setEditingContent(editingContent === item.id ? null : item.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{item.title}</h3>
                    <p className="text-gray-400 text-xs mt-1">Type: {item.type}</p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-800"
                    style={{ color: businessLines.find((b) => b.id === selectedBusinessLine)?.color }}
                  >
                    {item.type}
                  </span>
                </div>

                {editingContent === item.id ? (
                  <div className="flex gap-3 mt-4">
                    {item.type === 'textarea' ? (
                      <textarea
                        className="flex-1 bg-slate-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-current resize-none"
                        defaultValue={item.value}
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        className="flex-1 bg-slate-800 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-current"
                        defaultValue={item.value}
                      />
                    )}
                    <motion.button
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded font-semibold text-sm transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Save
                    </motion.button>
                  </div>
                ) : (
                  <p className="text-gray-300 text-sm">
                    {item.value.substring(0, 100)}
                    {item.value.length > 100 ? '...' : ''}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Preview Panel */}
          <motion.div
            variants={itemVariants}
            className="p-6 rounded-lg border border-slate-800 bg-gradient-to-br from-blue-900/20 to-blue-900/5 h-fit sticky top-24"
          >
            <h3 className="font-bold text-lg mb-4">Preview</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded bg-slate-900/50 border-l-2 border-blue-500">
                <p className="text-gray-400 text-xs uppercase mb-1">Last Updated</p>
                <p className="font-semibold">5 minutes ago</p>
              </div>
              <div className="p-3 rounded bg-slate-900/50 border-l-2 border-green-500">
                <p className="text-gray-400 text-xs uppercase mb-1">Status</p>
                <p className="font-semibold text-green-400">Published</p>
              </div>
              <div className="p-3 rounded bg-slate-900/50 border-l-2 border-yellow-500">
                <p className="text-gray-400 text-xs uppercase mb-1">Changes</p>
                <p className="font-semibold">2 pending</p>
              </div>
            </div>
            <motion.button
              className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Publish All Changes
            </motion.button>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}
