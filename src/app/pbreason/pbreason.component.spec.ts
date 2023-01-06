import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PBReasonComponent } from './pbreason.component';

describe('PBReasonComponent', () => {
  let component: PBReasonComponent;
  let fixture: ComponentFixture<PBReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PBReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PBReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
