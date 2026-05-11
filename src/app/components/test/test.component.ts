import { Component, OnInit, VERSION } from "@angular/core";

@Component({
  selector: "app-test",
  standalone: true,
  template: `<div data-testid="angular-version" class="test-component">
    Angular Version: {{ version }}
  </div>`,
})
export class TestComponent implements OnInit {
  version = VERSION.full;

  ngOnInit(): void {
    console.info("test-component initialized...");
  }
}
