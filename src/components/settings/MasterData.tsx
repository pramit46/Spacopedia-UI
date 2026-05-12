import React, { useState } from 'react';
import { 
  Building2, 
  Users as UsersIcon, 
  Package,
  HardHat,
  Search, 
  Plus, 
  Trash2, 
  Edit2, 
  X,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vendor, User, MaterialMaster, ManpowerMaster, ClientMaster } from '../../mockData';

interface MasterDataProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  materials: MaterialMaster[];
  setMaterials: React.Dispatch<React.SetStateAction<MaterialMaster[]>>;
  manpower: ManpowerMaster[];
  setManpower: React.Dispatch<React.SetStateAction<ManpowerMaster[]>>;
  clients: ClientMaster[];
  setClients: React.Dispatch<React.SetStateAction<ClientMaster[]>>;
  users: User[];
  canEdit: boolean;
}

type TabType = 'vendors' | 'clients' | 'materials' | 'manpower';

export function MasterData({ 
  vendors, 
  setVendors, 
  materials, 
  setMaterials, 
  manpower, 
  setManpower,
  clients,
  setClients,
  users, 
  canEdit 
}: MasterDataProps) {
  const [activeSubTab, setActiveSubTab] = useState<TabType>('vendors');
  const [searchTerm, setSearchTerm] = useState('');
  const [maskContact, setMaskContact] = useState(true);
  const [editingItem, setEditingItem] = useState<{ type: TabType; item: any } | null>(null);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    v.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredManpower = manpower.filter(mp => 
    mp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mp.skillLevel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mp.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (type: TabType, id: string) => {
    if (!canEdit) return;
    if (!confirm('Are you sure you want to delete this master record?')) return;

    if (type === 'vendors') setVendors(prev => prev.filter(v => v.id !== id));
    if (type === 'materials') setMaterials(prev => prev.filter(m => m.id !== id));
    if (type === 'manpower') setManpower(prev => prev.filter(mp => mp.id !== id));
    if (type === 'clients') setClients(prev => prev.filter(c => c.id !== id));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    if (isAddingItem) {
      const newItem = { ...data, id: Date.now().toString() };
      if (activeSubTab === 'vendors') setVendors(prev => [...prev, newItem as any]);
      if (activeSubTab === 'materials') setMaterials(prev => [...prev, { ...newItem, rate: Number(newItem.rate) } as any]);
      if (activeSubTab === 'manpower') setManpower(prev => [...prev, { ...newItem, ratePerDay: Number(newItem.ratePerDay) } as any]);
      if (activeSubTab === 'clients') setClients(prev => [...prev, newItem as any]);
      setIsAddingItem(false);
    } else if (editingItem) {
      if (activeSubTab === 'vendors') setVendors(prev => prev.map(v => v.id === editingItem.item.id ? { ...v, ...data } as any : v));
      if (activeSubTab === 'materials') setMaterials(prev => prev.map(m => m.id === editingItem.item.id ? { ...m, ...data, rate: Number(data.rate) } as any : m));
      if (activeSubTab === 'manpower') setManpower(prev => prev.map(mp => mp.id === editingItem.item.id ? { ...mp, ...data, ratePerDay: Number(data.ratePerDay) } as any : mp));
      if (activeSubTab === 'clients') setClients(prev => prev.map(c => c.id === editingItem.item.id ? { ...c, ...data } as any : c));
      setEditingItem(null);
    }
  };

  const renderTable = () => {
    switch (activeSubTab) {
      case 'vendors':
        return (
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Vendor & POC</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Type & Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Contact</th>
                {canEdit && <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredVendors.map(v => (
                <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold">{v.name}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">POC: {v.poc}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium">{v.type}</p>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest">{v.city}, {v.state}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <p className="text-sm font-mono">{v.contactNumber}</p>
                  </td>
                  {canEdit && (
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingItem({ type: 'vendors', item: v })} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('vendors', v.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'clients':
        return (
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
                      <button onClick={() => setEditingItem({ type: 'clients', item: c })} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('clients', c.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'materials':
        return (
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
                        <button onClick={() => setEditingItem({ type: 'materials', item: m })} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('materials', m.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'manpower':
        return (
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Trade & Skill</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Rate/Day (₹)</th>
                {canEdit && <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredManpower.map(mp => (
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
                        <button onClick={() => setEditingItem({ type: 'manpower', item: mp })} className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete('manpower', mp.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2 italic">Master Repository</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Holistic management of vendors, clients, materials, and specialized manpower.</p>
        </div>
        <div className="flex flex-wrap bg-white dark:bg-gray-900 p-1.5 rounded-2xl border dark:border-gray-800 shadow-sm overflow-hidden no-scrollbar overflow-x-auto">
          <button 
            onClick={() => setActiveSubTab('vendors')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'vendors' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Building2 className="w-4 h-4" />
            Vendors
          </button>
          <button 
            onClick={() => setActiveSubTab('clients')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'clients' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <UsersIcon className="w-4 h-4" />
            Clients
          </button>
          <button 
            onClick={() => setActiveSubTab('materials')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'materials' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Package className="w-4 h-4" />
            Materials
          </button>
          <button 
            onClick={() => setActiveSubTab('manpower')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeSubTab === 'manpower' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <HardHat className="w-4 h-4" />
            Manpower
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            placeholder={`Filter ${activeSubTab}...`}
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
            New {activeSubTab.slice(0, -1).toUpperCase()} Record
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <AnimatePresence mode="wait">
          <motion.div
             key={activeSubTab}
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.1 }}
             className="overflow-x-auto"
          >
            {renderTable()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* CRUD Modals */}
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
                    {isAddingItem ? 'Register Master' : 'Modify Record Node'}
                  </h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
                    System Entity: {activeSubTab}
                  </p>
                </div>
                <button onClick={() => { setIsAddingItem(false); setEditingItem(null); }} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-10 space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                {activeSubTab === 'vendors' && (
                  <>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Vendor Label</label>
                       <input name="name" defaultValue={editingItem?.item?.name} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Specialization</label>
                         <input name="type" defaultValue={editingItem?.item?.type} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">POC Name</label>
                         <input name="poc" defaultValue={editingItem?.item?.poc} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                         <input name="city" defaultValue={editingItem?.item?.city} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                         <input name="state" defaultValue={editingItem?.item?.state} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Number</label>
                       <input name="contactNumber" defaultValue={editingItem?.item?.contactNumber} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </>
                )}
                {activeSubTab === 'clients' && (
                  <>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Client Full Name</label>
                       <input name="name" defaultValue={editingItem?.item?.name} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                         <input name="email" type="email" defaultValue={editingItem?.item?.email} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-1">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Mobile</label>
                         <input name="contactNumber" defaultValue={editingItem?.item?.contactNumber} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Project Site Address</label>
                       <textarea name="projectAddress" defaultValue={editingItem?.item?.projectAddress} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]" />
                    </div>
                  </>
                )}
                {activeSubTab === 'materials' && (
                  <>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Material Name</label>
                       <input name="name" defaultValue={editingItem?.item?.name} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Category</label>
                        <select name="category" defaultValue={editingItem?.item?.category} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold">
                          <option>Civil</option>
                          <option>Electrical</option>
                          <option>Plumbing</option>
                          <option>Painting</option>
                          <option>Carpentry</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Unit</label>
                        <input name="unit" defaultValue={editingItem?.item?.unit} required placeholder="e.g. Bag, Kg, CFT" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                        <input name="city" defaultValue={editingItem?.item?.city} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                        <input name="state" defaultValue={editingItem?.item?.state} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                      </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rate per Unit (₹)</label>
                       <input name="rate" type="number" defaultValue={editingItem?.item?.rate} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                    </div>
                  </>
                )}
                {activeSubTab === 'manpower' && (
                  <>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trade/Designation</label>
                       <input name="type" defaultValue={editingItem?.item?.type} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Skill Level</label>
                       <select name="skillLevel" defaultValue={editingItem?.item?.skillLevel} className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold">
                          <option value="unskilled">Unskilled</option>
                          <option value="semi-skilled">Semi-skilled</option>
                          <option value="skilled">Skilled</option>
                          <option value="highly-skilled">Highly-skilled</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">City</label>
                        <input name="city" defaultValue={editingItem?.item?.city} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">State</label>
                        <input name="state" defaultValue={editingItem?.item?.state} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold" />
                      </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rate per Day (₹)</label>
                       <input name="ratePerDay" type="number" defaultValue={editingItem?.item?.ratePerDay} required className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </>
                )}

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
