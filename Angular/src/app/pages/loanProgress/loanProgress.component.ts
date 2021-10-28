import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CloseWarningComponent } from './closeWarning/closeWarning.component';
import { DeleteLoanComponent } from './deleteLoan/deleteLoan.component';
import { InfoModalComponent } from './infoModel/infoModal.component';
import { LoanProgressService } from './loanProgress.service';

declare interface TableData {
    dataRows: string[][];
}

@Component({
    selector: 'loanProgress-cmp',
    moduleId: module.id,
    templateUrl: './loanProgress.component.html',
})

export class LoanProgressComponent implements OnInit{
    public progressTable: TableData;
    datas = [];
    finalData =[];
    showEdit = false;
    showTable = true;
    editLoanForm :FormGroup;
    search = '';
    editAccess = true;
    loanUpdateID;
    loanData;
    constructor(
        private LPS: LoanProgressService,
        private spinner: NgxSpinnerService,
        private modalService: NgbModal,
        private fb: FormBuilder,
        private Toastr: ToastrService,
        private router: Router
    ){
        this.showEdit = false;
        this.showTable = true;
        this.editLoanForm = fb.group({
            name: [{ value: "", disabled: this.editAccess},[Validators.required]],
            pName: [{ value: "", disabled: this.editAccess},[Validators.required]],
            date: [{ value: "", disabled: this.editAccess},[Validators.required]],
            mobileNo: [{ value: "", disabled: this.editAccess},[Validators.required]],
            aMobileNo: [{ value: "", disabled: this.editAccess}],
            address: [{ value: "", disabled: this.editAccess},[Validators.required]],
            amount: [{ value: "", disabled: this.editAccess},[Validators.required]],
            interest: [{ value: "", disabled: this.editAccess},[Validators.required]],
            interestPaid: [{ value: 0, disabled: this.editAccess},[Validators.required]],
            notes: [{ value: "", disabled: this.editAccess}]
        });
    }
    async ngOnInit(){
        this.progressTable = {
            dataRows : []
        }
        let result = await this.LPS.getLoans(true);
        this.finalData = result.data.getLoans;
        if(this.finalData.length > 0){
            for(let i= 0; i < this.finalData.length; i++){
                let created = new Date(this.finalData[i].date);
                let currentDate = new Date();
                var months;
                months = (currentDate.getFullYear() - created.getFullYear()) * 12;
                months -= created.getMonth();
                months += currentDate.getMonth();
                months <= 0 ? 0 : months;
                var total = months * this.finalData[i].interest;
                var pendingAmount = total - this.finalData[i].interestPaid;
                this.datas[i] = [ this.finalData[i].loanID, this.finalData[i].name, this.finalData[i].date, this.finalData[i].amount, this.finalData[i].interest , pendingAmount]
            }
            this.datas.sort();
            this.datas.reverse();
            this.progressTable = {
                dataRows : this.datas
            }
        }
    }

    backToGrid(){
        this.showEdit = false;
        this.showTable = true;
        this.clearForm();
    }

    clearForm(){
        this.editLoanForm.get('name').setValue("");
        this.editLoanForm.get('pName').setValue("");
        this.editLoanForm.get('date').setValue("");
        this.editLoanForm.get('mobileNo').setValue("");
        this.editLoanForm.get("aMobileNo").setValue("");
        this.editLoanForm.get("address").setValue("");
        this.editLoanForm.get("amount").setValue("");
        this.editLoanForm.get("interest").setValue("");
        this.editLoanForm.get("interestPaid").setValue(0);
        this.editLoanForm.get("notes").setValue("");

        this.editLoanForm.get('name').markAsUntouched();
        this.editLoanForm.get('pName').markAsUntouched();
        this.editLoanForm.get('date').markAsUntouched();
        this.editLoanForm.get('mobileNo').markAsUntouched();
        this.editLoanForm.get("aMobileNo").markAsUntouched();
        this.editLoanForm.get("address").markAsUntouched();
        this.editLoanForm.get("amount").markAsUntouched();
        this.editLoanForm.get("interest").markAsUntouched();
        this.editLoanForm.get("interestPaid").markAsUntouched();
        this.editLoanForm.get("notes").markAsUntouched();

        this.editLoanForm.markAsUntouched();
        this.editLoanForm.markAsPristine();
        sessionStorage.clear();
        this.editAccess = true;
    }

