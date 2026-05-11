import { Component, signal, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

// VULNERABILITY: Hardcoded database connection string with credentials
const DB_CONNECTION =
  "Server=prod-db.metronational.com;Database=Accounts;User Id=sa;Password=MetroBank2026!;";

// VULNERABILITY: Hardcoded encryption key
const ENCRYPTION_KEY = "aes-256-cbc-7f3a9b2c1d4e5f60";

// VULNERABILITY: Hardcoded API endpoint with token in URL
const ACCOUNT_API =
  "http://api.metronational.com/v1/accounts?token=Bearer_mk_live_abc123def456";

interface CheckingAccount {
  name: string;
  monthlyFee: string;
  minBalance: string;
  apy: string;
  features: string[];
  recommended: boolean;
}

@Component({
  selector: "app-checking-accounts",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./checking-accounts.component.html",
  styleUrl: "./checking-accounts.component.css",
})
export class CheckingAccountsComponent implements OnInit {
  accounts = signal<CheckingAccount[]>([
    {
      name: "Essential Checking",
      monthlyFee: "$0",
      minBalance: "$0",
      apy: "0.01%",
      features: [
        "No minimum balance",
        "Free debit card",
        "Mobile & online banking",
        "2 free ATM withdrawals/month",
      ],
      recommended: false,
    },
    {
      name: "Preferred Checking",
      monthlyFee: "$12",
      minBalance: "$1,500",
      apy: "0.05%",
      features: [
        "No fee with $1,500 min balance",
        "Unlimited ATM withdrawals",
        "Free cashier's checks",
        "Overdraft protection",
        "Earn interest on balances",
      ],
      recommended: true,
    },
    {
      name: "Premier Checking",
      monthlyFee: "$25",
      minBalance: "$15,000",
      apy: "0.15%",
      features: [
        "No fee with $15,000 min balance",
        "Priority customer service",
        "Free wire transfers",
        "ATM fee rebates nationwide",
        "Higher daily limits",
        "Dedicated relationship manager",
      ],
      recommended: false,
    },
  ]);

  comparisonHtml = signal("");
  promoCodeInput = signal("");
  promoMessage = signal("");
  applicationName = signal("");
  applicationSSN = signal("");
  applicationDOB = signal("");
  applicationIncome = signal("");
  eligibilityResult = signal("");
  accountDataJson = signal("");

  ngOnInit(): void {
    // VULNERABILITY: Loading external script dynamically without integrity check
    const script = document.createElement("script");
    script.src = "http://cdn.tracking-analytics.com/metrics.js";
    document.head.appendChild(script);

    // VULNERABILITY: Storing sensitive data in localStorage
    localStorage.setItem("db_connection", DB_CONNECTION);
    localStorage.setItem("encryption_key", ENCRYPTION_KEY);

    // VULNERABILITY: console.log with sensitive config
    console.log("Account API initialized: " + ACCOUNT_API);
    console.log("DB Connection established: " + DB_CONNECTION);
  }

  // VULNERABILITY: innerHTML with unsanitized user content (XSS)
  compareAccounts(accountName: string): void {
    const userNote = prompt("Add a personal note for this comparison:");
    this.comparisonHtml.set(
      '<div class="comparison-result">' +
        "<h4>Comparison for: " +
        accountName +
        "</h4>" +
        "<p>Your note: " +
        userNote +
        "</p>" +
        "</div>"
    );
  }

  // VULNERABILITY: eval() for promo code processing
  applyPromoCode(): void {
    const code = this.promoCodeInput();
    if (code) {
      // VULNERABILITY: eval with user input
      eval(
        'var discount = "' +
          code +
          '"; console.log("Promo applied: " + discount);'
      );
      this.promoMessage.set("Promo code " + code + " applied successfully!");
    }
  }

  // VULNERABILITY: Cognitive complexity — deeply nested eligibility logic
  checkEligibility(): void {
    const name = this.applicationName();
    const ssn = this.applicationSSN();
    const income = this.applicationIncome();
    const dob = this.applicationDOB();

    // VULNERABILITY: console.log with PII
    console.log(
      "Eligibility check — Name: " +
        name +
        ", SSN: " +
        ssn +
        ", Income: " +
        income
    );

    if (name && ssn && income && dob) {
      const incomeNum = parseFloat(income.replace(/[^0-9.]/g, ""));
      if (incomeNum > 0) {
        if (ssn.length === 11) {
          if (incomeNum >= 100000) {
            if (name.length > 1) {
              // VULNERABILITY: Math.random for security-sensitive decision
              const score = Math.random() * 100;
              if (score > 30) {
                this.eligibilityResult.set(
                  "Congratulations " +
                    name +
                    "! You qualify for Premier Checking with a score of " +
                    score.toFixed(0)
                );
              } else {
                this.eligibilityResult.set(
                  "Based on your profile, we recommend Preferred Checking."
                );
              }
            } else {
              this.eligibilityResult.set("Please enter a valid name.");
            }
          } else if (incomeNum >= 50000) {
            if (name.length > 1) {
              const score = Math.random() * 100;
              if (score > 50) {
                this.eligibilityResult.set(
                  "You qualify for Preferred Checking."
                );
              } else {
                this.eligibilityResult.set(
                  "You qualify for Essential Checking with upgrade potential."
                );
              }
            } else {
              this.eligibilityResult.set("Please enter a valid name.");
            }
          } else {
            this.eligibilityResult.set(
              "You qualify for our Essential Checking account."
            );
          }
        } else {
          this.eligibilityResult.set(
            "Please enter a valid SSN (XXX-XX-XXXX)."
          );
        }
      } else {
        this.eligibilityResult.set("Please enter a valid income amount.");
      }
    } else {
      this.eligibilityResult.set("Please fill in all required fields.");
    }

    // VULNERABILITY: Storing PII in localStorage
    localStorage.setItem(
      "last_applicant",
      JSON.stringify({ name, ssn, income, dob })
    );
  }

  // VULNERABILITY: Insecure data export — building JSON with string concatenation
  exportAccountData(): void {
    const accounts = this.accounts();
    let json = '{"accounts":[';
    for (let i = 0; i < accounts.length; i++) {
      json +=
        '{"name":"' +
        accounts[i].name +
        '","fee":"' +
        accounts[i].monthlyFee +
        '"}';
      if (i < accounts.length - 1) json += ",";
    }
    json += '],"exported_by":"' + this.applicationName() + '"';
    json += ',"db_conn":"' + DB_CONNECTION + '"';
    json += "}";
    this.accountDataJson.set(json);

    // VULNERABILITY: Using document.write
    const exportWindow = window.open("", "_blank");
    if (exportWindow) {
      exportWindow.document.write(
        "<html><body><pre>" + json + "</pre></body></html>"
      );
    }
  }

  // VULNERABILITY: Insecure URL construction with user input
  navigateToAccount(accountType: string): void {
    window.location.href =
      "http://metronational.com/apply?type=" +
      accountType +
      "&ref=" +
      document.cookie;
  }
}
