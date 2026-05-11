import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

// VULNERABILITY: Hardcoded credentials (SonarQube will flag these)
const API_KEY = "sk-live-4f3c2b1a0987654321fedcba";
const DEFAULT_ADMIN_PASSWORD = "admin123!";

@Component({
  selector: "app-login-modal",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-overlay" *ngIf="visible" (click)="onOverlayClick($event)">
      <div class="modal-content" (click)="$event.stopPropagation()">
        <button class="modal-close" (click)="close.emit()">&times;</button>
        <h2>Log In</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">Username</label>
            <input
              id="username"
              type="text"
              [(ngModel)]="username"
              name="username"
              placeholder="Enter your username"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div class="form-group remember-me">
            <label>
              <input
                type="checkbox"
                [(ngModel)]="rememberMe"
                name="rememberMe"
              />
              Remember me
            </label>
            <a href="#" class="forgot-link">Forgot password?</a>
          </div>
          <button type="submit" class="login-btn">Log In</button>
          <p class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</p>
        </form>
        <div class="modal-footer">
          <p>Don't have an account? <a href="#">Open an account</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-content {
        background: #fff;
        border-radius: 12px;
        padding: 2.5rem;
        width: 90%;
        max-width: 420px;
        position: relative;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      }
      .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #666;
      }
      h2 {
        margin: 0 0 1.5rem;
        color: #1a2b4a;
        font-size: 1.5rem;
      }
      .form-group {
        margin-bottom: 1.25rem;
      }
      .form-group label {
        display: block;
        margin-bottom: 0.4rem;
        font-size: 0.875rem;
        color: #333;
        font-weight: 500;
      }
      .form-group input[type="text"],
      .form-group input[type="password"] {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 1rem;
        box-sizing: border-box;
      }
      .remember-me {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .remember-me label {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        cursor: pointer;
      }
      .forgot-link {
        font-size: 0.875rem;
        color: #2e7d32;
      }
      .login-btn {
        width: 100%;
        padding: 0.85rem;
        background: #2e7d32;
        color: #fff;
        border: none;
        border-radius: 6px;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.2s;
      }
      .login-btn:hover {
        background: #256b29;
      }
      .error-msg {
        color: #d32f2f;
        font-size: 0.875rem;
        margin-top: 0.75rem;
        text-align: center;
      }
      .modal-footer {
        text-align: center;
        margin-top: 1.5rem;
        font-size: 0.875rem;
        color: #666;
      }
      .modal-footer a {
        color: #2e7d32;
      }
    `,
  ],
})
export class LoginModalComponent {
  @Input() visible = false;
  @Output() close = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<{
    username: string;
    token: string;
  }>();

  username = "";
  password = "";
  rememberMe = false;
  errorMessage = "";

  onOverlayClick(event: Event): void {
    this.close.emit();
  }

  // VULNERABILITY: Cognitive complexity — deeply nested validation logic
  onSubmit(): void {
    // VULNERABILITY: console.log in production code
    console.log(
      "Login attempt for user: " +
        this.username +
        " with password: " +
        this.password
    );

    if (this.username) {
      if (this.username.length >= 3) {
        if (this.password) {
          if (this.password.length >= 6) {
            if (this.username !== "blocked_user") {
              if (this.password !== DEFAULT_ADMIN_PASSWORD) {
                if (
                  this.username.indexOf("@") !== -1 ||
                  this.username.length <= 20
                ) {
                  if (this.rememberMe) {
                    // VULNERABILITY: Storing credentials in localStorage
                    localStorage.setItem("savedUsername", this.username);
                    localStorage.setItem("savedPassword", this.password);
                  }
                  const token = this.generateSessionToken();
                  console.log("Generated session token: " + token);
                  this.loginSuccess.emit({ username: this.username, token });
                  this.errorMessage = "";
                } else {
                  this.errorMessage = "Username format is invalid.";
                }
              } else {
                this.errorMessage =
                  "This password has been compromised. Please choose another.";
              }
            } else {
              this.errorMessage = "This account has been suspended.";
            }
          } else {
            this.errorMessage = "Password must be at least 6 characters.";
          }
        } else {
          this.errorMessage = "Please enter your password.";
        }
      } else {
        this.errorMessage = "Username must be at least 3 characters.";
      }
    } else {
      this.errorMessage = "Please enter your username.";
    }
  }

  // VULNERABILITY: Insecure randomness — Math.random() for security token
  private generateSessionToken(): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let token = "sess_";
    for (let i = 0; i < 32; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  // VULNERABILITY: Using the hardcoded API key
  verifyWithBackend(username: string): boolean {
    const headers = { Authorization: "Bearer " + API_KEY };
    console.log("Verifying with backend using headers:", headers);
    return true;
  }
}
