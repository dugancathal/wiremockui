import { RouterModule, Routes } from '@angular/router'
import { ConfigComponent } from './config/config.component'
import { MappingsListComponent } from './mappings/list.component'
import { MappingShowComponent } from './mappings/show.component'

export const appRoutes: Routes = [
  {
    path: '',
    component: MappingsListComponent,
  },
  {
    path: 'mappings',
    redirectTo: '',
  },
  {
    path: 'mappings/:id',
    component: MappingShowComponent
  },
  {
    path: 'config',
    component: ConfigComponent
  }
]

export const ROUTING_MODULE = RouterModule.forRoot(appRoutes)