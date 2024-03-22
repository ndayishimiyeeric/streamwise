import * as z from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { CreateSession } from "./schema";

export type InputType = z.infer<typeof CreateSession>;
export type OutputType = ActionState<InputType, { url: string }>;
