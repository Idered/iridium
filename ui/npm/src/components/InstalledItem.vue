<template>
  <div class="item">
    <Loader v-if="isUpdating" />
    <svg
      v-else
      const
      isOver="ref(false)"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-if="item.isDevDependency"
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.7724 3.48501L13.9937 3.30124L11.8849 5.39688L10.6906 4.18062L12.7468 2.02372L12.5674 1.23187C12.1328 1.08662 11.6782 1.00986 11.2199 1.00436C10.7202 0.996443 10.2243 1.09177 9.76308 1.28437C9.31782 1.48601 8.91531 1.77113 8.57742 2.12433C8.20125 2.48057 7.90327 2.91115 7.70242 3.38872C7.31575 4.33966 7.31575 5.40403 7.70242 6.35498C5.91304 8.10498 2.95993 11.0931 1.5293 12.5894C1.31956 12.8644 1.21839 13.207 1.24497 13.5518C1.25427 13.7356 1.30036 13.9156 1.38057 14.0812C1.46022 14.2472 1.5717 14.3958 1.70869 14.5187C1.83279 14.6544 1.98117 14.7657 2.14619 14.8469C2.31626 14.9218 2.49866 14.9648 2.68431 14.9737C2.99994 14.9677 3.30286 14.8481 3.53746 14.6369C5.08621 13.18 8.05243 10.1875 9.73681 8.4331C10.1934 8.62691 10.6845 8.72663 11.1806 8.72625C11.6799 8.72589 12.1742 8.62543 12.6341 8.43081C13.094 8.23618 13.5102 7.9513 13.8581 7.59308C14.5727 6.86438 14.9719 5.88373 14.9693 4.86309C14.9806 4.39597 14.914 3.93029 14.7724 3.48501ZM2.93371 13.9281C2.89503 13.9624 2.84839 13.9864 2.79806 13.9981C2.74884 14.0066 2.69855 14.0066 2.64933 13.9981C2.59751 13.9903 2.54811 13.9709 2.50492 13.9412C2.45888 13.9143 2.41994 13.8768 2.39122 13.8318C2.25122 13.6875 2.11994 13.4162 2.25119 13.2631C3.62056 11.8062 6.44243 8.95809 8.20556 7.21684C8.30659 7.3493 8.4162 7.47498 8.53368 7.59308C8.65214 7.71588 8.77935 7.82994 8.9143 7.93435C7.20805 9.68435 4.42559 12.4975 2.93371 13.9281ZM14.0505 4.86309C14.0531 5.62826 13.7545 6.36373 13.2193 6.91061C12.6844 7.4354 11.9649 7.72938 11.2156 7.72938C10.4662 7.72938 9.74676 7.4354 9.21183 6.91061C8.81999 6.50142 8.55236 5.98941 8.44006 5.4341C8.32776 4.8788 8.37538 4.30301 8.57742 3.77372C8.71194 3.41382 8.92047 3.08613 9.1895 2.81183C9.45853 2.53752 9.78211 2.32269 10.1393 2.18121C10.4786 2.03857 10.8431 1.96567 11.2112 1.96684H11.465L9.64933 3.83935V4.53496L11.5437 6.42061H12.2043L14.0505 4.60498V4.86309ZM3.23992 6.68751H4.77117L5.47554 7.40501L6.15369 6.73125L5.48868 6.05315V6.00936L5.54556 4.36003L5.32681 3.92253L2.46554 2.04126L1.87492 2.1069L1.04366 2.95562L0.978027 3.55499L2.81556 6.47314L3.23992 6.68751ZM2.29491 3.05624L4.6093 4.57878L4.56994 5.70313H3.49365L2.00182 3.34062L2.29491 3.05624ZM9.39991 10.0169L10.0737 9.34314L13.1799 12.5282C13.4415 12.8031 13.5875 13.1681 13.5875 13.5476C13.5875 13.9271 13.4415 14.292 13.1799 14.5669C12.9832 14.7688 12.7303 14.9068 12.4541 14.963C12.1779 15.0192 11.8912 14.9909 11.6312 14.8819C11.4651 14.8083 11.3162 14.7011 11.1937 14.5669L8.05243 11.3644L8.73058 10.6863L11.863 13.88C11.9052 13.9265 11.9577 13.9625 12.0162 13.9851C12.1312 14.0318 12.2599 14.0318 12.3749 13.9851C12.4335 13.9625 12.4859 13.9265 12.528 13.88C12.572 13.8366 12.6063 13.7845 12.6287 13.7269C12.6512 13.6682 12.6631 13.606 12.6637 13.5432C12.6627 13.4804 12.6508 13.4182 12.6287 13.3594C12.6063 13.3018 12.572 13.2497 12.528 13.2063L9.39991 10.0169Z"
        fill="#C5C5C5"
      />
      <path
        v-else
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M8.61 3L14.35 4.53L15 5V11.74L14.63 12.22L8.5 13.91L2.36 12.22L2 11.74V5L2.61 4.53L8.34 3H8.61ZM8.52 4L4.52 5L5.07 5.2L8.5 6.1L11.5 5.29L12.45 5L8.52 4ZM3 11.36L8 12.73V7L3 5.66V11.36ZM9 7V12.73L14 11.36V5.63L11.98 6.18348V8.75001L10.98 9.01001V6.45748L9 7Z"
        fill="#C5C5C5"
      />
    </svg>

    <span>{{ item.name }}</span>

    <span>
      <span
        v-if="view === View.Manage"
        class="version"
        :class="{
          'version--update-available': isUpdateAvailable,
        }"
        >{{ displayVersion }}</span
      >
    </span>

    <div class="overlay">
      <SelectInput
        class="version-input"
        :model-value="coercedVersion"
        @update:model-value="handleVersionChange"
        :options="versions"
        :maxHeight="180"
        close-on-select
        placeholder="Select version"
        align="bottom-right"
      />

      <a
        v-if="isUpdateAvailable"
        role="button"
        class="action"
        tabindex="0"
        :title="`Update to ${tags.latest}`"
        @click="updatePackageToLatest"
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
            fill="#C5C5C5"
          />
        </svg>
      </a>

      <a
        role="button"
        class="action"
        tabindex="0"
        title="Change dependency type"
        @click="swapPackageType"
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
            fill="#C5C5C5"
          />
          <path
            d="M10.14 2.64558L12.64 5.14558L12.64 5.84558L10.14 8.34558L9.43 7.64558L11.07 5.99558L5.5 5.99558L5.5 4.99558L11.07 4.99558L9.42 3.34558L10.14 2.64558Z"
            fill="#C5C5C5"
          />
        </svg>
      </a>

      <a
        role="button"
        class="action"
        tabindex="0"
        title="Delete"
        @click="$emit('remove', item)"
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
            fill="#C5C5C5"
          />
        </svg>
      </a>
    </div>
    <div class="size-info" v-if="view === View.Analyze && sizeInfo">
      <Stat :value="sizeInfo.size" type="size" label="Min" />
      <Stat :value="sizeInfo.gzip" type="size" label="Min + GZIP" />
      <Stat :value="sizeInfo.threeG" type="time" label="Slow 3G" />
      <Stat :value="sizeInfo.fourG" type="time" label="Emerging 4G" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from "vue";
