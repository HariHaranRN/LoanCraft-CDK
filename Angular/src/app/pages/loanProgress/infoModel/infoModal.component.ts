import { Component, OnInit, Input } from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'infoModal',
  templateUrl: './infoModal.component.html'
})

export class InfoModalComponent implements OnInit{
@Input() loanData;
  constructor(
      public activeModal: NgbActiveModal) { }


  async ngOnInit(){}


}