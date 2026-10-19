import { Component, VERSION, ChangeDetectionStrategy } from "@angular/core";

@Component({
  selector: "app-test-directive",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
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
