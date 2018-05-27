import { RouterModule, Routes } from '@angular/router'
import { ConfigComponent } from './config/config.component'
import { MappingNewComponent } from './mappings'
import { MappingEditComponent } from './mappings/edit.component'
import { MappingsListComponent } from './mappings/list.component'
import { MappingShowComponent } from './mappings/show.component'
import { RequestsListComponent } from './recordings/list.component'
import { RequestsShowComponent } from './recordings/show.component'

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
    path: 'mappings/new',
    component: MappingNewComponent
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
    path: 'recordings',
    component: RequestsListComponent,
  },
  {
    path: 'recordings/:id',
    component: RequestsShowComponent,
  },
  {
    path: 'config',
    component: ConfigComponent
  }
]

export const ROUTING_MODULE = RouterModule.forRoot(appRoutes)