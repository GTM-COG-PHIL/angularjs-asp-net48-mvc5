import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "get-started",
    loadComponent: () =>
      import("./pages/get-started/get-started.component").then(
        (m) => m.GetStartedComponent
      ),
  },
];
