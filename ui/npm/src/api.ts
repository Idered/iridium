import { VSCode } from "@shared/helpers/use-vscode";

export class API {
  private static packageJSON = "";
  private static async request<Response>(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    const json = await response.json();
    return json as unknown as Response;
  }
  private static vscode: VSCode;
  static setPackageJSON(packageJSON: string) {
    API.packageJSON = packageJSON;
  }
  static setVSCode(vscode: VSCode) {
    API.vscode = vscode;
  }
  static getSuggestions(query: string) {
    return API.request<GetSuggestionsResponse>(
      `https://api.npms.io/v2/search/suggestions?q=${encodeURI(query)}&size=4`
    );
  }
  static getSizeInfo(query: string) {
    return API.request<GetSizeInfoResponse>(
      `https://bundlephobia.com/api/size?package=${query}&record=true`
    );
  }
  static getPackageVersionsAndTags(query: string) {
    return API.request<GetPackageVersionsAndTagsResponse>(
      `https://data.jsdelivr.com/v1/package/npm/${query}`
    );
  }
  static getInstalledPackages() {
    return API.vscode.fetch.post<GetInstalledPackagesResponse>(`/installed`, {
      packageJSON: API.packageJSON,
    });
  }
  static installPackage(args: {
    packages: { name: string; version: string }[];
    dev?: boolean;
  }) {
    return API.vscode.fetch.post<void>("/install", {
      ...args,
      packageJSON: API.packageJSON,
    });
  }
  static removePackage(args: { name: string }) {
    return API.vscode.fetch.post<void>("/remove", {
      ...args,
      packageJSON: API.packageJSON,
    });
  }
  static getPackageJSONFiles() {
    return API.vscode.fetch.get<string[]>("/package-json-files");
  }
  static swapPackageType(args: {
    name: string;
    dev: boolean;
    version: string;
  }) {
    return API.vscode.fetch.post<string[]>("/swap", {
      ...args,
      packageJSON: API.packageJSON,
    });
  }
  static changeVersion(args: { name: string; version: string }) {
    return API.vscode.fetch.post<string[]>("/change-version", {
      ...args,
      packageJSON: API.packageJSON,
    });
  }
  static updatePackages(args: { packages: { name: string }[] }) {
    return API.vscode.fetch.post<string[]>("/update", {
      ...args,
      packageJSON: API.packageJSON,
    });
  }
  static updatePackage(name: string) {
    return API.updatePackages({ packages: [{ name }] });
  }
  static getConfig() {
    return API.vscode.fetch.get<{
      showAnalyzeTab: boolean;
    }>("/config");
  }
}

export type GetInstalledPackagesResponse = {
  name: string;
  version: string;
  isDevDependency: boolean;
}[];

export interface GetPackageVersionsAndTagsResponse {
  tags: Record<string, string>;
  versions: string[];
}

export interface GetSizeInfoResponse {
  assets: {
    gzip: number;
    name: string;
    size: number;
    type: string;
  }[];
  dependencyCount: number;
  dependencySizes: {
    approximateSize: number;
    name: string;
  }[];
  description: string;
  gzip: number;
  hasJSModule: boolean;
  hasJSNext: boolean;
  hasSideEffects: boolean;
  isModuleType: boolean;
  name: string;
  repository: string;
  scoped: boolean;
  size: number;
  version: string;
}

export type GetSuggestionsResponse = {
  package: {
    name: string;
    scope: string;
    version: string;
    description: string;
    keywords: string[];
    date: string;
    links: {
      npm: string;
      homepage: string;
      repository: string;
      bugs: string;
    };
    author: {
      name: string;
    };
    publisher: {
      username: string;
      email: string;
    };
    maintainers: {
      username: string;
      email: string;
    }[];
  };
  score: {
    final: number;
    detail: {
      quality: number;
      popularity: number;
      maintenance: number;
    };
  };
  searchScore: number;
  highlight: string;
}[];
