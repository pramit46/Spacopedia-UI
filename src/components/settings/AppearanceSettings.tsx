import React from 'react';
import { Palette, Moon, Sun } from 'lucide-react';

interface AppearanceSettingsProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AppearanceSettings({ darkMode, setDarkMode }: AppearanceSettingsProps) {
  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black mb-2 tracking-tight">System Aesthetics</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium italic">"Configure the visual delivery layer for optimal project oversight."</p>
      </header>
      
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] p-10 shadow-sm transition-all hover:shadow-xl group">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className={`p-5 rounded-[2rem] transition-all duration-700 ${darkMode ? 'bg-blue-950 text-blue-400 ring-4 ring-blue-900/20 rotate-12' : 'bg-orange-50 text-orange-500 ring-4 ring-orange-100 -rotate-12'}`}>
              {darkMode ? <Moon className="w-10 h-10" /> : <Sun className="w-10 h-10" />}
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2 tracking-tight">Global Color Mode</h3>
              <p className="text-sm text-gray-500 max-w-sm font-medium leading-relaxed">Adjust the high-contrast display for daylight verification or focused night audits.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className={`w-20 h-10 rounded-full relative transition-all duration-500 ${darkMode ? 'bg-blue-600 shadow-inner' : 'bg-gray-200 shadow-inner'} active:scale-95`}
          >
            <div className={`absolute top-1 left-1 w-8 h-8 rounded-full bg-white shadow-2xl transition-transform duration-500 flex items-center justify-center ${darkMode ? 'translate-x-10' : ''}`}>
              {darkMode ? <Moon className="w-4 h-4 text-blue-600" /> : <Sun className="w-4 h-4 text-orange-500" />}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
