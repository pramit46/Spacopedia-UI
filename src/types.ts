import {  Vendor } from './components/objects/vendor';
import { User } from './components/objects/user';
import { MaterialInventoryItem } from './components/objects/materialInventory';
import { ProjectPayment } from './components/objects/projectPayment';
import { ProjectCostItem } from './components/objects/projectCostItem';
import {
  WeeklyStatus,
  ChatMessage
} from './components/objects/weekly-status';

export type { 
  User, 
  ProjectPayment, 
  ProjectCostItem, 
  Vendor,
  WeeklyStatus,
  MaterialInventoryItem,
  ChatMessage
};

export interface AppSettings {
  maxUploadCount: number;
  allowedExtensions: string[];
}

export type AccountSubView = 'overview' | 'payments' | 'vendors' | 'materials' | 'cost-analysis';

export interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User;
  isCreatingStatus: boolean;
  setIsCreatingStatus: (val: boolean) => void;
}
