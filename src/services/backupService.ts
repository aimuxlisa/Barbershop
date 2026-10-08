import { SiteProject } from "@/types/project";
import { IndexedDbProjectRepository } from "@/repositories/IndexedDbProjectRepository";

const repository = new IndexedDbProjectRepository();

export class BackupService {
  /**
   * Export the entire project as a JSON string
   */
  exportProjectToJson(project: SiteProject): string {
    return JSON.stringify(
      {
        ...project,
        backupCreatedAt: new Date().toISOString(),
        schemaVersion: 1,
      },
      null,
      2
    );
  }

  /**
   * Trigger direct browser download of the backup file
   */
  downloadBackupFile(project: SiteProject): void {
    if (typeof window === "undefined") return;
    const jsonStr = this.exportProjectToJson(project);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `project-backup-${project.id}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Import project from JSON string with validation
   */
  async importProjectFromJson(jsonString: string): Promise<SiteProject> {
    try {
      const parsed = JSON.parse(jsonString) as SiteProject;
      if (!parsed.id || !parsed.name || !Array.isArray(parsed.pages)) {
        throw new Error("Invalid project backup structure: missing core fields.");
      }
      // Save directly to IndexedDB
      await repository.save(parsed);
      return parsed;
    } catch (err: any) {
      console.error("[BackupService] Import error:", err);
      throw new Error(`Failed to import project backup: ${err.message}`);
    }
  }
}

export const backupService = new BackupService();
