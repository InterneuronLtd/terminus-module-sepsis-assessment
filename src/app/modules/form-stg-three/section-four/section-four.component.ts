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

import { Component, OnInit, Input, OnDestroy, Injector } from '@angular/core';
import { SectionFourVM } from '../section-four/sectionFour.model';
import { AssessmentEntity, SectionData, AssessmentDetail, Answer } from 'src/app/models/Assessment.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { GenericMessagePopup, GenericMessagePopupAction } from 'src/app/core/components/generic-message-popup.component';
import { FormStageThreeSectionBaseComponent } from '../common/components/form-stg-three-section-base.components';
import { FORM_STG_THREE_CONFIG } from '../config/form-stg-three.config';
import { convertJsonDataToString } from 'src/app/core/util';

@Component({
  selector: 'app-form3-section-four',
  templateUrl: './section-four.component.html',
  styleUrls: ['./section-four.component.css']
})
export class SectionFourComponent extends FormStageThreeSectionBaseComponent implements OnInit, OnDestroy {

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

  sectionFourVM: SectionFourVM = new SectionFourVM();

  sectionFourAssessmentDetail: AssessmentDetail;

  showAmberActionPanel: boolean = false;

  showSubmitPanel: boolean = false;

  showConfirmationMessagePopup = false;

  showLoadingIndicator = false;

  confirmationMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  showSaveStatusMessagePopup = false;

  saveStatusMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  disableOptions = false;

  hasTask = false;

  constructor(protected injector: Injector,
    private formAPIService: FormAPIService) {

    super(injector);

    this.saveConfirmation(this.confirmationMessagePopup, FORM_STG_THREE_CONFIG.section_4_config.messages.SaveConfirmationMessage,
      () => {
        this.showConfirmationMessagePopup = false;
        this.submitForm();
      }, () => {
        this.showConfirmationMessagePopup = false;
      });
  }

