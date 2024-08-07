//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2024  Interneuron Limited

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
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { CommonModule } from '@angular/common';
import { FormSectionBaseComponent } from './components/form-section-base.component';
import { FormActionBaseComponent } from './components/form-action-base.component';
import { ChartReadingComponent } from './components/chart-reading/chart-reading.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { OptionCheckboxComponent } from './components/option-checkbox/option-checkbox.component';
import { OptionCheckboxListComponent } from './components/option-checkbox/option-checkbox-list.component';
@NgModule({
    declarations: [HeaderComponent,
        FormSectionBaseComponent,
        FormActionBaseComponent,
        ChartReadingComponent,
        OptionCheckboxListComponent,
        OptionCheckboxComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        ModalModule.forRoot(),

    ],
    providers: [
    ],
    bootstrap: [],
    exports: [HeaderComponent, FormSectionBaseComponent, FormActionBaseComponent, ChartReadingComponent,
        OptionCheckboxListComponent,
        OptionCheckboxComponent],
    entryComponents: []
})
export class SharedModule {
    constructor(private injector: Injector) { }
}
