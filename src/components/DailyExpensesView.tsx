import React, { useState } from 'react';
import { Plus, CheckCircle2, FileText, Trash2, X, Calculator, ExternalLink, MapPin, MessageSquare, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from './objects/user';
import { DailyExpense } from './objects/dailyExpense';

interface DailyExpensesViewProps {
  currentUser: User;
  items: DailyExpense[];
  onDelete: (id: string) => void;
  onAdd: (e: DailyExpense) => void;
  project_id: string;
}

export function DailyExpensesView({ currentUser, items, onDelete, onAdd, project_id }: DailyExpensesViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'Transport' | 'Meals' | 'Other'>('Transport');
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredItems = items.filter(e => e.project_id === project_id);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

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
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Project: {project_id}</p>
        </div>
        {(currentUser.role === 'project' || currentUser.role === 'owner' || currentUser.role === 'accounts') && (
          <button 
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            Log Expenditure
          </button>
        )}
      </header>

      <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-8">#</th>
                <th className="px-6 py-8">Identity</th>
                <th className="px-6 py-8">Classification</th>
                <th className="px-6 py-8">Details & Geo-Data</th>
                <th className="px-6 py-8">Remarks</th>
                <th className="px-6 py-8">Volume</th>
                <th className="px-10 py-8 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredItems.map((e, index) => {
                 const canDelete = currentUser.role === 'owner' || e.userId === currentUser.id;
                 const [date, time] = e.timestamp.includes(' ') ? e.timestamp.split(' ') : [e.timestamp, 'N.A.'];
                 return (
                  <tr key={e.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-900/40 transition-all">
                    <td className="px-10 py-8">
                       <span className="text-[10px] font-black text-gray-400">#{String(index + 1).padStart(2, '0')}</span>
                    </td>
                    <td className="px-6 py-8">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                           <FileText className="w-6 h-6" />
                         </div>
                         <div>
                           <p className="text-xl font-black italic tracking-tighter leading-none mb-1">{e.memberName}</p>
                           <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-normal">
                             {e.memberId} • <br/>
                             {date} <br/>
                             {time}
                           </p>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="space-y-2">
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block w-fit">
                          {e.mode}
                        </span>
                        <p className="text-lg font-black italic text-gray-400 leading-tight">
                           {e.subMode}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      {e.mode === 'Transport' ? (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                            <span className="opacity-50 text-[10px] uppercase font-black tracking-widest shrink-0">From:</span>
                            <span className="font-black italic text-gray-600 dark:text-gray-300">{e.startLocation}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="opacity-50 text-[10px] uppercase font-black tracking-widest shrink-0">To:</span> 
                            <span className="font-black italic text-gray-600 dark:text-gray-300">{e.endLocation}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 font-black italic tracking-tight">Fixed location / <br/>N.A.</span>
                      )}
                    </td>
                    <td className="px-6 py-8">
                       <p className="text-xs font-medium text-gray-500 max-w-[200px] leading-relaxed">
                         {e.comment || '---'}
                       </p>
                    </td>
                    <td className="px-6 py-8">
                       <p className="text-3xl font-black italic text-blue-600 leading-none tracking-tighter">₹{e.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="flex items-center justify-end gap-6">
                         <a 
                           href={`#${e.fileName}`} 
                           target="_blank" 
                           rel="noreferrer"
                           className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:scale-105 active:scale-95 transition-all"
                         >
                           RECEIPT <ExternalLink className="w-3.5 h-3.5" />
                         </a>
                         {canDelete && (
                            <button 
                              onClick={() => handleDeleteClick(e.id)}
                              className="text-gray-200 group-hover:text-red-500 transition-all p-2"
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

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-4xl overflow-hidden p-1"
            >
              <div className="flex items-center justify-between p-10 border-b dark:border-gray-800">
                <div>
                  <h3 className="text-3xl font-black italic tracking-tighter leading-none mb-1">New Expenditure Registry</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Protocol: OpEx Authorization Form</p>
                </div>
                <button 
                  onClick={() => setShowAdd(false)}
                  className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 hover:text-red-500 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form className="p-10 space-y-10" onSubmit={e => { 
                  e.preventDefault(); 
                  const formData = new FormData(e.currentTarget);
                  const file = formData.get('receipt') as File;
                  const newExp: DailyExpense = {
                    id: Math.random().toString(36).substr(2, 9),
                    project_id: project_id,
                    memberName: currentUser.name,
                    memberId: 'EMP' + currentUser.id.slice(-3).toUpperCase(),
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
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Categorization</label>
                    <select 
                      name="mode" 
                      value={selectedMode}
                      onChange={(e) => setSelectedMode(e.target.value as any)}
                      className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 focus:ring-2 focus:ring-blue-600 outline-none font-black italic text-lg transition-all appearance-none cursor-pointer"
                    >
                      <option value="Transport">Transport</option>
                      <option value="Meals">Meals</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Sub-Classifier</label>
                    <input name="subMode" type="text" placeholder="e.g. Taxi / Lunch" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-lg" required />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Fiscal Volume</label>
                    <input name="amount" type="number" placeholder="₹0.00" step="0.01" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 focus:ring-2 focus:ring-blue-600 outline-none font-black italic text-2xl text-blue-600" required />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Verify Receipt</label>
                    <div className="relative group overflow-hidden">
                      <input name="receipt" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="h-[68px] w-full bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex items-center justify-center gap-2 text-gray-400 group-hover:border-blue-400 group-hover:text-blue-500 transition-all">
                        <Upload className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Attach Proof</span>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedMode === 'Transport' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Point of Origin</label>
                      <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input name="start" type="text" placeholder="Start location..." className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 pl-14 focus:ring-2 focus:ring-blue-600 outline-none font-bold" required />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Point of Arrival</label>
                      <div className="relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input name="end" type="text" placeholder="End location..." className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 pl-14 focus:ring-2 focus:ring-blue-600 outline-none font-bold" required />
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic block ml-4">Contextual Remarks</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-6 top-6 w-5 h-5 text-gray-400" />
                    <textarea name="comment" rows={3} placeholder="Add description about this expenditure instrument..." className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] p-6 pl-14 focus:ring-2 focus:ring-blue-600 outline-none font-medium resize-none shadow-inner" />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="flex-1 bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-blue-600/30">
                    Inject to Ledger
                  </button>
                  <button type="button" onClick={() => setShowAdd(false)} className="px-12 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-md overflow-hidden p-10 text-center"
            >
               <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-10 h-10 text-red-500" />
               </div>
               <h3 className="text-2xl font-black italic mb-3 tracking-tighter">Purge expenditure record?</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed italic">This architectural record will be permanently deleted from the OpEx ledger and budget calculations.</p>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={confirmDelete}
                    className="py-5 rounded-[2rem] bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 active:scale-95 transition-all"
                  >
                    Confirm Purge
                  </button>
                  <button 
                    onClick={() => setItemToDelete(null)}
                    className="py-5 rounded-[2rem] bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all"
                  >
                    Retain record
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

