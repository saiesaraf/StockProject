import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

interface sendStock {
  username: string;
  stockName: string;
  quantity: number;
}

@Injectable({
  providedIn: "root"
})
export class DataService {

  registerUrl: string;
  loginUrl: string;
  stockUrl: string;
  localUrl: string;
  stockSymbol: string;
  userId: string;
  portfolioUrl: string;
  getportfolioUrl: string;
  getHistoricalDataUrl: string;
  transactionUrl: string;
  gettransactionUrl: string;
  public isloggedin: boolean;
  selected: boolean;
  stockMap: Record<string, string> = {};
  selectedTransaction: string;

  constructor(private http: HttpClient) {
    this.localUrl = "https://my-stocksapp-server.herokuapp.com";
    this.stockUrl = this.localUrl + "/stocks/";
    this.isloggedin = false;
    this.selected = false;
    this.loginUrl = this.localUrl + "/user/login";
    this.registerUrl = this.localUrl + "/user/register";
    this.portfolioUrl = this.localUrl + "/portfolio/insert";
    this.getportfolioUrl = this.localUrl + "/portfolio/";
    this.getHistoricalDataUrl = this.localUrl + "/history/historical/";
    this.transactionUrl = this.localUrl + "/transactions/"
    this.gettransactionUrl = this.localUrl + "/transactions/";

    this.stockMap["Amazon"] = "amzn";
    this.stockMap["Microsoft"] = "msft";
    this.stockMap["Apple"] = "aapl";
    this.stockMap["Tesla"] = "tsla";

  }

  getStock() {
    return this.http.get<any>(this.stockUrl + this.stockSymbol);
  }

  getStockBySymbol(stockSymbol: string) {
    return this.http.get<any>(this.stockUrl + stockSymbol);
  }

  loginUser(user: any) {
    console.log("here in login" + JSON.stringify(user));
    return this.http.post<any>(this.loginUrl, user);
  }

  registerUser(user: any) {
    return this.http.post<any>(this.registerUrl, user);
  }

  insertPortfolio(portfolio: sendStock) {
    console.log('portfolio insert ===== ', portfolio)
    return this.http.post<sendStock>(this.portfolioUrl, portfolio);
  }

  getPortfolio() {
    return this.http.get<any>(this.getportfolioUrl + this.userId);
  }

  getHistoricalData() {
    return this.http.get<any>(this.getHistoricalDataUrl + this.stockSymbol);
  }

  insertTransaction(transactions: any) {
    return this.http.post<any>(this.transactionUrl + this.userId, transactions);
  }

  gettransaction() {
    const completeUrl = this.gettransactionUrl + this.userId + '/' + this.selectedTransaction;
    return this.http.get<any>(completeUrl);
  }
}
