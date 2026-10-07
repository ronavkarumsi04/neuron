import type { ModuleId } from "../curriculum";
import type { LessonContent } from "../lesson-types";
import { agents } from "./agents";
import { deepLearning } from "./deep-learning";
import { ethics } from "./ethics";
import { foundations } from "./foundations";
import { future } from "./future";
import { modelBuilding } from "./model-building";
import { toolkit } from "./toolkit";
import { transformers } from "./transformers";

const content: Record<ModuleId, Record<string, LessonContent>> = {
  foundations,
  toolkit,
  ethics,
  future,
  "deep-learning": deepLearning,
  transformers,
  "model-building": modelBuilding,
  agents,
};

export const getLessonContent = (moduleId: ModuleId, slug: string): LessonContent | undefined => content[moduleId]?.[slug];
