"use client";
import {
  Navbar as FBNavbar,
  Button,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "./Logo";

const links = [
  { href: "/", label: "Home", exact: true },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  
  const linkBase =
    "px-2 py-2 transition-colors text-slate-600 hover:text-slate-900 " +
    "dark:text-slate-300 dark:hover:text-white";

  const linkActive =
    "font-semibold text-blue-600 dark:text-blue-400";

  return (
    <FBNavbar
      fluid
      rounded
      className="
        sticky top-0 z-40
        border-b bg-white/80 backdrop-blur
        text-slate-900 border-slate-200
        dark:bg-slate-900/70 dark:text-slate-100 dark:border-slate-800
      "
    >
      <NavbarBrand as={Link} href="/" className="text-inherit">
      
        <Logo />
      </NavbarBrand>

      <div className="flex items-center gap-2 md:order-2">
        
        <Button
          as={Link}
          href="/properties"
          color="dark"
          size="sm"
          className="dark:border-slate-700"
        >
          Browse
        </Button>
        <NavbarToggle
          className="
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            hover:bg-slate-100 dark:hover:bg-slate-800
          "
        />
      </div>

      <NavbarCollapse>
        {links.map((l) => (
          <NavbarLink
            key={l.href}
            as={Link}
            href={l.href}
            active={isActive(l.href, l.exact)}
            className={`${linkBase} ${isActive(l.href, l.exact) ? linkActive : ""}`}
          >
            {l.label}
          </NavbarLink>
        ))}
      </NavbarCollapse>
    </FBNavbar>
  );
}
