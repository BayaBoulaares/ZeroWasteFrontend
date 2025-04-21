import { Component } from '@angular/core';
import { MealsService } from '../../../Services/meals.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-airecomendation',
  templateUrl: './airecomendation.component.html',
  styleUrls: ['./airecomendation.component.css']
})
export class AirecomendationComponent {
    mealRecommendations: any[] = [];
    constructor(private mealservice: MealsService, private fb: FormBuilder) {
    
    }
    requestData = {
      season: '',
      event:'',
      local_habit:'',
      trend_score: '',
    };
    errorMessage: string = '';

  onSubmit() {
    this.mealservice.getMealRecommendations(this.requestData).subscribe(
      (data) => {
       
        this.mealRecommendations = data;
        this.errorMessage = ''; 
      },
      (error) => {
        console.error('Error while fetching recommendations:', error);
        this.errorMessage = 'An error occurred while fetching the recommendations.';
      }
    );
  }
}
