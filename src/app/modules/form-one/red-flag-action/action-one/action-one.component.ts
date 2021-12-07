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

import { Component, OnInit, Input, Injector, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { ActionOneModel } from './actionOne.model'
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { AssessmentTask, TaskData } from 'src/app/models/AssessmentTask.model';
import { FORM_ONE_CONFIG } from '../../config/form-one.config';
import { FormOneTaskBaseComponent } from '../../common/components/form-one-task-base.component';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FormOneContextService } from '../../services/form-one-context.service';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-action-one',
  templateUrl: './action-one.component.html',
  styleUrls: ['./action-one.component.css']
})
export class ActionOneComponent extends FormOneTaskBaseComponent implements OnInit, OnDestroy {

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

  taskOnedata: TaskData;

  originalTaskDataObj: TaskData;

  assessmentTaskOneObj: AssessmentTask;

  actionOneModelVM: ActionOneModel = new ActionOneModel();

  ErrorMessage: string = "";

  constructor(private formAPIService: FormAPIService, protected injector: Injector) {
    super(injector);

    this.actionOneModelVM.taskOneTime = new Date();
    this.actionOneModelVM.taskOnedate = new Date();

    this.formOneContextService.formValidation
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (validate: string) => {
        this.validateTask();
      }

    );
  }

  ngOnInit() {

    this.loggerService.log('received assessment task in action one');
    this.loggerService.log(this.assessment.assessmenttasks);

    this.assessmentTaskOneObj = super.retrieveAssessmentTask(this.actionMode,
      FORM_ONE_CONFIG.enabled_sepsis_task_id.sepsistask_1_id, this.assessment.assessmenttasks);

    this.taskOnedata = super.retrieveTaskData(this.actionMode, FORM_ONE_CONFIG.enabled_sepsis_task_id.sepsistask_1_id, this.assessmentTaskOneObj);

    this.loggerService.log('Extracted assessment task in action one');
    this.loggerService.log(this.assessmentTaskOneObj);

    this.loggerService.log('Extracted assessment taskdata in action one');
    this.loggerService.log(this.taskOnedata);


    this.originalTaskDataObj = JSON.parse(JSON.stringify(this.taskOnedata));

    super.populateControls(this.taskOnedata, this.actionOneModelVM);

    this.computeDisplaySelection(this.actionOneModelVM.taskOneaction);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onDecisionChange(item: any) {
    if (item === 'Completed') {
      this.actionOneModelVM.taskOnedate = new Date();
      this.actionOneModelVM.taskOneTime = new Date();
    }
    this.actionOneModelVM.taskOneaction = item;
    this.computeDisplaySelection(item);
  }

  validateTask() {
    this.ErrorMessage = "";
    let ValidationERROR = "";
    let answer = this.taskOnedata.taskdata[0].data; //since it have only one question

    let metaIndex = answer.meta.findIndex(m => m.key === 'Not Done' || m.key === 'Completed' || m.key === 'NOT Required');

    if (metaIndex > -1) {
      answer.meta.splice(metaIndex, 1);
    }

    answer.meta.push({ key: this.actionOneModelVM.taskOneaction });

    answer['taskOneaction'] = this.actionOneModelVM.taskOneaction;

    if (this.actionOneModelVM.taskOneaction == "Completed") {
      answer['taskOneTime'] = this.actionOneModelVM.taskOneTime;
      answer['taskOnedate'] = this.actionOneModelVM.taskOnedate;
      answer['taskOneGrade'] = this.actionOneModelVM.taskOneGrade;
      answer['taskOneName'] = this.actionOneModelVM.taskOneName;
    }
    else if (this.actionOneModelVM.taskOneaction == "Not Required") {

      if (this.actionOneModelVM.taskOneNotes == null ||
        this.actionOneModelVM.taskOneNotes == undefined ||
        this.actionOneModelVM.taskOneNotes.length == 0) {
        ValidationERROR = "Please Enter Notes!"
      }
      else {
        answer['taskOneNotes'] = this.actionOneModelVM.taskOneNotes;
      }
    }

    this.assessmentTaskOneObj.taskdataasobject = this.taskOnedata;

    if (this.assessmentTaskOneObj) {

      if (ValidationERROR != "") {
        this.formOneContextService.errorCount = this.formOneContextService.errorCount + 1;
      }
      else {
        this.loggerService.log('Inside Action One: Re-assigning taksdata back');
        this.loggerService.log(this.taskOnedata);
        this.assessmentTaskOneObj.taskdata = JSON.stringify(this.taskOnedata);
      }
    }
    else {
      ValidationERROR = ValidationERROR + " Model Invalide!";
      this.formOneContextService.errorCount = this.formOneContextService.errorCount + 1;
    }

    this.ErrorMessage = ValidationERROR;
  }

}


