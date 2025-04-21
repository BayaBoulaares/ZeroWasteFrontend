import { Menus } from './menus';

export interface Event {
    eventid?: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    imagePath?: string;
    valeurRemise: number;
    menu?: Menus;
}

export class Event {
    eventid?: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    imagePath?: string;
    valeurRemise: number;
    menu?: Menus;
  
    constructor(
      eventid?: number,
      title: string = '',
      description: string = '',
      startDate: string = '',
      endDate: string = '',
      imagePath: string = '',
      valeurRemise: number = 0,
      menu?: Menus
    ) {
      this.eventid = eventid;
      this.title = title;
      this.description = description;
      this.startDate = startDate;
      this.endDate = endDate;
      this.imagePath = imagePath;
      this.valeurRemise = valeurRemise;
      this.menu = menu;
    }
  
    getDuration(): number {
      const start = new Date(this.startDate);
      const end = new Date(this.endDate);
      return (end.getTime() - start.getTime()) / (1000 * 60); // duration in minutes
    }
  }