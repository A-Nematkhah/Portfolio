import { useMemo, useState } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { fetchProjects, type DbProject } from "@/lib/db-projects";
import { resolveAssetUrl, resolveMediaList } from "@/lib/resolve-asset";
import { PROJECTS, type Project } from "@/data/projects";
import { BlueprintBackground } from "@/components/effects/BlueprintBackground";
import { RobotGuide } from "@/components/effects/RobotGuide";
import { ToolWall } from "@/components/skills/ToolWall";
import { Nav } from "@/components/portfolio/Nav";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Projects } from "@/components/portfolio/Projects";
import { FeaturedShowcase } from "@/components/portfolio/FeaturedShowcase";
import { Experience } from "@/components/portfolio/Experience";
import { Research } from "@/components/portfolio/Research";
import { Certificates } from "@/components/portfolio/Certificates";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const projectsQueryOptions = () => ({
  queryKey: ["projects"] as const,
  queryFn: fetchProjects,
  staleTime: 30_000,
});

function mapDbProject(p: DbProject): Project {
  const mediaArr = resolveMediaList(Array.isArray(p.media) ? p.media : []);
  const firstImage = mediaArr.find((m) => m.type === "image")?.src ?? "";
  const firstVideo = mediaArr.find((m) => m.type === "video")?.src ?? "";
  const thumbRaw = resolveAssetUrl(p.thumbnail_url);
  const thumbValid = !!thumbRaw && mediaArr.some((m) => m.src === thumbRaw);
  const thumb = thumbValid ? thumbRaw : firstImage || thumbRaw;
  const video = resolveAssetUrl(p.video_url) || firstVideo || undefined;
  return {
    dbId: p.id,
    tag: p.tag || p.category,
    title: p.title,
    tool: p.tool,
    img: thumb,
    cat: p.category,
    video: video || undefined,
    desc: p.description,
    media: mediaArr.length ? mediaArr : undefined,
    externalLink: p.external_link ?? undefined,
  };
}

export function PortfolioPage() {
  const [filter, setFilter] = useState("All");
  const { isAdmin } = useAuth();
  const { data: dbProjects = [] } = useQuery(projectsQueryOptions());

  const allProjects: Project[] = useMemo(() => {
    const mapped = dbProjects.map(mapDbProject);
    // CMS purity: when DB has rows, prefer them and only keep static
    // catalog items whose title is not already seeded/managed in DB.
    if (mapped.length === 0) return PROJECTS;
    const dbTitles = new Set(mapped.map((p) => p.title.toLowerCase()));
    const extras = PROJECTS.filter((p) => !dbTitles.has(p.title.toLowerCase()));
    return [...mapped, ...extras];
  }, [dbProjects]);

  const filtered = filter === "All" ? allProjects : allProjects.filter((p) => p.cat === filter);

  const exploreProjectsByCategory = (category: string) => {
    setFilter(category);
    document.getElementById("projects")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const projectRefs = useMemo(
    () => allProjects.map((p) => ({ title: p.title, tool: p.tool, cat: p.cat })),
    [allProjects],
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <div className="workspace-noise relative min-h-screen overflow-x-hidden bg-transparent text-foreground">
        <BlueprintBackground />
        <div
          className="pointer-events-none fixed -top-40 right-0 h-[500px] w-[500px] rounded-full bg-primary/[0.07] blur-[100px] will-change-transform dark:bg-primary/[0.05]"
          style={{ transform: "translateZ(0)" }}
        />
        <div
          className="pointer-events-none fixed -bottom-32 -left-20 h-[420px] w-[420px] rounded-full blur-[110px] will-change-transform"
          style={{ transform: "translateZ(0)", background: "var(--ambient-b)" }}
          aria-hidden
        />

        <Nav />

        <main className="relative mx-auto max-w-7xl px-6 pt-[50px]">
          <Hero />
          <About />
          <Projects filter={filter} setFilter={setFilter} list={filtered} isAdmin={isAdmin} />
          <FeaturedShowcase />
          <ToolWall projects={projectRefs} onExploreProjects={exploreProjectsByCategory} />
          <Experience />
          <Research />
          <Certificates />
          <Contact />
        </main>

        <Footer />

        <RobotGuide />

        <a
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="fixed bottom-8 right-8 z-40 grid h-11 w-11 place-items-center rounded-full glass text-primary hover:glow-primary transition-shadow lg:right-28"
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-4 w-4" />
        </a>
      </div>
    </LazyMotion>
  );
}
