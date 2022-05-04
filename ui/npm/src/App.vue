<template>
  <EmptyView v-if="packageJSONFiles.length === 0" />

  <div
    v-if="packageJSONFiles.length !== 0"
    class="container"
    @contextmenu.prevent
  >
    <div>
      <NavBar />

      <div class="header" v-if="[View.Manage, View.Analyze].includes(view)">
        <VSelect
          v-if="displayPackageJsonFiles.length > 1"
          v-model="packageJSON"
          :options="displayPackageJsonFiles"
          :format-placeholder="
            (option) =>
              typeof option === 'string'
                ? option
                : option?.value.replace('/package.json', '') || ''
          "
        />
        <AnalyzeViewHeader v-if="view === View.Analyze" />
        <AutocompleteInput v-if="view === View.Manage" />
      </div>
    </div>

    <div class="content">
      <ManageViewContent
        :installed-packages="installedPackages"
        :displayed-packages="displayedPackages"
        :installed-packages-tags="installedPackagesTags"
        :installed-packages-versions="installedPackagesVersions"
        :size-info="sizeInfo"
      />
      <ProViewContent v-if="view === View.Pro" />
    </div>

    <div>
      <AnalyzeViewFooter v-if="view === View.Analyze" :size-info="sizeInfo" />
      <ManageViewFooter
        v-if="view === View.Manage"
        @update-all="handleUpdateAll"
        :installed-packages="installedPackages"
        :installed-packages-tags="installedPackagesTags"
        :installed-packages-versions="installedPackagesVersions"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onMounted, ref, watch } from "vue";
import VSelect from "./components/VSelect.vue";
import SearchIcon from "./components/icons/SearchIcon.vue";
import InstalledItem from "./components/InstalledItem.vue";
import { Package } from "./types";
import { groupPackageJsonFiles, withUpdate } from "./lib/utils";
import { API } from "./lib/api";
import { Order, View } from "./enums";
import coerce from "semver/functions/coerce";
import { VSCode } from "@shared/helpers/use-vscode";
import ManageViewFooter from "./components/manage/ManageViewFooter.vue";
import NavBar from "./components/NavBar.vue";
import AnalyzeViewFooter from "./components/analyze/AnalyzeViewFooter.vue";
import EmptyView from "./components/EmptyView.vue";
import AnalyzeViewHeader from "./components/analyze/AnalyzeViewHeader.vue";
import ProViewContent from "./components/support/SupportViewContent.vue";
import { useStore } from "./lib/store";
import AutocompleteInput from "./components/AutocompleteInput.vue";
import { usePackageSizeInfo } from "./lib/use-package-size-info";
import ManageViewContent from "./components/manage/ManageViewContent.vue";

