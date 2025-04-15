export class Restaurant {
    restaurantId: number;
    name: string;
    location: string;
    cuisineType: string;       // e.g., Italian, Mexican, Asian
    phoneNumber: string;      // Contact number
    email: string;            // Contact email
    seatingCapacity: number;  // Max number of customers
    openingTime: Date;        // Opening hours
    closingTime: Date;        // Closing hours
    isActive: boolean;        // Is the restaurant operational?

    constructor(
        restaurantId: number = 0,
        name: string = '',
        location: string = '',
        cuisineType: string = '',
        phoneNumber: string = '',
        email: string = '',
        seatingCapacity: number = 0,
        openingTime: Date = new Date(),
        closingTime: Date = new Date(),
        isActive: boolean = false
    ) {
        this.restaurantId = restaurantId;
        this.name = name;
        this.location = location;
        this.cuisineType = cuisineType;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.seatingCapacity = seatingCapacity;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.isActive = isActive;
    }
}