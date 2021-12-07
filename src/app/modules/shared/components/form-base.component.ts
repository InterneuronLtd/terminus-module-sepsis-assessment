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

import { Injector, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { GenericMessagePopup, GenericMessagePopupAction } from 'src/app/core/components/generic-message-popup.component';
import { AssessmentEntity, AssessmentDetail } from 'src/app/models/Assessment.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { convertJsonDataToString } from 'src/app/core/util';
import { ActionModeType } from 'src/app/models/action-mode-type.model';
import { ViewModeAssessmentModelBuilderService } from '../services/viewmode-assessment-model-builder.service';
import { EditModeAssessmentModelBuilderService } from '../services/editmode-assessment-model-builder.service';
import { NewModeAssessmentModelBuilderService } from '../services/newmode-assessment-model-builder.service';
import { TaskModeAssessmentModelBuilderService } from '../services/taskmode-assessment-model-builder.service';
import { SepsisAssessmentModuleConfigData } from 'src/app/config/app.module.config';

export abstract class FormBaseComponent extends InBaseComponent implements OnDestroy {

    protected _assessmentContextInput: { assessment: AssessmentEntity; action: ActionModeType };

    assessment: AssessmentEntity;

    showCloseConfirmationMessagePopup = false;

    confirmationMessagePopup: GenericMessagePopup = new GenericMessagePopup();

    showFullLoadingIndicator = false;

    showSaveStatusMessagePopup = false;

    saveStatusMessagePopup: GenericMessagePopup = new GenericMessagePopup();

    showLoading = false;

    viewModeAssessmentModelBuilderService: ViewModeAssessmentModelBuilderService;
    editModeAssessmentModelBuilderService: EditModeAssessmentModelBuilderService;
    newModeAssessmentModelBuilderService: NewModeAssessmentModelBuilderService;
    taskModeAssessmentModelBuilderService: TaskModeAssessmentModelBuilderService;

    messageTimeout = null;

    @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input()
    set assessmentContext(assessmentContextInput: { assessment: any; action: ActionModeType }) {

        if (assessmentContextInput && assessmentContextInput.action) {

            this._assessmentContextInput = assessmentContextInput;

            //this.loadAssessmentTask("", 0);

            this.showLoading = true;

            this.loadAssessment(() => {
                //can add loading indicator here

                if (this.assessmentContext.action === 'new') { //to be saved initally on creation of new assessment
                    this.saveDraft(false, () => {
                        this.showLoading = false;
                    });
                } else {
                    this.showLoading = false;
                }
                this.prepareSaveConfirmation();
            });
        }
    }
    get assessmentContext(): { assessment: any; action: ActionModeType } {
        return this._assessmentContextInput;
    }

    formAPIService: FormAPIService

    constructor(protected injector: Injector) {
        super(injector);

        this.formAPIService = injector.get(FormAPIService);

        this.viewModeAssessmentModelBuilderService = injector.get(ViewModeAssessmentModelBuilderService);
        this.editModeAssessmentModelBuilderService = injector.get(EditModeAssessmentModelBuilderService);
        this.newModeAssessmentModelBuilderService = injector.get(NewModeAssessmentModelBuilderService);
        this.taskModeAssessmentModelBuilderService = injector.get(TaskModeAssessmentModelBuilderService)
    }

    protected abstract loadAssessment(onLoad: () => void);

    ngOnDestroy() {
        super.ngOnDestroy();
        this.formAPIService.onDestroy();
        this.newModeAssessmentModelBuilderService.onDestroy();
        this.editModeAssessmentModelBuilderService.onDestroy();
        this.viewModeAssessmentModelBuilderService.onDestroy();
        this.taskModeAssessmentModelBuilderService.onDestroy();
    }

    onFormClose() {

        if ((this.assessmentContext && (this.assessmentContext.action == 'view'))) {
            if (this.close)
                this.close.emit(false);
            return;
        }
        if (this.assessmentContext.action === 'new' || this.assessmentContext.action === 'edit') {
            this.saveDraft();
        } else
            this.showCloseConfirmationMessagePopup = true;
    }

    preparePostSaveActionBasedOnStatus(status: string) {

        this.saveStatusMessagePopup.headerMessage = 'Save Status';
        this.saveStatusMessagePopup.showCloseButton = false;

        if (status === 'success') {
            this.buildSaveSuccessMessage();
        } else if (status === 'error') {
            this.buildSaveErrorMessage();
        }

        this.showSaveStatusMessagePopup = true;
    }

    buildSaveErrorMessage() {

        this.saveStatusMessagePopup.messageType = 'error';

        this.saveStatusMessagePopup.messageContent = SepsisAssessmentModuleConfigData.Config.messages.generic_save_error;//to config
        this.saveStatusMessagePopup.data = 'error';

        this.messageTimeout = setTimeout(() => {

            this.loggerService.log('On Click of CloseForm');

            this.showSaveStatusMessagePopup = false;

            if (this.close) {
                this.close.emit(false); //Just close the  form
            }
        }, 1500);

        // let actionCloseForm = new GenericMessagePopupAction();

        // actionCloseForm.name = 'Okay';

        // actionCloseForm.styleCss = 'btn-secondary';

        // actionCloseForm.onAction = () => {

        //     this.loggerService.log('On Click of CloseForm');

        //     this.showSaveStatusMessagePopup = false;

        //     if (this.close) {
        //         this.close.emit(false); //Just close the  form
        //     }
        // };

        // this.saveStatusMessagePopup.actions = [actionCloseForm];
    }


    buildSaveSuccessMessage() {

        this.saveStatusMessagePopup.messageType = 'success';
        this.saveStatusMessagePopup.messageContent = SepsisAssessmentModuleConfigData.Config.messages.generic_save_success;//to config
        this.saveStatusMessagePopup.data = 'success';

        this.messageTimeout = setTimeout(() => {
            this.loggerService.log('On Click of Success');

            this.showSaveStatusMessagePopup = false;

            if (this.close) {
                this.close.emit(false); //Just close the  form
            }
        }, 1500);

        // let actionTasksForm = new GenericMessagePopupAction();

        // actionTasksForm.name = 'Okay';
        // actionTasksForm.styleCss = 'btn-primary';

        // actionTasksForm.onAction = () => {

        //     this.loggerService.log('On Click of Success');

        //     this.showSaveStatusMessagePopup = false;

        //     if (this.close) {
        //         this.close.emit(false); //Just close the  form
        //     }
        // };

        // this.saveStatusMessagePopup.actions = [actionTasksForm];
    }

    prepareSaveConfirmation() {

        this.confirmationMessagePopup.headerMessage = 'Confirmation';
        this.confirmationMessagePopup.messageContent = SepsisAssessmentModuleConfigData.Config.messages.form_close_confirmation;
        this.confirmationMessagePopup.showCloseButton = false;

        this.confirmationMessagePopup.actions = [];

        if (this.assessmentContext.action === 'showtasks') {

            let actionYes = new GenericMessagePopupAction();

            actionYes.name = 'Yes';
            actionYes.styleCss = 'btn-primary';

            actionYes.onAction = () => {
                this.loggerService.log('On Click of Yes');
                this.showCloseConfirmationMessagePopup = false;
                this.close.emit(false);
            };
            this.confirmationMessagePopup.actions.push(actionYes);
        }

        let actionNo = new GenericMessagePopupAction();
        actionNo.name = 'Cancel';
        actionNo.styleCss = 'btn-secondary';
        actionNo.onAction = () => {
            this.loggerService.log('On Click of No');
            this.showCloseConfirmationMessagePopup = false;
        };

        //this.confirmationMessagePopup.actions = [actionYes, actionNo];
        this.confirmationMessagePopup.actions.push(actionNo);

        if (this.assessmentContext.action === 'new' || this.assessmentContext.action === 'edit') {

            let actionSaveDraft = new GenericMessagePopupAction();
            actionSaveDraft.name = 'Save to Draft';
            actionSaveDraft.styleCss = 'btn-primary';

            actionSaveDraft.onAction = () => {
                this.loggerService.log('On Click of Save as Draft');
                this.showCloseConfirmationMessagePopup = false;
                this.saveDraft();
            };
            this.confirmationMessagePopup.actions.push(actionSaveDraft);
        }
    }

    saveDraft(canShowPostSaveMsg = true, onSaveDraft?: (newAsm) => void) {
        this.loggerService.log('Showing the assessment data gathered for draft...');

        this.loggerService.log(this.assessment);

        this.showFullLoadingIndicator = true;

        let assessmentToSave = new AssessmentEntity();
        assessmentToSave.assessment_id = this.assessment.assessment_id;
        assessmentToSave.assessmenttype_id = this.assessment.assessmenttype_id;
        assessmentToSave.encounter_id = this.assessment.encounter_id;
        assessmentToSave.formtype_id = this.assessment.formtype_id;
        assessmentToSave.observationevent_id = this.assessment.observationevent_id;
        assessmentToSave.person_id = this.assessment.person_id;
        assessmentToSave.taskformsectionid = this.assessment.taskformsectionid;
        assessmentToSave.versionid = this.assessment.versionid;
        assessmentToSave.isamended = this.assessment.isamended;
        assessmentToSave.isdraft = true;
        assessmentToSave.sourceofinvocation = this.assessment.sourceofinvocation;

        assessmentToSave.assessmentdetails = [];

        this.assessment.assessmentdetails.forEach((asmDet) => {

            let asmDetail = new AssessmentDetail();
            asmDetail.assessment_id = asmDet.assessment_id;
            asmDetail.assessmentdata = asmDet.assessmentdata;
            asmDetail.assessmentdataAsJSON = asmDet.assessmentdataAsJSON;
            asmDetail.assessmentdetail_id = asmDet.assessmentdetail_id;
            asmDetail.assessmentversionid = asmDet.assessmentversionid;
            asmDetail.formsection_id = asmDet.formsection_id;
            asmDetail.formtype_id = asmDet.formtype_id;
            asmDetail.sectiontemplateversionid = asmDet.sectiontemplateversionid;

            asmDetail.assessmentdata = convertJsonDataToString(asmDet.assessmentdataAsJSON);
            assessmentToSave.assessmentdetails.push(asmDetail);
        });

        this.loggerService.log('Saving assessment as draft');
        this.loggerService.log(assessmentToSave);

        this.formAPIService.saveAssessmentWithDetailsAsDraft(this.assessmentContext.action, assessmentToSave,
            (newAssessment) => {

                if (canShowPostSaveMsg) {
                    if (newAssessment) {
                        this.preparePostSaveActionBasedOnStatus('success');
                    } else {
                        this.preparePostSaveActionBasedOnStatus('error');
                    }

                    this.showSaveStatusMessagePopup = true;
                    this.showFullLoadingIndicator = false;

                    if (onSaveDraft) onSaveDraft(newAssessment);
                } else {
                    this.showFullLoadingIndicator = false;

                    if (onSaveDraft) onSaveDraft(newAssessment);
                }

            });
    }
}