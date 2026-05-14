import React, { useState, useMemo, useRef } from 'react';
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
  MessageSquare,
  Upload,
  FileText,
  ExternalLink
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.size.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  const stats = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.finalPrice, 0);
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
    
    const discountPercentage = parseFloat(formData.get('discountPercentage') as string) || 0;
    const discountAmount = totalPrice * (discountPercentage / 100);
    const finalPrice = totalPrice - discountAmount;
    
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
      discountPercentage,
      discountAmount,
      finalPrice,
      vendorId: formData.get('vendorId') as string,
      approxDeliveryDate: formData.get('approxDeliveryDate') as string,
      invoiceRaised: formData.get('invoiceRaised') === 'on',
      invoiceFile: formData.get('invoiceFile') ? (formData.get('invoiceFile') as File).name : editingItem?.invoiceFile,
      paymentMade: paymentMade,
      pendingAmount: finalPrice - paymentMade,
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
    <div className="flex flex-col gap-10 font-sans p-4 w-full">
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
              className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-600 outline-none transition-all outline-none"
            />
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all outline-none"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        {[
          { label: 'Total Volume', value: stats.counts, sub: 'Units across items', color: 'blue', icon: Package },
          { label: 'Net Valuation', value: `₹${stats.total.toLocaleString()}`, sub: 'Estimated procurement cost (Post-Discount)', color: 'green', icon: DollarSign },
          { label: 'Settlement Needed', value: `₹${stats.pending.toLocaleString()}`, sub: 'Outstanding vendor balance', color: 'red', icon: AlertCircle }
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
      <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden mb-20 w-full">
        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1600px]">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                <th className="px-6 py-6 sticky left-0 bg-gray-50/50 dark:bg-gray-900 shadow-[2px_0_10px_rgba(0,0,0,0.05)] z-10 min-w-[240px]">Material Detail</th>
                <th className="px-6 py-6 border-l dark:border-gray-800">Qty</th>
                <th className="px-6 py-6 text-right">Unit Rate</th>
                <th className="px-6 py-6 text-right">Gross Price</th>
                <th className="px-6 py-6 text-right text-orange-600 bg-orange-50/20 dark:bg-orange-950/20">Disc %</th>
                <th className="px-6 py-6 text-right text-orange-600 bg-orange-50/20 dark:bg-orange-950/20">Disc Amt</th>
                <th className="px-6 py-6 text-right font-black text-blue-600 bg-blue-50/20 dark:bg-blue-950/20">Final Price</th>
                <th className="px-8 py-6 min-w-[220px]">Logistics & Vendor</th>
                <th className="px-6 py-6 min-w-[160px]">Audit Status</th>
                <th className="px-8 py-6 text-right sticky right-0 bg-white dark:bg-gray-950 shadow-[-2px_0_10px_rgba(0,0,0,0.05)] z-10 min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {filteredItems.map(item => {
                const vendor = vendors.find(v => v.id === item.vendorId);
                return (
                  <tr key={item.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-900/40 transition-all">
                    <td className="px-6 py-6 sticky left-0 bg-white dark:bg-gray-950 group-hover:bg-gray-50/30 dark:group-hover:bg-gray-900/40 shadow-[2px_0_10px_rgba(0,0,0,0.05)] z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="min-w-[180px]">
                          <p className="text-base font-black italic tracking-tighter leading-tight mb-0.5">{item.materialName}</p>
                          <div className="flex items-center gap-1.5">
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest whitespace-nowrap">Dim: {item.size}</span>
                             <span className="text-gray-200">|</span>
                             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{item.date}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 border-l dark:border-gray-800">
                      <div className="flex flex-col">
                        <span className="text-xl font-black italic tracking-tighter border-b border-blue-600/10 mb-0.5">{item.count}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">UNITS</span>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right font-bold text-gray-600 dark:text-gray-400 italic">
                      ₹{item.unitPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-6 text-right font-medium text-gray-400 line-through text-xs">
                      ₹{item.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-6 text-right bg-orange-50/10 dark:bg-orange-950/10">
                       <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-[10px] font-black rounded-lg">-{item.discountPercentage}%</span>
                    </td>
                    <td className="px-6 py-6 text-right bg-orange-50/10 dark:bg-orange-950/10 text-orange-600/70 italic font-bold">
                       ₹{item.discountAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-6 text-right bg-blue-50/10 dark:bg-blue-950/10">
                      <p className="text-3xl font-black italic text-blue-600 tracking-tighter drop-shadow-sm">₹{item.finalPrice.toLocaleString()}</p>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex flex-col gap-2 min-w-[180px]">
                         <div className="flex items-center gap-2">
                           <div className="w-6 h-6 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                             <Building2 className="w-3.5 h-3.5 text-gray-400" />
                           </div>
                           <span className="text-sm font-black italic tracking-tight text-gray-700 dark:text-gray-300">{vendor?.name || 'Unassigned'}</span>
                         </div>
                         <div className="flex items-center gap-2 ml-1">
                           <Calendar className="w-3.5 h-3.5 text-gray-300" />
                           <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">ETA: {item.approxDeliveryDate || 'UNSET'}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                       <div className="space-y-3 min-w-[140px]">
                         <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl w-fit ${item.invoiceRaised ? 'bg-green-50 dark:bg-green-900/10 text-green-600' : 'bg-orange-50 dark:bg-orange-900/10 text-orange-500'}`}>
                           {item.invoiceRaised ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                           <span className="text-[10px] font-black uppercase tracking-widest">{item.invoiceRaised ? 'Invoiced' : 'Pending'}</span>
                         </div>
                         <div className="flex flex-col gap-0.5 ml-1">
                           <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Balance</span>
                           <span className={`text-sm font-black italic tracking-tight ${item.pendingAmount > 0 ? 'text-red-500' : 'text-green-500'}`}>₹{item.pendingAmount.toLocaleString()}</span>
                         </div>
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right sticky right-0 bg-white dark:bg-gray-950 group-hover:bg-gray-50/30 dark:group-hover:bg-gray-900/40 shadow-[-2px_0_10px_rgba(0,0,0,0.05)] z-10">
                       <div className="flex items-center justify-end gap-2">
                          {item.invoiceFile && (
                            <button className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm" title="View Invoice">
                               <FileText className="w-5 h-5" />
                            </button>
                          )}
                          <button 
                            onClick={() => setEditingItem(item)}
                            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-400 hover:text-blue-600 transition-all outline-none"
                          >
                             <Edit3 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => setItemToDelete(item.id)}
                            className="p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-gray-400 hover:text-red-500 transition-all outline-none"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md overflow-y-auto">
             <motion.div 
               initial={{ scale: 0.95, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               exit={{ scale: 0.95, opacity: 0 }}
               className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-5xl my-auto overflow-hidden p-1 relative"
             >
                <div className="flex items-center justify-between p-10 border-b dark:border-gray-800 bg-white dark:bg-gray-950 sticky top-0 z-20">
                  <div>
                    <h3 className="text-3xl font-black italic tracking-tighter leading-none mb-1">
                      {editingItem ? 'Modify Registry' : 'New Material Entry'}
                    </h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Architectural Procurement Protocol</p>
                  </div>
                  <button 
                    onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                    className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 hover:text-red-500 transition-all outline-none"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form className="p-10 space-y-10" onSubmit={handleSave}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Material Nomenclature</label>
                        <input name="materialName" defaultValue={editingItem?.materialName} placeholder="e.g. Gurjan Plywood (18mm)" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Dimension Specification</label>
                        <input name="size" defaultValue={editingItem?.size} placeholder="e.g. 7ft x 3ft" className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" required />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Volume (Count)</label>
                        <input name="count" type="number" defaultValue={editingItem?.count} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Unit rate (₹)</label>
                        <input name="unitPrice" type="number" step="0.01" defaultValue={editingItem?.unitPrice} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] ml-4 italic">Disc %</label>
                        <input name="discountPercentage" type="number" step="0.1" defaultValue={editingItem?.discountPercentage || 0} className="w-full bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/50 rounded-2xl p-5 font-black text-orange-600 outline-none focus:ring-2 focus:ring-orange-500 transition-all outline-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Vendor Entity</label>
                        <select name="vendorId" defaultValue={editingItem?.vendorId} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all appearance-none cursor-pointer outline-none">
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
                        <input name="date" type="date" defaultValue={editingItem?.date || new Date().toISOString().split('T')[0]} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" required />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Delivery ETA</label>
                        <input name="approxDeliveryDate" type="date" defaultValue={editingItem?.approxDeliveryDate} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold outline-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Payment Executed (₹)</label>
                        <input name="paymentMade" type="number" step="0.01" defaultValue={editingItem?.paymentMade || 0} className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl p-5 font-bold text-green-600 outline-none focus:ring-2 focus:ring-blue-600 transition-all outline-none" />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end bg-gray-50/50 dark:bg-gray-900/50 p-8 rounded-[2rem] border dark:border-gray-800">
                     <label className="flex items-center gap-4 cursor-pointer group">
                        <input type="checkbox" name="invoiceRaised" defaultChecked={editingItem?.invoiceRaised} className="w-6 h-6 rounded-lg border-2 border-gray-300 text-blue-600 focus:ring-blue-600 outline-none" />
                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-600 dark:text-gray-400 group-hover:text-blue-600 transition-all italic">Invoice Successfully Raised</span>
                     </label>

                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] mb-1 italic">Voucher Attachment</p>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="flex items-center gap-3 bg-white dark:bg-gray-950 border-2 border-dashed dark:border-gray-800 p-4 rounded-xl cursor-pointer hover:border-blue-600 transition-all group"
                        >
                           <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 group-hover:text-blue-600">
                              <Upload className="w-5 h-5" />
                           </div>
                           <div className="flex-1 overflow-hidden">
                              <p className="text-sm font-bold truncate">
                                {editingItem?.invoiceFile || 'Upload Invoice PDF'}
                              </p>
                              <p className="text-[9px] font-medium text-gray-400 uppercase italic">Max Size 10MB</p>
                           </div>
                           <input ref={fileInputRef} type="file" name="invoiceFile" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4 italic">Material Remarks</label>
                    <textarea name="comment" defaultValue={editingItem?.comment} rows={3} placeholder="Add specific procurement details or vendor feedback..." className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-[2rem] p-6 font-medium outline-none focus:ring-2 focus:ring-blue-600 transition-all resize-none shadow-inner outline-none" />
                  </div>

                  <div className="flex gap-4 pt-4 sticky shadow-[-20px_0_30px_white] dark:shadow-[-20px_0_30px_#030712] z-10 bottom-0 bg-white dark:bg-gray-950 py-4">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all outline-none">
                      {editingItem ? 'Commit Changes' : 'Execute Registry'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => { setShowAddForm(false); setEditingItem(null); }}
                      className="px-12 bg-gray-100 dark:bg-gray-800 text-gray-500 rounded-[2.5rem] font-black text-xs uppercase tracking-widest hover:bg-gray-200 outline-none"
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
              className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-md overflow-hidden p-10 text-center shadow-red-600/5 dark:shadow-red-600/10"
            >
               <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-10 h-10 text-red-500" />
               </div>
               <h3 className="text-2xl font-black italic mb-3 tracking-tighter">Purge material record?</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed italic">This architectural asset will be permanently deleted from the procurement registry and budget inventory.</p>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => { onDelete(itemToDelete); setItemToDelete(null); }}
                    className="py-5 rounded-[2rem] bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 active:scale-95 transition-all outline-none"
                  >
                    Confirm Purge
                  </button>
                  <button 
                    onClick={() => setItemToDelete(null)}
                    className="py-5 rounded-[2rem] bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all outline-none"
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
