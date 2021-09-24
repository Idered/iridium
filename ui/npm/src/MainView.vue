<template>
  <div
    class="container"
    @mouseleaves="hideAutoComplete"
    @click="hideAutoComplete"
    @contextmenu.prevent
  >
    <div>
      <TopBar :view="view" @navigate="view = $event" />

      <div class="header">
        <SelectInput
          v-if="packageJSONFiles.length > 1"
          v-model="packageJSON"
          :options="packageJSONFiles"
          close-on-select
        />
        <label class="search-input" v-if="view === View.Manage">
          <SearchIcon />
          <input
            ref="searchInput"
            type="text"
            :value="query"
            placeholder="Add dependency"
            @click.stop
            @input="handleSearchInput($event)"
            @keyup.left.exact="handleSearchPositionChange"
            @keyup.right.exact="handleSearchPositionChange"
            @keydown.esc.exact.stop="hideAutoComplete"
            @keydown.enter.exact.stop="addPackage()"
            @keydown.alt.enter.exact.stop="addPackage({ dev: true })"
            @keydown.prevent.up="goUp"
            @keydown.prevent.down="goDown"
          />
        </label>
      </div>

      <div class="sizes-header" v-if="view === View.Analyze">
        <div>Min</div>
        <div>GZIP</div>
        <div>Slow 3G</div>
        <div>Slow 4G</div>
      </div>

      <div class="results" v-if="packageSuggestions.length" @click.stop>
        <div class="results__content" ref="resultsRef">
          <div
            v-if="showVersionSuggestions"
            v-for="(item, i) in displayedVersions"
            :key="item.version"
            class="results__item"
            :class="{ 'is-active': i === highlight }"
            @click.exact.stop="addPackage()"
            @click.exact.stop.alt="addPackage({ dev: true })"
            @mouseenter="highlightItem(i)"
          >
            <div class="results__item--version">
              <span class="results__item-title" v-text="item.version" />
              <span class="results__item-tag" v-text="item.tag" />
            </div>
          </div>

          <div
            v-else
            v-for="(item, i) in packageSuggestions"
            :key="item.package.name"
            class="results__item"
            :class="{ 'is-active': i === highlight }"
            @click.exact.stop="addPackage()"
            @click.exact.stop.alt="addPackage({ dev: true })"
            @mouseenter="highlightItem(i)"
          >
            <div>
              <span
                class="results__item-title"
                v-html="item.highlight || item.package.name"
              />@{{ item.package.version }}
            </div>
            <div class="results__item-description">
              {{ item.package.description }}
            </div>
          </div>
        </div>

        <div class="results__shortcuts">
          <div class="results__shortcut">
            <div>Show versions</div>
            <div class="results__shortcut-keys"><kbd>@</kbd></div>
          </div>
          <div class="results__shortcut">
            <div>Show tags</div>
            <div class="results__shortcut-keys"><kbd>@</kbd><kbd>@</kbd></div>
          </div>
          <div class="results__shortcut">
            <div>Add as devDependency</div>
            <div class="results__shortcut-keys">
              <kbd>Alt</kbd><kbd>Enter</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="installed">
      <InstalledItem
        v-for="item in displayedPackages"
        :key="item.name"
        :updatingPackages="updatingPackages"
        :tags="installedPackagesTags[item.name]"
        :versions="installedPackagesVersions[item.name]"
        :view="view"
        :item="item"
        :size-info="sizeInfo[item.name]"
        @update="handleUpdatePackage"
        @changeVersion="handleChangeVersion"
        @remove="handleRemovePackage"
        @swapType="handleSwapType"
      />
    </div>

    <SizeSummaryBar
      v-if="view === View.Analyze"
      :size-info="sizeInfo"
      :view="view"
    />

    <BottomBar
      v-if="view === View.Manage"
      @update-all="handleUpdateAll"
      :installed-packages="installedPackages"
      :installed-packages-tags="installedPackagesTags"
      :installed-packages-versions="installedPackagesVersions"
    />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  inject,
  onMounted,
  provide,
  ref,
  watch,
} from "vue";
import SelectInput from "./components/SelectInput.vue";
import SearchIcon from "./components/SearchIcon.vue";
import InstalledItem from "./components/InstalledItem.vue";
import Stat from "./components/Stat.vue";
import { Package, PackageSizeInfo } from "./types";
import { configKey, getTimeFromSize } from "./utils";
import {
  API,
  GetPackageVersionsAndTagsResponse,
  GetSuggestionsResponse,
} from "./api";
import { View } from "./enums";
import semver from "semver";
import BottomBar from "./components/BottomBar.vue";
import TopBar from "./components/TopBar.vue";
import SizeSummaryBar from "./components/SizeSummaryBar.vue";
import { VSCode } from "@shared/helpers/use-vscode";

