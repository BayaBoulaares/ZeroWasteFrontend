import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IngredientsService } from '../../../Services/ingredients.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-ingredient',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.css']
})
export class AddIngredientComponent {
  ingredientForm: FormGroup;
  units: string[] = ['g', 'kg', 'ml', 'L', 'cup', 'tbsp', 'tsp'];

  constructor(
    private fb: FormBuilder,
    private ingredientsService: IngredientsService,
    private router: Router
  ) {
    this.ingredientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      unit: ['', [Validators.required]],
      required: [false],
      pricePerUnit: [0, [Validators.required, Validators.min(1)]],
      expirationDate: ['', [Validators.required, this.expirationDateValidator]],
    });
  }

  expirationDateValidator(control: any) {
    if (!control.value) return null; 
  
    const selectedDate = new Date(control.value);
    const today = new Date();
    const minExpirationDate = new Date(today);
    minExpirationDate.setMonth(minExpirationDate.getMonth() + 6); 
  
    return selectedDate >= minExpirationDate ? null : { expirationTooSoon: true }; 
  }
  onSubmit(): void {
    if (this.ingredientForm.valid) {
      this.ingredientsService.addIngredient(this.ingredientForm.value).subscribe({
        next: () => this.router.navigate(['/admin/mealsmanagement/ingredients']),
        error: (err) => console.log(err),
      });
    } else {
      console.log("Formulaire invalide");
    }
  }
}
