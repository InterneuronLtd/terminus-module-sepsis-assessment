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

import { Injector, Component, OnDestroy, Output, EventEmitter } from '@angular/core';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { GenericMessagePopup, GenericMessagePopupAction } from 'src/app/core/components/generic-message-popup.component';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { SaveData } from '../models/save-data.type';

@Component({
  selector: 'app-form-action-base',
  template: ''
})
export class FormActionBaseComponent extends InBaseComponent implements OnDestroy {

  messageTimeout = null;

  @Output() saveComplete?: EventEmitter<SaveData> = new EventEmitter<SaveData>();

  constructor(protected injector: Injector) {
    super(injector);
  }
  
  ngOnDestroy() {
    super.ngOnDestroy();

    if (this.messageTimeout)
      clearTimeout(this.messageTimeout);
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

    saveStatusMessagePopup.headerMessage = 'Save Status';

    saveStatusMessagePopup.showCloseButton = false;

    if (status === 'success') {
      this.buildSaveSuccessMessage(saveStatusMessagePopup, successMessage, onSuccess, showTaskAction, assessment);
    } else if (status === 'error') {
      this.buildSaveErrorMessage(saveStatusMessagePopup, errorMessage, onError);
    }
  }

  buildSaveSuccessMessage(saveStatusMessagePopup: GenericMessagePopup, message: string, onSuccess: () => void, showTasktAction: boolean, assessment?: AssessmentEntity) {

    saveStatusMessagePopup.messageType = 'success';

    saveStatusMessagePopup.messageContent = message;//to config

    saveStatusMessagePopup.data = 'success';

    this.messageTimeout = setTimeout(() => {

      this.loggerService.log('On Click of Close');

      if (onSuccess) onSuccess();

      if (this.saveComplete) {
        if (!showTasktAction) {
          this.saveComplete.emit(null);
          return;
        }

        let saveCallbackData: SaveData = { saveStatus: 1, nextAction: 'showtasks', data: assessment };
        this.saveComplete.emit(saveCallbackData);
      }

    }, 1500);

    // let actionTasksForm = new GenericMessagePopupAction();

    // actionTasksForm.name = 'Okay';
    // actionTasksForm.styleCss = 'btn-primary';

    // actionTasksForm.onAction = (val) => {

    //   this.loggerService.log('On Click of Close');

    //   if(onSuccess) onSuccess();

    //   if (this.saveComplete) {
    //     if (!showTasktAction) {
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
}


