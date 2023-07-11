<script setup lang="ts">
import { OnClickOutside } from "@vueuse/components";
import { useWindowSize } from "@vueuse/core";
import { computed, PropType, ref } from "vue";
import IconChevronDown from "./IconChevronDown.vue";
import { useFuse } from "@vueuse/integrations/useFuse";
import VInput from "./VInput.vue";

type Option =
  | {
      value: string;
      label: string;
      indent?: boolean;
    }
  | string;

type OptionGroup = {
  group: string;
  children: Option[];
};

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  id: {
    type: String,
    default: "",
  },
  formatPlaceholder: {
    type: Function as PropType<(option?: Option) => string>,
  },
  placeholder: {
    type: String,
  },
  options: {
    type: Array as PropType<
      (Option & OptionGroup)[] | Option[] | OptionGroup[]
    >,
    default: () => [],
    required: true,
  },
});

const container = ref<HTMLElement>();
const dropdown = ref<HTMLElement>();
const activeIndex = ref(-1);
const search = ref("");
const isOpen = ref(false);
const isFocused = ref(false);
const { height: windowHeight } = useWindowSize();
const flatOptions = computed(() => {
  return props.options.flatMap((option) => {
    if (typeof option === "string") return option;
    if ("group" in option) {
      return option.children.map((item) =>
        typeof item === "string" ? item : { ...item, indent: true }
      );
    }
    return option;
  });
});
const maxHeight = computed(() => {
  if (!isOpen.value || !dropdown.value) return "none";
  const rect = dropdown.value.getBoundingClientRect();
  const difference = windowHeight.value - 40 - (rect.bottom || 0);
  return difference < 0 ? dropdown.value.clientHeight + difference : "none";
});
const maxHeightForTopPosition = computed(() => {
  if (!isOpen.value || !dropdown.value) return "none";
  const difference = windowHeight.value - dropdown.value.clientHeight;
  return difference < 0 ? windowHeight.value / 2 : "none";
});
const position = computed(() => {
  if (!isOpen.value || !container.value) return "bottom";
  return maxHeight.value < 100 ? "top" : "bottom";
});
const groups = computed(() => {
  let index = 1;
  const result = [] as (OptionGroup & { index: number })[];
  for (const item of props.options) {
    if (typeof item === "string") {
      index++;
      continue;
    }
    if (!("group" in item)) {
      index++;
      continue;
    }
    result.push({
      index,
      group: item.group,
      children: item.children,
    });
    index += item.children.length + 1;
  }
  return result;
});
const selected = computed(() => {
  return flatOptions.value.find((option) => val(option) === props.modelValue);
});
const { results } = useFuse(search, flatOptions, {
  matchAllWhenSearchEmpty: true,
  resultLimit: 10,
  fuseOptions: {
    fieldNormWeight: 3,
    keys: ["value"],
  },
});

function val(option: Option) {
  if (typeof option === "string") return option;
  return option?.value;
}

function placeholder(option?: Option) {
  if (props.formatPlaceholder) {
    return props.formatPlaceholder(option);
  }
  if (typeof option === "string") return option;
  return option?.value ?? props.placeholder;
}

function label(option?: Option) {
  if (typeof option === "string") return option;
  return option?.label;
}

function open() {
  activeIndex.value = -1;
  isOpen.value = true;
  isFocused.value = true;
}

function close() {
  activeIndex.value = -1;
  isOpen.value = false;
  isFocused.value = false;
  search.value = "";
}

function handleSelect(option: Option) {
  emit("update:modelValue", val(option));
  close();
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: 0.125s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateY(-2px);
}
</style>

<template>
  <OnClickOutside @trigger="close">
    <div class="relative z-20" @keyup.esc="close" ref="container">
      <v-input
        role="combobox"
        :id="id"
        :aria-expanded="isOpen"
        type="text"
        :readonly="!isOpen"
        @click="open"
        @keydown="
          (e: KeyboardEvent) => {
            e.stopPropagation();
            if (
              !isOpen &&
              !['Enter', 'ArrowDown', 'ArrowUp', 'Space'].includes(e.code)
            ) {
              return;
            }
            if (!isOpen && e.code !== 'Tab') {
              e.preventDefault();
              return open();
            }
            switch (e.code) {
              case 'Tab':
                return close();
              case 'ArrowDown':
                activeIndex =
                  activeIndex + 1 < results.length ? activeIndex + 1 : 0;
                break;
              case 'ArrowUp':
                activeIndex =
                  activeIndex - 1 >= 0 ? activeIndex - 1 : results.length - 1;
                break;
              case 'Enter':
                if (activeIndex > -1) {
                  $emit('update:modelValue', val(results[activeIndex].item));
                } else if (results.length) {
                  $emit('update:modelValue', val(results[0].item));
                }
                return close();
              case 'Escape':
                return close();
              default:
                break;
            }
          }
        "
        @keyup.esc="close"
        v-model="search"
        class="focus:outline-[color:var(--vscode-focusBorder)] placeholder-[color:var(--vscode-settings-textInputForeground, #999)] pr-6 overflow-ellipsis"
        :placeholder="isFocused ? 'Search' : placeholder(selected)"
        :class="{
          'cursor-pointer': !isFocused,
        }"
      />

      <div class="absolute right-2 top-1/2 -mt-[6px] w-4 h-4">
        <IconChevronDown
          height="12"
          class="pointer-events-none transition-transform"
          :class="{
            'rotate-180': !isFocused,
          }"
        />
      </div>

      <transition appear>
        <div
          ref="dropdown"
          v-if="isOpen"
          class="absolute z-10 grid w-full overflow-auto dropdown bg-[color:var(--vscode-dropdown-background)] codesandbox:bg-[color:var(--vscode-settings-textInputBackground)] codesandbox:border-[color:var(--vscode-sideBySideEditor-horizontalBorder)] text-[color:var(--vscode-foreground)]"
          :style="{
            maxHeight: `${
              position === 'top' ? maxHeightForTopPosition : maxHeight
            }px`,
          }"
          :class="{
            'top-full': position === 'bottom',
            'bottom-full': position === 'top',
          }"
          @mouseleave="
            () => {
              activeIndex = -1;
            }
          "
        >
          <div
            v-for="(result, i) in results"
            @click="handleSelect(result.item)"
            class="relative grid h-6 cursor-pointer items-center px-2 transition-colors whitespace-nowrap border"
            :class="{
              'bg-[color:var(--vscode-list-activeSelectionBackground)] text-[color:var(--vscode-list-activeSelectionForeground)] border-[color:var(--vscode-focusBorder)]':
                i === activeIndex || modelValue === val(result.item),
              'border-transparent': i !== activeIndex,
              'pl-4':
                typeof result.item === 'object' &&
                result.item.indent &&
                !search,
            }"
            @mouseenter="activeIndex = i"
          >
            {{ search ? val(result.item) : label(result.item) }}
          </div>
          <div
            v-if="!search"
            v-for="item in groups"
            :key="item.group"
            class="grid h-6 cursor-pointer items-center px-2 font-semibold transition-colors"
            :style="{
              gridRowStart: item.index,
            }"
          >
            {{ item.group }}
          </div>
          <div
            v-if="results.length === 0"
            class="grid h-6 cursor-pointer items-center px-2 font-medium transition-colors"
          >
            No results
          </div>
        </div>
      </transition>
    </div>
  </OnClickOutside>
</template>

<style scoped>
.dropdown {
  padding: 1px;
  font-size: var(--vscode-font-size);
  border: 1px solid
    var(
      --vscode-settings-textInputBorder,
      var(--vscode-settings-textInputBackground)
    );
}
</style>
