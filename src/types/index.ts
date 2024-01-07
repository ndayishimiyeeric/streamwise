import { Product, Subscription } from "@prisma/client";

export interface SubscriptionWithProduct extends Subscription {
  product: Product;
}
