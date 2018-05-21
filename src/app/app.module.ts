import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ConfigComponent } from './config/config.component'
import { TableComponent } from './lib/table/table.component'
import { MappingsListComponent } from './mappings/list.component'
import { ROUTING_MODULE } from './routing.module'
import { WiremockUrlService } from './wiremock/wiremock-url.service'
import { WiremockService } from './wiremock/wiremock.service'


@NgModule({
  declarations: [
    AppComponent,
    MappingsListComponent,
    TableComponent,
    ConfigComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ROUTING_MODULE,
  ],
  providers: [
    WiremockService,
    WiremockUrlService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
