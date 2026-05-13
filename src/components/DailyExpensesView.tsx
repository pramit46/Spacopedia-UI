import React, { useState } from 'react';
import { Plus, CheckCircle2, FileText, Trash2, X, Calculator, ExternalLink, MapPin, MessageSquare, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Expense } from '../mockData';

interface DailyExpensesViewProps {
  currentUser: User;
  items: Expense[];
  onDelete: (id: string) => void;
  onAdd: (e: Expense) => void;
}

export function DailyExpensesView({ currentUser, items, onDelete, onAdd }: DailyExpensesViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'Transport' | 'Meals' | 'Other'>('Transport');

  return (
    <div className="flex flex-col gap-10 font-sans p-4">
      <header className="flex justify-between items-end bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-xl shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest italic mb-2">
            <Calculator className="w-4 h-4" />
            <span>Operating Expenditures</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">OpEx Ledger</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Real-time team logistic overheads.</p>
        </div>
        {(currentUser.role === 'project' || currentUser.role === 'owner' || currentUser.role === 'accounts') && (
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            {showAdd ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAdd ? 'Close Registry' : 'Log Expenditure'}
          </button>
        )}
      </header>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <form className="bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-2xl space-y-10" onSubmit={e => { 
                e.preventDefault(); 
                const formData = new FormData(e.currentTarget);
                const file = formData.get('receipt') as File;
                const newExp: Expense = {
                  id: Math.random().toString(36).substr(2, 9),
                  memberName: currentUser.name,
                  memberId: 'ID-'+currentUser.id.toUpperCase(),
                  timestamp: new Date().toLocaleString(),
                  mode: selectedMode,
                  subMode: formData.get('subMode') as string,
                  amount: parseFloat(formData.get('amount') as string),
                  fileName: file?.name || 'receipt.pdf',
                  userId: currentUser.id,
                  startLocation: formData.get('start') as string,
                  endLocation: formData.get('end') as string,
                  comment: formData.get('comment') as string,
                };
                onAdd(newExp); 
                setShowAdd(false); 
              }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Categorization</label>
                  <select 
                    name="mode" 
                    value={selectedMode}
                    onChange={(e) => setSelectedMode(e.target.value as any)}
                    className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none font-black italic text-lg transition-all appearance-none cursor-pointer"
                  >
                    <option value="Transport">Transport</option>
                    <option value="Meals">Meals</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Sub-Classifier</label>
                  <input name="subMode" type="text" placeholder="e.g. Site Visit" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-lg" required />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Fiscal Volume</label>
                  <input name="amount" type="number" placeholder="₹0.00" step="0.01" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-4 focus:ring-2 focus:ring-blue-600 outline-none font-black italic text-2xl text-blue-600" required />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Verify Receipt</label>
                  <div className="relative group">
                    <input name="receipt" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-full bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 group-hover:border-blue-400 group-hover:text-blue-500 transition-all">
                      <Upload className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Attach Proof</span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedMode === 'Transport' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Point of Origin</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input name="start" type="text" placeholder="Start location" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-blue-600 outline-none font-bold" required />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Point of Arrival</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input name="end" type="text" placeholder="End location" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-2xl p-4 pl-12 focus:ring-2 focus:ring-blue-600 outline-none font-bold" required />
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic text-left block">Contextual Remarks</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <textarea name="comment" rows={2} placeholder="Add description about this expenditure..." className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[2rem] p-4 pl-12 focus:ring-2 focus:ring-blue-600 outline-none font-medium resize-none" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="bg-gray-900 dark:bg-blue-600 text-white px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl">
                  Inject to Ledger
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-8">Identity</th>
                <th className="px-6 py-8">Classification</th>
                <th className="px-6 py-8">Details & Geo-Data</th>
                <th className="px-6 py-8">Remarks</th>
                <th className="px-6 py-8 text-right">Volume</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {items.map((e) => {
                 const canDelete = currentUser.role === 'owner' || e.userId === currentUser.id;
                 return (
                  <tr key={e.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-900/40 transition-all">
                    <td className="px-10 py-8">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                           <FileText className="w-6 h-6" />
                         </div>
                         <div>
                           <p className="text-lg font-black italic tracking-tighter text-gray-800 dark:text-gray-100">{e.memberName}</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{e.memberId} • {e.timestamp.split(',')[0]}</p>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="space-y-1">
                        <span className="px-2.5 py-1 bg-gray-50 dark:bg-gray-900 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest block w-fit">
                          {e.mode}
                        </span>
                        <p className="text-sm font-bold text-gray-400 italic">{e.subMode}</p>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      {e.mode === 'Transport' ? (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <span className="opacity-50">From:</span> {e.startLocation}
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            <span className="opacity-50">To:</span> {e.endLocation}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic">Fixed location / N.A.</span>
                      )}
                    </td>
                    <td className="px-6 py-8">
                       <p className="text-xs font-medium text-gray-500 max-w-[200px] truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all">
                         {e.comment || '---'}
                       </p>
                    </td>
                    <td className="px-6 py-8 text-right">
                       <p className="text-2xl font-black italic text-blue-600">₹{e.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-6">
                         <a 
                           href={`#${e.fileName}`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:scale-105 active:scale-95 transition-all"
                         >
                           Receipt <ExternalLink className="w-3.5 h-3.5" />
                         </a>
                         {canDelete && (
                            <button 
                              onClick={() => onDelete(e.id)}
                              className="text-gray-300 hover:text-red-500 transition-all p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10"
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

