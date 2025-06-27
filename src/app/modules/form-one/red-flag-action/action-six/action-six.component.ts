//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

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
/* Interneuron Sepsis Assessment App
Copyright(C) 2023  Interneuron Holdings Ltd
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.If not, see<http://www.gnu.org/licenses/>. */
import { Component, OnInit, OnChanges, Input, Injector, SimpleChanges, OnDestroy } from '@angular/core';
import { ActionSixModel } from './actionSix.model'
import { FormOneTaskBaseComponent } from '../../common/components/form-one-task-base.component';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { AssessmentTask, TaskData } from 'src/app/models/AssessmentTask.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FORM_ONE_CONFIG } from '../../config/form-one.config';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-action-six',
  templateUrl: './action-six.component.html',
  styleUrls: ['./action-six.component.css']
})
export class ActionSixComponent extends FormOneTaskBaseComponent implements OnInit, OnDestroy {


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

  taskSixdata: TaskData;

  originalTaskDataObj: TaskData;

  taskSixDataObj: AssessmentTask;

  actionSixModelVM: ActionSixModel = new ActionSixModel();

  ErrorMessage: string = "";



  constructor(private formAPIService: FormAPIService, protected injector: Injector) {
    super(injector);

    this.actionSixModelVM.taskSixTime = new Date();
    this.actionSixModelVM.taskSixdate = new Date();
    this.formOneContextService.formValidation
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (validate: string) => {
        this.validateTask();
      }

    );
  }

  ngOnInit() {
    this.taskSixDataObj = super.retrieveAssessmentTask(this.actionMode,
      FORM_ONE_CONFIG.enabled_sepsis_task_id.sepsistask_6_id, this.assessment.assessmenttasks);

    this.originalTaskDataObj = this.taskSixdata = super.retrieveTaskData(this.actionMode, FORM_ONE_CONFIG.enabled_sepsis_task_id.sepsistask_6_id, this.taskSixDataObj);

    super.populateControls(this.taskSixdata, this.actionSixModelVM);

    this.computeDisplaySelection(this.actionSixModelVM.taskSixaction);
  }


  ngOnDestroy() {
    super.ngOnDestroy();
  }


  onDecisionChange(item: any) {
    if (item === 'Completed') {
      this.actionSixModelVM.taskSixdate = new Date();
      this.actionSixModelVM.taskSixTime = new Date();
    }
    this.actionSixModelVM.taskSixaction = item;
    this.computeDisplaySelection(item);
  }

  validateTask() {
    this.ErrorMessage = "";
    let ValidationERROR = "";
    let answer = this.taskSixdata.taskdata[0].data; //since it have only one question

    let metaIndex = answer.meta.findIndex(m => m.key === 'Not Done' || m.key === 'Completed' || m.key === 'NOT Required');

    if (metaIndex > -1) {
      answer.meta.splice(metaIndex, 1);
    }
    answer.meta.push({ key: this.actionSixModelVM.taskSixaction });
    answer['taskSixaction'] = this.actionSixModelVM.taskSixaction;

    if (this.actionSixModelVM.taskSixaction == "Completed") {
      answer['taskSixTime'] = this.actionSixModelVM.taskSixTime;
      answer['taskSixdate'] = this.actionSixModelVM.taskSixdate;
    }

    if (this.actionSixModelVM.taskSixaction == "Not Required") {
      if (this.actionSixModelVM.taskSixaction == null ||
        this.actionSixModelVM.taskSixaction == undefined ||
        this.actionSixModelVM.taskSixaction.length == 0) {
        ValidationERROR = "Please Enter Notes!"


      }
      else {
        answer['taskSixNotes'] = this.actionSixModelVM.taskSixNotes;
      }

    }
    this.taskSixDataObj.taskdataasobject = this.taskSixdata;
    if (this.taskSixDataObj) {


      if (ValidationERROR != "") {

        this.formOneContextService.errorCount = this.formOneContextService.errorCount + 1;
      }
      else {
        this.taskSixDataObj.taskdata = JSON.stringify(this.taskSixdata);

      }
    }
    else {
      ValidationERROR = ValidationERROR + " Model Invalide!";
      this.formOneContextService.errorCount = this.formOneContextService.errorCount + 1;

    }
    this.ErrorMessage = ValidationERROR;

  }
}
