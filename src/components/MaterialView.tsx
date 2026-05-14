import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  X,
  ChevronDown,
  Calendar,
  Building2,
  DollarSign,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, MaterialInventoryItem, Vendor, VENDORS } from '../mockData';

interface MaterialViewProps {
  currentUser: User;
  items: MaterialInventoryItem[];
  onDelete: (id: string) => void;
  onUpdate: (item: MaterialInventoryItem) => void;
  onAdd: (item: MaterialInventoryItem) => void;
  vendors: Vendor[];
}

export function MaterialView({ 
  currentUser, 
  items, 
  onDelete, 
  onUpdate, 
  onAdd,
  vendors 
}: MaterialViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MaterialInventoryItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.size.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const stats = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const pending = items.reduce((sum, item) => sum + item.pendingAmount, 0);
    const counts = items.reduce((sum, item) => sum + item.count, 0);
    return { total, pending, counts };
  }, [items]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const count = parseInt(formData.get('count') as string) || 0;
    const unitPrice = parseFloat(formData.get('unitPrice') as string) || 0;
    const totalPrice = count * unitPrice;
    const paymentMade = parseFloat(formData.get('paymentMade') as string) || 0;

    const itemData: MaterialInventoryItem = {
      id: editingItem?.id || Math.random().toString(36).substr(2, 9),
      projectId: editingItem?.projectId || 'PROJ-2024-07-001',
      date: formData.get('date') as string,
      materialName: formData.get('materialName') as string,
      size: formData.get('size') as string,
      count: count,
      unitPrice: unitPrice,
      totalPrice: totalPrice,
      vendorId: formData.get('vendorId') as string,
      approxDeliveryDate: formData.get('approxDeliveryDate') as string,
      invoiceRaised: formData.get('invoiceRaised') === 'on',
      paymentMade: paymentMade,
      pendingAmount: totalPrice - paymentMade,
      comment: formData.get('comment') as string,
    };

    if (editingItem) {
      onUpdate(itemData);
      setEditingItem(null);
    } else {
      onAdd(itemData);
      setShowAddForm(false);
    }
  };

  return (
    <div className="flex flex-col gap-10 font-sans p-4">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-xl gap-6">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest italic mb-2">
            <Package className="w-4 h-4" />
            <span>Procurement Ledger</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">Material Inventory</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Aggregated resource tracking and vendor orchestration</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by material or dimension..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all"
            />
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Volume', value: stats.counts, sub: 'Units across items', color: 'blue', icon: Package },
          { label: 'Gross Valuation', value: `₹${stats.total.toLocaleString()}`, sub: 'Estimated procurement cost', color: 'green', icon: DollarSign },
          { label: 'Pending Settlement', value: `₹${stats.pending.toLocaleString()}`, sub: 'Unpaid vendor balance', color: 'red', icon: AlertCircle }
        ].map((s, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-950 p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${s.color}-500/5 rounded-full blur-2xl -mr-8 -mt-8`} />
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{s.label}</p>
              <s.icon className={`w-5 h-5 text-${s.color}-500`} />
            </div>
            <p className="text-3xl font-black italic tracking-tighter mb-1">{s.value}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Table Content */}
      <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1200px]">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <th className="px-8 py-6">Material Detail</th>
                <th className="px-6 py-6">Count</th>
                <th className="px-6 py-6 text-right">Unit Price</th>
                <th className="px-6 py-6 text-right">Total Price</th>
                <th className="px-8 py-6">Logistics & Vendor</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredItems.map(item => {
                const vendor = vendors.find(v => v.id === item.vendorId);
                return (
                  <tr key={item.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-900/40 transition-all">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                          <Package className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-lg font-black italic tracking-tighter leading-tight mb-1">{item.materialName}</p>
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Dim: {item.size}</span>
                             <span className="text-gray-200">|</span>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span className="text-2xl font-black italic tracking-tighter">{item.count}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase">Metric Units</span>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-right font-bold text-gray-600 dark:text-gray-400 italic">
                      ₹{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-8 text-right">
                      <p className="text-2xl font-black italic text-blue-600 tracking-tighter">₹{item.totalPrice.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-8">
                       <div className="flex flex-col gap-2">
                         <div className="flex items-center gap-2">
                           <Building2 className="w-3.5 h-3.5 text-gray-400" />
                           <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{vendor?.name || 'Unassigned'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                           <Calendar className="w-3.5 h-3.5 text-gray-400" />
                           <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">ETA: {item.approxDeliveryDate || 'N/A'}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-8">
                       <div className="space-y-2">
                         <div className="flex items-center gap-2">
                           {item.invoiceRaised ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Clock className="w-4 h-4 text-orange-400" />}
                           <span className="text-[10px] font-black uppercase tracking-widest">{item.invoiceRaised ? 'Invoiced' : 'Pending'}</span>
                         </div>
                         <div className="text-[10px] font-bold">
                           <span className="text-gray-400">Balance: </span>
                           <span className={item.pendingAmount > 0 ? 'text-red-500' : 'text-green-500'}>₹{item.pendingAmount.toLocaleString()}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-8 py-8 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setEditingItem(item)}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-blue-600 transition-all"
                          >
                             <Edit3 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setItemToDelete(item.id)}
                            className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-gray-400 hover:text-red-500 transition-all"
                          >
                             <Trash2 className="w-5 h-5" />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      <AnimatePresence>
        {(showAddForm || editingItem) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-4xl overflow-hidden p-1"
             >
                <div className="flex items-center justify-between p-10 border-b dark:border-gray-800">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter leading-none mb-1">
                      {editingItem ? 'Modify Registry' : 'New Material Entry'}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Technical Procurement Form</p>
                  </div>
                  <button 
                    onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 hover:text-red-500 transition-all"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form className="p-10 space-y-8" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Material Nomenclature</label>
                        <input name="materialName" defaultValue={editingItem?.materialName} placeholder="e.g. Gurjan Plywood (18mm)" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Dimension Specification</label>
                        <input name="size" defaultValue={editingItem?.size} placeholder="e.g. 7ft x 3ft" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all" required />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Volume (Count)</label>
                        <input name="count" type="number" defaultValue={editingItem?.count} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Unit rate (₹)</label>
                        <input name="unitPrice" type="number" step="0.01" defaultValue={editingItem?.unitPrice} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-600 transition-all" required />
                     </div>
                     <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Vendor Entity</label>
                        <select name="vendorId" defaultValue={editingItem?.vendorId} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer">
                            <option value="">Select Vendor...</option>
                            {vendors.map(v => (
                              <option key={v.id} value={v.id}>{v.name} ({v.type})</option>
                            ))}
                        </select>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Baseline Date</label>
                        <input name="date" type="date" defaultValue={editingItem?.date || new Date().toISOString().split('T')[0]} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Delivery ETA</label>
                        <input name="approxDeliveryDate" type="date" defaultValue={editingItem?.approxDeliveryDate} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Payment Executed (₹)</label>
                        <input name="paymentMade" type="number" step="0.01" defaultValue={editingItem?.paymentMade || 0} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold text-green-600 outline-none focus:ring-2 focus:ring-blue-600 transition-all" />
                     </div>
                  </div>

                  <div className="flex items-center gap-8 bg-gray-50/50 dark:bg-gray-900/50 p-6 rounded-2xl border dark:border-gray-800">
                     <label className="flex items-center gap-4 cursor-pointer group">
                        <input type="checkbox" name="invoiceRaised" defaultChecked={editingItem?.invoiceRaised} className="w-6 h-6 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-600" />
                        <span className="text-xs font-black uppercase tracking-[0.1em] text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-all italic">Invoice Successfully Raised</span>
                     </label>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Internal Remarks</label>
                    <textarea name="comment" defaultValue={editingItem?.comment} rows={3} placeholder="Add specific procurement details or vendor feedback..." className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-[2rem] p-6 font-medium outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none shadow-inner" />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all">
                      {editingItem ? 'Commit Changes' : 'Execute Registry'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="px-12 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-200"
                    >
                      Discard
                    </button>
                  </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
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
               <h3 className="text-2xl font-black italic mb-3 tracking-tighter">Purge material record?</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed italic">This architectural asset will be permanently deleted from the procurement registry and budget inventory.</p>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { onDelete(itemToDelete); setItemToDelete(null); }}
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
