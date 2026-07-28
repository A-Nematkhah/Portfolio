import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage, projectsQueryOptions } from "@/components/portfolio/PortfolioPage";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(projectsQueryOptions()),
  head: () => ({
    meta: [
      { title: "Amirhossein Nematkhah — Mechatronics Engineer Portfolio" },
      {
        name: "description",
        content:
          "Mechatronics engineer specializing in mechanical design, industrial systems, project control and intelligent automation.",
      },
    ],
  }),
  component: PortfolioPage,
});
