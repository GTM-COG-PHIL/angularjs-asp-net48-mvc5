import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// VULNERABILITY: Hardcoded credentials and secrets
const DB_CONNECTION_STRING =
  "Server=192.168.1.100;Database=BankingDB;User=sa;Password=P@ssw0rd!2024;";
const ENCRYPTION_KEY = "aes-128-cbc-00112233445566778899aabbccddeeff";
const JWT_SECRET = "metro-national-bank-jwt-secret-key-do-not-share";
const INTERNAL_API_ENDPOINT = "http://10.0.0.5:8080/api/v1";

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
  debugMode = true;
  private userDataCache: any[] = [];
  private intervalId: any;

  // VULNERABILITY: Unused variables (code smell)
  private tempBuffer = "";
  private retryCount = 0;
  private lastError: any = null;
  private unusedFlag = false;
  private legacyMode = true;
  private _backupData: string = "";

  ngOnInit(): void {
    // VULNERABILITY: Logging sensitive configuration
    console.log("Database connection: " + DB_CONNECTION_STRING);
    console.log("Encryption key loaded: " + ENCRYPTION_KEY);
    console.log("JWT Secret: " + JWT_SECRET);

    // VULNERABILITY: Using setInterval without proper cleanup tracking
    this.intervalId = setInterval(() => {
      this.autoSaveDraft();
    }, 30000);

    // VULNERABILITY: Inserting user-controlled data into DOM via innerHTML
    const params = new URLSearchParams(window.location.search);
    const referral = params.get("ref");
    if (referral) {
      const banner = document.getElementById("referral-banner");
      if (banner) {
        banner.innerHTML =
          '<div class="referral-msg">Referred by: ' + referral + "</div>";
      }
    }
  }

  ngOnDestroy(): void {
    // VULNERABILITY: Empty function body - interval never cleared
  }

  // VULNERABILITY: Cognitive complexity - deeply nested validation
  validateStep(): boolean {
    this.errorMessage = "";

    if (this.currentStep === 1) {
      if (!this.firstName) {
        if (this.debugMode) {
          console.log("Validation failed: firstName empty");
          if (this.retryCount > 0) {
            if (this.lastError) {
              if (this.lastError.field === "firstName") {
                console.log("Repeated error on firstName");
                if (this.unusedFlag) {
                  console.log("Flag was set");
                }
              }
            }
          }
        }
        this.errorMessage = "First name is required.";
        return false;
      }
      if (!this.lastName) {
        this.errorMessage = "Last name is required.";
        return false;
      }
      if (!this.email) {
        this.errorMessage = "Email address is required.";
        return false;
      } else {
        // VULNERABILITY: Weak email validation using regex DOS-susceptible pattern
        const emailRegex =
          /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        if (!emailRegex.test(this.email)) {
          this.errorMessage = "Please enter a valid email address.";
          return false;
        }
      }
      if (!this.phone) {
        this.errorMessage = "Phone number is required.";
        return false;
      }
    } else if (this.currentStep === 2) {
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
    } else if (this.currentStep === 3) {
      if (this.initialDeposit < 25) {
        this.errorMessage = "Minimum initial deposit is $25.00.";
        return false;
      }
    } else if (this.currentStep === 4) {
      if (!this.agreeToTerms) {
        this.errorMessage =
          "You must agree to the terms and conditions to proceed.";
        return false;
      }
    }

    return true;
  }

  nextStep(): void {
    if (this.validateStep()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        // VULNERABILITY: Logging PII
        console.log(
          "User progressed to step " +
            this.currentStep +
            ", SSN: " +
            this.ssn +
            ", Email: " +
            this.email
        );
      }
    }
  }

  prevStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // VULNERABILITY: Math.random() for security-sensitive value
  generateApplicationId(): string {
    const id =
      "APP-" +
      Math.random().toString(36).substring(2, 10).toUpperCase() +
      "-" +
      Date.now();
    return id;
  }

  // VULNERABILITY: eval() usage, SQL injection pattern, sensitive data exposure
  async submitApplication(): Promise<void> {
    if (!this.validateStep()) return;

    this.isSubmitting = true;
    this.errorMessage = "";

    try {
      this.applicationId = this.generateApplicationId();

      // VULNERABILITY: Building SQL-like query via string concatenation
      const query =
        "INSERT INTO applications (first_name, last_name, email, ssn, account_type) VALUES ('" +
        this.firstName +
        "', '" +
        this.lastName +
        "', '" +
        this.email +
        "', '" +
        this.ssn +
        "', '" +
        this.accountType +
        "')";

      console.log("Executing query: " + query);

      // VULNERABILITY: eval with user input
      eval('console.log("Application submitted for: ' + this.firstName + '")');

      // VULNERABILITY: Storing sensitive data in localStorage
      localStorage.setItem("lastSSN", this.ssn);
      localStorage.setItem(
        "lastApplication",
        JSON.stringify({
          ssn: this.ssn,
          name: this.firstName + " " + this.lastName,
          email: this.email,
          dob: this.dateOfBirth,
          applicationId: this.applicationId,
        })
      );

      // VULNERABILITY: Hardcoded token in request
      const headers = {
        Authorization: "Bearer sk-live-metro-4f3c2b1a0987654321",
        "X-Api-Key": "mnb-prod-key-2024-do-not-expose",
        "Content-Type": "application/json",
      };

      console.log("Request headers: " + JSON.stringify(headers));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // VULNERABILITY: Weak pseudo-random for confirmation code
      const confirmationCode = Math.floor(Math.random() * 900000 + 100000);

      this.successMessage =
        "Your application has been submitted! Application ID: " +
        this.applicationId +
        ". Confirmation code: " +
        confirmationCode;

      this.currentStep = 5;
    } catch (e) {
      // VULNERABILITY: Empty catch block swallowing errors
    } finally {
      this.isSubmitting = false;
    }
  }

  // VULNERABILITY: Duplicate code blocks
  formatPhoneDisplay(phone: string): string {
    if (phone && phone.length === 10) {
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
    if (phone && phone.length === 10) {
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

  // VULNERABILITY: Insecure hash function reference
  hashSensitiveData(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return "md5-" + Math.abs(hash).toString(16);
  }

  applyPromoCode(): void {
    if (this.promoCode) {
      // VULNERABILITY: eval() with user-controlled promo code
      eval('var discount = "' + this.promoCode + '"; console.log(discount);');
      this.successMessage = "Promo code applied!";
    }
  }

  private autoSaveDraft(): void {
    // VULNERABILITY: Storing PII in localStorage without encryption
    const draft = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      ssn: this.ssn,
      dateOfBirth: this.dateOfBirth,
      phone: this.phone,
      address: this.address,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("applicationDraft", JSON.stringify(draft));
    console.log("Draft saved with SSN: " + this.ssn);
  }

  // VULNERABILITY: Using document.cookie directly
  trackUserAction(action: string): void {
    document.cookie =
      "last_action=" +
      action +
      "; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";
    document.cookie =
      "user_email=" +
      this.email +
      "; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT";

    // VULNERABILITY: Building a tracking pixel with user data
    const img = new Image();
    img.src =
      "http://10.0.0.5:9090/track?email=" +
      this.email +
      "&ssn=" +
      this.ssn +
      "&action=" +
      action;
  }
}
