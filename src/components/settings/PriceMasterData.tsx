import React, { useState } from 'react';
import { Tag, Search, Plus, Trash2, Edit2, X, Save, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ComponentPrice, COMPONENT_PRICES } from '../objects/componentPrice';

export default function PriceMasterData() {
  const [prices, setPrices] = useState<ComponentPrice[]>(COMPONENT_PRICES);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ComponentPrice | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ComponentPrice; direction: 'asc' | 'desc' } | null>(null);

  const filteredPrices = prices.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key: keyof ComponentPrice) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedPrices = [...filteredPrices].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key];
    const bValue = b[key];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const sA = (aValue || '').toString().toLowerCase();
    const sB = (bValue || '').toString().toLowerCase();
    
    if (sA < sB) return direction === 'asc' ? -1 : 1;
    if (sA > sB) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }: { column: keyof ComponentPrice }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-blue-500" /> : <ChevronDown className="w-3 h-3 ml-1 text-blue-500" />;
  };

  const handleEdit = (price: ComponentPrice) => {
    setEditingId(price.id);
    setEditForm({ ...price });
  };

  const handleSave = () => {
    if (editForm) {
      setPrices(prev => prev.map(p => p.id === editForm.id ? editForm : p));
      setEditingId(null);
      setEditForm(null);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const newItem: ComponentPrice = {
      id: Date.now().toString(),
      name: formData.get('name') as string,
      type: formData.get('type') as any,
      unit: formData.get('unit') as string,
      rate: parseFloat(formData.get('rate') as string),
      city: formData.get('city') as string,
      state: formData.get('state') as string,
    };
    setPrices(prev => [...prev, newItem]);
    setIsAddingItem(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this component?')) {
      setPrices(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2 italic">Price & Material Master</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Unified database for civil, woodwork and hardware rates across various regions.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            placeholder="Filter components, materials or cities..."
            className="w-full bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button 
          onClick={() => setIsAddingItem(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          New Pricing Record
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th 
                  onClick={() => requestSort('name')}
                  className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Component <SortIcon column="name" />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('type')}
                  className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Type <SortIcon column="type" />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('unit')}
                  className="px-4 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center cursor-pointer group whitespace-nowrap"
                >
                  <div className="flex items-center justify-center">
                    Unit <SortIcon column="unit" />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('city')}
                  className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest cursor-pointer group whitespace-nowrap"
                >
                  <div className="flex items-center">
                    Location <SortIcon column="city" />
                  </div>
                </th>
                <th 
                  onClick={() => requestSort('rate')}
                  className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right cursor-pointer group whitespace-nowrap"
                >
                  <div className="flex items-center justify-end">
                    Rate (₹) <SortIcon column="rate" />
                  </div>
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {sortedPrices.map(price => (
                <tr key={price.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all">
                  <td className="px-6 py-5">
                    {editingId === price.id ? (
                      <input 
                        className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm font-bold"
                        value={editForm?.name}
                        onChange={e => setEditForm(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                      />
                    ) : (
                      <p className="font-bold text-gray-900 dark:text-gray-100">{price.name}</p>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {editingId === price.id ? (
                      <select 
                        className="w-full bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs font-bold"
                        value={editForm?.type}
                        onChange={e => setEditForm(prev => prev ? ({ ...prev, type: e.target.value as any }) : null)}
                      >
                        {['Civil', 'Woodwork', 'Electrical', 'Plumbing', 'Hardware', 'Other'].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        price.type === 'Civil' ? 'bg-orange-100 text-orange-700' :
                        price.type === 'Woodwork' ? 'bg-blue-100 text-blue-700' :
                        price.type === 'Hardware' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {price.type}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-5 text-center">
                    {editingId === price.id ? (
                      <input 
                        className="w-16 mx-auto bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-2 py-1.5 text-xs font-bold text-center"
                        value={editForm?.unit}
                        onChange={e => setEditForm(prev => prev ? ({ ...prev, unit: e.target.value }) : null)}
                      />
                    ) : (
                      <span className="text-xs font-black text-gray-500 uppercase">{price.unit}</span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    {editingId === price.id ? (
                      <div className="flex flex-col gap-1">
                        <input 
                          className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-2 py-1 text-[11px] font-bold"
                          value={editForm?.city}
                          placeholder="City"
                          onChange={e => setEditForm(prev => prev ? ({ ...prev, city: e.target.value }) : null)}
                        />
                        <input 
                          className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-2 py-1 text-[11px] font-bold"
                          value={editForm?.state}
                          placeholder="State"
                          onChange={e => setEditForm(prev => prev ? ({ ...prev, state: e.target.value }) : null)}
                        />
                      </div>
                    ) : (
                      <div>
                        <p className="text-xs font-bold">{price.city}</p>
                        <p className="text-[10px] font-medium text-gray-400 capitalize">{price.state}</p>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-5 text-right font-black text-blue-600 dark:text-blue-400">
                    {editingId === price.id ? (
                      <input 
                        type="number"
                        className="w-24 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg px-3 py-1.5 text-xs font-bold text-right"
                        value={editForm?.rate}
                        onChange={e => setEditForm(prev => prev ? ({ ...prev, rate: parseFloat(e.target.value) || 0 }) : null)}
                      />
                    ) : (
                      `₹${price.rate.toLocaleString()}`
                    )}
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {editingId === price.id ? (
                        <>
                          <button 
                            onClick={handleSave}
                            className="p-2 text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setEditingId(null)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button 
                            onClick={() => handleEdit(price)}
                            className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(price.id)}
                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
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
        {isAddingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[2.5rem] border dark:border-gray-800 shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-10 py-8 border-b dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black italic">Register New Component</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    System Entity: Material Pricing
                  </p>
                </div>
                <button onClick={() => setIsAddingItem(false)} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAdd} className="p-10 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Component Name</label>
                   <input name="name" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 19mm Plywood (Club Grade)" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                     <select name="type" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold">
                        <option value="Civil">Civil</option>
                        <option value="Woodwork">Woodwork</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Hardware">Hardware</option>
                        <option value="Other">Other</option>
                     </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                    <input name="unit" required placeholder="e.g. sq.ft" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                    <input name="city" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                    <input name="state" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rate (₹)</label>
                   <input name="rate" type="number" step="0.01" required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="submit" className="flex-1 py-5 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-[0.98] transition-transform">
                    Initialize Pricing Record
                  </button>
                  <button type="button" onClick={() => setIsAddingItem(false)} className="px-10 py-5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-xs uppercase tracking-widest">
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
