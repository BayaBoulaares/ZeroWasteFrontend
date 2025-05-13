
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OcrService } from 'src/app/features/SafetyCompilance/Services/ocr.service';

@Component({
  selector: 'app-ocr',
  template: `
    <div class="container">
      <input type="file" (change)="onFileSelected($event)" accept="application/pdf" />
      <div *ngIf="isLoading" class="loading">Processing PDF...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      <div *ngIf="aiResult" class="result">
        <h3>Gemini Analysis</h3>
        <pre>{{ aiResult }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .loading { color: blue; margin: 10px 0; }
    .error { color: red; margin: 10px 0; }
    .result { margin-top: 20px; }
  `]
})
export class GeminiapiComponent {
  aiResult: string = '';
  isLoading: boolean = false;
  error: string = '';

  constructor(private ocrService: OcrService, private http: HttpClient) {}

  onFileSelected(event: any) {
    this.isLoading = true;
    this.error = '';
    this.aiResult = '';
    
    const file = event.target.files[0];
    if (!file) {
      this.error = 'Please select a PDF file';
      this.isLoading = false;
      return;
    }

    if (file.type !== 'application/pdf') {
      this.error = 'Please select a valid PDF file';
      this.isLoading = false;
      return;
    }

    this.ocrService.extractTextFromPdf(file)
      .then(text => {
        if (!text) {
          throw new Error('No text was extracted from the PDF');
        }
        return this.http.post<any>('http://localhost:8080/api/analyze', { text }).toPromise();
      })
      .then(response => {
        this.aiResult = response.result;
        this.isLoading = false;
      })
      .catch(error => {
        console.error('Error:', error);
        this.error = 'Failed to process the PDF. Please try again.';
        this.isLoading = false;
      });
  }
}
