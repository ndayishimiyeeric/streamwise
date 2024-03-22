import { Price, Product, Subscription } from "@prisma/client";

export interface SubscriptionWithProduct extends Subscription {
  product: Product;
}

export interface PriceWithQuantity extends Price {
  quantity?: number;
}
