import { VSCode } from "@shared/helpers/use-vscode";
import algoliasearch from "algoliasearch/lite";

export class ResponseError extends Error {
  constructor(message: string, public readonly response: Response) {
    super(message);
  }
}

export class API {
  private static packageJSON = "";
  private static algolia = algoliasearch(
    import.meta.env.VITE_ALGOLIA_APP_ID,
    import.meta.env.VITE_ALGOLIA_API_KEY
  ).initIndex(import.meta.env.VITE_ALGOLIA_INDEX);
  private static async request<Response>(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    const json = await response.json();
    if (!response.ok) {
      throw new ResponseError(response.statusText, response);
    }
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
    return API.algolia.search<AlgoliaSearchResponse>(query, {
      analyticsTags: ["idered-vscode"],
      hitsPerPage: 4,
    });
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
  static removePackages(packages: string[]) {
    return API.vscode.fetch.post<void>("/remove", {
      packages,
      packageJSON: API.packageJSON,
    });
  }
  static getPackageJSONFiles() {
    return API.vscode.fetch.get<string[]>("/package-json-files");
  }
  static getDepCheck() {
    return API.vscode.fetch.post<{
      status: "success" | "error";
      result: DepCheck;
    }>("/depcheck", {
      packageJSON: API.packageJSON,
    });
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
  static changeVersion(args: {
    name: string;
    version: string;
    originalVersion: string;
  }) {
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

export type AlgoliaSearchResponse = {
  name: string;
  downloadsLast30Days: number;
  downloadsRatio: number;
  humanDownloadsLast30Days: string;
  popular: boolean;
  version: string;
  versions: Record<string, string>;
  tags: Record<string, string>;
  description: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  originalAuthor: {
    name: string;
  };
  repository: any;
  githubRepo: any;
  gitHead: any;
  readme: string;
  owner: {
    name: string;
    email: string;
    avatar: string;
    link: string;
  };
  deprecated: boolean;
  isDeprecated: boolean;
  deprecatedReason: any;
  homepage: any;
  license: any;
  keywords: any[];
  computedKeywords: any[];
  computedMetadata: any;
  created: number;
  modified: number;
  lastPublisher: {
    name: string;
    email: string;
    avatar: string;
    link: string;
  };
  owners: {
    name: string;
    email: string;
    avatar: string;
    link: string;
  }[];
  bin: any;
  types: {
    definitelyTyped?: "string";
    ts: boolean | "included" | "definitely-typed";
  };
  moduleTypes: string[];
  styleTypes: string[];
  lastCrawl: string;
  _searchInternal: {
    alternativeNames: string[];
    expiresAt: number;
    downloadsMagnitude: number;
    jsDelivrPopularity: number;
  };
  dependents: number;
  humanDependents: string;
  changelogFilename: any;
  jsDelivrHits: number;
  objectID: string;
  _highlightResult: {
    name: {
      value: string;
      matchLevel: string;
      fullyHighlighted: boolean;
      matchedWords: string[];
    };
    description: {
      value: string;
      matchLevel: string;
      matchedWords: any[];
    };
    owner: {
      name: {
        value: string;
        matchLevel: string;
        matchedWords: any[];
      };
    };
    owners: {
      name: {
        value: string;
        matchLevel: string;
        matchedWords: any[];
      };
    }[];
    _searchInternal: {
      alternativeNames: {
        value: string;
        matchLevel: string;
        fullyHighlighted?: boolean;
        matchedWords: string[];
      }[];
    };
  };
};

export type DepCheck = {
  clean: boolean;
  unimported: string[];
  unresolved: string[];
  unused: string[];
};

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
