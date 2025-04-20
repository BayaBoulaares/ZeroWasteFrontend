import { Component, OnInit, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenusService } from '../../../Services/menus.service';
import { Menus } from '../../../Entities/menus';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BASE_URL } from 'src/consts';
import { register } from 'swiper/element/bundle';
import * as AOS from 'aos';

@Component({
  selector: 'app-menufront',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './menufront.component.html',
  styleUrls: ['./menufront.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MenufrontComponent implements OnInit, AfterViewInit {
  menus: Menus[] = [];
  selectedMenu: Menus | null = null;
  menuMeals: any[] = []; // Using any[] since we don't have a specific Meals entity in Eventmanagement
  loading: boolean = true;
  error: string | null = null;
  
  // For filtering and searching
  searchTerm: string = '';
  filteredMenus: Menus[] = [];
  
  // Base URL for images
  readonly base_url = BASE_URL;
  
  constructor(
    private menusService: MenusService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Register Swiper custom elements
    register();
    
    // Initialize AOS animations
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
    
    this.loadMenus();
  }
  
  ngAfterViewInit(): void {
    // Initialize any additional components after view is initialized
  }

  loadMenus(): void {
    this.loading = true;
    this.menusService.getMenus().subscribe({
      next: (data) => {
        this.menus = data;
        this.filteredMenus = [...this.menus];
        this.loading = false;
        console.log('Menus loaded:', this.menus);
        
        // Initialize swiper after data is loaded
        setTimeout(() => {
          this.initSwiper();
        }, 100);
      },
      error: (err) => {
        this.error = 'Failed to load menus: ' + err.message;
        this.loading = false;
        console.error('Error loading menus:', err);
      }
    });
  }
  
  initSwiper(): void {
    // Initialize swiper with configuration
    const swiperEl = document.querySelector('swiper-container');
    if (swiperEl) {
      Object.assign(swiperEl, {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
          clickable: true,
        },
        breakpoints: {
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
        },
      });
      swiperEl.initialize();
    }
  }

  selectMenu(menu: Menus): void {
    this.selectedMenu = menu;
    if (menu.menuId) {
      this.loadMenuMeals(menu.menuId);
    } else {
      this.error = 'Menu ID is undefined';
    }
  }

  loadMenuMeals(menuId: number): void {
    this.loading = true;
    // Since the Eventmanagement MenusService doesn't have a getMenuWithMeals method,
    // we'll use getMenuById and mock some sample meals for demonstration
    this.menusService.getMenuById(menuId).subscribe({
      next: (data) => {
        // Create some sample meals for demonstration
        this.menuMeals = this.generateSampleMeals(data.name);
        this.loading = false;
        console.log('Menu loaded:', data);
        console.log('Sample meals created:', this.menuMeals);
      },
      error: (err) => {
        this.error = 'Failed to load menu: ' + err.message;
        this.loading = false;
        console.error('Error loading menu:', err);
      }
    });
  }
  
  // Helper method to generate sample meals for demonstration
  generateSampleMeals(menuName: string): any[] {
    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert'];
    const mealCount = Math.floor(Math.random() * 3) + 2; // 2-4 meals per menu
    
    return Array.from({ length: mealCount }, (_, i) => ({
      mealId: i + 1,
      name: `${menuName} ${categories[i % categories.length]} Option ${i + 1}`,
      description: `A delicious ${categories[i % categories.length].toLowerCase()} option from our ${menuName} menu.`,
      category: categories[i % categories.length],
      price: Math.floor(Math.random() * 15) + 5, // $5-$20
      imagePath: `assets/images/meals/meal${i + 1}.jpg`,
      rating: (Math.floor(Math.random() * 10) + 35) / 10 // 3.5-4.5 rating
    }));
  }

  searchMenus(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;
    
    if (!term) {
      this.filteredMenus = [...this.menus];
      return;
    }
    
    this.filteredMenus = this.menus.filter(menu => 
      menu.name.toLowerCase().includes(term) || 
      menu.description.toLowerCase().includes(term)
    );
  }

  clearSelection(): void {
    this.selectedMenu = null;
    this.menuMeals = [];
  }

  getMenuImageUrl(imagePath: string | undefined): string {
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

  getMealImageUrl(meal: any): string {
    // For sample meals, use placeholder images
    return meal.imagePath || 'https://via.placeholder.com/300x200';
  }

  calculateTotalCalories(meals: any[]): number {
    // Return a placeholder calorie count
    return meals.length * 250; // Assuming an average of 250 calories per meal as a placeholder
  }
}
