import React from 'react';
import { Settings, Image, FileType, Info } from 'lucide-react';
import { AppSettings } from '../../types';

interface GeneralSettingsProps {
  settings: AppSettings;
  onUpdate: (settings: AppSettings) => void;
}

export function GeneralSettings({ settings, onUpdate }: GeneralSettingsProps) {
  const handleMaxCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...settings, maxUploadCount: parseInt(e.target.value) || 0 });
  };

  const handleExtensionToggle = (ext: string) => {
    const newExtensions = settings.allowedExtensions.includes(ext)
      ? settings.allowedExtensions.filter(e => e !== ext)
      : [...settings.allowedExtensions, ext];
    onUpdate({ ...settings, allowedExtensions: newExtensions });
  };

  const commonExtensions = ['JPG', 'JPEG', 'PNG', 'MP4', 'AVI', 'MOV', 'PDF'];

  return (
    <div className="space-y-12">
      <header>
        <h3 className="text-2xl font-black italic">General Configuration</h3>
        <p className="text-gray-500 font-medium">Fine-tune global application behavior and validation rules.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Max Upload Count */}
        <section className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
              <Image className="w-5 h-5" />
            </div>
            <h4 className="font-black italic">Upload Constraints</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-gray-500">Max Pictures/Videos per Week</label>
              <input 
                type="number"
                value={settings.maxUploadCount}
                onChange={handleMaxCountChange}
                className="w-20 bg-gray-50 dark:bg-gray-800 border dark:border-gray-700 rounded-xl px-4 py-2 text-center font-black"
              />
            </div>
            <p className="text-[10px] text-gray-400 font-bold leading-relaxed">
              Enforces a strict limit on the number of media assets a user can attach to a weekly status log. Recommended: 3-5 assets.
            </p>
          </div>
        </section>

        {/* Allowed Extensions */}
        <section className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2rem] p-8 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
              <FileType className="w-5 h-5" />
            </div>
            <h4 className="font-black italic">White-listed Formats</h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {commonExtensions.map(ext => (
              <button
                key={ext}
                onClick={() => handleExtensionToggle(ext)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                  settings.allowedExtensions.includes(ext)
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-400 hover:border-purple-200'
                }`}
              >
                {ext}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 font-bold leading-relaxed mt-4">
            Filter assets during the upload process. Only files matching these extensions will be accepted by the processing engine.
          </p>
        </section>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/10 rounded-3xl p-6 border border-blue-100 dark:border-blue-900/30 flex gap-4">
        <Info className="w-6 h-6 text-blue-600 shrink-0" />
        <p className="text-xs font-bold text-blue-600 leading-relaxed">
          Propagating these changes will instantly affect all active projects and user sessions. Ensure your server-side storage can accommodate the configured media types.
        </p>
      </div>
    </div>
  );
}
