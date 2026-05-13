import React, { useState } from 'react';
import { 
  Image as ImageIcon, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  X, 
  Star, 
  StarOff, 
  Send, 
  ShieldCheck,
  ExternalLink 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, WeeklyStatus, ChatMessage } from '../mockData';

interface WeeklyStatusViewProps {
  currentUser: User;
  items: WeeklyStatus[];
  selectedId: string | null;
  onDelete: (id: string) => void;
  onUpdateComments: (id: string, comments: ChatMessage[]) => void;
  onUpdateProgressText: (id: string, text: string) => void;
}

export function WeeklyStatusView({ 
  currentUser, 
  items, 
  selectedId, 
  onDelete, 
  onUpdateComments, 
  onUpdateProgressText 
}: WeeklyStatusViewProps) {
  const [activeCommentLogId, setActiveCommentLogId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isEditingProgress, setIsEditingProgress] = useState(false);
  const [tempProgressText, setTempProgressText] = useState('');

  const selectedLog = items.find(i => i.id === selectedId);
  const activeLogForChat = items.find(i => i.id === activeCommentLogId);

  const canManage = ['owner', 'project', 'accounts'].includes(currentUser.role);

  const addComment = (logId: string) => {
    if (!newComment.trim()) return;
    const log = items.find(i => i.id === logId);
    if (!log) return;

    const newChat: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      userId: currentUser.id,
      userName: currentUser.name,
      text: newComment,
      timestamp: new Date().toLocaleString(),
      starred: false
    };

    onUpdateComments(logId, [...(log.comments || []), newChat]);
    setNewComment('');
  };

  const toggleStar = (logId: string, commentId: string) => {
    const log = items.find(i => i.id === logId);
    if (!log || !log.comments) return;

    const updatedComments = log.comments.map(c => 
      c.id === commentId ? { ...c, starred: !c.starred } : c
    );
    onUpdateComments(logId, updatedComments);
  };

  const handleSaveProgress = () => {
    if (selectedId) {
      onUpdateProgressText(selectedId, tempProgressText);
      setIsEditingProgress(false);
    }
  };

  if (!selectedLog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mb-6 text-gray-300">
          <ImageIcon className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black mb-2">No Week Selected</h3>
        <p className="text-gray-500 max-w-xs">Select a week from the sidebar to view project status and feedback.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-2 px-1">Phase Verification Log</div>
          <h2 className="text-4xl font-black tracking-tight">
            {new Date(selectedLog.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {new Date(selectedLog.endDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Logged on {selectedLog.date} by System Node</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveCommentLogId(selectedLog.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all shadow-xl active:scale-95 ${
              selectedLog.comments?.length 
                ? 'bg-blue-600 text-white shadow-blue-500/30 ring-4 ring-blue-500/10' 
                : 'bg-white dark:bg-gray-800 text-gray-500 border dark:border-gray-700'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            {selectedLog.comments?.length || 0} Discussions
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Progress Summary</h4>
            {isEditingProgress ? (
              <div className="space-y-4">
                <textarea 
                  className="w-full bg-gray-50 dark:bg-gray-800 border-2 border-blue-100 dark:border-blue-900/30 rounded-3xl p-6 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 focus:outline-none min-h-[150px]"
                  value={tempProgressText}
                  onChange={(e) => setTempProgressText(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-3">
                  <button 
                    onClick={handleSaveProgress}
                    className="flex-1 bg-blue-600 text-white rounded-2xl py-3 font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                  >
                    Commit Update
                  </button>
                  <button 
                    onClick={() => setIsEditingProgress(false)}
                    className="px-6 bg-white dark:bg-gray-800 text-gray-500 rounded-2xl py-3 font-black text-xs uppercase tracking-widest border dark:border-gray-700"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className={`group relative p-6 rounded-3xl border-2 border-transparent transition-all ${canManage ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:border-blue-50 cursor-pointer' : ''}`}
                onClick={() => {
                  if (canManage) {
                    setTempProgressText(selectedLog.progressText || '');
                    setIsEditingProgress(true);
                  }
                }}
              >
                <div className="text-lg leading-relaxed font-bold text-gray-700 dark:text-gray-300 italic">
                  "{selectedLog.progressText || 'No detailed progress status provided for this week.'}"
                </div>
                {canManage && (
                  <div className="absolute top-4 right-4 p-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-[2.5rem] p-8">
            <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-4 px-1">Final Quality Audit</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
                <span className="text-sm font-bold">Material Integrity</span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                  selectedLog.auditMaterial === 'verified' ? 'bg-green-100 text-green-600' :
                  selectedLog.auditMaterial === 'failed' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {selectedLog.auditMaterial || 'pending'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
                <span className="text-sm font-bold">Structural Safety</span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                  selectedLog.auditSafety === 'certified' ? 'bg-green-100 text-green-600' :
                  selectedLog.auditSafety === 'failed' ? 'bg-red-100 text-red-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {selectedLog.auditSafety || 'pending'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {selectedLog.photos.map((src, idx) => {
              // Creating a thumbnail version if it's an unsplash URL
              const thumbUrl = src.includes('unsplash.com') 
                ? src.replace(/w=\d+/, 'w=400').replace(/q=\d+/, 'q=60') 
                : src;
              
              return (
                <div 
                  key={idx} 
                  className="group relative aspect-[4/3] rounded-3xl overflow-hidden shadow-md border-2 dark:border-gray-800 cursor-pointer active:scale-95 transition-transform"
                  onClick={() => window.open(src, '_blank')}
                >
                  <img 
                    src={thumbUrl} 
                    alt="Status Thumbnail" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">Observation Node {idx + 1}</p>
                    <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                       Show Full Resolution
                       <ExternalLink className="w-3 h-3" />
                    </p>
                  </div>
                </div>
              );
            })}
            {selectedLog.photos.length === 1 && (
              <div className="aspect-[4/3] rounded-3xl border-2 border-dashed dark:border-gray-800 flex flex-col items-center justify-center text-gray-400 bg-gray-50/30 dark:bg-gray-900/20">
                <ImageIcon className="w-8 h-8 opacity-20 mb-2" />
                <p className="text-[10px] uppercase font-bold">No alternate angles</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeCommentLogId && activeLogForChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              className="bg-white dark:bg-gray-950 w-full max-w-2xl h-[80vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border dark:border-gray-800"
            >
              {/* Header */}
              <div className="px-10 py-8 border-b dark:border-gray-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-900/10">
                <div>
                  <div className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Feedback Thread</div>
                  <h3 className="text-2xl font-black">
                    {new Date(activeLogForChat.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(activeLogForChat.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </h3>
                </div>
                <button 
                  onClick={() => setActiveCommentLogId(null)}
                  className="p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:scale-110 transition-all border dark:border-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth no-scrollbar">
                {(!activeLogForChat.comments || activeLogForChat.comments.length === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-6">
                    <div className="w-20 h-20 rounded-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center border-2 border-dashed dark:border-gray-800">
                      <MessageSquare className="w-10 h-10 opacity-20" />
                    </div>
                    <p className="font-bold text-lg">No feedback collected yet</p>
                  </div>
                ) : (
                  activeLogForChat.comments.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.userId === currentUser.id ? 'items-end' : 'items-start'} group/msg relative`}
                    >
                      <div className="flex items-center gap-3 mb-2 px-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">{msg.userName}</span>
                        <span className="text-[10px] font-medium text-gray-300">{msg.timestamp}</span>
                      </div>
                      <div className="relative">
                        <div className={`max-w-md px-6 py-4 rounded-[2rem] text-sm font-bold shadow-sm ${
                          msg.userId === currentUser.id 
                            ? 'bg-blue-600 text-white rounded-tr-none' 
                            : 'bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-tl-none'
                        } ${msg.starred ? 'ring-2 ring-blue-500 ring-offset-4 dark:ring-offset-gray-950' : ''}`}>
                          {msg.text}
                        </div>
                        
                        <button 
                          onClick={() => toggleStar(activeLogForChat.id, msg.id)}
                          className={`absolute top-1/2 -translate-y-1/2 p-2 rounded-full transition-all ${
                            msg.userId === currentUser.id ? '-left-10' : '-right-10'
                          } ${
                            msg.starred 
                              ? 'text-blue-500 scale-110' 
                              : 'text-gray-300 opacity-0 group-hover/msg:opacity-100 hover:text-blue-400'
                          }`}
                        >
                          {msg.starred ? <Star className="w-5 h-5 fill-current" /> : <StarOff className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input Area */}
              <div className="p-8 border-t dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/20">
                <form 
                  className="flex gap-4 p-2 bg-white dark:bg-gray-900 rounded-[2rem] border-2 dark:border-gray-800 shadow-xl focus-within:ring-4 focus-within:ring-blue-500/10 transition-all"
                  onSubmit={(e) => {
                    e.preventDefault();
                    addComment(activeLogForChat.id);
                  }}
                >
                  <input 
                    placeholder="Drop your feedback or notes here..."
                    className="flex-1 bg-transparent px-6 py-4 text-sm font-bold outline-none"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className="aspect-square bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full transition-all active:scale-90 shadow-lg shadow-blue-500/30"
                  >
                    <Send className="w-6 h-6" />
                  </button>
                </form>
                <p className="mt-4 text-center text-[10px] font-black uppercase text-gray-400 tracking-widest flex items-center justify-center gap-2">
                  <ShieldCheck className="w-3 h-3" />
                  End-to-end encrypted project communication
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
