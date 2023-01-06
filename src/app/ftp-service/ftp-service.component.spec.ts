import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FtpServiceComponent } from './ftp-service.component';

describe('FtpServiceComponent', () => {
  let component: FtpServiceComponent;
  let fixture: ComponentFixture<FtpServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FtpServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FtpServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
