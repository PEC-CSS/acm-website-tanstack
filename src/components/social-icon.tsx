import type { TSocialsData } from "$data";

import { PLATFORM_ICONS } from "$lib/constants/platforms";
import { capitalize } from "$lib/utils";

interface TSocialIconProps {
  link: TSocialsData[number];
}

export function SocialIcon({ link }: TSocialIconProps) {
  const Icon = PLATFORM_ICONS[link.platform];

  return (
    <li
      title={capitalize(link.platform)}
      className="group size-10 flex items-center justify-center"
    >
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon
          size={32}
          className="fill-gray-400 group-hover:fill-gray-600 transition-colors duration-150"
        />
      </a>
    </li>
  );
}
