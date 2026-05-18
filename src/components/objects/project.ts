export interface Project {
  id: string;
  name: string;
  year: number;
  month: string;
  clientId: string;
}


export const PROJECTS: Project[] = [
  { id: 'PROJ_1001', name: 'Luxury Villa Renovation', year: 2024, month: 'May', clientId: 'c1' },
  { id: 'PROJ-2024-07-001', name: 'Downtown Penthouse', year: 2024, month: 'July', clientId: 'c1' },
  { id: 'PROJ-2024-07-002', name: 'Corporate Office Fitout', year: 2024, month: 'July', clientId: 'c1' },
  { id: 'PROJ-2024-06-001', name: 'Suburban Kitchen Remodel', year: 2024, month: 'June', clientId: 'c2' },
  { id: 'PROJ-2023-12-001', name: 'Beachfront House Decor', year: 2023, month: 'December', clientId: 'c2' },
];
