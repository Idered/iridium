import { VSCode } from "@shared/helpers/use-vscode";
import { getTypingsPackageName } from "./utils";

export class ResponseError extends Error {
  constructor(message: string, public readonly response: Response) {
    super(message);
  }
}

export class API {
  private static packageJSON = "";
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
    return API.request<GetSuggestionsResponse>(
      `https://api.npms.io/v2/search/suggestions?q=${encodeURI(query)}&size=4`
    );
  }

  static getTypings(packages: string[]) {
    const types = packages.map(getTypingsPackageName);
    return API.request<GetTypingsResponse>(
      `https://api.npms.io/v2/package/mget`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(types),
      }
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

export interface GetTypingsResponse {
  [packageName: string]: {
    analyzedAt: string;
    collected: {
      metadata: {
        name: string;
        scope: string;
        version: string;
        deprecated?: string;
        description: string;
        date: string;
        publisher: {
          username: string;
          email: string;
        };
        maintainers: {
          username: string;
          email: string;
        }[];
        contributors: {
          name: string;
          url: string;
        }[];
        repository: {
          type: string;
          url: string;
          directory: string;
        };
        links: {
          npm: string;
          homepage: string;
          repository: string;
          bugs: string;
        };
        license: string;
        dependencies: Record<string, string>;
        releases: {
          from: string;
          to: string;
          count: number;
        }[];
        readme: string;
      };
      npm: {
        downloads: {
          from: string;
          to: string;
          count: number;
        }[];
        dependentsCount: number;
        starsCount: number;
      };
      source: {
        files: {
          readmeSize: number;
          testsSize: number;
        };
      };
    };
    evaluation: {
      quality: {
        carefulness: number;
        tests: number;
        health: number;
        branding: number;
      };
      popularity: {
        communityInterest: number;
        downloadsCount: number;
        downloadsAcceleration: number;
        dependentsCount: number;
      };
      maintenance: {
        releasesFrequency: number;
        commitsFrequency: number;
        openIssues: number;
        issuesDistribution: number;
      };
    };
    error: {
      unrecoverable: boolean;
      tarballFile: string;
      name: string;
      message: string;
      stack: string;
      caughtAt: string;
    };
    score: {
      final: number;
      detail: {
        quality: number;
        popularity: number;
        maintenance: number;
      };
    };
  };
}
