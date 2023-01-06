import { Component, OnInit } from '@angular/core';
import { TestService } from './test.service';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  list;

  constructor(
    private testService: TestService
  ) { }

  ngOnInit() {
    this.testService.getList().subscribe(data => {
      this.list = data;
      console.log(this.list);
    });
  }

}
