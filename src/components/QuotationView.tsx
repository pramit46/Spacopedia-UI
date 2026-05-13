import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Download, 
  Plus, 
  X, 
  ChevronRight, 
  Box, 
  Maximize2, 
  Layers, 
  HandMetal, 
  DoorOpen,
  Save,
  Trash2,
  ChevronDown,
  ChevronUp,
  Settings,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, FURNITURE_TEMPLATES, COMPONENT_PRICES } from '../mockData';

interface QuotationItem {
  id: string;
  templateId: string;
  name: string;
  category: string;
  width: number;
  height: number;
  plyType: string;
  shutterType: 'wooden' | 'glass';
  total: number;
  image: string;
}

interface QuotationViewProps {
  currentUser: User;
  projectId: string;
}

export function QuotationView({ currentUser, projectId }: QuotationViewProps) {
  const [items, setItems] = useState<QuotationItem[]>([
    { 
      id: 'it-1', 
      templateId: 't1', 
      name: 'Master Bedroom Wardrobe', 
      category: 'Bedroom',
      width: 6, 
      height: 7, 
      plyType: 'cp2', 
      shutterType: 'wooden', 
      total: 85400,
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=60'
    },
    { 
      id: 'it-2', 
      templateId: 't4', 
      name: 'Guest Dressing Unit', 
      category: 'Bedroom',
      width: 3, 
      height: 6, 
      plyType: 'cp1', 
      shutterType: 'glass', 
      total: 32500,
      image: 'https://images.unsplash.com/photo-1616486029423-aaa47a300ffe?w=800&auto=format&fit=crop&q=60'
    },
    { 
      id: 'it-3', 
      templateId: 't2', 
      name: 'Living TV Unit', 
      category: 'Living Room',
      width: 8, 
      height: 6, 
      plyType: 'cp2', 
      shutterType: 'wooden', 
      total: 45000,
      image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&auto=format&fit=crop&q=60'
    }
  ]);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [showCenter, setShowCenter] = useState(false);
  
  // State for collapsibles
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ 'Bedroom': true, 'Living Room': true });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ 'dimensions': true, 'carcass': false, 'shutter': false, 'pricing': false });

  const selectedItem = useMemo(() => items.find(i => i.id === selectedItemId), [items, selectedItemId]);
  const totalProjectValue = useMemo(() => items.reduce((acc, item) => acc + item.total, 0), [items]);

  const categories = useMemo(() => {
    const groups: Record<string, QuotationItem[]> = {};
    items.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [items]);

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id);
    setShowCenter(true);
  };

  const handleUpdateItem = (id: string, updates: Partial<QuotationItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updates };
        const template = FURNITURE_TEMPLATES.find(t => t.id === newItem.templateId);
        if (template) {
          const area = newItem.width * newItem.height;
          const totalPlySqft = area * template.rules.plywoodFactor;
          const numKnobs = Math.ceil(area * template.rules.knobFactor) || 2;
          const numHinges = Math.max(4, Math.ceil(area * 0.4));
          
          const plyPrice = COMPONENT_PRICES.find(p => p.id === newItem.plyType)?.rate || 0;
          const shutterPrice = COMPONENT_PRICES.find(p => p.id === (newItem.shutterType === 'wooden' ? 'cp4' : 'cp5'))?.rate || 0;
          const knobPrice = COMPONENT_PRICES.find(p => p.id === 'cp3')?.rate || 0;
          const hingePrice = COMPONENT_PRICES.find(p => p.id === 'cp6')?.rate || 0;

          const total = (totalPlySqft * plyPrice) + (area * shutterPrice) + (numKnobs * knobPrice) + (numHinges * hingePrice);
          newItem.total = Math.round(total);
        }
        return newItem;
      }
      return item;
    }));
  };

  const handleAddNewItem = () => {
    const template = FURNITURE_TEMPLATES[0];
    const newItem: QuotationItem = {
      id: `it-${Date.now()}`,
      templateId: template.id,
      name: `New ${template.name}`,
      category: 'Uncategorized',
      width: template.defaultWidth,
      height: template.defaultHeight,
      plyType: COMPONENT_PRICES[0].id,
      shutterType: 'wooden',
      total: 15000,
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop&q=60'
    };
    setItems(prev => [...prev, newItem]);
    handleSelectItem(newItem.id);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Remove this item from quotation?')) {
      setItems(prev => prev.filter(i => i.id !== id));
      if (selectedItemId === id) {
        setSelectedItemId(null);
        setShowCenter(false);
      }
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col font-sans bg-white dark:bg-gray-950 overflow-hidden">
      {/* Top Bar - Simplified */}
      <header className="h-20 border-b dark:border-gray-800 flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          {/* <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg">
             <ChevronLeft className="w-5 h-5 text-gray-400" />
           </button> */}
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-800 mx-2" />
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span>PROJECTS</span>
              <ChevronRight className="w-3 h-3" />
              <span>{projectId}</span>
            </div>
            <h2 className="text-xl font-black italic tracking-tight">Technical Quotation</h2>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Project Value</p>
            <p className="text-2xl font-black italic text-blue-600">₹{totalProjectValue.toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Repository (Collapsible Categories) */}
        <section className="w-72 border-r dark:border-gray-800 flex flex-col bg-gray-50/30 dark:bg-gray-900/10 transition-all shrink-0 overflow-hidden">
          <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Project Items</h3>
            <button 
              onClick={handleAddNewItem}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-blue-600 transition-all"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            {(Object.entries(categories) as [string, QuotationItem[]][]).map(([category, categoryItems]) => (
              <div key={category} className="border-b dark:border-gray-800 last:border-0">
                <button 
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{category}</span>
                  {expandedCategories[category] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                <AnimatePresence initial={false}>
                  {expandedCategories[category] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white dark:bg-transparent"
                    >
                      {categoryItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectItem(item.id)}
                          className={`w-full text-left px-8 py-5 transition-all group border-l-4 ${
                            selectedItemId === item.id 
                              ? 'border-blue-600 bg-blue-50/30 dark:bg-blue-900/10' 
                              : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800/30'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-xs font-bold leading-tight ${selectedItemId === item.id ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                              {item.name}
                            </p>
                            {selectedItemId !== item.id && (
                              <Trash2 
                                className="w-3.5 h-3.5 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all" 
                                onClick={(e) => handleDeleteItem(item.id, e)}
                              />
                            )}
                          </div>
                          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            ₹{item.total.toLocaleString()}
                          </p>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Center Column: Interactive Configurator (Collapsible Sections) */}
        <AnimatePresence mode="wait">
          {showCenter && selectedItem ? (
            <motion.section 
              key="center-panel"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 440, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r dark:border-gray-800 flex flex-col bg-white dark:bg-gray-950 shadow-xl overflow-hidden relative z-10 shrink-0"
            >
              <div className="p-8 border-b dark:border-gray-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center text-blue-600">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black italic">{selectedItem.name}</h3>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Configure Attributes</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCenter(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
                {/* 1. DIMENSIONS */}
                <div className="border-b dark:border-gray-800">
                  <button 
                    onClick={() => toggleSection('dimensions')}
                    className="w-full flex items-center justify-between p-8 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center text-[10px] font-black">1</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">Dimensions</span>
                    </div>
                    {expandedSections['dimensions'] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSections['dimensions'] && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-10 grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <p className="text-[9px] font-bold text-gray-400 uppercase">Width (ft)</p>
                             <input 
                               type="number"
                               value={selectedItem.width}
                               onChange={e => handleUpdateItem(selectedItem.id, { width: parseFloat(e.target.value) || 0 })}
                               className="w-full bg-gray-50 dark:bg-gray-900 p-3 rounded-xl font-bold border-transparent border-b-2 border-b-blue-100 dark:border-b-blue-900/30 focus:border-b-blue-600 outline-none text-sm transition-all"
                             />
                           </div>
                           <div className="space-y-2">
                             <p className="text-[9px] font-bold text-gray-400 uppercase">Height (ft)</p>
                             <input 
                               type="number"
                               value={selectedItem.height}
                               onChange={e => handleUpdateItem(selectedItem.id, { height: parseFloat(e.target.value) || 0 })}
                               className="w-full bg-gray-50 dark:bg-gray-900 p-3 rounded-xl font-bold border-transparent border-b-2 border-b-blue-100 dark:border-b-blue-900/30 focus:border-b-blue-600 outline-none text-sm transition-all"
                             />
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 2. CARCASS */}
                <div className="border-b dark:border-gray-800">
                  <button 
                    onClick={() => toggleSection('carcass')}
                    className="w-full flex items-center justify-between p-8 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded bg-orange-50 dark:bg-orange-900/30 text-orange-600 flex items-center justify-center text-[10px] font-black">2</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">Carcass</span>
                    </div>
                    {expandedSections['carcass'] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSections['carcass'] && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-10 space-y-6">
                           <div className="flex justify-between items-center text-xs">
                             <span className="font-medium text-gray-500">Material Selection</span>
                             <span className="font-bold text-blue-600">IS:710 Marine Ply</span>
                           </div>
                           <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl space-y-2 border dark:border-gray-800">
                              <p className="text-[9px] font-black text-gray-400 uppercase">Computed Area</p>
                              <p className="text-lg font-black italic">{(selectedItem.width * selectedItem.height * 3.5).toFixed(1)} <span className="text-[10px] uppercase tracking-wider text-gray-400">Sqft</span></p>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. SHUTTER */}
                <div className="border-b dark:border-gray-800">
                  <button 
                    onClick={() => toggleSection('shutter')}
                    className="w-full flex items-center justify-between p-8 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center text-[10px] font-black">3</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">Shutter</span>
                    </div>
                    {expandedSections['shutter'] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSections['shutter'] && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-10 space-y-4">
                           <p className="text-[9px] font-bold text-gray-400 uppercase">Panel Configuration</p>
                           <div className="grid grid-cols-2 gap-2">
                             {['wooden', 'glass'].map(type => (
                               <button 
                                 key={type}
                                 onClick={() => handleUpdateItem(selectedItem.id, { shutterType: type as any })}
                                 className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all ${
                                   selectedItem.shutterType === type 
                                     ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                                     : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400 hover:border-blue-200'
                                 }`}
                               >
                                 {type}
                               </button>
                             ))}
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. PRICING INTELLIGENCE */}
                <div>
                  <button 
                    onClick={() => toggleSection('pricing')}
                    className="w-full flex items-center justify-between p-8 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-[10px] font-black">4</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">Valuation</span>
                    </div>
                    {expandedSections['pricing'] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSections['pricing'] && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-10 space-y-4">
                           {[
                             { label: 'Structural Sheets', val: 0.6 },
                             { label: 'Hardware Suite', val: 0.15 },
                             { label: 'Labor & Tax', val: 0.25 }
                           ].map((row, i) => (
                             <div key={i} className="flex justify-between items-center text-xs">
                               <span className="text-gray-500 font-medium">{row.label}</span>
                               <span className="font-bold text-gray-800 dark:text-gray-200">₹{Math.round(selectedItem.total * row.val).toLocaleString()}</span>
                             </div>
                           ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-8 border-t dark:border-gray-800 bg-gray-50/30 dark:bg-gray-900/10 shrink-0">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">Unit Quote</p>
                    <p className="text-2xl font-black italic text-blue-600">₹{selectedItem.total.toLocaleString()}</p>
                  </div>
                  <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-95 transition-all">
                    Commit Changes
                  </button>
                </div>
              </div>
            </motion.section>
          ) : (
            <motion.div 
              key="no-selection-spacer"
              initial={{ width: 0 }}
              animate={{ width: 0 }}
              exit={{ width: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Right Column: 3D Visualization */}
        <section className="flex-1 bg-gray-50 dark:bg-gray-900 relative flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div 
                key={selectedItem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 relative"
              >
                <img 
                  src={selectedItem.image} 
                  className="w-full h-full object-cover opacity-80" 
                  alt="3D Preview"
                />
                
                {/* 3D UI Overlays */}
                <div className="absolute inset-0 pointer-events-none p-12">
                   <div className="flex justify-between items-start">
                     <div className="flex flex-col gap-4 pointer-events-auto">
                        <button className="w-12 h-12 bg-white/90 dark:bg-gray-950/90 rounded-xl flex items-center justify-center text-gray-600 shadow-xl border dark:border-gray-800 hover:text-blue-600 transition-all">
                          <Maximize2 className="w-5 h-5" />
                        </button>
                        <button className="w-12 h-12 bg-white/90 dark:bg-gray-950/90 rounded-xl flex items-center justify-center text-gray-600 shadow-xl border dark:border-gray-800 hover:text-blue-600 transition-all">
                          <Layers className="w-5 h-5" />
                        </button>
                     </div>
                     
                     <div className="flex flex-col items-end gap-2 text-right">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">VISUAL ENGINE</p>
                        <p className="text-xl font-black italic tracking-tight uppercase">Photorealistic<br/>3D Simulation</p>
                     </div>
                   </div>

                   <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end">
                      <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur p-6 rounded-2xl shadow-2xl border dark:border-gray-800 pointer-events-auto max-w-xs">
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 italic">Active Selection</p>
                        <h4 className="text-lg font-black italic mb-4 leading-tight">{selectedItem.name}</h4>
                        <div className="grid grid-cols-2 gap-2">
                           {['Front View', 'Side View', 'Internal', 'Exploded'].map(view => (
                             <button key={view} className="py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-900 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-blue-600 hover:text-white transition-all">
                               {view}
                             </button>
                           ))}
                        </div>
                      </div>

                      <div className="flex gap-4 pointer-events-auto">
                         <div className="bg-white/95 dark:bg-gray-950/95 backdrop-blur p-4 rounded-2xl shadow-2xl border dark:border-gray-800 flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Scale Ratio</p>
                              <p className="text-xs font-bold">1:20 Accurate</p>
                            </div>
                            <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
                            <Calculator className="w-4 h-4 text-blue-600" />
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 bg-white dark:bg-gray-950 rounded-[2rem] shadow-xl flex items-center justify-center mb-8 border dark:border-gray-800">
                   <Box className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-2xl font-black italic mb-4 tracking-tight">Technical Warehouse</h3>
                <p className="text-gray-400 font-medium max-w-sm mb-12 text-sm italic">Select a component from the left architectural hierarchy to activate configuration and 3D projection engine.</p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                   {['Efficiency', 'Precision', 'Accuracy', 'Detail'].map(metric => (
                     <div key={metric} className="p-6 bg-white dark:bg-gray-950 rounded-2xl border dark:border-gray-800 text-left hover:border-blue-500 transition-all cursor-default">
                        <p className="text-[9px] font-black text-blue-600 uppercase mb-2 italic">Design Standard</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{metric} Matrix</p>
                     </div>
                   ))}
                </div>
              </div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
