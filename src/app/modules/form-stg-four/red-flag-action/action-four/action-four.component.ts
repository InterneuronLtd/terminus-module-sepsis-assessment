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

import { Component, OnInit, OnChanges, Input, Injector, SimpleChanges, OnDestroy } from '@angular/core';
import { FormFourTaskBaseComponent } from '../../common/components/form-four-task-base.component';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { AssessmentTask, TaskData } from 'src/app/models/AssessmentTask.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FORM_STG_FOUR_CONFIG } from '../../config/form-stg-four.config';
import { FormStageFourContextService } from '../../services/form-stg-four-context.service';
import { ActionFourModel } from './actionFour.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form4-action-four',
  templateUrl: './action-four.component.html',
  styleUrls: ['./action-four.component.css']
})
export class ActionFourComponent extends FormFourTaskBaseComponent implements OnInit, OnDestroy {

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

  taskFourdata: TaskData;

  originalTaskDataObj: TaskData;

  taskFourDataObj: AssessmentTask;

  actionFourModelVM: ActionFourModel = new ActionFourModel();

  ErrorMessage: string = "";



  constructor(private formAPIService: FormAPIService, protected injector: Injector) {
    super(injector);

    this.actionFourModelVM.taskFourTime = new Date();
    this.actionFourModelVM.taskFourdate = new Date();

    this.formStageFourContextService.formValidation
    .pipe(takeUntil(this.destroy$)) 
    .subscribe(
      (validate: string) => {
        this.validateTask();
      }

    );
  }

  ngOnInit() {
    this.taskFourDataObj = super.retrieveAssessmentTask(this.actionMode,
      FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_4_id, this.assessment.assessmenttasks);

    this.originalTaskDataObj = this.taskFourdata = super.retrieveTaskData(this.actionMode, FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_4_id, this.taskFourDataObj);

    super.populateControls(this.taskFourdata, this.actionFourModelVM);

    this.computeDisplaySelection(this.actionFourModelVM.taskFouraction);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }


  onDecisionChange(item: any) {
    if (item === 'Completed') {
      this.actionFourModelVM.taskFourdate = new Date();
      this.actionFourModelVM.taskFourTime = new Date();
    }
    this.actionFourModelVM.taskFouraction = item;
    this.computeDisplaySelection(item);
  }

  validateTask() {
    this.ErrorMessage = "";
    let ValidationERROR = "";
    let answer = this.taskFourdata.taskdata[0].data; //since it have only one question

    let metaIndex = answer.meta.findIndex(m => m.key === 'Not Done' || m.key === 'Completed' || m.key === 'NOT Required');

    if (metaIndex > -1) {
      answer.meta.splice(metaIndex, 1);
    }
    answer.meta.push({ key: this.actionFourModelVM.taskFouraction });
    answer['taskFouraction'] = this.actionFourModelVM.taskFouraction;

    if (this.actionFourModelVM.taskFouraction == "Completed") {
      answer['taskFourTime'] = this.actionFourModelVM.taskFourTime;
      answer['taskFourdate'] = this.actionFourModelVM.taskFourdate;
    }
    if (this.actionFourModelVM.taskFouraction == "Not Required") {
      if (this.actionFourModelVM.taskFourNotes == null ||
        this.actionFourModelVM.taskFourNotes == undefined ||
        this.actionFourModelVM.taskFourNotes.length == 0) {
        ValidationERROR = "Please Enter Notes!"

      }
      else {
        answer['taskFourNotes'] = this.actionFourModelVM.taskFourNotes;
      }
    }
    this.taskFourDataObj.taskdataasobject = this.taskFourdata;
    if (this.taskFourDataObj) {

      if (ValidationERROR != "") {

        this.formStageFourContextService.errorCount = this.formStageFourContextService.errorCount + 1;
      }
      else {
        this.taskFourDataObj.taskdata = JSON.stringify(this.taskFourdata);

      }
    }
    else {
      ValidationERROR = ValidationERROR + " Model Invalide!";
      this.formStageFourContextService.errorCount = this.formStageFourContextService.errorCount + 1;

    }
    this.ErrorMessage = ValidationERROR;
  }
}

