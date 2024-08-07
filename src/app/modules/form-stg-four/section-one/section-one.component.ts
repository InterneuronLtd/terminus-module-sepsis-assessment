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

import { Component, OnInit, Input, Injector, OnDestroy } from '@angular/core';
import { SectionOneVM } from './section-one.model'
import { AssessmentEntity, AssessmentDetail, SectionData, Answer } from 'src/app/models/Assessment.model';
import { FORM_STG_FOUR_CONFIG } from '../config/form-stg-four.config';
import { FormStageFourSectionBaseComponent } from '../common/components/form-stg-four-section-base.components';
import { FormStageFourContextService } from '../services/form-stg-four-context.service';
import { GenericMessagePopup } from 'src/app/core/components/generic-message-popup.component';
import { FormAPIService } from 'src/app/services/form-api.service';
import { convertJsonDataToString } from 'src/app/core/util';

@Component({
  selector: 'app-form4-section-one',
  templateUrl: './section-one.component.html',
  styleUrls: ['./section-one.component.css']
})
export class SectionOneComponent extends FormStageFourSectionBaseComponent implements OnInit, OnDestroy {

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

  sectionOneVM: SectionOneVM = new SectionOneVM();

  sectionOneAssessmentDetail: AssessmentDetail;

  disableOptions = false;

  showSubmitPanel = false;

  showConfirmationMessagePopup = false;

  showLoadingIndicator = false;

  confirmationMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  showSaveStatusMessagePopup = false;

  saveStatusMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  constructor(protected injector: Injector,
    private formStageFourContextService: FormStageFourContextService,
    private formAPIService: FormAPIService) {

    super(injector);

    this.saveConfirmation(this.confirmationMessagePopup, FORM_STG_FOUR_CONFIG.section_1_config.messages.SaveConfirmationMessage,
      () => {
        this.showConfirmationMessagePopup = false;
        this.submitForm();
      }, () => {
        this.showConfirmationMessagePopup = false;
      });
  }

