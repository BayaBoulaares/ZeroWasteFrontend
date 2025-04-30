import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Product } from '../../../Entities/product';
import { ProductStatisticsService } from '../../../Services/product-statistics.service';

Chart.register(...registerables);

@Component({
  selector: 'app-stock-static',
  templateUrl: './stock-static.component.html',
  styleUrls: ['./stock-static.component.css']
})
export class StockStaticComponent implements OnInit {
  dashboardData: any;
  categoryChart: any;
  stockChart: any;
  lowStockProducts: Product[] = [];
  expiringProducts: Product[] = [];
  outOfStockProducts: Product[] = [];
  topExpensiveProducts: Product[] = [];

  constructor(private statisticsService: ProductStatisticsService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.statisticsService.getDashboardStatistics().subscribe(
      (data) => {
        this.dashboardData = data;
        this.lowStockProducts = data.lowStockProducts;
        this.expiringProducts = data.expiringIn7Days;
        this.outOfStockProducts = data.outOfStockProducts;
        this.topExpensiveProducts = data.topExpensiveProducts;
        this.createCategoryChart(data.categoryDistribution);
        this.createStockChart(data.averageStockByCategory);
      }
    );
  }

  createCategoryChart(data: any) {
    const ctx = document.getElementById('categoryChart') as HTMLCanvasElement;
    this.categoryChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: Object.keys(data),
        datasets: [{
          data: Object.values(data),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
            '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56'
          ]
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Product Distribution by Category'
          }
        }
      }
    });
  }

  createStockChart(data: any) {
    const ctx = document.getElementById('stockChart') as HTMLCanvasElement;
    this.stockChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(data),
        datasets: [{
          label: 'Average Stock Level',
          data: Object.values(data),
          backgroundColor: '#36A2EB'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Average Stock by Category'
          }
        }
      }
    });
  }
}