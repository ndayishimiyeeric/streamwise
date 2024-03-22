import {
  BASIC_MAX_MODELS,
  BASIC_MAX_PDF_COUNT,
  BASIC_MAX_PDF_PAGES,
  BASIC_MAX_QUERIES,
  HOBBY_MAX_MODELS,
  HOBBY_MAX_PDF_COUNT,
  HOBBY_MAX_PDF_PAGES,
  HOBBY_MAX_QUERIES,
} from "./resources";

export interface feature {
  label: string;
  highlight: boolean;
}

export type PlanType = "hobby" | "pro" | "basic";

export interface Plan {
  plan: PlanType;
  description: string;
  features: feature[];
  maxQueries: number | "unlimited";
  maxPdfPages: number | "unlimited";
  maxPdfCount: number | "unlimited";
  maxModels: number | "unlimited";
}

export const plans = new Map<PlanType, Plan>([
  [
    "hobby",
    {
      plan: "hobby",
      description: "Hobby Pack",
      features: [
        {
          label: `${HOBBY_MAX_QUERIES} queries forever`,
          highlight: true,
        },
        {
          label: `${HOBBY_MAX_PDF_COUNT} uploads forever`,
          highlight: true,
        },
        {
          label: `${HOBBY_MAX_PDF_PAGES} pages per file`,
          highlight: true,
        },
        {
          label: "Model creation",
          highlight: false,
        },
        {
          label: "Public model access and sharing",
          highlight: false,
        },
        {
          label: "Activity logging",
          highlight: false,
        },
        {
          label: "Priority support",
          highlight: false,
        },
      ],
      maxQueries: HOBBY_MAX_QUERIES,
      maxPdfPages: HOBBY_MAX_PDF_PAGES,
      maxPdfCount: HOBBY_MAX_PDF_COUNT,
      maxModels: HOBBY_MAX_MODELS,
    },
  ],
  [
    "basic",
    {
      plan: "basic",
      description: "Basic Pack",
      features: [
        {
          label: `${BASIC_MAX_QUERIES} queries monthly`,
          highlight: true,
        },
        {
          label: `${BASIC_MAX_PDF_COUNT} uploads monthly`,
          highlight: true,
        },
        {
          label: `${BASIC_MAX_PDF_PAGES} pages per file`,
          highlight: true,
        },
        {
          label: "Model creation",
          highlight: true,
        },
        {
          label: "Public model access and sharing",
          highlight: false,
        },
        {
          label: "Activity logging",
          highlight: false,
        },
        {
          label: "Priority support",
          highlight: false,
        },
      ],
      maxQueries: BASIC_MAX_QUERIES,
      maxPdfPages: BASIC_MAX_PDF_PAGES,
      maxPdfCount: BASIC_MAX_PDF_COUNT,
      maxModels: BASIC_MAX_MODELS,
    },
  ],
  [
    "pro",
    {
      plan: "pro",
      description: "Pro Pack",
      features: [
        {
          label: `Unlimited queries monthly`,
          highlight: true,
        },
        {
          label: `Unlimited uploads monthly`,
          highlight: true,
        },
        {
          label: `Unlimited pages per file`,
          highlight: true,
        },
        {
          label: "Model creation",
          highlight: true,
        },
        {
          label: "Public model access and sharing",
          highlight: true,
        },
        {
          label: "Activity logging",
          highlight: true,
        },
        {
          label: "Priority support",
          highlight: true,
        },
      ],
      maxQueries: "unlimited",
      maxPdfPages: "unlimited",
      maxPdfCount: "unlimited",
      maxModels: "unlimited",
    },
  ],
]);
