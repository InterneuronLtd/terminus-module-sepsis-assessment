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
import { FormStageFourComponent } from './form-stg-four.component';
import { FormStageFourSectionBaseComponent } from './common/components/form-stg-four-section-base.components';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule, ButtonsModule, BsDatepickerModule, TimepickerModule } from 'ngx-bootstrap';
import { SectionOneComponent  } from './section-one/section-one.component';
import { SectionTwoComponent  } from './section-two/section-two.component';
import { SectionThreeComponent  } from './section-three/section-three.component';
import { SectionFourComponent  } from './section-four/section-four.component';
import { SharedModule } from '../shared/shared.module';
import { SepsisCoreModule } from 'src/app/core/sepsis.core.module';
import { FormStageFourContextService } from './services/form-stg-four-context.service';
import { RedFlagActionComponent } from './red-flag-action/red-flag-action.component';
import { ActionOneComponent } from './red-flag-action/action-one/action-one.component';
import { ActionTwoComponent } from './red-flag-action/action-two/action-two.component';
import { ActionThreeComponent } from './red-flag-action/action-three/action-three.component';
import { ActionFourComponent } from './red-flag-action/action-four/action-four.component';
import { ActionFiveComponent } from './red-flag-action/action-five/action-five.component';
import { ActionSixComponent } from './red-flag-action/action-six/action-six.component';
import { ActionSevenComponent } from './red-flag-action/action-seven/action-seven.component';
import { AmberFlagActionComponent } from './amber-flag-action/amber-flag-action.component';
import { AmberActionOneComponent } from './amber-flag-action/amber-action-one/amber-action-one.component';
import { FormFourTaskBaseComponent } from './common/components/form-four-task-base.component';
import { EditModeAssessmentModelBuilderService } from '../shared/services/editmode-assessment-model-builder.service';
import { NewModeAssessmentModelBuilderService } from '../shared/services/newmode-assessment-model-builder.service';
import { TaskModeAssessmentModelBuilderService } from '../shared/services/taskmode-assessment-model-builder.service';
import { ViewModeAssessmentModelBuilderService } from '../shared/services/viewmode-assessment-model-builder.service';
import { FormAPIService } from 'src/app/services/form-api.service';

const FormStageThreeComponents = [
    FormStageFourComponent,
    FormStageFourSectionBaseComponent,
    FormFourTaskBaseComponent,
    SectionOneComponent,
    SectionTwoComponent,
    SectionThreeComponent,
    SectionFourComponent,
    RedFlagActionComponent,
    ActionOneComponent,
    ActionTwoComponent,
    ActionThreeComponent,
    ActionFourComponent,
    ActionFiveComponent,
    ActionSixComponent,
    ActionSevenComponent,
    AmberFlagActionComponent,
    AmberActionOneComponent
    
];

@NgModule({
    declarations: [
        ...FormStageThreeComponents
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        FormsModule,
        BrowserModule,
        BrowserAnimationsModule,
        ModalModule.forRoot(),
        ButtonsModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TimepickerModule.forRoot(),
        SharedModule,
        SepsisCoreModule
    ],
    providers: [FormStageFourContextService,
        EditModeAssessmentModelBuilderService,
        NewModeAssessmentModelBuilderService,
        TaskModeAssessmentModelBuilderService,
        ViewModeAssessmentModelBuilderService,
        FormAPIService],
    bootstrap: [],
    exports: [...FormStageThreeComponents],
    entryComponents: [...FormStageThreeComponents]
})
export class FormStageFourModule {
    constructor(private injector: Injector) { }
}
