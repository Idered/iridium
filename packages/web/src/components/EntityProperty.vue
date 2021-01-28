<template>
  <div class="property">
    <span class="key" @click="gotoProperty">{{ $props.name }}</span>
    <span>: </span>
    <span class="type" :class="{ linked: !!linkedEntity }" @click="gotoType">{{
      propertyType
    }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, PropType } from "vue";
import { Actions } from "../enums";
import { useVSCode } from "../helpers/use-vscode";

export default defineComponent({
  name: "EntityProperty",
  props: {
    name: String,
    entity: {
      type: Object as any,
    },
    property: {
      type: Object as any,
    },
  },
  setup(props) {
    const vscode = useVSCode();
    const entities = inject<any>("entities");
    const type = props.property?.typeAnnotation.typeAnnotation.type;
    const propertyType = computed(() => {
      // if (
      //   props.property?.typeAnnotation.typeAnnotation.type === "TSArrayType"
      // ) {
      //   console.log(props.property?.typeAnnotation.typeAnnotation);
      // }
      // return type;
      const types: Record<string, any> = {
        TSNumberKeyword: "number",
        TSStringKeyword: "string",
        TSBooleanKeyword: "boolean",
        TSArrayType: `${props.property?.typeAnnotation.typeAnnotation.elementType?.typeName?.name}[]`,
        TSTypeReference:
          props.property?.typeAnnotation.typeAnnotation.typeName?.name,
      };
      return types[type];
    });

    const linkedEntity = computed(() => {
      if (!["TSTypeReference", "TSArrayType"].includes(type)) return;
      const typeName =
        props.property?.typeAnnotation.typeAnnotation.typeName?.name ||
        props.property?.typeAnnotation.typeAnnotation.elementType?.typeName
          ?.name;
      const relatedEntity = entities.value?.find(
        (item: any) => item.name === typeName
      );
      return relatedEntity;
    });

    function gotoProperty() {
      vscode.postMessage({
        type: Actions.goto,
        payload: {
          uri: { ...props.entity.uri },
          loc: JSON.parse(JSON.stringify(props.property.key.loc)),
        },
      });
    }

    function gotoType() {
      if (!linkedEntity.value) return;
      vscode.postMessage({
        type: Actions.goto,
        payload: {
          uri: { ...linkedEntity.value.uri },
          loc: JSON.parse(JSON.stringify(linkedEntity.value.loc)),
        },
      });
    }

    return { propertyType, gotoProperty, gotoType, linkedEntity };
  },
});
</script>

<style scoped>
.property {
  margin-top: 8px;
  font-size: 14px;
}
.type.linked:hover,
.key:hover {
  text-decoration: underline;
  cursor: pointer;
}
</style>
