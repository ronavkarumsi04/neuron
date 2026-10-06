import type { ModuleId } from "../curriculum";
import type { LessonContent } from "../lesson-types";
import { ethics } from "./ethics";
import { foundations } from "./foundations";
import { future } from "./future";
import { toolkit } from "./toolkit";

const content: Record<ModuleId, Record<string, LessonContent>> = { foundations, toolkit, ethics, future };

export const getLessonContent = (moduleId: ModuleId, slug: string): LessonContent | undefined => content[moduleId]?.[slug];
