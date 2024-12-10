import React, { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa";

interface PageLoaderProps {
  loading: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ loading }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (loading) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300); // Transition plus rapide
      return () => clearTimeout(timeout);
    }
  }, [loading]);

  if (!isVisible) return null; // Ne rend rien si invisible

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950 bg-opacity-75 animate-pulse">
      <div className="flex flex-col items-center justify-center text-center p-5 gap-5">
        <p>
          <FaSpinner className="w-10 h-10 text-white animate-spin" />
        </p>
        <p className={"text-white"}>
          L&apos;amour d&apos;une famille, le centre autour duquel tout gravite
          et tout brille.
        </p>
        <p className={"italic text-white text-sm"}>- Victor Hugo -</p>
      </div>
    </div>
  );
};

export default PageLoader;
