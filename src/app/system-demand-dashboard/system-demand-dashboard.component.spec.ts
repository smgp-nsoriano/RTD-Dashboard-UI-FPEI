import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemDemandDashboardComponent } from './system-demand-dashboard.component';

describe('SystemDemandDashboardComponent', () => {
  let component: SystemDemandDashboardComponent;
  let fixture: ComponentFixture<SystemDemandDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemDemandDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemDemandDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
