export interface ReviewType {
  _id: string;
  review: string;
  rating: number;
  product: string;
  user: { _id: string; name: string };
  createdAt: string;
  updatedAt: string;
}
