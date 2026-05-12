import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Shield, 
  LayoutDashboard, 
  Edit2, 
  Trash2, 
  Plus, 
  X, 
  Search,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Role } from '../../mockData';

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User;
  availableRoles: Role[];
  canEdit: boolean;
}

export function UserManagement({ 
  users, 
  setUsers, 
  currentUser, 
  availableRoles, 
  canEdit 
}: UserManagementProps) {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>({ key: 'name', direction: 'asc' });

  const handleUpdateUser = (updatedUser: User) => {
    if (!canEdit) return;
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    setEditingUser(null);
  };

  const updateUserRole = (userId: string, newRole: Role) => {
    if (!canEdit) return;
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const addNewUser = () => {
    if (!canEdit) return;
    const name = prompt("Enter full name:");
    if (!name) return;
    const newUser: User = {
      id: 'u' + (Date.now()),
      name: name,
      role: 'client'
    };
    setUsers(prev => [...prev, newUser]);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key: keyof User) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key].toString().toLowerCase();
    const bValue = b[key].toString().toLowerCase();
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ column }: { column: keyof User }) => {
    if (sortConfig?.key !== column) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-blue-500" /> : <ChevronDown className="w-3 h-3 ml-1 text-blue-500" />;
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2">User Directory</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Manage team members and their system-wide identity access.</p>
        </div>
        {canEdit && (
          <button 
            onClick={addNewUser} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Provision New User
          </button>
        )}
      </header>

      <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div className="relative group max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            placeholder="Filter users by name or role..."
            className="w-full bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800/50 p-1.5 rounded-xl border dark:border-gray-800">
          <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest pl-2">Sort By:</span>
          <button 
            onClick={() => requestSort('name')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortConfig?.key === 'name' ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Name <SortIcon column="name" />
          </button>
          <button 
            onClick={() => requestSort('role')}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${sortConfig?.key === 'role' ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Role <SortIcon column="role" />
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {sortedUsers.map(user => (
          <div key={user.id} className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2rem] p-6 flex items-center justify-between shadow-sm group hover:border-blue-100 dark:hover:border-blue-900/30 transition-all">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-500 ring-1 ring-gray-200 dark:ring-gray-700 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                 <UserIcon className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-black flex items-center gap-2">
                  {user.name}
                  {user.id === currentUser.id && (
                    <span className="text-[9px] font-black bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg uppercase tracking-widest border border-blue-200 dark:border-blue-800">
                      Primary Account
                    </span>
                  )}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                    ID: {user.id.slice(0, 8)}
                  </p>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700" /> 
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                    {user.role === 'owner' ? <Shield className="w-3 h-3 text-blue-500" /> : <LayoutDashboard className="w-3 h-3 text-gray-400" />} 
                    <span className="text-[9px] font-black uppercase text-gray-500 dark:text-gray-400 tracking-wider font-mono">
                       {user.role}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {canEdit && user.id !== currentUser.id && (
                <button 
                  onClick={() => setEditingUser(user)}
                  className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                  title="Modify Node Access"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              
              {canEdit && user.id !== currentUser.id ? (
                <div className="flex items-center gap-4">
                  <select 
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as Role)}
                    className="appearance-none bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer hidden md:block"
                  >
                     {availableRoles.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  <button 
                    className="text-red-500 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    onClick={() => {
                       if(confirm(`Are you sure you want to de-provision ${user.name}?`)) {
                         setUsers(prev => prev.filter(u => u.id !== user.id));
                       }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pr-4">
                  Immutable Account
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="px-10 py-8 border-b dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                <div>
                  <h3 className="text-2xl font-black italic">Access Node Config</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Modifying identity signature</p>
                </div>
                <button 
                  onClick={() => setEditingUser(null)} 
                  className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:scale-110 transition-all border dark:border-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form className="p-10 space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleUpdateUser({
                  ...editingUser,
                  name: formData.get('name') as string,
                  role: formData.get('role') as Role
                });
              }}>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Signature Label</label>
                  <input 
                    name="name"
                    defaultValue={editingUser.name}
                    className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none font-bold"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Security Role</label>
                  <select 
                    name="role"
                    defaultValue={editingUser.role}
                    className="w-full bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-2xl px-6 py-4 text-sm focus:ring-4 focus:ring-blue-500/10 outline-none font-bold cursor-pointer"
                  >
                    {availableRoles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                  </select>
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] text-xs uppercase tracking-widest transition-all shadow-xl shadow-blue-500/20 active:scale-95">
                    Sync Changes
                  </button>
                  <button type="button" onClick={() => setEditingUser(null)} className="px-8 bg-gray-100 dark:bg-gray-800 text-gray-500 font-black rounded-[2rem] text-xs uppercase tracking-widest transition-all">
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
