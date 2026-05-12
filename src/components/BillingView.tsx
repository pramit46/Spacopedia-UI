import React, { useState } from 'react';
import { Plus, CheckCircle2, FileText, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Expense } from '../mockData';

interface BillingViewProps {
  currentUser: User;
  items: Expense[];
  onDelete: (id: string) => void;
  onAdd: (e: Expense) => void;
}

export function BillingView({ currentUser, items, onDelete, onAdd }: BillingViewProps) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Daily Expenses</h2>
          <p className="text-gray-500 dark:text-gray-400">Tracking team expenditures for logistics and essentials.</p>
        </div>
        {(currentUser.role === 'project' || currentUser.role === 'owner' || currentUser.role === 'accounts') && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Log New Expense
          </button>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-gray-50 dark:bg-gray-800 rounded-2xl border dark:border-gray-700 shadow-inner"
          >
            <form className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8" onSubmit={e => { 
                e.preventDefault(); 
                const formData = new FormData(e.currentTarget);
                const newExp: Expense = {
                  id: Math.random().toString(36).substr(2, 9),
                  memberName: currentUser.name,
                  memberId: 'ID-'+currentUser.id.toUpperCase(),
                  timestamp: new Date().toLocaleString(),
                  mode: formData.get('mode') as any,
                  subMode: formData.get('subMode') as string,
                  amount: parseFloat(formData.get('amount') as string),
                  fileName: 'receipt.pdf',
                  userId: currentUser.id,
                  startLocation: formData.get('start') as string,
                  endLocation: formData.get('end') as string,
                };
                onAdd(newExp); 
                setShowAdd(false); 
              }}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Mode</label>
                <select name="mode" className="w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer font-bold">
                  <option value="Transport">Transport</option>
                  <option value="Meals">Meals</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Sub-mode</label>
                <input name="subMode" type="text" placeholder="e.g. Taxi, Uber, Lunch" className="w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Amount ($)</label>
                <input name="amount" type="number" placeholder="0.00" step="0.01" className="w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none font-mono font-bold text-blue-600" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Start Location</label>
                <input name="start" type="text" className="w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter">End Location</label>
                <input name="end" type="text" className="w-full bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-500 uppercase tracking-tighter">Bill Upload</label>
                <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-6 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 transition-all cursor-pointer" />
              </div>
              <div className="md:col-span-3 pt-4 flex gap-4">
                <button type="submit" className="bg-blue-600 text-white px-10 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-[0_4px_12px_rgba(37,99,235,0.3)]">Save Expense Record</button>
                <button type="button" onClick={() => setShowAdd(false)} className="bg-gray-200 dark:bg-gray-700 px-10 py-3 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 transition-all">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Identity</th>
                <th className="px-6 py-6">Mode Details</th>
                <th className="px-6 py-6">Geodata</th>
                <th className="px-6 py-6 text-right">Fiscal Value</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {items.map((e) => {
                 const canDelete = currentUser.role === 'owner' || e.userId === currentUser.id;
                 return (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-gray-700 dark:text-gray-200">{e.memberName}</span>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{e.memberId} • {e.timestamp}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded w-fit mb-1">{e.mode.toUpperCase()}</span>
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{e.subMode}</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-sm">
                      {e.startLocation ? (
                        <div className="flex flex-col gap-1 text-[11px] font-bold">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            <span className="text-gray-400">{e.startLocation}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            <span className="text-gray-400">{e.endLocation}</span>
                          </div>
                        </div>
                      ) : <span className="text-gray-300 dark:text-gray-600">—</span>}
                    </td>
                    <td className="px-6 py-6 text-right font-black text-lg text-blue-600 dark:text-blue-400">
                      ${e.amount.toFixed(2)}
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center justify-end gap-2">
                         <button className="p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl text-gray-400 hover:text-blue-600 transition-all" title="View Digital Receipt">
                           <FileText className="w-5 h-5" />
                         </button>
                         {canDelete && (
                            <button 
                              onClick={() => onDelete(e.id)}
                              title="Irreversible Delete"
                              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all md:opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                         )}
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
