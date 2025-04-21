import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ajout',
  templateUrl: './ajout.component.html',
  styleUrls: ['./ajout.component.css']
})
export class AjoutComponent {


  eventForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: [''],
      description: [''],
      startDate: [''],
      endDate: [''],
      image: [null]
    });
  }
  imageUrlMessage: string | null = null;


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    const formData = new FormData();
    formData.append('title', this.eventForm.get('title')?.value);
    formData.append('description', this.eventForm.get('description')?.value);
    formData.append('startDate', this.eventForm.get('startDate')?.value);
    formData.append('endDate', this.eventForm.get('endDate')?.value);
  
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }
  
    this.http.post<any>('http://localhost:8089/gaspillagezero/event/addevent', formData)
      .subscribe({
        next: (response) => {
          console.log('Event added:', response);
  
          if (response.imagePath) {
            const imageUrl = `http://localhost:8089/gaspillagezero/uploads/${response.imagePath}`;
            this.imageUrlMessage = `Image ajoutée avec succès ! URL : ${imageUrl}`;
          }
  
          // Redirection optionnelle
          // this.router.navigate(['/events']);
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout de l\'événement :', error);
          this.imageUrlMessage = 'Une erreur est survenue lors de l\'ajout de l\'événement.';
        }
      });
  }
  
  }



