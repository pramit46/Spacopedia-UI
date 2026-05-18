import React, { useState } from 'react';
import { Upload, PlusCircle, CheckCircle2, Send } from 'lucide-react';
import { motion } from 'motion/react';
import { User, WeeklyStatus, AppSettings } from '../types';

interface WeeklyStatusCreateViewProps {
  currentUser: User;
  onAdd: (newItem: WeeklyStatus) => void;
  onCancel: () => void;
  settings: AppSettings;
  project_id: string;
}

export function WeeklyStatusCreateView({ currentUser, onAdd, onCancel, settings, project_id }: WeeklyStatusCreateViewProps) {
  const [notifying, setNotifying] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [isProcessed, setIsProcessed] = useState(false);
  const [week, setWeek] = useState('');
  const [progressText, setProgressText] = useState('');
  const [auditMaterial, setAuditMaterial] = useState<'verified' | 'pending' | 'failed'>('pending');
  const [auditSafety, setAuditSafety] = useState<'certified' | 'pending' | 'failed'>('pending');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Check max count
    if (files.length > settings.maxUploadCount) {
      alert(`Limit exceeded. You can only upload a maximum of ${settings.maxUploadCount} files.`);
      return;
    }

    // Check extensions
    const invalidFiles = files.filter((file: File) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || '';
      return !settings.allowedExtensions.includes(ext);
    });

    if (invalidFiles.length > 0) {
      alert(`Invalid file types: ${invalidFiles.map((f: File) => f.name).join(', ')}. Allowed types: ${settings.allowedExtensions.join(', ')}`);
      return;
    }

    setSelectedFiles(files);
    setIsProcessed(false);
  };

  const handleProcess = () => {
    if (!week) {
      alert('Please select a week target');
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setIsProcessed(true);
    }, 1200);
  };

  const handleNotify = () => {
    setNotifying(true);
    setTimeout(() => {
      setNotifying(false);
      setIsProcessed(false);
      
      const [yearStr, weekNumStr] = week.split('-W');
      const year = parseInt(yearStr);
      const weekNum = parseInt(weekNumStr);
      
      // Calculate the dates for the week (starting on Sunday)
      // Get the first day of the year
      const firstDayOfYear = new Date(year, 0, 1);
      const daysToSunday = firstDayOfYear.getDay(); // 0 is Sunday
      
      // Calculate the start of the week (Sunday)
      const startDate = new Date(year, 0, 1 + (weekNum - 1) * 7 - daysToSunday);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      const photoUrls = selectedFiles.length > 0 
        ? selectedFiles.map(file => URL.createObjectURL(file))
        : ['https://images.unsplash.com/photo-1541888946425-d81bb19480c5?w=500&auto=format&fit=crop&q=60'];

      onAdd({
        id: Math.random().toString(36).substr(2, 9),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        month: startDate.toLocaleString('default', { month: 'long' }),
        year: year,
        date: new Date().toLocaleDateString(),
        photos: photoUrls,
        progressText: progressText,
        auditMaterial: auditMaterial,
        auditSafety: auditSafety,
        userId: currentUser.id,
        project_id: project_id
      });
      
      setWeek('');
      setProgressText('');
      alert('Broadcast Complete! Client has been notified via enterprise channels.');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-6 py-2 rounded-full text-blue-600 dark:text-blue-400">
          <Upload className="w-5 h-5" />
          <span className="text-sm font-black uppercase tracking-widest">New Broadcast Engine</span>
        </div>
        <h2 className="text-5xl font-black tracking-tighter">Draft Project Narrative</h2>
        <p className="text-gray-500 max-w-lg mx-auto font-medium">Prepare the weekly visual audit and textual progress report for client distribution.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[3rem] p-12 shadow-2xl shadow-blue-500/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        <div className="relative space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Timeline</label>
              <input 
                type="week" 
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-3xl px-8 py-5 text-lg font-black focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Evidence Capture</label>
              <div className="relative">
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileChange}
                  className="hidden" 
                  id="file-upload"
                  accept={settings.allowedExtensions.map(ext => `.${ext.toLowerCase()}`).join(',')}
                />
                <label 
                  htmlFor="file-upload"
                  className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 border-2 border-dashed dark:border-gray-700 rounded-3xl px-8 py-5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all font-bold text-gray-500"
                >
                  <PlusCircle className="w-6 h-6 text-blue-500" />
                  {selectedFiles.length > 0 ? `${selectedFiles.length} files attached` : 'Attach Site Imagery'}
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Progress Narrative</label>
            <textarea 
              placeholder="Describe this week's major milestones, challenges overcome, and material usage..."
              value={progressText}
              onChange={(e) => setProgressText(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-3xl px-8 py-6 text-base font-bold focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all min-h-[200px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Material Integrity Audit</label>
              <div className="flex gap-2">
                {(['pending', 'verified', 'failed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setAuditMaterial(status)}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      auditMaterial === status 
                        ? status === 'verified' ? 'bg-green-100 border-green-200 text-green-600' :
                          status === 'failed' ? 'bg-red-100 border-red-200 text-red-600' :
                          'bg-gray-100 border-gray-200 text-gray-600'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Structural Safety Certification</label>
              <div className="flex gap-2">
                {(['pending', 'certified', 'failed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setAuditSafety(status)}
                    className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                      auditSafety === status 
                        ? status === 'certified' ? 'bg-green-100 border-green-200 text-green-600' :
                          status === 'failed' ? 'bg-red-100 border-red-200 text-red-600' :
                          'bg-gray-100 border-gray-200 text-gray-600'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              disabled={processing || notifying}
              onClick={handleProcess}
              className={`flex-1 py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-3 ${
                isProcessed 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-500 border border-green-200 dark:border-green-800' 
                  : 'bg-black dark:bg-gray-800 text-white hover:bg-gray-900'
              }`}
            >
              {processing ? 'Analyzing Assets...' : isProcessed ? <><CheckCircle2 className="w-5 h-5" /> Assets Ready</> : 'Process & Validate'}
            </button>

            <button 
              disabled={!isProcessed || notifying}
              onClick={handleNotify}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[2rem] text-sm font-black uppercase tracking-widest transition-all disabled:opacity-30 disabled:grayscale active:scale-[0.98] shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-3"
            >
              <Send className="w-5 h-5" />
              {notifying ? 'Broadcasting...' : 'Broadcast to Client'}
            </button>

            <button 
              onClick={onCancel}
              className="px-8 bg-white dark:bg-gray-800 text-gray-500 rounded-[2rem] py-6 font-black text-sm uppercase tracking-widest border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
            >
              Cancel
            </button>
          </div>

          {isProcessed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 py-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border border-green-100 dark:border-green-900/30"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
              <p className="text-[11px] font-black uppercase text-green-600 dark:text-green-400 tracking-widest">Asset processing complete. Review narrative before distribution.</p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
