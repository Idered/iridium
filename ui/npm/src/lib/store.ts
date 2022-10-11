import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import { API, Audit, DepCheck } from "./api";
import { AnalyzeSortType, ErrorType, Order, View } from "../enums";
import { Package, PackageSizeInfo } from "../types";

export interface State {
  view: View;
  query: string;
  filterQuery: string;
  filterInputIsFocused: boolean;
  analyzeSort: AnalyzeSortType;
  analyzeOrder: Order;
  errors: Map<ErrorType, any>;
  packageJSON: string | null;
  packageJSONFiles: string[];
  installedPackages: Package[];
  updatingPackages: string[];
  sizeInfo: Record<string, PackageSizeInfo>;
  depCheck: DepCheck | null;
  audit: Audit | null;
  selectedPackage: string | null;
  config: {
    showShortcuts: boolean;
    showResultDescription: boolean;
    excludeVersions: string[];
    runAudit: boolean;
    showAnalyzeTab: boolean;
    showProTab: boolean;
    showAlgoliaInfo: boolean;
    maxNumberOfResults: number;
    analyze: {
      columns: string[];
    };
  };
}

export const key: InjectionKey<Store<State>> = Symbol("store");

export const store = createStore<State>({
  state: {
    query: "",
    filterQuery: "",
    filterInputIsFocused: false,
    analyzeSort: AnalyzeSortType.GZIP,
    analyzeOrder: Order.Descending,
    errors: new Map(),
    view: View.Manage,
    packageJSON: null,
    selectedPackage: null,
    packageJSONFiles: [],
    audit: null,
    config: {
      showShortcuts: true,
      showResultDescription: true,
      runAudit: true,
      showAnalyzeTab: true,
      excludeVersions: [],
      showProTab: true,
      showAlgoliaInfo: true,
      maxNumberOfResults: 4,
      analyze: {
        columns: [],
      },
    },
    sizeInfo: {},
    depCheck: null,
    installedPackages: [],
    updatingPackages: [],
  },
  getters: {
    isVulnerable: (state) => (name: string) =>
      Object.values(state.audit?.advisories || {}).some((item) =>
        item.findings.some((find) =>
          find.paths.some((path) => {
            const validPath = path.replace(/^\.>/, "");
            return validPath.startsWith(`${name}>`) || validPath === name;
          })
        )
      ),
    getPackageByName: (state) => (name: string) =>
      state.installedPackages.find((p) => p.name === name),
    hasError: (state) => (type: ErrorType) => state.errors.has(type),
    getError: (state) => (type: ErrorType) => state.errors.get(type),
    totalGZIPSize(state) {
      return Object.values(state.sizeInfo).reduce(
        (total, item) => total + item.gzip,
        0
      );
    },
    isUnused(state) {
      return (name: string) => state.depCheck?.unused.includes(name);
    },
  },
  mutations: {
    setAudit(state, audit: Audit | null) {
      state.audit = audit;
    },
    setSelectedPackage(state, packageName: string | null) {
      state.selectedPackage = packageName;
    },
    setFilterQuery(state, query: string) {
      state.filterQuery = query;
    },
    setFilterInputIsFocused(state, isFocused: boolean) {
      state.filterInputIsFocused = isFocused;
    },
    setAnalyzeSort(state, sort: AnalyzeSortType) {
      if (state.analyzeSort === sort) {
        state.analyzeOrder =
          state.analyzeOrder === Order.Descending
            ? Order.Ascending
            : Order.Descending;
      } else {
        state.analyzeOrder = Order.Descending;
      }
      state.analyzeSort = sort;
    },
    addError(
      state,
      payload: {
        error: ErrorType;
        details: any;
      }
    ) {
      state.errors.set(payload.error, payload.details);
    },
    removeError(state, payload: ErrorType) {
      state.errors.delete(payload);
    },
    setDepCheck(state, data: DepCheck | null) {
      state.depCheck = data;
    },
    setSizeInfo(state, sizeInfo) {
      state.sizeInfo = sizeInfo;
    },
    addSizeInfo(state, info: PackageSizeInfo) {
      if (!info) {
        return;
      }
      state.sizeInfo = { ...state.sizeInfo, [info.name]: info };
    },
    navigate(state, view: View) {
      state.view = view;
    },
    setConfig(state, config: Partial<State["config"]>) {
      state.config = { ...state.config, ...config };
    },
    addUpdatingPackage(state, name: string) {
      state.updatingPackages.push(name);
    },
    deleteUpdatingPackage(state, name: string) {
      state.updatingPackages.splice(state.updatingPackages.indexOf(name), 1);
    },
    addPackage(state, pkg: Package) {
      state.installedPackages.push(pkg);
      state.installedPackages.sort((a: Package, b: Package) => {
        if (a.isDevDependency !== b.isDevDependency) {
          return a.isDevDependency ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      });
    },
    setInstalledPackages(state, packages: Package[]) {
      state.installedPackages = packages;
      state.installedPackages.sort((a: Package, b: Package) => {
        if (a.isDevDependency !== b.isDevDependency) {
          return a.isDevDependency ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      });
    },
    removePackages(state, packages: string[]) {
      state.installedPackages = state.installedPackages.filter(
        (item) => !packages.includes(item.name)
      );
    },
    swapPackageType(state, item: Package) {
      const index = state.installedPackages.indexOf(item);
      state.installedPackages.splice(index, 1, {
        ...item,
        isDevDependency: !item.isDevDependency,
      });
    },
    changeVersion(state, change: { item: Package; version: string }) {
      const index = state.installedPackages.indexOf(change.item);
      state.installedPackages.splice(index, 1, {
        ...change.item,
        version: change.version,
      });
    },
    addInstalledPackage(state, pkg: Package) {
      state.installedPackages.push(pkg);
      state.installedPackages.sort((a: Package, b: Package) => {
        if (a.isDevDependency !== b.isDevDependency) {
          return a.isDevDependency ? 1 : -1;
        }
        return a.name.localeCompare(b.name);
      });
    },
  },
  actions: {
    async getConfig(ctx) {
      const config = await API.getConfig();
      ctx.commit("setConfig", config);
    },
  },
});

// define your own `useStore` composition function
export function useStore() {
  return baseUseStore(key);
}
