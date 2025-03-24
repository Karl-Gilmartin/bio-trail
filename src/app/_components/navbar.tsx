"use client";

import React, { useState } from "react";
import Link from "next/link";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-cambridgeBlue p-5 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/">
            <span className="text-white text-xl font-bold cursor-pointer">BioTrail</span>
          </Link>

          {/* Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-10 text-lg">
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
              <Link href="/birds" className="text-white bg-darkSlateGray rounded-xl p-3 transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:scale-105 hover:bg-white">Record Sighting</Link>
            </li>
            <li>
              <Link href="/sightings" className="text-white bg-darkSlateGray rounded-xl p-3 transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:scale-105 hover:bg-white">View Sightings</Link>
            </li>
            <li>
              <Link href="/contact" className="text-white bg-darkSlateGray rounded-xl p-3 transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:scale-105 hover:bg-white">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <ul className="pt-4 space-y-4">
            <li>
              <Link 
                href="/about" 
                className="block text-white transition-all duration-300 hover:text-darkSlateGray hover:font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                href="/explore" 
                className="block text-white transition-all duration-300 hover:text-darkSlateGray hover:font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </Link>
            </li>
            <li>
              <Link 
                href="/blog" 
                className="block text-white transition-all duration-300 hover:text-darkSlateGray hover:font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                href="/birds" 
                className="block text-white bg-darkSlateGray rounded-xl p-3 transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:bg-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Record Sighting
              </Link>
            </li>
            <li>
              <Link 
                href="/sightings" 
                className="block text-white bg-darkSlateGray rounded-xl p-3 transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:bg-white"
                onClick={() => setIsMenuOpen(false)}
              >
                View Sightings
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="block text-white bg-darkSlateGray rounded-xl p-3 transition-all duration-300 hover:text-darkSlateGray hover:font-bold hover:bg-white"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
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
