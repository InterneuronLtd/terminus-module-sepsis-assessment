//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2022  Interneuron CIC

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

import { Component, OnDestroy, Injector } from '@angular/core';
import { FormSectionBaseComponent } from 'src/app/modules/shared/components/form-section-base.component';

@Component({
    selector: 'app-form-stg-three-section-base',
    template: ''
})
export class FormStageThreeSectionBaseComponent extends FormSectionBaseComponent implements OnDestroy {

    constructor(protected injector: Injector) {
        super(injector);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }

    // public retrieveSectionAssessmentDetail(actionMode: string, formSection_Id: string, assessmentDetails: AssessmentDetail[]): AssessmentDetail {

    //     if (actionMode === 'new') {

    //         let sectionAssessmentDetails = assessmentDetails
    //             .filter(ad => ad.formsection_id == formSection_Id);

    //         if (sectionAssessmentDetails && Array.isArray(sectionAssessmentDetails) && sectionAssessmentDetails.length > 0) {
    //             return sectionAssessmentDetails[0];
    //         }

    //     } else if (actionMode === 'view') {

    //         let sectionAssessmentDetails = assessmentDetails.filter(ad => ad.formsection_id == formSection_Id);

    //         if (sectionAssessmentDetails && Array.isArray(sectionAssessmentDetails) && sectionAssessmentDetails.length > 0) {
    //             return sectionAssessmentDetails[0];
    //         }

    //     } else {

    //     }

    //     return null;
    // }

    // public retrieveSectionData(actionMode: string, question_Id: string, sectionAssessmentDetail: AssessmentDetail): SectionData {

    //     if (actionMode === 'new' || actionMode === 'view') {

    //         this.loggerService.log('Trying to get assessment data');

    //         if (sectionAssessmentDetail && sectionAssessmentDetail.assessmentdata) {

    //             this.loggerService.log('Trying to get existing section data');

    //             return sectionAssessmentDetail.assessmentdataAsJSON = JSON.parse(sectionAssessmentDetail.assessmentdata);

    //         } else if (actionMode === 'new') {

    //             this.loggerService.log('Creating new assessment data');

    //             let answer = new Answer();

    //             answer.meta = [];

    //             //Has only one question right now
    //             let sectionDataItem = new SectionDataItem();
    //             sectionDataItem.answer = answer;
    //             sectionDataItem.questionKey = question_Id;

    //             let newSectionData = new SectionData();
    //             newSectionData.sectiondata = [sectionDataItem];

    //             return newSectionData;
    //         }
    //     }

    //     return null;
    // }

    // public populateControls(sectionDataObj: SectionData, sectionVMToBePopulated: any) {

    //     if (!sectionDataObj || !sectionVMToBePopulated) return;

    //     let sd = sectionDataObj.sectiondata[0];

    //     if (sd.answer) {

    //         let propertiesOfSectionVm = Object.keys(sectionVMToBePopulated)

    //         if (propertiesOfSectionVm) {

    //             propertiesOfSectionVm.forEach(prop => {

    //                 this.loggerService.log(`Assigning Value for: ${prop} with value: ${sd.answer[prop]}`);

    //                 if (sd.answer[prop]) {

    //                     sectionVMToBePopulated[prop] = sd.answer[prop];
    //                 }
    //             });
    //         }
    //     }
    // }

}
