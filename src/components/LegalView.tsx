import React from 'react';
import { ShieldCheck, FileText, Download, Eye, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../mockData';

interface LegalViewProps {
  currentUser: User;
  projectId: string;
}

export function LegalView({ currentUser, projectId }: LegalViewProps) {
  const documents = [
    { id: 'L1', name: 'Service Agreement - Revision 2', type: 'Contract', date: '2024-01-15', status: 'Signed' },
    { id: 'L2', name: 'Site Safety Liability Waiver', type: 'Compliance', date: '2024-02-01', status: 'Signed' },
    { id: 'L3', name: 'Non-Disclosure Agreement', type: 'Legal', date: '2023-12-10', status: 'Signed' },
    { id: 'L4', name: 'Interim Change Order #04', type: 'Addendum', date: '2024-05-20', status: 'Pending Review' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h2 className="text-4xl font-black italic mb-2 tracking-tight">Legal & Compliance</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium">Repository for project contracts, liability waivers, and regulatory filings.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border dark:border-gray-800 shadow-sm">
          <ShieldCheck className="w-8 h-8 text-blue-600 mb-4" />
          <h4 className="text-lg font-black italic mb-1">Contract Integrity</h4>
          <p className="text-gray-500 text-sm font-medium">92% Compliance rating based on current project milestones.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border dark:border-gray-800 shadow-sm">
          <FileText className="w-8 h-8 text-blue-400 mb-4" />
          <h4 className="text-lg font-black italic mb-1">Active Documents</h4>
          <p className="text-gray-500 text-sm font-medium">{documents.length} verified legal instruments on record.</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-8 rounded-[2rem] border dark:border-gray-800 shadow-sm">
          <Clock className="w-8 h-8 text-orange-400 mb-4" />
          <h4 className="text-lg font-black italic mb-1">Pending Review</h4>
          <p className="text-gray-500 text-sm font-medium">1 document awaiting partner counter-signature.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-[2.5rem] overflow-hidden shadow-sm">
        <div className="p-8 border-b dark:border-gray-800 flex items-center justify-between">
          <h3 className="text-xl font-black italic">Document Vault</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/50 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                <th className="px-8 py-5">Document Name</th>
                <th className="px-6 py-5">Categorization</th>
                <th className="px-6 py-5">Effective Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-800">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-colors">
                  <td className="px-8 py-6 font-bold truncate max-w-[300px]" title={doc.name}>
                    {doc.name}
                  </td>
                  <td className="px-6 py-6">
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-xs font-bold text-gray-600 dark:text-gray-300">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-medium text-gray-500">{doc.date}</td>
                  <td className="px-6 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      doc.status === 'Signed' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 rounded-lg transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
