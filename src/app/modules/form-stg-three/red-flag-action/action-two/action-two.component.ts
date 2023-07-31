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

import { Component, OnInit, OnChanges, Input, Injector, SimpleChanges } from '@angular/core';
import { ActionTwoModel } from './actionTwo.model'
import { FormThreeTaskBaseComponent } from '../../common/components/form-three-task-base.component';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { AssessmentTask, TaskData } from 'src/app/models/AssessmentTask.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FORM_STG_THREE_CONFIG } from '../../config/form-stg-three.config';
import { FormStageThreeContextService } from '../../services/form-stg-three-context.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form3-action-two',
  templateUrl: './action-two.component.html',
  styleUrls: ['./action-two.component.css']
})
export class ActionTwoComponent extends FormThreeTaskBaseComponent implements OnInit, OnChanges {

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

  tasktwodata: TaskData;

  originalTaskDataObj: TaskData;

  tasktwoDataObj: AssessmentTask;

  actionTwoModelVM: ActionTwoModel = new ActionTwoModel();

  ErrorMessage: string = "";



  constructor(private formAPIService: FormAPIService, protected injector: Injector) {
    super(injector);
  
    this.formStageThreeContextService.formValidation
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (validate: string) => {
        this.validateTask();
      }

    );
  }

  ngOnInit() {
    this.tasktwoDataObj = super.retrieveAssessmentTask(this.actionMode,
      FORM_STG_THREE_CONFIG.enabled_sepsis_task_id.sepsistask_2_id, this.assessment.assessmenttasks);

    this.originalTaskDataObj = this.tasktwodata = super.retrieveTaskData(this.actionMode, FORM_STG_THREE_CONFIG.enabled_sepsis_task_id.sepsistask_2_id, this.tasktwoDataObj);

    super.populateControls(this.tasktwodata, this.actionTwoModelVM);

    this.computeDisplaySelection( this.actionTwoModelVM.taskTwoaction);
  }


  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // changes.prop contains the old and the new value...
  }


  onDecisionChange(item: any) {
    if (item === 'Completed') {
      this.actionTwoModelVM.taskTwodate = new Date();
      this.actionTwoModelVM.taskTwoTime = new Date();
    }
    this.actionTwoModelVM.taskTwoaction = item;
    this.computeDisplaySelection(item);
  }

  validateTask() {
    this.ErrorMessage = "";
    let ValidationERROR = "";
    let answer = this.tasktwodata.taskdata[0].data; //since it have only one question

    let metaIndex = answer.meta.findIndex(m => m.key === 'Not Done' || m.key === 'Completed' || m.key === 'NOT Required');

    if (metaIndex > -1) {
      answer.meta.splice(metaIndex, 1);
    }
    answer.meta.push({ key: this.actionTwoModelVM.taskTwoaction });
    answer['taskTwoaction'] = this.actionTwoModelVM.taskTwoaction;

    if (this.actionTwoModelVM.taskTwoaction == "Completed") {
      answer['taskTwoTime'] = this.actionTwoModelVM.taskTwoTime;
      answer['taskTwodate'] = this.actionTwoModelVM.taskTwodate;
    }

    if (this.actionTwoModelVM.taskTwoaction == "Not Required") {
      if (this.actionTwoModelVM.taskTwoaction == null ||
        this.actionTwoModelVM.taskTwoaction == undefined ||
        this.actionTwoModelVM.taskTwoaction.length == 0) {
        ValidationERROR = "Please Enter Notes!"


      }
      else {
        answer['taskTwoNotes'] = this.actionTwoModelVM.taskTwoNotes;
      }

    }
    this.tasktwoDataObj.taskdataasobject = this.tasktwodata;
    if (this.tasktwoDataObj) {


      if (ValidationERROR != "") {

        this.formStageThreeContextService.errorCount = this.formStageThreeContextService.errorCount + 1;
      }
      else {
        this.tasktwoDataObj.taskdata = JSON.stringify(this.tasktwodata);

      }
    }
    else {
      ValidationERROR = ValidationERROR + " Model Invalide!";
      this.formStageThreeContextService.errorCount = this.formStageThreeContextService.errorCount + 1;

    }
    this.ErrorMessage = ValidationERROR;
  }

}
