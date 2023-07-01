<script setup lang="ts">
import { computed, PropType } from "vue";
import VSelect from "./VSelect.vue";
import maxSatisfying from "semver/ranges/max-satisfying";
import minSatisfying from "semver/ranges/min-satisfying";
import coerce from "semver/functions/coerce";
import Loader from "./Loader.vue";
import { Package, PackageSizeInfo } from "../types";
import Stat from "./Stat.vue";
import { View } from "../enums";
import { useStore } from "../lib/store";
import BugIcon from "./BugIcon.vue";
import UpdateIcon from "./UpdateIcon.vue";
import DoubleArrowIcon from "./DoubleArrowIcon.vue";
import RemoveIcon from "./RemoveIcon.vue";
import EnterIcon from "./EnterIcon.vue";

const emit = defineEmits(["remove", "changeVersion", "swapType", "update"]);

const props = defineProps({
  sizeInfo: {
    type: Object as PropType<PackageSizeInfo>,
  },
  item: {
    type: Object as PropType<Package>,
    required: true,
  },
  tags: {
    type: Object as PropType<Record<string, string> & { latest?: string }>,
    default: () => ({}),
  },
  versions: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const store = useStore();
const columns = computed(() => store.state.config.analyze.columns);
const view = computed(() => store.state.view);
const coercedVersion = computed(
  () =>
    minSatisfying(props.versions, props.item.version) ||
    coerce(props.item.version)?.raw ||
    "0.0.0"
);
const currentMajor = computed(() => coerce(props.item.version)?.major);
const currentMinor = computed(() => coerce(props.item.version)?.minor);
const currentPatch = computed(() => coerce(props.item.version)?.patch);
const latestVersion = computed(() =>
  coerce(
    props.versions.find((item) => !/alpha|beta|experimental|pre/.test(item))
  )
);
const latestMajor = computed(() => latestVersion.value?.major);
const latestMinor = computed(() => latestVersion.value?.minor);
const latestPatch = computed(() => latestVersion.value?.patch);
const showActions = computed(() => {
  return !/^file:|^link:|^https?:|^git:|^git\+|^github:|^gist:|^bitbucket:|^gitlab:/.test(
    props.item.version
  );
});
const hasAvailableUpdate = computed(
  () =>
    typeof maxSatisfyingVersion.value === "string" &&
    maxSatisfyingVersion.value !== coercedVersion.value
);
const hasMajorUpdate = computed(
  () =>
    hasAvailableUpdate.value &&
    typeof latestMajor.value === "number" &&
    typeof currentMajor.value === "number" &&
    latestMajor.value > currentMajor.value
);
const hasMinorUpdate = computed(
  () =>
    hasAvailableUpdate.value &&
    (hasMajorUpdate.value ||
      (typeof latestMinor.value === "number" &&
        typeof currentMinor.value === "number" &&
        latestMinor.value > currentMinor.value))
);
const hasPatchUpdate = computed(
  () =>
    hasAvailableUpdate.value &&
    (hasMinorUpdate.value ||
      (typeof latestPatch.value === "number" &&
        typeof currentPatch.value === "number" &&
        latestPatch.value > currentPatch.value))
);
const isUpdating = computed(() =>
  store.state.updatingPackages.includes(props.item.name)
);
const displayVersion = computed(() => {
  if (props.item.version.match(/http/)) {
    return "Custom";
  }
  return props.item.version;
});
const swapPackageType = () => {
  emit("swapType", props.item);
};
const maxSatisfyingVersion = computed(() => {
  return maxSatisfying(props.versions, props.item.version);
});
const isUnused = computed(() => store.getters.isUnused(props.item.name));
const updatePackageToMaxSatisfying = () => {
  emit("update", { item: props.item, version: maxSatisfyingVersion.value });
};
const updatePackageToLatest = () => {
  if (!props.tags.latest) return;
  handleVersionChange(props.tags.latest);
};
const handleVersionChange = (newVersion: string) => {
  emit("changeVersion", {
    item: props.item,
    version: newVersion,
  });
};

const focusPrev = (event: KeyboardEvent) => {
  const target = event.target as HTMLDivElement;
  const prev = target.previousElementSibling as HTMLDivElement;
  prev?.focus();
};

const focusNext = (event: KeyboardEvent) => {
  const target = event.target as HTMLDivElement;
  const next = target.nextElementSibling as HTMLDivElement;
  next?.focus();
};

const handleDelete = (event: KeyboardEvent) => {
  const target = event.target as HTMLDivElement;
  const next = target.nextElementSibling as HTMLDivElement;
  const prev = target.previousElementSibling as HTMLDivElement;
  next?.focus();
  if (!next) prev?.focus();
  emit("remove", props.item);
};
const isVulnerable = computed(() => {
  return store.getters.isVulnerable(props.item.name);
});
const viewDetails = () => {
  store.commit("navigate", View.Details);
  store.commit("setSelectedPackage", props.item.name);
};
</script>

<template>
  <div
    class="item relative focus:z-50 focus:outline-1 focus:outline focus:outline-[color:var(--vscode-focusBorder)]"
    :class="{
      'item--analyze': view === View.Analyze,
      'bg-[color:var(--vscode-errorLens-errorBackground)] text-[color:var(--vscode-errorForeground)]':
        isVulnerable,
    }"
    tabindex="0"
    @keydown.up.exact="focusPrev"
    @keydown.down.exact="focusNext"
    @keydown.delete.exact="handleDelete"
    @keydown.ctrl.enter.exact.prevent="updatePackageToMaxSatisfying"
    @keydown.ctrl.shift.enter.exact.prevent="updatePackageToLatest"
  >
    <div
      class="relative"
      :class="{
        'flex items-center justify-between': view === View.Manage,
        grid: view === View.Analyze,
      }"
      :style="{
        gridTemplateColumns:
          view === View.Analyze ? `1fr ${columns.length * 65}px` : undefined,
      }"
    >
      <Loader class="icon" v-if="isUpdating" />
      <BugIcon class="flex-shrink-0" v-else-if="isVulnerable" />
      <!-- <img
        v-else
        class="icon"
        :src="`https://github-icons.com/npm/${item.name}`"
        width="20"
        height="20"
      /> -->
      <span
        class="name"
        :class="{ unused: isUnused }"
        :title="isUnused ? 'Unused dependency' : undefined"
        >{{ item.name }}</span
      >
      <span v-if="view === View.Manage" class="version">
        <span v-if="/\d+\.\d+\.\d+/.test(displayVersion)">
          <span
            :class="{
              'text-[color:var(--vscode-list-highlightForeground)] codesandbox:text-[color:var(--vscode-editorWarning-foreground)]':
                hasMajorUpdate,
            }"
          >
            {{ displayVersion.split(".")[0] }}
          </span>
          <span
            :class="{
              'text-[color:var(--vscode-list-highlightForeground)] codesandbox:text-[color:var(--vscode-editorWarning-foreground)]':
                hasMinorUpdate,
            }"
            >.{{ displayVersion.split(".")[1] }}</span
          >
          <span
            :class="{
              'text-[color:var(--vscode-list-highlightForeground)] codesandbox:text-[color:var(--vscode-editorWarning-foreground)]':
                hasPatchUpdate,
            }"
            >.{{ displayVersion.split(".").slice(2).join(".") }}</span
          >
        </span>
        <span v-else>{{ displayVersion }}</span>
      </span>
      <div class="overlay" v-if="showActions">
        <div class="overlay__content">
          <VSelect
            class="version-input"
            :model-value="coercedVersion"
            @update:model-value="handleVersionChange"
            :options="versions"
            placeholder="Select version"
          />

          <a
            v-if="hasAvailableUpdate"
            role="button"
            tabindex="0"
            class="action"
            :title="`Update to ${maxSatisfyingVersion}`"
            @click="updatePackageToMaxSatisfying"
            @keydown.space="updatePackageToMaxSatisfying"
            @keydown.enter="updatePackageToMaxSatisfying"
          >
            <UpdateIcon />
          </a>

          <a
            role="button"
            tabindex="0"
            class="action"
            title="View package details"
            @click="viewDetails"
          >
            <EnterIcon />
          </a>

          <a
            role="button"
            tabindex="0"
            class="action"
            title="Change dependency type"
            @click="swapPackageType"
            @keydown.space="swapPackageType"
            @keydown.enter="swapPackageType"
          >
            <DoubleArrowIcon />
          </a>

          <a
            role="button"
            tabindex="0"
            class="action"
            title="Delete"
            @click="$emit('remove', item)"
            @keydown.space="$emit('remove', item)"
            @keydown.enter="$emit('remove', item)"
          >
            <RemoveIcon />
          </a>
        </div>
      </div>
      <div
        class="size-info grid"
        :style="{
          gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
        }"
        v-if="view === View.Analyze && sizeInfo"
      >
        <Stat
          v-if="columns.includes('min')"
          :value="sizeInfo.size"
          type="size"
        />
        <Stat
          v-if="columns.includes('gzip')"
          :value="sizeInfo.gzip"
          type="size"
        />
        <Stat
          v-if="columns.includes('slow3G')"
          :value="sizeInfo.threeG"
          type="time"
        />
        <Stat
          v-if="columns.includes('slow4G')"
          :value="sizeInfo.fourG"
          type="time"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.icon {
  margin-right: 8px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-items: center;
}
.item {
  margin: 1px;
  padding: 0 0.75rem;
  line-height: 18px;
  position: relative;
}

