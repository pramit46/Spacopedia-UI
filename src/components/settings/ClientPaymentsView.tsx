import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  X, 
  ExternalLink, 
  Upload, 
  ArrowUpDown, 
  FileText,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ProjectPayment } from '../../mockData';

interface ClientPaymentsViewProps {
  currentUser: User;
  payments: ProjectPayment[];
  onAdd: (payment: ProjectPayment) => void;
  onDelete: (id: string) => void;
  projectId: string;
}

type SortKey = 'date' | 'tranche' | 'amount';
type SortOrder = 'asc' | 'desc';

export function ClientPaymentsView({ 
  currentUser, 
  payments, 
  onAdd, 
  onDelete,
  projectId 
}: ClientPaymentsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [search, setSearch] = useState('');

  const filteredPayments = payments
    .filter(p => p.projectId === projectId)
    .filter(p => 
      p.tranche.toLowerCase().includes(search.toLowerCase()) || 
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (sortKey === 'amount') {
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      }
      
      valA = (valA as string).toLowerCase();
      valB = (valB as string).toLowerCase();
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get('attachment') as File;
    
    const newPayment: ProjectPayment = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: projectId,
      tranche: formData.get('tranche') as string,
      date: formData.get('date') as string,
      amount: parseFloat(formData.get('amount') as string),
      status: 'received',
      description: formData.get('description') as string,
      attachment: file?.name || undefined
    };
    
    onAdd(newPayment);
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col gap-10 font-sans">
      <header className="flex justify-between items-end bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest italic mb-2">
            <Database className="w-4 h-4" />
            <span>Master Registry</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">Client Payments</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Institutional record of project inflows</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-3 bg-gray-900 dark:bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Log Inflow
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Filter by tranche or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-[2rem] p-6 pl-14 focus:ring-2 focus:ring-blue-600 outline-none font-bold shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-8">No.</th>
                <th className="px-6 py-8 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => toggleSort('date')}>
                  <div className="flex items-center gap-2">
                    Execution Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-8 cursor-pointer hover:text-blue-600 transition-colors" onClick={() => toggleSort('tranche')}>
                  <div className="flex items-center gap-2">
                    Particulars <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-8 cursor-pointer hover:text-blue-600 transition-colors text-right" onClick={() => toggleSort('amount')}>
                  <div className="flex items-center justify-end gap-2">
                    Volume <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-10 py-8 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredPayments.map((p, idx) => (
                <tr key={p.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-900/40 transition-all text-gray-800 dark:text-gray-200">
                  <td className="px-10 py-8">
                    <span className="text-xs font-black text-gray-400">#{String(idx + 1).padStart(2, '0')}</span>
                  </td>
                  <td className="px-6 py-8 font-mono text-xs font-bold text-gray-400 italic">
                    {p.date}
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-lg font-black italic tracking-tighter">{p.tranche}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-right">
                    <p className="text-2xl font-black italic text-blue-600">₹{p.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {p.attachment ? (
                        <a 
                          href={`#${p.attachment}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all" 
                          title="Open Proof"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      ) : (
                        <span className="text-[9px] font-black uppercase text-gray-300">Pending</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <form onSubmit={handleAdd} className="p-10 space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-black italic">Log Client Inflow</h3>
                  <button type="button" onClick={() => setShowAdd(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Payment Phase / Tranche</label>
                    <input name="tranche" type="text" placeholder="e.g. Advance Payment" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-lg" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Execution Date</label>
                    <input name="date" type="date" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-blue-600 outline-none font-bold" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Fiscal Volume</label>
                    <input name="amount" type="number" step="0.01" placeholder="₹0.00" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-blue-600 outline-none font-black text-2xl text-blue-600" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Proof of Transfer</label>
                    <div className="relative group">
                      <input name="attachment" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[1.5rem] p-4 flex items-center justify-center gap-2 group-hover:border-blue-400 transition-all">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Select File</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Particulars / Remarks</label>
                  <textarea name="description" rows={3} placeholder="Add contextual notes regarding this instrument..." className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-blue-600 outline-none font-medium resize-none" />
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                  Commit to Registry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
