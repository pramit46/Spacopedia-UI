import React from 'react';
import { Upload, FileText, Trash2, Box, ExternalLink } from 'lucide-react';
import { User, DesignVersion } from '../mockData';

interface DesignViewProps {
  currentUser: User;
  items: DesignVersion[];
  onDelete: (id: string) => void;
}

export function DesignView({ currentUser, items, onDelete }: DesignViewProps) {
  return (
    <div className="flex flex-col gap-10 font-sans">
      <header className="flex justify-between items-end bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-xl shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest italic mb-2">
            <Box className="w-4 h-4" />
            <span>Engineering & R&D</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">Design Iterations</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Centralized visualization repository for iterative prototypes</p>
        </div>
        {(currentUser.role === 'designer' || currentUser.role === 'owner') && (
          <button className="flex items-center gap-3 bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all">
            <Upload className="w-5 h-5" />
            Upload Concept
          </button>
        )}
      </header>

      <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-8">#</th>
                <th className="px-6 py-8">Execution Timestamp</th>
                <th className="px-6 py-8">Structural Notes & Scope</th>
                <th className="px-6 py-8">Asset Identification</th>
                <th className="px-10 py-8 text-right">Administrative</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {items.map((v, index) => {
                const canDelete = currentUser.role === 'owner' || v.userId === currentUser.id;
                return (
                  <tr key={v.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-900/40 transition-all">
                    <td className="px-10 py-8">
                       <span className="text-[10px] font-black text-gray-400">#{String(index + 1).padStart(2, '0')}</span>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-gray-800 dark:text-gray-100 italic">{v.date}</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Fiscal Record</span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">{v.description}</p>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-blue-600 hover:underline cursor-pointer tracking-tight">{v.fileName}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Concept Blueprint</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all" title="View Detail">
                          <ExternalLink className="w-5 h-5" />
                        </button>
                        {canDelete && (
                          <button 
                            onClick={() => onDelete(v.id)}
                            className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-red-600 hover:text-white rounded-xl transition-all text-gray-300"
                            title="Purge Record"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
