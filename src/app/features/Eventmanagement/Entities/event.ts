import { Menus } from './menus';

export interface Event {
    eventid?: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    imagePath?: string;
    valeurRemise: number;
    Nbr: number;
    menus?: Menus;
}

export class Event {
    eventid?: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    imagePath?: string;
    valeurRemise: number;
    Nbr: number;
    menus?: Menus;

    constructor(
        eventid?: number,
        title: string = '',
        description: string = '',
        startDate: string = '',
        endDate: string = '',
        imagePath: string = '',
        valeurRemise: number = 0,
        Nbr: number = 0,
        menus?: Menus
    ) {
        this.eventid = eventid;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.imagePath = imagePath;
        this.valeurRemise = valeurRemise;
        this.Nbr = Nbr;
        this.menus = menus;
    }

    getDuration(): number {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        return (end.getTime() - start.getTime()) / (1000 * 60); // duration in minutes
    }
}