"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { IoMdMenu } from "react-icons/io";

const SideBarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className={"fixed left-2 top-2 z-50 rounded-full bg-white p-2 shadow-md"}
    >
      <IoMdMenu className={"text-3xl text-black"} />
    </button>
  );
};

export default SideBarTrigger;
