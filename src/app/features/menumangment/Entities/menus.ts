import { Meals } from "./meals"

export class Menus {
     menuId: number
     name: string
     description:string
     startDate: Date
     endDate: Date
     imagePath: string
     price: number
     meals?: Meals[];
     constructor(menuId: number, name: string, description: string,startDate: Date, endDate: Date,imagePath: string,price: number) {
           this.menuId = menuId;
           this.name = name;
           this.description = description;
           this.startDate = startDate;
           this.endDate = endDate;
           this.imagePath = imagePath; 
           this.price = price;
          
    }
}
