import { SOCIALS_DATA } from "$data";

import { PLATFORM_ICONS } from "$lib/constants/platforms";
import ACM_LOGO from "../lib/assets/pec-acm-logo.png";

interface IFooterProps {}

export function Footer(_props: IFooterProps) {
  return (
    <div className="bg-orange-200 border-t-2 border-t-orange-500">
      <footer className="px-8 py-16 min-h-64 max-w-5xl mx-auto">
        <section className="flex items-center justify-between">
          <div>
            <img
              src={ACM_LOGO}
              className="max-w-16"
            />
          </div>

          <nav>
            <ul className="flex gap-2">
              {SOCIALS_DATA.map(link => {
                const Icon = PLATFORM_ICONS[link.platform];

                return (
                  <li
                    key={link.platform}
                    title={link.platform}
                    className="group size-10 flex items-center justify-center"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon
                        size={32}
                        className="fill-orange-400 group-hover:fill-orange-600 transition-colors duration-150"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </section>
      </footer>
    </div>
  );
}
