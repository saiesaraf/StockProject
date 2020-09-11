import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { BaseChartDirective } from "ng2-charts";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";
import { DataService } from "../data.service";
@Component({
  selector: "app-stockgraph",
  templateUrl: "./stockgraph.component.html",
  styleUrls: ["./stockgraph.component.scss"]
})
export class StockgraphComponent implements OnInit {
  @Input()
  stockselected: string;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;
  closevalues = [];
  dateValues = [];
  lineChartData: ChartDataSets[] = [
    { data: this.closevalues, label: "stock prices" }
  ];

  lineChartLabels: Label[] = this.dateValues;

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  lineChartColors: Color[] = [
    {
      borderColor: "black",
      backgroundColor: "rgba(255,255,0,0.28)"
    }
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = "line";
  stockHistoricalData = [];
  isQeuryCompleted = false;
  constructor(public data: DataService) {}

  ngOnInit(): void {
    console.log("I am in stockgraph component" + this.data.stockSymbol);
    this.isQeuryCompleted = false;
    //this.getData();
  }

  ngOnChanges() {
    // create header using child_id
    //console.log('I am in stockgraph component' + this.stockselected);
    this.data.stockSymbol = this.stockselected;
    this.getData();
  }

  getData() {
    console.log("I am in getData" + this.data.stockSymbol);
    this.closevalues = [];
    this.dateValues = [];
    this.data.getHistoricalData().subscribe((historicalData: any) => {
      this.stockHistoricalData = historicalData;
      console.log(this.stockHistoricalData);
      if (this.stockHistoricalData == undefined) {
        this.stockHistoricalData = [];
      }
      for (let i = 0; i < this.stockHistoricalData.length; i++) {
        this.closevalues.push((this.stockHistoricalData[i] as any).close);
        this.dateValues.push((this.stockHistoricalData[i] as any).date);
      }
      this.lineChartLabels = this.dateValues;
      this.lineChartData = [{ data: this.closevalues, label: "stock prices" }];
      this.updateChart();
    });
  }

  updateChart() {
    this.chart.chart.update();
  }
}
