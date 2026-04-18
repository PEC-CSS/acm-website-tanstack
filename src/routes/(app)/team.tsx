import { createFileRoute } from "@tanstack/react-router";

import { SocialIcon } from "$components/social-icon";

import { TEAM_DATA } from "$data";

export const Route = createFileRoute("/(app)/team")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <div>Hello "/team"!</div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {TEAM_DATA.core.map(m => (
          <div key={m.name}>
            <img {...m.avatar} />

            <h3>{m.name}</h3>
            <p>{m.title}</p>

            <ul className="flex gap-2">
              {m.links.map(link => (
                <SocialIcon
                  key={link.platform}
                  link={link}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>

      {TEAM_DATA.groups.map(g => (
        <section key={g.id}>
          <h2>{g.name}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {g.leads.map(l => (
              <div key={l.name}>
                <img
                  title={l.name}
                  alt={l.name}
                  className="rounded-sm"
                  {...l.avatar}
                />
                <h3>{l.name}</h3>

                <ul className="flex gap-2">
                  {l.links.map(link => (
                    <SocialIcon
                      key={link.platform}
                      link={link}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
