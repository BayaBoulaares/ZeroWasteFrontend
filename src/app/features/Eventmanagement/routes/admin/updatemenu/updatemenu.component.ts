import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenusService } from '../../../Services/menus.service';
import { BASE_URL } from 'src/consts';
import { Menus } from 'src/app/features/menumangment/Entities/menus';
@Component({
  selector: 'app-updatemenu',
  templateUrl: './updatemenu.component.html',
  styleUrls: ['./updatemenu.component.css']
})
export class UpdatemenuComponent implements OnInit {
  readonly base_url = BASE_URL;
  menuForm: FormGroup;
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  menuId: number;
  currentImagePath: string | null = null;

  constructor(
    private fb: FormBuilder,
    private menuService: MenusService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.menuForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(0)]],
      category: ['', [Validators.required]]
    });
    
    const id = this.route.snapshot.paramMap.get('id');
    this.menuId = id ? +id : 0;
  }

  ngOnInit(): void {
    if (this.menuId) {
      this.loadMenuData();
    }
  }

  loadMenuData(): void {
    this.menuService.getMenuById(this.menuId).subscribe({
      next: (menu) => {
        this.menuForm.patchValue({
          name: menu.name,
          description: menu.description,
          price: menu.price,
          imagePath: menu.imagePath,
          });
        
          this.currentImagePath = menu.imagePath ?? null;
          // Set the image preview URL using the correct path
        if (menu.imagePath) {
          this.imagePreviewUrl = `${this.base_url}/uploads/${menu.imagePath}`;
        }
      },
      error: (error) => {
        console.error('Error loading menu:', error);
        alert('Error loading menu data. Please try again.');
      }
    });
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

    const updatedMenu = {
      menuId: this.menuId,
      name: this.menuForm.value.name,
      description: this.menuForm.value.description,
      price: this.menuForm.value.price,
      category: this.menuForm.value.category,
      imagePath: this.currentImagePath,
      startDate: new Date(),
      endDate: new Date()
    };

    if (this.selectedFile) {
      // If a new file is selected, use updateMenuWithImage
      this.menuService.updateMenuWithImage(updatedMenu as Menus, this.selectedFile).subscribe({
        next: () => {
          console.log('Menu updated successfully with new image');
          this.router.navigate(['/admin/eventmanagement/menus']);
        },
        error: (error) => {
          console.error('Error updating menu with image:', error);
          alert('Error updating menu. Please try again.');
        }
      });
    } else {
      // If no new file, use regular update
      this.menuService.updateMenu(updatedMenu as Menus).subscribe({
        next: () => {
          console.log('Menu updated successfully');
          this.router.navigate(['/admin/eventmanagement/menus']);
        },
        error: (error) => {
          console.error('Error updating menu:', error);
          alert('Error updating menu. Please try again.');
        }
      });
    }
  }
}
