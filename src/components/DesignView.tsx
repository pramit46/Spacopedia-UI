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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black mb-2">Design Versions</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage and view 2D/3D design iterations for this project.</p>
        </div>
        {(currentUser.role === 'designer' || currentUser.role === 'owner') && (
          <button className="flex items-center gap-2 bg-gray-900 dark:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 dark:hover:bg-blue-700 transition-all shadow-lg active:scale-95">
            <Upload className="w-4 h-4" />
            Upload New Version
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Version</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date Uploaded</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Modification Details</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">File</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {items.map((v) => {
                const canDelete = currentUser.role === 'owner' || v.userId === currentUser.id;
                return (
                  <tr key={v.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-black rounded-lg">
                        {v.version}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">{v.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-md">{v.description}</td>
                    <td className="px-6 py-4">
                      <button className="flex items-center gap-2 text-blue-600 hover:underline text-sm font-medium">
                        <FileText className="w-4 h-4" />
                        {v.fileName}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canDelete && (
                        <button 
                          onClick={() => onDelete(v.id)}
                          title="Delete version"
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all md:opacity-0 group-hover:opacity-100"
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
