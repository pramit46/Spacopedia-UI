import React, { useState, useEffect } from 'react';
import { 
  FileText,
  LayoutDashboard,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { MaterialInventoryItem, INITIAL_MATERIALS } from './components/objects/materialInventory';
import { User, USERS } from './components/objects/user';
import { DesignVersion, INITIAL_DESIGN_VERSIONS } from './components/objects/design';
import { DailyExpense, INITIAL_DAILY_EXPENSES  } from './components/objects/dailyExpense';
import { ManpowerMaster, INITIAL_MANPOWER } from './components/objects/manpower';
import { Vendor, VENDORS } from './components/objects/vendor';
import { ProjectPayment, INITIAL_PAYMENTS } from './components/objects/projectPayment';
import { ProjectCostItem, INITIAL_COSTS} from './components/objects/projectCostItem';
import { PROJECTS } from './components/objects/project';
import { AVAILABLE_TABS } from './components/objects/tabConfig';
import { RolePermission, INITIAL_ROLE_PERMISSIONS } from './components/objects/role';
import { ClientMaster, INITIAL_CLIENTS } from './components/objects/client';


import { 
  WeeklyStatus, 
  ChatMessage 
} from './components/objects/weekly-status';

import { AccountSubView, AppSettings } from './types';

// Import components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SettingsPage } from './components/SettingsPage';
import { DesignView } from './components/DesignView';
import { DailyExpensesView } from './components/DailyExpensesView';
import { WeeklyStatusCreateView } from './components/WeeklyStatusCreateView';
import { WeeklyStatusView } from './components/WeeklyStatusView';
import { AccountsView } from './components/AccountsView';
import { LegalView } from './components/LegalView';
import { QuotationView } from './components/QuotationView';
import { MaterialView } from './components/MaterialView';

import { ApiService } from './services/apiService';
import { BACKEND_TARGETS } from './apiConfig';

// --- Icon Mapping Helper for Tabs ---
const ICON_MAP: Record<string, any> = {
  FileText,
  ImageIcon: LayoutDashboard, 
  Package: LayoutDashboard, 
  GanttChartSquare: LayoutDashboard,
  CreditCard: LayoutDashboard,
  ShieldCheck: LayoutDashboard,
  Database: LayoutDashboard,
  List: LayoutDashboard,
  LayoutDashboard
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [activeTab, setActiveTab] = useState('design');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0].id);
  
  // App-level state for data
  const [appSettings, setAppSettings] = useState<AppSettings>({
    maxUploadCount: 4,
    allowedExtensions: ['JPG', 'JPEG', 'PNG', 'MP4', 'AVI']
  });
  const [designVersions, setDesignVersions] = useState<DesignVersion[]>(INITIAL_DESIGN_VERSIONS);
  const [expenses, setExpenses] = useState<DailyExpense[]>(INITIAL_DAILY_EXPENSES);
  const [weeklyStatusLogs, setWeeklyStatusLogs] = useState<WeeklyStatus[]>([]); // Start empty, wait for server
  const [isLoadingExternal, setIsLoadingExternal] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch external weekly status
  useEffect(() => {
    async function fetchWeeklyStatus() {
      setIsLoadingExternal(true);
      setFetchError(null);
      try {
        const mappedLogs = await ApiService.fetchWeeklyStatus(selectedProject, currentUser.id);
        
        console.log('[App] Successfully received and mapped logs:', mappedLogs);
        setWeeklyStatusLogs(mappedLogs);
        
        if (mappedLogs.length > 0) {
          setSelectedWeekId(mappedLogs[0].id);
        } else {
          console.warn('[App] Resolved to empty logs array');
          setWeeklyStatusLogs([]);
          setSelectedWeekId(null);
        }
      } catch (error: any) {
        console.error('[App] Failed to fetch external status:', error);
        const errMsg = error.message || 'Unknown connection error';
        setFetchError(errMsg);
        
        // NO MOCK FALLBACK for weekly status as per request
        setWeeklyStatusLogs([]);
        setSelectedWeekId(null);
      } finally {
        setIsLoadingExternal(false);
      }
    }

    fetchWeeklyStatus();
  }, [currentUser.id, selectedProject]);

  const [payments, setPayments] = useState<ProjectPayment[]>(INITIAL_PAYMENTS);
  const [costs, setCosts] = useState<ProjectCostItem[]>(INITIAL_COSTS);
  const [projects, setProjects] = useState(PROJECTS);
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS);
  const [manpower, setManpower] = useState<ManpowerMaster[]>(INITIAL_MANPOWER);
  const [clients, setClients] = useState<ClientMaster[]>(INITIAL_CLIENTS);
  const [users, setUsers] = useState<User[]>(USERS);
  const [materials, setMaterials] = useState<MaterialInventoryItem[]>(INITIAL_MATERIALS);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(INITIAL_ROLE_PERMISSIONS);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(null);
  const [isCreatingStatus, setIsCreatingStatus] = useState(false);
  const [collapsedItems, setCollapsedItems] = useState<Record<string, boolean>>({});

  const toggleCollapse = (key: string) => {
    setCollapsedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Sync currentUser with users array
  useEffect(() => {
    const updatedUser = users.find(u => u.id === currentUser.id);
    if (updatedUser && (updatedUser.name !== currentUser.name || updatedUser.role !== currentUser.role)) {
      setCurrentUser(updatedUser);
    }
  }, [users, currentUser.id]);

  // Auto-switch tab if role/permissions change
  useEffect(() => {
    const perm = rolePermissions.find(p => p.role === currentUser.role);
    const allowedTabs = perm ? perm.allowedTabs : [];
    if (allowedTabs.length > 0 && !allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
    }
  }, [currentUser.role, rolePermissions]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleUpdateWeeklyStatusComments = async (logId: string, comments: ChatMessage[]) => {
    // Update local state for immediate feedback
    setWeeklyStatusLogs(prev => prev.map(log => 
      log.id === logId ? { ...log, comments } : log
    ));

    // Prepare API: Sync with server for persistence/realtime
    try {
      await ApiService.toggleStar(logId, 'PLACEHOLDER', true); // Example star toggle
    } catch (error) {
      console.error('Failed to sync messages with API:', error);
    }
  };

  const handleUpdateProgressText = async (id: string, text: string) => {
    setWeeklyStatusLogs(prev => prev.map(log => 
      log.id === id ? { ...log, progressText: text } : log
    ));

    try {
      // Placeholder for progress update API
      console.log('[App] Progress text update synced');
    } catch (error) {
      console.error('Failed to sync progress with API:', error);
    }
  };

  const handleAddWeeklyStatus = async (log: WeeklyStatus) => {
    setWeeklyStatusLogs(prev => [...prev, log]);
    setIsCreatingStatus(false);
    setSelectedWeekId(log.id);

    try {
      // Placeholder for create API
      console.log('[App] New weekly status logged');
    } catch (error) {
      console.error('Failed to post new weekly status to API:', error);
    }
  };

  const handleImpersonationChange = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) setCurrentUser(user);
    setShowSettings(false);
  };

  const currentRolePerm = rolePermissions.find(p => p.role === currentUser.role);
  const visibleTabs = AVAILABLE_TABS.filter(tab => 
    tab.id !== 'settings' && currentRolePerm?.allowedTabs.includes(tab.id)
  );
  
  const canAccessSettings = currentRolePerm?.allowedTabs.includes('settings');

  // Group Weekly Status Logs for Sidebar
  const groupedStatuses = weeklyStatusLogs.reduce((acc, log) => {
    if (!acc[log.year]) acc[log.year] = {};
    if (!acc[log.year][log.month]) acc[log.year][log.month] = [];
    acc[log.year][log.month].push(log);
    return acc;
  }, {} as Record<number, Record<string, WeeklyStatus[]>>);

  if (showSettings) {
    return (
      <SettingsPage 
        currentUser={currentUser}
        users={users}
        setUsers={setUsers}
        rolePermissions={rolePermissions}
        setRolePermissions={setRolePermissions}
        vendors={vendors}
        setVendors={setVendors}
        manpower={manpower}
        setManpower={setManpower}
        clients={clients}
        setClients={setClients}
        payments={payments}
        setPayments={setPayments}
        costs={costs}
        setCosts={setCosts}
        projects={projects}
        setProjects={setProjects}
        selectedProject={selectedProject}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        appSettings={appSettings}
        setAppSettings={setAppSettings}
        onClose={() => setShowSettings(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-300">
      <Header 
        currentUser={currentUser}
        users={users}
        clients={clients}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        projects={projects}
        handleImpersonationChange={handleImpersonationChange}
        setShowSettings={setShowSettings}
        canAccessSettings={canAccessSettings}
      />

      <nav className="bg-gray-50/50 dark:bg-gray-800/20 border-b dark:border-gray-800 px-6 flex items-end gap-1 safe-area-x overflow-x-auto no-scrollbar">
        {visibleTabs.map((tab) => {
          const Icon = ICON_MAP[tab.iconName] || FileText;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative px-5 py-3 text-sm font-medium transition-all flex items-center gap-2 whitespace-nowrap
                ${isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}
              `}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div 
                   layoutId="activeTab"
                   className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </nav>

      <main className="flex-1 flex overflow-hidden">
        {/* Sidebar visibility control - Commented out for full-width views */}
        {!['legal', 'billing', 'design', 'accounts', 'quotation', 'material'].includes(activeTab) && (
          <Sidebar 
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            currentUser={currentUser}
            isCreatingStatus={isCreatingStatus}
            setIsCreatingStatus={setIsCreatingStatus}
            groupedStatuses={groupedStatuses}
            selectedWeekId={selectedWeekId}
            setSelectedWeekId={setSelectedWeekId}
            collapsedItems={collapsedItems}
            toggleCollapse={toggleCollapse}
          />
        )}

        <section className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`${['quotation', 'material'].includes(activeTab) ? 'w-full' : 'max-w-6xl mx-auto'}`}
            >
              {activeTab === 'design' && (
                <DesignView 
                  currentUser={currentUser} 
                  items={designVersions} 
                  onDelete={(id) => setDesignVersions(prev => prev.filter(v => v.id !== id))}
                  project_id={selectedProject}
                />
              )}
              {activeTab === 'billing' && (
                <DailyExpensesView 
                  currentUser={currentUser} 
                  items={expenses} 
                  onDelete={(id) => setExpenses(prev => prev.filter(e => e.id !== id))}
                  onAdd={(exp) => setExpenses(prev => [...prev, exp])}
                  project_id={selectedProject}
                />
              )}
              {activeTab === 'weekly-status' && (
                isCreatingStatus ? (
      <WeeklyStatusCreateView 
        currentUser={currentUser} 
        onAdd={handleAddWeeklyStatus}
        onCancel={() => setIsCreatingStatus(false)}
        settings={appSettings}
        project_id={selectedProject}
      />
                ) : (
                  weeklyStatusLogs.length > 0 ? (
                    <div className="space-y-6">
                      {fetchError && (
                        <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-4 rounded-2xl flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
                              <X className="w-4 h-4" />
                            </div>
                            <div>
                               <p className="text-xs font-black italic tracking-tighter text-red-600 dark:text-red-400 uppercase">Live Server Offline</p>
                               <p className="text-[10px] text-red-500/70 font-medium">{fetchError}</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-1.5 bg-red-500 text-white text-[9px] font-black uppercase rounded-lg hover:bg-red-600 transition-all"
                          >
                            Try Reconnect
                          </button>
                        </div>
                      )}
                      <WeeklyStatusView 
                        currentUser={currentUser} 
                        items={weeklyStatusLogs} 
                        selectedId={selectedWeekId}
                        onDelete={() => {}} // Deletion removed to enforce immutability
                        onUpdateComments={handleUpdateWeeklyStatusComments}
                        onUpdateProgressText={handleUpdateProgressText}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      {fetchError ? (
                        <>
                          <div className="w-12 h-12 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-4 text-red-500">
                             <FileText className="w-6 h-6 rotate-12" />
                          </div>
                          <p className="font-black italic tracking-tighter uppercase text-red-500">Server Connection Failed</p>
                          <p className="text-xs mt-2 max-w-sm text-center opacity-70 px-6">{fetchError}</p>
                          <button 
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                          >
                            Retry Connection
                          </button>
                        </>
                      ) : isLoadingExternal ? (
                        <>
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                          <p className="font-black italic tracking-tighter uppercase">Fetching Live Status From Server...</p>
                          <span className="text-[10px] mt-2 opacity-50">Connecting to {new URL(BACKEND_TARGETS.WEEKLY_STATUS).hostname}...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6">
                            <FileText className="w-8 h-8 opacity-20" />
                          </div>
                          <p className="font-black italic tracking-tighter uppercase text-lg text-gray-500 dark:text-gray-400">No Weekly Reports Found</p>
                          <p className="text-[10px] font-black uppercase tracking-widest mt-2 opacity-40">Project ID: {selectedProject}</p>
                        </>
                      )}
                    </div>
                  )
                )
              )}
              {activeTab === 'accounts' && (
                <AccountsView 
                   currentUser={currentUser}
                   payments={payments}
                   costs={costs}
                   vendors={vendors}
                   project_id={selectedProject}
                   darkMode={darkMode}
                />
              )}
              {activeTab === 'legal' && (
                <LegalView 
                  currentUser={currentUser}
                  project_id={selectedProject}
                />
              )}
              {activeTab === 'quotation' && (
                <QuotationView 
                  currentUser={currentUser}
                  project_id={selectedProject}
                  onSyncMaterials={(newMaterials) => {
                    setMaterials(prev => {
                      // Filter out existing auto-synced materials for this project if we want to replace
                      // or just append. Usually, replace is safer for "Final Submit" sync.
                      const otherProjects = prev.filter(m => m.project_id !== selectedProject);
                      return [...otherProjects, ...newMaterials];
                    });
                  }}
                />
              )}
              {activeTab === 'material' && (
                <MaterialView 
                  currentUser={currentUser}
                  items={materials}
                  vendors={vendors}
                  onDelete={(id) => setMaterials(prev => prev.filter(m => m.id !== id))}
                  onUpdate={(item) => setMaterials(prev => prev.map(m => m.id === item.id ? item : m))}
                  onAdd={(item) => setMaterials(prev => [...prev, item])}
                />
              )}
              {!['design', 'billing', 'weekly-status', 'accounts', 'legal', 'quotation', 'material'].includes(activeTab) && (
                <div className="flex flex-col items-center justify-center min-h-[50vh] text-center border-2 border-dashed dark:border-gray-800 rounded-3xl p-12">
                   <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-4 text-gray-400">
                     <FileText className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl font-bold mb-2">{AVAILABLE_TABS.find(t => t.id === activeTab)?.label}</h2>
                   <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                     The module for {AVAILABLE_TABS.find(t => t.id === activeTab)?.label.toLowerCase()} is currently being finalized. Check back later for full access.
                   </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    </div>
  );
}
