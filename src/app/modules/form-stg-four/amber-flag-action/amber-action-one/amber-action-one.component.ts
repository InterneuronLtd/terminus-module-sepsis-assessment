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

import { Component, OnInit, Input, Injector, OnDestroy, ViewEncapsulation } from '@angular/core';
import { amberFlagModel } from './amberFlag.model';
import { FormFourTaskBaseComponent } from '../../common/components/form-four-task-base.component';
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { TaskData, AssessmentTask } from 'src/app/models/AssessmentTask.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { FORM_STG_FOUR_CONFIG } from '../../config/form-stg-four.config';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-form4-amber-action-one',
  templateUrl: './amber-action-one.component.html',
  styleUrls: ['./amber-action-one.component.css']
})
export class AmberActionOneComponent extends FormFourTaskBaseComponent implements OnInit, OnDestroy {

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

  actionOneModelVM: amberFlagModel = new amberFlagModel();

  ErrorMessage: string = "";


  constructor(protected injector: Injector) {
    super(injector);
    this.formStageFourContextService.formValidation
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.validateTask();
        }

      );
  }

  ngOnInit() {

    this.loggerService.log('received assessment task in action one');
    this.loggerService.log(this.assessment.assessmenttasks);

    this.assessmentTaskOneObj = super.retrieveAssessmentTask(this.actionMode,
      FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_8_id, this.assessment.assessmenttasks);

    this.taskOnedata = super.retrieveTaskData(this.actionMode, FORM_STG_FOUR_CONFIG.enabled_sepsis_task_id.sepsistask_8_id, this.assessmentTaskOneObj);

    this.loggerService.log('Extracted assessment task in action one');
    this.loggerService.log(this.assessmentTaskOneObj);

    this.loggerService.log('Extracted assessment taskdata in action one');
    this.loggerService.log(this.taskOnedata);


    this.originalTaskDataObj = JSON.parse(JSON.stringify(this.taskOnedata));

    super.populateControls(this.taskOnedata, this.actionOneModelVM);
  }

  ngOnDestroy() {
    super.ngOnDestroy();
  }

  onSeniorClinicalReviewChange(item: string) {
    this.actionOneModelVM.seniorClinicalReviewTime = new Date();
    this.actionOneModelVM.seniorClinicalReviewDate = new Date();
    this.actionOneModelVM.seniorClinicalReview = item

  }
  onAntibioticsRequiredChange(item: string) {
    this.actionOneModelVM.antibioticsRequired = item
  }
  onBloodsSentAndReviewedChange(item: string) {
    this.actionOneModelVM.bloodsSentAndReviewedTime = new Date();
    this.actionOneModelVM.bloodsSentAndReviewedate = new Date();
    this.actionOneModelVM.bloodsSentAndReviewed = item
  }

  validateTask() {
    this.ErrorMessage = "";
    let ValidationERROR = "";
    let answer = this.taskOnedata.taskdata[0].data; //since it have only one question  
    answer['seniorClinicalReview'] = this.actionOneModelVM.seniorClinicalReview;
    answer['bloodsSentAndReviewed'] = this.actionOneModelVM.bloodsSentAndReviewed;
    answer['antibioticsRequired'] = this.actionOneModelVM.antibioticsRequired;
    answer['bloodsSentAndReviewedTime'] = this.actionOneModelVM.bloodsSentAndReviewedTime;
    answer['bloodsSentAndReviewedate'] = this.actionOneModelVM.bloodsSentAndReviewedate;
    answer['seniorClinicalReviewTime'] = this.actionOneModelVM.seniorClinicalReviewTime;
    answer['seniorClinicalReviewDate'] = this.actionOneModelVM.seniorClinicalReviewDate;
    answer['amberFlagNotes'] = this.actionOneModelVM.amberFlagNotes;
    answer['taskOneNotes'] = this.actionOneModelVM.taskOneNotes;
    answer['taskTwoNotes'] = this.actionOneModelVM.taskTwoNotes;
    this.assessmentTaskOneObj.taskdataasobject = this.taskOnedata;


    if (this.assessmentTaskOneObj) {

      if (ValidationERROR != "") {
        this.formStageFourContextService.errorCount = this.formStageFourContextService.errorCount + 1;
      }
      else {
        this.loggerService.log('Inside Action One: Re-assigning taksdata back');
        this.loggerService.log(this.taskOnedata);
        this.assessmentTaskOneObj.taskdata = JSON.stringify(this.taskOnedata);
      }
    }
    else {
      ValidationERROR = ValidationERROR + " Model Invalide!";
      this.formStageFourContextService.errorCount = this.formStageFourContextService.errorCount + 1;
    }

    this.ErrorMessage = ValidationERROR;
  }
}
