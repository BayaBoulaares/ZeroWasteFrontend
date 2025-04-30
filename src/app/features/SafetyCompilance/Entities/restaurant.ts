export enum StatusRes {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE'
  }
  
  export class Restaurant {
    restaurantid: number;
      name: string;
      location: string;
      cuisineType: string;
      phoneNumber: string;
      email: string;
      seatingCapacity: number;
      openingTime: Date;
      closingTime: Date;
      isActive: StatusRes;  // Using enum type here
  
      constructor(
        restaurantid: number = 0,
          name: string = '',
          location: string = '',
          cuisineType: string = '',
          phoneNumber: string = '',
          email: string = '',
          seatingCapacity: number = 0,
          openingTime: Date = new Date(),
          closingTime: Date = new Date(),
          isActive: string = 'ACTIVE'  // Still accepting string for flexibility
      ) {
          this.restaurantid = restaurantid;
          this.name = name;
          this.location = location;
          this.cuisineType = cuisineType;
          this.phoneNumber = phoneNumber;
          this.email = email;
          this.seatingCapacity = seatingCapacity;
          this.openingTime = openingTime;
          this.closingTime = closingTime;
          this.isActive = this.parseStatus(isActive);  // Convert string to enum
      }
  
      private parseStatus(status: string): StatusRes {
          // Convert string to enum value safely
          if (status === StatusRes.ACTIVE) return StatusRes.ACTIVE;
          if (status === StatusRes.INACTIVE) return StatusRes.INACTIVE;
          return StatusRes.ACTIVE;  // Default value
      }
  }