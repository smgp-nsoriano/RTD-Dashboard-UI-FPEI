import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservePortfolioComponent } from './reserve-portfolio.component';

describe('ReservePortfolioComponent', () => {
  let component: ReservePortfolioComponent;
  let fixture: ComponentFixture<ReservePortfolioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservePortfolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservePortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
