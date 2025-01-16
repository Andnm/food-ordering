import { ReactNode } from "react";
import { AiFillSchedule } from "react-icons/ai";
import { BiSolidUserAccount } from "react-icons/bi";
import { MdOutlineFastfood, MdOutlineSupportAgent } from "react-icons/md";
import { TbLayoutDashboard } from "react-icons/tb";
import { GrDocumentConfig } from "react-icons/gr";
import { PiSirenThin } from "react-icons/pi";
import { MdOutlineTravelExplore } from "react-icons/md";
import { MdOutlineRequestPage } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";

import { ROLE_ADMIN, ROLE_USER } from "./constants";
import { toast } from "react-toastify";

export interface SliderMenuItem {
  key: string;
  icon: ReactNode;
  label: string;
  roles: number[];
}

export const sliderMenu = [
  // {
  //   key: "admin/dashboard",
  //   icon: <TbLayoutDashboard />,
  //   label: "Dashboard",
  //   roles: [ROLE_ADMIN, ROLE_USER],
  // },
  {
    key: "admin/user",
    icon: <BiSolidUserAccount />,
    label: "User",
    roles: [ROLE_USER, ROLE_ADMIN],
  },
  {
    key: "admin/order",
    icon: <MdOutlineRequestPage />,
    label: "Order",
    roles: [ROLE_ADMIN],
  },
  {
    key: "admin/item",
    icon: <MdOutlineFastfood  />,
    label: "Item",
    roles: [ROLE_ADMIN],
  }
] as SliderMenuItem[];

export const toastError = (error: any) => {
  const messages = error?.response?.data?.message;

  if (Array.isArray(messages)) {
    const combinedMessage = messages.join("\n");
    toast.error(combinedMessage);
  } else {
    toast.error(messages || error.message || "An error occurred");
  }
};

export const handleActionNotSupport = () => {
  toast.warning("This action not support yet!");
};