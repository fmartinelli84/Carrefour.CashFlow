import { Injectable, ElementRef } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ScrollService {

    private referrer: string;

    constructor() {
    }

    public scrollToElement(element: ElementRef): void {
        var top = element.nativeElement.getBoundingClientRect().top;
        var left = element.nativeElement.getBoundingClientRect().left;

        this.scrollToPosition(top, left);
    }

    public scrollToPosition(top: number, left: number): void {
        window.scrollTo({ behavior: 'smooth', top: top, left: left });
    }

    public scrollToTop(): void {
        this.scrollToPosition(0, 0);
    }
}
