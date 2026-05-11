import { Component, signal } from "@angular/core";
import { Router, NavigationEnd } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: false,
  templateUrl: "./app.html",
  styleUrl: "./app.css",
})
export class App {
  protected readonly title = signal("Metro National Bank");
  showLoginModal = signal(false);
  searchTerm = signal("");
  searchResultHtml = signal("");
  isLoggedIn = signal(false);
  loggedInUser = signal("");
  currentTab = signal("personal");
  isHomePage = signal(true);

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e) => {
        this.isHomePage.set((e as NavigationEnd).urlAfterRedirects === "/");
      });
  }

  openLogin(): void {
    this.showLoginModal.set(true);
  }

  closeLogin(): void {
    this.showLoginModal.set(false);
  }

  onLoginSuccess(event: { username: string; token: string }): void {
    this.isLoggedIn.set(true);
    this.loggedInUser.set(event.username);
    this.showLoginModal.set(false);
    // VULNERABILITY: console.log with sensitive data
    console.log("User authenticated successfully. Token: " + event.token);
  }

  // VULNERABILITY: XSS — building HTML from user input and binding it to innerHTML
  onSearch(): void {
    const query = this.searchTerm();
    if (query) {
      this.searchResultHtml.set(
        '<div class="search-result"><p>Showing results for: <strong>' +
          query +
          "</strong></p></div>"
      );
      // VULNERABILITY: eval() usage
      eval('console.log("Search executed: ' + query + '")');
    } else {
      this.searchResultHtml.set("");
    }
  }

  setTab(tab: string): void {
    this.currentTab.set(tab);
  }
}
