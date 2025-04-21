import { Meals } from "./meals";
export class Ingredients {
    ingId: number;
    name: string;
     quantity: number;
     unit : string;
     required: boolean;
     pricePerUnit: number
     meals?: Meals[]; 
     expirationDate ?: Date; 
     status?: string;
     stock? : number;
     constructor(
        ingId: number = 0, 
        name: string = '', 
        quantity: number = 0, 
        unit: string = '', 
        required: boolean = false, 
        pricePerUnit: number = 0.0,
        stock : 0
        
    ) {
        this.ingId = ingId;
        this.name = name;
        this.quantity = quantity;
        this.unit = unit;
        this.required = required;
        this.pricePerUnit = pricePerUnit ,
        this.stock = stock
       }
}