export default defineComponent({
  name: "MainView",
  components: {
    SearchIcon,
    SelectInput,
    InstalledItem,
    Stat,
    TopBar,
    BottomBar,
    SizeSummaryBar,
  },
  setup() {
    API.setVSCode(inject<VSCode>("vscode") as VSCode);
    const query = ref("");
    const config = ref({
      showAnalyzeTab: true,
    });
    provide(configKey, config);
    const searchPosition = ref(0);
    const packageJSON = ref<string>("");
    const packageJSONFiles = ref<string[]>([]);
    const searchInput = ref<HTMLInputElement>();
    const resultsRef = ref<HTMLDivElement>();
    const highlight = ref(0);
    const view = ref(View.Manage);
    const packageSuggestions = ref<GetSuggestionsResponse>([]);
    const installedPackages = ref<Package[]>([]);
    const sizeInfo = ref<Record<string, PackageSizeInfo>>({});
    const versions = ref<GetPackageVersionsAndTagsResponse["versions"]>([]);
    const installedPackagesVersions = ref<Record<string, string[]>>({});
    const installedPackagesTags = ref<
      Record<string, Record<string, string> & { latest?: string }>
    >({});
    const tags = ref<GetPackageVersionsAndTagsResponse["tags"]>({});
    const packageName = computed(() => {
      const indexOfAt = query.value.indexOf("@", 1);
      if (indexOfAt === -1) {
        return query.value;
      }
      return query.value.substring(0, indexOfAt);
    });
    const packageVersion = computed(() => {
      const indexOfAt = query.value.indexOf("@", 1);
      return indexOfAt === -1
        ? null
        : displayedVersions.value[highlight.value].version;
    });
    const showVersionSuggestions = computed(() => {
      const indexOfAt = query.value.indexOf("@", 1);
      return indexOfAt > -1 && searchPosition.value > indexOfAt;
    });
    const versionSuggestions = computed(() => {
      return versions.value.map((version) => {
        return {
          version,
          tag: getVersionTag(version),
        };
      });
    });
    const displayedVersions = computed(() => {
      const indexOfAt = query.value.indexOf("@", 1);
      const versionQuery =
        indexOfAt === -1 ? null : query.value.substring(indexOfAt + 1);
      if (!versionQuery) {
        return versionSuggestions.value;
      }
      return versionSuggestions.value.filter(
        (item) =>
          item.version.startsWith(versionQuery) ||
          item.tag?.startsWith(versionQuery) ||
          (item.tag && versionQuery.startsWith("@"))
      );
    });
    const displayedPackages = computed(() => {
      let result = [];
      if (view.value === View.Manage) {
        result = installedPackages.value;
      } else {
        result = installedPackages.value.filter(
          (item) => !item.isDevDependency
        );
      }
      result.sort(byTypeAndName);
      return result;
    });
    const versionHash = computed(() => {
      return installedPackages.value.map((item) => item.version).join("");
    });
    const updatingPackages = ref<Set<string>>(new Set([]));
    const handleUpdateAll = (packages: Package[]) => {
      withUpdate(
        packages.map((item) => item.name),
        async () => {
          await API.updatePackages({ packages });
        }
      );
    };
    const handleSearchInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
      query.value = target.value;
      searchPosition.value = target.selectionStart || 0;
      if (highlight.value > packageSuggestions.value.length - 1) {
        highlight.value = 0;
      }
    };
    const handleSearchPositionChange = (e: KeyboardEvent) => {
      const target = e.target as HTMLInputElement;
      searchPosition.value = target.selectionStart || 0;
    };
    const goUp = () => {
      const len = showVersionSuggestions.value
        ? displayedVersions.value.length
        : packageSuggestions.value.length;
      highlight.value = highlight.value === 0 ? len - 1 : highlight.value - 1;
    };
    const goDown = () => {
      const len = showVersionSuggestions.value
        ? displayedVersions.value.length
        : packageSuggestions.value.length;
      highlight.value = (highlight.value + 1) % len;
    };
    const highlightItem = (i: number) => {
      highlight.value = i;
    };
    const byTypeAndName = (a: Package, b: Package) => {
      if (a.isDevDependency != b.isDevDependency) {
        return a.isDevDependency ? 1 : -1;
      }
      return a.name.localeCompare(b.name);
    };
    const addPackage = async ({ dev }: { dev: boolean } = { dev: false }) => {
      const selected = packageSuggestions.value.find((item, i) =>
        packageVersion.value
          ? item.package.name === packageName.value
          : i === highlight.value
      );
      if (!selected) return;
      const isInstalled = installedPackages.value.some(
        (item) => item.name === selected.package.name
      );
      // if (isInstalled) {
      //   query.value = "";
      //   return;
      // }
      const item = {
        name: selected.package.name,
        version: packageVersion.value || selected.package.version,
        isDevDependency: dev,
      };
      query.value = "";
      if (!isInstalled) {
        installedPackages.value.push(item);
        installedPackages.value.sort(byTypeAndName);
      }
      withUpdate(item.name, async () => {
        await API.installPackage({ packages: [item], dev });
      });
    };
    const handleRemovePackage = async (item: Package) => {
      withUpdate(item.name, async () => {
        await API.removePackage({ name: item.name });
        installedPackages.value = installedPackages.value.filter(
          (i) => i.name !== item.name
        );
      });
    };
    const withUpdate = async (
      packageName: string | string[],
      callback: () => Promise<void>
    ) => {
      if (Array.isArray(packageName)) {
        packageName.forEach((name) => updatingPackages.value.add(name));
      } else {
        updatingPackages.value.add(packageName);
      }
      await callback();
      if (Array.isArray(packageName)) {
        packageName.forEach((name) => updatingPackages.value.delete(name));
      } else {
        updatingPackages.value.delete(packageName);
      }
    };
    const handleSwapType = async (item: Package) => {
      withUpdate(item.name, async () => {
        await API.swapPackageType({
          name: item.name,
          dev: item.isDevDependency,
          version: item.version,
        });
        const index = installedPackages.value.indexOf(item);
        installedPackages.value.splice(index, 1, {
          ...item,
          isDevDependency: !item.isDevDependency,
        });
      });
    };
    const handleChangeVersion = (change: {
      item: Package;
      version: string;
    }) => {
      if (!change.version) return;
      withUpdate(change.item.name, async () => {
        await API.changeVersion({
          name: change.item.name,
          version: change.version,
        });
        const index = installedPackages.value.indexOf(change.item);
        installedPackages.value.splice(index, 1, {
          ...change.item,
          version: change.version,
        });
      });
    };
    const handleUpdatePackage = (change: { item: Package }) => {
      withUpdate(change.item.name, async () => {
        await API.updatePackage(change.item.name);
        // const index = installedPackages.value.indexOf(change.item);
        // installedPackages.value.splice(index, 1, {
        //   ...change.item,
        //   version: change.version,
        // });
      });
    };
    const hideAutoComplete = () => {
      highlight.value = 0;
      query.value = "";
      packageSuggestions.value = [];
    };
    const getVersionTag = (version: string) => {
      return Object.entries(tags.value).find(([tag, tagVersion]) => {
        return tagVersion === version;
      })?.[0];
    };
    const getPackageSizeInfo = async (
      name: string,
      version: string,
      isDevDependency: boolean
    ) => {
      try {
        const data = await API.getSizeInfo(`${name}@${version}`);
        return {
          isDevDependency,
          name: data.name,
          size: data.size,
          gzip: data.gzip,
          threeG: getTimeFromSize(data.gzip).slow3G,
          fourG: getTimeFromSize(data.gzip).slow4G,
        };
      } catch (err) {
        return null;
      }
    };
    const getPackages = async () => {
      installedPackages.value = await API.getInstalledPackages();
      installedPackages.value.sort(byTypeAndName);
    };
    const getPackageJSONFiles = async () => {
      packageJSONFiles.value = await API.getPackageJSONFiles();
      return packageJSONFiles.value;
    };
    const getConfig = async () => {
      config.value = await API.getConfig();
    };
    const loadPackagesSizeInfo = async () => {
      sizeInfo.value = {};
      for (const item of displayedPackages.value) {
        getPackageSizeInfo(item.name, item.version, item.isDevDependency).then(
          (res) => {
            if (res) sizeInfo.value[res.name] = res;
          }
        );
      }
    };

    onMounted(async () => {
      await getConfig();
      const [uri] = await getPackageJSONFiles();
      packageJSON.value = uri;
    });

    watch(showVersionSuggestions, async (value, oldValue) => {
      if (value && !oldValue) {
        const suggestion = packageSuggestions.value[highlight.value];
        if (!suggestion) return;
        query.value = `${suggestion.package.name}@`;
        searchPosition.value = query.value.length;
        versions.value = [];
        highlight.value = 0;
        const res = await API.getPackageVersionsAndTags(packageName.value);
        versions.value = res.versions;
        tags.value = res.tags;
      }
      if (!value && oldValue) {
        highlight.value = 0;
      }
    });

    watch(packageName, async (value) => {
      packageSuggestions.value = value ? await API.getSuggestions(value) : [];
    });

    watch([view, versionHash], async ([view]) => {
      if (view === View.Analyze) {
        loadPackagesSizeInfo();
      }
    });

    watch(packageJSON, async (value) => {
      if (value) {
        API.setPackageJSON(packageJSON.value);
        await getPackages();
      }
    });

    watch(highlight, (value) => {
      resultsRef.value?.children[value]?.scrollIntoView({
        block: "nearest",
      });
    });

    watch(installedPackages, async (packages) => {
      installedPackagesVersions.value = {};
      installedPackagesTags.value = {};
      for (const item of packages) {
        const ver = semver.coerce(item.version)?.raw;
        if (ver) {
          installedPackagesVersions.value[item.name] = [ver];
        }
        API.getPackageVersionsAndTags(item.name).then((res) => {
          installedPackagesVersions.value[item.name] = res.versions;
          installedPackagesTags.value[item.name] = res.tags;
        });
      }
    });

    window.addEventListener("message", async (message) => {
      if (message.data?.type === "PACKAGE_JSON_UPDATED") {
        await getPackageJSONFiles();
        getPackages();
      }
      if (message.data?.type === "CONFIG_UPDATED") {
        await getConfig();
      }
    });

    return {
      packageJSON,
      packageJSONFiles,
      displayedPackages,
      query,
      highlight,
      packageSuggestions,
      sizeInfo,
      view,
      View,
      searchInput,
      resultsRef,
      displayedVersions,
      showVersionSuggestions,
      installedPackages,
      installedPackagesVersions,
      installedPackagesTags,
      updatingPackages,
      handleUpdatePackage,
      handleUpdateAll,
      handleSearchPositionChange,
      goUp,
      goDown,
      handleSwapType,
      handleSearchInput,
      hideAutoComplete,
      handleRemovePackage,
      handleChangeVersion,
      addPackage,
      highlightItem,
    };
  },
});
</script>

