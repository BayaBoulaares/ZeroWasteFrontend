import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Restaurant } from 'src/app/features/SafetyCompilance/Entities/restaurant';
import { RestaurantService } from 'src/app/features/SafetyCompilance/Services/restaurant.service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.css']
})
export class RestaurantComponent implements OnInit {
  
  listRestaurant:Restaurant[]=[]

  constructor( private restService:RestaurantService, private route: ActivatedRoute){}
  
  ngOnInit(): void {
    this.restService.getAllRestaurants().subscribe((data)=> {this.listRestaurant=data } )
  }
  

}
