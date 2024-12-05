"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { IoMdMenu } from "react-icons/io";

const CustomSidebarTrigger = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <button onClick={toggleSidebar}
    className={
        "fixed top-2 left-2 z-50 p-2 rounded-full bg-neutral-950 shadow-md"
    }
    >
      <IoMdMenu className={"text-3xl text-white"} />
    </button>
  );
};

export default CustomSidebarTrigger;
