import { get, set, del, keys } from "idb-keyval";
import { SiteProject } from "@/types/project";
import { ProjectRepository } from "./ProjectRepository";

const PROJECT_KEY_PREFIX = "cms_project_";
const PROJECT_INDEX_KEY = "cms_projects_index";

export class IndexedDbProjectRepository implements ProjectRepository {
  async load(projectId: string): Promise<SiteProject | null> {
    try {
      const data = await get<SiteProject>(`${PROJECT_KEY_PREFIX}${projectId}`);
      return data || null;
    } catch (error) {
      console.error(`[IndexedDB] Failed to load project ${projectId}:`, error);
      return null;
    }
  }

  async save(project: SiteProject): Promise<void> {
    try {
      await set(`${PROJECT_KEY_PREFIX}${project.id}`, project);
      
      // Update index
      const index = (await get<Array<{ id: string; name: string; updatedAt: string }>>(PROJECT_INDEX_KEY)) || [];
      const updatedIndex = [
        ...index.filter((item) => item.id !== project.id),
        { id: project.id, name: project.name, updatedAt: new Date().toISOString() },
      ];
      await set(PROJECT_INDEX_KEY, updatedIndex);
    } catch (error) {
      console.error(`[IndexedDB] Failed to save project ${project.id}:`, error);
      throw error;
    }
  }

  async listProjects(): Promise<Array<{ id: string; name: string; updatedAt: string }>> {
    try {
      const index = await get<Array<{ id: string; name: string; updatedAt: string }>>(PROJECT_INDEX_KEY);
      return index || [];
    } catch (error) {
      console.error("[IndexedDB] Failed to list projects:", error);
      return [];
    }
  }

  async deleteProject(projectId: string): Promise<void> {
    try {
      await del(`${PROJECT_KEY_PREFIX}${projectId}`);
      const index = (await get<Array<{ id: string; name: string; updatedAt: string }>>(PROJECT_INDEX_KEY)) || [];
      await set(
        PROJECT_INDEX_KEY,
        index.filter((item) => item.id !== projectId)
      );
    } catch (error) {
      console.error(`[IndexedDB] Failed to delete project ${projectId}:`, error);
      throw error;
    }
  }
}
