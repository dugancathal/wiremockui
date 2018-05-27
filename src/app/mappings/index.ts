import { MappingEditComponent } from './edit.component'
import { MappingFormComponent } from './form.component'
import { MappingsListComponent } from './list.component'
import { MappingNewComponent } from './new.component'
import { MappingShowComponent } from './show.component'

export * from './list.component'
export * from './new.component'
export * from './show.component'
export * from './edit.component'
export * from './form.component'

export const MAPPINGS_COMPONENTS = [
  MappingsListComponent,
  MappingNewComponent,
  MappingShowComponent,
  MappingEditComponent,
  MappingFormComponent,
]