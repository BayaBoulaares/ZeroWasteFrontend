import { Event } from "./event";

export class Menus {
  menuId?: number;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  imagePath?: string;
  price: number;

  constructor(
    menuId: number,
    name: string,
    description: string,
    startDate: Date,
    endDate: Date,
    price: number,
    imagePath?: string
  ) {
    this.menuId = menuId;
    this.name = name;
    this.description = description;
    this.startDate = startDate;
    this.endDate = endDate;
    this.price = price;
    this.imagePath = imagePath;
  }
}
