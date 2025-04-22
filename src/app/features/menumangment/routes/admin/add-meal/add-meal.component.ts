import { Component, OnInit } from '@angular/core';
import { Ingredients } from '../../../Entities/ingredients';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MealsService } from '../../../Services/meals.service';
import { Router } from '@angular/router';
import { MealCategory } from '../../../Entities/meals';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.css']
})
export class AddMealComponent  implements OnInit {
  mealId: number = 0;
  currentIngredients: any[] = []; 
  allIngredients: Ingredients[] = [];     
  selectedIngredientIds: number[] = []; 
  selectedIngredients: Map<number, number> = new Map(); 
  mealForm: FormGroup;
  ingredientsList: Ingredients[] = []; 
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;  
  ingredientErrors: Map<number, string> = new Map();

  constructor(private fb: FormBuilder,private mealservice: MealsService,private router: Router) {
    this.mealForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category:['', [Validators.required]],
      imagePath: [''],
      price: ['', [Validators.required, Validators.min(0.01)]],
      
    });
  }
  ngOnInit(): void {
       this.loadAllIngredients();

       if (this.mealId) {
         this.loadMealIngredients();
       }

  }
  loadMealIngredients(): void {
    this.mealservice.getMealWithIngredients(this.mealId).subscribe(
      (ingredients) => {
        this.currentIngredients = ingredients;
        this.selectedIngredientIds = ingredients.map((ingredient: any) => ingredient.id); 
      },
      (error) => {
        console.error('Error loading ingredients', error);
      }
    );
  }
    // Charger tous les ingrédients
    loadAllIngredients(): void {
      this.mealservice.getIngredients().subscribe(
        (ingredients) => {
          this.allIngredients = ingredients;
        },
        (error) => {
          console.error('Erreur lors du chargement des ingrédients', error);
        }
      );
    }
 
    onIngredientChange(event: any, ingredient: Ingredients): void {
      if (event.target.checked) {
        this.selectedIngredientIds.push(ingredient.ingId);
        this.selectedIngredients.set(ingredient.ingId, 1); 
      } else {
        this.selectedIngredientIds = this.selectedIngredientIds.filter(id => id !== ingredient.ingId);
        this.selectedIngredients.delete(ingredient.ingId);
      }
    
      console.log('Ingrédients sélectionnés:', this.selectedIngredients);
    }
    
  
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  

    mealCategories = Object.values(MealCategory); 
    onSubmit(): void {
      if (this.mealForm.invalid || !this.selectedFile) {
        alert('Veuillez remplir correctement tous les champs.');
        return;
      }
  
      const formData = new FormData();
      const mealData = {
        name: this.mealForm.value.name,
        description: this.mealForm.value.description,
        category: this.mealForm.value.category,
        price: this.mealForm.value.price,
      };
  
      formData.append('meal', new Blob([JSON.stringify(mealData)], { type: 'application/json' }));
  
      const ingredientsArray = Array.from(this.selectedIngredients.entries()).map(
        ([ingId, quantity]) => ({ ingId, quantity })
      );
      formData.append('ingredients', new Blob([JSON.stringify(ingredientsArray)], { type: 'application/json' }));
  
      if (this.selectedFile) {
        formData.append('imageFile', this.selectedFile);
      }
  
      this.mealservice.addMealWithImage(formData).subscribe({
        next: () => {
          this.router.navigate(['/admin/mealsmanagement/meals']);
        },
        error: (error) => {
          console.error('Erreur lors de l’ajout du menu :', error);
        }
      });
    }
    
    toggleIngredientSelection(ingredient: any): void {
      if (this.selectedIngredients.has(ingredient.ingId)) {
        this.selectedIngredients.delete(ingredient.ingId);
      } else {
        this.selectedIngredients.set(ingredient.ingId, 1); 
      }
    }
    updateIngredientQuantity(ingId: number, newQuantity: number): void {
      this.selectedIngredients.set(ingId, newQuantity);

    }
    onQuantityChange(ingredientId: number | undefined, event: Event): void {
      const inputElement = event.target as HTMLInputElement;
      const value = inputElement?.value;
    
      if (ingredientId !== undefined && value !== undefined) {
        const parsedQuantity = parseInt(value, 10);
        const ingredient = this.allIngredients.find(ing => ing.ingId === ingredientId);
    
        if (ingredient && parsedQuantity >= 0 && parsedQuantity <= ingredient.quantity) {
          this.ingredientErrors.delete(ingredientId); // Efface l'erreur si tout est bon
    
          if (parsedQuantity > 0) {
            this.selectedIngredients.set(ingredientId, parsedQuantity);
          } else {
            this.selectedIngredients.delete(ingredientId);
          }
        } else {
          inputElement.value = ingredient?.quantity.toString() || '0';
    
          this.ingredientErrors.set(
            ingredientId,
            `La quantité doit être comprise entre 1 et ${ingredient?.quantity}`
          );
        }
      }
    }
    
    getRemainingQuantity(ingredient: Ingredients): number {
      const selectedQuantity = this.selectedIngredients.get(ingredient.ingId) || 0;
      return ingredient.quantity - selectedQuantity;
    }
    
    
    
}
