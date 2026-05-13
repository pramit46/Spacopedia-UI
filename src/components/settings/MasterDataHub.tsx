import React, { useState } from 'react';
import { Vendor, ManpowerMaster, ClientMaster, User, ProjectPayment, ProjectCostItem } from '../../mockData';
import { VendorManagement } from './VendorManagement';
import { ClientManagement } from './ClientManagement';
import { ManpowerManagement } from './ManpowerManagement';
import PriceMasterData from './PriceMasterData';
import { ClientPaymentsView } from './ClientPaymentsView';
import { VendorSettlementsView } from './VendorSettlementsView';
import { Building2, User as UserIcon, HardHat, Tag, Database, List, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import MaterialLookup from './MaterialLookup';

interface MasterDataHubProps {
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  manpower: ManpowerMaster[];
  setManpower: React.Dispatch<React.SetStateAction<ManpowerMaster[]>>;
  clients: ClientMaster[];
  setClients: React.Dispatch<React.SetStateAction<ClientMaster[]>>;
  payments: ProjectPayment[];
  setPayments: React.Dispatch<React.SetStateAction<ProjectPayment[]>>;
  costs: ProjectCostItem[];
  setCosts: React.Dispatch<React.SetStateAction<ProjectCostItem[]>>;
  currentUser: User;
  selectedProject: string;
  canEdit: boolean;
}

export function MasterDataHub({
  vendors,
  setVendors,
  manpower,
  setManpower,
  clients,
  setClients,
  payments,
  setPayments,
  costs,
  setCosts,
  currentUser,
  selectedProject,
  canEdit
}: MasterDataHubProps) {
  const [activeTab, setActiveTab] = useState<'clients' | 'vendors' | 'manpower' | 'pricing' | 'material-lookup' | 'client-payments' | 'vendor-settlements'>('clients');

  const tabs = [
    { id: 'clients', label: 'Clients', icon: UserIcon },
    { id: 'vendors', label: 'Vendors', icon: Building2 },
    { id: 'manpower', label: 'Manpower', icon: HardHat },
    { id: 'pricing', label: 'Pricing', icon: Tag },
    { id: 'material-lookup', label: 'Material Lookup', icon: Package },
    { id: 'client-payments', label: 'Client Payments', icon: Database },
    { id: 'vendor-settlements', label: 'Vendor Settlements', icon: List },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-3xl font-black mb-2 italic">Global Master Repository</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Centralized control for system-wide entities and resource parameters.</p>
      </header>

      <div className="flex flex-nowrap gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-x-auto max-w-full scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap shrink-0 ${
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
            {activeTab === 'material-lookup' && (
              <MaterialLookup />
            )}
            {activeTab === 'client-payments' && (
              <ClientPaymentsView 
                currentUser={currentUser}
                payments={payments}
                onAdd={(p) => setPayments(prev => [...prev, p])}
                onDelete={(id) => setPayments(prev => prev.filter(p => p.id !== id))}
                projectId={selectedProject}
              />
            )}
            {activeTab === 'vendor-settlements' && (
              <VendorSettlementsView 
                currentUser={currentUser}
                costs={costs}
                vendors={vendors}
                onAdd={(c) => setCosts(prev => [...prev, c])}
                onDelete={(id) => setCosts(prev => prev.filter(c => c.id !== id))}
                projectId={selectedProject}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
