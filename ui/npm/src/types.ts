import { SemVer } from "semver";

export type Package = {
  name: string;
  version: string;
  maxSatisfyingVersion?: string | SemVer | null;
  isDevDependency: boolean;
};

export type PackageSizeInfo = {
  name: string;
  size: number;
  gzip: number;
  threeG: number;
  fourG: number;
};
