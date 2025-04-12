import { Component, OnInit } from '@angular/core';
import { IngredientsService } from '../../../Services/ingredients.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Ingredients } from '../../../Entities/ingredients';

@Component({
  selector: 'app-update-ingredient',
  templateUrl: './update-ingredient.component.html',
  styleUrls: ['./update-ingredient.component.css']
})
export class UpdateIngredientComponent implements OnInit{
  
  constructor(private ingredientservice : IngredientsService, private router: Router,private route: ActivatedRoute, private fb: FormBuilder ){
    
  }
  ingredientForm!: FormGroup;
  formdata : Ingredients={
    ingId: 0,  
    name: '',
    quantity: 0,
    unit: '',
    required: false,
    pricePerUnit: 0,
    expirationDate: new Date

  }
  
  units: string[] = ['g', 'kg', 'ml', 'L', 'cup', 'tbsp', 'tsp'];
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getIngredientById(+id);
    }

    this.ingredientForm = this.fb.group({
      name: [this.formdata.name, [Validators.required, Validators.minLength(3)]],
      quantity: [this.formdata.quantity, [Validators.required, Validators.min(1)]],
      unit: [this.formdata.unit, Validators.required],
      pricePerUnit: [this.formdata.pricePerUnit, [Validators.required, Validators.min(0)]],
      expirationDate: [this.formdata.expirationDate, [Validators.required, this.expirationDateValidator.bind(this)]],
      required: [this.formdata.required]
    });
  }
  expirationDateValidator(control: any) {
    if (!control.value) return null; // Si aucun contrôle, pas d'erreur
  
    const selectedDate = new Date(control.value);
    const today = new Date();
    const minExpirationDate = new Date(today);
    minExpirationDate.setMonth(minExpirationDate.getMonth() + 6); // Date minimum après 6 mois
  
    return selectedDate >= minExpirationDate ? null : { expirationTooSoon: true }; // Si la date est trop proche
  }
  getIngredientById(id: number) {
    this.ingredientservice.getIngredient(id).subscribe({
      next: (data) => {
        this.formdata = data;

        // Assurez-vous que expirationDate est au bon format si c'est une chaîne de caractères
        if (typeof this.formdata.expirationDate === 'string') {
          this.formdata.expirationDate = new Date(this.formdata.expirationDate);
        }

        // Formater expirationDate en format correct (YYYY-MM-DD)
        const formattedExpirationDate = this.formdata.expirationDate?.toISOString().split('T')[0];

        // Utilisation de patchValue pour mettre à jour les valeurs du formulaire
        this.ingredientForm.patchValue({
          name: this.formdata.name,
          quantity: this.formdata.quantity,
          unit: this.formdata.unit,
          pricePerUnit: this.formdata.pricePerUnit,
          expirationDate: formattedExpirationDate, // Mettre à jour expirationDate
          required: this.formdata.required
        });
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de l’ingrédient', err);
      }
    });
  }

  update() {
    if (this.ingredientForm.invalid) {
      console.log('Le formulaire est invalide');
      return; // Stop if the form is invalid
    }
    this.formdata = { ...this.formdata, ...this.ingredientForm.value };
    this.ingredientservice.update(this.formdata).subscribe({
      next: (response) => {
        console.log('Ingrédient mis à jour avec succès !', response);
        // Rediriger après la mise à jour
        this.router.navigate(['/admin/mealsmanagement/ingredients']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour', err);
      }
    });
  }

}
