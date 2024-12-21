import { Price } from '@/features/stripe/types/price';

export type Product = {
  id: string;
  name: string;
  description: string;
  images: string;
  prices: Price[];
  default_price: string;
};
