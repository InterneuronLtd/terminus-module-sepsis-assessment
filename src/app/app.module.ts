//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2021  Interneuron CIC

//This program is free software: you can redistribute it and/or modify
//it under the terms of the GNU General Public License as published by
//the Free Software Foundation, either version 3 of the License, or
//(at your option) any later version.

//This program is distributed in the hope that it will be useful,
//but WITHOUT ANY WARRANTY; without even the implied warranty of
//MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

//See the
//GNU General Public License for more details.

//You should have received a copy of the GNU General Public License
//along with this program.If not, see<http://www.gnu.org/licenses/>.
//END LICENSE BLOCK 
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { createCustomElement } from '@angular/elements';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule, ButtonsModule, TimepickerModule, BsDatepickerModule } from 'ngx-bootstrap';
import { FormStageTwoModule } from './modules/form-stg-two/form-stg-two.module';
import { SharedModule } from './modules/shared/shared.module';
import { SepsisCoreModule } from './core/sepsis.core.module';
import { FormStageOneModule } from './modules/form-one/form-stage-one.module';
import { FormStageThreeModule } from './modules/form-stg-three/form-stg-three.module';
import { FormStageFourModule } from './modules/form-stg-four/form-stg-four.module';

@NgModule({
  declarations: [
    AppComponent
  ],

  imports: [
    HttpClientModule,
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    FormStageOneModule,
    FormStageTwoModule,
    FormStageThreeModule,
    FormStageFourModule,   
    //SharedModule,
    SepsisCoreModule
  ],
  providers: [],
  bootstrap: [],
  entryComponents:[AppComponent]
})
// export class AppModule {
//   constructor(private injector: Injector) { }
// }
export class AppModule {

  constructor(private injector: Injector) { }

  ngDoBootstrap(): void {
    const assessmentComponentElement = createCustomElement(AppComponent, {
      injector: this.injector
    });
    customElements.define("app-sepsis-assessment", assessmentComponentElement);
  }
}
