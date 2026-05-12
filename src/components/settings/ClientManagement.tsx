import React, { useState } from 'react';
import { Users as UsersIcon, Search, Plus, Trash2, Edit2, X, Eye, EyeOff, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClientMaster } from '../../mockData';

interface ClientManagementProps {
  clients: ClientMaster[];
  setClients: React.Dispatch<React.SetStateAction<ClientMaster[]>>;
  canEdit: boolean;
}

export function ClientManagement({ clients, setClients, canEdit }: ClientManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [maskContact, setMaskContact] = useState(true);
  const [editingItem, setEditingItem] = useState<ClientMaster | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (!canEdit) return;
    if (!confirm('Are you sure you want to delete this client record?')) return;
    setClients(prev => prev.filter(c => c.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (isAddingItem) {
      const newItem = { ...data, id: Date.now().toString() } as ClientMaster;
      setClients(prev => [...prev, newItem]);
      setIsAddingItem(false);
    } else if (editingItem) {
      setClients(prev => prev.map(c => c.id === editingItem.id ? { ...c, ...data } as ClientMaster : c));
      setEditingItem(null);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2 italic">Client Database</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Manage project stakeholders and client contact matrices.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            placeholder="Filter clients..."
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
            New Client Record
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Client Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                   {canEdit && <span className="mr-4">Actions</span>}
                   <button 
                    onClick={() => setMaskContact(!maskContact)}
                    className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
                   >
                     {maskContact ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                     {maskContact ? 'View Info' : 'Mask Info'}
                   </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredClients.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{c.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium truncate max-w-[200px]" title={c.projectAddress}>
                      {c.projectAddress}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {maskContact ? c.contactNumber.replace(/(\+\d{2} )\d{5}/, '$1*****') : c.contactNumber}
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {maskContact ? c.email.replace(/(.{2}).+(@.+)/, '$1***$2') : c.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingItem(c)} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(c.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
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
                    {isAddingItem ? 'Register Client' : 'Modify Client Node'}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    System Entity: Client
                  </p>
                </div>
                <button onClick={() => { setIsAddingItem(false); setEditingItem(null); }} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Client Full Name</label>
                   <input name="name" defaultValue={editingItem?.name} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                     <input name="email" type="email" defaultValue={editingItem?.email} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                     <input name="contactNumber" defaultValue={editingItem?.contactNumber} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Site Address</label>
                   <textarea name="projectAddress" defaultValue={editingItem?.projectAddress} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
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
