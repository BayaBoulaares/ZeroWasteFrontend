import { Component, OnInit } from '@angular/core';
import { Meals } from 'src/app/features/menumangment/Entities/meals';
import { Menus } from 'src/app/features/menumangment/Entities/menus';
import { register } from 'swiper/element/bundle';
import Swiper from 'swiper';
import * as AOS from 'aos';
import { MenusService } from 'src/app/features/menumangment/Services/menus.service';
import { MealsService } from 'src/app/features/menumangment/Services/meals.service';

@Component({
  selector: 'app-menusection',
  templateUrl: './menusection.component.html',
  styleUrls: ['./menusection.component.css']
})
export class MenusectionComponent implements OnInit {
  meals: Meals[]=[];
  menus: Menus[]=[];
 categories: string[] = ['Brunch', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];
 selectedCategory: string = 'Brunch';
 constructor(private menuservice: MenusService,private mealservice: MealsService){}
 ngOnInit(): void {
    AOS.init();
    this.getMeals();  
    register();
    new Swiper('.swiper.init-swiper', {
      loop: true,
      speed: 600,
      autoplay: {
        delay: 5000,
      },
      slidesPerView: 'auto',
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        320: {
          slidesPerView: 1,
          spaceBetween: 40,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 1,
        },
      },
    });
    this.getMenus();
   
  }
  getMeals() {
    this.mealservice.getMeals().subscribe((data) => {
      this.meals = data;
      // Optionally log or process the meal data
    });
  }
  get filteredMeals() {
    return this.meals.filter(meal => meal.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
  orderMeal(meal: any): void {
    console.log('Meal ordered:', meal.name);
    // Tu peux aussi déclencher une popup, ajouter au panier, etc.
  }
  getMenus() {
    this.menuservice.getMenus().subscribe((data) => {
      this.menus = data;
     
    });
  }

}