  ngOnInit() {
    this.sectionFourAssessmentDetail = super.retrieveSectionAssessmentDetail(this.actionMode,
      FORM_STG_THREE_CONFIG.enabled_section_id.section_4_id, this.assessment.assessmentdetails);

    this.originalSectionDataObj = this.sectionDataObj = super.retrieveSectionData(this.actionMode, FORM_STG_THREE_CONFIG.section_4_config.question_1_id, this.sectionFourAssessmentDetail);

    super.populateControls(this.sectionDataObj, this.sectionFourVM);

    this.disableOptions = this.sectionFourVM.selectedYesNo !== 'YES';

    this.computeDisplaySelection(this.sectionFourVM.selectedYesNo);

    if (!this.readOnly) {
      this.showSubmitPanel = this.sectionFourVM.selectedYesNo == 'NO';
      this.showAmberActionPanel = this.sectionFourVM.selectedYesNo == 'YES';
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onDecisionChange(event: any) {

    if (this.readOnly) return;

    this.computeDisplaySelection(this.sectionFourVM.selectedYesNo);

    this.disableOptions = false;

    this.showSubmitPanel = this.sectionFourVM.selectedYesNo == 'NO';

    this.showAmberActionPanel = this.sectionFourVM.selectedYesNo == 'YES';

    //this.showSubmitPanel = false;

    if (this.sectionFourVM.selectedYesNo !== 'YES') {
      this.disableOptions = true;
      this.resetOptionsSelected();
    }

    let answer = this.sectionDataObj.sectiondata[0].answer; //since it have only one question

    answer['selectedYesNo'] = this.sectionFourVM.selectedYesNo;

    let metaIndex = answer.meta.findIndex(m => m.key === 'YES' || m.key === 'NO' || m.key === 'NOT ANSWERED');

    if (metaIndex > -1) {
      answer.meta.splice(metaIndex, 1);
    }
    answer.meta.push({ key: this.sectionFourVM.selectedYesNo });

    this.sectionFourAssessmentDetail.assessmentdataAsJSON = this.sectionDataObj;

    this.loggerService.log('New Data: onDecisionChange');

    this.loggerService.log(this.sectionFourAssessmentDetail.assessmentdataAsJSON);
  }

  resetOptionsSelected() {
    let resetAnswer = new Answer();
    resetAnswer.meta = [];
    this.sectionDataObj.sectiondata[0].answer = resetAnswer;

    this.sectionFourVM.Acutedeteriorationinfunctionalability = false;
    this.sectionFourVM.Clinicalsignsofwoundinfection = false;
    this.sectionFourVM.Heartrate91130ornewdysrhythmia = false;
    this.sectionFourVM.Immunosuppressed = false;
    this.sectionFourVM.Relativesconcernedaboutmentalstatus = false;
    this.sectionFourVM.Respiratoryrate2124 = false;
    this.sectionFourVM.SystolicBP91100mmHg = false;
    this.sectionFourVM.Temperaturelt36 = false;
    this.sectionFourVM.Traumasurgeryprocedureinlast8weeks = false;
  }

  onOptionChange(e: any) {

    if (this.readOnly) return;

    const id = e.key;
    const itemText = e.text;

    let answer = this.sectionDataObj.sectiondata[0].answer; //since it have only one question
    answer[id] = this.sectionFourVM[id];

    let metaIndex = answer.meta.findIndex(m => m.key === itemText);

    if (metaIndex > -1) {

      if (!this.sectionFourVM[id]) {// remove 
        answer.meta.splice(metaIndex, 1);
      }
    } else if (this.sectionFourVM[id]) {//selected true
      answer.meta.push({ key: itemText });
    }

    this.sectionFourAssessmentDetail.assessmentdataAsJSON = this.sectionDataObj;

    this.loggerService.log('New Data');

    this.loggerService.log(this.sectionFourAssessmentDetail.assessmentdataAsJSON);
  }

  submitForm() {

    this.loggerService.log('Showing the assessment data gathered in section 3...');

    this.loggerService.log(this.assessment);

    this.showLoadingIndicator = true;

    if (this.hasTask)
      this.assessment.taskformsectionid = FORM_STG_THREE_CONFIG.enabled_section_id.section_4_id;

    this.formAPIService.saveAssessment(this.actionMode, this.assessment, (newAssessment) => {

      if (!newAssessment) {
        this.showLoadingIndicator = false;
        this.preparePostSaveActionBasedOnStatus('error');
        this.showSaveStatusMessagePopup = true;
        return;
      }

      let section1AssessmentDetail: AssessmentDetail = this.assessment.assessmentdetails.find(ad => ad.formsection_id == FORM_STG_THREE_CONFIG.enabled_section_id.section_1_id);

      let section2AssessmentDetail: AssessmentDetail = this.assessment.assessmentdetails.find(ad => ad.formsection_id == FORM_STG_THREE_CONFIG.enabled_section_id.section_2_id);

      let section3AssessmentDetail: AssessmentDetail = this.assessment.assessmentdetails.find(ad => ad.formsection_id == FORM_STG_THREE_CONFIG.enabled_section_id.section_3_id);

      let assessDetailsToPersist = [];

      if (section1AssessmentDetail) {
        //section1AssessmentDetail.convertJsonDataToStringAndReAssign();
        section1AssessmentDetail.assessmentdata = convertJsonDataToString(section1AssessmentDetail.assessmentdataAsJSON);
        assessDetailsToPersist.push(section1AssessmentDetail);
        //this.formAPIService.saveAssessmentDetail(this.actionMode, section1AssessmentDetail);
      }

      if (section2AssessmentDetail) {
        //section2AssessmentDetail.convertJsonDataToStringAndReAssign();
        section2AssessmentDetail.assessmentdata = convertJsonDataToString(section2AssessmentDetail.assessmentdataAsJSON);
        assessDetailsToPersist.push(section2AssessmentDetail);
        //this.formAPIService.saveAssessmentDetail(this.actionMode, section2AssessmentDetail);
      }

      if (section3AssessmentDetail) {
        //section3AssessmentDetail.convertJsonDataToStringAndReAssign();
        section3AssessmentDetail.assessmentdata = convertJsonDataToString(section3AssessmentDetail.assessmentdataAsJSON);
        assessDetailsToPersist.push(section3AssessmentDetail);
        //this.formAPIService.saveAssessmentDetail(this.actionMode, section3AssessmentDetail);
      }

      if (this.sectionFourAssessmentDetail) {
        //this.sectionFourAssessmentDetail.convertJsonDataToStringAndReAssign();
        this.sectionFourAssessmentDetail.assessmentdata = convertJsonDataToString(this.sectionFourAssessmentDetail.assessmentdataAsJSON);
        assessDetailsToPersist.push(this.sectionFourAssessmentDetail);
        //this.formAPIService.saveAssessmentDetail(this.actionMode, this.sectionFourAssessmentDetail);
      }

      this.formAPIService.saveAssessmentDetails(this.actionMode, assessDetailsToPersist, (savedAssessmentDetails) => {
        if (savedAssessmentDetails && savedAssessmentDetails.length > 0) {
          this.preparePostSaveActionBasedOnStatus('success', this.hasTask);
        } else {
          this.preparePostSaveActionBasedOnStatus('error');
        }

        this.showSaveStatusMessagePopup = true;
        this.showLoadingIndicator = false;
      });

      //Delete section 3 assessment tasks if exists
    });
  }

  confirmSave(hasTask = true) {
    this.showConfirmationMessagePopup = true;
    this.hasTask = hasTask;
  }

  preparePostSaveActionBasedOnStatus(status: string, showTaskAction?: boolean) {

    this.postSaveAction(this.saveStatusMessagePopup, FORM_STG_THREE_CONFIG.section_4_config.messages.SuccessSaveMessage,
      FORM_STG_THREE_CONFIG.section_4_config.messages.ErrorSaveMessage,
      () => {
        this.showSaveStatusMessagePopup = false;
      },
      () => {
        this.showSaveStatusMessagePopup = false;
      },
      status, showTaskAction, this.assessment);
  }


}
