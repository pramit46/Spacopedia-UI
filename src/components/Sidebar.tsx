import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ChevronRight, 
  ChevronDown 
} from 'lucide-react';
import { User, WeeklyStatus } from '../mockData';
import { SidebarProps } from '../types';

interface SidebarComponentProps extends SidebarProps {
  groupedStatuses: Record<number, Record<string, WeeklyStatus[]>>;
  selectedWeekId: string | null;
  setSelectedWeekId: (id: string) => void;
  collapsedItems: Record<string, boolean>;
  toggleCollapse: (key: string) => void;
  isAccountsView?: boolean;
  activeAccountSubView?: string;
  setActiveAccountSubView?: (view: any) => void;
}

export function Sidebar({ 
  activeTab, 
  setActiveTab, 
  currentUser, 
  isCreatingStatus, 
  setIsCreatingStatus,
  groupedStatuses,
  selectedWeekId,
  setSelectedWeekId,
  collapsedItems,
  toggleCollapse,
  isAccountsView,
  activeAccountSubView,
  setActiveAccountSubView
}: any) {
  return (
    <aside className="w-64 border-r dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hidden lg:flex flex-col p-4 overflow-y-auto">
      {activeTab === 'weekly-status' ? (
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Navigation</h3>
            <button 
              onClick={() => setIsCreatingStatus(false)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${!isCreatingStatus ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Feed View
            </button>
            {['owner', 'project', 'accounts'].includes(currentUser.role) && (
              <button 
                onClick={() => setIsCreatingStatus(true)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-3 transition-all mt-1 ${isCreatingStatus ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              >
                <PlusCircle className="w-4 h-4" />
                New Update
              </button>
            )}
          </div>

          <div className="pt-4 border-t dark:border-gray-800">
            <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Archive</h3>
            <div className="space-y-4">
              {Object.entries(groupedStatuses).sort(([a], [b]) => Number(b) - Number(a)).map(([year, months]) => (
                <div key={year} className="space-y-1">
                  <button 
                    onClick={() => toggleCollapse(year)}
                    className="w-full flex items-center justify-between px-2 py-1 text-[11px] font-black text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {year}
                    <ChevronDown className={`w-3 h-3 transition-transform ${collapsedItems[year] ? '-rotate-90' : ''}`} />
                  </button>
                  {!collapsedItems[year] && Object.entries(months).map(([month, logs]) => (
                    <div key={month} className="pl-2 space-y-1">
                      <button 
                        onClick={() => toggleCollapse(`${year}-${month}`)}
                        className="w-full flex items-center justify-between px-2 py-1 text-[10px] font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        {month}
                        <ChevronDown className={`w-2.5 h-2.5 transition-transform ${collapsedItems[`${year}-${month}`] ? '-rotate-90' : ''}`} />
                      </button>
                      {!collapsedItems[`${year}-${month}`] && (
                        <div className="space-y-0.5 mt-1">
                          {logs.map(log => (
                            <button
                              key={log.id}
                              onClick={() => {
                                setSelectedWeekId(log.id);
                                setIsCreatingStatus(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-lg text-[11px] font-medium transition-all truncate ${selectedWeekId === log.id && !isCreatingStatus ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                              {log.week}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'accounts' ? (
        <div className="flex-1 space-y-6">
          <h3 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 px-2">Account Views</h3>
          <div className="space-y-1">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'payments', label: 'Payments' },
              { id: 'vendors', label: 'Vendors' },
              { id: 'materials', label: 'Materials' },
              { id: 'cost-analysis', label: 'Cost Analysis' }
            ].map((sub) => (
              <button
                key={sub.id}
                onClick={() => setActiveAccountSubView && setActiveAccountSubView(sub.id as any)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between transition-all ${activeAccountSubView === sub.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800'}`}
              >
                {sub.label}
                {activeAccountSubView === sub.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 text-gray-300">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-loose">Select a module from the top navigation to begin.</p>
        </div>
      )}

      <div className="pt-6 mt-6 border-t dark:border-gray-800">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border dark:border-gray-700 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate">{currentUser.name}</p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-black">{currentUser.role === 'accounts' ? 'Accounts (Power)' : currentUser.role}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
