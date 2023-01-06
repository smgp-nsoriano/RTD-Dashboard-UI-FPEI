import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessFilesComponent } from './process-files.component';

describe('ProcessFilesComponent', () => {
  let component: ProcessFilesComponent;
  let fixture: ComponentFixture<ProcessFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcessFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
