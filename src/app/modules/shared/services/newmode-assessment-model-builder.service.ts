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

import { AssessmentEntity, AssessmentDetail, SectionData } from 'src/app/models/Assessment.model';
import { FormAPIService } from 'src/app/services/form-api.service';
import { LoggerService } from 'src/app/services/logger.service';
import { IAssessmentModelBuilderService } from './assessment-model-builder.service';
import { Injectable, OnDestroy } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { InAppBaseApiService } from 'src/app/services/in.appbase.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SepsisAssessmentModuleConfigData } from 'src/app/config/app.module.config';

// @Injectable({
//     providedIn: 'root'
// })
@Injectable()
export class NewModeAssessmentModelBuilderService implements IAssessmentModelBuilderService, OnDestroy {
    
    destroy$ = new Subject<boolean>();

    constructor(private loggerService: LoggerService, private formApiService: FormAPIService, private apiService: InAppBaseApiService,
    ) { }

    ngOnDestroy(): void {
        this.formApiService.onDestroy();
        this.onDestroy();
    }

    onDestroy(): void {
        this.loggerService.log("destroying subscriptions in NewModeAssessmentModelBuilderService");
        if (this.destroy$) {
            this.destroy$.next(true);
            this.destroy$.complete();
        }
    }

    public buildAssessmentModel(assessmentContext: any, formTypeId: string, configuredSectionsIds?: string[], onBuild?: (assessmentEntity: AssessmentEntity) => void) {

        let assessment = this.createNewAssessmentEntity(assessmentContext, formTypeId);

        this.getFormSectionMeta(formTypeId, (formSections) => {

            this.createNewAssessmentDetails(assessment, configuredSectionsIds, formSections, formTypeId);

            if (onBuild)
                onBuild(assessment);
        });
    }

    private createNewAssessmentEntity(assessmentContext: any, formTypeId: string): AssessmentEntity {

        let assessment = new AssessmentEntity();

        assessment.assessment_id = UUID.UUID();
        assessment.formtype_id = formTypeId;
        assessment.assessmenttype_id = assessmentContext.assessment.assessmenttype_id;
        assessment.encounter_id = assessmentContext.assessment.encounter_id;
        assessment.person_id = assessmentContext.assessment.person_id;
        assessment.observationevent_id = assessmentContext.assessment.observationevent_id;
        assessment.sourceofinvocation = assessmentContext.assessment.sourceofinvocation;
        assessment.versionid = 1.0;

        return assessment;
    }

    private createNewAssessmentDetails(assessment: AssessmentEntity, configuredSectionsIds: string[], formSections: any, formTypeId: string) {

        assessment.assessmentdetails = [];

        configuredSectionsIds.forEach(secId => {

            const templateVersionForSection2: number[] = formSections.filter(fs => fs.formsection_id === secId)
                .map(fs => fs.templateversionid);

            const formSectionMaxTemplateVersionId = Math.max(...templateVersionForSection2);

            let assessmentDetail = this.generateNewAssessmentDetail(assessment, formTypeId, secId, formSectionMaxTemplateVersionId);

            assessment.assessmentdetails.push(assessmentDetail);
        });
    }

    private generateNewAssessmentDetail(assessment: AssessmentEntity, formTypeId: string, section_id: string, formSectionTemplateVersionId: number): AssessmentDetail {

        let assessmentDetailSec1 = new AssessmentDetail();
        assessmentDetailSec1.assessment_id = assessment.assessment_id;
        assessmentDetailSec1.assessmentdetail_id = UUID.UUID();
        assessmentDetailSec1.assessmentversionid = assessment.versionid;
        assessmentDetailSec1.formsection_id = section_id;
        assessmentDetailSec1.formtype_id = formTypeId;
        assessmentDetailSec1.sectiontemplateversionid = formSectionTemplateVersionId;
        assessmentDetailSec1.assessmentdataAsJSON = new SectionData();
        assessmentDetailSec1.assessmentdata = '';

        return assessmentDetailSec1;
    }

    private getFormSectionMeta(formTypeId: string, onSucessfullFormSectionFetch: (formsections) => void) {

        const url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=formsection&synapseattributename=formtype_id&attributevalue=${formTypeId}&returnsystemattributes=1&orderby=displayorder ASC`;

        this.apiService.get(url)

            .pipe(takeUntil(this.destroy$))

            .subscribe((formsectionsFromDb: any) => {

                let formsections: any;
                if (typeof formsectionsFromDb === 'string') {
                    formsections = JSON.parse(formsectionsFromDb);
                } else {
                    formsections = formsectionsFromDb;
                }

                if (onSucessfullFormSectionFetch) {
                    onSucessfullFormSectionFetch(formsections);
                } else {
                    this.loggerService.logError('error getting form section data');
                }
            });
    }






    public buildAssessmentModel1(assessmentId?: string, versionId?: any, onBuild?: (assessmentEntity: AssessmentEntity) => void) {

        let assessment: AssessmentEntity = null;

        this.getAssessment(assessmentId, versionId, (assessmentFromDB) => {

            this.loggerService.log('received assessment from db for view');
            this.loggerService.log(assessmentFromDB);
            assessment = assessmentFromDB;

            this.getAssessmentDetails(assessmentId, versionId, (assessmentDetailFromDB) => {
                this.loggerService.log('received assessment detail from db for view');
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
        this.loggerService.log(`Getting assessment from db for view : ${assessmentId} ${versionId}`);
        this.formApiService.getAssessmentForIdAndVersion(assessmentId, versionId, (assessmentFromDB) => {
            if (onGetAssessment)
                onGetAssessment(assessmentFromDB);
        });
    }
    private getAssessmentDetails(assessmentId?: string, versionId?: any, onGetAssessmentDetails?: (assessmentDetails: []) => void) {
        this.formApiService.getAssessmentDetailsForAssessment(assessmentId, versionId, (assessmentDetailFromDB: []) => {
            this.loggerService.log('received assessment detail from db for view');
            this.loggerService.log(assessmentDetailFromDB);
            if (onGetAssessmentDetails)
                onGetAssessmentDetails(assessmentDetailFromDB);
        });
    }
}
