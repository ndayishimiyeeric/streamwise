export const PLANS = [
  {
    name: "Free",
    slug: "free",
    quota: 10,
    pagePerPdf: 5,
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
    quota: 50,
    pagePerPdf: 25,
    price: {
      amount: 7,
      priceIds: {
        test: process.env.STREAMWISE_SILVER_PRICE_ID_TEST,
        production: "",
      },
    },
  },
  {
    name: "Gold",
    slug: "gold",
    quota: 100,
    pagePerPdf: 100,
    price: {
      amount: 12,
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
    quota: 10,
    features: [
      {
        text: "5 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "4MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: "100 queries per month",
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
        text: "25 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "8MB file size limit",
        footnote: "The maximum file size of a single PDF file.",
      },
      {
        text: "500 queries per month",
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
        text: "100 pages per PDF",
        footnote: "The maximum amount of pages per PDF-file.",
      },
      {
        text: "16MB file size limit",
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
