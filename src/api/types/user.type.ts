import { ProductType } from "@/api/types/product.type";
export interface AddressType {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}
export interface UserType {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

// export interface WishlistType {
//   count: number;
//   items: ProductType[];
//   loading: boolean;
//   hasWishlist: (id: string) => boolean;
//   wishlistToggle: (id: string) => Promise<void>;
// }
export interface WishlistContextType {
  numberOfWishlistItems: number;
  items: ProductType[];
  loading: boolean;
  hasWishlist: (id: string) => boolean;
  addWishlistItem: (p: ProductType) => void; // ✅ local-only, after API success
  removeWishlistItem: (id: string) => void; // ✅ local-only, after API success
}
export interface UsersMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
}
export interface UsersResponse {
  totalUsers: number;
  metadata: UsersMetadata;
  users: UserType[]; // ✅ matches your JSON exactly
}
