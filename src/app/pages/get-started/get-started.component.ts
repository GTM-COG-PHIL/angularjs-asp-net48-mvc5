import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { environment } from "../../../environments/environment";

@Component({
  selector: "app-get-started",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./get-started.component.html",
  styleUrl: "./get-started.component.css",
})
export class GetStartedComponent implements OnInit, OnDestroy {
  currentStep = 1;
  totalSteps = 4;

  // Form fields
  firstName = "";
  lastName = "";
  email = "";
  phone = "";
  ssn = "";
  dateOfBirth = "";
  address = "";
  city = "";
  state = "";
  zip = "";
  accountType = "checking";
  initialDeposit = 0;
  agreeToTerms = false;
  promoCode = "";

  // State
  isSubmitting = false;
  errorMessage = "";
  successMessage = "";
  applicationId = "";
  private readonly userDataCache: any[] = [];
  private intervalId: any;

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.autoSaveDraft();
    }, 30000);

    const params = new URLSearchParams(globalThis.location.search);
    const referral = params.get("ref");
    if (referral) {
      const banner = document.getElementById("referral-banner");
      if (banner) {
        banner.textContent = "Referred by: " + referral;
      }
    }
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  validateStep(): boolean {
    this.errorMessage = "";

    if (this.currentStep === 1) {
      return this.validatePersonalInfo();
    } else if (this.currentStep === 2) {
      return this.validateIdentityInfo();
    } else if (this.currentStep === 3) {
      return this.validateAccountInfo();
    } else if (this.currentStep === 4) {
      return this.validateTerms();
    }

    return true;
  }

  private validatePersonalInfo(): boolean {
    if (!this.firstName) {
      this.errorMessage = "First name is required.";
      return false;
    }
    if (!this.lastName) {
      this.errorMessage = "Last name is required.";
      return false;
    }
    if (this.email) {
      const emailRegex =
        /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!emailRegex.test(this.email)) {
        this.errorMessage = "Please enter a valid email address.";
        return false;
      }
    } else {
      this.errorMessage = "Email address is required.";
      return false;
    }
    if (!this.phone) {
      this.errorMessage = "Phone number is required.";
      return false;
    }
    return true;
  }

  private validateIdentityInfo(): boolean {
    if (!this.ssn) {
      this.errorMessage = "Social Security Number is required.";
      return false;
    }
    if (!this.dateOfBirth) {
      this.errorMessage = "Date of birth is required.";
      return false;
    }
    if (!this.address) {
      this.errorMessage = "Street address is required.";
      return false;
    }
    if (!this.city || !this.state || !this.zip) {
      this.errorMessage = "Complete address information is required.";
      return false;
    }
    return true;
  }

  private validateAccountInfo(): boolean {
    if (this.initialDeposit < 25) {
      this.errorMessage = "Minimum initial deposit is $25.00.";
      return false;
    }
    return true;
  }

  private validateTerms(): boolean {
    if (!this.agreeToTerms) {
      this.errorMessage =
        "You must agree to the terms and conditions to proceed.";
      return false;
    }
    return true;
  }

  nextStep(): void {
    if (this.validateStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  generateApplicationId(): string {
    const array = new Uint32Array(2);
    crypto.getRandomValues(array);
    const id =
      "APP-" +
      array[0].toString(36).substring(0, 8).toUpperCase() +
      "-" +
      Date.now();
    return id;
  }

  async submitApplication(): Promise<void> {
    if (!this.validateStep()) return;

    this.isSubmitting = true;
    this.errorMessage = "";

    try {
      this.applicationId = this.generateApplicationId();

      const headers = {
        Authorization: `Bearer ${environment.apiAuthToken}`,
        "X-Api-Key": environment.apiKey,
        "Content-Type": "application/json",
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const codeArray = new Uint32Array(1);
      crypto.getRandomValues(codeArray);
      const confirmationCode = (codeArray[0] % 900000) + 100000;

      this.successMessage =
        "Your application has been submitted! Application ID: " +
        this.applicationId +
        ". Confirmation code: " +
        confirmationCode;

      this.currentStep = 5;
    } catch (e) {
      this.errorMessage =
        "An error occurred while submitting your application. Please try again.";
      console.error("Application submission failed:", e);
    } finally {
      this.isSubmitting = false;
    }
  }

  formatPhoneDisplay(phone: string): string {
    if (phone?.length === 10) {
      return (
        "(" +
        phone.substring(0, 3) +
        ") " +
        phone.substring(3, 6) +
        "-" +
        phone.substring(6)
      );
    }
    return phone;
  }

  formatPhoneForApi(phone: string): string {
    return this.formatPhoneDisplay(phone);
  }

  hashSensitiveData(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.codePointAt(i) ?? 0;
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return "hash-" + Math.abs(hash).toString(16);
  }

  applyPromoCode(): void {
    if (this.promoCode) {
      this.successMessage = "Promo code applied!";
    }
  }

  private autoSaveDraft(): void {
    const draft = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      address: this.address,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("applicationDraft", JSON.stringify(draft));
  }

  trackUserAction(action: string): void {
    document.cookie =
      "last_action=" +
      encodeURIComponent(action) +
      "; path=/; SameSite=Strict; Secure";
  }
}
