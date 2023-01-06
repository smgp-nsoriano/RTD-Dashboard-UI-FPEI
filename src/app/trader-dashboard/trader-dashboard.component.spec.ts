import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraderDashboardComponent } from './trader-dashboard.component';

describe('TraderDashboardComponent', () => {
  let component: TraderDashboardComponent;
  let fixture: ComponentFixture<TraderDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraderDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraderDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
