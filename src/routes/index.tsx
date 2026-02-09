import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

const SOCIAL = [
  { platform: "Discord", url: "https://discord.gg/59mDGtSyGD" },
  { platform: "Github", url: "https://github.com/PEC{CSS/" },
  { platform: "Instagram", url: "https://www.instagram.com/pecacm" },
  {
    platform: "Youtube",
    url: "https://www.youtube.com/c/PECACMStudentChapter",
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/company/pec-acm-student-chapter",
  },
  { platform: "Facebook", url: "https://www.facebook.com/pecacm/" },
];

function App() {
  return (
    <>
      <div className="flex gap-x-8 lg:gap-x-16 xl:gap-x-24 justify-center px-8 pt-48 pb-32 md:py-40">
        <section className="hidden md:block w-40 shrink-0">
          <div className="flex sticky top-8 w-32 shrink-0 flex-col gap-6">
            <img
              alt="pec acm logo"
              src="/assets/pec-acm-logo.png"
              className="size-14"
            />
            <ol className="flex flex-col gap-2">
              <li>ACM at PEC</li>
              <li>About Us</li>
              <li>Branches</li>
              <li>Team</li>
              <li>Events</li>
              <li>
                <Link to="/sign-in">Sign In</Link>
              </li>
            </ol>

            <hr />

            <ol className="flex flex-col gap-2">
              {SOCIAL.map(s => (
                <li key={s.platform}>
                  <a href={s.url}>{s.platform}</a>
                </li>
              ))}
            </ol>
          </div>
        </section>
        <main className="w-xl flex flex-col gap-16 md:gap-24 min-w-0">
          <div>
            <h1 className="font-display font-semibold text-4xl sm:text-5xl leading-none tracking-tight text-accent mb-2">
              A computer science society at Punjab Engineering College, Chd.
            </h1>
            <p className="font-display font-semibold text-2xl sm:text-3xl leading-none tracking-tight text-text-muted">
              Building, learning, and coding together
            </p>
          </div>

          {[1, 2].map(val => (
            <p
              key={val}
              className="text-lg sm:text-2xl leading-snug tracking-tight text-muted"
            >
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque
              faucibus ex sapien vitae pellentesque sem placerat. In id cursus
              mi pretium tellus duis convallis. Tempus leo eu aenean sed diam
              urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum
              egestas. Iaculis massa nisl malesuada lacinia integer nunc
              posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad
              litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum
              dolor sit amet consectetur adipiscing elit. Quisque faucibus ex
              sapien vitae pellentesque sem placerat. In id cursus mi pretium
              tellus duis convallis. Tempus leo eu aenean sed diam urna tempor.
              Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
              Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
              hendrerit semper vel class aptent taciti sociosqu. Ad litora
              torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor
              sit amet consectetur adipiscing elit. Quisque faucibus ex sapien
              vitae pellentesque sem placerat. In id cursus mi pretium tellus
              duis convallis. Tempus leo eu aenean sed diam urna tempor.
              Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
              Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
              hendrerit semper vel class aptent taciti sociosqu. Ad litora
              torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor
              sit amet consectetur adipiscing elit. Quisque faucibus ex sapien
              vitae pellentesque sem placerat. In id cursus mi pretium tellus
              duis convallis. Tempus leo eu aenean sed diam urna tempor.
              Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
              Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
              hendrerit semper vel class aptent taciti sociosqu. Ad litora
              torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor
              sit amet consectetur adipiscing elit. Quisque faucibus ex sapien
              vitae pellentesque sem placerat. In id cursus mi pretium tellus
              duis convallis. Tempus leo eu aenean sed diam urna tempor.
              Pulvinar vivamus fringilla lacus nec metus bibendum egestas.
              Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut
              hendrerit semper vel class aptent taciti sociosqu. Ad litora
              torquent per conubia nostra inceptos himenaeos.
            </p>
          ))}
        </main>
        <section className="hidden md:block w-40 shrink-0"></section>
      </div>

      <div className="flex gap-x-8 lg:gap-x-16 xl:gap-x-24 justify-center border-t border-border bg-bg-dark px-8 pt-12 pb-24 sm:py-32">
        <section className="hidden md:flex shrink-0 w-32"></section>

        <footer className="flex gap-4 flex-col items-center text-center sm:text-left sm:flex-row sm:items-end sm:justify-between w-xl min-w-0">
          <div className="flex items-center sm:items-start flex-col gap-4 sm:gap-6">
            <img
              alt="logo"
              src="/assets/pec-acm-logo.png"
              className="size-14 text-text"
            />
            <div className="flex sm:flex-col gap-1 sm:gap-0">
              <span className="font-medium text-base tracking-tight text-text">
                ACM at PEC
              </span>
              <span className="font-medium sm:text-sm tracking-tight text-muted-content">
                &copy; {new Date().getFullYear()}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center sm:items-end sm:gap-8">
            <div className="order-last sm:order-first w-fit flex justify-end items-center gap-4">
              {SOCIAL.map(s => (
                <a
                  href={s.url}
                  key={s.url}
                  target="_blank"
                >
                  {s.platform}
                </a>
              ))}
            </div>
            <div className="flex flex-col sm:items-end">
              <a href="/colophon">
                <span className="font-medium text-base tracking-tight text-text">
                  Built by Students
                </span>
              </a>
              <span className="font-medium text-base tracking-tight text-text">
                ACM-plishing together
              </span>
            </div>
          </div>
        </footer>

        <section className="hidden md:flex shrink-0 w-32"></section>
      </div>
    </>
  );
}
