import React, { useState } from 'react';
import { 
  List, 
  Plus, 
  X, 
  ExternalLink, 
  Upload, 
  ArrowUpDown, 
  FileText,
  Search,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, ProjectCostItem, Vendor } from '../../mockData';

interface VendorSettlementsViewProps {
  currentUser: User;
  costs: ProjectCostItem[];
  vendors: Vendor[];
  onAdd: (cost: ProjectCostItem) => void;
  onDelete: (id: string) => void;
  projectId: string;
}

type SortKey = 'date' | 'amount' | 'vendorId';
type SortOrder = 'asc' | 'desc';

export function VendorSettlementsView({ 
  currentUser, 
  costs, 
  vendors,
  onAdd, 
  onDelete,
  projectId 
}: VendorSettlementsViewProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [search, setSearch] = useState('');

  const filteredCosts = costs
    .filter(c => c.projectId === projectId)
    .filter(c => {
      const vendorName = vendors.find(v => v.id === c.vendorId)?.name || '';
      return (
        c.description.toLowerCase().includes(search.toLowerCase()) || 
        c.section.toLowerCase().includes(search.toLowerCase()) ||
        vendorName.toLowerCase().includes(search.toLowerCase())
      );
    })
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
    
    const newCost: ProjectCostItem = {
      id: Math.random().toString(36).substr(2, 9),
      projectId: projectId,
      section: formData.get('section') as 'Civil' | 'Electrical' | 'Plumbing' | 'Carpentry' | 'Painting' | 'Design' | 'Other',
      vendorId: formData.get('vendorId') as string,
      date: formData.get('date') as string,
      amount: parseFloat(formData.get('amount') as string),
      status: 'Paid',
      description: formData.get('description') as string,
      attachment: file?.name || undefined
    };
    
    onAdd(newCost);
    setShowAdd(false);
  };

  return (
    <div className="flex flex-col gap-10 font-sans">
      <header className="flex justify-between items-end bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-green-600 uppercase tracking-widest italic mb-2">
            <List className="w-4 h-4" />
            <span>Master Registry</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">Vendor Settlements</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Audit trail for contractor disbursements</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-3 bg-gray-900 dark:bg-green-600 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl"
        >
          <Plus className="w-5 h-5" />
          Log Settlement
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Filter by vendor, task or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-[2rem] p-6 pl-14 focus:ring-2 focus:ring-green-600 outline-none font-bold shadow-sm"
        />
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-8">No.</th>
                <th className="px-6 py-8 cursor-pointer hover:text-green-600 transition-colors" onClick={() => toggleSort('date')}>
                  <div className="flex items-center gap-2">
                    Settlement Date <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-8 cursor-pointer hover:text-green-600 transition-colors" onClick={() => toggleSort('vendorId')}>
                  <div className="flex items-center gap-2">
                    Vendor Entity <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-6 py-8">Particulars</th>
                <th className="px-6 py-8 cursor-pointer hover:text-green-600 transition-colors text-right" onClick={() => toggleSort('amount')}>
                  <div className="flex items-center justify-end gap-2">
                    Transfer <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="px-10 py-8 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredCosts.map((c, idx) => {
                const vendor = vendors.find(v => v.id === c.vendorId);
                return (
                  <tr key={c.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-900/40 transition-all text-gray-800 dark:text-gray-200">
                    <td className="px-10 py-8">
                      <span className="text-xs font-black text-gray-400">#{String(idx + 1).padStart(2, '0')}</span>
                    </td>
                    <td className="px-6 py-8 font-mono text-xs font-bold text-gray-400 italic">
                      {c.date}
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                          <Users className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-black italic tracking-tight">{vendor?.name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div>
                        <p className="text-sm font-black text-gray-700 dark:text-gray-300">{c.description}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider italic">{c.section}</p>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-right">
                      <p className="text-2xl font-black italic text-green-600">₹{c.amount.toLocaleString()}</p>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {c.attachment ? (
                          <a 
                            href={`#${c.attachment}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-green-600 hover:text-white rounded-xl transition-all" 
                            title="Open Invoice"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        ) : (
                          <span className="text-[9px] font-black uppercase text-gray-300">Pending</span>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <form onSubmit={handleAdd} className="p-10 space-y-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-3xl font-black italic text-green-600 uppercase tracking-tighter">Log Disbursement</h3>
                  <button type="button" onClick={() => setShowAdd(false)} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-2xl transition-all">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Select Vendor Entity</label>
                    <select name="vendorId" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-green-600 outline-none font-bold text-lg" required>
                      <option value="">Choose Vendor...</option>
                      {vendors.map(v => (
                        <option key={v.id} value={v.id}>{v.name}</option> // Fixed: Using v.id as value
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Settlement Date</label>
                    <input name="date" type="date" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-green-600 outline-none font-bold" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Disbursed Volume</label>
                    <input name="amount" type="number" step="0.01" placeholder="₹0.00" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-green-600 outline-none font-black text-2xl text-green-600" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Work Category/Section</label>
                    <select name="section" className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-green-600 outline-none font-bold text-lg" required>
                      <option value="Civil">Civil</option>
                      <option value="Electrical">Electrical</option>
                      <option value="Plumbing">Plumbing</option>
                      <option value="Carpentry">Carpentry</option>
                      <option value="Painting">Painting</option>
                      <option value="Design">Design</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Proof of Settlement (Invoice)</label>
                    <div className="relative group">
                      <input name="attachment" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                      <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-[1.5rem] p-4 flex items-center justify-center gap-2 group-hover:border-green-400 transition-all">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Select Invoice File</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Technical Details / Scope</label>
                  <textarea name="description" rows={3} placeholder="Add contextual notes regarding this settlement..." className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-green-600 outline-none font-medium resize-none" />
                </div>

                <button type="submit" className="w-full bg-green-600 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-green-600/20 active:scale-95 transition-all">
                  Execute Master Settlement
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
