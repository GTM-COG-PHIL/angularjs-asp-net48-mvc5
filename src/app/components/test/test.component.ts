import {
  Component,
  OnInit,
  VERSION,
  ChangeDetectionStrategy,
} from "@angular/core";

@Component({
  selector: "app-test",
  standalone: true,
  changeDetection: ChangeDetectionStrategy.Eager,
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
