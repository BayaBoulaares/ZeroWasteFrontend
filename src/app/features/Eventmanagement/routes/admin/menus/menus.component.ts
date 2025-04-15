import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenusService } from '../../../Services/menus.service';
import { Menus } from '../../../Entities/menus';
import { BASE_URL } from 'src/consts';

@Component({
  selector: 'app-menus',
  templateUrl: './menus.component.html',
  styleUrls: ['./menus.component.css']
})
export class MenusComponent implements OnInit {
  menus: Menus[] = [];
  loading: boolean = true;
  error: string | null = null;
  readonly base_url = BASE_URL;

  constructor(
    private menuService: MenusService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMenus();
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) {
      return 'https://via.placeholder.com/300x200';
    }
    // Check if the path already includes http or https
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    // Check if the path starts with a slash
    const path = imagePath.startsWith('/') ? imagePath : '/' + imagePath;
    return `${this.base_url}${path}`;
  }

  loadMenus(): void {
    this.loading = true;
    this.menuService.getMenus().subscribe({
      next: (data) => {
        this.menus = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading menus:', err);
        this.error = 'Failed to load menus. Please try again later.';
        this.loading = false;
      }
    });
  }

  deleteMenu(id: number): void {
    if (confirm('Are you sure you want to delete this menu?')) {
      this.menuService.deleteMenu(id).subscribe({
        next: () => {
          console.log('Menu deleted successfully');
          // Refresh the menu list
          this.loadMenus();
        },
        error: (err) => {
          console.error('Error deleting menu:', err);
          alert('Failed to delete menu. Please try again later.');
        }
      });
    }
  }

  editMenu(id: number): void {
    this.router.navigate(['/admin/eventmanagement/menus/update', id]);
  }

  addNewMenu(): void {
    this.router.navigate(['/admin/eventmanagement/menus/add']);
  }
}
