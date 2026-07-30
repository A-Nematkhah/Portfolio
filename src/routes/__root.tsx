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

import appCss from "../styles.css?url";

const themeInitScript = `(function(){try{var k='portfolio-theme';var t=localStorage.getItem(k);var d=t==='light'?false:t==='dark'?true:true;var r=document.documentElement;r.classList.toggle('dark',d);r.dataset.theme=d?'dark':'light';r.style.colorScheme=d?'dark':'light';}catch(e){document.documentElement.classList.add('dark');document.documentElement.dataset.theme='dark';}})();`;

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
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
      // Browsers default to requesting /favicon.ico at the domain root, which
      // 404s on a GitHub Pages project site (served under /<repo-name>/).
      // An explicit, base-aware link fixes that for both project and user sites.
      { rel: "icon", href: `${import.meta.env.BASE_URL}favicon.ico` },
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
      <ThemeProvider>
        <Outlet />
        <Toaster position="top-right" />
        <LidarCursor />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
