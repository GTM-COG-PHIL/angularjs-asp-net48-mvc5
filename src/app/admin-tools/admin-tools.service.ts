import { Injectable, inject } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

export interface CustomerSummary {
  id: number;
  name: string;
  email: string;
  segment: string;
  branch: string;
  balance: number;
  daysSinceLastLogin: number;
  kycVerified: boolean;
  riskTier: string;
}

export interface CustomerPage {
  page: number;
  pageSize: number;
  items: CustomerSummary[];
}

export interface ReviewQueueItem {
  Id: string;
  Title: string;
  Category: string;
  Severity: string;
  Component: string;
  Status: string;
  Summary: string;
}

export const REPORT_TYPES = [
  { id: "balances", label: "Balances by customer" },
  { id: "dormant", label: "Dormant accounts (>365 days)" },
  { id: "kyc", label: "KYC outstanding" },
] as const;

@Injectable({ providedIn: "root" })
export class AdminToolsService {
  private readonly http = inject(HttpClient);

  searchCustomers(query: string, segment: string): Observable<CustomerPage> {
    let params = new HttpParams();
    if (query) {
      params = params.set("q", query);
    }
    if (segment) {
      params = params.set("segment", segment);
    }
    return this.http.get<CustomerPage>("/admin/api/customers", { params });
  }

  reviewQueue(): Observable<ReviewQueueItem[]> {
    return this.http.get<ReviewQueueItem[]>("/admin/api/reviewqueue");
  }

  exportUrl(reportType: string, asOf: string): string {
    const safeType = REPORT_TYPES.some((r) => r.id === reportType)
      ? reportType
      : REPORT_TYPES[0].id;
    const params = asOf ? "?asOf=" + encodeURIComponent(asOf) : "";
    return "/admin/api/export/" + safeType + params;
  }
}
