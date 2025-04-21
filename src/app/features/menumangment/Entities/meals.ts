import { Ingredients } from "./ingredients";
export enum MealCategory {
  BRUNCH = 'Brunch',
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  DESSERT = 'Dessert'
}
export class Meals {
  mealId: number;
  name: string;
  description: string;
  category: MealCategory;
  price: number;
  imagePath: string;
  discountedPrice: number;
  ingredients?: Ingredients[];
  orderCount: number;
  averageRating?: number;

  constructor(mealId: number, name: string, description: string, category: MealCategory, price: number, imagePath: string, discountedPrice: number, orderCount: number) {
    this.mealId = mealId;
    this.name = name;
    this.description = description;
    this.category = category;
    this.price = price;
    this.discountedPrice = discountedPrice;
    this.imagePath = imagePath;
    this.orderCount = orderCount

  }
}
