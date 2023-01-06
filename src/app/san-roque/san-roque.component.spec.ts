import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanRoqueComponent } from './san-roque.component';

describe('SanRoqueComponent', () => {
  let component: SanRoqueComponent;
  let fixture: ComponentFixture<SanRoqueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanRoqueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanRoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
