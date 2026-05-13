import React, { useState } from 'react';
import { 
  Star, 
  Package, 
  AlertCircle,
  ChevronDown,
  LayoutDashboard,
  FileText,
  ChevronUp,
  Maximize2,
  X,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
} from 'recharts';
import { 
  User, 
  ProjectPayment, 
  ProjectCostItem, 
  Vendor 
} from '../mockData';

interface AccountsViewProps {
  currentUser: User;
  payments: ProjectPayment[];
  costs: ProjectCostItem[];
  vendors: Vendor[];
  projectId: string;
  darkMode?: boolean;
}

export function AccountsView({ 
  currentUser, 
  payments: allPayments, 
  costs: allCosts, 
  vendors: allVendors,
  projectId,
  darkMode = false
}: AccountsViewProps) {
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<ProjectPayment | null>(null);

  const payments = allPayments.filter(p => p.projectId === projectId);
  const costs = allCosts.filter(c => c.projectId === projectId);
  const projectVendorIds = new Set(costs.map(c => c.vendorId));
  const vendors = allVendors.filter(v => projectVendorIds.has(v.id));

  const totalProjectValue = costs.reduce((sum, item) => sum + item.amount, 0);
  const totalCollected = payments.filter(p => p.status === 'received').reduce((sum, p) => sum + p.amount, 0);
  const clientBalance = Math.max(0, totalProjectValue - totalCollected);
  const totalPaidToVendors = costs.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.amount, 0);
  
  const costBySection = costs.reduce((acc, item) => {
    acc[item.section] = (acc[item.section] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(costBySection).map(([name, value]) => ({ name, value }));
  const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a', '#4f46e5', '#9333ea'];

  const timechartData = [...payments]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, p) => {
      const lastVal = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
      acc.push({
        date: p.date,
        amount: p.amount,
        cumulative: lastVal + (p.status === 'received' ? p.amount : 0)
      });
      return acc;
    }, [] as any[]);

  const DetailModal = ({ title, data, onClose }: { title: string; data: any[]; onClose: () => void }) => (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-950 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-8 border-b dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
          <div>
            <h3 className="text-2xl font-black italic tracking-tight">{title}</h3>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Detailed Ledger Account</p>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] border-b dark:border-gray-800">
                <th className="px-8 py-6">Execution Date</th>
                <th className="px-8 py-6">Particulars / Description</th>
                <th className="px-6 py-6 text-right">Fiscal Value</th>
                <th className="px-8 py-6 text-right">Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {data.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/10 transition-colors">
                  <td className="px-8 py-6 text-xs font-bold text-gray-400 font-mono italic">{item.date}</td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{item.description || item.tranche || 'General Settlement'}</p>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <p className="text-lg font-black italic text-blue-600">₹{item.amount.toLocaleString()}</p>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {item.attachment ? (
                      <a 
                        href={`#${item.attachment}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:scale-110 transition-transform inline-block"
                      >
                        <ExternalLink className="w-5 h-5" />
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
      </motion.div>
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-10 font-sans p-4">
      <header className="flex justify-between items-end bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-xl shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest italic mb-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>Financial Overview</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">Project Accounting</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Resource allocation for {projectId}</p>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Collection Status</p>
           <p className="text-4xl font-black italic text-blue-600">{Math.round((totalCollected/totalProjectValue)*100)}%</p>
        </div>
      </header>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[
          { label: 'Total Project Value', val: totalProjectValue, color: 'text-gray-900', icon: Package },
          { label: 'Amount Collected', val: totalCollected, color: 'text-green-600', icon: Star },
          { label: 'Client Balance', val: clientBalance, color: 'text-red-500', icon: AlertCircle },
          { label: 'Registered Vendors', val: vendors.length, color: 'text-blue-600', icon: Star, raw: true },
          { label: 'Paid to Vendors', val: totalPaidToVendors, color: 'text-yellow-600', icon: AlertCircle }
        ].map((m, i) => (
          <div key={i} className="bg-white dark:bg-gray-950 p-8 rounded-[2.5rem] border dark:border-gray-800 shadow-sm">
             <div className="flex justify-between items-start mb-6">
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{m.label}</p>
                <div className={`w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center ${m.color}`}>
                  <m.icon className="w-4 h-4" />
                </div>
             </div>
             <p className={`text-2xl font-black italic ${m.color} dark:text-white`}>
               {m.raw ? m.val : `₹${m.val.toLocaleString()}`}
             </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Analytics Section */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black italic tracking-tight uppercase">Cumulative Collections</h3>
            <div className="flex gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-blue-600" />
                 <span className="text-[9px] font-bold uppercase text-gray-400">Total Inflow</span>
               </div>
            </div>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timechartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  tickFormatter={(val) => `₹${(val / 1000)}k`}
                />
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: darkMode ? '#111827' : '#fff' }} />
                <Area type="monotone" dataKey="cumulative" stroke="#2563eb" fillOpacity={1} fill="url(#colorAcc)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Breakdown Card */}
        <div className="bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-sm flex flex-col">
          <h3 className="text-xl font-black italic tracking-tight uppercase mb-8">Area-wise Budget</h3>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                  {pieData.map((e, i) => ( <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} /> ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: darkMode ? '#111827' : '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4 mt-8">
             {pieData.slice(0, 4).map((p, i) => (
                <div key={i} className="flex justify-between items-center">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-[10px] font-black uppercase text-gray-500 tracking-widest">{p.name}</span>
                   </div>
                   <span className="text-xs font-bold italic">₹{p.value.toLocaleString()}</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8 pb-20">
        {/* Client Payments Section */}
        <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
           <div className="p-10 border-b dark:border-gray-800 flex justify-between items-center">
             <h3 className="text-xl font-black italic tracking-tight uppercase">Client Payment History</h3>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl border dark:border-gray-800">Primary Ledger</span>
           </div>
           <div className="overflow-x-auto p-2 scrollbar-hide flex-1">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b dark:border-gray-800">
                   <th className="px-8 py-6">Payment Phase</th>
                   <th className="px-6 py-6">Date</th>
                   <th className="px-6 py-6 text-right">Amount</th>
                   <th className="px-8 py-6 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y dark:divide-gray-800">
                 {payments.map((p) => (
                   <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-all group">
                     <td className="px-8 py-8">
                       <span className="text-lg font-black italic text-gray-800 dark:text-gray-200">{p.tranche}</span>
                     </td>
                     <td className="px-6 py-8 text-xs font-bold text-gray-400">{p.date}</td>
                     <td className="px-6 py-8 text-right">
                       <span className="text-xl font-black italic text-blue-600">₹{p.amount.toLocaleString()}</span>
                     </td>
                     <td className="px-8 py-8 text-right">
                       <div className="flex items-center justify-end gap-4">
                         <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                           p.status === 'received' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                         }`}>
                           {p.status}
                         </span>
                         <button 
                            onClick={() => setSelectedPayment(p)}
                            className="p-2 text-gray-300 hover:text-blue-600 transition-all rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                          >
                           <Maximize2 className="w-4 h-4" />
                         </button>
                       </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Vendor Payments Section */}
        <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden flex flex-col">
           <div className="p-10 border-b dark:border-gray-800 flex justify-between items-center">
             <h3 className="text-xl font-black italic tracking-tight uppercase">Vendor Settlement Logs</h3>
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900 px-4 py-2 rounded-xl border dark:border-gray-800">Secondary Ledger</span>
           </div>
           <div className="overflow-x-auto p-2 scrollbar-hide flex-1">
             <table className="w-full text-left">
               <thead>
                 <tr className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] border-b dark:border-gray-800">
                   <th className="px-8 py-6">Vendor Entity</th>
                   <th className="px-6 py-6">Focus Area</th>
                   <th className="px-6 py-6 text-right">Paid Volume</th>
                   <th className="px-8 py-6 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y dark:divide-gray-800">
                 {vendors.map((vendor) => {
                    const vendorCosts = costs.filter(c => c.vendorId === vendor.id);
                    const paid = vendorCosts.filter(c => c.status === 'Paid').reduce((s, c) => s + c.amount, 0);
                    return (
                      <tr key={vendor.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all group">
                        <td className="px-8 py-8">
                          <span className="text-lg font-black italic text-gray-800 dark:text-gray-200">{vendor.name}</span>
                        </td>
                        <td className="px-6 py-8">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{vendor.type}</span>
                        </td>
                        <td className="px-6 py-8 text-right">
                          <span className="text-xl font-black italic text-green-600">₹{paid.toLocaleString()}</span>
                        </td>
                        <td className="px-8 py-8 text-right">
                           <div className="flex items-center justify-end gap-4">
                             <span className="text-[10px] font-black italic text-gray-300 uppercase tracking-widest">Archive</span>
                             <button 
                                onClick={() => setSelectedVendor(vendor)}
                                className="p-2 text-gray-300 hover:text-blue-600 transition-all rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              >
                               <Maximize2 className="w-4 h-4" />
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
      </div>

      <AnimatePresence>
        {selectedVendor && (
          <DetailModal 
            title={selectedVendor.name}
            data={costs.filter(c => c.vendorId === selectedVendor.id && c.status === 'Paid')}
            onClose={() => setSelectedVendor(null)}
          />
        )}
        {selectedPayment && (
          <DetailModal 
            title={selectedPayment.tranche}
            data={[selectedPayment]}
            onClose={() => setSelectedPayment(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

