import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtpFilesComponent } from './ftp-files.component';

describe('FtpFilesComponent', () => {
  let component: FtpFilesComponent;
  let fixture: ComponentFixture<FtpFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtpFilesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtpFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
