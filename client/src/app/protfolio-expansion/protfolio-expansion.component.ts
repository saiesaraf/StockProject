import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
import { MatTableDataSource } from "@angular/material/table";
import { ValueConverter } from "@angular/compiler/src/render3/view/template";
import {animate, state, style, transition, trigger} from '@angular/animations';
import * as moment from 'moment';

interface MyObj {
  price: number;
}

interface sendStock {
  username: string;
  stockName: string;
  quantity: number;
}
interface SendTransaction {
  username: string;
  stockName: string;
  quantity: number;
  price: number;
  total: number;
  date: string;
  action: string;
}
export interface DataInterface {
  stockName: string;
  quantity: number;
  ptotal: number;
  cPrice: number;
  ctotal: number;
  profit: number;
  updatedtotal: number;
  aquantity: number;
}

@Component({
  selector: "app-protfolio-expansion",
  templateUrl: "./protfolio-expansion.component.html",
  styleUrls: ["./protfolio-expansion.component.scss"],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ProtfolioExpansionComponent implements OnInit {
  panelOpenState: boolean;
  prevQuntity: number;
  user: string;
  portfolio: any;
  isRequestComplete: boolean;
  userStockSymbols: any[];
  currentStockPrice: number;
  stockValue: string;
  displayedColumns: string[] = [
    "stockName",
    "quantity",
    "ptotal",
    "ctotal",
    "profit",
    "aquantity",
    "updatedtotal",
    "action"
  ];
  stockNameInput: string;
  dataSource: MatTableDataSource<DataInterface>;
  expandedElement: DataInterface | null;

constructor(
    private data: DataService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {
    this.userStockSymbols = [];
  }

ngOnInit() {
    let tempDataSource = [];
    this.user = this.data.userId;
    console.log("In portfolio component" + this.user);
    this.data.getPortfolio().subscribe(portfoliodetails => {
      //console.log("returned portfolio is", portfoliodetails);
      this.portfolio = portfoliodetails;
      for (let i = 0; i < portfoliodetails.length; i++) {
        const tempObject = portfoliodetails[i];
        if (tempObject.quantity == 0) {
          continue;
        }
        let cPrice1: number;
        this.data
          .getStockBySymbol(tempObject.stockName)
          .subscribe(async currentPrice => {
            this.stockValue = JSON.stringify(currentPrice);
            let obj: MyObj = JSON.parse(this.stockValue);
            cPrice1 = obj.price;
            const tempData: DataInterface = {
              stockName: await this.getStockName(tempObject.stockName),
              quantity: tempObject.quantity,
              ptotal: tempObject.total.toFixed(2),
              cPrice: cPrice1,
              ctotal: Number( (cPrice1 * tempObject.quantity).toFixed(2)),
              profit: Number( (cPrice1 * tempObject.quantity - tempObject.total).toFixed(2)),
              aquantity: 0,
              updatedtotal: 0
            };
            console.log("total is" + tempData.ctotal);
            tempDataSource.push(tempData);
            tempDataSource.sort((a, b) => b.profit - a.profit);
            console.log('sorted data is' + tempDataSource);
            this.dataSource = new MatTableDataSource<DataInterface>(
              tempDataSource
            );
          });
      }
    });
  }

  async getStockName(stockSymbol: string) {
    const companyName = (Object.keys(this.data.myMapData) as Array<string>).find(key => this.data.myMapData[key] === stockSymbol);
    console.log('company name is' + companyName);
    return companyName;
  }

onChangeQuantity(onChangeQuantity: number, stockName: string): void {
    console.log("sent from user is" + onChangeQuantity);
    const newquantity = onChangeQuantity;
    console.log("newquantity is" + newquantity);

    const currStock = this.dataSource.data.find(
      stock => stock.stockName == stockName
    );
    currStock.updatedtotal = Number((currStock.cPrice * onChangeQuantity).toFixed(2));
    currStock.aquantity = newquantity;
    console.log("currStock.inputQuantity" + currStock.aquantity);
  }

buyStocks(stockName: string) {
    let updatedDataSource = [];
    console.log("I am in buy Stocks");
    const currStock = this.dataSource.data.find(
      stock => stock.stockName == stockName
    );
    console.log("updated quantity is" + currStock.aquantity);
    const tempData1: DataInterface = {
      stockName: currStock.stockName,
      quantity: currStock.quantity,
      ptotal: currStock.ptotal,
      cPrice: currStock.cPrice,
      ctotal: currStock.ctotal,
      profit: currStock.profit,
      updatedtotal: Number(currStock.updatedtotal.toFixed(2)),
      aquantity: currStock.aquantity
    };
    const portfolio: sendStock = {
      username: this.data.userId,
      stockName: currStock.stockName,
      quantity: Number(currStock.aquantity)
    };

    this.data.insertPortfolio(portfolio).subscribe(insertedPortfolio => {
      if (insertedPortfolio["success"]) {
        this.ngOnInit();
        /*this.flashMessage.show("Successfully added in portfolio", {
          cssClass: "alert-success",
          timeout: 3000
        });
        );
      } else {
        this.flashMessage.show("There was some error", {
          cssClass: "alert-danger",
          timeout: 3000
        });*/
      }
    });

    const userTrasaction: SendTransaction = {
      username: this.data.userId,
      stockName: currStock.stockName,
      quantity: Number(currStock.aquantity),
      price: Number(currStock.cPrice),
      total: Number(currStock.updatedtotal),
      date: moment().format("YYYY-MM-DD"),
      action: 'Buy'
    };
    console.log('user transaction is');
    console.log('user is' + this.user);
    this.data.insertTransaction(userTrasaction).subscribe(insertedTransaction => {
      if (insertedTransaction['success']) {
        console.log('inserted transaction successfully');
      } else {
        console.log('could not insert transaction');
      }
  });
}

sellStocks(stockName: string) {
  console.log("I am in sell Stocks");
  const currStock = this.dataSource.data.find(
      stock => stock.stockName == stockName
    );
  console.log("updated quantity is" + currStock.aquantity);
  const tempData1: DataInterface = {
      stockName: currStock.stockName,
      quantity: currStock.quantity,
      ptotal: currStock.ptotal,
      cPrice: currStock.cPrice,
      ctotal: currStock.ctotal,
      profit: currStock.profit,
      updatedtotal: Number(currStock.updatedtotal.toFixed(2)),
      aquantity: currStock.aquantity
    };
  const portfolio: sendStock = {
      username: this.data.userId,
      stockName: currStock.stockName,
      quantity: Number(currStock.aquantity)
    };

  this.data.deletePortfolio(portfolio).subscribe(deletedPortfolio => {
      if (deletedPortfolio["success"]) {
        this.ngOnInit();
        /*this.flashMessage.show("Successfully added in portfolio", {
          cssClass: "alert-success",
          timeout: 3000
        });
        );
      } else {
        this.flashMessage.show("There was some error", {
          cssClass: "alert-danger",
          timeout: 3000
        });*/
      }
    });

  const userTrasaction: SendTransaction = {
      username: this.data.userId,
      stockName: currStock.stockName,
      quantity: Number(currStock.aquantity),
      price: Number(currStock.cPrice),
      total: Number(currStock.updatedtotal),
      date: moment().format("YYYY-MM-DD"),
      action: 'Sell'
    };
  console.log('user transaction is');
  console.log('user is' + this.user);
  this.data.insertTransaction(userTrasaction).subscribe(insertedTransaction => {
      if (insertedTransaction['success']) {
        console.log('inserted transaction successfully');
      } else {
        console.log('could not insert transaction');
      }
  });
}

isInvalidBuy(quantityFromUser: number): boolean {
  if (quantityFromUser <= 0 || quantityFromUser >= 500) {
    return true;
  } else {
    return false;
  }
}

isInvalidSell(quantityFromUser: number, stockNameUser: string): boolean {
  const currStock = this.dataSource.data.find(
    stock => stock.stockName == stockNameUser
  );
  const currentquant = currStock.quantity;
  if (quantityFromUser > currentquant || quantityFromUser <= 0 ) {
    return true;
  } else {
    return false;
  }
}
}
