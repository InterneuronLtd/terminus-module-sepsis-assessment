//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2023  Interneuron Holdings Ltd

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
import { LoadingIndicatorComponent } from './components/loading-indicator.component';
import { GenericMessagePopupComponent } from './components/generic-message-popup.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { InlineLoadingIndicatorComponent } from './components/inline-loading-indicator.component';


@NgModule({
    declarations: [
        LoadingIndicatorComponent,
        GenericMessagePopupComponent,
        InlineLoadingIndicatorComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        ModalModule.forRoot()
    ],
    providers: [],
    bootstrap: [],
    exports: [LoadingIndicatorComponent,
        GenericMessagePopupComponent, InlineLoadingIndicatorComponent],
    entryComponents: []
})
export class SepsisCoreModule {
    constructor(private injector: Injector) { }
}
// export class SepsisAppModule {

//   constructor(private injector: Injector) { }

//   ngDoBootstrap(): void {
//     const assessmentComponentElement = createCustomElement(AppComponent, {
//       injector: this.injector
//     });
//     customElements.define("app-sepsis-assessment", assessmentComponentElement);
//   }
// }
