import { ProductType } from "./product.type";

export interface CartData {
  cartOwner: string;
  createdAt: string;
  products: ProductCart[];
  totalCartPrice: number;
  updatedAt: string;
  __v: number;
  _id: string;
}

export interface ProductCart {
  count: number;
  price: number;
  _id: string;
  product: ProductType;
}
export interface GuestItem {
  product: ProductType;
  count: number;
  price: number;
  _id: string;
}
