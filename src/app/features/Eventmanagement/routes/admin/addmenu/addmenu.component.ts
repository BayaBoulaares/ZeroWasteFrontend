import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenusService } from '../../../Services/menus.service';

@Component({
  selector: 'app-addmenu',
  templateUrl: './addmenu.component.html',
  styleUrls: ['./addmenu.component.css']
})
export class AddmenuComponent implements OnInit {
  menuForm: FormGroup;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private menuService: MenusService,
    private router: Router
  ) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.menuForm.invalid) {
      alert('Please fill all required fields correctly');
      return;
    }

    const formData = new FormData();
    
    const menuData = {
      name: this.menuForm.value.name,
      description: this.menuForm.value.description,
      price: this.menuForm.value.price,
      category: this.menuForm.value.category
    };

    formData.append('menu', new Blob([JSON.stringify(menuData)], { type: 'application/json' }));

    // Only append image if one was selected
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile);
    }

    this.menuService.addMenu(menuData as any).subscribe({
      next: () => {
        console.log('Menu added successfully');
        this.router.navigate(['/admin/eventmanagement/menus']);
      },
      error: (error) => {
        console.error('Error adding menu:', error);
        // Continue anyway even if there's an error
        this.router.navigate(['/admin/eventmanagement/menus']);
      }
    });
  }
}
