import { SideBarTrigger } from "@/components";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className={"mb-5"}>
      <SideBarTrigger />
      <Link
        href={"/"}
        className={
          "absolute right-1.5 top-2 overflow-hidden rounded-full bg-white p-4 text-black"
        }
      >
        <FaUser />
      </Link>
    </div>
  );
};

export default Navbar;
