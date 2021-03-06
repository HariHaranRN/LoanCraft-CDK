import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../loanProgress/infoModel/infoModal.component';
import { LoanProgressService } from '../loanProgress/loanProgress.service';
import { RestoreLoanComponent } from './restoreModal/restoreModal.component';

declare interface TableData {
    dataRows: string[][];
}

@Component({
    selector: 'closedLoans-cmp',
    moduleId: module.id,
    templateUrl: './closedLoans.component.html'
})

export class ClosedLoansComponent implements OnInit{
    search = '';
    public datas = [];
    public finalData = [];
    public closedTable: TableData
    constructor(
        private LPS: LoanProgressService,
        private modalService: NgbModal
    ){

    }
    async ngOnInit(){
        this.closedTable = {
            dataRows : []
        }
        let result = await this.LPS.getLoans(false);
        this.finalData = result.data.getLoans;
        if(this.finalData.length > 0) {
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
                this.datas[i] = [ this.finalData[i].loanID, this.finalData[i].name, this.finalData[i].date, this.finalData[i].closingDate, this.finalData[i].amount, this.finalData[i].interest , pendingAmount]
            }
            this.datas.sort();
            this.datas.reverse();
            this.closedTable = {
                dataRows : this.datas
            }
        }
    }

    info(loanID){
        let value = this.finalData.filter((val: any) => val.loanID == loanID);
        const modalRef = this.modalService.open(InfoModalComponent  );
        modalRef.componentInstance.loanData = value[0];
    }

    restore(rowData){
        const modalRef = this.modalService.open(RestoreLoanComponent);
        modalRef.componentInstance.rowData = rowData;
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
}
