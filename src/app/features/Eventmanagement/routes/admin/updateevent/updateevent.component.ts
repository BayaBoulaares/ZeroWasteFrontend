import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../Services/event.service';
import { Event } from '../../../Entities/event';
import { MenusService } from '../../../Services/menus.service';
import { Menus } from '../../../Entities/menus';

@Component({
  selector: 'app-updateevent',
  templateUrl: './updateevent.component.html',
  styleUrls: ['./updateevent.component.css']
})
export class UpdateeventComponent implements OnInit {
  eventForm: FormGroup;
  availableMenus: Menus[] = [];
  selectedFile: File | null = null;
  imagePreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private menuService: MenusService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      valeurRemise: [0, [Validators.min(0), Validators.max(100)]],
      menuId: [''],
      image: [null]
    });
  }

  ngOnInit(): void {
    this.loadMenus();
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadEvent(id);
      }
    });
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

  loadEvent(id: number) {
    this.eventService.getEventById(id).subscribe({
      next: (event) => {
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          startDate: this.formatDate(event.startDate),
          endDate: this.formatDate(event.endDate),
          valeurRemise: event.valeurRemise,
          menuId: event.menu?.menuId
        });
        if (event.imagePath) {
          this.imagePreview = `http://localhost:8089/gaspillagezero/uploads/${event.imagePath}`;
        }
      },
      error: (error) => {
        console.error('Error loading event:', error);
      }
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFile = file;
    this.eventForm.patchValue({ image: file });

    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  formatDate(date: string): string {
    return new Date(date).toISOString().slice(0, 16);
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const formData = new FormData();
      const formValue = this.eventForm.value;

      formData.append('title', formValue.title);
      formData.append('description', formValue.description);
      formData.append('startDate', new Date(formValue.startDate).toISOString());
      formData.append('endDate', new Date(formValue.endDate).toISOString());
      formData.append('valeurRemise', formValue.valeurRemise);
      if (formValue.menuId) {
        formData.append('menuId', formValue.menuId);
      }
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }

      this.eventService.updateEvent(formValue).subscribe({
        next: () => {
          this.router.navigate(['/admin/eventmanagement/events']);
        },
        error: (error) => {
          console.error('Error updating event:', error);
        }
      });
    }
  }
}
