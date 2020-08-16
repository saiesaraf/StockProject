import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockgraphComponent } from './stockgraph.component';

describe('StockgraphComponent', () => {
  let component: StockgraphComponent;
  let fixture: ComponentFixture<StockgraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockgraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockgraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
