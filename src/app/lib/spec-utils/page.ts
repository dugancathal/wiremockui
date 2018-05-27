import { ComponentFixture } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

export const page = (host: ComponentFixture<any>) => {
  return {
    detectChanges: () => host.detectChanges(),
    $: (selector: string) => host.nativeElement.querySelector(selector),
    $$: (selector: string) => host.nativeElement.querySelectorAll(selector),
    $ng: (selector: string) => host.debugElement.query(By.css(selector)),
    $$ng: (selector: string) => host.debugElement.queryAll(By.css(selector)),
    component: host.componentInstance,
    fillIn: (selector: string, value: any) => {
      const input = host.nativeElement.querySelector(selector)
      input.value = value
      input.dispatchEvent(new Event('keyup'))
      input.dispatchEvent(new Event('input'))
      host.detectChanges()
    },
    clickOn: (selector: string) => {
      host.nativeElement.querySelector(selector).click()
      host.detectChanges()
    },
  }
}