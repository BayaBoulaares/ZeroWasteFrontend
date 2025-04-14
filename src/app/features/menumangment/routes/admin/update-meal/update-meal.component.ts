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
  ingredientsList: Ingredients[] = [];
  mealIngredients: Ingredients[] = [];
  selectedFile: File | null = null;
  imagePreviewUrl: string | null = null;
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

    /*const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getMealById(+id);
    }*/
    const mealId = Number(this.route.snapshot.paramMap.get('id'));
    if (mealId) {
      this.getMealById(mealId);
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
          console.log("Meal récupéré :", mealData);

          // Mettre à jour les champs du formulaire
          this.mealForm.patchValue({
            name: mealData.name,
            description: mealData.description,
            category: mealData.category,
            price: mealData.price
          });

          // Charger l'image si elle existe
          if (mealData.imagePath) {
            this.imagePreviewUrl = `http://localhost:8089/gaspillagezero${mealData.imagePath}`;
          }

          // Récupérer les ingrédients associés au meal
          this.mealservice.getMealWithIngredients(id).subscribe({
            next: (ingredientsData) => {
              this.mealIngredients = ingredientsData;
              this.selectedIngredientIds = ingredientsData.map((ing: Ingredients) => ing.ingId);

              // Une fois les ingrédients associés chargés, récupérer tous les ingrédients
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
    const mealId = Number(this.route.snapshot.paramMap.get('id'));

    if (!mealId || isNaN(mealId)) {
      console.error('ID invalide');
      return;
    }

    this.mealservice.updateIngredients(mealId, this.selectedIngredientIds).subscribe({
      next: () => {
        console.log('Ingrédients du meal mis à jour avec succès !');

        this.getMealById(mealId);
        this.router.navigate(['/admin/mealsmanagement/meals']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour des ingrédients du meal', err);
      }
    });
  }

  /**
   * Gérer la sélection des ingrédients par l'utilisateur
   */
  toggleIngredientSelection(ingredientId: number) {
    if (this.selectedIngredientIds.includes(ingredientId)) {
      this.selectedIngredientIds = this.selectedIngredientIds.filter(id => id !== ingredientId);
    } else {
      this.selectedIngredientIds.push(ingredientId);
    }
  }
  onIngredientChange(ingredient: Ingredients, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.selectedIngredientIds.push(ingredient.ingId);
    } else {
      this.selectedIngredientIds = this.selectedIngredientIds.filter(id => id !== ingredient.ingId);
    }

    console.log("Ingrédients sélectionnés :", this.selectedIngredientIds);
  }


}
