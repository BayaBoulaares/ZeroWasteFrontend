import { ProductCategory } from "./product-category"

export class Product {
    productID: number
  productName: string
  category:ProductCategory
  ExprireDate: Date
  stockLevel: number
  productDescription: string
  productPrice: number
  imgPath: string
  orderKg: number
  constructor(productID: number, productName: string, category: ProductCategory,ExprireDate: Date,stockLevel: number, productDescription: string, productPrice:number, imgPath:string, orderKg: number) {
    this.productID = productID;
    this.productName = productName;
    this.category = category;
    this.ExprireDate = ExprireDate;
    this.stockLevel = stockLevel;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.imgPath = imgPath;
    this.orderKg = orderKg;

  }
}
