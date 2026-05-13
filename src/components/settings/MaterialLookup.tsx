import React from 'react';
import { Package, Search } from 'lucide-react';

export default function MaterialLookup() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black mb-2 italic">Material Inventory Lookup</h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium">Search and verify inventory specifications for structural components and finishes.</p>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            placeholder="Search material SKU, grade or brand..."
            className="w-full bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
            disabled
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm h-96 flex flex-col items-center justify-center text-center p-10">
        <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 text-gray-300">
          <Package className="w-8 h-8" />
        </div>
        <p className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2 italic">Database Initializing</p>
        <p className="text-xs font-medium text-gray-500 max-w-xs">The material lookup database is being indexed. Verified inventory records will appear here once the sync is complete.</p>
      </div>
    </div>
  );
}
