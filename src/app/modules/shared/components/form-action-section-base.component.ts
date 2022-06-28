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

import { AssessmentTask, TaskData, TaskDataItemValue, TaskDataItem } from 'src/app/models/AssessmentTask.model';
import { OnDestroy, Injector, Injectable } from '@angular/core';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';

//Angular to do
@Injectable()
export class FormActionSectionBaseComponent extends InBaseComponent implements OnDestroy {

    displaySelectionCss = 'text-success';
 
    displaySelectionText = '';

    constructor(protected inject: Injector) {
        super(inject);
    }
    ngOnDestroy() {
        super.ngOnDestroy();
    }
    public computeDisplaySelection(selectedYesNoOption: string) {
        this.displaySelectionCss = 'text-success';
        this.displaySelectionText = '';
 
        if (selectedYesNoOption === 'Completed') {
            this.displaySelectionText = selectedYesNoOption;
            this.displaySelectionCss = 'text-success';
 
        } else if (selectedYesNoOption === 'Not Required') {
            this.displaySelectionText = selectedYesNoOption;
            this.displaySelectionCss = 'text-danger';
        }
    }

    public retrieveTaskData(actionMode: string, task_Id: string, sectionAssessmentTask: AssessmentTask): TaskData {

        // if (actionMode === 'new') {

        //     this.loggerService.log('Trying to get assessmentTask data');

        //     if (sectionAssessmentTask && sectionAssessmentTask.taskdata) {

        //         this.loggerService.log('Trying to get existing section one data');

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


        this.loggerService.log('Trying to get assessmentTask data');

        if (sectionAssessmentTask && sectionAssessmentTask.taskdata) {

            this.loggerService.log('Trying to get existing section one data');

            return sectionAssessmentTask.taskdataasobject = JSON.parse(sectionAssessmentTask.taskdata);

        } else {

            this.loggerService.log('Creating new assessment task data');

            let itemValue = new TaskDataItemValue();

            itemValue.meta = [];

            //Has only one task id right now
            let taskDataItem = new TaskDataItem();
            taskDataItem.data = itemValue;
            taskDataItem.taskKey = task_Id;

            let newTaskData = new TaskData();
            newTaskData.taskdata = [taskDataItem];

            return newTaskData;

        }
    }
    public retrieveAssessmentTask(actionMode: string, sepsisTask_Id: string, assessmenTasks: AssessmentTask[]): AssessmentTask {

        // if (actionMode === 'new' || actionMode === 'showtasks') {

        let assessmentTask = assessmenTasks
            .filter(ad => ad.sepsistask_id == sepsisTask_Id);

        if (assessmentTask && Array.isArray(assessmentTask) && assessmentTask.length > 0) {
            return assessmentTask[0];
        }

        // } else {

        // }

        // return null;
    }
    public populateControls(taskDataObj: TaskData, taskVMToBePopulated: any) {

        if (!taskDataObj || !taskVMToBePopulated) return;

        let td = taskDataObj.taskdata[0];

        if (td.data) {

            let propertiesOfSectionVm = Object.keys(taskVMToBePopulated);

            if (!propertiesOfSectionVm) return;

            propertiesOfSectionVm.forEach(prop => {

                if (td.data[prop]) {

                    this.loggerService.log(`Assigning Value for: ${prop} with value: ${td.data[prop]}`);
                    if (taskVMToBePopulated[prop] instanceof Date) {
                        taskVMToBePopulated[prop] = new Date(td.data[prop]);
                    }
                    else {

                        taskVMToBePopulated[prop] = td.data[prop];
                    }
                }
            });

        }
    }
}