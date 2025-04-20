import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../Services/event.service';
import { MenusService } from '../../../Services/menus.service';
import { Menus } from '../../../Entities/menus';
import { Event } from '../../../Entities/event';

@Component({
  selector: 'app-addevent',
  templateUrl: './addevent.component.html',
  styleUrls: ['./addevent.component.css']
})
export class AddeventComponent implements OnInit {
  eventForm: FormGroup;
  availableMenus: Menus[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  originalPrice: number = 0;
  finalPrice: number = 0;
  youSave: number = 0;
  discountPercentage: number = 0;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private menuService: MenusService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      valeurRemise: [0, [Validators.min(0), Validators.max(100)]],
      menuId: ['', Validators.required],
      image: [null]
    });

    // Subscribe to form value changes
    this.eventForm.get('menuId')?.valueChanges.subscribe(() => {
      this.updatePrices();
    });

    this.eventForm.get('valeurRemise')?.valueChanges.subscribe(() => {
      this.updatePrices();
    });
  }

  ngOnInit(): void {
    this.loadMenus();
  }

  loadMenus() {
    this.menuService.getMenus().subscribe({
      next: (menus) => {
        this.availableMenus = menus;
      },
      error: (error) => {
        console.error('Error loading menus:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      
      // Convert dates to ISO format with time
      const startDate = new Date(formValue.startDate);
      const endDate = new Date(formValue.endDate);

      // Create FormData object
      const formData = new FormData();
      formData.append('title', formValue.title);
      formData.append('description', formValue.description);
      formData.append('startDate', startDate.toISOString());
      formData.append('endDate', endDate.toISOString());
      formData.append('valeurRemise', formValue.valeurRemise.toString());
      formData.append('menuId', formValue.menuId.toString());

      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile, this.selectedFile.name);
      }

      // Create Event object using the class
      const eventData = new Event(
        undefined, // eventid
        formValue.title,
        formValue.description,
        startDate.toISOString(),
        endDate.toISOString(),
        '', // imagePath
        formValue.valeurRemise,
        formValue.Nbr,
        formValue.menuId ? { menuId: formValue.menuId } as Menus : undefined,
        
      );

      this.eventService.addEventWithImage(eventData, this.selectedFile || new File([], '')).subscribe({
        next: () => {
          console.log('Event added successfully');
          this.router.navigate(['/admin/eventmanagement/events']);
        },
        error: (error) => {
          console.error('Error adding event:', error);
          if (error.error) {
            console.error('Server error details:', error.error);
          }
        }
      });
    }
  }

  validateDates(): boolean {
    const startDate = new Date(this.eventForm.get('startDate')?.value);
    const endDate = new Date(this.eventForm.get('endDate')?.value);
    return startDate < endDate;
  }

  updatePrices(): void {
    const selectedMenuId = this.eventForm.get('menuId')?.value;
    const discount = this.eventForm.get('valeurRemise')?.value || 0;

    if (selectedMenuId) {
      const selectedMenu = this.availableMenus.find(menu => menu.menuId === +selectedMenuId);
      if (selectedMenu) {
        this.originalPrice = selectedMenu.price;
        this.discountPercentage = discount;
        this.youSave = (this.originalPrice * discount) / 100;
        this.finalPrice = this.originalPrice - this.youSave;
      }
    } else {
      this.originalPrice = 0;
      this.finalPrice = 0;
      this.youSave = 0;
      this.discountPercentage = 0;
    }
  }
}
