import { File, RocketLaunch, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { LucideIcon } from "lucide-react";

export type Feature = {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
};

export const featuresData: Feature[] = [
  {
    id: 1,
    icon: File,
    title: "Revolutionary Document Interaction",
    description:
      "Engage with documents like never before. Chat with texts, reports, and papers as if they were conversational partners, extracting knowledge and insights through an intuitive, AI-powered interface.",
  },
  {
    id: 2,
    icon: Sparkle,
    title: "Mastering Argumentation Theories",
    description:
      "Our platform demystifies complex argumentation structures, making it easier for students, academics, and professionals to grasp and apply advanced reasoning techniques. Whether you’re crafting a compelling argument or analyzing a critical theory, our tools provide unparalleled support.",
  },
  {
    id: 3,
    icon: RocketLaunch,
    title: "AI-Enhanced Capabilities",
    description:
      "Beyond interactive documents and argumentation models, we offer a suite of AI-driven features to enrich your cognitive experiences. From semantic analysis to predictive trends, our platform caters to a diverse range of intellectual pursuits.",
  },
];
