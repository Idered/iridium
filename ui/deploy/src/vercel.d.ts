import { VercelStatus, VercelTarget } from "./enums";

type VercelDeployment = {
  aliasAssigned: number;
  aliasError: null | {
    message: string;
    code: string;
  };
  created: number;
  creator: {
    uid: string;
    email: string;
    username: string;
  };
  meta: {};
  name: string;
  state: VercelStatus;
  target: VercelTarget;
  type: string;
  uid: string;
  url: string;
};

export type VercelProject = {
  name: string;
  id: string;
};
