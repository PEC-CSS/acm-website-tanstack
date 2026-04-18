import { SOCIALS_DATA } from "$data";

import ACM_LOGO from "../lib/assets/pec-acm-logo.png";
import { SocialIcon } from "./social-icon";

interface IFooterProps {}

export function Footer(_props: IFooterProps) {
  return (
    <div className="mb-16 sm:mb-0 bg-gray-200 border-t-2 border-t-gray-500">
      <footer className="px-8 py-16 min-h-64 max-w-5xl mx-auto">
        <section className="flex flex-col sm:flex-row gap-8 items-center justify-between">
          <div className="flex flex-col gap-4 items-center sm:items-start">
            <img
              src={ACM_LOGO}
              className="max-w-16"
            />

            <div className="flex md:flex-col gap-2">
              <span>PEC ACM CSS</span>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
          </div>

          <nav>
            <ul className="flex gap-2">
              {SOCIALS_DATA.map(link => (
                <SocialIcon
                  key={link.platform}
                  link={link}
                />
              ))}
            </ul>
          </nav>
        </section>
      </footer>
    </div>
  );
}
