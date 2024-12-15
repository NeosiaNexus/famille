import { SideBarTrigger } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <div>
      <div className={"absolute left-2 top-3"}>
        <SideBarTrigger />
      </div>
      <div className={"absolute right-1.5 top-2"}>
        <Popover>
          <PopoverTrigger>
            <span
              className={
                "absolute right-1 top-1 overflow-hidden rounded-full p-4 text-black bg-white shadow-md"
              }
            >
              <FaUser />
            </span>
          </PopoverTrigger>
          <PopoverContent
            className={
              "w-fit fixed top-9 right-1.5 bg-white/60 backdrop-blur-xl"
            }
          >
            <div
              className={
                "flex flex-col justify-center items-center gap-2 w-fit"
              }
            >
              <Link href={"/home/profile"}>Mon profil</Link>
              <Button>Déconnexion</Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Navbar;
