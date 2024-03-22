import { File } from "@prisma/client";
import * as z from "zod";

import { ActionState } from "@/lib/create-safe-action";

import { UploadFile } from "./schema";

export type InputType = z.infer<typeof UploadFile>;
export type OutputType = ActionState<InputType, File>;
