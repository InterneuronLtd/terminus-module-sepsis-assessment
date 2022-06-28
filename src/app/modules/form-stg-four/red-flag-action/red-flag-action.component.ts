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

import { Component, OnInit, Input, Injector, OnDestroy } from '@angular/core';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { FORM_STG_FOUR_CONFIG } from '../config/form-stg-four.config';
import { AssessmentTask } from 'src/app/models/AssessmentTask.model';
import { UUID } from 'angular2-uuid';
import { takeUntil } from 'rxjs/operators';
import { InAppBaseApiService } from 'src/app/services/in.appbase.service';
import { FormStageFourContextService } from '../services/form-stg-four-context.service';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FormActionBaseComponent } from '../../shared/components/form-action-base.component';
import { GenericMessagePopup } from 'src/app/core/components/generic-message-popup.component';
import { SepsisAssessmentModuleConfigData } from 'src/app/config/app.module.config';

@Component({
  selector: 'app-form4-red-flag-action',
  templateUrl: './red-flag-action.component.html',
  styleUrls: ['./red-flag-action.component.css']
})
export class RedFlagActionComponent extends FormActionBaseComponent implements OnInit, OnDestroy {

  @Input() assessment: AssessmentEntity;

  @Input() actionMode: string = "NEW";

  showAllActions: boolean = false;

  showConfirmationMessagePopup = false;

  showLoadingIndicator = false;

  confirmationMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  showSaveStatusMessagePopup = false;

  saveStatusMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  formtask1TemplateVersionId: number;
  formtask2TemplateVersionId: number;
  formtask3TemplateVersionId: number;
  formtask4TemplateVersionId: number;
  formtask5TemplateVersionId: number;
  formtask6TemplateVersionId: number;
  formtask7TemplateVersionId: number;
  showErrorMessage: boolean;

  constructor(protected injector: Injector, private apiService: InAppBaseApiService, private formStageFourContextService: FormStageFourContextService, private formAPIService: FormAPIService) {
    super(injector);

    this.saveConfirmation(this.confirmationMessagePopup, FORM_STG_FOUR_CONFIG.section_3_config.messages.SaveConfirmationMessage,
      () => {
        this.showConfirmationMessagePopup = false;
        this.saveTask();
      }, () => {
        this.showConfirmationMessagePopup = false;
      });
  }

  ngOnInit() {

    if (this.assessment.assessmenttasks.length == 0) {
      this.getFormTaskMeta(() => {
        this.createNewAssessmentTasks();
        this.showAllActions = true;
      });
    }
    else {
      this.assessment.assessmenttasks.forEach(ad => {
        this.assignTaskTemplateVersionId(ad);
      });
      this.showAllActions = true;
    }

  }


  ngOnDestroy() {
    super.ngOnDestroy();
  }

