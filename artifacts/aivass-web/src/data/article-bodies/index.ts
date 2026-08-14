/**
 * Article body registry — maps article slugs to their full body components.
 * Add a new entry here when a new article is fully migrated into the build.
 */
import { ComponentType } from "react";
import FromSurvivingToThriving from "./from-surviving-to-thriving";
import Eb1aCriterion8 from "./eb1a-critical-role-criterion";
import MasteringYourFieldOfEndeavor from "./mastering-your-field-of-endeavor";

export const ARTICLE_BODIES: Record<string, ComponentType> = {
  "from-surviving-to-thriving": FromSurvivingToThriving,
  "eb1a-critical-role-criterion": Eb1aCriterion8,
  "mastering-your-field-of-endeavor": MasteringYourFieldOfEndeavor,
};
