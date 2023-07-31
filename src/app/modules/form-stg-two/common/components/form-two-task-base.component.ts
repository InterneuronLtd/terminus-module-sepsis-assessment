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

import { Component, OnDestroy, Injector } from '@angular/core';
import { AssessmentTask, TaskData, TaskDataItemValue, TaskDataItem } from 'src/app/models/AssessmentTask.model';
import { FormSectionBaseComponent } from 'src/app/modules/shared/components/form-section-base.component';
import { FormActionSectionBaseComponent } from 'src/app/modules/shared/components/form-action-section-base.component';
import { FormStageTwoContextService } from '../../services/form-stg-two-context.service';

@Component({
    selector: 'app-form-two-task-base',
    template: ''
})
export class FormTwoTaskBaseComponent extends FormActionSectionBaseComponent implements OnDestroy {

    formStageTwoContextService: FormStageTwoContextService;
    
    constructor(protected injector: Injector) {
        super(injector);
        this.formStageTwoContextService = injector.get(FormStageTwoContextService);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    // public retrieveTaskData(actionMode: string, task_Id: string, sectionAssessmentTask: AssessmentTask): TaskData {

        
    //     this.loggerService.log('Trying to get assessmentTask data');

    //     if (sectionAssessmentTask && sectionAssessmentTask.taskdata) {



    //         return sectionAssessmentTask.taskdataasobject = JSON.parse(sectionAssessmentTask.taskdata);

    //     } else {

    //         this.loggerService.log('Creating new assessment task data');

    //         let itemValue = new TaskDataItemValue();

    //         itemValue.meta = [];

    //         //Has only one task id right now
    //         let taskDataItem = new TaskDataItem();
    //         taskDataItem.data = itemValue;
    //         taskDataItem.taskKey = task_Id;

    //         let newTaskData = new TaskData();
    //         newTaskData.taskdata = [taskDataItem];

    //         return newTaskData;

    //     }
    // }
    // public retrieveAssessmentTask(actionMode: string, sepsisTask_Id: string, assessmenTasks: AssessmentTask[]): AssessmentTask {



    //     let assessmentTask = assessmenTasks
    //         .filter(ad => ad.sepsistask_id == sepsisTask_Id);

    //     if (assessmentTask && Array.isArray(assessmentTask) && assessmentTask.length > 0) {
    //         return assessmentTask[0];
    //     }

      
    // }
    // public populateControls(taskDataObj: TaskData, taskVMToBePopulated: any) {

    //     if (!taskDataObj || !taskVMToBePopulated) return;

    //     let td = taskDataObj.taskdata[0];

    //     if (td.data) {

    //         let propertiesOfSectionVm = Object.keys(taskVMToBePopulated);

    //         if (!propertiesOfSectionVm) return;

    //         propertiesOfSectionVm.forEach(prop => {

    //             if (td.data[prop]) {

    //                 this.loggerService.log(`Assigning Value for: ${prop} with value: ${td.data[prop]}`);
    //                 if (taskVMToBePopulated[prop] instanceof Date) {
    //                     taskVMToBePopulated[prop] = new Date(td.data[prop]);
    //                 }
    //                 else {

    //                     taskVMToBePopulated[prop] = td.data[prop];
    //                 }
    //             }
    //         });

    //     }
    // }


}