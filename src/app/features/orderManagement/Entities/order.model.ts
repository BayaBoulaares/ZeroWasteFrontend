import { Supplier } from '../Entities/supplier.model';
export interface Order {
  orderID?: number;
  deliveryDate: any;
    quantity: number;
  orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELED' | 'CONFIRMED';
  supplier: Supplier;
  ingredient?: any; // Ou crée un modèle spécifique
}
