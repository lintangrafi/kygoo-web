import type { BusinessProject } from '@/lib/business-lines';
import { normalizeMediaUrl } from '@/src/lib/media-url';

type BackendEnvelope<T> = {
  code?: number;
  message?: string;
  status?: boolean;
  data?: T;
};

type ProjectMap = Record<'studio' | 'photobooth' | 'digital' | 'coffee', BusinessProject[]>;

const fallbackMap: ProjectMap = {
  studio: [],
  photobooth: [],
  digital: [],
  coffee: [],
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

function sortGallery(projects: BusinessProject[]): BusinessProject[] {
  return [...projects].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

function normalizeProjectsMedia(projects: BusinessProject[]): BusinessProject[] {
  return projects.map(project => ({
    ...project,
    gallery: (project.gallery || []).map(item => ({
      ...item,
      file_url: normalizeMediaUrl(item.file_url),
    })),
  }));
}

export async function fetchAllProjectsMap(): Promise<ProjectMap> {
  try {
    const slugs: Array<keyof ProjectMap> = ['studio', 'photobooth', 'digital', 'coffee'];
    const results = await Promise.all(slugs.map(slug => fetchProjectsByLine(slug)));

    return {
      studio: sortGallery(results[0]),
      photobooth: sortGallery(results[1]),
      digital: sortGallery(results[2]),
      coffee: sortGallery(results[3]),
    };
  } catch {
    return fallbackMap;
  }
}

export async function fetchProjectsByLine(
  slug: 'studio' | 'photobooth' | 'digital' | 'coffee'
): Promise<BusinessProject[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/v1/business-projects?business_line=${slug}`,
      { cache: 'no-store' }
    );
    if (!response.ok) return [];

    const json = (await response.json()) as BackendEnvelope<BusinessProject[]>;
    if (!Array.isArray(json.data)) {
      return [];
    }

    return sortGallery(normalizeProjectsMedia(json.data));
  } catch {
    return [];
  }
}
