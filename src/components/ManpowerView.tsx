import React from 'react';
import { HardHat, MapPin, Users, TrendingUp } from 'lucide-react';
import { ManpowerMaster } from '../mockData';

interface ManpowerViewProps {
  manpower: ManpowerMaster[];
}

export function ManpowerView({ manpower }: ManpowerViewProps) {
  const stats = [
    { label: 'Total Trades', value: manpower.length, icon: HardHat, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Avg. Day Rate', value: `₹${Math.round(manpower.reduce((a, b) => a + b.ratePerDay, 0) / manpower.length)}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Primary Region', value: 'Bangalore', icon: MapPin, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'Active Teams', value: '8', icon: Users, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className="text-3xl font-black mb-2 italic">Manpower Dynamics</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Real-time oversight of trade specialists, daily rates, and regional allocation.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-3xl border dark:border-gray-700 shadow-sm">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className="text-2xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Trade Master List</h3>
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase rounded-lg">Sync Active</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Trade / Type</th>
                <th className="px-6 py-5">Skill Level</th>
                <th className="px-6 py-5">Region/City</th>
                <th className="px-8 py-5 text-right">Standard Rate (Day)</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {manpower.map((mp) => (
                <tr key={mp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <HardHat className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="font-bold">{mp.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase ${
                      mp.skillLevel === 'highly-skilled' ? 'bg-purple-100 text-purple-600' :
                      mp.skillLevel === 'skilled' ? 'bg-green-100 text-green-600' :
                      mp.skillLevel === 'semi-skilled' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {mp.skillLevel.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">{mp.city}</span>
                      <span className="text-[10px] text-gray-400 uppercase font-black">{mp.state}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right font-black text-blue-600 dark:text-blue-400">
                    ₹{mp.ratePerDay.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
