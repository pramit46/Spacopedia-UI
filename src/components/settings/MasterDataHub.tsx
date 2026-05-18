import React, { useState } from 'react';
import { Vendor } from '../objects/vendor';
import { User } from '../objects/user';
import { Project } from '../objects/project';
import { ManpowerMaster } from '../objects/manpower';
import { ProjectPayment } from '../objects/projectPayment';
import { ClientMaster } from '../objects/client';
import { ProjectCostItem } from '../objects/projectCostItem';
import { VendorManagement } from './VendorManagement';
import { ClientManagement } from './ClientManagement';
import { ManpowerManagement } from './ManpowerManagement';
import { ProjectManagement } from './ProjectManagement';
import PriceMasterData from './PriceMasterData';
import { ClientPaymentsView } from './ClientPaymentsView';
import { VendorSettlementsView } from './VendorSettlementsView';
import { Building, Building2, User as UserIcon, HardHat, Tag, Database, List, Package } from 'lucide-react';
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
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
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
  projects,
  setProjects,
  canEdit
}: MasterDataHubProps) {
  const [activeTab, setActiveTab] = useState<'projects' | 'clients' | 'vendors' | 'manpower' | 'pricing' | 'material-lookup' | 'client-payments' | 'vendor-settlements'>('clients');

  const tabs = [
    { id: 'projects', label: 'Projects', icon: Building },
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
            {activeTab === 'projects' && (
              <ProjectManagement projects={projects} setProjects={setProjects} canEdit={canEdit} />
            )}
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
                projects={projects}
                clients={clients}
                onAdd={(p) => setPayments(prev => [...prev, p])}
                onUpdate={(p) => setPayments(prev => prev.map(item => item.id === p.id ? p : item))}
                onDelete={(id) => setPayments(prev => prev.filter(p => p.id !== id))}
              />
            )}
            {activeTab === 'vendor-settlements' && (
              <VendorSettlementsView 
                currentUser={currentUser}
                costs={costs}
                vendors={vendors}
                projects={projects}
                onAdd={(c) => setCosts(prev => [...prev, c])}
                onUpdate={(c) => setCosts(prev => prev.map(item => item.id === c.id ? c : item))}
                onDelete={(id) => setCosts(prev => prev.filter(c => c.id !== id))}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
