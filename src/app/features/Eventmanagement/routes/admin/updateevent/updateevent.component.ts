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
          menuId: event.menus?.menuId
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
      const formValue = this.eventForm.value;
      const eventData = new Event(
        this.route.snapshot.params['id'], // eventid
        formValue.title,
        formValue.description,
        new Date(formValue.startDate).toISOString(),
        new Date(formValue.endDate).toISOString(),
        '', // imagePath
        formValue.valeurRemise,
        formValue.Nbr,
        formValue.menuId ? { menuId: formValue.menuId } as Menus : undefined,
        
      );

      if (this.selectedFile) {
        this.eventService.updateEventWithImage(eventData, this.selectedFile).subscribe({
          next: () => {
            console.log('Event updated successfully with image');
            this.router.navigate(['/admin/eventmanagement/events']);
          },
          error: (error) => {
            console.error('Error updating event with image:', error);
          }
        });
      } else {
        this.eventService.updateEventWithImage(eventData, null).subscribe({
          next: () => {
            console.log('Event updated successfully');
            this.router.navigate(['/admin/eventmanagement/events']);
          },
          error: (error) => {
            console.error('Error updating event:', error);
          }
        });
      }
    }
  }
}