<style scoped>
.container {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
}

.header {
  display: grid;
  align-items: center;
  row-gap: 0.5rem;
  margin: 0 0.75rem 0;
}

.search-input {
  display: flex;
  padding: 0 8px;
  align-items: center;
  font-size: 13px;
  background: var(--vscode-input-background);
  border: 1px solid var(--vscode-input-border);
  color: var(--vscode-foreground);
}
.search-input svg {
  width: 16px;
  margin-right: 8px;
}
.search-input input {
  border: 0;
  width: 100%;
  background: none;
  -webkit-appearance: none;
  appearance: none;
  height: 26px;
  color: inherit;
}
.search-input input::placeholder {
  color: var(--vscode-input-placeholderForeground);
}
.search-input input:focus {
  outline: none;
}
.search-input:focus-within {
  border-color: var(--vscode-focusBorder);
}

.results {
  transform: translateY(4px);
  left: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  position: absolute;
  color: var(--vscode-dropdown-foreground);
  background: var(--vscode-dropdown-background);
  border: 1px solid var(--vscode-dropdown-border);
  box-sizing: border-box;
}

.results__content {
  max-height: 280px;
  overflow-y: auto;
}
.results__shortcuts {
  /* background: var(--vscode-badge-background);
  color: var(--vscode-badge-foreground); */
  border-top: 1px solid var(--vscode-input-border);
  display: grid;
  padding: 0.25rem 0.75rem;
  row-gap: 0.25rem;
  font-size: 12px;
}
.results__shortcut {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-weight: 500;
  color: var(--vscode-descriptionForeground);
}
.results__shortcut-keys {
  display: flex;
  column-gap: 0.25rem;
}
.results__shortcut-keys kbd {
  all: unset;
  border: 1px solid var(--vscode-input-border);
  color: var(--vscode-foreground);
  height: 20px;
  border-radius: 3px;
  padding: 0 0.25rem;
  line-height: 20px;
  display: inline-block;
  font-weight: 600;
  font-size: 12px;
}
.results__item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
}
.results__item--version {
  display: flex;
  justify-content: space-between;
}
.results__item.is-active {
  background-color: var(--vscode-panel-background);
}
.results__item-title :global(em) {
  font-weight: bold;
  font-style: normal;
  color: var(--vscode-list-focusForeground);
}
.results__item-description {
  color: var(--vscode-descriptionForeground);
  margin-top: 4px;
  word-wrap: break-word;
}
.results__item-tag {
  color: var(--vscode-descriptionForeground);
}

.installed {
  width: 100%;
  margin-top: 8px;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}
.installed::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0);
}
.installed::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}
.installed:hover::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
}

.sizes-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  margin: 12px 12px 0;
  justify-items: flex-end;
}
</style>
