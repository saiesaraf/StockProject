import { Component, OnInit } from '@angular/core';
import { DataService } from "../data.service";
@Component({
  selector: 'app-home1',
  templateUrl: './home1.component.html',
  styleUrls: ['./home1.component.scss']
})
export class Home1Component implements OnInit {
  selected: boolean;
  constructor(public data: DataService) {
   }

  ngOnInit(): void {
    this.selected = this.data.selected;
    console.log("selected is" + this.selected);
  }

}
