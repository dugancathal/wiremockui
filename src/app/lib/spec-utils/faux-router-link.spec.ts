import { Directive } from '@angular/core'
import { RouterTestingModule } from '@angular/router/testing'

@Directive({selector: '[routerLink]'})
export class FauxRouterLink {
}

export const fakeRoutes = (component) => RouterTestingModule.withRoutes([
  {
    path: '',
    component: component
  }
])