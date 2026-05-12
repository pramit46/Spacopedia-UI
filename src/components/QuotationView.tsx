import React from 'react';
import { Calculator, Download, Plus, FileSpreadsheet, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../mockData';

interface QuotationViewProps {
  currentUser: User;
  projectId: string;
}

export function QuotationView({ currentUser, projectId }: QuotationViewProps) {
  const quotations = [
    { id: 'Q-001', name: 'Initial Civil Works Estimate', amount: 850000, date: '2024-01-05', status: 'Approved' },
    { id: 'Q-002', name: 'Interior Design & Carpentry Package', amount: 1250000, date: '2024-02-15', status: 'Contracted' },
    { id: 'Q-003', name: 'Electrical & Automation Add-on', amount: 350000, date: '2024-03-10', status: 'Approved' },
    { id: 'Q-004', name: 'Landscape Design Proposal', amount: 225000, date: '2024-05-02', status: 'Draft' },
  ];

  const totalValue = quotations.reduce((acc, q) => acc + q.amount, 0);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black italic mb-2 tracking-tight">Project Quotations</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Financial blueprints and scope costings for client approval cycles.</p>
        </div>
        {(currentUser.role === 'owner' || currentUser.role === 'sales') && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl">
            <Plus className="w-5 h-5" />
            Create Revised Quote
          </button>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border dark:border-gray-800 shadow-sm md:col-span-2">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Quotation Value</p>
          <div className="flex items-baseline gap-2">
             <span className="text-4xl font-black tracking-tight italic">₹{(totalValue / 100000).toFixed(2)}L+</span>
             <span className="text-sm font-bold text-gray-400 uppercase">Settlement Target</span>
          </div>
        </div>
        <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-600/30">
          <Calculator className="w-6 h-6 mb-2 opacity-50" />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Conversion Rate</p>
          <p className="text-2xl font-black">75% Approval</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border dark:border-gray-800 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Draft Proposals</p>
          <p className="text-2xl font-black">01 Pending</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-xl font-black italic">Quotation Ledger</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Quotation Identity</th>
                <th className="px-6 py-5 text-right">Value</th>
                <th className="px-6 py-5 text-center">Submission Date</th>
                <th className="px-6 py-5">Cycle Status</th>
                <th className="px-8 py-5 text-right">Transmission</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {quotations.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-8 py-6">
                    <p className="font-extrabold text-gray-800 dark:text-gray-100">{q.name}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{q.id}</p>
                  </td>
                  <td className="px-6 py-6 text-right font-black text-blue-600">₹{q.amount.toLocaleString()}</td>
                  <td className="px-6 py-6 text-center text-sm font-medium text-gray-500 font-mono">{q.date}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      q.status === 'Approved' || q.status === 'Contracted' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {q.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 rounded-xl hover:text-blue-600 transition-all">
                         <Download className="w-4 h-4" />
                       </button>
                       <button className="p-2.5 bg-gray-50 dark:bg-gray-800 text-gray-600 rounded-xl hover:text-blue-600 transition-all">
                         <Send className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
