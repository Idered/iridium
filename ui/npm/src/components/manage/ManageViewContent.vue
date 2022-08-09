<template>
  <h2 class="title" v-if="[View.Manage].includes(view)">Dependencies</h2>
  <InstalledItem
    v-if="[View.Manage, View.Analyze].includes(view)"
    v-for="item in displayedPackages.filter((item) => !item.isDevDependency)"
    :item="item"
    :key="item.name"
    :tags="installedPackagesTags[item.name]"
    :versions="installedPackagesVersions[item.name]"
    :size-info="sizeInfo[item.name]"
    @update="handleChangeVersion"
    @changeVersion="handleChangeVersion"
    @remove="handleRemovePackage"
    @swapType="handleSwapType"
  />
  <h2 class="title" v-if="[View.Manage].includes(view)">Dev Dependencies</h2>
  <InstalledItem
    v-if="[View.Manage].includes(view)"
    v-for="item in displayedPackages.filter((item) => item.isDevDependency)"
    :item="item"
    :key="item.name"
    :tags="installedPackagesTags[item.name]"
    :versions="installedPackagesVersions[item.name]"
    :size-info="sizeInfo[item.name]"
    @update="handleChangeVersion"
    @changeVersion="handleChangeVersion"
    @remove="handleRemovePackage"
    @swapType="handleSwapType"
  />
</template>

<script setup lang="ts">
import InstalledItem from "../InstalledItem.vue";
import { useStore } from "../../lib/store";
import { computed } from "vue";
import { View } from "../../enums";
import { getTypingsPackageName, withUpdate } from "../../lib/utils";
import { Package, PackageSizeInfo } from "../../types";
import { API } from "../../lib/api";
import { PropType } from "vue";

const props = defineProps({
  installedPackages: {
    type: Array as PropType<Package[]>,
    required: true,
  },
  displayedPackages: {
    type: Array as PropType<Package[]>,
    required: true,
  },
  installedPackagesTags: {
    type: Object as PropType<
      Record<string, Record<string, string> & { latest?: string }>
    >,
    required: true,
  },
  installedPackagesVersions: {
    type: Object as PropType<{
      [x: string]: string[];
    }>,
    required: true,
  },
  sizeInfo: {
    type: Object as PropType<Record<string, PackageSizeInfo>>,
    required: true,
  },
});

const store = useStore();
const view = computed(() => store.state.view);

const handleRemovePackage = async (pkg: Package) => {
  const typingsName = getTypingsPackageName(pkg.name);
  const typings = props.installedPackages.find(
    (item) => item.name === typingsName
  );
  const packagesToRemove = [pkg.name];
  if (typings) {
    packagesToRemove.push(typings.name);
  }
  withUpdate(packagesToRemove, async () => {
    await API.removePackages(packagesToRemove);
    store.commit("removePackages", packagesToRemove);
  });
};
const handleSwapType = async (item: Package) => {
  withUpdate(item.name, async () => {
    await API.swapPackageType({
      name: item.name,
      dev: item.isDevDependency,
      version: item.version,
    });
    store.commit("swapPackageType", item);
  });
};
const handleChangeVersion = (change: { item: Package; version: string }) => {
  if (!change.version) return;
  withUpdate(change.item.name, async () => {
    await API.changeVersion({
      name: change.item.name,
      version: change.version,
      originalVersion: change.item.version,
    });
    store.commit("changeVersion", change);
  });
};
</script>

<style scoped>
.title {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  padding: 1rem 0.75rem 0;
}
</style>
