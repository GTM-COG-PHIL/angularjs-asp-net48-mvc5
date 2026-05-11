import { Component, VERSION } from "@angular/core";

@Component({
  selector: "app-test-directive",
  standalone: true,
  template: `<div
    data-testid="angular-version-directive"
    class="test-directive"
  >
    Angular Version: {{ version }}
  </div>`,
})
export class TestDirectiveComponent {
  version = VERSION.full;

  constructor() {
    console.info("test-directive initialized...");
  }
}
