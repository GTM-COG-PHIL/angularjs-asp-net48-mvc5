import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

import { App } from "./app";
import { TestComponent } from "./components/test/test.component";
import { TestDirectiveComponent } from "./components/test-directive/test-directive.component";
import { LoginModalComponent } from "./components/login-modal/login-modal.component";
import { routes } from "./app.routes";

@NgModule({
  declarations: [App],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    TestComponent,
    TestDirectiveComponent,
    LoginModalComponent,
  ],
  providers: [provideHttpClient()],
  bootstrap: [App],
})
export class AppModule {}
