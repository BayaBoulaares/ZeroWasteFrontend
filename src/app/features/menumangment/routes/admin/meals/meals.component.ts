import { Component, OnInit } from '@angular/core';

import { BASE_URL } from 'src/consts';
import { MealsService } from '../../../Services/meals.service';
import { IngredientsService } from '../../../Services/ingredients.service';
import { Meals } from '../../../Entities/meals';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MealRecommendation } from '../../../models/meal-recommendation';

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
  requestData = {
    season: '',
    event:'',
    local_habit:'',
    trend_score: '',
  };
  mealRecommendations: any[] = [];
  errorMessage: string = '';
  constructor(private mealservice: MealsService, private ingredientService: IngredientsService,  private fb: FormBuilder) {
  
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
  season: number = 0;  // Valeur par défaut (Hiver)
  event: number = 0;   // Valeur par défaut (Noël)
  localHabits: number = 0; // Valeur par défaut (Famille)
  getRecommendations() {
    this.mealservice.getRecommendedMeals()
      .subscribe(dishes => this.recommendedDishes = dishes);
  }

      onSubmit() {
        this.mealservice.getMealRecommendations(this.requestData).subscribe(
          (data) => {
            // Réception des repas recommandés
            this.mealRecommendations = data;
            this.errorMessage = ''; // Réinitialiser l'erreur si la requête réussit
          },
          (error) => {
            console.error('Erreur lors de la récupération des recommandations:', error);
            this.errorMessage = 'Une erreur s\'est produite lors de la récupération des recommandations.';
          }
        );
      }
      removeDiscount(mealId: number) {
        this.mealservice.removeDiscount(mealId).subscribe({
          next: () => {
            console.log('Discount removed from meal');
            // On met à jour la liste locale sans recharger
            this.discountedMeals = this.discountedMeals.filter(meal => meal.mealId !== mealId);
          },
          error: (err) => console.error('Error removing discount:', err)
        });
      }
      
}
