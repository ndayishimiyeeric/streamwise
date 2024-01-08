import * as z from "zod";

import { PriceWithQuantity } from "@/types";

export const CreateSession = z.custom<PriceWithQuantity>((data) => {
  return typeof data === "object" && data !== null && "id" in data;
});
