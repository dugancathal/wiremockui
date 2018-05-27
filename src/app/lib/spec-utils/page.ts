import { ComponentFixture } from '@angular/core/testing'

export const page = (host: ComponentFixture<any>) => {
  return {
    detectChanges: () => host.detectChanges(),
    fillIn: (selector: string, value: any) => {
      const input = host.nativeElement.querySelector(selector)
      input.value = value
      input.dispatchEvent(new Event('input'))
      host.detectChanges()
    },
    clickOn: (selector: string) => {
      host.nativeElement.querySelector(selector).click()
      host.detectChanges()
    }
  }
}