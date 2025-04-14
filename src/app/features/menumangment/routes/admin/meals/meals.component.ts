import { Component, OnInit } from '@angular/core';

import { BASE_URL } from 'src/consts';
import { MealsService } from '../../../Services/meals.service';
import { IngredientsService } from '../../../Services/ingredients.service';
import { Meals } from '../../../Entities/meals';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html',
  styleUrls: ['./meals.component.css']
})
export class MealsComponent implements OnInit {
  readonly base_url = BASE_URL;
  meals: Meals[] = [];
  searchTerm: string = '';
  discountedMeals: Meals[] = [];
  constructor(private mealservice: MealsService, private ingredientService: IngredientsService) {

  }
  ngOnInit(): void {
    this.getMeals();
    this.loadRecommendedMeals();
    this.mealservice.getMealsWithDiscounts().subscribe(data => {
      this.meals = data;
    });
  }


  /*public getMeals(){
      this.mealservice.getMeals().subscribe(data => {
        this.meals = data;
      })
  
  }*/
  getMeals() {
    this.mealservice.getMeals().subscribe((data) => {
      this.meals = data;

      // Une fois que les données sont chargées, filtre les repas avec réduction
      this.discountedMeals = this.meals.filter(meal => meal.price !== meal.discountedPrice);

      // Log ou traitement des repas filtrés (facultatif)
      console.log('Repas en réduction:', this.discountedMeals);
    });
  }



  deleteMeal(mealId: number) {
    this.mealservice.delete(mealId).subscribe({
      next: () => {
        console.log('Meal deleted successfully');
        this.meals = this.meals.filter(meal => meal.mealId !== mealId); // Mise à jour du frontend
      },
      error: (err) => console.error('Error deleting meal:', err)
    });
  }
  update(mealId: number): void {
    console.log('Update triggered for ID:', mealId);  // Vérifiez si l'ID est correct
    // Filtrez le tableau pour supprimer l'élément
    this.meals = this.meals.filter(meal => meal.mealId !== mealId);
    console.log('Updated menus:', this.meals);  // Vérifiez si le tableau est bien mis à jour
  }
  recommendedMeals: any[] = [];
  loadRecommendedMeals() {
    this.mealservice.getRecommendedMeals().subscribe(
      (data) => {
        this.recommendedMeals = data;
      },
      (error) => {
        console.error('Erreur lors du chargement des repas', error);
      }
    );
  }
  searchIngredient(): void {
    if (this.searchTerm.trim()) {
      this.mealservice.searchMeal(this.searchTerm).subscribe(data => {
        this.meals = data;
      });
    } else {
      this.getMeals();
    }
  }
  recommendedDishes: any[] = [];
  getRecommendations() {
    this.mealservice.getRecommendedMeals()
      .subscribe(dishes => this.recommendedDishes = dishes);
  }
}
