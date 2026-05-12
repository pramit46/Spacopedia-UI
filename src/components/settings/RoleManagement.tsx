import React, { useState } from 'react';
import { 
  Lock, 
  Shield, 
  PlusCircle, 
  CheckCircle2, 
  X, 
  FileText,
  LayoutDashboard,
  Code,
  ArrowUpDown,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Role, 
  RolePermission, 
  AVAILABLE_TABS 
} from '../../mockData';

const ICON_MAP: Record<string, any> = {
  FileText,
  ImageIcon: LayoutDashboard,
  Package: LayoutDashboard,
  GanttChartSquare: LayoutDashboard,
  CreditCard: LayoutDashboard,
  ShieldCheck: LayoutDashboard,
  LayoutDashboard,
  Settings: LayoutDashboard
};

interface RoleManagementProps {
  rolePermissions: RolePermission[];
  setRolePermissions: React.Dispatch<React.SetStateAction<RolePermission[]>>;
  availableRoles: Role[];
  setAvailableRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  canEdit: boolean;
}

export function RoleManagement({ 
  rolePermissions, 
  setRolePermissions, 
  availableRoles,
  setAvailableRoles,
  canEdit 
}: RoleManagementProps) {
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [showJson, setShowJson] = useState(false);
  const [lastGeneratedJson, setLastGeneratedJson] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: 'role'; direction: 'asc' | 'desc' } | null>({ key: 'role', direction: 'asc' });

  const requestSort = () => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: 'role', direction });
  };

  const sortedRolePermissions = [...rolePermissions].sort((a, b) => {
    if (!sortConfig) return 0;
    const { direction } = sortConfig;
    if (a.role < b.role) return direction === 'asc' ? -1 : 1;
    if (a.role > b.role) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = () => {
    if (!sortConfig) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-20 group-hover:opacity-100 transition-opacity" />;
    return sortConfig.direction === 'asc' ? <ChevronUp className="w-3 h-3 ml-1 text-blue-500" /> : <ChevronDown className="w-3 h-3 ml-1 text-blue-500" />;
  };

  const generateBackendPayload = (permissions: RolePermission[]) => {
    const payload = {
      timestamp: new Date().toISOString(),
      action: 'UPDATE_ROLE_PERMISSIONS',
      data: {
        roles: availableRoles,
        permissions: permissions
      },
      metadata: {
        version: '1.0',
        environment: 'production-simulation'
      }
    };
    const jsonString = JSON.stringify(payload, null, 2);
    setLastGeneratedJson(jsonString);
    console.log('Role Management Modification Captured:', payload);
    // In a real app, this would be sent to fetch('/api/roles', { method: 'POST', body: jsonString })
  };

  const toggleTabForRole = (role: Role, tabId: string) => {
    if (!canEdit) return;
    const newPermissions = rolePermissions.map(rp => {
      if (rp.role === role) {
        const hasTab = rp.allowedTabs.includes(tabId);
        return {
          ...rp,
          allowedTabs: hasTab 
            ? rp.allowedTabs.filter(id => id !== tabId) 
            : [...rp.allowedTabs, tabId]
        };
      }
      return rp;
    });
    setRolePermissions(newPermissions);
    generateBackendPayload(newPermissions);
  };

  const handleAddRole = (roleName: string) => {
    if (!canEdit || !roleName.trim()) return;
    const normalizedRole = roleName.trim().toLowerCase();
    if (availableRoles.includes(normalizedRole)) {
      alert("Role already exists");
      return;
    }
    const newRoles = [...availableRoles, normalizedRole];
    const newPermissions = [...rolePermissions, { role: normalizedRole, allowedTabs: [] }];
    
    setAvailableRoles(newRoles);
    setRolePermissions(newPermissions);
    setIsAddingRole(false);
    
    generateBackendPayload(newPermissions);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Roles & Permissions</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Define module access for system roles. Changes are captured as backend-ready schema updates.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowJson(!showJson)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <Code className="w-4 h-4" />
            {showJson ? 'Hide Sync Log' : 'View Sync Log'}
          </button>
          {canEdit && (
            <button 
              onClick={() => setIsAddingRole(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              New Role
            </button>
          )}
        </div>
      </header>

      <AnimatePresence>
        {showJson && lastGeneratedJson && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-gray-900 rounded-3xl p-6 mb-8 border border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Backend JSON Payload Interface</span>
                <span className="text-[10px] font-bold text-gray-500">Captured on last change</span>
              </div>
              <pre className="text-[11px] font-mono text-blue-200/80 overflow-auto max-h-[300px] leading-relaxed no-scrollbar">
                {lastGeneratedJson}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAddingRole && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-3xl"
          >
             <form className="p-8 flex flex-col md:flex-row items-end gap-6" onSubmit={(e) => {
               e.preventDefault();
               const val = (e.currentTarget.elements.namedItem('roleName') as HTMLInputElement).value;
               handleAddRole(val);
             }}>
                <div className="flex-1 space-y-2">
                  <label className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest ml-1">Role Title</label>
                  <input 
                    name="roleName"
                    placeholder="e.g. Auditor"
                    className="w-full bg-white dark:bg-gray-900 border border-blue-100 dark:border-blue-800 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 outline-none font-bold placeholder:text-gray-300"
                    required
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg">
                    Create
                  </button>
                  <button type="button" onClick={() => setIsAddingRole(false)} className="bg-white dark:bg-gray-800 text-gray-500 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest border dark:border-gray-700">
                    Exit
                  </button>
                </div>
             </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50">
                <th 
                  onClick={requestSort}
                  className="px-8 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest border-r dark:border-gray-800 w-48 cursor-pointer group"
                >
                  <div className="flex items-center">
                    System Access Nodes <SortIcon />
                  </div>
                </th>
                {AVAILABLE_TABS.map(tab => (
                  <th key={tab.id} className="px-4 py-6 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest text-center min-w-[100px]">
                    <div className="flex flex-col items-center gap-1.5">
                      {React.createElement(ICON_MAP[tab.iconName] || FileText, { className: "w-3.5 h-3.5 mb-0.5" })}
                      {tab.label}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {sortedRolePermissions.map(rp => (
                <tr key={rp.role} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-8 py-5 font-bold text-gray-700 dark:text-gray-300 border-r dark:border-gray-800">
                    <div className="flex items-center gap-2 capitalize text-sm">
                      {rp.role === 'owner' && <Shield className="w-3.5 h-3.5 text-blue-500" />}
                      {rp.role}
                    </div>
                  </td>
                  {AVAILABLE_TABS.map(tab => {
                    const isAllowed = rp.allowedTabs.includes(tab.id);
                    const isImmutable = rp.role === 'owner';
                    return (
                      <td key={tab.id} className="px-4 py-3 text-center">
                        <button 
                          onClick={() => toggleTabForRole(rp.role, tab.id)}
                          disabled={!canEdit || isImmutable}
                          className={`
                            w-8 h-8 rounded-xl flex items-center justify-center transition-all mx-auto
                            ${isAllowed 
                              ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-600 hover:bg-gray-200 dark:hover:bg-gray-750'}
                            ${(!canEdit || isImmutable) ? 'cursor-not-allowed opacity-40' : 'cursor-pointer active:scale-90'}
                          `}
                        >
                          {isAllowed ? <CheckCircle2 className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
                        </button>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {!canEdit && (
        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-[2rem] p-6 flex items-start gap-4">
          <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-blue-900 dark:text-blue-300 text-sm">Restricted Access</p>
            <p className="text-xs text-blue-700 dark:text-blue-400/80 leading-relaxed font-medium">Modification of the role security layer is restricted to system administrators. Contact your IT director for permission adjustments.</p>
          </div>
        </div>
      )}
    </div>
  );
}
