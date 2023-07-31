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

import { Injector, Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { GenericMessagePopup, GenericMessagePopupAction } from 'src/app/core/components/generic-message-popup.component';
import { AssessmentEntity, SectionDataItem, SectionData, Answer, AssessmentDetail } from 'src/app/models/Assessment.model';
import { SaveData } from '../models/save-data.type';

@Component({
  selector: 'app-form-section-base',
  template: ''
})
export class FormSectionBaseComponent extends InBaseComponent implements OnDestroy {

  displaySelectionCss = 'text-success';

  displaySelectionText = '';

  @Output() saveComplete?: EventEmitter<SaveData> = new EventEmitter<SaveData>();

  messageTimeout = null;

  constructor(protected injector: Injector) {
    super(injector);
  }
  ngOnDestroy() {
    super.ngOnDestroy();

    if (this.messageTimeout)
      clearTimeout(this.messageTimeout);
  }

  computeDisplaySelection(selectedYesNoOption: string) {
    this.displaySelectionCss = 'text-success';
    this.displaySelectionText = '';

    if (selectedYesNoOption === 'YES') {
      this.displaySelectionText = selectedYesNoOption;
      this.displaySelectionCss = 'text-success';

    } else if (selectedYesNoOption === 'NO') {
      this.displaySelectionText = selectedYesNoOption;
      this.displaySelectionCss = 'text-danger';
    }
  }

  saveConfirmation(confirmationMessagePopup: GenericMessagePopup, message: string, onYes: () => void, onNo: () => void) {

    confirmationMessagePopup.headerMessage = 'Save Confirmation';
    confirmationMessagePopup.messageContent = message;
    confirmationMessagePopup.showCloseButton = false;

    let actionYes = new GenericMessagePopupAction();

    actionYes.name = 'Yes';

    actionYes.styleCss = 'btn-success';

    actionYes.onAction = () => {
      this.loggerService.log('On Click of Yes');

      if (onYes) onYes();
    };

    let actionNo = new GenericMessagePopupAction();
    actionNo.name = 'NO';

    actionNo.styleCss = 'btn-secondary';
    actionNo.onAction = () => {

      this.loggerService.log('On Click of No');

      if (onNo) onNo();
    };

    confirmationMessagePopup.actions = [actionYes, actionNo];
  }

  postSaveAction(saveStatusMessagePopup: GenericMessagePopup, successMessage: string, errorMessage, onSuccess: () => void, onError: () => void, status: string, showTaskAction?: boolean, assessment?: AssessmentEntity) {

    this.loggerService.log('showTaskAction=');
    this.loggerService.log(showTaskAction);

    saveStatusMessagePopup.headerMessage = 'Save Status';

    saveStatusMessagePopup.showCloseButton = false;

    if (status === 'success') {
      this.buildSaveSuccessMessage(saveStatusMessagePopup, successMessage, onSuccess, showTaskAction, assessment);
    } else if (status === 'error') {
      this.buildSaveErrorMessage(saveStatusMessagePopup, errorMessage, onError);
    }
  }

  buildSaveSuccessMessage(saveStatusMessagePopup: GenericMessagePopup, message: string, onSuccess: () => void, showTaskAction: boolean, assessment?: AssessmentEntity) {

    saveStatusMessagePopup.messageType = 'success';

    saveStatusMessagePopup.messageContent = message;//to config

    saveStatusMessagePopup.data = 'success';

    this.messageTimeout = setTimeout(() => {
      this.loggerService.log('On Click of Add Tasks');
      this.loggerService.log(this.saveComplete);

      if (onSuccess) onSuccess();

      if (this.saveComplete) {
        if (!showTaskAction) {
          this.saveComplete.emit(null);
          return;
        }

        let saveCallbackData: SaveData = { saveStatus: 1, nextAction: 'showtasks', data: assessment };
        this.saveComplete.emit(saveCallbackData);
      }

    }, 1500);

    // let actionTasksForm = new GenericMessagePopupAction();

    // actionTasksForm.name = showTaskAction ? 'Add Tasks' : 'Okay';
    // actionTasksForm.styleCss = 'btn-primary';

    // actionTasksForm.onAction = (val) => {

    //   this.loggerService.log('On Click of Add Tasks');
    //   this.loggerService.log(this.saveComplete);

    //   if (onSuccess) onSuccess();

    //   if (this.saveComplete) {
    //     if (!showTaskAction) {
    //       this.saveComplete.emit(null);
    //       return;
    //     }

    //     let saveCallbackData: SaveData = { saveStatus: 1, nextAction: 'showtasks', data: assessment };
    //     this.saveComplete.emit(saveCallbackData);
    //   }
    // };

    // saveStatusMessagePopup.actions = [actionTasksForm];
  }

  buildSaveErrorMessage(saveStatusMessagePopup: GenericMessagePopup, message: string, onError: () => void) {

    saveStatusMessagePopup.messageType = 'error';
    saveStatusMessagePopup.messageContent = message;//to config
    saveStatusMessagePopup.data = 'error';

    this.messageTimeout = setTimeout(() => {
      this.loggerService.log('On Click of CloseForm');

      if (onError) onError();

      if (this.saveComplete) {
        this.saveComplete.emit(null); //Just close the  form
      }
    }, 1500);

    // let actionCloseForm = new GenericMessagePopupAction();

    // actionCloseForm.name = 'Okay';

    // actionCloseForm.styleCss = 'btn-secondary';

    // actionCloseForm.onAction = (val) => {

    //   this.loggerService.log('On Click of CloseForm');

    //   if (onError) onError();

    //   if (this.saveComplete) {
    //     this.saveComplete.emit(null); //Just close the  form
    //   }
    // };

    // saveStatusMessagePopup.actions = [actionCloseForm];
  }

  public retrieveSectionAssessmentDetail(actionMode: string, formSection_Id: string, assessmentDetails: AssessmentDetail[]): AssessmentDetail {

    if (actionMode === 'new') {

      let sectionAssessmentDetails = assessmentDetails
        .filter(ad => ad.formsection_id == formSection_Id);

      if (sectionAssessmentDetails && Array.isArray(sectionAssessmentDetails) && sectionAssessmentDetails.length > 0) {
        return sectionAssessmentDetails[0];
      }

    } else if (actionMode === 'view' || actionMode === 'edit') {

      let sectionAssessmentDetails = assessmentDetails.filter(ad => ad.formsection_id == formSection_Id);

      if (sectionAssessmentDetails && Array.isArray(sectionAssessmentDetails) && sectionAssessmentDetails.length > 0) {
        return sectionAssessmentDetails[0];
      }

    } else {

    }

    return null;
  }

  public retrieveSectionData(actionMode: string, question_Id: string, sectionAssessmentDetail: AssessmentDetail): SectionData {

    if (actionMode === 'new' || actionMode === 'view' || actionMode === 'edit') {

      this.loggerService.log('Trying to get assessment data');

      if (sectionAssessmentDetail && sectionAssessmentDetail.assessmentdata) {

        this.loggerService.log('Trying to get existing section data');

        let asDataAsJson = JSON.parse(sectionAssessmentDetail.assessmentdata);

        this.loggerService.log(asDataAsJson);

        if (!asDataAsJson || !Object.keys(asDataAsJson) || (Object.keys(asDataAsJson) && Object.keys(asDataAsJson).length == 0)) {
          asDataAsJson = this.createNewSectionData(question_Id);
        }

        sectionAssessmentDetail.assessmentdataAsJSON = asDataAsJson;

        this.loggerService.log('returning inside if ' + sectionAssessmentDetail.assessmentdataAsJSON);

        return sectionAssessmentDetail.assessmentdataAsJSON;

      } else {//else if (actionMode === 'new') {

        sectionAssessmentDetail.assessmentdataAsJSON = this.createNewSectionData(question_Id);
        this.loggerService.log('returning inside else' + sectionAssessmentDetail.assessmentdataAsJSON);

        return sectionAssessmentDetail.assessmentdataAsJSON;
      }
    }
    this.loggerService.log('returning null');

    return null;
  }

  private createNewSectionData(question_Id: string): SectionData {

    this.loggerService.log('Creating new assessment data');

    let answer = new Answer();

    answer.meta = [];

    //Has only one question right now
    let sectionDataItem = new SectionDataItem();
    sectionDataItem.answer = answer;
    sectionDataItem.questionKey = question_Id;

    let newSectionData = new SectionData();
    newSectionData.sectiondata = [sectionDataItem];

    return newSectionData;
  }

  public populateControls(sectionDataObj: SectionData, sectionVMToBePopulated: any) {

    this.loggerService.log('populating controls');

    this.loggerService.log(sectionDataObj);
    this.loggerService.log(sectionVMToBePopulated);

    if (!sectionDataObj || !sectionVMToBePopulated) return;

    let sd = sectionDataObj.sectiondata[0];

    if (sd.answer) {

      let propertiesOfSectionVm = Object.keys(sectionVMToBePopulated)

      if (propertiesOfSectionVm) {

        propertiesOfSectionVm.forEach(prop => {

          this.loggerService.log(`Assigning Value for: ${prop} with value: ${sd.answer[prop]}`);

          if (sd.answer[prop]) {

            sectionVMToBePopulated[prop] = sd.answer[prop];
          }
        });
      }
    }
  }
}

