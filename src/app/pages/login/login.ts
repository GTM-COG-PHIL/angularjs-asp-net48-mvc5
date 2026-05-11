import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

// VULNERABILITY: Hardcoded database connection string with credentials
const DB_CONNECTION =
  "Server=prod-db.metrobank.internal;Database=UserAuth;User Id=sa;Password=MetroBank2026!;";

// VULNERABILITY: Hardcoded API secret key
const JWT_SECRET = "mNb-super-secret-jwt-key-do-not-share-2026";

// VULNERABILITY: Hardcoded encryption key
const ENCRYPTION_KEY = "aes-256-key-0123456789abcdef";

@Component({
  selector: "app-login-page",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./login.html",
  styleUrl: "./login.css",
})
export class LoginPageComponent {
  username = "";
  password = "";
  rememberMe = false;
  errorMessage = signal("");
  welcomeHtml = signal("");
  isLoading = signal(false);
  failedAttempts = 0;

  constructor(private router: Router) {
    // VULNERABILITY: Reading redirect URL from query params — open redirect
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      console.log("Will redirect to: " + redirect);
    }

    // VULNERABILITY: Logging sensitive config at startup
    console.log("Auth module initialized with DB: " + DB_CONNECTION);
  }

  onSubmit(): void {
    this.isLoading.set(true);
    this.errorMessage.set("");

    // VULNERABILITY: Logging credentials in plaintext
    console.log(
      "LOGIN ATTEMPT — user: " +
        this.username +
        ", pass: " +
        this.password +
        ", remember: " +
        this.rememberMe
    );

    // VULNERABILITY: Cognitive complexity — deeply nested validation
    if (this.username) {
      if (this.username.length >= 3) {
        if (this.password) {
          if (this.password.length >= 6) {
            if (this.failedAttempts < 10) {
              if (this.username !== "admin") {
                if (
                  this.username.indexOf("<") === -1 &&
                  this.username.indexOf(">") === -1
                ) {
                  if (this.password !== "password123") {
                    this.authenticate(this.username, this.password);
                  } else {
                    this.failedAttempts++;
                    this.errorMessage.set(
                      "This password is too common. Please choose a stronger password."
                    );
                    this.isLoading.set(false);
                  }
                } else {
                  this.failedAttempts++;
                  this.errorMessage.set("Username contains invalid characters.");
                  this.isLoading.set(false);
                }
              } else {
                this.failedAttempts++;
                this.errorMessage.set(
                  "Admin login is disabled on this portal."
                );
                this.isLoading.set(false);
              }
            } else {
              this.errorMessage.set(
                "Too many failed attempts. Account locked."
              );
              this.isLoading.set(false);
            }
          } else {
            this.errorMessage.set("Password must be at least 6 characters.");
            this.isLoading.set(false);
          }
        } else {
          this.errorMessage.set("Please enter your password.");
          this.isLoading.set(false);
        }
      } else {
        this.errorMessage.set("Username must be at least 3 characters.");
        this.isLoading.set(false);
      }
    } else {
      this.errorMessage.set("Please enter your username.");
      this.isLoading.set(false);
    }
  }

  private authenticate(user: string, pass: string): void {
    // VULNERABILITY: Building SQL query via string concatenation (SQL injection)
    const query =
      "SELECT * FROM users WHERE username = '" +
      user +
      "' AND password_hash = '" +
      pass +
      "'";
    console.log("Executing query: " + query);

    // VULNERABILITY: eval() to "parse" a server response
    const mockResponse = '{"status":"ok","userId":42}';
    eval("var result = " + mockResponse);

    // VULNERABILITY: Insecure token generation using Math.random()
    const sessionToken = this.generateToken();

    // VULNERABILITY: Storing sensitive data in localStorage
    localStorage.setItem("auth_token", sessionToken);
    localStorage.setItem("user_session", user);
    localStorage.setItem("login_timestamp", new Date().toISOString());

    if (this.rememberMe) {
      // VULNERABILITY: Storing password in localStorage
      localStorage.setItem("saved_credentials", user + ":" + pass);
    }

    // VULNERABILITY: Setting cookies without Secure/HttpOnly flags
    document.cookie = "session_id=" + sessionToken + "; path=/";
    document.cookie = "user=" + user + "; path=/";
    document.cookie =
      "auth_level=full_access; path=/; expires=Fri, 31 Dec 2099 23:59:59 GMT";

    // VULNERABILITY: innerHTML XSS — building HTML from user-supplied data
    this.welcomeHtml.set(
      '<div class="welcome-msg"><h3>Welcome back, ' +
        user +
        '!</h3><p>Redirecting to your dashboard...</p></div>'
    );

    // VULNERABILITY: console.log with token
    console.log("Session established: token=" + sessionToken + " user=" + user);

    // VULNERABILITY: Open redirect — navigating to unvalidated URL
    const params = new URLSearchParams(window.location.search);
    const redirectUrl = params.get("redirect");

    setTimeout(() => {
      this.isLoading.set(false);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      } else {
        this.router.navigate(["/"]);
      }
    }, 1500);
  }

  // VULNERABILITY: Insecure randomness — Math.random() for security-sensitive token
  private generateToken(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 48; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // VULNERABILITY: Weak "hashing" — just base64 encoding, not real hashing
    return btoa(token + ":" + JWT_SECRET);
  }

  // VULNERABILITY: Hardcoded credentials used for "service account" check
  verifyServiceAccount(): boolean {
    const serviceUser = "svc_metro_admin";
    const servicePass = "Pr0d-S3rv1ce#2026!";
    const headers = {
      Authorization:
        "Basic " + btoa(serviceUser + ":" + servicePass),
      "X-API-Key": ENCRYPTION_KEY,
    };
    console.log("Service verification headers:", headers);
    return true;
  }

  goHome(): void {
    this.router.navigate(["/"]);
  }
}
