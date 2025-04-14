export class Users {

    constructor(
        public id: number,
        public email: string,
        public name: string,
        public city: string,
        public role: string,
        public enabled: boolean,
        public password?: string
      ) {}
    
      isAdmin(): boolean {
        return this.role === 'ADMIN';
      }
      
}
