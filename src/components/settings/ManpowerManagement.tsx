import React, { useState } from 'react';
import { HardHat, Search, Plus, Trash2, Edit2, X, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ManpowerMaster } from '../../mockData';

interface ManpowerManagementProps {
  manpower: ManpowerMaster[];
  setManpower: React.Dispatch<React.SetStateAction<ManpowerMaster[]>>;
  canEdit: boolean;
}

export function ManpowerManagement({ manpower, setManpower, canEdit }: ManpowerManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<ManpowerMaster | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ManpowerMaster; direction: 'asc' | 'desc' } | null>(null);

  const filteredManpower = manpower.filter(mp => 
    mp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mp.skillLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mp.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key: keyof ManpowerMaster) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedManpower = [...filteredManpower].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key] ?? '';
    const bValue = b[key] ?? '';
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const sA = aValue.toString().toLowerCase();
    const sB = bValue.toString().toLowerCase();
    
    if (sA < sB) return direction === 'asc' ? -1 : 1;
    if (sA > sB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }: { column: keyof ManpowerMaster }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-blue-500" /> : <ChevronDown className="w-3 h-3 ml-1 text-blue-500" />;
  };

  const handleDelete = (id: string) => {
    if (!canEdit) return;
    if (!confirm('Are you sure you want to delete this manpower record?')) return;
    setManpower(prev => prev.filter(mp => mp.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (isAddingItem) {
      const newItem = { ...data, id: Date.now().toString(), ratePerDay: Number(data.ratePerDay) } as ManpowerMaster;
      setManpower(prev => [...prev, newItem]);
      setIsAddingItem(false);
    } else if (editingItem) {
      setManpower(prev => prev.map(mp => mp.id === editingItem.id ? { ...mp, ...data, ratePerDay: Number(data.ratePerDay) } as ManpowerMaster : mp));
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2 italic">Manpower Master</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Coordinate specialized labor rates and availability nodes.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            placeholder="Filter manpower..."
            className="w-full bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {canEdit && (
          <button 
            onClick={() => setIsAddingItem(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Manpower Record
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th 
                  onClick={() => requestSort('type')}
                  className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group"
                >
                  <div className="flex items-center">
                    Trade & Skill <SortIcon column="type" />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('city')}
                  className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group"
                >
                  <div className="flex items-center">
                    Location <SortIcon column="city" />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('ratePerDay')}
                  className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center cursor-pointer group"
                >
                  <div className="flex items-center justify-center">
                    Rate/Day (₹) <SortIcon column="ratePerDay" />
                  </div>
                </th>
                {canEdit && <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {sortedManpower.map(mp => (
                <tr key={mp.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{mp.type}</p>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                      mp.skillLevel === 'highly-skilled' ? 'bg-purple-50 text-purple-600' :
                      mp.skillLevel === 'skilled' ? 'bg-green-50 text-green-600' :
                      mp.skillLevel === 'semi-skilled' ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-600'
                    }`}>
                      {mp.skillLevel.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{mp.city}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{mp.state}</p>
                  </td>
                  <td className="px-6 py-4 text-center font-black text-blue-600 dark:text-blue-400">₹{mp.ratePerDay}</td>
                  {canEdit && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingItem(mp)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(mp.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {(isAddingItem || editingItem) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[2.5rem] border dark:border-gray-800 shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-10 py-8 border-b dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black italic">
                    {isAddingItem ? 'Register Manpower' : 'Modify Manpower Node'}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    System Entity: Manpower
                  </p>
                </div>
                <button onClick={() => { setIsAddingItem(false); setEditingItem(null); }} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trade/Designation</label>
                   <input name="type" defaultValue={editingItem?.type} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Skill Level</label>
                   <select name="skillLevel" defaultValue={editingItem?.skillLevel} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold">
                      <option value="unskilled">Unskilled</option>
                      <option value="semi-skilled">Semi-skilled</option>
                      <option value="skilled">Skilled</option>
                      <option value="highly-skilled">Highly-skilled</option>
                   </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                    <input name="city" defaultValue={editingItem?.city} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                    <input name="state" defaultValue={editingItem?.state} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rate per Day (₹)</label>
                   <input name="ratePerDay" type="number" defaultValue={editingItem?.ratePerDay} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="submit" className="flex-1 py-5 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-[0.98] transition-transform">
                    {editingItem ? 'Update Hub Node' : 'Initialize Record'}
                  </button>
                  <button type="button" onClick={() => { setIsAddingItem(false); setEditingItem(null); }} className="px-10 py-5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-xs uppercase tracking-widest">
                    Discard
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
