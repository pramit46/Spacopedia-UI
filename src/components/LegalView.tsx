import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  ChevronLeft,
  Plus,
  Upload,
  ExternalLink,
  Trash2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from './objects/user';

interface LegalViewProps {
  currentUser: User;
  project_id: string;
}

export function LegalView({ currentUser, project_id }: LegalViewProps) {
  const [showUpload, setShowUpload] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [documents, setDocuments] = useState([
    { id: 'L1', name: 'Service Agreement - Revision 2', type: 'Contract', date: '2024-01-15', status: 'Signed', size: '2.4 MB' },
    { id: 'L2', name: 'Site Safety Liability Waiver', type: 'Compliance', date: '2024-02-01', status: 'Signed', size: '1.1 MB' },
    { id: 'L3', name: 'Non-Disclosure Agreement', type: 'Legal', date: '2023-12-10', status: 'Signed', size: '850 KB' },
    { id: 'L4', name: 'Interim Change Order #04', type: 'Addendum', date: '2024-05-20', status: 'Pending Review', size: '4.2 MB' },
  ]);

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setDocuments(docs => docs.filter(d => d.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newDoc = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      type: 'Instrument',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      size: '0.1 MB'
    };
    setDocuments([...documents, newDoc]);
    setShowUpload(false);
  };

  return (
    <div className="flex flex-col gap-10 font-sans p-4">
      <header className="flex justify-between items-end bg-white dark:bg-gray-950 p-10 rounded-[3rem] border dark:border-gray-800 shadow-xl shrink-0">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-widest italic mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span>Compliance Repository</span>
          </div>
          <h2 className="text-4xl font-black italic tracking-tighter">Legal & Instruments</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Regulatory framework for {project_id}</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="bg-blue-600 text-white px-8 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          Upload New Instrument
        </button>
      </header>

      <div className="bg-white dark:bg-gray-950 rounded-[3rem] border dark:border-gray-800 shadow-sm overflow-hidden mb-20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b dark:border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                <th className="px-10 py-8">#</th>
                <th className="px-6 py-8">Instrument Nomenclature</th>
                <th className="px-6 py-8">Execution Timestamp</th>
                <th className="px-6 py-8">Payload Size</th>
                <th className="px-10 py-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {documents.map((doc, index) => (
                <tr key={doc.id} className="group hover:bg-gray-50/30 dark:hover:bg-gray-900/40 transition-all">
                  <td className="px-10 py-8">
                    <span className="text-xs font-black text-gray-400">#{String(index + 1).padStart(2, '0')}</span>
                  </td>
                  <td className="px-6 py-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-50 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-blue-600 transition-colors">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-lg font-black italic tracking-tighter text-gray-800 dark:text-gray-100">{doc.name}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{doc.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8 text-xs font-bold text-gray-400">
                    {doc.date}
                  </td>
                  <td className="px-6 py-8 text-xs font-bold text-gray-500 italic">
                    {doc.size}
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <a 
                        href={`#${doc.id}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all" 
                        title="Open Instrument"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                      <button className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-blue-600 hover:text-white rounded-xl transition-all" title="Download">
                        <Download className="w-5 h-5" />
                      </button>
                      {(currentUser.role === 'owner' || currentUser.role === 'legal') && (
                        <button 
                          onClick={() => handleDeleteClick(doc.id)}
                          className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-red-600 hover:text-white rounded-xl transition-all text-gray-300"
                          title="Purge Record"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
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
                  <h3 className="text-3xl font-black italic mb-2">Inject Instrument</h3>
                  <p className="text-gray-500 font-medium">Capture a new regulatory document into the secure vault.</p>
                </div>

                <form className="space-y-6" onSubmit={handleUpload}>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-4">Instrument Label</label>
                    <input 
                      name="name"
                      type="text" 
                      placeholder="e.g. Master Service Agreement v3" 
                      className="w-full bg-gray-50 dark:bg-gray-900 border-none rounded-[1.5rem] p-5 focus:ring-2 focus:ring-blue-600 outline-none font-bold"
                      required
                    />
                  </div>
                  
                  <div className="relative group">
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[1.5rem] p-8 text-center group-hover:border-blue-200 dark:hover:border-blue-900/30 transition-all">
                      <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest group-hover:text-blue-500">Select Document Source</p>
                      <p className="text-[9px] text-gray-300 mt-1 uppercase">PDF, JPG or PNG (Max 10MB)</p>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-10">
                    <button type="submit" className="flex-1 bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                      Start Execution
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
               <h3 className="text-2xl font-black italic mb-3 tracking-tighter">Purge legal instrument?</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 mb-10 leading-relaxed italic">This regulatory record will be permanently deleted from the project compliance repository.</p>
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
