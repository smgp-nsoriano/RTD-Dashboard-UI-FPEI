import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsViewerComponent } from './bids-viewer.component';
describe('BidsViewerComponent', () => {
  let component: BidsViewerComponent;

  let fixture: ComponentFixture<BidsViewerComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidsViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
