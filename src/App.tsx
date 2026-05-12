import React, { useState, useEffect } from 'react';
import { 
  FileText,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

import { 
  User, 
  DesignVersion, 
  Expense, 
  WeeklyStatus, 
  ChatMessage,
  ProjectPayment,
  ProjectCostItem,
  Vendor,
  MaterialMaster,
  ManpowerMaster,
  USERS, 
  PROJECTS, 
  INITIAL_DESIGN_VERSIONS, 
  INITIAL_EXPENSES, 
  INITIAL_WEEKLY_STATUS,
  INITIAL_PAYMENTS,
  INITIAL_COSTS,
  VENDORS,
  INITIAL_MATERIALS,
  INITIAL_MANPOWER,
  AVAILABLE_TABS,
  INITIAL_ROLE_PERMISSIONS,
  INITIAL_CLIENTS,
  RolePermission,
  ClientMaster
} from './mockData';

import { AccountSubView } from './types';

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

// --- Icon Mapping Helper for Tabs ---
const ICON_MAP: Record<string, any> = {
  FileText,
  ImageIcon: LayoutDashboard, // fallback or use ImageIcon from lucide if imported
  Package: LayoutDashboard, 
  GanttChartSquare: LayoutDashboard,
  CreditCard: LayoutDashboard,
  ShieldCheck: LayoutDashboard,
  LayoutDashboard
};

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [activeTab, setActiveTab] = useState('design');
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedProject, setSelectedProject] = useState(PROJECTS[0].id);
  
  // App-level state for data
  const [designVersions, setDesignVersions] = useState<DesignVersion[]>(INITIAL_DESIGN_VERSIONS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [weeklyStatusLogs, setWeeklyStatusLogs] = useState<WeeklyStatus[]>(INITIAL_WEEKLY_STATUS);
  const [payments, setPayments] = useState<ProjectPayment[]>(INITIAL_PAYMENTS);
  const [costs, setCosts] = useState<ProjectCostItem[]>(INITIAL_COSTS);
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS);
  const [materials, setMaterials] = useState<MaterialMaster[]>(INITIAL_MATERIALS);
  const [manpower, setManpower] = useState<ManpowerMaster[]>(INITIAL_MANPOWER);
  const [clients, setClients] = useState<ClientMaster[]>(INITIAL_CLIENTS);
  const [users, setUsers] = useState<User[]>(USERS);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>(INITIAL_ROLE_PERMISSIONS);
  const [selectedWeekId, setSelectedWeekId] = useState<string | null>(INITIAL_WEEKLY_STATUS[0]?.id || null);
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

  const handleUpdateWeeklyStatusComments = (logId: string, comments: ChatMessage[]) => {
    setWeeklyStatusLogs(prev => prev.map(log => 
      log.id === logId ? { ...log, comments } : log
    ));
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
        materials={materials}
        setMaterials={setMaterials}
        manpower={manpower}
        setManpower={setManpower}
        clients={clients}
        setClients={setClients}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
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
        projects={PROJECTS}
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
        {/* Sidebar visibility control - Commented out for Legal, Billing, and Design pages as requested */}
        {!['legal', 'billing', 'design', 'accounts'].includes(activeTab) && (
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
              className="max-w-6xl mx-auto"
            >
              {activeTab === 'design' && (
                <DesignView 
                  currentUser={currentUser} 
                  items={designVersions} 
                  onDelete={(id) => setDesignVersions(prev => prev.filter(v => v.id !== id))} 
                />
              )}
              {activeTab === 'billing' && (
                <DailyExpensesView 
                  currentUser={currentUser} 
                  items={expenses} 
                  onDelete={(id) => setExpenses(prev => prev.filter(e => e.id !== id))}
                  onAdd={(exp) => setExpenses(prev => [...prev, exp])}
                />
              )}
              {activeTab === 'weekly-status' && (
                isCreatingStatus ? (
                  <WeeklyStatusCreateView 
                    currentUser={currentUser} 
                    onAdd={(log) => {
                      setWeeklyStatusLogs(prev => [...prev, log]);
                      setIsCreatingStatus(false);
                      setSelectedWeekId(log.id);
                    }}
                    onCancel={() => setIsCreatingStatus(false)}
                  />
                ) : (
                  <WeeklyStatusView 
                    currentUser={currentUser} 
                    items={weeklyStatusLogs} 
                    selectedId={selectedWeekId}
                    onDelete={(id) => {
                      setWeeklyStatusLogs(prev => prev.filter(s => s.id !== id));
                      if (selectedWeekId === id) setSelectedWeekId(null);
                    }}
                    onUpdateComments={handleUpdateWeeklyStatusComments}
                    onUpdateProgressText={(id, text) => {
                      setWeeklyStatusLogs(prev => prev.map(log => 
                        log.id === id ? { ...log, progressText: text } : log
                      ));
                    }}
                  />
                )
              )}
              {activeTab === 'accounts' && (
                <AccountsView 
                   currentUser={currentUser}
                   payments={payments}
                   costs={costs}
                   vendors={vendors}
                   projectId={selectedProject}
                   darkMode={darkMode}
                />
              )}
              {activeTab === 'legal' && (
                <LegalView 
                  currentUser={currentUser}
                  projectId={selectedProject}
                />
              )}
              {activeTab === 'quotation' && (
                <QuotationView 
                  currentUser={currentUser}
                  projectId={selectedProject}
                />
              )}
              {!['design', 'billing', 'weekly-status', 'accounts', 'legal', 'quotation'].includes(activeTab) && (
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
