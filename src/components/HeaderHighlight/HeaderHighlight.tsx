import React from "react";

interface HeaderHightLightProps {
  text: string;
}

const HeaderHighlight: React.FC<HeaderHightLightProps> = ({ text }) => {
  return (
    <div className="relative w-fit">
      <h1 className="text-white text-2xl font-semibold">{text}</h1>
      <div className="w-[110%] bg-blue-700 mt-1 -rotate-2 absolute -top-1 -left-2 h-full -z-10 rounded-sm" />
    </div>
  );
};

export default HeaderHighlight;
