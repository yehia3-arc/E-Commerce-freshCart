import { ProductType } from "./product.type";

export interface OrderShippingAddress {
  details: string;
  phone: string;
  city: string;
  postalCode?: string;
}

export interface OrderItem {
  count: number;
  _id: string;
  product: ProductType;
  price: number;
}

export interface OrderType {
  shippingAddress: OrderShippingAddress;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: "card" | "cash";
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: { _id: string; name: string; email: string };
  cartItems: OrderItem[];
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  __v: number;
}
