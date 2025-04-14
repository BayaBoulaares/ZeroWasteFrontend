import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Meals } from 'src/app/features/menumangment/Entities/meals';
import { MealsService } from 'src/app/features/menumangment/Services/meals.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mealLabels: string[] = [];
  mealData: number[] = [];


  public pieChartType: ChartType = 'doughnut';
  public pieChartLegend = true;

  constructor(private mealService: MealsService) { }

  pieChartPlugins = [];

  pieChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: false,
      }
    }
  };

  pieChartData = {
    labels: this.mealLabels,
    datasets: [
      {
        data: this.mealData,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], // Couleurs pour 5 meals
      }
    ]
  };

  // Remplissage dynamique des labels + data
  ngOnInit(): void {
    this.mealService.getTopMeals().subscribe((meals: Meals[]) => {
      this.mealLabels = meals.map(meal => meal.name);
      this.mealData = meals.map(meal => meal.orderCount);

      // Mettre à jour le dataset pour refléter les nouvelles données
      this.pieChartData = {
        labels: this.mealLabels,
        datasets: [
          {
            data: this.mealData,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF']
          }
        ]
      };
    });
  }
}


