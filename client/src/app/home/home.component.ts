import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatOption } from "@angular/material/core";
import { DataService } from "../data.service";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { FlashMessagesService } from "angular2-flash-messages";
import * as moment from "moment";
import { MatTableDataSource } from "@angular/material/table";
import { async } from "q";

export interface DataInterface {
  stockSymbol: string;
  stockName: string;
  cPrice: number;
  predPrice: number;
  Quantity: number;
  Total: number;
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

interface MyObj {
  price: number;
}

interface MyCompanies {
  Symbol: string;
  Name: string;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  disabled = true;
  stockselected: string;
  username: string;
  quant: number;
  selectedQuantity: number;
  selected: boolean;
  Selectedstock: string;
  myControl = new FormControl();
  stockValue: any;
  currentPrice: number;
  stockHistoricalData: any;

  myMap: Record<string, string> = {};
  options: string[] = ["Amazon", "Apple", "Microsoft", "Tesla"];

  optionsNew: string[];
  myMapNew: Record<string, string> = {};
  filteredOptions: Observable<string[]>;
  displayedColumns: string[] = [
    "stockName",
    "cPrice",
    "predPrice",
    "Quantity",
    "Total",
    "action"
  ];
  dataSource: MatTableDataSource<DataInterface>;
  constructor(
    public data: DataService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) {}
  ngOnInit() {
    this.optionsNew = [];

    this.getCompaniesList();

    this.data.selected = false;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(""),
      map(value => this._filter(value))
    );
    /*this.myMap["Amazon"] = "amzn";
    this.myMap["Microsoft"] = "msft";
    this.myMap["Apple"] = "aapl";
    this.myMap["Tesla"] = "tsla"; */
    this.selected = false;
    this.selectedQuantity = 0;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsNew.filter(
      option => option.toLowerCase().indexOf(filterValue) === 0
    );
  }

  async getCompaniesList() {
    this.data.getCompanies().subscribe((companiesResponse: any) => {
      const cData = JSON.stringify(companiesResponse);
      let comp: MyCompanies[] = JSON.parse(cData);
      //console.log("recived company data is" + comp.Name + comp.Symbol);
      for (const curr of comp) {
        this.data.myMapData[curr.Name] = curr.Symbol;
        this.optionsNew.push(curr.Name);
      }
    });
  }

  OnstockSelected(option: MatOption) {
    let tempDataSource = [];
    this.selected = true;
    this.data.selected = true;
    //console.log('selected flag is' + this.data.selected);
    this.Selectedstock = option.value;
    this.data.stockSymbol = this.data.myMapData[option.value];
    console.log("this.data.stockSymbol is" + this.data.stockSymbol);
    [this.stockselected] = this.data.stockSymbol;

    this.data.getStock().subscribe((stockResponse: any) => {
      this.stockValue = JSON.stringify(stockResponse);
      let obj: MyObj = JSON.parse(this.stockValue);
      this.currentPrice = obj.price;

      const tempData: DataInterface = {
        stockSymbol: this.data.stockSymbol,
        stockName: option.value,
        cPrice: this.currentPrice,
        predPrice: 5000,
        Quantity: this.selectedQuantity,
        Total: this.selectedQuantity * this.currentPrice
      };
      tempDataSource.push(tempData);
      this.dataSource = new MatTableDataSource<DataInterface>(tempDataSource);
    });
  }

  buyStocks(stockName: string) {
    const portfolio = {
      username: this.data.userId,
      stockName: this.data.stockSymbol,
      quantity: Number(this.selectedQuantity)
    };

    console.log("Portfolio quantity is" + portfolio.quantity);

    const userTrasaction: SendTransaction = {
      username: this.data.userId,
      stockName: this.data.stockSymbol,
      quantity: Number(this.selectedQuantity),
      price: Number(this.currentPrice),
      total: Number(this.currentPrice * this.selectedQuantity),
      date: moment().format("YYYY-MM-DD"),
      action: "Buy"
    };

    if (this.data.isloggedin === false) {
      this.flashMessage.show(
        JSON.stringify("You need to be logged in to buy"),
        {
          cssClass: "alert-danger",
          timeout: 5000
        }
      );
      this.router.navigate(["mainHome"]);
    } else {
      this.data.insertPortfolio(portfolio).subscribe(insertedPortfolio => {
        if (insertedPortfolio["success"]) {
          this.flashMessage.show("Successfully added in portfolio", {
            cssClass: "alert-success",
            timeout: 3000
          });
          this.router.navigate["portfolio"];
        } else {
          this.flashMessage.show("There was some error", {
            cssClass: "alert-danger",
            timeout: 3000
          });
        }
      });

      this.data
        .insertTransaction(userTrasaction)
        .subscribe(insertedTransaction => {
          if (insertedTransaction["success"]) {
            console.log("inserted transaction successfully");
          } else {
            console.log("could not insert transaction");
          }
        });
    }
  }

  sellStocks(stockName: string) {
    const portfolio = {
      username: this.data.userId,
      stockName: this.data.stockSymbol,
      quantity: Number(this.selectedQuantity)
    };

    const userTrasaction: SendTransaction = {
      username: this.data.userId,
      stockName: this.data.stockSymbol,
      quantity: Number(this.selectedQuantity),
      price: Number(this.currentPrice),
      total: Number(this.currentPrice * this.selectedQuantity),
      date: moment().format("YYYY-MM-DD"),
      action: "Sell"
    };

    if (this.data.isloggedin === false) {
      this.flashMessage.show(
        JSON.stringify("You need to be logged in to buy"),
        {
          cssClass: "alert-danger",
          timeout: 5000
        }
      );
      this.router.navigate(["mainHome"]);
    } else {
      this.data.deletePortfolio(portfolio).subscribe(insertedPortfolio => {
        if (insertedPortfolio["success"]) {
          this.flashMessage.show("Successfully added in portfolio", {
            cssClass: "alert-success",
            timeout: 3000
          });
          this.router.navigate["portfolio"];
        } else {
          this.flashMessage.show("There was some error", {
            cssClass: "alert-danger",
            timeout: 3000
          });
        }
      });

      this.data
        .insertTransaction(userTrasaction)
        .subscribe(insertedTransaction => {
          if (insertedTransaction["success"]) {
            console.log("inserted transaction successfully");
          } else {
            console.log("could not insert transaction");
          }
        });
    }
  }
  onChangeQuantity(onChangeQuantity: number): void {
    const newquantity = onChangeQuantity;
    console.log(this.selectedQuantity);
    const currStock = this.dataSource.data.find(
      stock => stock.stockSymbol === this.data.stockSymbol
    );
    currStock.Total = Number((currStock.cPrice * onChangeQuantity).toFixed(2));
    currStock.Quantity = newquantity;
    this.selectedQuantity = currStock.Quantity;
  }

  isInvalid(quantityFromUser: number): boolean {
    if (quantityFromUser <= 0 || quantityFromUser >= 500) {
      return true;
    } else {
      return false;
    }
  }

  alert() {
    console.log("You clicked me");
  }

  isDisabled() {
    console.log("I am in isDisabled");
    return true;
  }
}
