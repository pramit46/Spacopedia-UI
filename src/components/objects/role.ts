export type Role = string;


export const INITIAL_ROLES: Role[] = ['client', 'accounts', 'project', 'sales', 'owner', 'designer', 'legal'];


export interface RolePermission {
  role: Role;
  allowedTabs: string[];
}

export const INITIAL_ROLE_PERMISSIONS: RolePermission[] = [
  { role: 'sales', allowedTabs: ['quotation'] },
  { role: 'designer', allowedTabs: ['quotation', 'design', 'material', 'weekly-status'] },
  { role: 'owner', allowedTabs: ['quotation', 'design', 'material', 'weekly-status', 'billing', 'legal', 'accounts', 'settings', 'execDash'] },
  { role: 'client', allowedTabs: ['quotation', 'design', 'material', 'weekly-status'] },
  { role: 'project', allowedTabs: ['quotation', 'design', 'weekly-status', 'billing'] },
  { role: 'accounts', allowedTabs: ['design', 'material', 'weekly-status', 'billing', 'accounts', 'settings'] },
  { role: 'legal', allowedTabs: ['legal'] },
];
