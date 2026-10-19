import { Component, inject, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {
  AdminToolsService,
  CustomerSummary,
  REPORT_TYPES,
  ReviewQueueItem,
} from "./admin-tools.service";

type Panel = "customers" | "reports" | "review";

@Component({
  selector: "app-admin-tools",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./admin-tools.component.html",
  styleUrl: "./admin-tools.component.css",
})
export class AdminToolsComponent {
  private readonly api = inject(AdminToolsService);

  readonly panel = signal<Panel>("customers");
  readonly segments = ["", "Personal", "Student", "Business", "Corporate", "Wealth"];
  readonly reportTypes = REPORT_TYPES;

  query = "";
  segment = "";
  asOf = "";
  selectedReport: string = REPORT_TYPES[0].id;

  readonly customers = signal<CustomerSummary[]>([]);
  readonly queue = signal<ReviewQueueItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal("");
  readonly searched = signal(false);

  show(panel: Panel): void {
    this.panel.set(panel);
    if (panel === "review" && this.queue().length === 0) {
      this.loadQueue();
    }
  }

  search(): void {
    this.loading.set(true);
    this.error.set("");
    this.api.searchCustomers(this.query.trim(), this.segment).subscribe({
      next: (page) => {
        this.customers.set(page.items);
        this.searched.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Customer search is unavailable right now.");
        this.loading.set(false);
      },
    });
  }

  loadQueue(): void {
    this.loading.set(true);
    this.api.reviewQueue().subscribe({
      next: (items) => {
        this.queue.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.error.set("Review queue is unavailable right now.");
        this.loading.set(false);
      },
    });
  }

  exportHref(): string {
    return this.api.exportUrl(this.selectedReport, this.asOf);
  }

  riskClass(tier: string): string {
    switch (tier) {
      case "High":
        return "risk-high";
      case "Elevated":
        return "risk-elevated";
      case "Dormant":
        return "risk-dormant";
      default:
        return "risk-standard";
    }
  }
}
