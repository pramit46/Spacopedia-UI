export interface Vendor {
  id: string;
  name: string;
  type: string;
  address: string;
  state: string;
  city: string;
  poc: string;
  contactNumber: string;
  gstNumber: string;
  rating?: number;
}

export const VENDORS: Vendor[] = [
  { 
    id: 'v1', 
    name: 'BuildStrong Civil', 
    type: 'Civil Contractor', 
    address: '123 Construction Lane',
    state: 'Maharashtra',
    city: 'Mumbai',
    poc: 'Ramesh Kumar',
    contactNumber: '+91 98765 43210',
    gstNumber: '27AAAAA0000A1Z5',
    rating: 4.8
  },
  { 
    id: 'v2', 
    name: 'Sparky Electricians', 
    type: 'Wiring & Components',
    address: '45 Voltage Blvd',
    state: 'Karnataka',
    city: 'Bangalore',
    poc: 'Suresh Raina',
    contactNumber: '+91 87654 32109',
    gstNumber: '29BBBBB1111B1Z6',
    rating: 4.5
  },
  { 
    id: 'v3', 
    name: 'WoodWizard Carpentry', 
    type: 'Furniture & Woodwork',
    address: '78 Timber Road',
    state: 'Delhi',
    city: 'New Delhi',
    poc: 'Amit Singh',
    contactNumber: '+91 76543 21098',
    gstNumber: '07CCCCC2222C1Z7',
    rating: 4.9
  },
  { 
    id: 'v4', 
    name: 'Perfect Finish Paints', 
    type: 'Wall Treatments',
    address: '12 Color Plaza',
    state: 'West Bengal',
    city: 'Kolkata',
    poc: 'Debashis Roy',
    contactNumber: '+91 65432 10987',
    gstNumber: '19DDDDD3333D1Z8',
    rating: 4.2
  },
];