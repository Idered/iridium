export enum View {
  Vercel = "iridium-deploy.vercel",
  Netlify = "iridium-deploy.netlify",
  Surge = "iridium-deploy.surge",
  GitHubPages = "iridium-deploy.githubPages",
}

export enum VercelStatus {
  Queued = "QUEUED",
  Building = "BUILDING",
  Ready = "READY",
  Error = "ERROR",
}

export enum VercelTarget {
  Production = "PRODUCTION",
  Staging = "STAGING",
}

export enum BackgroundEvents {
  VercelDeploymentStatusChanged,
}
