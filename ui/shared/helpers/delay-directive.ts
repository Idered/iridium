import { Directive } from "vue";

export const delayDirective: Directive = {
  mounted(_el, instance, node) {
    setTimeout(node.props?.callback, instance.value || 3000);
  },
};
