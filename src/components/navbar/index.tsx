import { Separator } from "@base-ui/react";
import { Drawer } from "@base-ui/react/drawer";
import {
  IconX,
  IconGitBranch,
  IconLogin,
  IconUsersGroup,
  IconCalendarWeek,
  IconMenu2,
} from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";

import { SOCIALS_DATA } from "$data";

import { cn } from "$lib/utils";
import ACM_LOGO from "../../lib/assets/pec-acm-logo.png";
import { SocialIcon } from "../social-icon";
import { MobileDrawer } from "./mobile-sheet";

const NAVBAR_LINKS = [
  { label: "Team", href: "/team", Icon: IconUsersGroup },
  { label: "Branches", href: "/branches", Icon: IconGitBranch },
  { label: "Events", href: "/events", Icon: IconCalendarWeek },
];

interface INavbarProps {}

export function Navbar(_props: INavbarProps) {
  const { pathname } = useLocation();

  const drawerHandle = Drawer.createHandle();

  return (
    <>
      <div className="hidden sm:block fixed top-0 w-full bg-gray-200 border-b-2 border-b-gray-500">
        <header className="min-h-16 py-2 max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="flex gap-4 items-center">
            <Link to="/">
              <img
                src={ACM_LOGO}
                className="max-w-12"
              />
            </Link>

            <nav>
              <ul className="flex gap-4">
                {NAVBAR_LINKS.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <Link
                      to={href}
                      className={cn(
                        "flex items-center gap-2 text-lg group transition-colors duration-150 text-black/50 hover:text-black font-semibold",
                        pathname === href && "text-black",
                      )}
                    >
                      <Icon size={22} /> {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <button className="flex items-center gap-2">
            <IconLogin /> Sign In
          </button>
        </header>
      </div>

      <div className="sm:hidden justify-between flex fixed bottom-0 inset-x-0 z-50 p-3 bg-gray-200 border-t-2 border-t-gray-500">
        <Link to="/">
          <img
            src={ACM_LOGO}
            className="max-w-12"
          />
        </Link>

        <Drawer.Trigger
          handle={drawerHandle}
          className="min-w-12 flex shadow-black shadow-xs active:shadow-none items-center justify-center gap-2 py-2 rounded-sm bg-gray-500 text-white font-medium"
        >
          {drawerHandle.isOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
        </Drawer.Trigger>
      </div>

      <MobileDrawer handle={drawerHandle}>
        <div className="h-full flex flex-col">
          <div className="flex-1"></div>

          <ul className="flex flex-col p-4 gap-6">
            {NAVBAR_LINKS.map(link => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="flex items-center gap-2 text-xl font-medium"
                >
                  <link.Icon /> {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <Separator
            orientation="horizontal"
            className="h-px bg-black mx-2"
          />

          <button className="flex m-4 items-center gap-2 text-xl font-medium">
            <IconLogin /> Sign In
          </button>

          <Separator
            orientation="horizontal"
            className="h-px bg-black mx-2"
          />

          <nav className="mx-auto py-4">
            <ul className="flex gap-2 px-2">
              {SOCIALS_DATA.map(link => (
                <SocialIcon
                  key={link.platform}
                  link={link}
                />
              ))}
            </ul>
          </nav>
        </div>
      </MobileDrawer>
    </>
  );
}
