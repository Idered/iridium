<script setup lang="ts">
import CoffeeIcon from "./CoffeeIcon.vue";
import TwitterIcon from "./TwitterIcon.vue";
import ReviewIcon from "./ReviewIcon.vue";
import IssueIcon from "./IssueIcon.vue";
import { useStore } from "../../lib/store";
import { View } from "../../enums";
import { API } from "../../lib/api";

const store = useStore();
</script>

<template>
  <div class="content mt-2 max-w-[270px] mx-auto">
    <div class="mb-4 gap-4 grid justify-items-center text-center">
      <a href="http://github.com/idered" class="img-link" tabindex="-1">
        <div class="blob"></div>
        <img
          class="img"
          width="64"
          height="64"
          src="https://avatars.githubusercontent.com/u/230404?u=219226b4088bd97c474d8a9d9c3fac55ea4bf9e7&v=4"
          alt=""
        />
      </a>
      <div>
        <p>Hey, I'm Kasper 👋</p>
        <p class="mt-4">
          I would greatly appreciate your support through one of the following
          actions:
        </p>
      </div>
    </div>

    <ul class="list">
      <li>
        <CoffeeIcon />
        <a href="https://www.buymeacoffee.com/idered">Buy me a coffee</a>
      </li>
      <li>
        <TwitterIcon />
        <a href="https://twitter.com/Idered">Follow me on Twitter</a>
      </li>
      <li>
        <ReviewIcon />
        <a href="https://marketplace.visualstudio.com/items?itemName=idered.npm"
          >Leave review</a
        >
      </li>
      <li>
        <IssueIcon />
        <a href="https://github.com/Idered/iridium/issues">Leave feedback</a>
      </li>
    </ul>

    <p class="mt-4 text-center">
      Or just
      <a
        class="font-bold"
        @click="
          () => {
            API.hideSupportIcon();
            store.commit('navigate', View.Manage);
          }
        "
        >click here</a
      >
      to hide support icon and return to list view.
    </p>
  </div>
</template>

<style scoped>
.title {
  font-size: var(--vscode-font-size);
  text-transform: uppercase;
  letter-spacing: 0.025rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}
.content {
  padding: 0.25rem 0.75rem;
}

.img-link {
  flex-shrink: 0;
}
.img {
  border-radius: 100rem;
  display: inline-block;
}

.goal {
  font-weight: 400;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
}
.separator {
  border: none;
  border-top: 1px solid var(--vscode-input-border);
  margin: 1rem 0;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  row-gap: 0.75rem;
}
.list__icon {
  position: relative;
  top: 0.2rem;
  flex-shrink: 0;
  /* color: var(--vscode-editorLightBulb-foreground); */
}
.list__icon.unlocked {
  color: var(--vscode-editorLightBulb-foreground);
}
.list__meta {
  grid-column: 2;
  font-size: 12px;
  color: var(--vscode-descriptionForeground);
}

.notice {
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 400;
  font-size: 14px;
  text-align: center;
  max-width: 200px;
  margin: 0 auto;
}

.list li {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: flex-start;
  line-height: 1.075rem;
  column-gap: 0.5rem;
  row-gap: 0.125rem;
}

.list a {
  color: var(--vscode-textLink-foreground);
}
.list a:hover {
  text-decoration: underline;
}

.button {
  cursor: pointer;
  font-family: inherit;
  display: block;
  width: 100%;
  height: 2rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border: none;
  background: transparent;
  font-weight: 500;
  text-transform: uppercase;
  color: var(--vscode-panel-foreground);
  border: 1px solid var(--vscode-input-border);
}
.button:hover {
  color: var(--vscode-textPreformat-foreground);
  background: none;
}
.button:focus {
  outline: transparent;
  border-color: var(--vscode-focusBorder);
}
</style>
