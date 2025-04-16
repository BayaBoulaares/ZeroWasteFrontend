export interface InvoiceItem {
  productName: string;
  productPrice: string; 
  quantity: number;
}

  
  export interface Invoice {
    id?: number;
    date?: string;
    dueDate?: Date;
    status?: string;
    total?: number;
    user: {
      id: number;
      name?: string;
    };
    items: InvoiceItem[];
  }
  