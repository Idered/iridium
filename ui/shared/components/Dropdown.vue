<template>
  <div class="dropdown">
    <div class="content" :class="{ isOpen, [position]: true }" @click.stop>
      <slot name="content" :close="toggle" />
    </div>
    <div class="target" @click.stop="toggle">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { v4 } from "uuid";
import { defineComponent, onBeforeUnmount, onMounted, ref } from "vue";

export default defineComponent({
  name: "Dropdown",
  props: {
    position: {
      type: String,
      default: "bottom-right",
    },
  },
  setup() {
    const uuid = ref(v4());
    const isOpen = ref(false);
    const CloseDropdownEvent = new CustomEvent("CloseDropdown", {
      detail: { uuid: uuid.value },
    });
    const toggle = () => {
      isOpen.value = !isOpen.value;
      document.dispatchEvent(CloseDropdownEvent);
    };
    const handleClickOutside = () => {
      if (isOpen.value) {
        isOpen.value = false;
      }
    };
    const handleCloseDropdown = (e: any) => {
      if (e.detail.uuid !== uuid.value) {
        isOpen.value = false;
      }
    };
    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
      document.addEventListener(CloseDropdownEvent.type, handleCloseDropdown);
    });
    onBeforeUnmount(() => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener(
        CloseDropdownEvent.type,
        handleCloseDropdown
      );
    });
    return { isOpen, toggle };
  },
});
</script>

<style scoped>
.dropdown {
  position: relative;
}
.content {
  position: absolute;
  background: var(--vscode-panel-background);
  border: 1px solid var(--vscode-input-border);
  display: none;
  max-height: 50vh;
  overflow: auto;
  max-width: calc(100vw - 16px);
  z-index: 30;
}
.bottom-right {
  top: 100%;
  right: 0;
  margin-top: 8px;
}
.top-right {
  bottom: 100%;
  right: 0;
  margin-bottom: 8px;
}
.content.isOpen {
  display: block;
}
</style>
