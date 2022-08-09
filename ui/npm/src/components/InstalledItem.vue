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
</script>

<template>
  <div
    class="item relative focus:z-50 focus:outline-1 focus:outline focus:outline-[color:var(--vscode-focusBorder)]"
    :class="{ 'item--analyze': view === View.Analyze }"
    tabindex="0"
    @keydown.up.exact="focusPrev"
    @keydown.down.exact="focusNext"
    @keydown.delete.exact="handleDelete"
    @keydown.ctrl.enter.exact.prevent="updatePackageToMaxSatisfying"
    @keydown.ctrl.shift.enter.exact.prevent="updatePackageToLatest"
  >
    <div class="content">
      <Loader class="icon" v-if="isUpdating" />
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.00583 8.26691L0.78 9.50003L0 8.73003L2.09 6.66003L2.85 6.67003L4.94 8.79003L4.18 9.55003L3.01348 8.36995C3.2028 10.9586 5.363 13 8 13C9.91062 13 11.571 11.9283 12.4127 10.3533L13.226 10.9499C12.1959 12.7709 10.2415 14 8 14C4.77573 14 2.14547 11.4568 2.00583 8.26691ZM12.9961 7.80051L11.76 6.55005L11 7.31005L13.09 9.42005L13.85 9.43005L15.94 7.36005L15.19 6.60005L13.996 7.78004C13.8803 4.56823 11.2401 2 8 2C5.83727 2 3.94179 3.14427 2.88597 4.86043L3.69563 5.45436C4.56647 3.98506 6.1682 3 8 3C10.6946 3 12.8914 5.13157 12.9961 7.80051Z"
                fill="currentColor"
              />
            </svg>
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.86 13.3508L2.36 10.8508L2.36 10.1508L4.86 7.65076L5.57 8.35076L3.93 10.0008L9.5 10.0008L9.5 11.0008L3.93 11.0008L5.58 12.6508L4.86 13.3508Z"
                fill="currentColor"
              />
              <path
                d="M10.14 2.64558L12.64 5.14558L12.64 5.84558L10.14 8.34558L9.43 7.64558L11.07 5.99558L5.5 5.99558L5.5 4.99558L11.07 4.99558L9.42 3.34558L10.14 2.64558Z"
                fill="currentColor"
              />
            </svg>
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M8.00004 8.70711L11.6465 12.3536L12.3536 11.6465L8.70714 8.00001L12.3536 4.35356L11.6465 3.64645L8.00004 7.2929L4.35359 3.64645L3.64648 4.35356L7.29293 8.00001L3.64648 11.6465L4.35359 12.3536L8.00004 8.70711Z"
                fill="currentColor"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
    <div class="size-info" v-if="view === View.Analyze && sizeInfo">
      <Stat :value="sizeInfo.size" type="size" />
      <Stat :value="sizeInfo.gzip" type="size" />
      <Stat :value="sizeInfo.threeG" type="time" />
      <Stat :value="sizeInfo.fourG" type="time" />
    </div>
  </div>
</template>

<style scoped>
.icon {
  margin-right: 8px;
}
.item {
  margin: 1px;
  padding: 0 0.75rem;
  line-height: 18px;
  position: relative;
}

.item--analyze:focus-within .name,
.item--analyze:focus .name,
.item--analyze:hover .name {
  padding: 5px 0 23px 0;
}

.content {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  display: grid;
  grid-column: 1/4;
  margin-top: 4px;
  column-gap: 0.25rem;
  height: 14px;
  max-height: 14px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  width: 100%;
}
</style>
