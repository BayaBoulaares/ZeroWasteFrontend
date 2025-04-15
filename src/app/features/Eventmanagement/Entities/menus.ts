import { Event } from "./event";

export interface Menus {
    menuId: number;
    name: string;
    description: string;
    startDate: Date;
    endDate: Date;
    imagePath?: string;
    price: number;
}
