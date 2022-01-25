import { injectable, VSCodeContext, VSCodeWebView } from "foundation";
import fetch, { RequestInit } from "node-fetch";
import { createDeployment } from "@vercel/client";
import * as path from "path";
import * as vscode from "vscode";
import { statSync } from "fs";
import { BackgroundEvents } from "../enums";

enum VercelStatus {
  Queued = "QUEUED",
  Building = "BUILDING",
  Ready = "READY",
  Error = "ERROR",
}

enum VercelTarget {
  Production = "PRODUCTION",
  Staging = "STAGING",
}

type AliasError = null | {
  code: string;
  message: string;
};

@injectable()
export class VercelClient {
  constructor(
    private readonly context: VSCodeContext,
    private readonly webview: VSCodeWebView
  ) {}
  /**
   * Vercel base api endpoint
   */
  private endpoint = "https://api.vercel.com";

  /**
   * Create vercel endpoint
   */
  private createUrl(path: string, params: { [key: string]: string } = {}) {
    const query = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join("&");
    return `${this.endpoint}${path}?${query}`;
  }

  /**
   * Get last vercel access token
   */
  private get accessToken() {
    return this.context.globalState.get<string>("accessToken");
  }

  /**
   * Basic Vercel api client
   */
  private async request<Result>(url: string, init?: RequestInit) {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
    const json = await response.json();
    return json as Result;
  }

  /**
   * Get list of Vercel deployments
   */
  public async deployments({ projectId }: { projectId: string }) {
    type DeploymentCreator = {
      email: string;
      githubLogin: string;
      uid: string;
      username: string;
    };
    type DeploymentMeta = {
      githubCommitAuthorLogin: string;
      githubCommitAuthorName: string;
      githubCommitMessage: string;
      githubCommitOrg: string;
      githubCommitRef: string;
      githubCommitRepo: string;
      githubCommitRepoId: string;
      githubCommitSha: string;
      githubDeployment: string;
      githubOrg: string;
      githubRepo: string;
      githubRepoId: string;
    };
    type Deployment = {
      aliasAssigned: number;
      aliasError: AliasError;
      created: number;
      creator: DeploymentCreator;
      meta: DeploymentMeta;
      name: string;
      state: VercelStatus;
      target: VercelTarget;
      type: string;
      uid: string;
      url: string;
    };
    const url = this.createUrl("/v5/now/deployments", {
      projectId,
    });
    return this.request<{
      deployments: Deployment[];
    }>(url).then((res) => {
      return res.deployments;
    });
  }

  /**
   * Get list of Vercel deployments
   */
  public async projects() {
    type Project = {};
    const url = this.createUrl("/v8/projects");
    const projects = await this.request<{
      projects: Project[];
    }>(url);
    return projects;
  }

  /**
   * Get list of Vercel deployments
   */
  public async deploy(directory: string) {
    let deployment;
    const target = path.resolve(
      vscode.workspace.workspaceFolders[0].uri.fsPath,
      directory
    );
    const stat = statSync(target);
    const name = stat.isDirectory()
      ? path.basename(target)
      : path.dirname(target);
    for await (const event of createDeployment(
      {
        token: this.accessToken,
        debug: true,
        path: target,
        force: true,
      },
      {
        name,
        projectSettings: {
          buildCommand: null,
          devCommand: null,
          outputDirectory: null,
        },
      }
    )) {
      this.webview.postMessage({
        type: BackgroundEvents.VercelDeploymentStatusChanged,
      });
      if (event.type === "ready") {
        deployment = event.payload;
        break;
      }
    }

    return deployment;
  }
}
