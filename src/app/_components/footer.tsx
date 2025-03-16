import React from "react";
import Link from "next/link";
import { FaLinkedin, FaSpotify, FaInstagram } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-darkSlateGray text-white p-5 mt-10">
      <div className="container mx-auto flex flex-col items-center text-center">
        <p className="text-lg font-semibold mb-4">
            <a href="https://www.google.ie">BioTrail</a>
        </p>
        <p className="text-md italic mb-4">
          Devloped by Karl Gilmartin
        </p>
        <p className="mb-4">&copy; {new Date().getFullYear()} All rights reserved.</p>

      </div>
    </footer>
  );
};

export default Footer;