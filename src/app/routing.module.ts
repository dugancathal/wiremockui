import { RouterModule, Routes } from '@angular/router'
import { MappingsListComponent } from './mappings/list.component'

const appRoutes: Routes = [
  {
    path: '',
    component: MappingsListComponent,
  }
]

export const ROUTING_MODULE = RouterModule.forRoot(appRoutes)