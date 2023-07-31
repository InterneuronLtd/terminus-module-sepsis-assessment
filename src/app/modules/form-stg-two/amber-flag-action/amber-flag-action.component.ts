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

import { Component, OnInit, Input, Injector } from '@angular/core';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { GenericMessagePopup } from 'src/app/core/components/generic-message-popup.component';
import { FormActionBaseComponent } from '../../shared/components/form-action-base.component';
import { InAppBaseApiService } from 'src/app/services/in.appbase.service';
import { FormStageTwoContextService } from '../services/form-stg-two-context.service';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FORM_STG_TWO_CONFIG } from '../config/form-stg-two.config';
import { AssessmentTask } from 'src/app/models/AssessmentTask.model';
import { UUID } from 'angular2-uuid';
import { takeUntil } from 'rxjs/operators';
import { SepsisAssessmentModuleConfigData } from 'src/app/config/app.module.config';

@Component({
  selector: 'app-form2-amber-flag-action',
  templateUrl: './amber-flag-action.component.html',
  styleUrls: ['./amber-flag-action.component.css']
})
export class AmberFlagActionComponent extends FormActionBaseComponent implements OnInit {

  @Input() assessment: AssessmentEntity;

  @Input() actionMode: string = "NEW";

  showAllActions: boolean = false;

  showConfirmationMessagePopup = false;

  showLoadingIndicator = false;

  confirmationMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  showSaveStatusMessagePopup = false;

  saveStatusMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  amberTemplateVersionId: number;

  constructor(protected injector: Injector, private apiService: InAppBaseApiService, private formStageTwoContextService: FormStageTwoContextService, private formAPIService: FormAPIService) {
    super(injector);

    this.saveConfirmation(this.confirmationMessagePopup, FORM_STG_TWO_CONFIG.section_4_config.messages.SaveConfirmationMessage,
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

  saveTask() {
    this.formStageTwoContextService.errorCount = 0;
    this.formStageTwoContextService.formValidation.next("Isvalide");
    this.showLoadingIndicator = true;

    if (this.formStageTwoContextService.errorCount == 0) {
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

    this.postSaveAction(this.saveStatusMessagePopup, FORM_STG_TWO_CONFIG.sepsistask_common_config.messages.SuccessSaveMessage,
      FORM_STG_TWO_CONFIG.sepsistask_common_config.messages.ErrorSaveMessage,
      () => {
        this.showSaveStatusMessagePopup = false;
      },
      () => {
        this.showSaveStatusMessagePopup = false;
      },
      status, showNextAction,
      this.assessment);
  }
  getFormTaskMeta(onSucessfullFormTAskFetch: () => void) {

    // const url = `${APP_MODULE_CONFIG.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=formsection&synapseattributename=formtype_id&attributevalue=${this.mappedFormTypeId}&returnsystemattributes=1&orderby=displayorder ASC`

    const url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=sepsistask&synapseattributename=formsection_id&attributevalue=${FORM_STG_TWO_CONFIG.enabled_section_id.section_4_id}`
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

        } else {
          const templateVersionForTask1: number[] = formTasks.filter(ft => ft.sepsistask_id === FORM_STG_TWO_CONFIG.enabled_sepsis_task_id.sepsistask_8_id)
            .map(fs => fs.templateversionid);
          this.amberTemplateVersionId = Math.max(...templateVersionForTask1);

          if (onSucessfullFormTAskFetch) {
            onSucessfullFormTAskFetch();
          }
        }
      });
  }

  createNewAssessmentTasks() {

    this.assessment.assessmenttasks = [];
    let assessmentTaskSec1 = this.generateNewAssessmentTask(FORM_STG_TWO_CONFIG.enabled_sepsis_task_id.sepsistask_8_id, this.amberTemplateVersionId);
    assessmentTaskSec1.assessmentversionid = this.assessment.versionid;
    this.assessment.assessmenttasks.push(assessmentTaskSec1);
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
  confirmSave() {
    this.showConfirmationMessagePopup = true;
  }
  assignTaskTemplateVersionId(at: AssessmentTask) {
    if (at.sepsistask_id == FORM_STG_TWO_CONFIG.enabled_sepsis_task_id.sepsistask_8_id) {
      this.amberTemplateVersionId = at.sepsistasktemplateversionid;

    }
  }

}
