import { Component, OnInit, OnDestroy} from '@angular/core';
import { EmployeeModel } from '../shared/employee.model';
import { HttpDataServiceService } from '../shared/http-data-service.service';
import { Router } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeDashboardComponent implements OnInit,OnDestroy {
  loadedEmployees: EmployeeModel[] = [];
  employeeName!: string;
  employeeId!: number;
  employeeEmail!:any;
  employeeSalary!: number;
  closeResult: string = '';
  private fetchEmployeesSubscription!: Subscription;

  constructor(
    private httpdataservice: HttpDataServiceService, 
    private modalService: NgbModal,
    private router: Router,
    private toast : NgToastService
  ) {}

  ngOnInit() {
    this.fetchEmployees();
  }

  ngOnDestroy() {
      this.fetchEmployeesSubscription.unsubscribe();
  }

  breadcrumb() {
    this.router.navigate(['home']);
  }


  fetchEmployees() {
    this.fetchEmployeesSubscription = this.httpdataservice.fetchAllEmployees().subscribe({
      next: (posts) => {
        console.log(posts);
        this.loadedEmployees = posts.reverse();
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.showErrorMessage('Error fetching employees');
      }
    }
    );
  }

  onCreateEmployee(postData:any) {

    // Regular expression pattern for basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!postData.name || !postData.email || !postData.salary) {
    this.showErrorMessage('Please fill in all fields');
    return;
        }
    
    if (!emailPattern.test(postData.email)) {
       this.showErrorMessage('Incorrect email format');
        return;
      }

    this.httpdataservice.createEmployee(postData).subscribe({
     next : (posts:any) => {
        console.log(posts);
        this.loadedEmployees.unshift(posts);
        this.modalService.dismissAll('Submit success');
        this.fetchEmployees();
        this.showSuccessMessage('Employee successfully created');
      },
      error:(error) => {
        console.error('Error creating employee:', error);
      }
    });
    }

  onDeleteEmployee() {
    this.httpdataservice.deleteEmployeeById(this.employeeId).subscribe(
      {
        next : (posts:any) =>  {
          console.log(posts);
          this.modalService.dismissAll('Submit success');
          this.fetchEmployees();
          this.showSuccessMessage('Employee successfully deleted');
        },
        error:(error) => {
            console.error('Error deleting employee:', error);
            this.showErrorMessage('Error deleting employee');
        }
      });
  }

  onEditEmployee(newData: EmployeeModel) {

    // Regular expression pattern for basic email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newData.name || !newData.email || !newData.salary) {
        this.showErrorMessage('Please fill in all fields');
        return;
    }

    if (!emailPattern.test(newData.email)) {
        this.showErrorMessage('Incorrect email format');
        return;
    }

    this.httpdataservice.updateEmployeeById(this.employeeId, newData).subscribe(
      {
        next : (posts:any) =>  {
            this.modalService.dismissAll('Submit success');
            this.fetchEmployees();
            this.showSuccessMessage('Employee successfully updated');
        },
        error:(error) => {
          console.error('Error updating employee:', error);
        }
        });
        }

   private showSuccessMessage(message:string){
    this.toast.success({ detail: 'Success', summary: message, duration: 5000, position: 'topRight' });
   }

  private showErrorMessage(message: string) {
    this.toast.error({ detail: 'ERROR', summary: message, duration:10000, position: 'topRight'});
  }


  open(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      result => {
        this.closeResult = `Closed with: ${result}`;
      },
      reason => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      }
    );
   
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  resetUserForm(userForm: any) {
    userForm.resetForm();
  }

}


