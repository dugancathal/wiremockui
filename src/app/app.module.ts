import { DatePipe } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'


import { AppComponent } from './app.component'
import { ConfigComponent } from './config/config.component'
import { DebounceKeyupDirective } from './lib/debounce/debounce.directive'
import { TableComponent } from './lib/table/table.component'
import { WindowWrapper } from './lib/window/window-wrapper'
import { MAPPINGS_COMPONENTS } from './mappings'
import { RequestsListComponent } from './recordings/list.component'
import { RequestsShowComponent } from './recordings/show.component'
import { ROUTING_MODULE } from './routing.module'
import { WiremockUrlService } from './wiremock/wiremock-url.service'
import { WiremockService } from './wiremock/wiremock.service'


@NgModule({
  declarations: [
    AppComponent,
    ...MAPPINGS_COMPONENTS,
    RequestsListComponent,
    RequestsShowComponent,
    TableComponent,
    ConfigComponent,
    DebounceKeyupDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ROUTING_MODULE,
  ],
  providers: [
    WiremockService,
    WiremockUrlService,
    WindowWrapper,
    DatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
