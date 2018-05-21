import { RouterModule, Routes } from '@angular/router'
import { ConfigComponent } from './config/config.component'
import { MappingsListComponent } from './mappings/list.component'

const appRoutes: Routes = [
  {
    path: '',
    component: MappingsListComponent,
  },
  {
    path: 'mappings',
    redirectTo: ''
  },
  {
    path: 'config',
    component: ConfigComponent
  }
]

export const ROUTING_MODULE = RouterModule.forRoot(appRoutes)