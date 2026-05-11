import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "checking-accounts",
    loadComponent: () =>
      import("./pages/checking-accounts/checking-accounts.component").then(
        (m) => m.CheckingAccountsComponent
      ),
  },
];
