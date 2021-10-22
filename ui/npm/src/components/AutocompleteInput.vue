<template>
  <div class="autocomplete">
    <label class="search-input">
      <SearchIcon />
      <input
        ref="inputRef"
        tabindex="0"
        type="text"
        :value="query"
        placeholder="Add dependency"
        @click.stop
        @focus="state = State.Active"
        @blur="hideAutoComplete"
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

    <div v-if="state !== State.Inactive" class="results" @click.stop>
      <div
        v-if="!isLoading && !packageSuggestions.length && !query.length"
        class="results__initial"
      >
        Start typing to search for a package
      </div>
      <div
        v-if="isLoading && !packageSuggestions.length"
        class="results__loading"
      >
        <Loader />
        <span>Fetching suggestions...</span>
      </div>
      <div
        v-if="!isLoading && !packageSuggestions.length && query.length"
        class="results__empty"
      >
        <span>No results...</span>
      </div>
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
          :key="item.name"
          class="results__item"
          :class="{ 'is-active': i === highlight }"
          @click.exact.stop="addPackage()"
          @click.exact.stop.alt="addPackage({ dev: true })"
          @mouseenter="highlightItem(i)"
        >
          <div class="results__item-header">
            <div>
              <span
                class="results__item-title"
                v-html="item._highlightResult.name.value || item.name"
              />
              <span>@{{ item.version }}</span>
            </div>
            <a
              v-if="item.types.ts && i === highlight"
              :title="
                item.types.ts === 'definitely-typed'
                  ? `This package has TypeScript declarations provided by ${item.types.definitelyTyped}`
                  : `This package contains build-in TypeScript declarations`
              "
            >
              <svg
                width="14"
                height="14"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 256 256"
                v-if="item.types.ts === 'definitely-typed'"
              >
                <rect fill="#3178c6" width="256" height="256" />
                <rect x="6" y="6" fill="#ffffff" width="244" height="244" />
                <path
                  fill="#3178c6"
                  d="M41.8,111.5c8.6-1.6,19.9-2.5,31.8-2.5c19.7,0,32.6,4.2,42.6,13c10.8,9.4,17.6,24.5,17.6,46
	c0,23.4-7.3,39.5-17.3,49.5c-11,10.7-27.6,15.8-48,15.8c-12.2,0-20.8-0.9-26.7-1.8V111.5z M65.4,211.2c2,0.5,5.2,0.5,8.2,0.5
	c21.3,0.2,35.2-13.6,35.2-42.7c0.2-25.4-12.5-38.8-32.7-38.8c-5.2,0-8.6,0.5-10.6,1.1V211.2z"
                />
                <path
                  fill="#3178c6"
                  d="M169.4,134.7h-32.2v-22.8h92.3v22.8h-32.8V232h-27.3V134.7z"
                />
              </svg>
              <svg
                v-if="item.types.ts === 'included'"
                width="14"
                height="14"
                viewBox="0 0 256 256"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M256 0H0V256H256V0Z" fill="#3178C6" />
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M150.5 200.5V228.1C155 230.4 160.3 232.1 166.4 233.3C172.5 234.5 179 235 185.8 235C192.4 235 198.7 234.4 204.7 233.1C210.7 231.8 215.9 229.7 220.4 226.8C224.9 223.9 228.4 220.1 231.1 215.4C233.7 210.7 235 204.9 235 198C235 193 234.3 188.6 232.8 184.8C231.3 181 229.1 177.7 226.3 174.7C223.5 171.8 220.1 169.1 216.2 166.8C212.3 164.5 207.8 162.3 202.9 160.2C199.3 158.7 196 157.3 193.1 155.8C190.2 154.4 187.8 153 185.8 151.5C183.8 150 182.2 148.5 181.1 146.8C180 145.1 179.5 143.3 179.5 141.2C179.5 139.3 180 137.6 181 136.1C182 134.6 183.4 133.3 185.1 132.2C186.9 131.1 189.1 130.3 191.7 129.7C194.3 129.1 197.2 128.8 200.3 128.8C202.6 128.8 205 129 207.6 129.3C210.2 129.6 212.7 130.2 215.3 130.9C217.9 131.6 220.4 132.5 222.9 133.6C225.3 134.7 227.6 136 229.7 137.4V111.6C225.5 110 220.9 108.8 215.9 108C210.9 107.2 205.2 106.8 198.8 106.8C192.2 106.8 186 107.5 180.1 108.9C174.2 110.3 169.1 112.5 164.6 115.5C160.1 118.5 156.6 122.3 154 126.9C151.4 131.5 150.1 137.1 150.1 143.5C150.1 151.7 152.5 158.7 157.2 164.6C162 170.4 169.2 175.3 178.8 179.4C182.6 181 186.1 182.5 189.4 184C192.7 185.5 195.5 187 197.9 188.7C200.3 190.4 202.2 192.1 203.6 194C205 195.9 205.7 198.1 205.7 200.5C205.7 202.3 205.3 203.9 204.4 205.5C203.5 207 202.2 208.3 200.5 209.5C198.8 210.7 196.6 211.5 193.9 212.1C191.2 212.7 188.2 213 184.7 213C178.7 213 172.8 211.9 166.9 209.8C161 207.8 155.5 204.7 150.5 200.5ZM104.5 131.7H140V109H41V131.7H76.3V233H104.4V131.7H104.5Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
          <div
            class="results__item-description"
            v-if="!/https?/.test(item.description)"
          >
            {{ item.description }}
          </div>
        </div>
      </div>

      <div
        v-if="error === ErrorType.SuggestionsServiceIsNotResponding"
        class="results__error"
      >
        <span>
          The suggestions service is not responding. Please try again later.
        </span>
      </div>

      <div v-if="packageSuggestions.length" class="results__shortcuts">
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
</template>
<script lang="ts">
import { ref } from "vue";
import { watch } from "vue";
import { computed } from "vue";
import { defineComponent } from "vue";
import {
  AlgoliaSearchResponse,
  API,
  GetPackageVersionsAndTagsResponse,
} from "../lib/api";
import { useStore } from "../lib/store";
import { Package } from "../types";
import { withUpdate } from "../lib/utils";
import SearchIcon from "./icons/SearchIcon.vue";
import { ErrorType } from "../enums";
import Loader from "./Loader.vue";

