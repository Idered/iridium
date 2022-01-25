<template>
  <div v-if="isValidatingConfig"></div>
  <div v-else-if="config" class="container">
    <template v-if="!currentProjectId">
      <h2 class="title">Projects</h2>
      <ProjectList :projects="projects" @select="currentProjectId = $event" />
    </template>
    <template v-else-if="currentProjectId">
      <h2 class="title">{{ project.name }}</h2>
    </template>
    <!-- <div>
      <template v-if="config.secrets.vercel">
        <div class="content" v-if="directories && projects">
          <div class="input-container">
            <label class="label">Directory</label>
            <SelectInput
              id="directory"
              v-if="directories.length"
              v-model="currentDirectory"
              :options="directories"
            />
          </div>
          <div class="input-container">
            <label class="label">Target project</label>
            <SelectInput
              id="project"
              v-if="projects.length"
              v-model="targetProject"
              :options="projectOptions"
            />
          </div>
          <Button @click="deploy">Deploy with Vercel</Button>
          <div class="deployments">
            <label class="label" for="deployments">Deployments</label>
            <div class="deployments__list" id="deployments">
              <a
                class="deployments__item"
                v-for="deployment in deployments"
                :href="`https://${deployment.url}`"
              >
                <div>{{ deployment.url }}</div>
                <div>{{ deployment.target }}</div>
                <div>{{ deployment.state }}</div>
              </a>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <a :href="authUrl" @click="listenForSignUp">
          <Button tabindex="-1">Sign in</Button>
        </a>
      </template>
    </div> -->
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, Ref, watch } from "vue";
import { API } from "../api";
import { VSCode } from "@shared/helpers/use-vscode";
import { computed } from "vue";
import { v4 } from "uuid";
import { ref } from "vue";
import { useBackgroundEvent, useConfigRoot, usePusher } from "@/utils";
import Button from "@shared/components/Button.vue";
import SelectInput from "@/components/SelectInput.vue";
import useSWRV from "swrv";
import { BackgroundEvents } from "../enums";
import { VercelDeployment, VercelProject } from "../vercel";
import ProjectList from "@/components/ProjectList.vue";

const useVercelAuth = () => {
  const pusher = usePusher();
  const uuid = ref(v4());
  const authUrl = computed(() => {
    return `${import.meta.env.VITE_VERCEL_APP_URL}?state=${uuid.value}`;
  });
  const listenForSignUp = () => {
    const channel = pusher.subscribe(uuid.value);
    channel.bind("message", async function (data: any) {
      await API.setAccessToken(data.accessToken);
      channel.unsubscribe();
    });
  };
  return { listenForSignUp, authUrl };
};

const useDirectories = () => {
  const vscode = inject<VSCode>("vscode") as VSCode;
  const currentDirectory = ref<string>("");
  const { data: directories } = useSWRV<string[]>(
    "/directories",
    vscode.fetch.get
  );
  watch(directories, (current, prev) => {
    currentDirectory.value = current?.[0] || "";
  });
  return { currentDirectory, directories };
};

const useDeployments = (projectId: Ref<string | undefined>) => {
  const vscode = inject<VSCode>("vscode") as VSCode;
  const { data: deployments, mutate } = useSWRV<VercelDeployment[]>(
    () =>
      projectId.value
        ? `/vercel/projects/${projectId.value}/deployments`
        : null,
    vscode.fetch.get
  );

  useBackgroundEvent(BackgroundEvents.VercelDeploymentStatusChanged, () => {
    mutate();
  });

  return deployments;
};

const useProjects = () => {
  const vscode = inject<VSCode>("vscode") as VSCode;
  const { data } = useSWRV<{
    projects: VercelProject[];
    pagination: { count: number; next: number; prev: number };
  }>("/vercel/projects", vscode.fetch.get);
  const projects = computed(() => data.value?.projects);
  return projects;
};

const useConfig = () => {
  const vscode = inject<VSCode>("vscode") as VSCode;
  return useSWRV<{
    secrets: {
      vercel?: string;
    };
  }>("/config", vscode.fetch.get);
};

const useVercel = ({ projectId }: { projectId: Ref<string | undefined> }) => {
  const projects = useProjects();
  const deployments = useDeployments(projectId);

  return { deployments, projects };
};

const useRouter = () => {
  enum View {
    ProjectList,
    ProjectDetails,
  }
  const view = ref<View>(View.ProjectList);
  const navigate = (nextView: View) => {
    view.value = nextView;
  };
  return { view, View, navigate };
};

export default defineComponent({
  name: "VercelView",
  components: { Button, SelectInput, ProjectList },
  setup() {
    const vscode = inject<VSCode>("vscode") as VSCode;
    API.setVSCode(vscode);
    const currentProjectId = ref<string>();
    const targetProject = ref<string>();
    const { data: config, isValidating: isValidatingConfig } = useConfig();
    const directories = useDirectories();
    const { deployments, projects } = useVercel({
      projectId: targetProject,
    });
    const projectOptions = computed(() => {
      if (!projects.value) return [];
      return projects.value.map((project) => ({
        name: project.name,
        value: project.id,
      }));
    });
    const deploy = () => {
      const directory = directories.currentDirectory.value;
      vscode.fetch.post(`/vercel/deploy`, { directory });
    };
    const project = computed(() => {
      if (!projects.value) return;
      return projects.value.find(
        (project) => project.id === currentProjectId.value
      );
    });
    return {
      config,
      deploy,
      project,
      currentProjectId,
      targetProject,
      projectOptions,
      isValidatingConfig,
      projects,
      deployments,
      ...directories,
      ...useRouter(),
      ...useVercelAuth(),
    };
  },
});
</script>

<style scoped>
.container {
  padding: 0.75rem;
}

.content {
  display: grid;
  row-gap: 1rem;
  height: 100vh;
  overflow: hidden;
  align-content: flex-start;
}

.title {
  text-transform: uppercase;
  font-size: 11px;
  opacity: 0.9;
  font-weight: 600;
}

.input-container {
  display: grid;
  row-gap: 0.25rem;
}

.deployments {
  row-gap: 0.25rem;
}

.deployments,
.deployments__list {
  height: 100%;
  overflow: auto;
  display: grid;
}

.deployments__list {
  display: grid;
  row-gap: 0.5rem;
}

.deployments__item {
  text-decoration: none;
  color: var(--vscode-foreground);
}

.deployments__item:hover {
  background: var(--vscode-list-hoverBackground);
}
</style>