import SelectInput from "@shared/components/SelectInput.vue";
import semver from "semver";
import Loader from "./Loader.vue";
import { Package, PackageSizeInfo } from "../types";
import { formatSize, formatTime } from "../utils";
import Stat from "./Stat.vue";
import { View } from "../enums";

export default defineComponent({
  components: { SelectInput, Loader, Stat },
  name: "InstalledItem",
  emits: ["remove", "changeVersion", "swapType"],
  props: {
    view: {
      type: Number,
    },
    updatingPackages: {
      type: Set as PropType<Set<string>>,
      required: true,
    },
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
  },
  setup(props, { emit }) {
    const coercedVersion = computed(
      () => semver.coerce(props.item.version)?.raw || "0.0.0"
    );
    const isUpdateAvailable = computed(() => {
      if (!props.tags.latest) return false;
      return semver.lt(coercedVersion.value, props.tags.latest);
    });
    const isUpdating = computed(() => {
      return props.updatingPackages.has(props.item.name);
    });
    const displayVersion = computed(() => {
      if (props.item.version.match(/http/)) {
        return "Custom";
      }
      return props.item.version;
    });
    const swapPackageType = () => {
      emit("swapType", props.item);
    };
    const updatePackageToLatest = () => {
      emit("changeVersion", {
        item: props.item,
        version: props.tags.latest,
      });
    };
    const handleVersionChange = (newVersion: string) => {
      emit("changeVersion", {
        item: props.item,
        version: newVersion,
      });
    };
    return {
      View,
      displayVersion,
      isUpdateAvailable,
      isUpdating,
      coercedVersion,
      handleVersionChange,
      updatePackageToLatest,
      formatSize,
      formatTime,
      swapPackageType,
    };
  },
});
</script>

<style scoped>
.item {
  padding: 5px 0.75rem;
  line-height: 18px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  column-gap: 8px;
  justify-content: space-between;
  position: relative;
}

.item:hover {
  background: var(--vscode-list-hoverBackground);
  color: var(--vscode-list-hoverForeground);
}

.version {
  color: var(--vscode-descriptionForeground);
}

.version--update-available {
  color: var(--vscode-list-highlightForeground);
}

.overlay {
  padding: 0 0.75rem;
  background: var(--vscode-list-hoverBackground);
  position: absolute;
  opacity: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: grid;
  grid-auto-flow: column;
  column-gap: 6px;
  justify-content: flex-end;
  align-items: center;
  pointer-events: none;
}

.version-input {
  width: 96px;
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
  color: var(--vscode-descriptionForeground);
}

.action:hover {
  background: var(--vscode-toolbar-hoverBackground);
}

.action:focus {
  outline-color: var(--vscode-focusBorder);
}

.item:hover .overlay {
  opacity: 1;
  pointer-events: all;
}

.size-info {
  display: grid;
  grid-column: 1/4;
  margin-top: 4px;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}
</style>