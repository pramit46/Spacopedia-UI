import React from 'react';
import { 
  Star, 
  Package, 
  ShieldCheck, 
  AlertCircle 
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
import { AccountSubView } from '../types';

interface AccountsViewProps {
  currentUser: User;
  payments: ProjectPayment[];
  costs: ProjectCostItem[];
  vendors: Vendor[];
  activeSubView: AccountSubView;
  projectId: string;
}

export function AccountsView({ 
  currentUser, 
  payments: allPayments, 
  costs: allCosts, 
  vendors: allVendors,
  activeSubView,
  projectId
}: AccountsViewProps) {
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

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2">Project Accounting</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Financial oversight, resource allocation, and payment lifecycle tracking.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Cost Incurred</p>
          <p className="text-2xl font-black text-gray-900 dark:text-white">₹{totalCost.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Paid by Client</p>
          <p className="text-2xl font-black text-green-600">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Pending Balance</p>
          <p className="text-2xl font-black text-red-500">₹{pendingAmount.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Active Vendors</p>
          <p className="text-2xl font-black text-blue-600">{vendors.length}</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubView}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeSubView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border dark:border-gray-700 shadow-sm">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Cost Distribution by Section</h4>
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
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Legend verticalAlign="bottom" height={36}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border dark:border-gray-700 shadow-sm">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Payment Inflow (Cumulative)</h4>
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
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Area type="monotone" dataKey="cumulative" stroke="#2563eb" fillOpacity={1} fill="url(#colorCumulative)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {activeSubView === 'payments' && (
            <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <th className="px-8 py-5">Tranche Details</th>
                      <th className="px-6 py-5">Value</th>
                      <th className="px-6 py-5">Date</th>
                      <th className="px-8 py-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {payments.length > 0 ? payments.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-8 py-5 font-bold">{p.tranche}</td>
                        <td className="px-6 py-5 text-blue-600 font-mono font-black">₹{p.amount.toLocaleString()}</td>
                        <td className="px-6 py-5 text-sm font-medium text-gray-500">{p.date}</td>
                        <td className="px-8 py-5 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
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
          )}

          {activeSubView === 'vendors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vendors.length > 0 ? vendors.map((vendor) => (
                <div key={vendor.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm flex items-center justify-between">
                  <div>
                    <h5 className="font-black text-lg">{vendor.name}</h5>
                    <p className="text-sm text-gray-500">{vendor.type}</p>
                    <div className="flex items-center gap-1 mt-2 text-orange-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-black">{vendor.rating}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Section Spend</p>
                    <p className="text-lg font-black">₹{costs.filter(c => c.vendorId === vendor.id).reduce((s, c) => s + c.amount, 0).toLocaleString()}</p>
                  </div>
                </div>
              )) : (
                <div className="col-span-2 py-20 text-center text-gray-400 font-medium italic bg-gray-50 dark:bg-gray-800/50 rounded-3xl border dark:border-gray-700">
                  No vendors associated with the current project session.
                </div>
              )}
            </div>
          )}

          {activeSubView === 'materials' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-600 p-8 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
                  <Package className="w-8 h-8 mb-4 opacity-50" />
                  <p className="text-xs font-black uppercase tracking-widest opacity-70">Inventory Value</p>
                  <p className="text-3xl font-black mt-1">₹42,800</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border dark:border-gray-700 shadow-sm">
                  <ShieldCheck className="w-8 h-8 mb-4 text-green-500" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Audited Assets</p>
                  <p className="text-3xl font-black mt-1 text-gray-900 dark:text-white">12/12</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-8 rounded-[2rem] border dark:border-gray-700 shadow-sm">
                  <AlertCircle className="w-8 h-8 mb-4 text-orange-500" />
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Reorder Alerts</p>
                  <p className="text-3xl font-black mt-1 text-gray-900 dark:text-white">2</p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-3xl border dark:border-gray-700 overflow-hidden shadow-sm">
                <div className="p-8 border-b dark:border-gray-700 flex items-center justify-between">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Material Procurement Log</h4>
                  <button className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">Generate Report</button>
                </div>
                <div className="p-0 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-8 py-5">Material Item</th>
                        <th className="px-6 py-5">Supplier</th>
                        <th className="px-6 py-5">Quantity</th>
                        <th className="px-8 py-5 text-right">Value</th>
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
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-8 py-5 font-bold">{mat.item}</td>
                          <td className="px-6 py-5 text-sm font-medium text-gray-500">{mat.supplier}</td>
                          <td className="px-6 py-5 text-sm font-black text-gray-400">{mat.qty}</td>
                          <td className="px-8 py-5 text-right font-black text-blue-600">₹{mat.value.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSubView === 'cost-analysis' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-[2.5rem] border dark:border-gray-700 shadow-sm">
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-8">Section-wise Expenditure Breakdown</h4>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pieData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb33" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip 
                        contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                      />
                      <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        <th className="px-8 py-5">Description</th>
                        <th className="px-6 py-5">Section</th>
                        <th className="px-6 py-5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-gray-700">
                      {costs.length > 0 ? costs.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                          <td className="px-8 py-5">
                            <p className="font-bold">{c.description}</p>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{c.date}</p>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">
                              {c.section}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right font-black text-blue-600">₹{c.amount.toLocaleString()}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={3} className="px-8 py-10 text-center text-gray-400 font-medium italic">No cost analysis data for the current project session.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