.item :deep(.multiselect) {
  position: static;
  overflow: hidden;
  justify-content: space-between;
}
.item :deep(.multiselect-dropdown) {
  left: 0.75rem;
  right: 0.75rem;
}
.item :deep(.multiselect-single-label) {
  position: relative;
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item:focus-within .overlay,
.item:focus .overlay,
.item:hover .overlay {
  display: grid;
}

.item:focus-within .size-info,
.item:focus-within .version,
.item:focus .size-info,
.item:focus .version,
.item:hover .size-info,
.item:hover .version {
  display: none;
}

.name {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
  flex-grow: 1;
  padding: 5px 0;
}

/* .unused {
  cursor: help;
  opacity: 0.5;
} */

.version {
  color: var(--vscode-descriptionForeground);
  min-width: 30px;
  text-align: right;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
}

.overlay {
  /* background: var(--vscode-list-hoverBackground); */
  display: none;
  justify-content: flex-end;
  align-items: center;
}

.overlay__content {
  display: flex;
  column-gap: 6px;
  align-items: center;
  position: relative;
}

.version-input {
  flex-grow: 1;
  min-width: 5rem;
}

.action {
  cursor: pointer;
  background: none;
  border: none;
  flex-grow: 0;
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  padding: 2px;
  color: var(--vscode-foreground);
}

.action:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.action:focus {
  outline-color: var(--vscode-focusBorder);
}

.item:focus-within,
.item:focus,
.item:hover {
  background: var(--vscode-list-hoverBackground);
  color: var(--vscode-list-hoverForeground);
}

.size-info {
  margin-top: 4px;
  column-gap: 0.25rem;
  height: 14px;
  max-height: 14px;
  width: 100%;
}
</style>
