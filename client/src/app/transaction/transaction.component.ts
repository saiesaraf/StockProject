import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { DataService } from "../data.service";
import { MatTableDataSource } from "@angular/material/table";

export interface TransactionData {
  Date: string;
  quantity: number;
  price: number;
  total: number;
  action: string;
}

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  @Input()
  stockNameInput: string;

  transaction: any;
  transactiondataSource: MatTableDataSource<TransactionData>;
  displayedColumns: string[] = [
   "Date",
   "quantity",
   "price",
   "total",
   "action"
  ];
  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.selectedTransaction = this.stockNameInput;
    console.log('selected stockName is' + this.data.selectedTransaction);
    let tempDataSource = [];
    this.data.gettransaction().subscribe(transactiondetails => {
      this.transaction = transactiondetails;
      for (let i = 0; i < transactiondetails.length; i++) {
        const tempObject = transactiondetails[i];
        const tempData: TransactionData = {
          Date: tempObject.date,
          quantity: tempObject.quantity,
          price: tempObject.price,
          total: Number( (tempObject.total).toFixed(2)),
          action: tempObject.action
        };
        tempDataSource.push(tempData);
      }
      this.transactiondataSource = new MatTableDataSource<TransactionData>(
        tempDataSource
      );
    });
  }
}
