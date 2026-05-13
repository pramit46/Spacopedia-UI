import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Palette, 
  ChevronRight, 
  Users as UsersIcon, 
  Lock, 
  Moon, 
  Sun, 
  Database,
  User as UserIcon, 
  Shield,
  Building2,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Role, 
  RolePermission, 
  Vendor,
  ManpowerMaster,
  ClientMaster,
  INITIAL_ROLES
} from '../mockData';

// Modular Components
import { UserRolesHub } from './settings/UserRolesHub';
import { MasterDataHub } from './settings/MasterDataHub';
import { AppearanceSettings } from './settings/AppearanceSettings';

interface SettingsPageProps {
  currentUser: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  rolePermissions: RolePermission[];
  setRolePermissions: React.Dispatch<React.SetStateAction<RolePermission[]>>;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  manpower: ManpowerMaster[];
  setManpower: React.Dispatch<React.SetStateAction<ManpowerMaster[]>>;
  clients: ClientMaster[];
  setClients: React.Dispatch<React.SetStateAction<ClientMaster[]>>;
  payments: any[];
  setPayments: React.Dispatch<React.SetStateAction<any[]>>;
  costs: any[];
  setCosts: React.Dispatch<React.SetStateAction<any[]>>;
  selectedProject: string;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}

export function SettingsPage({ 
  currentUser, 
  users, 
  setUsers, 
  rolePermissions, 
  setRolePermissions, 
  vendors,
  setVendors,
  manpower,
  setManpower,
  clients,
  setClients,
  payments,
  setPayments,
  costs,
  setCosts,
  selectedProject,
  darkMode, 
  setDarkMode, 
  onClose 
}: SettingsPageProps) {
  const [activeView, setActiveView] = useState<'appearance' | 'user-roles' | 'master-data'>('appearance');
  const [availableRoles, setAvailableRoles] = useState<Role[]>(INITIAL_ROLES);

  const canEdit = currentUser.role === 'owner';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      {/* Settings Sidebar */}
      <aside className="w-80 border-r dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col pt-8">
        <div className="px-8 mb-10 flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all text-gray-500 border dark:border-gray-800 active:scale-90"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black tracking-tight">System Settings</h1>
            <p className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em] mt-0.5">Control Panel Node</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
          {[
            { id: 'appearance', label: 'Appearance', icon: Palette, desc: 'Visual skin & contrast' },
            { id: 'user-roles', label: 'User & Roles', icon: UsersIcon, desc: 'Access & permissions' },
            { id: 'master-data', label: 'Master Data', icon: Database, desc: 'Global resource nodes' },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveView(item.id as any)}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] text-sm transition-all group ${activeView === item.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <div className={`p-2.5 rounded-xl transition-all ${activeView === item.id ? 'bg-white/20' : 'bg-gray-50 dark:bg-gray-800 group-hover:bg-white dark:group-hover:bg-gray-700'}`}>
                <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div className="text-left">
                <p className="font-black leading-none mb-1">{item.label}</p>
                <p className={`text-[10px] font-medium ${activeView === item.id ? 'text-blue-100' : 'text-gray-400'}`}>{item.desc}</p>
              </div>
              {activeView === item.id && <ChevronRight className="w-4 h-4 ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg transition-all shadow-md ${canEdit ? 'bg-blue-600 rotate-3' : 'bg-green-600'}`}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-black leading-none mb-1.5 text-ellipsis overflow-hidden whitespace-nowrap max-w-[140px]">{currentUser.name}</p>
              <div className="flex items-center gap-1.5">
                {currentUser.role === 'owner' ? <Shield className="w-3 h-3 text-blue-500" /> : <div className="w-2 h-2 rounded-full bg-green-500" />}
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{currentUser.role === 'owner' ? 'Global Admin' : currentUser.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Settings Content */}
      <main className="flex-1 overflow-y-auto p-12 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'appearance' && (
                <AppearanceSettings darkMode={darkMode} setDarkMode={setDarkMode} />
              )}

              {activeView === 'user-roles' && (
                <UserRolesHub 
                  currentUser={currentUser}
                  users={users}
                  setUsers={setUsers}
                  rolePermissions={rolePermissions}
                  setRolePermissions={setRolePermissions}
                  availableRoles={availableRoles}
                  setAvailableRoles={setAvailableRoles}
                  canEdit={canEdit}
                />
              )}

              {activeView === 'master-data' && (
                <MasterDataHub 
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
                  selectedProject={selectedProject}
                  currentUser={currentUser}
                  canEdit={canEdit}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

