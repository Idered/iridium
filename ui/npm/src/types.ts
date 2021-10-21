export type Package = {
  name: string;
  version: string;
  isDevDependency: boolean;
};

export type PackageSizeInfo = {
  name: string;
  size: number;
  gzip: number;
  threeG: number;
  fourG: number;
};
