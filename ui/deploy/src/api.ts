import { VSCode } from "@shared/helpers/use-vscode";

export class API {
  // private static async request<Response>(url: string, options?: RequestInit) {
  //   const response = await fetch(url, options);
  //   const json = await response.json();
  //   return json as unknown as Response;
  // }
  private static vscode: VSCode;
  static setVSCode(vscode: VSCode) {
    API.vscode = vscode;
  }
  static setAccessToken(accessToken: string) {
    return API.vscode.fetch.post<unknown>("/secrets", {
      key: "accessToken",
      value: accessToken,
    });
  }
  static getConfig() {
    type Result = {
      secrets: {
        vercel?: string;
      };
    };
    return API.vscode.fetch.get<Result>("/config");
  }
}
