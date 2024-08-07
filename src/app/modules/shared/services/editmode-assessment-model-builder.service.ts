//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2024  Interneuron Limited

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

import { AssessmentEntity } from 'src/app/models/Assessment.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { LoggerService } from 'src/app/services/logger.service';
import { IAssessmentModelBuilderService } from './assessment-model-builder.service';
import { Injectable, OnDestroy } from '@angular/core';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class EditModeAssessmentModelBuilderService implements IAssessmentModelBuilderService, OnDestroy {

    constructor(private loggerService: LoggerService, private formApiService: FormAPIService) { }

    ngOnDestroy(): void {
        this.onDestroy();
    }

    onDestroy(): void {
        this.loggerService.log("destroying in EditModeAssessmentModelBuilderService");
        this.formApiService.onDestroy();
    }

    public buildAssessmentModel(assessmentContext: any, formTypeId: string, configuredSectionsIds?: string[], onBuild?: (assessmentEntity: AssessmentEntity) => void) {

        let assessment: AssessmentEntity = null;

        let assessment_id = assessmentContext.assessment.assessment_id;

        let verId = assessmentContext.assessment.versionid;

        this.getAssessment(assessment_id, verId, (assessmentFromDB) => {

            this.loggerService.log('received assessment from db for edit');
            this.loggerService.log(assessmentFromDB);
            assessment = assessmentFromDB;

            this.getAssessmentDetails(assessment_id, verId, (assessmentDetailFromDB) => {
                this.loggerService.log('received assessment detail from db for edit');
                this.loggerService.log(assessmentDetailFromDB);
                assessment.assessmentdetails = [];
                assessmentDetailFromDB.forEach(ad => {
                    assessment.assessmentdetails.push(ad);
                });
                if (onBuild)
                    onBuild(assessment);

                return;
            });
        });
    }
    private getAssessment(assessmentId?: string, versionId?: any, onGetAssessment?: (assessment: AssessmentEntity) => void) {
        this.loggerService.log(`Getting assessment from db for edit : ${assessmentId} ${versionId}`);
        this.formApiService.getAssessmentForIdAndVersion(assessmentId, versionId, (assessmentFromDB) => {
            if (onGetAssessment)
                onGetAssessment(assessmentFromDB);
        });
    }
    private getAssessmentDetails(assessmentId?: string, versionId?: any, onGetAssessmentDetails?: (assessmentDetails: []) => void) {
        this.formApiService.getAssessmentDetailsForAssessment(assessmentId, versionId, (assessmentDetailFromDB: []) => {
            this.loggerService.log('received assessment detail from db for edit');
            this.loggerService.log(assessmentDetailFromDB);
            if (onGetAssessmentDetails)
                onGetAssessmentDetails(assessmentDetailFromDB);
        });
    }
}
