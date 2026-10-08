import { SiteProject } from "@/types/project";

export interface ProjectRepository {
  load(projectId: string): Promise<SiteProject | null>;
  save(project: SiteProject): Promise<void>;
  listProjects?(): Promise<Array<{ id: string; name: string; updatedAt: string }>>;
  deleteProject?(projectId: string): Promise<void>;
}
