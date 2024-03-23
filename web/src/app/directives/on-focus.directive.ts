import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appOnFocus]',
})
export class OnFocusDirective implements OnInit {
  constructor(private el: ElementRef) {}

  private toggleClassActive(active: boolean) {
    if (active) {
      this.el.nativeElement.children[0].classList.add('active');
    } else {
      this.el.nativeElement.children[0].classList.remove('active');
    }
  }

  ngOnInit(): void {
    const secondChild = this.el.nativeElement.children[1];
    if (secondChild) {
      secondChild.addEventListener('focus', this.onFocusIn.bind(this));
      secondChild.addEventListener('blur', this.onFocusOut.bind(this));
    }
  }

  @HostListener('focus')
  public onFocusIn() {
    this.toggleClassActive(true);
  }

  @HostListener('blur')
  public onFocusOut() {
    this.toggleClassActive(false);
  }
}
