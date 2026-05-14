import React, { useState, useMemo, useEffect } from 'react';
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
  ChevronLeft,
  CloudCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, FURNITURE_TEMPLATES, COMPONENT_PRICES, MaterialInventoryItem } from '../mockData';

interface QuotationItem {
  id: string;
  name: string;
  category: string;
  width: number;
  height: number;
  depth: number;
  plyType: string;
  shutterType: 'wooden' | 'glass';
  total: number;
  image: string;
  description?: string;
  knobStyle?: string;
  knobColor?: string;
  handleStyle?: string;
  handleColor?: string;
  shelvesCount?: number;
}

interface QuotationViewProps {
  currentUser: User;
  projectId: string;
  onSyncMaterials: (materials: MaterialInventoryItem[]) => void;
}

export function QuotationView({ currentUser, projectId, onSyncMaterials }: QuotationViewProps) {
  const [items, setItems] = useState<QuotationItem[]>([
    { 
      id: 'it-1', 
      name: 'Master Wardrobe', 
      category: 'Bedroom',
      width: 6, 
      height: 7, 
      depth: 2,
      plyType: 'cp2', 
      shutterType: 'wooden', 
      total: 85400,
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&auto=format&fit=crop&q=60',
      description: 'Standard built-in'
    },
    { 
      id: 'it-2', 
      name: 'Vanity Unit', 
      category: 'Bathroom',
      width: 3, 
      height: 2.5, 
      depth: 1.5,
      plyType: 'cp1', 
      shutterType: 'glass', 
      total: 32500,
      image: 'https://images.unsplash.com/photo-1616486029423-aaa47a300ffe?w=800&auto=format&fit=crop&q=60',
      description: 'Mirror finish'
    },
    { 
      id: 'it-3', 
      name: 'TV Unit', 
      category: 'Living Room',
      width: 8, 
      height: 1.5, 
      depth: 1.5,
      plyType: 'cp2', 
      shutterType: 'wooden', 
      total: 45000,
      image: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?w=800&auto=format&fit=crop&q=60',
      description: 'Floating unit'
    }
  ]);

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [showCenter, setShowCenter] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  
  // State for collapsibles
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({ 'Bedroom': true, 'Living Room': true });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ 'dimensions': true, 'carcass': false, 'shutter': false, 'shelves': false, 'pricing': false });

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
    setShowRight(true);
  };

  const calculateTotal = (width: number, height: number, depth: number, plyId: string) => {
    const ply = COMPONENT_PRICES.find(p => p.id === plyId);
    const rate = ply?.rate || 1500;
    // Simple volume based calculation: Area * rate + depth factor
    return Math.round(width * height * rate * (1 + depth/10));
  };

  const handleUpdateItem = (id: string, updates: Partial<QuotationItem>) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, ...updates };
        newItem.total = calculateTotal(
          newItem.width, 
          newItem.height, 
          newItem.depth, 
          newItem.plyType
        );
        return newItem;
      }
      return item;
    }));
  };

  const handleAddNewItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const category = formData.get('category') as string;
    const name = formData.get('name') as string;
    const dimensions = formData.get('dimensions') as string;
    const description = formData.get('description') as string;
    const plyType = formData.get('plyType') as string;
    
    // Hardware options
    const knobStyle = formData.get('knobStyle') as string;
    const knobColor = formData.get('knobColor') as string;
    const handleStyle = formData.get('handleStyle') as string;
    const handleColor = formData.get('handleColor') as string;
    const shelvesCount = parseInt(formData.get('shelvesCount') as string) || 0;
    
    // Parse dimensions (e.g., "6x7x2")
    const parts = dimensions.toLowerCase().split('x').map(p => parseFloat(p.trim()) || 1);
    const width = parts[0] || 1;
    const height = parts[1] || parts[0] || 1;
    const depth = parts[2] || 1.5;

    const newItem: QuotationItem = {
      id: `it-${Date.now()}`,
      name: name,
      category: category,
      width: width,
      height: height,
      depth: depth,
      plyType: plyType,
      shutterType: 'wooden',
      knobStyle,
      knobColor,
      handleStyle,
      handleColor,
      shelvesCount,
      total: calculateTotal(width, height, depth, plyType),
      image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop&q=60',
      description: description
    };
    
    setItems(prev => [...prev, newItem]);
    setExpandedCategories(prev => ({ ...prev, [category]: true }));
    setIsAddingItem(false);
    handleSelectItem(newItem.id);
  };

  const handleDeleteItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setItems(prev => prev.filter(i => i.id !== itemToDelete));
      if (selectedItemId === itemToDelete) {
        setSelectedItemId(null);
        setShowCenter(false);
      }
      setItemToDelete(null);
    }
  };

  const handleFinalSubmit = () => {
    const aggregatedMaterials: MaterialInventoryItem[] = [];
    
    items.forEach(item => {
      // 1. CARCASS MATERIAL
      const plyPrice = COMPONENT_PRICES.find(p => p.id === item.plyType);
      // Rough area calc: Area * 3.5 (standard caricature factor)
      const plyArea = Math.round(item.width * item.height * 3.5);
      
      aggregatedMaterials.push({
        id: `mat-ply-${item.id}`,
        projectId,
        date: new Date().toISOString().split('T')[0],
        materialName: plyPrice?.name || 'Commercial Plywood',
        size: `${item.width}ft x ${item.height}ft`,
        count: plyArea,
        unitPrice: plyPrice?.rate || 0,
        totalPrice: plyArea * (plyPrice?.rate || 0),
        invoiceRaised: false,
        paymentMade: 0,
        pendingAmount: plyArea * (plyPrice?.rate || 0),
        comment: `Derived from ${item.name}`
      });

      // 2. HARDWARE (Hinges/Pairs)
      const hingesRate = COMPONENT_PRICES.find(p => p.id === 'cp6')?.rate || 450;
      // Estimate: 4 hinges per 7ft height
      const hingeCount = Math.ceil(item.height / 2) * 2;
      aggregatedMaterials.push({
        id: `mat-hinge-${item.id}`,
        projectId,
        date: new Date().toISOString().split('T')[0],
        materialName: 'Hinges (Soft Close)',
        size: 'Standard',
        count: hingeCount,
        unitPrice: hingesRate,
        totalPrice: hingeCount * hingesRate,
        invoiceRaised: false,
        paymentMade: 0,
        pendingAmount: hingeCount * hingesRate,
        comment: `Required for ${item.name} shutters`
      });

      // 3. KNOBS/HANDLES
      if (item.knobStyle) {
        const knobRate = COMPONENT_PRICES.find(p => p.id === 'cp3')?.rate || 150;
        aggregatedMaterials.push({
          id: `mat-knob-${item.id}`,
          projectId,
          date: new Date().toISOString().split('T')[0],
          materialName: `Knob (${item.knobStyle})`,
          size: item.knobColor || 'Default',
          count: 2, // Default 2 per unit
          unitPrice: knobRate,
          totalPrice: 2 * knobRate,
          invoiceRaised: false,
          paymentMade: 0,
          pendingAmount: 2 * knobRate,
          comment: `Hardware for ${item.name}`
        });
      }
    });

    onSyncMaterials(aggregatedMaterials);
    alert('Technical inventory synchronized with Material Management system.');
  };

  // Auto-save logic every 30 seconds
  useEffect(() => {
    if (items.length === 0) return;

    const autoSave = async () => {
      try {
        const response = await fetch('/api/quotation/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items }),
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with ${response.status}`);
        }
        
        const data = await response.json();
        if (data.status === 'success') {
          setLastSaved(new Date().toLocaleTimeString());
        }
      } catch (err) {
        // Quietly fail for auto-save to avoid popping up errors to the user constantly
        // but log it for debugging
        console.warn('Sync delayed:', err instanceof Error ? err.message : 'Network error');
      }
    };

    const timer = setInterval(autoSave, 30000);
    return () => clearInterval(timer);
  }, [items]);

  const handleDimensionInputChange = (id: string, field: 'width' | 'height' | 'depth', inputValue: string) => {
    // If a dimension is showing 0 and the user puts any non-zero number next to that 0, 
    // then show only that non-zero number (e.g., 01 -> 1, 00 -> 0)
    let processedValue = inputValue.replace(/^0+(?!$)/, '');
    if (processedValue === '') processedValue = '0';
    
    // We only update if it's a valid number or empty (which we treat as 0 for calculations)
    const floatVal = parseFloat(processedValue);
    if (!isNaN(floatVal) || processedValue === '0') {
      handleUpdateItem(id, { [field]: floatVal || 0 });
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col font-sans bg-white dark:bg-gray-950 overflow-hidden">
      {/* Top Bar - Simplified */}
      <header className="h-16 border-b dark:border-gray-800 flex items-center justify-between px-6 shrink-0 bg-white dark:bg-gray-950">
        <div className="flex items-center gap-4">

          <div>
            <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-none mb-0.5">
              <span>PROJECTS</span>
              <ChevronRight className="w-2.5 h-2.5" />
              <span className="text-gray-600 dark:text-gray-300">{projectId}</span>
            </div>
            <h2 className="text-2xl font-black italic tracking-tighter leading-none">Technical Quotation</h2>
          </div>
        </div>

        <div className="flex items-center gap-10">
          {lastSaved && (
            <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-900/50 px-2 py-1 rounded-lg border dark:border-gray-800">
              <CloudCheck className="w-3 h-3 text-green-500" />
              Sync: {lastSaved}
            </div>
          )}
          <div className="text-right">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Est. Valuation</p>
            <p className="text-2xl font-black italic text-blue-600 tracking-tighter leading-none">₹{totalProjectValue.toLocaleString()}</p>
          </div>
          <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-900 px-5 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:bg-gray-200 dark:hover:bg-gray-800 transition-all border dark:border-gray-800">
            <Download className="w-3.5 h-3.5" />
            PDF Export
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Repository (Collapsible Categories) */}
        <section className="w-80 border-r dark:border-gray-800 flex flex-col bg-gray-50/30 dark:bg-gray-950 transition-all shrink-0 overflow-hidden">
          <div className="p-6 border-b dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-950">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Project Items</h3>
            <button 
              onClick={() => setIsAddingItem(true)}
              className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-xl text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
            {(Object.entries(categories) as [string, QuotationItem[]][]).map(([category, categoryItems]) => (
              <div key={category} className="border-b dark:border-gray-800 last:border-0">
                <button 
                  onClick={() => toggleCategory(category)}
                  className="w-full flex items-center justify-between px-6 py-5 hover:bg-white dark:hover:bg-gray-800/30 transition-colors"
                >
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">{category}</span>
                  {expandedCategories[category] ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
                </button>
                <AnimatePresence initial={false}>
                  {expandedCategories[category] && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      {categoryItems.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleSelectItem(item.id)}
                          className={`w-full text-left px-8 py-4 transition-all group relative ${
                            selectedItemId === item.id 
                              ? 'bg-white dark:bg-gray-900 shadow-sm' 
                              : 'hover:bg-white dark:hover:bg-gray-900/50'
                          }`}
                        >
                          {selectedItemId === item.id && (
                            <motion.div 
                              layoutId="active-indicator"
                              className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"
                            />
                          )}
                          <div className="flex justify-between items-center mb-0.5">
                            <p className={`text-xs font-bold ${selectedItemId === item.id ? 'text-blue-600' : 'text-gray-700 dark:text-gray-300'}`}>
                              {item.name}
                            </p>
                            <Trash2 
                              className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all" 
                              onClick={(e) => handleDeleteItem(item.id, e)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
                              {item.width}′×{item.height}′×{item.depth}′
                            </p>
                            <p className="text-[10px] font-black text-blue-600 italic">
                              ₹{item.total.toLocaleString()}
                            </p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          <div className="p-6 border-t dark:border-gray-800 bg-white dark:bg-gray-950">
            <button 
              onClick={handleFinalSubmit}
              className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-blue-600/30 active:scale-95 transition-all outline-none"
            >
              Final Submit
            </button>
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
                         <div className="px-8 pb-10 grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                              <p className="text-[9px] font-bold text-gray-400 uppercase">Width (ft)</p>
                              <input 
                                type="text"
                                value={selectedItem.width}
                                onChange={e => handleDimensionInputChange(selectedItem.id, 'width', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 p-3 rounded-xl font-bold border-transparent border-b-2 border-b-blue-100 dark:border-b-blue-900/30 focus:border-b-blue-600 outline-none text-sm transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="text-[9px] font-bold text-gray-400 uppercase">Height (ft)</p>
                              <input 
                                type="text"
                                value={selectedItem.height}
                                onChange={e => handleDimensionInputChange(selectedItem.id, 'height', e.target.value)}
                                className="w-full bg-gray-50 dark:bg-gray-900 p-3 rounded-xl font-bold border-transparent border-b-2 border-b-blue-100 dark:border-b-blue-900/30 focus:border-b-blue-600 outline-none text-sm transition-all"
                              />
                            </div>
                            <div className="space-y-2">
                               <p className="text-[9px] font-bold text-gray-400 uppercase">Depth (ft)</p>
                               <input 
                                 type="text"
                                 value={selectedItem.depth || 0}
                                 onChange={e => handleDimensionInputChange(selectedItem.id, 'depth', e.target.value)}
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

                {/* 4. SHELVES */}
                <div className="border-b dark:border-gray-800">
                  <button 
                    onClick={() => toggleSection('shelves')}
                    className="w-full flex items-center justify-between p-8 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 flex items-center justify-center text-[10px] font-black">4</span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-700 dark:text-gray-300">Shelves</span>
                    </div>
                    {expandedSections['shelves'] ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSections['shelves'] && (
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: 'auto' }} 
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-8 pb-10 space-y-4">
                           <p className="text-[9px] font-bold text-gray-400 uppercase">Shelving Infrastructure</p>
                           <div className="flex items-center gap-4">
                             <input 
                               type="number"
                               value={selectedItem.shelvesCount || 0}
                               onChange={e => handleUpdateItem(selectedItem.id, { shelvesCount: parseInt(e.target.value) || 0 })}
                               className="w-24 bg-gray-50 dark:bg-gray-900 p-3 rounded-xl font-bold border-transparent border-b-2 border-b-blue-100 dark:border-b-blue-900/30 focus:border-b-blue-600 outline-none text-sm transition-all text-center"
                             />
                             <p className="text-xs font-medium text-gray-500">Internal shelving units to be fabricated</p>
                           </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. PRICING INTELLIGENCE */}
                <div className="border-b dark:border-gray-800">
                  <button 
                    onClick={() => toggleSection('pricing')}
                    className="w-full flex items-center justify-between p-8 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-6 h-6 rounded bg-green-50 dark:bg-green-900/30 text-green-600 flex items-center justify-center text-[10px] font-black">5</span>
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
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[9px] font-black text-gray-400 uppercase">Unit Quote</p>
                    <p className="text-2xl font-black italic text-blue-600">₹{selectedItem.total.toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-[8px] font-black text-green-600 uppercase tracking-widest mb-1 italic">Real-time Sync Active</p>
                    <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Changes Auto-saved
                    </div>
                  </div>
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
            {selectedItem && showRight ? (
              <motion.div 
                key={selectedItem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 relative flex flex-col"
              >
                {/* Close Button for Right Column */}
                <button 
                  onClick={() => setShowRight(false)}
                  className="absolute top-6 right-6 z-20 p-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl rounded-2xl border dark:border-gray-800 shadow-xl text-gray-400 hover:text-red-500 transition-all group lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute top-6 right-6 z-20 hidden lg:block">
                  <button 
                    onClick={() => setShowRight(false)}
                    className="p-3 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl rounded-2xl border dark:border-gray-800 shadow-xl text-gray-400 hover:text-red-500 transition-all group"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Visual Preview */}
                <div className="flex-1 relative bg-gray-50 dark:bg-gray-900/50 flex items-center justify-center p-12">
                  <div className="max-w-2xl w-full aspect-[4/3] rounded-[3rem] overflow-hidden shadow-2xl relative group">
                    <img 
                      src={selectedItem.image} 
                      alt={selectedItem.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-10">
                      <div className="text-white">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Production Perspective</p>
                        <h4 className="text-2xl font-black italic">{selectedItem.name}</h4>
                      </div>
                    </div>
                  </div>
                  
                  {/* Floating Action Cards */}
                  <div className="absolute bottom-10 left-10 right-10 flex justify-between items-end">
                    <div className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl p-6 rounded-[2rem] border dark:border-gray-800 shadow-xl pointer-events-auto">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Architectural Bounds</p>
                      <div className="flex items-center gap-8">
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase">Width</p>
                          <p className="text-lg font-black italic">{selectedItem.width}′</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase">Height</p>
                          <p className="text-lg font-black italic">{selectedItem.height}′</p>
                        </div>
                        <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
                        <div>
                          <p className="text-[8px] font-black text-gray-400 uppercase">Depth</p>
                          <p className="text-lg font-black italic">{selectedItem.depth || 1.5}′</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-600 p-6 rounded-[2rem] shadow-xl text-white pointer-events-auto">
                      <p className="text-[10px] font-black text-blue-200 uppercase tracking-widest mb-1">Estimated Cost</p>
                      <p className="text-3xl font-black italic tracking-tighter">₹{selectedItem.total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Properties Inspector Logic replaces the default visual view overlays if needed but user asked for these specific details */}
              </motion.div>
            ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden bg-white dark:bg-gray-950">
                {/* Decorative Background Element */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/30 dark:bg-blue-900/5 rounded-full blur-[100px] pointer-events-none" />

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10 w-full max-w-3xl text-center"
                >
                  <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full mb-8 border border-blue-100 dark:border-blue-800/30">
                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Live Quotation Intelligence</span>
                  </div>

                  {/*<h3 className="text-5xl font-black italic mb-6 tracking-tighter leading-none dark:text-white">
                    Project Intelligence<br/>Dashboard
                  </h3>*/}
                  
                  <p className="text-gray-400 font-medium max-w-lg mx-auto mb-16 text-base italic leading-relaxed">
                    Select an architectural component from the hierarchy to initiate 3D synthesis, geometric orchestration, and material valuation modeling.
                  </p>

                  <div className="grid grid-cols-3 gap-6 w-full">
                    {[
                      { label: 'Asset Count', value: items.length, sub: 'Active Entities', color: 'blue' },
                      { label: 'Project Valuation', value: `~ ₹${(totalProjectValue / 100000).toFixed(2)}L`, sub: 'Total Estimate', color: 'green' },
                      { label: 'System Health', value: '100%', sub: 'Sync Verified', color: 'purple' }
                    ].map((stat, i) => ( stat && (
                      <div key={i} className="p-8 bg-gray-50/50 dark:bg-gray-900/30 rounded-3xl border dark:border-gray-800 text-left hover:border-blue-500/50 transition-all group overflow-hidden relative">
                         <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl -mr-8 -mt-8`} />
                         <p className={`text-[9px] font-black text-${stat.color}-500 uppercase mb-3 tracking-[0.15em] italic`}>{stat.label}</p>
                         <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter mb-1">{stat.value}</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.sub}</p>
                      </div>
                    )))}
                  </div>

                  {/*<div className="mt-16 flex items-center justify-center gap-8">
                     <div className="flex items-center gap-3 text-gray-400">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                           <Layers className="w-5 h-5 opacity-50" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-left">Multi-layer<br/>Logic Engine</p>
                     </div>
                     <div className="w-px h-8 bg-gray-200 dark:bg-gray-800" />
                     <div className="flex items-center gap-3 text-gray-400">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                           <Maximize2 className="w-5 h-5 opacity-50" />
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-left">Geometric<br/>Precision Sync</p>
                     </div>
                  </div>*/}
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <AnimatePresence>
        {isAddingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-950 rounded-[2.5rem] border dark:border-gray-800 shadow-2xl w-full max-w-4xl overflow-hidden"
            >
              <div className="px-10 py-8 border-b dark:border-gray-800 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black italic">Log Project Component</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">
                    System Entity: Technical Quotation Record
                  </p>
                </div>
                <button onClick={() => setIsAddingItem(false)} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddNewItem} className="p-10 space-y-6 max-h-[75vh] overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Structural Section (e.g. Master Bedroom)</label>
                    <input name="category" required placeholder="Enter Category..." className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Entity Nomenclature (e.g. Wardrobe Unit)</label>
                    <input name="name" required placeholder="Component Name..." className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Geometrical Bounds (W × H × D in ft)</label>
                    <input name="dimensions" required placeholder="e.g. 6x7x2" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.1em] ml-1">Internal Substrate / Ply Grade</label>
                    <select name="plyType" className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer">
                      {COMPONENT_PRICES.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-8 bg-blue-50/50 dark:bg-blue-900/5 rounded-3xl border border-blue-100 dark:border-blue-900/20 space-y-6">
                  <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                    Hardware Orchestration logic
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Knob Configuration</label>
                        <div className="grid grid-cols-[1fr,80px] gap-2">
                           <input name="knobStyle" placeholder="Style" className="p-4 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                           <input name="knobColor" placeholder="Col" className="p-4 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Handle Implementation</label>
                        <div className="grid grid-cols-[1fr,80px] gap-2">
                           <input name="handleStyle" placeholder="Style" className="p-4 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                           <input name="handleColor" placeholder="Col" className="p-4 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Internal Shelving units</label>
                        <input name="shelvesCount" type="number" placeholder="Enter Count..." className="w-full p-4 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Deployment Specifics</label>
                        <input placeholder="e.g. Soft-close, Drawer Slides" className="w-full p-4 bg-white dark:bg-gray-950 border dark:border-gray-800 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Extended Specification metadata</label>
                  <textarea name="description" rows={3} placeholder="Add specific details or special instructions for fabrication..." className="w-full p-4 bg-gray-50 dark:bg-gray-900 border dark:border-gray-800 rounded-xl font-medium resize-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
                </div>

                <div className="pt-6 flex gap-4">
                  <button type="submit" className="flex-1 py-5 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 active:scale-95 transition-all">
                    Register Component
                  </button>
                  <button type="button" onClick={() => setIsAddingItem(false)} className="px-10 py-5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-xs uppercase tracking-[0.2em]">
                    Discard
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
        <AnimatePresence>
          {itemToDelete && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-gray-950 rounded-[2rem] border dark:border-gray-800 shadow-2xl w-full max-w-md overflow-hidden p-8 text-center"
              >
                 <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Trash2 className="w-8 h-8 text-red-500" />
                 </div>
                 <h3 className="text-xl font-black italic mb-2">Delete Component?</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">This action will permanently remove this architectural asset from the technical quotation.</p>
                 <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={confirmDelete}
                      className="py-4 rounded-xl bg-red-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                    >
                      Confirm Delete
                    </button>
                    <button 
                      onClick={() => setItemToDelete(null)}
                      className="py-4 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                    >
                      Keep Asset
                    </button>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </AnimatePresence>
    </div>
  );
}
