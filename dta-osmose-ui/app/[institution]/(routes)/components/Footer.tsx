import Link from "next/link";
import React from "react";

const Footer = async () => {
  //console.log(nextVersion, "nextVersion");
  return (
    <footer className="flex flex-row h-8 justify-end items-center w-full text-xs text-gray-500 p-5">
      <div className="hidden md:flex pr-5">
        <Link href="/">
          <h1 className="text-gray-600">
            Osmose CRM 0.0.1
          </h1>
        </Link>
      </div>
      <div className="hidden md:flex space-x-2 pr-2">
        Powered by DTA
        <span className= "bg-foreground rounded-md text-white px-1 mx-1">
        Software Development & Cloud Architecture Department
        </span>
        +
        <Link href={"https://www.dta.cm/"}>
          <span className="rounded-md mr-2">site</span>
        </Link>{" "}
        hosted by:
        <span className="text-bold underline">
          <Link href="https://www.vercel.com">Vercel</Link>
        </span>
      </div>
      <div className="hidden md:flex space-x-2">
        Supported by:
        <Link className="pl-1 font-bold" href="https://www.s">
          dta-...com
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
