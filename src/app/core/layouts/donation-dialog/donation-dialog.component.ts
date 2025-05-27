import {Component, inject} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Button} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {loadStripe} from '@stripe/stripe-js';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {MatFormField, MatInput, MatLabel} from '@angular/material/input';

@Component({
  selector: 'app-donation-dialog',
  standalone: true,
  imports: [FormsModule, Button, NgIf, NgForOf, MatDialogActions, MatButton, MatDialogContent, MatDialogTitle, MatFormField, MatFormField, MatInput, MatLabel, MatFormField],
  template: `
    <div class="max-w-md rounded-lg overflow-hidden shadow-lg bg-white">
      <!-- Header -->
      <div class="!bg-gradient-to-r !from-emerald-400 !to-cyan-400 py-4 px-6">
        <h2 class="text-white text-xl font-bold text-center">تبرع الآن</h2>
      </div>

      <!-- Content -->
      <div class="p-6 bg-gray-50" dir="rtl">
        <div class="text-center mb-5">
          <p class="text-gray-800">أدخل المبلغ الذي ترغب في التبرع به لدعمنا</p>
          <p class="text-gray-500 text-sm mt-1">كل تبرع يساهم في تحقيق رسالتنا</p>
        </div>

        <!-- Donation Input -->
        <div class="mb-6">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label class="text-gray-700">المبلغ (درهم)</mat-label>
            <input
              matInput
              type="number"
              [(ngModel)]="donation"
              min="1"
              required
              class="text-right text-lg"
            >
          </mat-form-field>
        </div>

        <!-- Quick Amounts -->
        <div class="flex flex-wrap gap-3 justify-center mb-6">
          <button
            mat-stroked-button
            class="border border-blue-500 text-blue-500 rounded-full px-4 py-1 hover:bg-blue-50 transition-colors"
            (click)="donation = 50"
          >
            50
          </button>
          <button
            mat-stroked-button
            class="border border-blue-500 text-blue-500 rounded-full px-4 py-1 hover:bg-blue-50 transition-colors"
            (click)="donation = 100"
          >
            100
          </button>
          <button
            mat-stroked-button
            class="border border-blue-500 text-blue-500 rounded-full px-4 py-1 hover:bg-blue-50 transition-colors"
            (click)="donation = 200"
          >
            200
          </button>
          <button
            mat-stroked-button
            class="border border-blue-500 text-blue-500 rounded-full px-4 py-1 hover:bg-blue-50 transition-colors"
            (click)="donation = 500"
          >
            500
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="bg-gray-100 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <button
          mat-button
          class="text-gray-600 hover:bg-gray-200 px-4 py-2 rounded"
          (click)="this.ref.close()"
        >
          إلغاء
        </button>
        <button
          mat-flat-button
          color="primary"
          [disabled]="loading || donation <= 0"
          class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 transition-colors"
          (click)="submitDonation()"
        >
          <span *ngIf="!loading">تأكيد التبرع</span>
          <span *ngIf="loading">جارٍ المعالجة...</span>
        </button>
      </div>
    </div>
  `,
})
export class DonationDialogComponent {
  donation: number = 0;
  loading: boolean = false;
  private http = inject(HttpClient);
  private stripePromise = loadStripe('pk_test_51R7ib8RofECHEHo8BD6GLKXS2YpjYcKm4IeEFY48gOLMmHMTx5zPZAjB3wKSp4kpbnadjSRc8FlxVAkk9QQ4P8qy00WuWH044c');

  constructor(public ref: MatDialogRef<DonationDialogComponent>) {}

  async submitDonation() {
    this.loading = true;

    const stripe = await this.stripePromise;
    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('No JWT token found.');
      this.loading = false;
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // Make sure to use the injected http service
    this.http.post<any>(
      'http://127.0.0.1:8000/api/create-checkout-session',
      { amount: this.donation },
      { headers }
    ).subscribe({
      next: async (res) => {
        const result = await stripe?.redirectToCheckout({
          sessionId: res.id,
        });
        this.loading = false;
        if (result?.error) {
          console.error(result.error.message);
        }
      },
      error: (error) => {
        console.error('Payment failed:', error);
        this.loading = false;
      }
    });
  }
}
