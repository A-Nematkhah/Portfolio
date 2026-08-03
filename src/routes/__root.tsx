import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { LidarCursor } from "@/components/effects/LidarCursor";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { I18nProvider, useT } from "@/i18n";

import appCss from "../styles.css?url";

const themeInitScript = `(function(){try{var k='portfolio-theme';var t=localStorage.getItem(k);var d=t==='light'?false:t==='dark'?true:true;var r=document.documentElement;r.classList.toggle('dark',d);r.dataset.theme=d?'dark':'light';r.style.colorScheme=d?'dark':'light';}catch(e){document.documentElement.classList.add('dark');document.documentElement.dataset.theme='dark';}})();`;

const localeInitScript = `(function(){try{var k='portfolio-locale';var l=localStorage.getItem(k);if(l!=='en'&&l!=='fa')l='en';var r=document.documentElement;r.lang=l==='fa'?'fa':'en';r.dir=l==='fa'?'rtl':'ltr';r.dataset.locale=l;}catch(e){}})();`;

function NotFoundComponent() {
  const t = useT();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">{t("notFound.code")}</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t("notFound.title")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t("notFound.body")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("notFound.goHome")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const t = useT();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t("error.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("error.body")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("error.retry")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("error.goHome")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Amirhossein Nematkhah | Mechatronics Engineer Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Amirhossein Nematkhah — Mechatronics Engineer specializing in mechanical design, industrial systems, project management, MATLAB, and intelligent automation.",
      },
      { name: "author", content: "Amirhossein Nematkhah" },
      { property: "og:title", content: "Amirhossein Nematkhah | Mechatronics Engineer Portfolio" },
      {
        property: "og:description",
        content:
          "Mechatronics engineer specializing in mechanical design, industrial systems, project management, and intelligent automation.",
      },
      { property: "og:type", content: "website" },
      {
        property: "og:image",
        content: "https://a-nematkhah.github.io/Portfolio/projects/conveyor-v2.webp",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image",
        content: "https://a-nematkhah.github.io/Portfolio/projects/conveyor-v2.webp",
      },
      { name: "twitter:title", content: "Amirhossein Nematkhah | Mechatronics Engineer Portfolio" },
      {
        name: "twitter:description",
        content:
          "Mechatronics engineer specializing in mechanical design, industrial systems, project management, and intelligent automation.",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.ico` },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700&display=swap",
      },
      { rel: "preconnect", href: "https://kzmhlwjargbylkxlbdvt.supabase.co" },
      { rel: "dns-prefetch", href: "https://kzmhlwjargbylkxlbdvt.supabase.co" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: localeInitScript }} />
      </head>
      <body className="workspace-atmosphere">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <ThemeProvider>
          <Outlet />
          <Toaster position="top-right" />
          <LidarCursor />
        </ThemeProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
