export interface FurnitureTemplate {
  id: string;
  name: string;
  defaultWidth: number;
  defaultHeight: number;
  category: 'Storage' | 'Bed' | 'Surface' | 'Opening';
  rules: {
    plywoodFactor: number;
    knobFactor: number;
    shutterFactor: number;
  };
}




export const FURNITURE_TEMPLATES: FurnitureTemplate[] = [
  { 
    id: 't1', 
    name: 'Wardrobe', 
    defaultWidth: 5, 
    defaultHeight: 7, 
    category: 'Storage',
    rules: { plywoodFactor: 3.5, knobFactor: 0.1, shutterFactor: 0.05 }
  },
  { 
    id: 't2', 
    name: 'Bed (Queen)', 
    defaultWidth: 5, 
    defaultHeight: 6.5, 
    category: 'Bed',
    rules: { plywoodFactor: 4.5, knobFactor: 0, shutterFactor: 0 }
  },
  { 
    id: 't3', 
    name: 'Door', 
    defaultWidth: 3, 
    defaultHeight: 7, 
    category: 'Opening',
    rules: { plywoodFactor: 1.1, knobFactor: 0, shutterFactor: 1 }
  },
  { 
    id: 't4', 
    name: 'Dressing Table', 
    defaultWidth: 2.5, 
    defaultHeight: 6, 
    category: 'Surface',
    rules: { plywoodFactor: 2.5, knobFactor: 0.2, shutterFactor: 0.1 }
  },
  { 
    id: 't5', 
    name: 'Bookshelf', 
    defaultWidth: 3, 
    defaultHeight: 6.5, 
    category: 'Storage',
    rules: { plywoodFactor: 4.2, knobFactor: 0, shutterFactor: 0 }
  },
  { 
    id: 't6', 
    name: 'Wall Panel', 
    defaultWidth: 8, 
    defaultHeight: 9, 
    category: 'Surface',
    rules: { plywoodFactor: 1.2, knobFactor: 0, shutterFactor: 0 }
  },
  { 
    id: 't7', 
    name: 'Study Table', 
    defaultWidth: 4, 
    defaultHeight: 2.5, 
    category: 'Surface',
    rules: { plywoodFactor: 2.8, knobFactor: 0.1, shutterFactor: 0.2 }
  }
];