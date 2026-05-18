export interface MaterialInventoryItem {
  id: string;
  project_id: string;
  date: string;
  materialName: string;
  size: string;
  count: number;
  unitPrice: number;
  totalPrice: number;
  discountPercentage: number;
  discountAmount: number;
  finalPrice: number;
  vendorId?: string;
  approxDeliveryDate?: string;
  invoiceRaised: boolean;
  invoiceFile?: string;
  paymentMade: number; // Linked to vendor costs
  pendingAmount: number;
  comment?: string;
}

export const INITIAL_MATERIALS: MaterialInventoryItem[] = [
  {
    id: 'mat1',
    project_id: 'PROJ-2024-07-001',
    date: '2024-07-15',
    materialName: 'Commercial Plywood (18mm)',
    size: '8ft x 4ft',
    count: 12,
    unitPrice: 110,
    totalPrice: 1320,
    discountPercentage: 5,
    discountAmount: 66,
    finalPrice: 1254,
    vendorId: 'v3',
    invoiceRaised: true,
    invoiceFile: 'INV-PLY-001.pdf',
    paymentMade: 1254,
    pendingAmount: 0,
    comment: 'For wardrobe carcass'
  }
];