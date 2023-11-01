import {
  FREE_MAX_FILE_SIZE,
  FREE_MAX_PDF_PAGES,
  FREE_PROMPT_LIMIT,
  FREE_UPLOAD_LIMIT,
  GOLD_MAX_FILE_SIZE,
  GOLD_MAX_PDF_PAGES,
  GOLD_UPLOAD_LIMIT,
  SILVER_MAX_FILE_SIZE,
  SILVER_MAX_PDF_PAGES,
  SILVER_PROMPT_LIMIT,
  SILVER_UPLOAD_LIMIT,
} from "@/config/user-usage";

export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: FREE_UPLOAD_LIMIT,
    pagePerPdf: FREE_MAX_PDF_PAGES,
    promptLimit: FREE_PROMPT_LIMIT,
    fileSize: FREE_MAX_FILE_SIZE,
    price: {
      amount: 0,
      priceIds: {
        test: "",
        production: "",
      },
    },
  },
  {
    name: "Silver",
    slug: "silver",
    quota: SILVER_UPLOAD_LIMIT,
    pagePerPdf: SILVER_MAX_PDF_PAGES,
    promptLimit: SILVER_PROMPT_LIMIT,
    fileSize: SILVER_MAX_FILE_SIZE,
    price: {
      amount: 3,
      priceIds: {
        test: process.env.STREAMWISE_SILVER_PRICE_ID_TEST,
        production: "",
      },
    },
  },
  {
    name: "Gold",
    slug: "gold",
    quota: GOLD_UPLOAD_LIMIT,
    pagePerPdf: GOLD_MAX_PDF_PAGES,
    promptLimit: SILVER_PROMPT_LIMIT,
    fileSize: GOLD_MAX_FILE_SIZE,
    price: {
      amount: 5,
      priceIds: {
        test: process.env.STREAMWISE_GOLD_PRICE_ID_TEST,
        production: "",
      },
    },
  },
];

export const pricingItems = [
  {
    plan: "Free",
    tagline: "For small side documents. eg CVs, Resumes, etc.",
    quota: PLANS.find((p) => p.slug === "free")!.quota,
    features: [
      {
        text: `${FREE_MAX_PDF_PAGES} pages per PDF`,
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: `${FREE_MAX_FILE_SIZE}MB file size limit`,
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: `${FREE_PROMPT_LIMIT} queries all time`,
        footnote: "The maximum amount of queries per month.",
      },
      {
        text: "Mobile-friendly interface",
        footnote: "Use our service on any device.",
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
        negative: true,
      },
      {
        text: "Customizable AI assistant",
        footnote: "Customize your AI assistant to your liking.",
        negative: true,
      },
      {
        text: "Priority support",
        footnote: "Get priority support from our team.",
        negative: true,
      },
    ],
  },
  {
    plan: "Silver",
    tagline: "For medium-sized documents. eg. Articles, Journals, etc.",
    quota: PLANS.find((p) => p.slug === "silver")!.quota,
    features: [
      {
        text: `${SILVER_MAX_PDF_PAGES} pages per PDF`,
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: `${SILVER_MAX_FILE_SIZE}MB file size limit`,
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: `${SILVER_PROMPT_LIMIT} queries per month`,
        footnote: "The maximum amount of queries per month.",
      },
      {
        text: "Mobile-friendly interface",
        footnote: "Use our service on any device.",
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
      },
      {
        text: "Customizable AI assistant",
        footnote: "Customize your AI assistant to your liking.",
        negative: true,
      },
      {
        text: "Priority support",
        footnote: "Get priority support from our team.",
        negative: true,
      },
    ],
  },
  {
    plan: "Gold",
    tagline: "For large documents. eg. Books, Theses, etc.",
    quota: PLANS.find((p) => p.slug === "gold")!.quota,
    features: [
      {
        text: `${GOLD_MAX_PDF_PAGES} pages per PDF`,
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: `${GOLD_MAX_FILE_SIZE}MB file size limit`,
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: "Unlimited queries",
        footnote: "The maximum amount of queries per month.",
      },
      {
        text: "Mobile-friendly interface",
        footnote: "Use our service on any device.",
      },
      {
        text: "Higher-quality responses",
        footnote: "Better algorithmic responses for enhanced content quality",
      },
      {
        text: "Customizable AI assistant",
        footnote: "Customize your AI assistant to your liking.",
      },
      {
        text: "Priority support",
        footnote: "Get priority support from our team.",
      },
    ],
  },
];
