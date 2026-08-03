import type { Project, MediaItem } from "@/data/projects";
import type { TranslationParams } from "./translate";

type TFn = (key: string, params?: TranslationParams) => string;

function resolve(t: TFn, key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}

export function localizeProject(t: TFn, project: Project) {
  const slug = project.slug;
  const base = slug ? `projects.items.${slug}` : "";

  const title = slug ? resolve(t, `${base}.title`, project.title) : project.title;
  const tag = slug ? resolve(t, `${base}.tag`, project.tag) : project.tag;
  const tool = slug ? resolve(t, `${base}.tool`, project.tool) : project.tool;
  const desc = slug ? resolve(t, `${base}.desc`, project.desc) : project.desc;

  const media: MediaItem[] | undefined = project.media?.map((m, i) => ({
    ...m,
    caption: slug
      ? resolve(t, `${base}.media${i}`, m.caption ?? "")
      : m.caption,
  }));

  return { title, tag, tool, desc, media };
}

export function localizeFilterLabel(t: TFn, filterId: string) {
  return resolve(t, `projects.filters.${filterId}`, filterId);
}