enum State {
  Inactive,
  Active,
}

export default defineComponent({
  name: "AutocompleteInput",
  components: {
    SearchIcon,
    Loader,
  },
  setup() {
    const store = useStore();
    const inputRef = ref<HTMLInputElement>();
    const resultsRef = ref<HTMLDivElement>();
    const state = ref<State>(State.Inactive);
    const requestId = ref<number>(0);
    const query = ref("");
    const error = ref<ErrorType | null>(null);
    const highlight = ref(0);
    const pendingRequests = ref(0);
    const isLoading = computed(() => pendingRequests.value > 0);
    const searchPosition = ref(0);
    const packageName = computed(() => {
      const indexOfAt = query.value.indexOf("@", 1);
      if (indexOfAt === -1) {
        return query.value;
      }
      return query.value.substring(0, indexOfAt);
    });
    const versions = ref<GetPackageVersionsAndTagsResponse["versions"]>([]);
    const tags = ref<GetPackageVersionsAndTagsResponse["tags"]>({});
    const packageSuggestions = ref<AlgoliaSearchResponse[]>([]);
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
    const getVersionTag = (version: string) => {
      return Object.entries(tags.value).find(([tag, tagVersion]) => {
        return tagVersion === version;
      })?.[0];
    };
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
    const hideAutoComplete = () => {
      state.value = State.Inactive;
      highlight.value = 0;
      query.value = "";
      packageSuggestions.value = [];
      inputRef.value?.blur();
    };
    const addPackage = async ({ dev }: { dev: boolean } = { dev: false }) => {
      const selected = packageSuggestions.value.find((item, i) =>
        packageVersion.value
          ? item.name === packageName.value
          : i === highlight.value
      );
      if (!selected) return;
      const item = {
        name: selected.name,
        version: packageVersion.value || selected.version,
        isDevDependency: dev,
      };
      await withUpdate(item.name, async () => {
        query.value = "";
        const isInstalled = store.state.installedPackages.some(
          (item: Package) => item.name === selected.name
        );
        if (!isInstalled) {
          store.commit("addPackage", item);
        }
        await API.installPackage({ packages: [item], dev });
      });
      const typings = selected.types.definitelyTyped
        ? {
            name: selected.types.definitelyTyped,
            version: "latest",
            isDevDependency: true,
          }
        : null;
      await withUpdate(typings?.name, async () => {
        if (!typings) return;
        const isInstalled = store.state.installedPackages.some(
          (item: Package) => item.name === typings?.name
        );
        if (!isInstalled) {
          store.commit("addPackage", typings);
        }
        await API.installPackage({
          packages: [typings],
          dev: true,
        });
      });
    };

    watch(highlight, (value) => {
      resultsRef.value?.children[value]?.scrollIntoView({
        block: "nearest",
      });
    });

    watch(showVersionSuggestions, async (value, oldValue) => {
      if (value && !oldValue) {
        const suggestion = packageSuggestions.value[highlight.value];
        if (!suggestion) return;
        query.value = `${suggestion.name}@`;
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
      if (!value) {
        packageSuggestions.value = [];
        return;
      }
      try {
        error.value = null;
        pendingRequests.value++;
        let thisRequest = ++requestId.value;
        const suggestions = await API.getSuggestions(value);
        if (thisRequest !== requestId.value) {
          pendingRequests.value--;
          return;
        }
        packageSuggestions.value = suggestions.hits;
      } catch (err) {
        error.value = ErrorType.SuggestionsServiceIsNotResponding;
      }
      pendingRequests.value--;
    });

    return {
      query,
      highlight,
      state,
      State,
      error,
      ErrorType,
      inputRef,
      isLoading,
      packageSuggestions,
      resultsRef,
      displayedVersions,
      showVersionSuggestions,
      handleSearchInput,
      handleSearchPositionChange,
      goUp,
      goDown,
      highlightItem,
      hideAutoComplete,
      addPackage,
    };
  },
});
</script>
<style scoped>
.search-input {
  display: flex;
  padding: 0 0.5rem;
  align-items: center;
  font-size: var(--vscode-font-size);
  background: var(--vscode-settings-textInputBackground);
  border: 1px solid
    var(
      --vscode-settings-textInputBorder,
      var(--vscode-settings-textInputBackground)
    );
  color: var(--vscode-settings-textInputForeground);
}
.search-input:focus-within {
  border-color: var(--vscode-focusBorder);
}
.search-input svg {
  width: 16px;
  margin-right: 0.25rem;
}
.search-input input {
  border: 0;
  width: 100%;
  background: none;
  -webkit-appearance: none;
  appearance: none;
  height: 24px;
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
  transform: translateY(0px);
  left: 0.75rem;
  right: 0.75rem;
  z-index: 100;
  position: absolute;
  color: var(--vscode-dropdown-foreground);
  background: var(--vscode-dropdown-background);
  /* border: 1px solid var(--vscode-dropdown-border); */
  border: 1px solid var(--vscode-focusBorder);
  box-sizing: border-box;
}
.results__initial {
  padding: 0.25rem 0.75rem;
}
.results__empty {
  padding: 0.25rem 0.75rem;
}
.results__error {
  padding: 0 0.75rem 0.25rem 0.75rem;
  color: var(--vscode-errorForeground);
}
.results__loading {
  padding: 0.25rem 0.75rem;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: 0.25rem;
  align-items: center;
  justify-content: center;
}
.results__content {
  max-height: 280px;
  overflow-y: auto;
  padding: 1px;
}
.results__shortcuts {
  /* background: var(--vscode-badge-background);
  color: var(--vscode-badge-foreground); */
  border-top: 1px solid var(--vscode-settings-textInputBorder);
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
  border: 1px solid var(--vscode-keybindingLabel-border);
  border-bottom-color: var(--vscode-keybindingLabel-bottomBorder);
  background-color: var(--vscode-keybindingLabel-background);
  color: var(--vscode-foreground);
  box-shadow: var(--vscode-widget-shadow) 0px -1px 0px inset;
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
.results__item.is-active {
  background-color: var(--vscode-quickInputList-focusBackground);
  color: var(--vscode-quickInputList-focusForeground);
  outline-style: solid;
  outline-width: 1px;
  outline-offset: -1px;
  outline-color: var(--vscode-list-focusOutline);
}
.results__item-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.results__item-title :global(em) {
  font-weight: bold;
  font-style: normal;
  color: var(--vscode-list-focusForeground);
}
.results__item--version {
  display: flex;
  justify-content: space-between;
}
.results__item-description {
  color: var(--vscode-descriptionForeground);
  margin-top: 4px;
  word-wrap: break-word;
}
.is-active .results__item-description {
  color: inherit;
}
.results__item-typings {
  display: flex;
  align-items: center;
  color: var(--vscode-list-foreground);
  background: var(--vscode-list-background);
  margin-top: 4px;
  word-wrap: break-word;
  column-gap: 0.25rem;
  margin: 0 -0.75rem -0.5rem;
  padding: 0.5rem 0.75rem;
  /* font-size: 11px; */
  /* text-transform: uppercase; */
  /* font-weight: bold; */
}
.results__item-tag {
  color: var(--vscode-descriptionForeground);
}
</style>
