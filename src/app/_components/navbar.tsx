import React from "react";
import Link from "next/link";

const NavBar: React.FC = () => {
  return (
    <nav className="bg-cambridgeBlue p-5 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <span className="text-white text-xl font-bold cursor-pointer">BioTrail</span>
        </Link>
        <ul className="flex space-x-10 text-lg">
          <li>
            <Link href="/about" className="text-white transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:scale-105">About</Link>
          </li>
          <li>
            <Link href="/explore" className="text-white transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:scale-105">Explore</Link>
          </li>
          <li>
            <Link href="/blog" className="text-white transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:scale-105">Blog</Link>
          </li>
          <li>
            <Link href="/contact" className="text-white bg-darkSlateGray rounded-xl p-3 transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:scale-105 hover:bg-white">Contact</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;


/* CSS HEX */
// --castleton-green: #005236ff;
// --jade: #24B469ff;
// --celadon: #ADE4C8ff;
// --mint-green: #C7E6D7ff;
// --dark-green: #053525ff;


// /* CSS HEX */
// --cambridge-blue: #7A9889ff;
// --cambridge-blue-2: #7B998Aff;
// --dark-slate-gray: #085352ff;
// --white-smoke: #F1F4F2ff;
// --cambridge-blue-3: #93AC9Fff;
