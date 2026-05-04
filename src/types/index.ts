export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number; // in cents
  stock: number;
  images: string[];
  description: string;
  category: string | null;
  isLimited: boolean;
  pairNumber: number | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  mollieId: string | null;
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  total: number; // in cents
  status: OrderStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
}
