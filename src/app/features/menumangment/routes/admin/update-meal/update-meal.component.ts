import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredients } from '../../../Entities/ingredients';
import { MealsService } from '../../../Services/meals.service';


@Component({
  selector: 'app-update-meal',
  templateUrl: './update-meal.component.html',
  styleUrls: ['./update-meal.component.css']
})
export class UpdateMealComponent implements OnInit {
  selectedIngredientIds: number[] = [];
  mealForm!: FormGroup;
  allIngredients: Ingredients[] = [];
  //ingredientsList: Ingredients[] = [];
  //mealIngredients: Ingredients[] = [];

  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
  mealId!: number;
  //mealIngredientss: any[] = [];  // Tableau d'ingrédients associés au repas
  //selectedIngredientIds: number[] = [];
  isEditable: boolean = true; // Indicateur pour savoir si l'édition est autorisée
  constructor(private fb: FormBuilder, private mealservice: MealsService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.mealForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      category: ['', Validators.required],
      imagePath: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      ingredients: this.fb.array([])
    });
  
    const mealId = Number(this.route.snapshot.paramMap.get('id'));
    if (mealId) {
      this.mealId = mealId;
      this.getMealById(mealId);
    } else {
      console.error('ID du repas est manquant');
    }
  }
  
  /**
  * Récupérer la liste des ingrédients disponibles dans la base de données
  */
  getAllIngredients() {
    this.mealservice.getIngredients().subscribe({
      next: (data) => {
        this.ingredientsList = data.map(ingredient => ({
          ...ingredient,
          checked: this.selectedIngredientIds.includes(ingredient.ingId)
        }));
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des ingrédients", err);
      }
    });
  }

  /*getMealById(id: number) {
   this.mealservice.getMeal(id).subscribe({
     next: (data) => {
       this.formdata2 = data;
     },
     error: (err) => {
       console.error('Erreur lors de la récupération de l’ingrédient', err);
     }
   });
 }*/
   getMealById(id: number) {
    this.mealservice.getMeal(id).subscribe({
      next: (mealData) => {
        if (mealData) {
          this.mealForm.patchValue({
            name: mealData.name,
            description: mealData.description,
            category: mealData.category,
            price: mealData.price
          });
  
          if (mealData.imagePath) {
            this.imagePreviewUrl = `http://localhost:8089/gaspillagezero${mealData.imagePath}`;
          }
  
          // Récupérer les ingrédients associés avec les bonnes quantités
          this.mealservice.getMealIngredientsWithQuantities(id).subscribe({
            next: (ingredientsData) => {
              this.mealIngredients = ingredientsData;
  
              // On remplit le FormArray
              const ingredientsFormArray = this.mealForm.get('ingredients') as FormArray;
              ingredientsFormArray.clear(); // important
  
              this.mealIngredients.forEach(ingredient => {
                ingredientsFormArray.push(this.fb.group({
                  ingredientId: [ingredient.ingredientId],
                  quantity: [ingredient.quantity] // quantité spécifique au repas
                }));
              });
  
              // Chargement de tous les ingrédients possibles si besoin
              this.getAllIngredients();
            },
            error: (err) => {
              console.error("Erreur lors de la récupération des ingrédients du meal", err);
            }
          });
        }
      },
      error: (err) => {
        console.error("Erreur lors de la récupération du meal", err);
      }
    });
  }
  

  /*update(){
    this.mealservice.update(this.formdata2).subscribe({
      next: (response) => {
        console.log('meal mis à jour avec succès !', response);
        // Rediriger après la mise à jour
        this.router.navigate(['/mealsmanagement/meals']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
      }
    });
  }*/
  get ingredients() {
    return (this.mealForm.get('ingredients') as FormArray);
  }

  addIngredient(ingredient: Ingredients) {
    this.ingredients.push(this.fb.group({
      id: [ingredient.ingId, Validators.required],
      name: [ingredient.name, Validators.required]
    }));
  }
  update() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      console.error('ID is missing');
      return;
    }

    // Convertir l'ID en nombre
    const mealId = Number(id);
    if (isNaN(mealId)) {
      console.error('ID invalide');
      return;
    }

    if (this.mealForm.invalid) {
      alert('Veuillez remplir correctement tous les champs.');
      return;
    }

    // Log les ingrédients sélectionnés
    const selectedIngredients = (this.mealForm.get('ingredients') as FormArray).value.map((ingredient: { ingId: number }) => ingredient.ingId);
    console.log('Ingrédients sélectionnés:', selectedIngredients);

    // Créer un FormData pour envoyer le fichier et les autres données
    const formData = new FormData();
    formData.append('meal', new Blob([JSON.stringify({
      ...this.mealForm.value,
      ingredients: selectedIngredients // Ajouter la liste des ingrédients
    })], { type: 'application/json' }));

    if (this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    }

    // Appeler le service pour mettre à jour le meal
    this.mealservice.updateMealuWithImage(mealId, formData).subscribe({
      next: () => {
        console.log('Meal mis à jour avec succès !');
        this.router.navigate(['/admin/mealsmanagement/meals']);
      },
      error: (err) => {
        console.error('Erreur mise à jour', err);
      }
    });
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Ensure only image files are selected
      if (!file.type.startsWith('image/')) {
        console.error('Veuillez sélectionner une image valide.');
        return;
      }

      this.selectedFile = file;

      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  updateMealIngredients() {
    if (!this.mealId) {
      console.error('ID du repas est manquant');
      return;
    }
  
    const updatedIngredients = this.mealIngredients.map((ingredient: any) => ({
      ingredientId: ingredient.ingredientId,
      quantity: ingredient.quantity
    }));
  
    this.mealservice.updateMealIngredients(this.mealId, updatedIngredients).subscribe({
      next: (response) => {
        console.log('Ingrédients mis à jour avec succès', response);
        this.router.navigate(['/admin/mealsmanagement/meals']); // remplace '/meals' par la route que tu veux
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour des ingrédients', error);
      }
    });
  }
  
  /**
   * Gérer la sélection des ingrédients par l'utilisateur
   */
  /*toggleIngredientSelection(ingredientId: number) {
    if (this.selectedIngredientIds.includes(ingredientId)) {
      this.selectedIngredientIds = this.selectedIngredientIds.filter(id => id !== ingredientId);
    } else {
      this.selectedIngredientIds.push(ingredientId);
    }
  }*/
  onIngredientChange(ingredient: Ingredients, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedIngredientIds.push(ingredient.ingId);
    } else {
      this.selectedIngredientIds = this.selectedIngredientIds.filter(id => id !== ingredient.ingId);
    }

    console.log("Ingrédients sélectionnés :", this.selectedIngredientIds);
  }

  // Exemple de structure des données
  mealIngredients: Array<{ ingredientId: number, quantity: number }> = [];
  ingredientsList: Array<{ ingId: number, name: string, quantity: number }> = [];
  
  // Vérifie si l'ingrédient est sélectionné
  isIngredientSelected(ingId: number): boolean {
    return this.mealIngredients.some(ing => ing.ingredientId === ingId);
  }
  
  // Obtenir la quantité d'un ingrédient, ou 0 si non trouvé
  getIngredientQuantity(ingredientId: number): number {
    const mealIng = this.mealIngredients.find(mealIng => mealIng.ingredientId === ingredientId);
    return mealIng ? mealIng.quantity : 0;
  }

  // Méthode pour basculer l'état de sélection
  toggleIngredientSelection(ingredientId: number): void {
    // Logique pour gérer la sélection/désélection
    const index = this.mealIngredients.findIndex(mealIng => mealIng.ingredientId === ingredientId);
    if (index !== -1) {
      this.mealIngredients.splice(index, 1); // Désélectionner
    } else {
      this.mealIngredients.push({ ingredientId, quantity: 0 }); // Sélectionner avec une quantité initiale de 0
    }
  }
  getMealIngredientById(ingredientId: number) {
    return this.mealIngredients.find(ing => ing.ingredientId === ingredientId) || { ingredientId, quantity: 0 };
  }
  
}