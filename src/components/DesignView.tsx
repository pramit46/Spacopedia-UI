import React from 'react';
import { Upload, FileText, Trash2 } from 'lucide-react';
import { User, DesignVersion } from '../mockData';

interface DesignViewProps {
  currentUser: User;
  items: DesignVersion[];
  onDelete: (id: string) => void;
}

export function DesignView({ currentUser, items, onDelete }: DesignViewProps) {
  return (
    <div className="flex flex-col font-sans bg-white dark:bg-gray-950 min-h-screen">
      <header className="py-8 border-b dark:border-gray-800 mb-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest italic">
            <span>Engineering</span>
            <span className="text-gray-300">/</span>
            <span>Iterative Prototypes</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tight">Design Iterations</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Centralized visualization repository.</p>
        </div>
        {(currentUser.role === 'designer' || currentUser.role === 'owner') && (
          <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">
            <Upload className="w-4 h-4" />
            Upload Concept
          </button>
        )}
      </header>

      <div className="border-t dark:border-gray-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-transparent text-[10px] font-black text-gray-400 uppercase tracking-widest border-b dark:border-gray-800">
                <th className="pr-6 py-6">Timestamp</th>
                <th className="px-6 py-6">Structural Notes</th>
                <th className="px-6 py-6 font-black italic">Asset</th>
                <th className="pl-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {items.map((v) => {
                const canDelete = currentUser.role === 'owner' || v.userId === currentUser.id;
                return (
                  <tr key={v.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors group">
                    <td className="pr-6 py-8 text-sm font-bold text-gray-400">{v.date}</td>
                    <td className="px-6 py-8 text-sm text-gray-600 dark:text-gray-400 max-w-md">{v.description}</td>
                    <td className="px-6 py-8">
                      <button className="flex items-center gap-2 text-blue-600 hover:underline text-[10px] font-black uppercase tracking-widest">
                        <FileText className="w-4 h-4" />
                        {v.fileName}
                      </button>
                    </td>
                    <td className="pl-8 py-8 text-right">
                      {canDelete && (
                        <button 
                          onClick={() => onDelete(v.id)}
                          title="Purge"
                          className="p-2 text-gray-300 hover:text-red-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
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
