import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  X, 
  ExternalLink, 
  Upload, 
  ArrowUpDown, 
  FileText,
  Search,
  ChevronUp,
  ChevronDown
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

export function ClientPaymentsView({ 
  currentUser, 
  payments, 
  onAdd, 
  onDelete,
  projectId 
}: ClientPaymentsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);
  const [search, setSearch] = useState('');

  const filteredPayments = payments
    .filter(p => p.projectId === projectId)
    .filter(p => 
      p.tranche.toLowerCase().includes(search.toLowerCase()) || 
      p.description?.toLowerCase().includes(search.toLowerCase())
    );

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key] ?? '';
    const bValue = b[key] ?? '';

    if (key === 'amount') {
      return direction === 'asc' ? (aValue as number) - (bValue as number) : (bValue as number) - (aValue as number);
    }
    
    const sA = aValue.toString().toLowerCase();
    const sB = bValue.toString().toLowerCase();
    
    if (sA < sB) return direction === 'asc' ? -1 : 1;
    if (sA > sB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-blue-500" /> : <ChevronDown className="w-3 h-3 ml-1 text-blue-500" />;
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
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2 italic tracking-tight uppercase">Client Payments</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-tight">Institutional record of financial inflows and milestone settlements.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            placeholder="Filter by tranche or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
          />
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Log Payment Inflow
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr className="border-b dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-6 py-5">Index</th>
                <th className="px-6 py-5 cursor-pointer group" onClick={() => requestSort('date')}>
                  <div className="flex items-center">Execution Date <SortIcon column="date" /></div>
                </th>
                <th className="px-6 py-5 cursor-pointer group" onClick={() => requestSort('tranche')}>
                  <div className="flex items-center">Particulars <SortIcon column="tranche" /></div>
                </th>
                <th className="px-6 py-5 text-right cursor-pointer group" onClick={() => requestSort('amount')}>
                  <div className="flex items-center justify-end">Volume <SortIcon column="amount" /></div>
                </th>
                <th className="px-6 py-5 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {sortedPayments.map((p, idx) => (
                <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all">
                  <td className="px-6 py-5">
                    <span className="text-[10px] font-black text-gray-400">ID-{String(idx + 1).padStart(3, '0')}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm tracking-tight">{p.date}</span>
                      <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider">Fiscal Timestamp</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm italic tracking-tight">{p.tranche}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider line-clamp-1">{p.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-black text-blue-600 text-lg italic">
                    ₹{p.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5 text-right">
                    {p.attachment ? (
                      <a 
                        href={`#${p.attachment}`} 
                        className="inline-flex p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                        title="View Certificate"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="text-[9px] font-black uppercase text-gray-300">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[2.5rem] border dark:border-gray-800 shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-10 py-8 border-b dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black italic">Log Financial Inflow</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    System Entity: Project Ledger
                  </p>
                </div>
                <button onClick={() => setShowAdd(false)} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="p-10 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Payment Phase / Tranche</label>
                   <input name="tranche" required placeholder="e.g. Second Milestone Payment" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Execution Date</label>
                    <input name="date" type="date" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Fiscal Volume (₹)</label>
                    <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-black text-blue-600 outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Proof of Settlement</label>
                   <div className="relative group overflow-hidden">
                      <input name="attachment" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-900 group-hover:bg-gray-100 dark:group-hover:bg-gray-800/50 transition-all">
                        <Upload className="w-6 h-6 text-gray-400 mb-2 group-hover:text-blue-500" />
                        <span className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] group-hover:text-blue-500">Upload Transaction Receipt</span>
                      </div>
                   </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contextual Remarks</label>
                  <textarea name="description" rows={3} placeholder="Add specific details regarding this payment instrument..." className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-medium resize-none outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="submit" className="flex-1 py-5 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    Commit To Ledger
                  </button>
                  <button type="button" onClick={() => setShowAdd(false)} className="px-10 py-5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-xs uppercase tracking-widest">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
