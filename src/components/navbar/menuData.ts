// import { Menu } from "@/types/menu";

export type Menu = {
  id: number;
  title: string;
  path?: string;
  newTab: boolean;
  submenu?: Menu[];
};

const menuData = [
  {
    id: 1,
    title: "Home",
    newTab: false,
    path: "/#home",
  },
  {
    id: 2,
    title: "Features",
    newTab: false,
    path: "#features",
  },
  {
    id: 2.1,
    title: "Pricing",
    newTab: false,
    path: "/#pricing",
  },

  {
    id: 4,
    title: "Contact",
    newTab: false,
    path: "/#contact",
  },
] satisfies Menu[];

export default menuData;
