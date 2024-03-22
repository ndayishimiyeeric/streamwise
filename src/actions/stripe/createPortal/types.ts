import * as z from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { CreatePortal } from "./schema";

export type InputType = z.infer<typeof CreatePortal>;
export type OutputType = ActionState<InputType, { url: string }>;
