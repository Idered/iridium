<template>
  <div class="content">
    <div class="intro">
      <a href="http://github.com/idered" class="img-link" tabindex="-1">
        <div class="blob"></div>
        <img
          class="img"
          width="32"
          height="32"
          src="https://avatars.githubusercontent.com/u/230404?u=219226b4088bd97c474d8a9d9c3fac55ea4bf9e7&v=4"
          alt=""
        />
      </a>
      <p>
        Hey, I'm Kasper - author of Iridium extensions. By upgrading you will
        help me to go full time on open source.
      </p>
    </div>

    <ProgressBar :value="2500" />
    <div class="goal">25% towards $10,000 goal</div>

    <hr class="separator" />
    <p class="notice">All pro features are enabled during beta. Enjoy!</p>
    <hr class="separator" />
    <h2 class="title">Features</h2>
    <ul class="feature-list">
      <li>
        <StarIcon class="feature-list__icon" :height="11" />
        <span>Automatically install type definitions</span>
      </li>
      <li>
        <StarIcon class="feature-list__icon" :height="11" />
        <span>Detect unused dependencies</span>
      </li>
      <li>
        <StarIcon class="feature-list__icon" :height="11" />
        <span>Scan your project for vulnerabilities</span>
      </li>
      <li>
        <StarIcon class="feature-list__icon" :height="11" />
        <span>Access to pro features in all Iridium extensions</span>
      </li>
    </ul>

    <a href="https://github.com/sponsors/idered" class="button">
      Unlock features
    </a>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import StarIcon from "../icons/StarIcon.vue";
import ProgressBar from "../ProgressBar.vue";

export default defineComponent({
  name: "SupportViewContent",
  components: {
    StarIcon,
    ProgressBar,
  },
});
</script>
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

.intro {
  display: flex;
  align-items: flex-start;
  column-gap: 1rem;
  margin-bottom: 1rem;
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

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  row-gap: 0.75rem;
}
.feature-list__icon {
  position: relative;
  top: 0.2rem;
  flex-shrink: 0;
  /* color: var(--vscode-editorLightBulb-foreground); */
}
.feature-list__icon.unlocked {
  color: var(--vscode-editorLightBulb-foreground);
}
.feature-list__meta {
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

.feature-list li {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: flex-start;
  line-height: 1.075rem;
  column-gap: 0.5rem;
  row-gap: 0.125rem;
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
