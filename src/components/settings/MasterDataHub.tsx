import React, { useState } from 'react';
import { Vendor, ManpowerMaster, ClientMaster } from '../../mockData';
import { VendorManagement } from './VendorManagement';
import { ClientManagement } from './ClientManagement';
import { ManpowerManagement } from './ManpowerManagement';
import PriceMasterData from './PriceMasterData';
import { Building2, User, HardHat, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MasterDataHubProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  manpower: ManpowerMaster[];
  setManpower: React.Dispatch<React.SetStateAction<ManpowerMaster[]>>;
  clients: ClientMaster[];
  setClients: React.Dispatch<React.SetStateAction<ClientMaster[]>>;
  canEdit: boolean;
}

export function MasterDataHub({
  vendors,
  setVendors,
  manpower,
  setManpower,
  clients,
  setClients,
  canEdit
}: MasterDataHubProps) {
  const [activeTab, setActiveTab] = useState<'clients' | 'vendors' | 'manpower' | 'pricing'>('clients');

  const tabs = [
    { id: 'clients', label: 'Clients', icon: User },
    { id: 'vendors', label: 'Vendors', icon: Building2 },
    { id: 'manpower', label: 'Manpower', icon: HardHat },
    { id: 'pricing', label: 'Pricing', icon: Tag },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black mb-2 italic">Global Master Repository</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Centralized control for system-wide entities and resource parameters.</p>
      </header>

      <div className="flex flex-wrap gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
                ? 'bg-white dark:bg-gray-900 text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'clients' && (
              <ClientManagement clients={clients} setClients={setClients} canEdit={canEdit} />
            )}
            {activeTab === 'vendors' && (
              <VendorManagement vendors={vendors} setVendors={setVendors} canEdit={canEdit} />
            )}
            {activeTab === 'manpower' && (
              <ManpowerManagement manpower={manpower} setManpower={setManpower} canEdit={canEdit} />
            )}
            {activeTab === 'pricing' && (
              <PriceMasterData />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
