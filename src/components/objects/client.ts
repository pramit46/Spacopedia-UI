
export interface ClientMaster {
  id: string;
  name: string;
  address?: string;
  projectAddress: string;
  contactNumber: string;
  email: string;
}

export const INITIAL_CLIENTS: ClientMaster[] = [
  {
    id: 'c1',
    name: 'Alice Client',
    address: 'Flat 402, Green Valley Apartments',
    projectAddress: 'Plot 12, Sector 5, HSR Layout, Bangalore',
    contactNumber: '+91 99887 76655',
    email: 'alice@example.com'
  },
  {
    id: 'c2',
    name: 'John Doe',
    projectAddress: 'Villa 7, Palm Jumeirah, Dubai (Offshore Project)',
    contactNumber: '+971 50 123 4567',
    email: 'john.doe@example.com'
  }
];