export default defineComponent({
  name: "App",
  components: {
    AutocompleteInput,
    SearchIcon,
    EmptyView,
    InstalledItem,
    NavBar,
    ProViewContent,
    ManageViewContent,
    ManageViewFooter,
    VSelect,
    AnalyzeViewHeader,
    AnalyzeViewFooter,
  },
  setup() {
    API.setVSCode(inject<VSCode>("vscode") as VSCode);
    const store = useStore();
    const { getPackageSizeInfo } = usePackageSizeInfo();
    const packageJSON = ref<string>("");
    const packageJSONFiles = ref<string[]>([]);
    const view = computed(() => store.state.view);
    const installedPackages = computed(() => store.state.installedPackages);
    const sizeInfo = computed(() => store.state.sizeInfo);
    const installedPackagesVersions = ref<Record<string, string[]>>({});
    const installedPackagesTags = ref<
      Record<string, Record<string, string> & { latest?: string }>
    >({});
    const displayedPackages = computed(() => {
      let result = [];
      if (view.value === View.Manage) {
        result = installedPackages.value;
        result.sort(byTypeAndName);
      } else {
        result = installedPackages.value.filter(
          (item) => !item.isDevDependency
        );
        const sort = store.state.analyzeSort;
        const order = store.state.analyzeOrder;
        // sort result by size
        result.sort((a, b) => {
          const aSize = sizeInfo.value[a.name]?.[sort];
          const bSize = sizeInfo.value[b.name]?.[sort];
          if (aSize === bSize) {
            return 0;
          }
          if (order === Order.Ascending) {
            return aSize > bSize ? 1 : -1;
          }
          return aSize > bSize ? -1 : 1;
        });
      }
      return result;
    });
    const versionHash = computed(() => {
      return installedPackages.value
        .map(
          (item) =>
            `${item.isDevDependency ? "dev:" : ""}${item.name}@${item.version}`
        )
        .join("");
    });
    const handleUpdateAll = (packages: Package[]) => {
      withUpdate(
        packages.map((item) => item.name),
        async () => {
          await API.updatePackages({ packages });
        }
      );
    };
    const byTypeAndName = (a: Package, b: Package) => {
      if (a.isDevDependency != b.isDevDependency) {
        return a.isDevDependency ? 1 : -1;
      }
      return a.name.localeCompare(b.name);
    };
    const getPackages = async () => {
      store.commit("setInstalledPackages", await API.getInstalledPackages());
    };
    const getPackageJSONFiles = async () => {
      packageJSONFiles.value = await API.getPackageJSONFiles();
      return packageJSONFiles.value;
    };
    const runDepCheck = async () => {
      const { status, result } = await API.getDepCheck();
      if (status === "success") {
        store.commit("setDepCheck", result);
      } else {
        store.commit("setDepCheck", null);
      }
    };
    const isSupportedVersion = (version: string) => {
      return (
        /^file:|^link:|^https?:|^git:|^git\+|^github:|^gist:|^bitbucket:|^gitlab:/.test(
          version
        ) === false
      );
    };
    const loadPackagesSizeInfo = async () => {
      store.commit("setSizeInfo", {});
      for (const item of displayedPackages.value) {
        if (item.isDevDependency || !isSupportedVersion(item.version)) {
          continue;
        }
        getPackageSizeInfo(item.name, item.version).then((res) => {
          store.commit("addSizeInfo", res);
        });
      }
    };

    onMounted(async () => {
      store.dispatch("getConfig");
      const [uri] = await getPackageJSONFiles();
      packageJSON.value = uri;
    });

    watch(versionHash, loadPackagesSizeInfo, {
      immediate: true,
    });

    watch(packageJSON, (value) => {
      if (value) {
        API.setPackageJSON(packageJSON.value);
        getPackages();
      }
    });

    watch(installedPackages, async (packages) => {
      runDepCheck();
      installedPackagesVersions.value = {};
      installedPackagesTags.value = {};
      for (const item of packages) {
        const ver = coerce(item.version)?.raw;
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
        getPackageJSONFiles();
        getPackages();
      }
      if (message.data?.type === "CONFIG_UPDATED") {
        store.dispatch("getConfig");
      }
      if (message.data?.type === "UNIMPORTEDRC_UPDATED") {
        runDepCheck();
      }
    });
    const displayPackageJsonFiles = computed(() => {
      return groupPackageJsonFiles(packageJSONFiles.value);
    });
    return {
      packageJSON,
      packageJSONFiles,
      displayPackageJsonFiles,
      displayedPackages,
      sizeInfo,
      view,
      View,
      installedPackages,
      installedPackagesVersions,
      installedPackagesTags,
      handleUpdateAll,
    };
  },
});
</script>

<style>
body {
  user-select: none;
  overflow: hidden;
  color: var(--vscode-foreground);
  font-size: var(--vscode-font-size);
  font-weight: var(--vscode-font-weight);
  font-family: var(--vscode-font-family);
  background-color: var(--vscode-panel-background);
  padding: 0;
}

* {
  padding: 0;
  margin: 0;
}

*,
*::after,
*::before {
  box-sizing: border-box;
}
</style>

<style scoped>
.container {
  background: var(--vscode-sideBar-background);
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr auto;
  align-content: flex-start;
  height: 100vh;
}

.header {
  display: grid;
  align-items: center;
  row-gap: 0.5rem;
  margin: 0 0.75rem 0;
}

.content {
  width: 100%;
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
}
.content::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0);
}
.content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0);
}
.content:hover::-webkit-scrollbar-thumb {
  background: var(--vscode-scrollbarSlider-background);
}
</style>
