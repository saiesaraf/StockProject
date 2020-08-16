import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtfolioExpansionComponent } from './protfolio-expansion.component';

describe('ProtfolioExpansionComponent', () => {
  let component: ProtfolioExpansionComponent;
  let fixture: ComponentFixture<ProtfolioExpansionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProtfolioExpansionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProtfolioExpansionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
