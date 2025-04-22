import { Component, Input, OnInit } from '@angular/core';
import { Event } from '../../Entities/event';
import { AiDiscountService } from '../../Services/ai-discount.service';

@Component({
  selector: 'app-ai-discount-card',
  templateUrl: './ai-discount-card.component.html',
  styleUrls: ['./ai-discount-card.component.css']
})
export class AiDiscountCardComponent implements OnInit {
  @Input() event!: Event;
  
  dynamicDiscount: number = 0;
  discountExplanation: string = '';
  originalPrice: number = 0;
  discountedPrice: number = 0;
  recommendationSource: string = '';
  
  constructor(private aiDiscountService: AiDiscountService) { }

  ngOnInit(): void {
    this.calculateDiscount();
  }
  
  calculateDiscount(): void {
    if (this.event && this.event.menus) {
      // Get complete discount info from the service
      const discountInfo = this.aiDiscountService.getDiscountInfo(this.event);
      
      // Update component properties
      this.originalPrice = discountInfo.originalPrice;
      this.dynamicDiscount = discountInfo.dynamicDiscount;
      this.discountedPrice = discountInfo.discountedPrice;
      this.discountExplanation = discountInfo.explanation;
      this.recommendationSource = discountInfo.recommendationSource;
    }
  }
  
  isDiscountActive(): boolean {
    return this.dynamicDiscount > 0;
  }
}
