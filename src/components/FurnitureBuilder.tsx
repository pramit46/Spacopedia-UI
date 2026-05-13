import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Info, 
  ChevronRight, 
  Box, 
  Maximize2, 
  Layers, 
  HandMetal, 
  DoorOpen,
  Calculator,
  Save,
  Trash2,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FURNITURE_TEMPLATES, 
  FurnitureTemplate, 
  COMPONENT_PRICES, 
  ComponentPrice 
} from '../mockData';

interface FurnitureBuilderProps {
  onClose: () => void;
  onSave: (quoteItem: any) => void;
}

export function FurnitureBuilder({ onClose, onSave }: FurnitureBuilderProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<FurnitureTemplate>(FURNITURE_TEMPLATES[0]);
  const [dimensions, setDimensions] = useState({ width: selectedTemplate.defaultWidth, height: selectedTemplate.defaultHeight });
  const [shutterType, setShutterType] = useState<'wooden' | 'glass'>('wooden');
  const [plyType, setPlyType] = useState<string>(COMPONENT_PRICES[0].id); // Default to Commercial

  // Derived Calculations
  const calculatedSpecs = useMemo(() => {
    const area = dimensions.width * dimensions.height;
    
    // Plywood Estimation (Total inner + outer sqft)
    const totalPlySqft = area * selectedTemplate.rules.plywoodFactor;
    const numPlySheets = Math.ceil(totalPlySqft / 32); // 8x4 sheets

    // Hardware Estimation
    const numKnobs = Math.ceil(area * selectedTemplate.rules.knobFactor) || 2;
    const numHinges = Math.max(4, Math.ceil(area * 0.4)); // 2 hinges per shutter approx

    // Shutters Estimation
    const shutterWidth = dimensions.width > 3 ? (dimensions.width / Math.ceil(dimensions.width / 2)) : dimensions.width;
    const numShutters = Math.ceil(dimensions.width / (shutterWidth || 1.5));
    const shutterArea = area * (selectedTemplate.rules.shutterFactor > 0 ? selectedTemplate.rules.shutterFactor : 1);

    // Pricing
    const plyPrice = COMPONENT_PRICES.find(p => p.id === plyType)?.rate || 0;
    const shutterPrice = COMPONENT_PRICES.find(p => p.id === (shutterType === 'wooden' ? 'cp4' : 'cp5'))?.rate || 0;
    const knobPrice = COMPONENT_PRICES.find(p => p.id === 'cp3')?.rate || 0;
    const hingePrice = COMPONENT_PRICES.find(p => p.id === 'cp6')?.rate || 0;

    const costs = {
      plywood: totalPlySqft * plyPrice,
      shutters: area * shutterPrice,
      knobs: numKnobs * knobPrice,
      hinges: numHinges * hingePrice,
    };

    const total = Object.values(costs).reduce((a, b) => a + b, 0);

    return {
      area,
      totalPlySqft,
      numPlySheets,
      numKnobs,
      numHinges,
      numShutters,
      shutterWidth,
      shutterType,
      costs,
      total
    };
  }, [selectedTemplate, dimensions, shutterType, plyType]);

  const handleTemplateChange = (id: string) => {
    const template = FURNITURE_TEMPLATES.find(t => t.id === id);
    if (template) {
      setSelectedTemplate(template);
      setDimensions({ width: template.defaultWidth, height: template.defaultHeight });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-gray-900/40 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-gray-950 w-full max-w-6xl h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col border dark:border-gray-800"
      >
        <header className="p-8 border-b dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-950 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black italic">Furniture Intelligence Builder</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">Automated Component Estimation Mode</p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-2xl transition-all">
            <X className="w-6 h-6" />
          </button>
        </header>

        <div className="flex-1 overflow-hidden flex">
          {/* Left Panel: Configuration */}
          <aside className="w-96 border-r dark:border-gray-800 overflow-y-auto p-10 bg-gray-50/50 dark:bg-gray-900/20">
            <div className="space-y-10">
              <section>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Select Prototype</label>
                <div className="grid grid-cols-2 gap-3">
                  {FURNITURE_TEMPLATES.map(t => (
                    <button 
                      key={t.id}
                      onClick={() => handleTemplateChange(t.id)}
                      className={`px-4 py-4 rounded-2xl text-xs font-black transition-all border-2 ${selectedTemplate.id === t.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500 hover:border-blue-200'}`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Dimensions (Feet)</label>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5"><Maximize2 className="w-3 h-3" /> Width</p>
                    <input 
                      type="number"
                      step="0.5"
                      value={dimensions.width}
                      onChange={e => setDimensions(prev => ({ ...prev, width: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl text-lg font-black italic border dark:border-gray-700 focus:ring-4 focus:ring-blue-500/10 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5"><Maximize2 className="w-3 h-3 rotate-90" /> Height</p>
                    <input 
                      type="number"
                      step="0.5"
                      value={dimensions.height}
                      onChange={e => setDimensions(prev => ({ ...prev, height: parseFloat(e.target.value) || 0 }))}
                      className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl text-lg font-black italic border dark:border-gray-700 focus:ring-4 focus:ring-blue-500/10 outline-none"
                    />
                  </div>
                </div>
              </section>

              <section>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Material Grade</label>
                <select 
                  value={plyType}
                  onChange={e => setPlyType(e.target.value)}
                  className="w-full bg-white dark:bg-gray-800 p-4 rounded-2xl text-sm font-bold border dark:border-gray-700 focus:ring-4 focus:ring-blue-500/10 outline-none appearance-none"
                >
                  {COMPONENT_PRICES.filter(p => p.name.toLowerCase().includes('plywood')).map(p => (
                    <option key={p.id} value={p.id}>{p.name} - ₹{p.rate}</option>
                  ))}
                </select>
              </section>

              <section>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-4">Shutter Selection</label>
                <div className="flex gap-4 p-2 bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700">
                  <button 
                    onClick={() => setShutterType('wooden')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${shutterType === 'wooden' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    Wooden
                  </button>
                  <button 
                    onClick={() => setShutterType('glass')}
                    className={`flex-1 py-3 rounded-xl text-xs font-black transition-all ${shutterType === 'glass' ? 'bg-blue-50 text-blue-600' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    Glass
                  </button>
                </div>
              </section>
            </div>
          </aside>

          {/* Right Panel: Intelligent Output */}
          <main className="flex-1 overflow-y-auto p-12 space-y-12">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-4xl font-black italic tracking-tighter">Automated Estimates</h3>
                <p className="text-gray-500 font-medium max-w-md mt-2">The system has calculated the following components based on a {dimensions.width}'x{dimensions.height}' footprint.</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total Item Cost</p>
                <p className="text-4xl font-black italic text-blue-600">₹{calculatedSpecs.total.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* Plywood Breakdown */}
              <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600">
                    <Layers className="w-5 h-5" />
                  </div>
                  <h4 className="font-black italic">Structural Shell (Ply)</h4>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b dark:border-gray-800 pb-4">
                    <p className="text-sm font-bold text-gray-500">Total Consumption</p>
                    <p className="text-xl font-black italic">{calculatedSpecs.totalPlySqft.toFixed(1)} <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sqft</span></p>
                  </div>
                  <div className="flex justify-between items-end border-b dark:border-gray-800 pb-4">
                    <p className="text-sm font-bold text-gray-500">8x4 Sheet Requirement</p>
                    <p className="text-xl font-black italic">{calculatedSpecs.numPlySheets} <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sheets</span></p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-bold text-gray-500">Material Subtotal</p>
                    <p className="text-xl font-black italic text-orange-600">₹{calculatedSpecs.costs.plywood.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Hardware Breakdown */}
              <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600">
                    <HandMetal className="w-5 h-5" />
                  </div>
                  <h4 className="font-black italic">Hardware & Fitments</h4>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b dark:border-gray-800 pb-4">
                    <p className="text-sm font-bold text-gray-500">Design Knobs</p>
                    <p className="text-xl font-black italic">{calculatedSpecs.numKnobs} <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Pcs</span></p>
                  </div>
                  <div className="flex justify-between items-end border-b dark:border-gray-800 pb-4">
                    <p className="text-sm font-bold text-gray-500">Soft Close Hinges</p>
                    <p className="text-xl font-black italic">{calculatedSpecs.numHinges} <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Units</span></p>
                  </div>
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-bold text-gray-500">Hardware Subtotal</p>
                    <p className="text-xl font-black italic text-purple-600">₹{(calculatedSpecs.costs.knobs + calculatedSpecs.costs.hinges).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Shutters Breakdown */}
              <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] p-8 shadow-sm col-span-2">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <h4 className="font-black italic">Front-Fascia (Shutters)</h4>
                </div>
                <div className="grid grid-cols-3 gap-12">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Configuration</p>
                    <p className="text-xl font-black italic capitalize">{shutterType} Panels</p>
                    <p className="text-[10px] font-bold text-gray-500 mt-1">{calculatedSpecs.numShutters} units @ ~{calculatedSpecs.shutterWidth.toFixed(1)}' Wide</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Surface</p>
                    <p className="text-xl font-black italic">{calculatedSpecs.area.toFixed(1)} <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Sqft</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Fascia Cost</p>
                    <p className="text-2xl font-black italic text-green-600">₹{calculatedSpecs.costs.shutters.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 flex justify-end gap-5">
              <button 
                onClick={onClose}
                className="px-10 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-all"
              >
                Discard
              </button>
              <button 
                onClick={() => onSave({
                  name: `${selectedTemplate.name} (${dimensions.width}x${dimensions.height})`,
                  amount: calculatedSpecs.total,
                  date: new Date().toISOString().split('T')[0],
                  status: 'Draft'
                })}
                className="px-12 py-4 rounded-[1.5rem] bg-blue-600 text-white text-sm font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-500/30 flex items-center gap-3 transition-all"
              >
                <Save className="w-5 h-5" />
                Inject into Quotation
              </button>
            </div>
          </main>
        </div>
      </motion.div>
    </motion.div>
  );
}
