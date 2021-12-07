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

import { Injectable, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { InAppBaseApiService } from './in.appbase.service';
import { AssessmentEntity, AssessmentDetail } from '../models/Assessment.model';
import { takeUntil } from 'rxjs/operators';
import { LoggerService } from './logger.service';
import { AssessmentTask } from '../models/AssessmentTask.model';
import { filters, filter, filterParams, filterparam, selectstatement, orderbystatement } from '../core/models/filter.model';
import { SepsisAssessmentModuleConfigData } from '../config/app.module.config';

// @Injectable({
//     providedIn: 'root'
// })
//This class is a utility wrapper service for form related transactions
@Injectable()
export class FormAPIService implements OnDestroy {

    private destroy$ = new Subject<boolean>();

    constructor(private apiService: InAppBaseApiService, private loggerService: LoggerService) {
    }

    ngOnDestroy(): void {
        this.onDestroy();
    }

    onDestroy(): void {
        this.loggerService.log("destroying subscriptions in FormAPIService");
        if (this.destroy$) {
            this.destroy$.next(true);
            this.destroy$.complete();
        }
    }

    public saveAssessmentWithDetailsAsDraft(action: string, assessment: AssessmentEntity, onSave?: (newAssessment: AssessmentEntity) => void) {

        this.loggerService.log('Saving as draft');
        this.loggerService.log(assessment);

        if (!assessment) return null;

        assessment.isdraft = true;

        this.saveAssessment(action, assessment, (newAssessment) => {

            this.loggerService.log('Saved as draft');
            this.loggerService.log(newAssessment);

            if (!newAssessment) {
                if (onSave) onSave(null);
                return;
            }

            if (assessment.assessmentdetails) {
                this.saveAssessmentDetails(action, assessment.assessmentdetails, (newAssessmentDetails) => {
                    if (!newAssessmentDetails) {
                        if (onSave) onSave(null);
                        return;
                    }
                    newAssessment.assessmentdetails = [];

                    newAssessmentDetails.forEach(newAd => {
                        newAssessment.assessmentdetails.push(newAd);
                    })

                    onSave(newAssessment);
                })
            }
        }, true);
    }

    public saveAssessment(action: string, assessment: AssessmentEntity, onSave?: (newAssessment: AssessmentEntity) => void, isDraft = false) {

        if (!assessment) return null;

        assessment.isdraft = isDraft;

        this.loggerService.log('Saving assessment ' + JSON.stringify(assessment));

        this.loggerService.log({ action: action, assessment: assessment });

        switch (action) {
            case 'amend':
                this.getNextAssessmentVersion(assessment, () => {
                    this.createAssessment(assessment, onSave);
                });
                break;
            case 'new':
                assessment.versionid = 1.0;
                this.createAssessment(assessment, onSave);
                break;
            case 'edit':
            case 'view':
                this.createAssessment(assessment, onSave);
                break;
        }
    }

    public saveAssessmentDetails(action: string, assessmentDetails: AssessmentDetail[], onSave?: (newAssessmentDetails: AssessmentDetail[]) => void) {

        if (!assessmentDetails || !Array.isArray(assessmentDetails) || assessmentDetails.length === 0) return null;

        this.loggerService.log('Saving assessment details ' + JSON.stringify(assessmentDetails));

        this.loggerService.log({ action: action, assessmentDetails: assessmentDetails });

        this.createAssessmentDetail(assessmentDetails, onSave);

        // assessmentDetails.forEach(ad => {
        //     this.saveAssessmentDetail(action, ad);
        // });
    }

    public saveAssessmentDetail(action: string, assessmentDetail: AssessmentDetail, onSave?: (newAssessmentDetail: AssessmentDetail) => void) {

        if (!assessmentDetail) return null;

        this.loggerService.log('Saving assessmentdetail ' + JSON.stringify(assessmentDetail));

        this.loggerService.log({ action: action, assessmentDetail: assessmentDetail });

        this.createAssessmentDetail([assessmentDetail], (savedAssessmentDetails) => {
            if (onSave) {
                let savedAssessmentDetail = (savedAssessmentDetails && savedAssessmentDetails.length > 0) ? savedAssessmentDetails[0] : null;
                onSave(savedAssessmentDetail);
            }
        });
    }

    public getAssessmentForIdAndVersion(assessment_id: string, assessmentVersionId: string, onReceive: (assessmentEntity: AssessmentEntity) => void) {

        //var url = `${APP_MODULE_CONFIG.app_service.base_uri}/GetBaseViewListByPost/bvassessment_allassessments`;

        //considering only the latest as we are not supporting the amendment and versioning right now
        let url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/GetBaseViewListByPost/bvassessment_alllatestassessments`;


        this.apiService.post(url, this.createAssessmentDetailFilter(assessment_id, assessmentVersionId))
            .pipe(takeUntil(this.destroy$))
            .subscribe((newAssessments: AssessmentEntity[]) => {
                if (!newAssessments || !Array.isArray(newAssessments) || newAssessments.length == 0) {
                    if (onReceive)
                        onReceive(null);
                    return;
                }
                if (onReceive)
                    onReceive(newAssessments[0]);
            });
    }

    public getAssessmentDetailsForAssessment(assessment_id: string, assessmentVersionId: number, onReceive: (assessmentDetails: AssessmentDetail[]) => void) {

        //var url = `${APP_MODULE_CONFIG.app_service.base_uri}/GetBaseViewListByPost/bvassessment_allassessmentdetails`;

        //considering only the latest as we are not supporting the amendment and versioning right now
        let url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/GetBaseViewListByPost/bvassessment_alllatestassessmentdetails`;

        this.apiService.post(url, this.createAssessmentDetailFilter(assessment_id, assessmentVersionId))
            .pipe(takeUntil(this.destroy$))
            .subscribe((newAssessmentDetails: AssessmentDetail[]) => {
                if (onReceive)
                    onReceive(newAssessmentDetails);
            });
    }

    public getAssessmentTaskForAssessment(assessment_id: string, assessmentVersionId: number, onReceive: (assessmentTasks: AssessmentTask[]) => void) {

        var url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/GetBaseViewListByPost/bvassessment_alllatestassessmentstasks`;

        this.apiService.post(url, this.createAssessmentTaskFilter(assessment_id, assessmentVersionId))
            .pipe(takeUntil(this.destroy$))
            .subscribe((newAssessmentTasks: AssessmentTask[]) => {
                if (onReceive)
                    onReceive(newAssessmentTasks);
            });
    }

    private createAssessmentDetail(assessmentDetails: AssessmentDetail[], onSave: (newAssessmentDetails: AssessmentDetail[]) => void) {

        //let assessmentDetailsToSave: AssessmentDetail[] = JSON.parse(JSON.stringify(assessmentDetails)); //cloning the object - original should remain intact

        let assessmentDetailsToSave: AssessmentDetail[] = [];

        assessmentDetails.forEach((asmDet) => {
            let asmDetail = new AssessmentDetail();
            asmDetail.assessment_id = asmDet.assessment_id;
            asmDetail.assessmentdata = asmDet.assessmentdata;
            asmDetail.assessmentdetail_id = asmDet.assessmentdetail_id;
            asmDetail.assessmentversionid = asmDet.assessmentversionid;
            asmDetail.formsection_id = asmDet.formsection_id;
            asmDetail.formtype_id = asmDet.formtype_id;
            asmDetail.sectiontemplateversionid = asmDet.sectiontemplateversionid;
            assessmentDetailsToSave.push(asmDetail);
        });

        if (assessmentDetailsToSave) {
            assessmentDetailsToSave.forEach(ad => {
                delete ad.assessmentdataAsJSON;
            });
        }

        this.loggerService.log('Saving assessmentdetail ' + JSON.stringify(assessmentDetailsToSave));

        this.loggerService.log({ assessmentDetails: assessmentDetailsToSave });

        const url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/PostObjectArray?synapsenamespace=core&synapseentityname=assessmentdetail`;

        this.apiService.post(url, assessmentDetailsToSave)
            .pipe(takeUntil(this.destroy$))
            .subscribe((newAssessmentDetails: AssessmentDetail[]) => {

                if (onSave)
                    onSave(newAssessmentDetails);
            },
                err => {
                    this.loggerService.logError(err);
                    if (onSave)
                        onSave(null);
                });
    }

    private createAssessment(assessment: AssessmentEntity, executeNext?: (newAssessment: AssessmentEntity) => void) {

        //let assessmentToSave: AssessmentEntity = JSON.parse(JSON.stringify(assessment)); //cloning the object - original should remain intact

        let assessmentToSave: AssessmentEntity = new AssessmentEntity();
        assessmentToSave.assessment_id = assessment.assessment_id;
        assessmentToSave.assessmenttype_id = assessment.assessmenttype_id;
        assessmentToSave.encounter_id = assessment.encounter_id;
        assessmentToSave.formtype_id = assessment.formtype_id;
        assessmentToSave.isamended = assessment.isamended;
        assessmentToSave.isdraft = assessment.isdraft;
        assessmentToSave.observationevent_id = assessment.observationevent_id;
        assessmentToSave.person_id = assessment.person_id;
        assessmentToSave.taskformsectionid = assessment.taskformsectionid;
        assessmentToSave.versionid = assessment.versionid;
        assessmentToSave.sourceofinvocation = assessment.sourceofinvocation;

        //Modified API - Not required anymore
        // if (!assessmentToSave.observationevent_id) {
        //     assessmentToSave.observationevent_id = 'test';
        // }

        this.stripAdditionalAssessmentFields(assessmentToSave);

        this.loggerService.log('Saving assessment ' + JSON.stringify(assessmentToSave));

        this.loggerService.log({ assessment: assessmentToSave });

        const url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/PostObject?synapsenamespace=core&synapseentityname=assessment`;

        this.apiService.post(url, assessmentToSave)
            .pipe(takeUntil(this.destroy$))
            .subscribe((newAssessment: AssessmentEntity) => {
                if (executeNext)
                    executeNext(newAssessment);
            },
                err => {
                    this.loggerService.logError(err);
                    if (executeNext)
                        executeNext(null);
                });
    }

    private stripAdditionalAssessmentFields(assessmentToSave: AssessmentEntity): any {
        if (assessmentToSave.assessmentdetails)
            delete assessmentToSave.assessmentdetails;
    }

    private getNextAssessmentVersion(assessment: AssessmentEntity, executeNext: () => void) {

        let url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/GetListByAttribute?synapsenamespace=core&synapseentityname=assessment&synapseattributename=assessment_id&attributevalue=${assessment.assessment_id}&orderby=versionid DESC`;

        assessment.versionid = 1.0;// Set to default

        this.apiService.get(url)
            .subscribe((assessmentsFromDb: AssessmentEntity[]) => {

                let assessments: any;
                if (typeof assessmentsFromDb === 'string') {
                    assessments = JSON.parse(assessmentsFromDb);
                } else {
                    assessments = assessmentsFromDb;
                }

                if (assessments && Array.isArray(assessments)) {
                    let versionIds = assessments.map(a => a.versionid);
                    assessment.versionid = Math.max(...versionIds);
                }
                if (executeNext)
                    executeNext();
            });
    }

    public saveAssessmentTask(action: string, assessmentTasks: AssessmentTask[], onSave?: (newAssessmentTasks: AssessmentTask[]) => void) {

        if (!assessmentTasks) return null;

        this.loggerService.log('Saving assessmentdetail ' + JSON.stringify(assessmentTasks));

        this.loggerService.log({ action: action, assessmentDetail: assessmentTasks });

        this.createAssessmentTask(assessmentTasks, onSave);
    }

    private createAssessmentTask(assessmentTasks: AssessmentTask[], onSave: (newAssessmentTasks: AssessmentTask[]) => void) {

        let assessmentTaskToSavearray: AssessmentTask[] = JSON.parse(JSON.stringify(assessmentTasks)); //cloning the obeject - original should remain intact

        for (const assessmentTaskToSave of assessmentTaskToSavearray) {
            if (assessmentTaskToSave.taskdataasobject) {
                delete assessmentTaskToSave.taskdataasobject;
            }
        }

        const url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/postObjectArray?synapsenamespace=core&synapseentityname=assessmenttask`;

        this.apiService.post(url, assessmentTaskToSavearray)
            .pipe(takeUntil(this.destroy$))
            .subscribe((newAssessmentTasks: AssessmentTask[]) => {
                if (onSave)
                    onSave(newAssessmentTasks);
            }, err => {
                this.loggerService.logError(err);
                if (onSave)
                    onSave(null);
            });
    }


    createAssessmentDetailFilter(assessment_id: string, assessmentVersionId: any) {

        let condition = "assessment_id=@assessment_id and versionid=cast(@versionid AS numeric)";
        let f = new filters()
        f.filters.push(new filter(condition));

        let pm = new filterParams();

        pm.filterparams.push(new filterparam("assessment_id", assessment_id));
        pm.filterparams.push(new filterparam("versionid", assessmentVersionId));

        let select = new selectstatement("SELECT *");

        let orderby = new orderbystatement('ORDER BY "_createddate" desc');

        let body = [];
        body.push(f);
        body.push(pm);
        body.push(select);
        body.push(orderby);

        this.loggerService.log(JSON.stringify(body));

        return JSON.stringify(body);
    }

    createAssessmentTaskFilter(assessment_id: string, assessmentVersionId: any) {

        let condition = "assessment_id=@assessment_id and assessmentversionid =cast(@assessmentversionid  AS numeric)";
        let f = new filters()
        f.filters.push(new filter(condition));

        let pm = new filterParams();

        pm.filterparams.push(new filterparam("assessment_id", assessment_id));
        pm.filterparams.push(new filterparam("assessmentversionid ", assessmentVersionId));

        let select = new selectstatement("SELECT *");

        let orderby = new orderbystatement('ORDER BY "_createddate" desc');

        let body = [];
        body.push(f);
        body.push(pm);
        body.push(select);
        body.push(orderby);

        this.loggerService.log(JSON.stringify(body));

        return JSON.stringify(body);
    }
}