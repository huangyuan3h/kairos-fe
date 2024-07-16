import { ReactElement } from "react";

import { Sheet } from "lucide-react";

export interface MenuItemType {
  key: string;
  name: string;
  icon: ReactElement;
  href: string;
}

export const menuItems: MenuItemType[] = [
  {
    key: "predictReport",
    name: "predictReport",
    icon: <Sheet className="size-5" />,
    href: "/predict-report",
  },
];
