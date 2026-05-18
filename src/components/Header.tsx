import React from 'react';
import { 
  ChevronDown, 
  LayoutDashboard, 
  Settings as SettingsIcon 
} from 'lucide-react';
import { User } from './objects/user';
import { ClientMaster } from './objects/client';
import { Project } from './objects/project';
 
interface HeaderProps {
  currentUser: User;
  users: User[];
  clients: ClientMaster[];
  selectedProject: string;
  setSelectedProject: (id: string) => void;
  projects: Project[];
  handleImpersonationChange: (id: string) => void;
  setShowSettings: (val: boolean) => void;
  canAccessSettings?: boolean;
}

export function Header({
  currentUser,
  users,
  clients,
  selectedProject,
  setSelectedProject,
  projects,
  handleImpersonationChange,
  setShowSettings,
  canAccessSettings = false
}: HeaderProps) {
  const currentProject = projects.find(p => p.id === selectedProject);
  const currentClient = clients.find(c => c.id === currentProject?.clientId);

  return (
    <header className="border-b dark:border-gray-800 h-16 flex items-center justify-between px-6 bg-gray-50 dark:bg-gray-800/50 sticky top-0 z-40 backdrop-blur-md">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
           <img src="/image.png" alt="SPACOPEDIA Logo" className="h-16 w-auto object-contain" referrerPolicy="no-referrer" />
           <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2 hidden md:block" />
           <h1 className="text-lg font-black tracking-tight hidden md:block">Project Details</h1>
        </div>
        
        <div className="flex items-center gap-3 border-l dark:border-gray-700 pl-8 transition-all">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Project ID</span>
            <div className="relative group">
              <select 
                id="project"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="appearance-none bg-transparent font-black text-sm focus:outline-none cursor-pointer pr-6"
              >
                {Array.from(new Set(projects.map(p => p.year))).sort((a, b) => b - a).map(year => (
                  <React.Fragment key={year}>
                    {Array.from(new Set(projects.filter(p => p.year === year).map(p => p.month))).map(month => (
                      <optgroup key={`${year}-${month}`} label={`${year} — ${month}`}>
                        {projects.filter(p => p.year === year && p.month === month).map(p => (
                          <option key={p.id} value={p.id}>{p.id}</option>
                        ))}
                      </optgroup>
                    ))}
                  </React.Fragment>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-hover:text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-12">
        <div className="flex items-center gap-12">
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Client Name</span>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400">{currentClient?.name || 'N/A'}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Project Address</span>
            <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 max-w-[300px] text-right truncate" title={currentClient?.projectAddress}>
              {currentClient?.projectAddress || 'N/A'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-2 text-nowrap">
            <span className="text-[10px] text-gray-500 font-bold uppercase italic">Switch User:</span>
            <select 
              value={currentUser.id}
              onChange={(e) => handleImpersonationChange(e.target.value)}
              className="bg-gray-100 dark:bg-gray-700 border-none rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold cursor-pointer"
            >
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
              ))}
            </select>
          </div>
 
          {canAccessSettings && (
            <button 
              onClick={() => setShowSettings(true)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors relative group"
              title="Open Settings"
            >
              <SettingsIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              {currentUser.role === 'owner' && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
