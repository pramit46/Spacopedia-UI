import React from 'react';
import { 
  Star, 
  Package, 
  AlertCircle,
  ChevronDown,
  LayoutDashboard,
  FileText
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
  BarChart, 
  Bar, 
  Legend 
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
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    overview: true,
    payments: true,
    vendors: true,
    procurement: true,
    analysis: true
  });

  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter data by active project
  const payments = allPayments.filter(p => p.projectId === projectId);
  const costs = allCosts.filter(c => c.projectId === projectId);
  
  // Filter vendors to those involved in the current project
  const projectVendorIds = new Set(costs.map(c => c.vendorId));
  const vendors = allVendors.filter(v => projectVendorIds.has(v.id));

  const totalCost = costs.reduce((sum, item) => sum + item.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'received').reduce((sum, p) => sum + p.amount, 0);
  const pendingAmount = Math.max(0, totalCost - totalPaid);
  
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

  const SectionHeader = ({ id, title, icon: Icon }: { id: string; title: string; icon: any }) => (
    <button 
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between p-6 bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all rounded-2xl group border dark:border-gray-800"
    >
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white dark:bg-gray-900 rounded-xl shadow-sm group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-black italic tracking-tight">{title}</h3>
      </div>
      <div className={`p-2 rounded-full bg-white dark:bg-gray-900 transition-transform ${expandedSections[id] ? 'rotate-180' : ''}`}>
        <ChevronDown className="w-4 h-4" />
      </div>
    </button>
  );

  return (
    <div className="space-y-12 pb-24">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black italic mb-2">Project Accounting</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Holistic financial health and procurement lifecycle control.</p>
        </div>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border dark:border-gray-700 shadow-sm transition-all hover:shadow-xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Project Cost</p>
          <p className="text-3xl font-black text-gray-900 dark:text-white">₹{totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border dark:border-gray-700 shadow-sm transition-all hover:shadow-xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Settled Payments</p>
          <p className="text-3xl font-black text-green-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border dark:border-gray-700 shadow-sm transition-all hover:shadow-xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Outstanding Dues</p>
          <p className="text-3xl font-black text-red-500">₹{pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border dark:border-gray-700 shadow-sm transition-all hover:shadow-xl">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Active Entities</p>
          <p className="text-3xl font-black text-blue-600">{vendors.length} Vendors</p>
        </div>
      </div>

      {/* Overview Section */}
      <div className="space-y-6">
        <SectionHeader id="overview" title="Financial Overview" icon={LayoutDashboard} />
        <AnimatePresence>
          {expandedSections.overview && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border dark:border-gray-700 shadow-sm">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Section-wise Burn Rate</h4>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', background: darkMode ? '#111827' : '#fff' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border dark:border-gray-700 shadow-sm">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Inflow Pattern (Cumulative)</h4>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={timechartData}>
                        <defs>
                          <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb33" />
                        <XAxis dataKey="date" hide />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', background: darkMode ? '#111827' : '#fff' }}
                        />
                        <Area type="monotone" dataKey="cumulative" stroke="#2563eb" fillOpacity={1} fill="url(#colorCumulative)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Payments Section */}
      <div className="space-y-6">
        <SectionHeader id="payments" title="Revenue & Tranches" icon={FileText} />
        <AnimatePresence>
          {expandedSections.payments && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-[2.5rem] overflow-hidden shadow-sm pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b dark:border-gray-700 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-8 py-5">Tranche Details</th>
                        <th className="px-6 py-5">Value</th>
                        <th className="px-6 py-5">Date</th>
                        <th className="px-8 py-5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {payments.length > 0 ? payments.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-8 py-5 font-bold">{p.tranche}</td>
                          <td className="px-6 py-5 text-blue-600 font-mono font-black">₹{p.amount.toLocaleString()}</td>
                          <td className="px-6 py-5 text-sm font-medium text-gray-500">{p.date}</td>
                          <td className="px-8 py-5 text-right">
                            <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                              p.status === 'received' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-8 py-10 text-center text-gray-400 font-medium italic">No payments recorded for this project yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vendors Section */}
      <div className="space-y-6">
        <SectionHeader id="vendors" title="Vendor Ledger" icon={Star} />
        <AnimatePresence>
          {expandedSections.vendors && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                {vendors.length > 0 ? vendors.map((vendor) => (
                  <div key={vendor.id} className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border dark:border-gray-700 shadow-sm flex items-center justify-between group hover:shadow-lg transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950 flex items-center justify-center text-blue-600 font-black text-xl">
                        {vendor.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="font-black text-lg">{vendor.name}</h5>
                        <p className="text-sm text-gray-500 font-medium">{vendor.type}</p>
                        <div className="flex items-center gap-1.5 mt-2 bg-orange-50 dark:bg-orange-950/20 px-2 py-0.5 rounded-lg w-fit">
                          <Star className="w-3.5 h-3.5 text-orange-400 fill-current" />
                          <span className="text-[11px] font-black text-orange-600">{vendor.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Paylines</p>
                      <p className="text-xl font-black text-gray-900 dark:text-white">₹{costs.filter(c => c.vendorId === vendor.id).reduce((s, c) => s + c.amount, 0).toLocaleString()}</p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-2 py-20 text-center text-gray-400 font-medium italic bg-gray-50 dark:bg-gray-800/50 rounded-3xl border dark:border-gray-700 border-dashed">
                    No vendors associated with the current project session.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Procurement Section */}
      <div className="space-y-6">
        <SectionHeader id="procurement" title="Inventory & Procurement" icon={Package} />
        <AnimatePresence>
          {expandedSections.procurement && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-8 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-orange-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-orange-600/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl">
                          <AlertCircle className="w-8 h-8" />
                        </div>
                        <h4 className="text-2xl font-black italic">Reorder Alerts</h4>
                      </div>
                      <p className="opacity-80 font-medium max-w-xs">Critical inventory nodes below safety threshold. Procurement recommended.</p>
                    </div>
                    <div className="text-6xl font-black opacity-30">02</div>
                  </div>
                  
                  <div className="bg-blue-600 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-blue-600/30 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 bg-white/20 rounded-2xl">
                          <Package className="w-8 h-8" />
                        </div>
                        <h4 className="text-2xl font-black italic">Inventory Capital</h4>
                      </div>
                      <p className="opacity-80 font-medium max-w-xs">Total immobilized capital across active material nodes.</p>
                    </div>
                    <div className="text-4xl font-black">₹42.8k</div>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] border dark:border-gray-700 overflow-hidden shadow-sm">
                  <div className="p-10 border-b dark:border-gray-700 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Procurement Log</h4>
                      <p className="text-lg font-black italic">Real-time Material Acquisition</p>
                    </div>
                    <button className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-2xl hover:bg-blue-100 transition-colors">Generate Inventory Report</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="px-10 py-5">Material Item</th>
                          <th className="px-6 py-5">Target Supplier</th>
                          <th className="px-6 py-5">Payload Qty</th>
                          <th className="px-10 py-5 text-right">Settlement Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        {[
                          { item: 'Cement (OPC)', supplier: 'BuildStrong Civil', qty: '500 Bags', value: 12500 },
                          { item: 'Steel Rebars (12mm)', supplier: 'BuildStrong Civil', qty: '2.5 Tons', value: 18000 },
                          { item: 'Conduit Pipes', supplier: 'Sparky Electricians', qty: '800 Units', value: 4200 },
                          { item: 'Primary Emulsion', supplier: 'Perfect Finish Paints', qty: '20 Buckets', value: 3100 },
                          { item: 'Plywood (19mm)', supplier: 'WoodWizard Carpentry', qty: '45 Sheets', value: 5000 },
                        ].map((mat, i) => (
                          <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-10 py-6 font-bold">{mat.item}</td>
                            <td className="px-6 py-6 text-sm font-medium text-gray-500">{mat.supplier}</td>
                            <td className="px-6 py-6 text-sm font-black text-gray-400">{mat.qty}</td>
                            <td className="px-10 py-6 text-right font-black text-blue-600">₹{mat.value.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analysis Section */}
      <div className="space-y-6">
        <SectionHeader id="analysis" title="Granular Cost Analysis" icon={AlertCircle} />
        <AnimatePresence>
          {expandedSections.analysis && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-10 pt-4">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-[2.5rem] border dark:border-gray-700 shadow-sm">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-10">Expenditure Delta by Project Vertical</h4>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={pieData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb33" />
                        <XAxis dataKey="name" fontSize={10} fontWeight={900} tick={{ fill: '#9ca3af' }} axisLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '14px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', background: darkMode ? '#111827' : '#fff' }}
                        />
                        <Bar dataKey="value" fill="#2563eb" radius={[12, 12, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-[2.5rem] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b dark:border-gray-700 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                          <th className="px-10 py-6">Transaction Description</th>
                          <th className="px-6 py-6">Vertical Section</th>
                          <th className="px-10 py-6 text-right">Settled Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y dark:divide-gray-700">
                        {costs.length > 0 ? costs.map((c) => (
                          <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                            <td className="px-10 py-7">
                              <p className="font-bold text-gray-800 dark:text-gray-200">{c.description}</p>
                              <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-0.5">{c.date}</p>
                            </td>
                            <td className="px-6 py-7">
                              <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                {c.section}
                              </span>
                            </td>
                            <td className="px-10 py-7 text-right font-black text-lg text-blue-600 tracking-tight">₹{c.amount.toLocaleString()}</td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={3} className="px-10 py-16 text-center text-gray-400 font-medium italic border-dashed border-2 m-4 rounded-3xl">No cost analysis data currently logged for this session.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
