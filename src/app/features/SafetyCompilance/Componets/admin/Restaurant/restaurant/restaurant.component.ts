import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Restaurant, StatusRes } from 'src/app/features/SafetyCompilance/Entities/restaurant';
import { RestaurantService } from 'src/app/features/SafetyCompilance/Services/restaurant.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  // Add these properties for the chart
  cuisineChartData: any;
  cuisineChartOptions: any;


  


  selectedRestaurantId: number | null = null;






  filteredRestaurants: Restaurant[] = [];
  restaurantForm!: FormGroup;
  listRestaurant: Restaurant[] = [];
selectedRestaurant: any;

restaurantList: Restaurant[] = [];
filteredRestaurantList: Restaurant[] = [];
errorMessage: string = '';
 // 🔍 Search and Sort variables
 searchKeyword: string = '';



  constructor(
    private restService: RestaurantService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
   
    this.initializeForm();
    this.loadRestaurants();
    this.initializeCuisineChart();
  }

  initializeForm(): void {
    this.restaurantForm = new FormGroup({
    //  restaurantid:[this.selectedRestaurant.restaurantid],
      name: new FormControl('', [Validators.required, Validators.pattern(/^[A-Z][a-zA-Z\s-]*$/)]),
      location: new FormControl('', Validators.required),
      cuisineType: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      seatingCapacity: new FormControl('', [Validators.required, Validators.min(1)]),
      openingTime: new FormControl('', Validators.required),
      closingTime: new FormControl('', Validators.required),
      isActive: new FormControl(StatusRes.ACTIVE, Validators.required) // Initialize with enum value
    });
  }

  loadRestaurants(): void {
    this.restService.getAllRestaurants().subscribe({
      next: (data) => {
        this.listRestaurant = data;
        this.filteredRestaurants = [...data]; 
      },
      error: (err) => {
        console.error('Error loading restaurants:', err);
      }
    });
  }
  

  updateActiveStatus(event: any): void {
    const status = event.target.checked ? StatusRes.ACTIVE : StatusRes.INACTIVE;
    this.restaurantForm.get('isActive')?.setValue(status);
  }

  saveRestaurant(): void {
    if (this.restaurantForm.valid) {
      const rawForm = this.restaurantForm.value;
  
      // Format time strings to HH:mm:ss
      const formData = {
        ...rawForm,
        openingTime: this.appendSeconds(rawForm.openingTime),
        closingTime: this.appendSeconds(rawForm.closingTime)
      };
  
      this.restService.addRestaurant(formData).subscribe({
        next: () => {
          console.log('Restaurant added successfully');
          this.ngOnInit();
          this.restaurantForm.reset({
            isActive: StatusRes.ACTIVE
          });
        },
        error: (err) => {
          console.error('Error adding restaurant:', err);
        }
      });
    }
  }
  
  private appendSeconds(time: string): string {
    return time?.length === 5 ? `${time}:00` : time;
  }
  

  

  // Add these methods to your component class
  onEdit(restaurant: Restaurant) {
    // Populate the form with the restaurant data
    this.restaurantForm.patchValue({
      name: restaurant.name,
      location: restaurant.location,
      cuisineType: restaurant.cuisineType,
      phoneNumber: restaurant.phoneNumber,
      email: restaurant.email,
      seatingCapacity: restaurant.seatingCapacity,
      openingTime: restaurant.openingTime,
      closingTime: restaurant.closingTime,
      isActive: restaurant.isActive
    });
    this.selectedRestaurantId = restaurant.restaurantid;
  }
  
 // ... existing code ...

UpdateRestaurant() {
  if (this.restaurantForm.valid && this.selectedRestaurantId) {
    const formValues = this.restaurantForm.value;
    const updatedRestaurant = {
      ...formValues,
      restaurantid: this.selectedRestaurantId,
      openingTime: this.appendSeconds(formValues.openingTime),
      closingTime: this.appendSeconds(formValues.closingTime)
    };

    this.restService.updateRestaurant(updatedRestaurant, this.selectedRestaurantId).subscribe({
      next: (response) => {
        const index = this.restaurantList.findIndex((r: Restaurant) => r.restaurantid === this.selectedRestaurantId);
        if (index !== -1) {
          this.restaurantList[index] = response;
          this.filteredRestaurants = [...this.restaurantList];
        }
        alert('Restaurant updated successfully');
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error updating restaurant:', error);
        alert('Error updating restaurant');
      }
    });
  }
}

// ... existing code ...
  Details(arg0: number) {
    throw new Error('Method not implemented.');
    }


    
    
    
  
    searchRestaurant(): void {
      const keyword = this.searchKeyword.toLowerCase().trim();
      if (!keyword) {
        this.filteredRestaurants = [...this.listRestaurant];
      } else {
        this.filteredRestaurants = this.listRestaurant.filter(
          (insp) =>
            insp.name.toLowerCase().includes(keyword) ||
            insp.location.toLowerCase().includes(keyword) ||
            insp.isActive.toLowerCase().includes(keyword) ||
            insp.cuisineType.toLowerCase().includes(keyword) 
        );
      }
    }
  
   

onDelete(id: number) {
  if (confirm('Are you sure you want to delete this restaurant?')) {
    this.restService.deleteRestaurant(id).subscribe({
      next: () => {
        // Remove the restaurant from the local array
        this.restaurantList = this.restaurantList.filter((r: Restaurant) => r.restaurantid !== id);
        this.filteredRestaurants = this.filteredRestaurants.filter((r: Restaurant) => r.restaurantid !== id);
        // Show success message
        alert('Restaurant deleted successfully');
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error deleting restaurant:', error);
        alert('Error deleting restaurant');
      }
    });
  }
}
    

private initializeCuisineChart(): void {
  this.restService.getAllRestaurants().subscribe({
    next: (data) => {
      // Count occurrences of each cuisine type
      const cuisineCounts = data.reduce((acc: any, restaurant) => {
        acc[restaurant.cuisineType] = (acc[restaurant.cuisineType] || 0) + 1;
        return acc;
      }, {});

      // Prepare chart data
      const labels = Object.keys(cuisineCounts);
      const values = Object.values(cuisineCounts);

      this.cuisineChartData = {
        labels: labels,
        datasets: [{
          label: 'Number of Restaurants',
          data: values,
          backgroundColor: [
            'rgba(54, 162, 235, 0.8)',  // Blue
            'rgba(255, 99, 132, 0.8)',  // Red
            'rgba(255, 206, 86, 0.8)',  // Yellow
            'rgba(75, 192, 192, 0.8)',  // Green
            'rgba(153, 102, 255, 0.8)', // Purple
            'rgba(255, 159, 64, 0.8)'   // Orange
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
          ],
          borderWidth: 1
        }]
      };

      this.cuisineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false  // Hide legend since we have labels on x-axis
          },
          title: {
            display: true,
            text: 'Restaurant Cuisine Type Distribution',
            font: {
              size: 16
            }
          },
          tooltip: {
            callbacks: {
              label: function(context: any) {
                const value = context.raw;
                return `${value} restaurant${value !== 1 ? 's' : ''}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0
            },
            title: {
              display: true,
              text: 'Number of Restaurants'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Cuisine Types'
            }
          }
        }
      };
    },
    error: (err) => {
      console.error('Error loading restaurant data for chart:', err);
    }
  });
}
}


