import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsViewerExportComponent } from './bids-viewer-export.component';
describe('BidsViewerExportComponent', () => {
  let component: BidsViewerExportComponent;

  let fixture: ComponentFixture<BidsViewerExportComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidsViewerExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidsViewerExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
