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

import { Component, OnInit, OnChanges, Input, Injector, SimpleChanges } from '@angular/core';
import { FormTwoTaskBaseComponent } from '../../common/components/form-two-task-base.component';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { AssessmentTask, TaskData } from 'src/app/models/AssessmentTask.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FORM_STG_TWO_CONFIG } from '../../config/form-stg-two.config';
import { FormStageTwoContextService } from '../../services/form-stg-two-context.service';
import { ActionFiveModel } from './actionFive.model';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form2-action-five',
  templateUrl: './action-five.component.html',
  styleUrls: ['./action-five.component.css']
})
export class ActionFiveComponent extends FormTwoTaskBaseComponent implements OnInit, OnChanges {


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

  taskFivedata: TaskData;

  originalTaskDataObj: TaskData;

  taskFiveDataObj: AssessmentTask;

  actionFiveModelVM: ActionFiveModel = new ActionFiveModel();

  ErrorMessage: string = "";


  constructor(private formAPIService: FormAPIService,
    protected injector: Injector) {
    super(injector);

    this.actionFiveModelVM.taskFiveTime = new Date();
    this.actionFiveModelVM.taskFivedate = new Date();


    this.formStageTwoContextService.formValidation
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (validate: string) => {
        this.validateTask();
      }

    );

  }

  ngOnInit() {
    this.taskFiveDataObj = super.retrieveAssessmentTask(this.actionMode,
      FORM_STG_TWO_CONFIG.enabled_sepsis_task_id.sepsistask_5_id, this.assessment.assessmenttasks);

    this.originalTaskDataObj = this.taskFivedata = super.retrieveTaskData(this.actionMode, FORM_STG_TWO_CONFIG.enabled_sepsis_task_id.sepsistask_5_id, this.taskFiveDataObj);

    super.populateControls(this.taskFivedata, this.actionFiveModelVM);
    this.computeDisplaySelection( this.actionFiveModelVM.taskFiveaction);
  }


  ngOnChanges(changes: SimpleChanges) {
  
    // changes.prop contains the old and the new value...
  }


  onDecisionChange(item: any) {
    if (item === 'Completed') {
      this.actionFiveModelVM.taskFivedate = new Date();
      this.actionFiveModelVM.taskFiveTime = new Date();
    }
    this.actionFiveModelVM.taskFiveaction = item;
    this.computeDisplaySelection( this.actionFiveModelVM.taskFiveaction);
  }

  validateTask() {
    this.ErrorMessage = "";
    let ValidationERROR = "";
    let answer = this.taskFivedata.taskdata[0].data; //since it have only one question

    let metaIndex = answer.meta.findIndex(m => m.key === 'Not Done' || m.key === 'Completed' || m.key === 'NOT Required');

    if (metaIndex > -1) {
      answer.meta.splice(metaIndex, 1);
    }
    answer.meta.push({ key: this.actionFiveModelVM.taskFiveaction });
    answer['taskFiveaction'] = this.actionFiveModelVM.taskFiveaction;

    if (this.actionFiveModelVM.taskFiveaction == "Completed") {

      answer['taskFiveTime'] = this.actionFiveModelVM.taskFiveTime;
      answer['taskFivedate'] = this.actionFiveModelVM.taskFivedate;
    }
    if (this.actionFiveModelVM.taskFiveaction == "Not Required") {
      if (this.actionFiveModelVM.taskFiveNotes == null ||
        this.actionFiveModelVM.taskFiveNotes == undefined ||
        this.actionFiveModelVM.taskFiveNotes.length == 0) {
        ValidationERROR = "Please Enter Notes!"

      }
      else {
        answer['taskFiveNotes'] = this.actionFiveModelVM.taskFiveNotes;
      }
    }
    this.taskFiveDataObj.taskdataasobject = this.taskFivedata;
    if (this.taskFiveDataObj) {

      if (ValidationERROR != "") {

        this.formStageTwoContextService.errorCount = this.formStageTwoContextService.errorCount + 1;
      }
      else {
        this.taskFiveDataObj.taskdata = JSON.stringify(this.taskFivedata);

      }
    }
    else {
      ValidationERROR = ValidationERROR + " Model Invalide!";
      this.formStageTwoContextService.errorCount = this.formStageTwoContextService.errorCount + 1;

    }
    this.ErrorMessage = ValidationERROR;
  }
}


