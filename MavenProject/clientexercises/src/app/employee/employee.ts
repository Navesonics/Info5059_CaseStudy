//employee.ts
export interface Employee {
  /**
  * Employee - interface for an employee entity
  */
  id: number;
  title: string;
  firstname: string;
  lastname: string;
  phoneno: string; // or just phone, depending on what’s in your server
  email: string;
}
