import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { Meals } from 'src/app/features/menumangment/Entities/meals';
import { MealsService } from 'src/app/features/menumangment/Services/meals.service';
import { MenusService } from 'src/app/features/menumangment/Services/menus.service';
import { UserService } from 'src/app/features/userManagement/Services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  meals: Meals[]=[];
  categories: string[] = ['Brunch', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'];
  selectedCategory: string = 'Brunch';
  discountedMeals: Meals[] = [];
  user: any = null;
  constructor(private menuservice: MenusService,private mealservice: MealsService,private userService:UserService){}
  
  ngOnInit(): void {
    this.user = this.userService.getUser();
    console.log(this.user);
    AOS.init();
    this.getMeals();  

  }
  getMeals() {
    this.mealservice.getMeals().subscribe((data) => {
      this.meals = data;

      this.discountedMeals = this.meals.filter(meal => meal.price !== meal.discountedPrice);

      console.log('Repas en réduction:', this.discountedMeals);
    });
  }

  get filteredMeals() {
    return this.meals.filter(meal => meal.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }
  currentUserId = 1; 

}


