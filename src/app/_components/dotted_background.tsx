import React from "react";

const DottedBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] -z-10"></div>
  );
};

export default DottedBackground;
