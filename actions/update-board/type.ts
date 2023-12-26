import { z } from "zod";
import { Board } from "@prisma/client";

import { ActionState } from "@/lib/create-safe-action";

import { UpdateBoard } from "./schema";

export type InputType = z.infer<typeof UpdateBoard>;      // input -> title, message, id
export type ReturnType = ActionState<InputType, Board>;   // returType -> mensajes de error + data