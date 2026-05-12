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
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Role, 
  RolePermission, 
  Vendor,
  MaterialMaster,
  ManpowerMaster,
  ClientMaster,
  INITIAL_ROLES
} from '../mockData';

// Modular Components
import { UserManagement } from './settings/UserManagement';
import { RoleManagement } from './settings/RoleManagement';
import { MasterData } from './settings/MasterData';

interface SettingsPageProps {
  currentUser: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  rolePermissions: RolePermission[];
  setRolePermissions: React.Dispatch<React.SetStateAction<RolePermission[]>>;
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  materials: MaterialMaster[];
  setMaterials: React.Dispatch<React.SetStateAction<MaterialMaster[]>>;
  manpower: ManpowerMaster[];
  setManpower: React.Dispatch<React.SetStateAction<ManpowerMaster[]>>;
  clients: ClientMaster[];
  setClients: React.Dispatch<React.SetStateAction<ClientMaster[]>>;
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
  materials,
  setMaterials,
  manpower,
  setManpower,
  clients,
  setClients,
  darkMode, 
  setDarkMode, 
  onClose 
}: SettingsPageProps) {
  const [activeView, setActiveView] = useState<'appearance' | 'users' | 'roles' | 'master-data'>('appearance');
  const [availableRoles, setAvailableRoles] = useState<Role[]>(INITIAL_ROLES);

  const canEdit = currentUser.role === 'owner';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 flex transition-colors duration-300">
      {/* Settings Sidebar */}
      <aside className="w-72 border-r dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col pt-8">
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

        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => setActiveView('appearance')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-black transition-all ${activeView === 'appearance' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Palette className={`w-5 h-5 transition-transform duration-500 ${activeView === 'appearance' ? 'scale-110' : ''}`} />
            Appearance
            {activeView === 'appearance' && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
          
          <button 
            onClick={() => setActiveView('users')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-black transition-all ${activeView === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <UsersIcon className={`w-5 h-5 transition-transform duration-500 ${activeView === 'users' ? 'scale-110' : ''}`} />
            User Management
            {activeView === 'users' && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>

          <button 
            onClick={() => setActiveView('roles')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-black transition-all ${activeView === 'roles' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Lock className={`w-5 h-5 transition-transform duration-500 ${activeView === 'roles' ? 'scale-110' : ''}`} />
            Role & Permission Layer
            {activeView === 'roles' && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>

          <button 
            onClick={() => setActiveView('master-data')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] text-sm font-black transition-all ${activeView === 'master-data' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
          >
            <Database className={`w-5 h-5 transition-transform duration-500 ${activeView === 'master-data' ? 'scale-110' : ''}`} />
            Master Repository
            {activeView === 'master-data' && <ChevronRight className="w-4 h-4 ml-auto" />}
          </button>
        </nav>

        <div className="p-8 border-t dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg transition-all shadow-md ${canEdit ? 'bg-blue-600 rotate-3' : 'bg-green-600'}`}>
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-black leading-none mb-1.5">{currentUser.name}</p>
              <div className="flex items-center gap-1.5">
                {currentUser.role === 'owner' ? <Shield className="w-3 h-3 text-blue-500" /> : <div className="w-2 h-2 rounded-full bg-green-500" />}
                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{currentUser.role === 'owner' ? 'Global Admin' : currentUser.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Settings Content */}
      <main className="flex-1 overflow-y-auto p-12">
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
                <div className="space-y-10">
                  <header>
                    <h2 className="text-3xl font-black mb-2 tracking-tight">System Aesthetics</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-medium italic">"Configure the visual delivery layer for optimal project oversight."</p>
                  </header>
                  
                  <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm transition-all hover:shadow-xl group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-8">
                        <div className={`p-5 rounded-[2rem] transition-all duration-700 ${darkMode ? 'bg-blue-950 text-blue-400 ring-4 ring-blue-900/20 rotate-12' : 'bg-orange-50 text-orange-500 ring-4 ring-orange-100 -rotate-12'}`}>
                          {darkMode ? <Moon className="w-10 h-10" /> : <Sun className="w-10 h-10" />}
                        </div>
                        <div>
                          <h3 className="text-2xl font-black mb-2 tracking-tight">Global Color Mode</h3>
                          <p className="text-sm text-gray-500 max-w-sm font-medium leading-relaxed">Adjust the high-contrast display for daylight verification or focused night audits.</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setDarkMode(!darkMode)}
                        className={`w-20 h-10 rounded-full relative transition-all duration-500 ${darkMode ? 'bg-blue-600 shadow-inner' : 'bg-gray-200 shadow-inner'} active:scale-95`}
                      >
                        <div className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-2xl transition-transform duration-500 flex items-center justify-center ${darkMode ? 'translate-x-10' : ''}`}>
                          {darkMode ? <Moon className="w-4 h-4 text-blue-600" /> : <Sun className="w-4 h-4 text-orange-500" />}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'users' && (
                <UserManagement 
                   users={users}
                   setUsers={setUsers}
                   currentUser={currentUser}
                   availableRoles={availableRoles}
                   canEdit={canEdit}
                />
              )}

              {activeView === 'roles' && (
                <RoleManagement 
                   rolePermissions={rolePermissions}
                   setRolePermissions={setRolePermissions}
                   availableRoles={availableRoles}
                   setAvailableRoles={setAvailableRoles}
                   canEdit={canEdit}
                />
              )}

              {activeView === 'master-data' && (
                <MasterData 
                   vendors={vendors}
                   setVendors={setVendors}
                   materials={materials}
                   setMaterials={setMaterials}
                   manpower={manpower}
                   setManpower={setManpower}
                   clients={clients}
                   setClients={setClients}
                   users={users}
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