  getFormTaskMeta(onSucessfullFormTAskFetch: () => void) {

    // const url = `${APP_MODULE_CONFIG.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=formsection&synapseattributename=formtype_id&attributevalue=${this.mappedFormTypeId}&returnsystemattributes=1&orderby=displayorder ASC`

    const url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=sepsistask&synapseattributename=formsection_id&attributevalue=${FORM_STG_FOUR_CONFIG.enabled_section_id.section_3_id}`
    //const url = `${APP_MODULE_CONFIG.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=formsection&formtype_id=${this.mappedFormTypeId}&_recordstatus=1&orderby=displayorder ASC`;

    this.apiService.get(url)
      .pipe(takeUntil(this.destroy$))
      .subscribe((formTasksFromDB: any) => {

        let formTasks: any;

        if (typeof formTasksFromDB === 'string') {
          formTasks = JSON.parse(formTasksFromDB);
        } else {
          formTasks = formTasksFromDB;
        }

        if (!formTasks || !Array.isArray(formTasks) || formTasks.length == 0) {
          this.showErrorMessage = true;
        } else {
          const templateVersionForTask1: number[] = formTasks.filter(ft => ft.sepsistask_id === FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_1_id)
            .map(fs => fs.templateversionid);
          this.formtask1TemplateVersionId = Math.max(...templateVersionForTask1);

          const templateVersionForTask2: number[] = formTasks.filter(ft => ft.sepsistask_id === FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_2_id)
            .map(fs => fs.templateversionid);
          this.formtask2TemplateVersionId = Math.max(...templateVersionForTask2);

          const templateVersionForTask3: number[] = formTasks.filter(ft => ft.sepsistask_id === FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_3_id)
            .map(fs => fs.templateversionid);
          this.formtask3TemplateVersionId = Math.max(...templateVersionForTask3);

          const templateVersionForTask4: number[] = formTasks.filter(ft => ft.sepsistask_id === FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_4_id)
            .map(fs => fs.templateversionid);
          this.formtask4TemplateVersionId = Math.max(...templateVersionForTask4);

          const templateVersionForTask5: number[] = formTasks.filter(ft => ft.sepsistask_id === FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_5_id)
            .map(fs => fs.templateversionid);
          this.formtask5TemplateVersionId = Math.max(...templateVersionForTask5);

          const templateVersionForTask6: number[] = formTasks.filter(ft => ft.sepsistask_id === FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_6_id)
            .map(fs => fs.templateversionid);
          this.formtask6TemplateVersionId = Math.max(...templateVersionForTask6);

          const templateVersionForTask7: number[] = formTasks.filter(ft => ft.sepsistask_id === FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_7_id)
            .map(fs => fs.templateversionid);
          this.formtask7TemplateVersionId = Math.max(...templateVersionForTask7);

          if (onSucessfullFormTAskFetch) {
            onSucessfullFormTAskFetch();
          }
        }
      });
  }

  createNewAssessmentTasks() {
    this.assessment.assessmenttasks = [];

    let assessmentTaskSec1 = this.generateNewAssessmentTask(FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_1_id, this.formtask1TemplateVersionId);
    assessmentTaskSec1.assessmentversionid = this.assessment.versionid;
    this.assessment.assessmenttasks.push(assessmentTaskSec1);

    let assessmentTaskSec2 = this.generateNewAssessmentTask(FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_2_id, this.formtask2TemplateVersionId);
    assessmentTaskSec2.assessmentversionid = this.assessment.versionid;
    this.assessment.assessmenttasks.push(assessmentTaskSec2);

    let assessmentTaskSec3 = this.generateNewAssessmentTask(FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_3_id, this.formtask3TemplateVersionId);
    assessmentTaskSec3.assessmentversionid = this.assessment.versionid;
    this.assessment.assessmenttasks.push(assessmentTaskSec3);

    let assessmentTaskSec4 = this.generateNewAssessmentTask(FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_4_id, this.formtask4TemplateVersionId);
    assessmentTaskSec4.assessmentversionid = this.assessment.versionid;
    this.assessment.assessmenttasks.push(assessmentTaskSec4);

    let assessmentTaskSec5 = this.generateNewAssessmentTask(FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_5_id, this.formtask5TemplateVersionId);
    assessmentTaskSec5.assessmentversionid = this.assessment.versionid;
    this.assessment.assessmenttasks.push(assessmentTaskSec5);

    let assessmentTaskSec6 = this.generateNewAssessmentTask(FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_6_id, this.formtask6TemplateVersionId);
    assessmentTaskSec6.assessmentversionid = this.assessment.versionid;
    this.assessment.assessmenttasks.push(assessmentTaskSec6);

    let assessmentTaskSec7 = this.generateNewAssessmentTask(FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_7_id, this.formtask7TemplateVersionId);
    assessmentTaskSec7.assessmentversionid = this.assessment.versionid;
    this.assessment.assessmenttasks.push(assessmentTaskSec7);

  }
  generateNewAssessmentTask(task_id: string, SepisTaskTemplateVersionId: number) {
    let assessmentTaskSec = new AssessmentTask();
    assessmentTaskSec.assessmenttask_id = UUID.UUID();
    assessmentTaskSec.assessment_id = this.assessment.assessment_id;
    assessmentTaskSec.sepsistask_id = task_id;
    assessmentTaskSec.taskdata = '';
    assessmentTaskSec.assessmentversionid = this.assessment.versionid;
    assessmentTaskSec.sepsistasktemplateversionid = SepisTaskTemplateVersionId;
    assessmentTaskSec.formsection_id = this.assessment.taskformsectionid;
    assessmentTaskSec.assessmentdetail_id = " ";
    return assessmentTaskSec;
  }

  assignTaskTemplateVersionId(at: AssessmentTask) {
    if (at.sepsistask_id == FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_1_id) {
      this.formtask1TemplateVersionId = at.sepsistasktemplateversionid;
    } else if (at.sepsistask_id == FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_2_id) {
      this.formtask2TemplateVersionId = at.sepsistasktemplateversionid;
    } else if (at.sepsistask_id == FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_3_id) {
      this.formtask3TemplateVersionId = at.sepsistasktemplateversionid;
    } else if (at.sepsistask_id == FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_4_id) {
      this.formtask4TemplateVersionId = at.sepsistasktemplateversionid;
    } else if (at.sepsistask_id == FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_5_id) {
      this.formtask5TemplateVersionId = at.sepsistasktemplateversionid;
    } else if (at.sepsistask_id == FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_6_id) {
      this.formtask6TemplateVersionId = at.sepsistasktemplateversionid;
    } else if (at.sepsistask_id == FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_7_id) {
      this.formtask7TemplateVersionId = at.sepsistasktemplateversionid;
    }
  }

  confirmSave() {
    this.formStageFourContextService.errorCount = 0;
    this.formStageFourContextService.formValidation.next("Isvalide");
    if (this.formStageFourContextService.errorCount == 0) {
      this.showConfirmationMessagePopup = true;
    }
  }

  saveTask() {

    this.showLoadingIndicator = true;
    if (this.formStageFourContextService.errorCount == 0) {
      this.formAPIService.saveAssessmentTask(this.actionMode, this.assessment.assessmenttasks, (newAssessmentTasks: AssessmentTask[]) => {
        if (newAssessmentTasks && newAssessmentTasks.length > 0) {
          this.preparePostSaveActionBasedOnStatus('success');
        } else {
          this.preparePostSaveActionBasedOnStatus('error');
        }

        this.showSaveStatusMessagePopup = true;
        this.showLoadingIndicator = false;
      });
    }
  }

  preparePostSaveActionBasedOnStatus(status: string, showNextAction?: boolean) {

    this.postSaveAction(this.saveStatusMessagePopup, FORM_STG_FOUR_CONFIG.sepsistask_common_config.messages.SuccessSaveMessage,
      FORM_STG_FOUR_CONFIG.sepsistask_common_config.messages.ErrorSaveMessage,
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
