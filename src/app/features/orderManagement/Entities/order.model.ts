import { Supplier } from '../Entities/supplier.model';
export interface Order {
  orderID: number;
  deliveryDate: any;
  orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'CONFIRMED';
  supplier: Supplier;
  ingredients: {  // Remplacez 'ingredient' par 'ingredients' (tableau)
    ingredient: any;  // Gardez votre type existant
    quantity: number;
  }[];
  quantity: number;
  ingredient?: any; 
  isUrgent?: boolean;  // Ou crée un modèle spécifique
}