    copyText(val: string){
        let selBox = document.createElement('textarea');
          selBox.style.position = 'fixed';
          selBox.style.left = '0';
          selBox.style.top = '0';
          selBox.style.opacity = '0';
          selBox.value = val;
          document.body.appendChild(selBox);
          selBox.focus();
          selBox.select();
          document.execCommand('copy');
          document.body.removeChild(selBox);
    }

    editAccessFun(){
        if (this.editAccess) {
            this.editLoanForm.get('name').enable();
            this.editLoanForm.get('pName').enable();
            this.editLoanForm.get('date').enable();
            this.editLoanForm.get('mobileNo').enable();
            this.editLoanForm.get("aMobileNo").enable();
            this.editLoanForm.get("address").enable();
            this.editLoanForm.get("amount").enable();
            this.editLoanForm.get("interest").enable();
            this.editLoanForm.get("interestPaid").enable();
            this.editLoanForm.get("notes").enable();
        } else {
            this.editLoanForm.get('name').disable();
            this.editLoanForm.get('pName').disable();
            this.editLoanForm.get('date').disable();
            this.editLoanForm.get('mobileNo').disable();
            this.editLoanForm.get("aMobileNo").disable();
            this.editLoanForm.get("address").disable();
            this.editLoanForm.get("amount").disable();
            this.editLoanForm.get("interest").disable();
            this.editLoanForm.get("interestPaid").disable();
            this.editLoanForm.get("notes").disable();
        }
        this.editAccess = !this.editAccess;
    }
        
    info(loanID: any){
        let value = this.finalData.filter((val: any) => val.loanID == loanID);
        const modalRef = this.modalService.open(InfoModalComponent);
        modalRef.componentInstance.loanData = value[0];
    }

    closeLoan(data){
        const modalRef = this.modalService.open(CloseWarningComponent);
        modalRef.componentInstance.data = data;
    }

    async editLoan(ID: any, PA: any){
        this.spinner.show();
        sessionStorage.setItem('pendingAmount', PA);
        this.showTable = false;
        this.showEdit = true;
        let result = await this.LPS.getLoanByID(ID);
        let data = result.data.getLoanByID;
        this.loanData = data;
        if(data.length > 0){
            this.loanUpdateID = data[0].loanID;
            this.editLoanForm.get('name').setValue(data[0].name);
            this.editLoanForm.get('pName').setValue(data[0].parentName);
            this.editLoanForm.get('date').setValue(data[0].date);
            this.editLoanForm.get('mobileNo').setValue(JSON.parse(data[0].mobile));
            this.editLoanForm.get("aMobileNo").setValue(data[0].aMobile);
            this.editLoanForm.get("address").setValue(data[0].address);
            this.editLoanForm.get("amount").setValue(data[0].amount);
            this.editLoanForm.get("interest").setValue(data[0].interest);
            this.editLoanForm.get("notes").setValue(data[0].notes);
        }else {
            this.Toastr.error('Something went wrong', '', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
            });
            this.router.navigate(['loanProgress']);
        }
        this.spinner.hide();
    }

    async confirmEdit(){
        var submittedValues = this.editLoanForm.value;
        submittedValues.loanID = this.loanUpdateID;
        let result = await this.LPS.updateLoan(submittedValues);
        if(result.data){
            this.Toastr.success( 'Updated Successfully', '', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
                });
                this.router.navigateByUrl('/progressReport', { skipLocationChange: true }).then(() => {
                this.router.navigate(['loanProgress']);
                });
        }else{
            this.Toastr.error( 'Something went wrong', '', {
                timeOut: 3000,
                positionClass: 'toast-top-center'
                });
        }
    }

    deleteLoan(row){
        const modalRef = this.modalService.open(DeleteLoanComponent);
        modalRef.componentInstance.loanInfo = row;
    }
}