  ngOnInit() {

    this.sectionOneAssessmentDetail = super.retrieveSectionAssessmentDetail(this.actionMode,
      FORM_STG_FOUR_CONFIG.enabled_section_id.section_1_id, this.assessment.assessmentdetails);

    this.originalSectionDataObj = this.sectionDataObj = super.retrieveSectionData(this.actionMode, FORM_STG_FOUR_CONFIG.section_1_config.question_1_id, this.sectionOneAssessmentDetail);

    super.populateControls(this.sectionDataObj, this.sectionOneVM);

    this.disableOptions = this.sectionOneVM.selectedYesNo !== 'YES';

    this.computeDisplaySelection(this.sectionOneVM.selectedYesNo);

    this.formStageFourContextService.displaySectionTwo = this.sectionOneVM.selectedYesNo == 'YES';

    this.showSubmitPanel = (!this.readOnly && this.sectionOneVM.selectedYesNo == 'NO');
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onDecisionChange(event: any) {

    if (this.readOnly) return;

    this.disableOptions = false;

    this.computeDisplaySelection(this.sectionOneVM.selectedYesNo);

    this.sectionOneVM.selectedYesNo !== 'YES';

    this.formStageFourContextService.displaySectionTwo = this.sectionOneVM.selectedYesNo == 'YES';

    this.showSubmitPanel = this.sectionOneVM.selectedYesNo == 'NO';

    if (this.sectionOneVM.selectedYesNo !== 'YES') {
      this.formStageFourContextService.displaySectionThree = false;
      this.formStageFourContextService.displaySectionFour = false;
      this.disableOptions = true;
      this.resetOptionsSelected();
      this.resetOtherDependentSectionsData();
    }

    let answer = this.sectionDataObj.sectiondata[0].answer; //since it have only one question

    answer['selectedYesNo'] = this.sectionOneVM.selectedYesNo;

    let metaIndex = answer.meta.findIndex(m => m.key === 'YES' || m.key === 'NO' || m.key === 'NOT ANSWERED');

    if (metaIndex > -1) {
      answer.meta.splice(metaIndex, 1);
    }
    answer.meta.push({ key: this.sectionOneVM.selectedYesNo });

    this.sectionOneAssessmentDetail.assessmentdataAsJSON = this.sectionDataObj;

    this.loggerService.log('New Data: onDecisionChange');
    this.loggerService.log(this.sectionOneAssessmentDetail.assessmentdataAsJSON);
  }

  onOptionChange(e: any) {

    if (this.readOnly) return;

    const id = e.key;
    const itemText = e.text;

    let answer = this.sectionDataObj.sectiondata[0].answer; //since it have only one question
    answer[id] = this.sectionOneVM[id];

    let metaIndex = answer.meta.findIndex(m => m.key === itemText);

    if (metaIndex > -1) {
      if (!this.sectionOneVM[id]) {// remove 
        answer.meta.splice(metaIndex, 1);
      }
    } else if (this.sectionOneVM[id]) {//selected true
      answer.meta.push({ key: itemText });
    }


    this.sectionOneAssessmentDetail.assessmentdataAsJSON = this.sectionDataObj;

    this.loggerService.log('New Data');
    this.loggerService.log(this.sectionOneAssessmentDetail.assessmentdataAsJSON);
  }

  resetOtherDependentSectionsData(): any {

    let dependentAssessmentDetails: AssessmentDetail[] = this.assessment.assessmentdetails.filter(ad =>
      ad.formsection_id == FORM_STG_FOUR_CONFIG.enabled_section_id.section_4_id || ad.formsection_id == FORM_STG_FOUR_CONFIG.enabled_section_id.section_3_id || ad.formsection_id == FORM_STG_FOUR_CONFIG.enabled_section_id.section_2_id);

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
    this.sectionOneVM.Agegreaterthen75 = false;
    this.sectionOneVM.Impairedimmunity = false;
    this.sectionOneVM.Indwellinglinesbrokenskin = false;
    this.sectionOneVM.Recenttraumasurgeryinvasiveprocedure = false;
  }

  computeCssForAction(defaultCls: any, optionToCompare: string) {
    return {
      ...defaultCls,
      'focus': this.sectionOneVM.selectedYesNo === optionToCompare && this.readOnly,
      'active': this.sectionOneVM.selectedYesNo === optionToCompare && this.readOnly,
      'action-btn-group-disabled': this.readOnly
    };
  }


  submitForm() {

    this.loggerService.log('Showing the assessment data gathered in section 1...');

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

        let section2AssessmentDetail: AssessmentDetail = this.assessment.assessmentdetails.find(ad => ad.formsection_id == FORM_STG_FOUR_CONFIG.enabled_section_id.section_2_id);

        let section3AssessmentDetail: AssessmentDetail = this.assessment.assessmentdetails.find(ad => ad.formsection_id == FORM_STG_FOUR_CONFIG.enabled_section_id.section_3_id);

        let section4AssessmentDetail: AssessmentDetail = this.assessment.assessmentdetails.find(ad => ad.formsection_id == FORM_STG_FOUR_CONFIG.enabled_section_id.section_4_id);

        let assessDetailsToPersist = [];

        if (this.sectionOneAssessmentDetail) {
          this.sectionOneAssessmentDetail.assessmentdata = convertJsonDataToString(this.sectionOneAssessmentDetail.assessmentdataAsJSON);

          assessDetailsToPersist.push(this.sectionOneAssessmentDetail);
        }

        if (section2AssessmentDetail) {
          section2AssessmentDetail.assessmentdata = convertJsonDataToString(section2AssessmentDetail.assessmentdataAsJSON);
          assessDetailsToPersist.push(section2AssessmentDetail);
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
      });
  }

  confirmSave() {
    this.showConfirmationMessagePopup = true;
  }

  preparePostSaveActionBasedOnStatus(status: string, showNextAction?: boolean) {

    this.postSaveAction(this.saveStatusMessagePopup, FORM_STG_FOUR_CONFIG.section_1_config.messages.SuccessSaveMessage,
      FORM_STG_FOUR_CONFIG.section_1_config.messages.ErrorSaveMessage,
      () => {
        this.showSaveStatusMessagePopup = false;
      },
      () => {
        this.showSaveStatusMessagePopup = false;
      },
      status, showNextAction,
      this.assessment);
  }
}

