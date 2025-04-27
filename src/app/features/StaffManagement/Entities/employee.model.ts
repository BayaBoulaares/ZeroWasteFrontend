import { Users } from "../../userManagement/Entities/users.model";

export interface Employee extends Users{
    //id: number;
    //name: string;
    employeeRole: string;
    //email: string;
    salary: number;
    hiredate: string;

  }