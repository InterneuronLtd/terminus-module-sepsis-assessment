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

import { Component, OnInit, Input, Injector } from '@angular/core';
import { FormStageTwoContextService } from '../../services/form-stg-two-context.service';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FormTwoTaskBaseComponent } from '../../common/components/form-two-task-base.component';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { AssessmentTask, TaskData } from 'src/app/models/AssessmentTask.model';
import { FORM_STG_TWO_CONFIG } from '../../config/form-stg-two.config';
import { ActionSevenModel } from './actionSeven.model';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-form2-action-seven',
  templateUrl: './action-seven.component.html',
  styleUrls: ['./action-seven.component.css']
})
export class ActionSevenComponent extends FormTwoTaskBaseComponent implements OnInit {

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

  taskSevendata: TaskData;

  originalTaskDataObj: TaskData;

  taskSevenDataObj: AssessmentTask;

  actionSevenModelVM: ActionSevenModel = new ActionSevenModel();

  ErrorMessage: string = "";

  validationCount: number = 0;

  constructor(protected injector: Injector, private formAPIService: FormAPIService) {
    super(injector);
    this.formStageTwoContextService.formValidation
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (validate: string) => {
        this.validateTask();
      }

    );
  }

  ngOnInit() {
    this.taskSevenDataObj = super.retrieveAssessmentTask(this.actionMode,
      FORM_STG_TWO_CONFIG.enabled_sepsis_task_id.sepsistask_7_id, this.assessment.assessmenttasks);

    this.originalTaskDataObj = this.taskSevendata = super.retrieveTaskData(this.actionMode, FORM_STG_TWO_CONFIG.enabled_sepsis_task_id.sepsistask_7_id, this.taskSevenDataObj);

    super.populateControls(this.taskSevendata, this.actionSevenModelVM);
  }

  validateform() {

    // this.formAPIService.saveAssessmentTask(this.actionMode, this.taskOneDataObj);
  }

  validateTask() {
    let answer = this.taskSevendata.taskdata[0].data;
      answer['taskSevenNotes'] = this.actionSevenModelVM.taskSevenNotes;
      this.taskSevenDataObj.taskdataasobject = this.taskSevendata;
      this.taskSevenDataObj.taskdata = JSON.stringify(this.taskSevendata);

    
  }

  FormISValied(value: number) {
    return value == 6 ? true : false
  }

  formIsInValied(value: number) {
    return value < 6 ? true : false
  }

}
