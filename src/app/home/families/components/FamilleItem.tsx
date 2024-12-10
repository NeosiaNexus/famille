import { IFullFamily } from "@/interfaces/IFamily";
import Link from "next/link";
import React from "react";
import { MdEventAvailable, MdFamilyRestroom, MdGroups } from "react-icons/md";

interface FamilleItemProps {
  family: IFullFamily;
}

const FamilleItem: React.FC<FamilleItemProps> = ({ family }) => {
  return (
    <Link
      href={"#"}
      className={"flex flex-col gap-2 bg-gray-700 py-3 px-6 rounded-sm"}
    >
      <div className={"flex flex-row items-center gap-3"}>
        <MdFamilyRestroom className={"text-4xl text-blue-500"} />
        <div>
          <h2 className={"text-white"}>Famille: {family.name}</h2>
          <p className={"text-gray-400 text-sm"}>
            {family.description || "Aucune description."}
          </p>
        </div>
      </div>

      <div className={"flex items-center justify-around"}>
        <div className={"flex items-center gap-3"}>
          <MdGroups className={"text-xl text-blue-300"} />
          <p className={"text-white text-opacity-20"}>
            {family.members.length}
          </p>
        </div>
        <div className={"flex items-center gap-3"}>
          <MdEventAvailable className={"text-xl text-blue-300"} />
          <p className={"text-white text-opacity-20"}>{family.events.length}</p>
        </div>
      </div>
    </Link>
  );
};

export default FamilleItem;
