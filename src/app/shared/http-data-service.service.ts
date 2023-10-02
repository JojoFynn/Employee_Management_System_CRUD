import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class HttpDataServiceService {

  constructor(private http: HttpClient) {}
  httpEndPoints = 'http://127.0.0.1:8000/api';
  
  //Fetch all Employee records
  fetchAllEmployees(){
    console.log("fetching all employees");
    return this.http.get<any>(`${this.httpEndPoints}/employees`);
  }
   
  //Add an Employee
   createEmployee(addEmployee:any){
    console.log("Created a new Employee");
    return this.http.post(`${this.httpEndPoints}/addEmployee`,addEmployee)
   }

  //Update a particular Employee by id
  updateEmployeeById(id:number,data:any){
    console.log("Update Employee");
    return this.http.put(`${this.httpEndPoints}/updateEmployee/${id}`,data)
  }
  
  //Fetch one Employee by id
  getEmployeeById(id:number){
    console.log(`Fetch Employee with id of ${id}`);
    return this.http.get<any>(`${this.httpEndPoints} /employee/${id}`)
  }

  //Delete Employee by id
  deleteEmployeeById(id:number){
    console.log(`Deleted an employee with id of ${id}`);
    return this.http.delete(`${this.httpEndPoints}/deleteEmployee/${id}`)
  }

}
