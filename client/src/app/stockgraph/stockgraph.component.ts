import { Component, OnInit } from "@angular/core";
import { ChartDataSets, ChartOptions } from "chart.js";
import { Color, Label } from "ng2-charts";
import { DataService } from "../data.service";
@Component({
  selector: "app-stockgraph",
  templateUrl: "./stockgraph.component.html",
  styleUrls: ["./stockgraph.component.scss"]
})
export class StockgraphComponent implements OnInit {
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
stockHistoricalData: [];
isQeuryCompleted = false;
constructor(public data: DataService) {}

ngOnInit(): void {
    if (this.isQeuryCompleted == false) {
      this.data.getHistoricalData().subscribe((historicalData: any) => {
        this.stockHistoricalData = historicalData;
        for (let i = 0; i < this.stockHistoricalData.length; i++) {
          this.closevalues.push((this.stockHistoricalData[i] as any).close);
          this.dateValues.push((this.stockHistoricalData[i] as any).date);
        }
        this.isQeuryCompleted = true;
      });
    }
  }
}
