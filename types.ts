
export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  location: string;
  lastUpdated: string;
}

export interface Inventory {
  id: string;
  title: string;
  description: string;
  items: InventoryItem[];
  createdAt: string;
}

export interface AppSettings {
  logoUrl?: string;
  companyName: string;
}
