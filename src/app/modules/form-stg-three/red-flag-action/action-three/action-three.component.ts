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

import { Component, OnInit, OnChanges, Input, Injector, SimpleChanges } from '@angular/core';
import { ActionthreeModel } from './actionThree.model'
import { FormThreeTaskBaseComponent } from '../../common/components/form-three-task-base.component';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { AssessmentTask, TaskData } from 'src/app/models/AssessmentTask.model';
import { FORM_STG_THREE_CONFIG } from '../../config/form-stg-three.config';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FormStageThreeContextService } from '../../services/form-stg-three-context.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-form3-action-three',
  templateUrl: './action-three.component.html',
  styleUrls: ['./action-three.component.css']
})
export class ActionThreeComponent extends FormThreeTaskBaseComponent implements OnInit, OnChanges {

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

  taskThreedata: TaskData;

  originalTaskDataObj: TaskData;

  taskThreeDataObj: AssessmentTask;


  actionThreeModelVM: ActionthreeModel;

  ErrorMessage: string = "";



  constructor(private formAPIService: FormAPIService, protected injector: Injector) {
    super(injector);
    this.actionThreeModelVM = new ActionthreeModel();

    this.actionThreeModelVM.taskThreedate = new Date();
    this.actionThreeModelVM.taskThreeTime = new Date();

    this.formStageThreeContextService.formValidation
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (validate: string) => {
        this.validateTask();
      }

    );
  }

  ngOnInit() {
    this.taskThreeDataObj = super.retrieveAssessmentTask(this.actionMode,
      FORM_STG_THREE_CONFIG.enabled_sepsis_task_id.sepsistask_3_id, this.assessment.assessmenttasks);

    this.originalTaskDataObj = this.taskThreedata = super.retrieveTaskData(this.actionMode, FORM_STG_THREE_CONFIG.enabled_sepsis_task_id.sepsistask_3_id, this.taskThreeDataObj);

    super.populateControls(this.taskThreedata, this.actionThreeModelVM);

    this.computeDisplaySelection( this.actionThreeModelVM.taskThreeaction);
  }
  onDecisionChange(item: any) {
    if (item === 'Completed') {
      this.actionThreeModelVM.taskThreedate = new Date();
      this.actionThreeModelVM.taskThreeTime = new Date();
    }
    this.actionThreeModelVM.taskThreeaction = item;
    this.computeDisplaySelection(item);
  }
  itemsubmit(event: any, id: string, text: string) {

  }
  validateTask() {
    this.ErrorMessage = "";
    let ValidationERROR = "";
    let answer = this.taskThreedata.taskdata[0].data; //since it have only one question

    let metaIndex = answer.meta.findIndex(m => m.key === 'Not Done' || m.key === 'Completed' || m.key === 'NOT Required');

    if (metaIndex > -1) {
      answer.meta.splice(metaIndex, 1);
    }
    answer.meta.push({ key: this.actionThreeModelVM.taskThreeaction });
    answer['taskThreeaction'] = this.actionThreeModelVM.taskThreeaction;


    if (this.actionThreeModelVM.taskThreeaction == "Completed") {
      answer['taskThreeTime'] = this.actionThreeModelVM.taskThreeTime;
      answer['taskThreedate'] = this.actionThreeModelVM.taskThreedate;

      answer['BLOODCULTURES'] = this.actionThreeModelVM.BLOODCULTURES;
      answer['BloodGlucose'] = this.actionThreeModelVM.BloodGlucose;
      answer['Lactate'] = this.actionThreeModelVM.Lactate;
      answer['FBC'] = this.actionThreeModelVM.FBC;
      answer['UandEs'] = this.actionThreeModelVM.UandEs;
      answer['CRP'] = this.actionThreeModelVM.CRP;
      answer['Clotting'] = this.actionThreeModelVM.Clotting;
      answer['LumbarPuncture'] = this.actionThreeModelVM.LumbarPuncture;
    }

    if (this.actionThreeModelVM.taskThreeaction == "Not Required") {
      if (this.actionThreeModelVM.taskThreeaction == null ||
        this.actionThreeModelVM.taskThreeaction == undefined ||
        this.actionThreeModelVM.taskThreeaction.length == 0) {
        ValidationERROR = "Please Enter Notes!"


      }
      else {
        answer['taskthreeNotes'] = this.actionThreeModelVM.taskthreeNotes;
      }

    }

    this.taskThreeDataObj.taskdataasobject = this.taskThreedata;
    if (this.taskThreeDataObj) {


      if (ValidationERROR != "") {

        this.formStageThreeContextService.errorCount = this.formStageThreeContextService.errorCount + 1;
      }
      else {
        this.taskThreeDataObj.taskdata = JSON.stringify(this.taskThreedata);

      }
    }
    else {
      ValidationERROR = ValidationERROR + " Model Invalide!";
      this.formStageThreeContextService.errorCount = this.formStageThreeContextService.errorCount + 1;

    }
    this.ErrorMessage = ValidationERROR;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes);
    // changes.prop contains the old and the new value...
  }


}
