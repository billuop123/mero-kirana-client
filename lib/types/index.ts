export type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

export type Shop = {
  id: string;
  name: string;
  phone: string;
  panNO: string;
  address: string;
  created_at: string;
};

export type ProductCategory =
  | "grocery"
  | "dairy"
  | "beverages"
  | "snacks"
  | "household"
  | "personal_care"
  | "tobacco"
  | "frozen";

export type Product = {
  id: string;
  name: string;
  barcode: string;
  unit: string;
  sellingPrice: number;
  costPrice: number;
  vatRate: number;
  lowStockThreshold: number;
  category: ProductCategory;
  createdAt: string;
};

export type InventoryItem = {
  product_id: string;
  name: string;
  unit: string;
  category: ProductCategory;
  quantity: number;
  low_stock_threshold: number;
  updated_at: string;
};

export type BillItem = {
  id: string;
  bill_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  cost_price: number;
};

export type Bill = {
  id: string;
  customer_name: string;
  customer_phone: string;
  subtotal: number;
  discount: number;
  total_amount: number;
  payment_mode: "cash" | "card" | "esewa" | "khalti";
  is_udhari: boolean;
  is_reversed: boolean;
  items: BillItem[];
  created_at: string;
};

export type UdhariCustomer = {
  customer_name: string;
  customer_phone: string;
  bill_count: number;
  total_amount: number;
};

export type DailySummary = {
  total_bills: number;
  total_revenue: number;
  total_profit: number;
  avg_bill_value: number;
};

export type TopProduct = {
  name: string;
  total_sold: number;
  revenue: number;
  profit: number;
  margin: number;
};

export type CategoryStat = {
  category: string;
  total_sold: number;
  revenue: number;
  profit: number;
  margin: number;
};

export type PaymentStat = {
  mode: string;
  bill_count: number;
  revenue: number;
};

export type InventoryValue = {
  cost_value: number;
  selling_value: number;
  product_count: number;
};

export type LowStockProduct = {
  name: string;
  quantity: number;
  threshold: number;
};

export type ApiResponse<T> = {
  data: T;
};

export type CreateProductPayload = {
  name: string;
  barcode?: string;
  unit: string;
  selling_price: number;
  cost_price: number;
  vat_rate?: number;
  low_stock_threshold?: number;
  category: ProductCategory;
};

export type CreateBillPayload = {
  customer_name?: string;
  customer_phone?: string;
  discount?: number;
  payment_mode: string;
  is_udhari?: boolean;
  items: { product_id: string; quantity: number }[];
};

export type CreateShopPayload = {
  name: string;
  phone?: string;
  panNo?: string;
  address?: string;
};
