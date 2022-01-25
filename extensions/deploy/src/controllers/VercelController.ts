import { inject, useParams } from "foundation";
import { Controller } from "foundation/Routing/Controller";
import { VercelClient } from "../clients/VercelClient";

export class VercelController extends Controller {
  @inject(VercelClient) private vercel: VercelClient;

  /**
   * Get list of all deployments
   */
  async getDeployments() {
    const { id: projectId } = await useParams({
      id: String,
    });
    return this.vercel.deployments({ projectId });
  }

  /**
   * Get last 20 projects
   */
  async getProjects() {
    return this.vercel.projects();
  }

  /**
   * Get last 20 projects
   */
  async deploy({ directory }: { directory: string }) {
    return this.vercel.deploy(directory);
  }
}
