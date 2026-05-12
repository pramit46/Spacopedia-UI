import React, { useState } from 'react';
import { User, Role, RolePermission } from '../../mockData';
import { UserManagement } from './UserManagement';
import { RoleManagement } from './RoleManagement';
import { Users, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UserRolesHubProps {
  currentUser: User;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  rolePermissions: RolePermission[];
  setRolePermissions: React.Dispatch<React.SetStateAction<RolePermission[]>>;
  availableRoles: Role[];
  setAvailableRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  canEdit: boolean;
}

export function UserRolesHub({
  currentUser,
  users,
  setUsers,
  rolePermissions,
  setRolePermissions,
  availableRoles,
  setAvailableRoles,
  canEdit
}: UserRolesHubProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users');

  const tabs = [
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'roles', label: 'Access Matrix', icon: Lock },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black mb-2 italic">User & Access Control</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Manage team members and define granular permission boundaries.</p>
      </header>

      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'users' && (
              <UserManagement 
                users={users}
                setUsers={setUsers}
                currentUser={currentUser}
                availableRoles={availableRoles}
                canEdit={canEdit}
              />
            )}
            {activeTab === 'roles' && (
              <RoleManagement 
                rolePermissions={rolePermissions}
                setRolePermissions={setRolePermissions}
                availableRoles={availableRoles}
                setAvailableRoles={setAvailableRoles}
                canEdit={canEdit}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
