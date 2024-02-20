import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReserveRequirementComponent } from './reserve-requirement.component';

describe('ReserveRequirementComponent', () => {
  let component: ReserveRequirementComponent;
  let fixture: ComponentFixture<ReserveRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReserveRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReserveRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
