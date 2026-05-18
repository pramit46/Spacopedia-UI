import React, { useState } from 'react';
import { Upload, FileText, Trash2, Box, ExternalLink, X, Plus } from 'lucide-react';
import { User } from './objects/user';
import { DesignVersion } from './objects/design';
import { motion, AnimatePresence } from 'motion/react';

interface DesignViewProps {
  currentUser: User;
  items: DesignVersion[];
  onDelete: (id: string) => void;
  onAdd?: (v: DesignVersion) => void;
  project_id: string;
}

export function DesignView({ currentUser, items, onDelete, onAdd, project_id }: DesignViewProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const filteredItems = items.filter(v => v.project_id === project_id);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      onDelete(itemToDelete);
      setItemToDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-10 font-sans p-4">
      <header className="flex justify-between items-end bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-xl shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest italic mb-2">
            <Box className="w-4 h-4" />
            <span>Engineering & R&D</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">Design Iterations</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Centralized visualization repository for iterative prototypes</p>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Project: {project_id}</p>
        </div>
        {(currentUser.role === 'designer' || currentUser.role === 'owner') && (
          <button 
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-3 bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
          >
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
              {filteredItems.map((v, index) => {
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
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 max-w-lg leading-relaxed">{v.description || 'No description provided for this iteration.'}</p>
                    </td>
                    <td className="px-6 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-blue-600 hover:underline cursor-pointer tracking-tight">{v.fileName}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Concept {v.version}</p>
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
                            onClick={() => handleDeleteClick(v.id)}
                            className="p-3 bg-gray-50 dark:border-gray-800 hover:bg-red-600 hover:text-white rounded-xl transition-all text-gray-300"
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
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-gray-400 font-black tracking-widest uppercase text-xs italic">
                    No iterations documented for this architectural cycle
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-10">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-black italic mb-2">Inject Concept</h3>
                  <p className="text-gray-500 font-medium tracking-tight">Iterate on the architectural vision with a new version.</p>
                </div>

                <form className="space-y-6" onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newVersion: DesignVersion = {
                    id: Math.random().toString(36).substr(2, 9),
                    project_id: project_id,
                    version: `V${filteredItems.length + 1}.0`,
                    date: new Date().toISOString().split('T')[0],
                    description: formData.get('description') as string,
                    fileName: (formData.get('file') as File)?.name || 'concept.pdf',
                    userId: currentUser.id
                  };
                  onAdd?.(newVersion);
                  setShowUpload(false);
                }}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Iteration Description</label>
                    <textarea 
                      name="description"
                      rows={3}
                      placeholder="Functional and visual changes in this version..." 
                      className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-blue-600 outline-none font-medium resize-none shadow-inner"
                      required
                    />
                  </div>
                  
                  <div className="relative group">
                    <input name="file" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[1.5rem] p-8 text-center group-hover:border-blue-200 dark:hover:border-blue-900/30 transition-all">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover:text-blue-500">Attach Asset identification</p>
                      <p className="text-[9px] text-gray-300 mt-1 uppercase">Blueprint, Render or Technical Doc</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-10">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                      Execute Upload
                    </button>
                    <button 
                      type="button"
                      onClick={() => setShowUpload(false)}
                      className="px-10 bg-gray-100 dark:bg-gray-800 text-gray-500 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {itemToDelete && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-2xl w-full max-w-md overflow-hidden p-10 text-center"
            >
               <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trash2 className="w-10 h-10 text-red-500" />
               </div>
               <h3 className="text-2xl font-black italic mb-3 tracking-tighter">Purge version record?</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed italic">This design version and its associated blueprints will be permanently removed from the archive.</p>
               <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={confirmDelete}
                    className="py-5 rounded-[2rem] bg-red-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 active:scale-95 transition-all"
                  >
                    Confirm Purge
                  </button>
                  <button 
                    onClick={() => setItemToDelete(null)}
                    className="py-5 rounded-[2rem] bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-[10px] uppercase tracking-[0.2em] active:scale-95 transition-all"
                  >
                    Retain status
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
