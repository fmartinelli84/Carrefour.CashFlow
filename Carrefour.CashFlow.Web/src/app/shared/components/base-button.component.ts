import { OnInit, ElementRef, AfterContentInit, AfterViewInit, ChangeDetectorRef, ViewChild, Input, HostListener, Directive, Component } from '@angular/core';

@Directive()
export abstract class BaseButtonComponent implements OnInit, AfterContentInit, AfterViewInit {

  public hasContent: boolean = false;

  @Input() public id: string = null;

  @Input() public form: string = null;

  @Input() public disabled: boolean = false;

  @Input() public hidden: boolean = false;

  @Input() public type: 'button' | 'submit' | 'icon' = 'button';

  @Input() public icon: any = [];

  @Input() public buttonCssClass: string;

  @Input() public iconCssClass: string;

  @Input() public iconSize: any;

  @Input() public showTooltip: boolean = true;

  @ViewChild('content', { read: ElementRef }) public content: ElementRef;

  @HostListener('click', ['$event']) public onHostClick(event: MouseEvent): void {
    if (this.disabled) {
      event.stopPropagation();
    }
  }

  constructor(protected changeDetector: ChangeDetectorRef) {
  }

  public ngOnInit(): void {
  }

  public ngAfterContentInit(): void {
  }

  public ngAfterViewInit(): void {
    this.hasContent =
      this.content &&
      this.content.nativeElement &&
      this.content.nativeElement.innerHTML &&
      this.content.nativeElement.innerHTML.trim();

    this.changeDetector.detectChanges();
  }
}
