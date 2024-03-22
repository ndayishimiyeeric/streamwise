import { File } from "@prisma/client";
import * as z from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { ProcessFile } from "./schema";

export type InputType = z.infer<typeof ProcessFile>;
export type OutputType = ActionState<InputType, File>;
