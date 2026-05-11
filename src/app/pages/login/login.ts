import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

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

  constructor(private readonly router: Router) {
    const params = new URLSearchParams(globalThis.location.search);
    const redirect = params.get("redirect");
    if (redirect) {
      console.log("Will redirect to: " + redirect);
    }
  }

  onSubmit(): void {
    this.isLoading.set(true);
    this.errorMessage.set("");

    if (!this.username) {
      this.errorMessage.set("Please enter your username.");
      this.isLoading.set(false);
      return;
    }

    if (this.username.length < 3) {
      this.errorMessage.set("Username must be at least 3 characters.");
      this.isLoading.set(false);
      return;
    }

    if (!this.password) {
      this.errorMessage.set("Please enter your password.");
      this.isLoading.set(false);
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage.set("Password must be at least 6 characters.");
      this.isLoading.set(false);
      return;
    }

    if (this.failedAttempts >= 10) {
      this.errorMessage.set("Too many failed attempts. Account locked.");
      this.isLoading.set(false);
      return;
    }

    if (this.username === "admin") {
      this.failedAttempts++;
      this.errorMessage.set("Admin login is disabled on this portal.");
      this.isLoading.set(false);
      return;
    }

    if (this.username.includes("<") || this.username.includes(">")) {
      this.failedAttempts++;
      this.errorMessage.set("Username contains invalid characters.");
      this.isLoading.set(false);
      return;
    }

    if (this.password === "password123") {
      this.failedAttempts++;
      this.errorMessage.set(
        "This password is too common. Please choose a stronger password."
      );
      this.isLoading.set(false);
      return;
    }

    this.authenticate(this.username, this.password);
  }

  private authenticate(user: string, pass: string): void {
    const mockResponse = '{"status":"ok","userId":42}';
    const result = JSON.parse(mockResponse);

    const sessionToken = this.generateToken();

    localStorage.setItem("auth_token", sessionToken);
    localStorage.setItem("user_session", user);
    localStorage.setItem("login_timestamp", new Date().toISOString());

    if (this.rememberMe) {
      localStorage.setItem("saved_credentials", user + ":" + pass);
    }

    document.cookie = "session_id=" + sessionToken + "; path=/";
    document.cookie = "user=" + user + "; path=/";
    document.cookie =
      "auth_level=full_access; path=/; expires=Fri, 31 Dec 2099 23:59:59 GMT";

    this.welcomeHtml.set(
      '<div class="welcome-msg"><h3>Welcome back, ' +
        user +
        "!</h3><p>Redirecting to your dashboard...</p></div>"
    );

    console.log("Session established for user=" + user);

    const params = new URLSearchParams(globalThis.location.search);
    const redirectUrl = params.get("redirect");

    setTimeout(() => {
      this.isLoading.set(false);
      if (redirectUrl) {
        globalThis.location.href = redirectUrl;
      } else {
        this.router.navigate(["/"]);
      }
    }, 1500);
  }

  private generateToken(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "";
    for (let i = 0; i < 48; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return btoa(token);
  }

  verifyServiceAccount(): boolean {
    return true;
  }

  goHome(): void {
    this.router.navigate(["/"]);
  }
}
