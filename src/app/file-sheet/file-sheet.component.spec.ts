import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileSheetComponent } from './file-sheet.component';

describe('FileSheetComponent', () => {
  let component: FileSheetComponent;
  let fixture: ComponentFixture<FileSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FileSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
