import { Component, OnInit } from '@angular/core';
import { IngredientsService } from '../../../Services/ingredients.service';
import { Ingredients } from '../../../Entities/ingredients';


@Component({
  selector: 'app-ingredients',
  templateUrl: './ingredients.component.html',
  styleUrls: ['./ingredients.component.css']
})
export class IngredientsComponent implements OnInit {
  ingredients: Ingredients[] = [];
  searchTerm: string = '';
  alerts: { type: string, message: string }[] = [];


  constructor(private ingservice: IngredientsService) { }

  ngOnInit(): void {
    this.getIngredients();
  }

  public getIngredients() {
    this.ingservice.getIngredients().subscribe(
      (data: Ingredients[]) => {
        const today = new Date();
        this.alerts = [];

        this.ingredients = data.map((ing) => {
          const expirationDate = ing.expirationDate ? new Date(ing.expirationDate) : new Date(Infinity);
          let status = 'Valid';

          if (expirationDate < today) {
            status = 'Expired';
            this.alerts.push({ type: 'alert-danger', message: `❌ The ingredient"${ing.name}" has expired !` });
          } else if ((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 7) {
            status = 'Expiring Soon';
            this.alerts.push({ type: 'alert-warning', message: `⚠️ The ingredient "${ing.name}" is expiring soon!` });
          }

          return { ...ing, expirationDate, status };
        }).sort((a, b) => a.expirationDate.getTime() - b.expirationDate.getTime());
      },
      (error) => {
        console.error('Error fetching ingredients:', error);
      }
    );
  }

  deleteItem(ingredientId: number): void {
    this.ingservice.delete(ingredientId).subscribe(() => {
      this.getIngredients();
    });
  }

  update(ingredientId: number): void {
    console.log('Update triggered for ID:', ingredientId);
    this.getIngredients();
  }

  searchIngredient(): void {
    if (this.searchTerm.trim()) {
      // Recherche dans les ingrédients déjà récupérés et filtre en fonction du nom
      this.ingservice.searchIngredient(this.searchTerm).subscribe(data => {
        const today = new Date();

        // Recalculer le status pour chaque ingrédient retourné
        this.ingredients = data.map((ing) => {
          const expirationDate = ing.expirationDate ? new Date(ing.expirationDate) : new Date(Infinity);
          let status = 'Valid';

          if (expirationDate < today) {
            status = 'Expired';
          } else if ((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 7) {
            status = 'Expiring Soon';
          }

          return { ...ing, expirationDate, status };
        });
      });
    } else {
      // Si la recherche est vide, afficher tous les ingrédients
      this.getIngredients();
    }
  }

  getStatusClass(status: string | undefined): string {
    if (!status) {
      return 'badge bg-label-secondary me-1'; // valeur par défaut
    }

    const normalizedStatus = status.trim();
    switch (normalizedStatus) {
      case 'Valid':
        return 'badge bg-label-success me-1';
      case 'Expired':
        return 'badge bg-label-warning me-1';
      case 'Expiring Soon':
        return 'badge bg-label-info me-1';
      default:
        return 'badge bg-label-secondary me-1';
    }
  }


}
