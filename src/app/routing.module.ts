import { RouterModule, Routes } from '@angular/router'
import { ConfigComponent } from './config/config.component'
import { MappingEditComponent } from './mappings/edit.component'
import { MappingsListComponent } from './mappings/list.component'
import { MappingShowComponent } from './mappings/show.component'
import { RequestsListComponent } from './requests/list.component'

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
    path: 'mappings/:id/edit',
    component: MappingEditComponent
  },
  {
    path: 'requests',
    component: RequestsListComponent,
  },
  {
    path: 'config',
    component: ConfigComponent
  }
]

export const ROUTING_MODULE = RouterModule.forRoot(appRoutes)