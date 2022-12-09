import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-control-loader',
  templateUrl: './control-loader.component.html',
  styleUrls: ['./control-loader.component.scss']
})
export class ControlLoaderComponent implements OnInit {

  @Input() public show: boolean = false;

  constructor() { }

  public ngOnInit(): void {
  }

}
