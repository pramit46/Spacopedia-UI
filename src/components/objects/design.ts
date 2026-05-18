export interface DesignVersion {
  id: string;
  project_id: string;
  version: string;
  date: string;
  description: string;
  fileName: string;
  userId: string; // ID of the creator
}

export const INITIAL_DESIGN_VERSIONS: DesignVersion[] = [
  { id: '1', project_id: 'PROJ-2024-07-001', version: 'V1.0', date: '2024-07-01', description: 'Initial 2D layout and zoning', fileName: 'layout_v1.pdf', userId: 'u6' },
  { id: '2', project_id: 'PROJ-2024-07-001', version: 'V1.1', date: '2024-07-05', description: 'Updated 2D floor plan with electrical points', fileName: 'layout_v1.1.pdf', userId: 'u6' },
  { id: '3', project_id: 'PROJ-2024-07-001', version: 'V2.0', date: '2024-07-10', description: 'First 3D photorealistic Render (Living Room)', fileName: 'render_v2.jpg', userId: 'u6' },
];