import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

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
export class CheckingAccountsComponent {
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

  applyPromoCode(): void {
    const code = this.promoCodeInput();
    if (code) {
      this.promoMessage.set("Promo code " + code + " applied successfully!");
    }
  }

  checkEligibility(): void {
    const name = this.applicationName();
    const ssn = this.applicationSSN();
    const income = this.applicationIncome();
    const dob = this.applicationDOB();

    if (!name || !ssn || !income || !dob) {
      this.eligibilityResult.set("Please fill in all required fields.");
      return;
    }

    const incomeNum = Number.parseFloat(income.replace(/[^0-9.]/g, ""));

    if (incomeNum <= 0) {
      this.eligibilityResult.set("Please enter a valid income amount.");
      return;
    }

    if (ssn.length !== 11) {
      this.eligibilityResult.set("Please enter a valid SSN (XXX-XX-XXXX).");
      return;
    }

    if (name.length <= 1) {
      this.eligibilityResult.set("Please enter a valid name.");
      return;
    }

    this.eligibilityResult.set(this.determineAccountTier(name, incomeNum));
  }

  private determineAccountTier(name: string, incomeNum: number): string {
    if (incomeNum >= 100000) {
      const score = Math.random() * 100;
      if (score > 30) {
        return (
          "Congratulations " +
          name +
          "! You qualify for Premier Checking with a score of " +
          score.toFixed(0)
        );
      }
      return "Based on your profile, we recommend Preferred Checking.";
    }

    if (incomeNum >= 50000) {
      const score = Math.random() * 100;
      if (score > 50) {
        return "You qualify for Preferred Checking.";
      }
      return "You qualify for Essential Checking with upgrade potential.";
    }

    return "You qualify for our Essential Checking account.";
  }

  exportAccountData(): void {
    const accounts = this.accounts();
    const exportData = {
      accounts: accounts.map((a) => ({ name: a.name, fee: a.monthlyFee })),
      exported_by: this.applicationName(),
    };
    const json = JSON.stringify(exportData);
    this.accountDataJson.set(json);

    const exportWindow = globalThis.open("", "_blank");
    if (exportWindow) {
      const pre = exportWindow.document.createElement("pre");
      pre.textContent = json;
      exportWindow.document.body.appendChild(pre);
    }
  }

  navigateToAccount(accountType: string): void {
    globalThis.location.href =
      "http://metronational.com/apply?type=" + encodeURIComponent(accountType);
  }
}
