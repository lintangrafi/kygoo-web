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

export default function OrdersPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);

  const orders = [
    {
      id: 1001,
      customer: 'John Doe',
      businessLine: 'Studio',
      service: 'Wedding Photography',
      amount: 'Rp 5,000,000',
      status: 'pending',
      date: '2024-12-20',
      color: '#d4af37',
    },
    {
      id: 1002,
      customer: 'ABC Corporation',
      businessLine: 'Photobooth',
      service: 'Corporate Event Package',
      amount: 'Rp 3,500,000',
      status: 'confirmed',
      date: '2024-12-19',
      color: '#ff006e',
    },
    {
      id: 1003,
      customer: 'Sarah Tech',
      businessLine: 'Digital',
      service: 'Website Development',
      amount: 'Rp 15,000,000',
      status: 'in-progress',
      date: '2024-12-18',
      color: '#00d084',
    },
    {
      id: 1004,
      customer: 'Emma Johnson',
      businessLine: 'Coffee',
      service: 'Catering - 50 People',
      amount: 'Rp 2,500,000',
      status: 'completed',
      date: '2024-12-17',
      color: '#6f4e37',
    },
    {
      id: 1005,
      customer: 'Mike Wilson',
      businessLine: 'Studio',
      service: 'Portrait Session',
      amount: 'Rp 2,500,000',
      status: 'pending',
      date: '2024-12-16',
      color: '#d4af37',
    },
    {
      id: 1006,
      customer: 'Lisa Park',
      businessLine: 'Digital',
      service: 'Mobile App Development',
      amount: 'Rp 20,000,000',
      status: 'in-progress',
      date: '2024-12-15',
      color: '#00d084',
    },
  ];

  const statusConfig = {
    all: { label: 'All Orders', color: '#gray' },
    pending: { label: 'Pending', color: '#f59e0b' },
    confirmed: { label: 'Confirmed', color: '#3b82f6' },
    'in-progress': { label: 'In Progress', color: '#8b5cf6' },
    completed: { label: 'Completed', color: '#10b981' },
  };

  const filteredOrders =
    selectedStatus === 'all' ? orders : orders.filter((o) => o.status === selectedStatus);

  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-gray-900 to-slate-950 min-h-screen text-white">
      {/* Header */}
      <div className="border-b border-slate-800/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Orders Management</h1>
            <p className="text-gray-400 text-sm mt-1">
              {filteredOrders.length} orders ({selectedStatus === 'all' ? 'total' : selectedStatus})
            </p>
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
        {/* Status Filter */}
        <motion.section
          className="mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-lg font-bold mb-4">Filter by Status</h2>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(statusConfig).map(([status, config]) => (
              <motion.button
                key={status}
                variants={itemVariants}
                onClick={() => setSelectedStatus(status)}
                className="px-4 py-2 rounded-lg border-2 transition-all text-sm font-semibold"
                style={{
                  borderColor:
                    selectedStatus === status ? config.color : 'rgba(107, 114, 128, 0.3)',
                  background:
                    selectedStatus === status
                      ? `${config.color}30`
                      : 'rgba(30, 41, 59, 0.5)',
                  color: selectedStatus === status ? config.color : '#d1d5db',
                }}
                whileHover={{ scale: 1.05 }}
              >
                {config.label}
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Orders Table */}
        <motion.section
          className="overflow-x-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <motion.div
                key={order.id}
                variants={itemVariants}
                onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                className="p-5 rounded-lg border border-slate-800 bg-slate-900/50 hover:border-slate-700 cursor-pointer transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">Order ID</p>
                    <p className="font-bold text-lg">#{order.id}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">Customer</p>
                    <p className="font-semibold">{order.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">Service</p>
                    <p className="font-semibold text-sm">{order.service}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs uppercase mb-1">Amount</p>
                    <p className="font-bold" style={{ color: order.color }}>
                      {order.amount}
                    </p>
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-start">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: `${statusConfig[order.status as keyof typeof statusConfig].color}30`,
                        color: statusConfig[order.status as keyof typeof statusConfig].color,
                      }}
                    >
                      {statusConfig[order.status as keyof typeof statusConfig].label}
                    </span>
                    <p className="text-gray-400 text-xs mt-2">{order.date}</p>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedOrder === order.id && (
                  <motion.div
                    className="pt-4 border-t border-slate-700 mt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-400 text-xs uppercase mb-2">Business Line</p>
                        <div
                          className="px-3 py-2 rounded text-sm font-semibold"
                          style={{
                            background: `${order.color}30`,
                            color: order.color,
                          }}
                        >
                          {order.businessLine}
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase mb-2">Contact</p>
                        <input
                          type="text"
                          defaultValue="customer@email.com"
                          className="w-full bg-slate-800 rounded px-2 py-2 text-sm"
                        />
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs uppercase mb-2">Notes</p>
                        <textarea
                          defaultValue="Standard service, confirmed details..."
                          className="w-full bg-slate-800 rounded px-2 py-2 text-sm resize-none"
                          rows={2}
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <motion.button
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-semibold transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Update Status
                        </motion.button>
                        <motion.button
                          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded text-sm font-semibold transition-all"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Send Notification
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
