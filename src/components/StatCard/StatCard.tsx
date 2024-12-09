import React from "react";

interface StatCardProps {
  Icon: React.ElementType;
  value: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, Icon }) => {
  return (
    <div
      className={
        "flex flex-1 flex-col gap-2 rounded-lg bg-gray-700 p-5 text-white shadow"
      }
    >
      <div className={"flex items-center justify-start gap-3"}>
        <div className={"text-4xl text-blue-300"}>{Icon && <Icon />}</div>
        <div className={"text-xl"}>{value}</div>
      </div>
      <p className={"uppercase"}>{label}</p>
    </div>
  );
};

export default StatCard;