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
import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { LoggerService } from 'src/app/services/logger.service';
import { IAssessmentModelBuilderService } from './assessment-model-builder.service';
import { Injectable, OnDestroy } from '@angular/core';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class TaskModeAssessmentModelBuilderService implements IAssessmentModelBuilderService, OnDestroy {

    constructor(private loggerService: LoggerService, private formApiService: FormAPIService) { }

    ngOnDestroy(): void {
        this.onDestroy();
    }

    onDestroy(): void {
        this.loggerService.log("destroying in TaskModeAssessmentModelBuilderService");
        this.formApiService.onDestroy();
    }

    public buildAssessmentModel(assessmentContext: any, formTypeId: string, configuredSectionsIds?: string[], onBuild?: (assessmentEntity: AssessmentEntity) => void) {

        let assessment: AssessmentEntity = null;

        let assessment_id = assessmentContext.assessment.assessment_id;

        let verId = assessmentContext.assessment.versionid;

        this.getAssessment(assessment_id, verId, (assessmentFromDB) => {

            this.loggerService.log('received assessment from db for view');
            this.loggerService.log(assessmentFromDB);
            assessment = assessmentFromDB;

            this.getAssessmentTasks(assessment_id, verId, (assessmentTasksFromDB) => {

                this.loggerService.log('received assessment tasks from db for view');
                this.loggerService.log(assessmentTasksFromDB);
                assessment.assessmenttasks = [];
                assessmentTasksFromDB.forEach(at => {
                    assessment.assessmenttasks.push(at);
                });
                if (onBuild)
                    onBuild(assessment);

                return;
            });
        });
    }
    private getAssessment(assessmentId?: string, versionId?: any, onGetAssessment?: (assessment: AssessmentEntity) => void) {
        this.loggerService.log(`Getting assessment from db for view : ${assessmentId} ${versionId}`);
        this.formApiService.getAssessmentForIdAndVersion(assessmentId, versionId, (assessmentFromDB) => {
            if (onGetAssessment)
                onGetAssessment(assessmentFromDB);
        });
    }
    private getAssessmentTasks(assessmentId?: string, versionId?: any, onGetAssessmentTasks?: (assessmentTasks: []) => void) {
        this.formApiService.getAssessmentTaskForAssessment(assessmentId, versionId, (assessmentTasksFromDB: []) => {
            this.loggerService.log('received assessment tasks from db for tasks');
            this.loggerService.log(assessmentTasksFromDB);

            if (onGetAssessmentTasks)
            onGetAssessmentTasks(assessmentTasksFromDB);
        });
    }
}
