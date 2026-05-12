import React, { useState } from 'react';
import { Package, Search, Plus, Trash2, Edit2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MaterialMaster } from '../../mockData';

interface MaterialManagementProps {
  materials: MaterialMaster[];
  setMaterials: React.Dispatch<React.SetStateAction<MaterialMaster[]>>;
  canEdit: boolean;
}

export function MaterialManagement({ materials, setMaterials, canEdit }: MaterialManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<MaterialMaster | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!canEdit) return;
    if (!confirm('Are you sure you want to delete this material record?')) return;
    setMaterials(prev => prev.filter(m => m.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (isAddingItem) {
      const newItem = { ...data, id: Date.now().toString(), rate: Number(data.rate) } as MaterialMaster;
      setMaterials(prev => [...prev, newItem]);
      setIsAddingItem(false);
    } else if (editingItem) {
      setMaterials(prev => prev.map(m => m.id === editingItem.id ? { ...m, ...data, rate: Number(data.rate) } as MaterialMaster : m));
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2 italic">Material Inventory Master</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Standardize material rates, units, and categories across regions.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            placeholder="Filter materials..."
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
            New Material Record
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Material & Category</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Unit/Rate</th>
                {canEdit && <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredMaterials.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{m.name}</p>
                    <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[9px] font-black uppercase text-gray-500">
                       {m.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-300">{m.city}</p>
                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{m.state}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-xs text-gray-500">{m.unit}</p>
                    <p className="font-black text-blue-600 dark:text-blue-400">₹{m.rate}</p>
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingItem(m)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(m.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
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
                    {isAddingItem ? 'Register Material' : 'Modify Material Node'}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    System Entity: Material
                  </p>
                </div>
                <button onClick={() => { setIsAddingItem(false); setEditingItem(null); }} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Material Name</label>
                   <input name="name" defaultValue={editingItem?.name} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <select name="category" defaultValue={editingItem?.category} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold">
                      <option>Civil</option>
                      <option>Electrical</option>
                      <option>Plumbing</option>
                      <option>Painting</option>
                      <option>Carpentry</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                    <input name="unit" defaultValue={editingItem?.unit} required placeholder="e.g. Bag, Kg, CFT" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                  </div>
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
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rate per Unit (₹)</label>
                   <input name="rate" type="number" defaultValue={editingItem?.rate} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
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
