//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

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
/* Interneuron Sepsis Assessment App
Copyright(C) 2023  Interneuron Holdings Ltd
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.If not, see<http://www.gnu.org/licenses/>. */

import { Component, OnInit, Injector, Input, OnDestroy } from '@angular/core';
import { SectionTwoVM } from '../section-two/sectionTwo.model';
import { Answer } from 'src/app/models/formSection.Model';
import { AssessmentDetail, AssessmentEntity, SectionData } from 'src/app/models/Assessment.model';
import { FormOneContextService } from '../services/form-one-context.service';
import { FORM_ONE_CONFIG } from '../config/form-one.config';
import { FormOneSectionBaseComponent } from '../common/components/form-one-section-base.components';
import { FormAPIService } from 'src/app/services/form-api.service';
import { GenericMessagePopup } from 'src/app/core/components/generic-message-popup.component';
import { convertJsonDataToString } from 'src/app/core/util';

@Component({
  selector: 'app-section-two',
  templateUrl: './section-two.component.html',
  styleUrls: ['./section-two.component.css']
})
export class SectionTwoComponent extends FormOneSectionBaseComponent implements OnInit, OnDestroy {
  readOnly = false;
  _actionMode: string;

  @Input() assessment: AssessmentEntity;

  @Input()
  set actionMode(val: string) {

    this._actionMode = val;

    this.readOnly = (val === 'view' || val === 'history' || val === 'viewhistory');
  }
  get actionMode(): string {
    return this._actionMode;
  }

  originalAssessment: AssessmentEntity;

  sectionDataObj: SectionData;

  originalSectionDataObj: SectionData;

  sectionTwoVM: SectionTwoVM = new SectionTwoVM();

  sectionTwoAssessmentDetail: AssessmentDetail;

  showConfirmationMessagePopup = false;

  showLoadingIndicator = false;

  confirmationMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  showSaveStatusMessagePopup = false;

  saveStatusMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  disableOptions = false;

  constructor(protected injector: Injector,
    private formOneContextService: FormOneContextService,
    private formAPIService: FormAPIService
  ) {
    super(injector);

    this.saveConfirmation(this.confirmationMessagePopup, FORM_ONE_CONFIG.section_2_config.messages.SaveConfirmationMessage,
      () => {
        this.showConfirmationMessagePopup = false;
        this.submitForm();
      }, () => {
        this.showConfirmationMessagePopup = false;
      });

  }

  ngOnInit() {

    this.sectionTwoAssessmentDetail = super.retrieveSectionAssessmentDetail(this.actionMode,
      FORM_ONE_CONFIG.enabled_section_id.section_2_id, this.assessment.assessmentdetails);

    this.originalSectionDataObj = this.sectionDataObj = super.retrieveSectionData(this.actionMode, FORM_ONE_CONFIG.section_2_config.question_1_id, this.sectionTwoAssessmentDetail);

    super.populateControls(this.sectionDataObj, this.sectionTwoVM);

    this.disableOptions = this.sectionTwoVM.selectedYesNo !== 'YES';

    this.computeDisplaySelection(this.sectionTwoVM.selectedYesNo);

    this.loggerService.log('inside section two');
    this.loggerService.log(this.sectionTwoVM);

    this.formOneContextService.displaySectionThree = this.sectionTwoVM.selectedYesNo === 'YES';
    this.sectionTwoVM.showSubmitPanel = (!this.readOnly && this.sectionTwoVM.selectedYesNo == 'NO');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }


  submitForm() {

    this.loggerService.log('Showing the assessment data gathered in section 2...');

    this.loggerService.log(this.assessment);

    this.showLoadingIndicator = true;

    this.formAPIService.saveAssessment(this.actionMode, this.assessment,
      (newAssessment) => {

        if (!newAssessment) {
          this.showLoadingIndicator = false;
          this.preparePostSaveActionBasedOnStatus('error');
          this.showSaveStatusMessagePopup = true;
          return;
        }

        let section1AssessmentDetail: AssessmentDetail = this.assessment.assessmentdetails.find(ad => ad.formsection_id == FORM_ONE_CONFIG.enabled_section_id.section_1_id);

        let section3AssessmentDetail: AssessmentDetail = this.assessment.assessmentdetails.find(ad => ad.formsection_id == FORM_ONE_CONFIG.enabled_section_id.section_3_id);

        let section4AssessmentDetail: AssessmentDetail = this.assessment.assessmentdetails.find(ad => ad.formsection_id == FORM_ONE_CONFIG.enabled_section_id.section_4_id);

        let assessDetailsToPersist = [];

        if (section1AssessmentDetail) {
          section1AssessmentDetail.assessmentdata = convertJsonDataToString(section1AssessmentDetail.assessmentdataAsJSON);
          assessDetailsToPersist.push(section1AssessmentDetail);
        }

        if (this.sectionTwoAssessmentDetail) {
          this.sectionTwoAssessmentDetail.assessmentdata = convertJsonDataToString(this.sectionTwoAssessmentDetail.assessmentdataAsJSON);

          assessDetailsToPersist.push(this.sectionTwoAssessmentDetail);
        }

        if (section3AssessmentDetail) {
          section3AssessmentDetail.assessmentdata = JSON.stringify({});
          assessDetailsToPersist.push(section3AssessmentDetail);
        }

        if (section4AssessmentDetail) {
          section4AssessmentDetail.assessmentdata = JSON.stringify({});
          assessDetailsToPersist.push(section4AssessmentDetail);
        }

        this.formAPIService.saveAssessmentDetails(this.actionMode, assessDetailsToPersist, (savedAssessmentDetails) => {
          if (savedAssessmentDetails && savedAssessmentDetails.length > 0) {
            this.preparePostSaveActionBasedOnStatus('success', false);
          } else {
            this.preparePostSaveActionBasedOnStatus('error');
          }

          this.showSaveStatusMessagePopup = true;
          this.showLoadingIndicator = false;
        });

        //Delete section 3 and 4 assessment detail if exists
        //Delete section 3 or section 4 assessment tasks if exists
      });
  }

