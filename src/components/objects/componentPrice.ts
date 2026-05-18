export interface ComponentPrice {
  id: string;
  name: string;
  unit: string;
  rate: number;
  type: 'Civil' | 'Woodwork' | 'Electrical' | 'Plumbing' | 'Hardware' | 'Other';
  state: string;
  city: string;
}


export const COMPONENT_PRICES: ComponentPrice[] = [
  { id: 'cp1', name: 'Commercial Plywood (18mm)', unit: 'Sqft', rate: 110, type: 'Woodwork', state: 'Maharashtra', city: 'Mumbai' },
  { id: 'cp2', name: 'Gurjan Plywood (18mm)', unit: 'Sqft', rate: 185, type: 'Woodwork', state: 'Maharashtra', city: 'Mumbai' },
  { id: 'cp3', name: 'Design Knobs (Brass)', unit: 'Pcs', rate: 150, type: 'Hardware', state: 'Delhi', city: 'New Delhi' },
  { id: 'cp4', name: 'Wooden Shutter', unit: 'Sqft', rate: 450, type: 'Woodwork', state: 'Gujarat', city: 'Surat' },
  { id: 'cp5', name: 'Glass Shutter (Tinted)', unit: 'Sqft', rate: 850, type: 'Woodwork', state: 'Gujarat', city: 'Surat' },
  { id: 'cp6', name: 'Hinges (Soft Close)', unit: 'Pair', rate: 450, type: 'Hardware', state: 'Delhi', city: 'New Delhi' },
  { id: 'm1', name: 'Cement', unit: 'Bag', rate: 450, type: 'Civil', state: 'Maharashtra', city: 'Mumbai' },
  { id: 'm2', name: 'TMT Steel', unit: 'Kg', rate: 75, type: 'Civil', state: 'Delhi', city: 'New Delhi' },
  { id: 'm3', name: 'Sand', unit: 'CFT', rate: 65, type: 'Civil', state: 'Karnataka', city: 'Bangalore' },
  { id: 'm4', name: 'Brick', unit: 'Pcs', rate: 12, type: 'Civil', state: 'West Bengal', city: 'Kolkata' },
  { id: 'm5', name: 'Paint (Apex)', unit: 'Litre', rate: 320, type: 'Other', state: 'Tamil Nadu', city: 'Chennai' },
];