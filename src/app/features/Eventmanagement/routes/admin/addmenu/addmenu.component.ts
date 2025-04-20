import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenusService } from '../../../Services/menus.service';
import { Menus } from '../../../Entities/menus';

@Component({
  selector: 'app-addmenu',
  templateUrl: './addmenu.component.html',
  styleUrls: ['./addmenu.component.css']
})
export class AddmenuComponent implements OnInit {
  menuForm: FormGroup;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  error: string | null = null;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private menuService: MenusService,
    private router: Router
  ) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {}

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.menuForm.valid && this.selectedFile) {
      this.loading = true;
      const formValue = this.menuForm.value;
  
      const startDate = new Date(formValue.startDate); // Convert to Date object if it's not already
      const endDate = new Date(formValue.endDate);
      const formattedStartDate = startDate.toISOString(); // Keep both date and time
const formattedEndDate = endDate.toISOString();     // Keep both date and time

  
      // Prepare FormData to send both text and file data
      const formData = new FormData();
      formData.append('name', formValue.name);
      formData.append('description', formValue.description);
      formData.append('price', formValue.price.toString());
      formData.append('startDate', formattedStartDate);
      formData.append('endDate', formattedEndDate);
      formData.append('imageFile', this.selectedFile); // Append the file here
  
      // Send request with FormData
      this.menuService.addMenuWithImage(formData).subscribe({
        next: (response) => {
          console.log('Menu added successfully:', response);
          this.router.navigate(['/admin/eventmanagement/menus']);
        },
        error: (error) => {
          console.error('Error adding menu:', error);
          this.error = 'Failed to add menu. Please try again.';
          this.loading = false;
        }
      });
    } else {
      this.error = 'Please fill in all required fields and select an image.';
    }
  }
  
  
}
