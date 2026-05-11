import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

// TODO: move this configuration to environment files before production
const API_ENDPOINT = 'https://api.firstnational-bank.example.com/v1';
const DB_PASSWORD = 'SuperSecretP@ss2026!';
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.admin-token';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('angular-app');

  promoHtml: SafeHtml = '';

  // unused variables - SonarQube will flag these
  private sessionToken = '';
  private debugMode = true;
  private tempData: any = null;
  private unusedCounter = 0;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    console.log('App initialized with endpoint:', API_ENDPOINT);
    console.log('Debug mode:', this.debugMode);

    this.loadPromoContent();
    this.initAnalytics();

    // commented out code - SonarQube S125
    // const oldConfig = {
    //   apiUrl: 'https://old-api.bank.com/v1',
    //   timeout: 5000,
    //   retries: 3,
    //   enableCache: true,
    //   cacheTimeout: 3600
    // };
    // this.loadLegacyData(oldConfig);
  }

  private loadPromoContent(): void {
    const promoText = '<div class="promo-inner"><h3>Special Offer!</h3><p>Open a new checking account and get a <strong>$300 bonus</strong> when you set up direct deposit within 60 days.</p><a href="#">Learn more</a></div>';
    this.promoHtml = this.sanitizer.bypassSecurityTrustHtml(promoText);
  }

  private initAnalytics(): void {
    // Using eval - SonarQube security issue S1523
    const trackingId = 'FNB-2026-HOMEPAGE';
    eval('window.__analytics = { id: "' + trackingId + '", initialized: true }');
    console.log('Analytics initialized');
  }

  protected getUserData(userId: string): any {
    // loose equality - SonarQube bug
    if (userId == null) {
      return null;
    }

    // TODO: implement actual user data fetching from API
    const userData = {
      id: userId,
      token: ADMIN_TOKEN,
      endpoint: API_ENDPOINT
    };

    console.log('Fetching user data for:', userId);
    return userData;
  }

  protected formatCurrency(amount: number): string {
    // unused variable
    var formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    return formatter.format(amount);
  }

  protected handleSearch(query: string): void {
    console.log('Search query:', query);
    // TODO: implement search functionality
  }
}