  preparePostSaveActionBasedOnStatus(status: string, showNextAction?: boolean) {

    this.postSaveAction(this.saveStatusMessagePopup, FORM_ONE_CONFIG.section_2_config.messages.SuccessSaveMessage,
      FORM_ONE_CONFIG.section_2_config.messages.ErrorSaveMessage,
      () => {
        this.showSaveStatusMessagePopup = false;
      },
      () => {
        this.showSaveStatusMessagePopup = false;
      },
      status, showNextAction,
      this.assessment);
  }

  onDecisionChange(event: any) {

    if (this.readOnly) return;

    this.disableOptions = false;

    this.computeDisplaySelection(this.sectionTwoVM.selectedYesNo);

    this.formOneContextService.displaySectionThree = this.sectionTwoVM.selectedYesNo === 'YES';

    this.sectionTwoVM.showSubmitPanel = this.sectionTwoVM.selectedYesNo == 'NO';

    if (this.sectionTwoVM.selectedYesNo != 'YES') {
      this.formOneContextService.displaySectionFour = false;
      this.disableOptions = true;
      this.resetOptionsSelected();
      this.resetOtherDependentSectionsData();
    }

    let answer = this.sectionDataObj.sectiondata[0].answer; //since it have only one question

    answer['selectedYesNo'] = this.sectionTwoVM.selectedYesNo;

    let metaIndex = answer.meta.findIndex(m => m.key === 'YES' || m.key === 'NO' || m.key === 'NOT ANSWERED');

    if (metaIndex > -1) {
      answer.meta.splice(metaIndex, 1);
    }
    answer.meta.push({ key: this.sectionTwoVM.selectedYesNo });

    this.sectionTwoAssessmentDetail.assessmentdataAsJSON = this.sectionDataObj;

    this.loggerService.log('New Data: onDecisionChange');

    this.loggerService.log(this.sectionTwoAssessmentDetail.assessmentdataAsJSON);
  }


  onOptionChange(e: any) {

    if (this.readOnly) return;

    const id = e.key;
    const itemText = e.text;

    let answer = this.sectionDataObj.sectiondata[0].answer; //since it have only one question
    answer[id] = this.sectionTwoVM[id];

    let metaIndex = answer.meta.findIndex(m => m.key === itemText);

    if (metaIndex > -1) {

      if (!this.sectionTwoVM[id]) {// remove 
        answer.meta.splice(metaIndex, 1);
      }
    } else if (this.sectionTwoVM[id]) {//selected true
      answer.meta.push({ key: itemText });
    }

    this.sectionTwoAssessmentDetail.assessmentdataAsJSON = this.sectionDataObj;

    this.loggerService.log('New Data');

    this.loggerService.log(this.sectionTwoAssessmentDetail.assessmentdataAsJSON);

  }

  resetOtherDependentSectionsData(): any {

    let dependentAssessmentDetails: AssessmentDetail[] = this.assessment.assessmentdetails.filter(ad =>
      ad.formsection_id == FORM_ONE_CONFIG.enabled_section_id.section_4_id || ad.formsection_id == FORM_ONE_CONFIG.enabled_section_id.section_3_id);

    if (dependentAssessmentDetails) {
      dependentAssessmentDetails.forEach(ad => {
        ad.assessmentdata = '';
        ad.assessmentdataAsJSON = new SectionData();
      });
    }
  }

  resetOptionsSelected() {
    let resetAnswer = new Answer();
    resetAnswer.meta = [];
    this.sectionDataObj.sectiondata[0].answer = resetAnswer;

    this.sectionTwoVM.Brain = false;
    this.sectionTwoVM.Indwellingdevice = false;
    this.sectionTwoVM.Other = false;
    this.sectionTwoVM.Respiratory = false;
    this.sectionTwoVM.Skinjointwound = false;
    this.sectionTwoVM.Surgical = false;
    this.sectionTwoVM.Urine = false;

  }

  confirmSave() {
    this.showConfirmationMessagePopup = true;
  }

  
}




