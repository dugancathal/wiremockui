import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { TableComponent } from './lib/table/table.component'
import { MappingsListComponent } from './mappings/list.component'
import { ROUTING_MODULE } from './routing.module'
import { WiremockService } from './wiremock/wiremock.service'


@NgModule({
  declarations: [
    AppComponent,
    MappingsListComponent,
    TableComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ROUTING_MODULE
  ],
  providers: [
    WiremockService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
