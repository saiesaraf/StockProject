import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { MatOption } from '@angular/material/core';
import { DataService } from '../data.service';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import * as moment from 'moment';

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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
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
  options: string[] = ['Amazon', 'Apple', 'Microsoft', 'Tesla'];
  filteredOptions: Observable<string[]>;
  constructor(public data: DataService, private router: Router,
              private flashMessage: FlashMessagesService) { }
  ngOnInit(): void {
    this.data.selected = false;
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.myMap['Amazon'] = 'amzn';
    this.myMap['Microsoft'] = 'msft';
    this.myMap['Apple'] = 'aapl';
    this.myMap['Tesla'] = 'tsla';

    this.selected = false;
    this.selectedQuantity = 0;
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  OnstockSelected(option: MatOption) {
    console.log('selected option is' + option.value);
    if (this.options.includes(option.value)) {
      this.selected = true;
      this.data.selected = true;
      this.Selectedstock = option.value;
      this.data.stockSymbol = this.myMap[option.value];
      this.data.getStock().subscribe((stockResponse: any) => {
      this.stockValue = JSON.stringify(stockResponse);
      let obj: MyObj = JSON.parse(this.stockValue);
      this.currentPrice = obj.price;
    });
    } else {
      this.selected = false;
      this.data.selected = false;
    }
  }

  buyStocks(form: NgForm) {
    console.log('selected quantity is' + this.selectedQuantity);
    const portfolio = {
      username: this.data.userId,
      stockName: this.data.stockSymbol,
      quantity: this.selectedQuantity
    };

    const userTrasaction: SendTransaction = {
      username: this.data.userId,
      stockName: this.data.stockSymbol,
      quantity: this.selectedQuantity,
      price: this.currentPrice,
      total: Number((this.currentPrice * this.selectedQuantity)),
      date: moment().format("YYYY-MM-DD"),
      action: 'Buy'
    };

    if (form.invalid) {
       return;
    }
    if ( this.data.isloggedin === false) {
      this.flashMessage.show(JSON.stringify('You need to be logged in to buy'), {
        cssClass: 'alert-danger',
        timeout: 5000
      });
      this.router.navigate(['mainHome']);
    } else {
        this.data.insertPortfolio(portfolio).subscribe(insertedPortfolio => {
            if (insertedPortfolio['success']) {
              this.flashMessage.show('Successfully added in portfolio', {
                cssClass: 'alert-success',
                timeout: 3000
              });
              this.router.navigate['portfolio'];
            } else {
              this.flashMessage.show('There was some error', {
                cssClass: 'alert-danger',
                timeout: 3000
              });
            }
          });

        this.data.insertTransaction(userTrasaction).subscribe(insertedTransaction => {
            if (insertedTransaction['success']) {
              console.log('inserted transaction successfully');
            } else {
              console.log('could not insert transaction');
            }
        });
    }
  }

  onChangeQuantity(onChangeQuantity: number): void {
    console.log(onChangeQuantity);
    this.selectedQuantity = onChangeQuantity;
  }


}
