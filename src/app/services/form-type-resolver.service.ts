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

import { ActionModeType } from '../models/action-mode-type.model';
import { InAppBaseApiService } from './in.appbase.service';
import { LoggerService } from './logger.service';
import { FormStageTwoComponent } from '../modules/form-stg-two/form-stg-two.component';
import { FormStageThreeComponent } from '../modules/form-stg-three/form-stg-three.component';
import { FormOneComponent } from '../modules/form-one/form-one.component';
import { Type, Injectable, OnDestroy } from '@angular/core';
import * as moment from 'moment';
import { FORM_ONE_CONFIG } from '../modules/form-one/config/form-one.config';
import { FormAPIService } from './form-api.service';
import { AssessmentEntity } from '../models/Assessment.model';
import { FORM_STG_TWO_CONFIG } from '../modules/form-stg-two/config/form-stg-two.config';
import { FORM_STG_THREE_CONFIG } from '../modules/form-stg-three/config/form-stg-three.config';
import { FORM_STG_FOUR_CONFIG } from '../modules/form-stg-four/config/form-stg-four.config';
import { FormStageFourComponent } from '../modules/form-stg-four/form-stg-four.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { SepsisAssessmentModuleConfigData } from '../config/app.module.config';

@Injectable()
export class FormTypeResolverService implements OnDestroy  {
    
    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private apiService: InAppBaseApiService, private formApiService: FormAPIService, private loggerService: LoggerService) {
    }

    ngOnDestroy(): void {
        this.onDestroy();
    }

    onDestroy(): void {
        this.loggerService.log('Destroying in FormTypeResolverService');
        if(this.destroy$){
            this.destroy$.next(true);
            this.destroy$.complete();
        }
    }

    public getFormType(assessmentContext: { assessment: any; action: ActionModeType }, onGetFormType: (formType: Type<FormStageTwoComponent> | Type<FormOneComponent> | Type<FormStageThreeComponent> | Type<FormStageFourComponent>) => void) {

        switch (assessmentContext.action) {
            case "new":
                this.getFormTypeByPatientAge(assessmentContext, (formTypeData) => {
                    if (onGetFormType)
                        onGetFormType(formTypeData);
                });
                break;
            case "view":
            case "edit":
            case "showtasks":
            case "amend": //Already have assessment in these cases
                this.getFormTypeInAssessment(assessmentContext, (formTypeData) => {
                    if (onGetFormType)
                        onGetFormType(formTypeData);
                });
                break;
        }
    }

    private getFormTypeInAssessment(assessmentContext: { assessment: any; action: ActionModeType; }, onGetFormType: (formTypeData: any) => void) {

        let assessment_id = assessmentContext.assessment.assessment_id;

        let versionid = assessmentContext.assessment.versionid;

        this.formApiService.getAssessmentForIdAndVersion(assessment_id, versionid, (assessmentFromDB: AssessmentEntity) => {

            this.loggerService.log('received assessment from db for view');

            this.loggerService.log(assessmentFromDB);

            if (assessmentFromDB.formtype_id === FORM_ONE_CONFIG.form_type_id) {
                if (onGetFormType) {
                    onGetFormType(FormOneComponent);
                    return;
                }
            }
            if (assessmentFromDB.formtype_id === FORM_STG_TWO_CONFIG.form_type_id) {
                if (onGetFormType) {
                    onGetFormType(FormStageTwoComponent);
                    return;
                }
            }
            if (assessmentFromDB.formtype_id === FORM_STG_THREE_CONFIG.form_type_id) {
                if (onGetFormType) {
                    onGetFormType(FormStageThreeComponent);
                    return;
                }
            }
            if (assessmentFromDB.formtype_id === FORM_STG_FOUR_CONFIG.form_type_id) {
                if (onGetFormType) {
                    onGetFormType(FormStageFourComponent);
                    return;
                }
            }
        });
    }

    private getFormTypeByPatientAge(assessmentContext: { assessment: any; action: ActionModeType; }, onGetFormType: (formType: Type<FormStageTwoComponent> | Type<FormOneComponent> | Type<FormStageThreeComponent> | Type<FormStageFourComponent>) => void) {

        //Initialize the context state
        const assessmentInput = assessmentContext.assessment;

        let url = `${SepsisAssessmentModuleConfigData.Config.app_service.base_uri}/GetObject?synapsenamespace=core&synapseentityname=person&id=${assessmentInput.person_id}`;

        this.apiService.get(url)
            .pipe(takeUntil(this.destroy$))
            .subscribe((personDetailFromDb: any) => {

                let personDetail: any;
                if(typeof personDetailFromDb === 'string'){
                    personDetail = JSON.parse(personDetailFromDb);
                } else{
                    personDetail = personDetailFromDb;
                }

                const patientAge = this.getAge(personDetail);
                const formTypeData = this.getFormComponentByPatientAge(patientAge);

                if (onGetFormType) {
                    onGetFormType(formTypeData);
                }
            });
    }

    private getFormComponentByPatientAge(patientAge: number): Type<FormStageTwoComponent> | Type<FormOneComponent> | Type<FormStageThreeComponent> | Type<FormStageFourComponent> {
        if (patientAge < 5.0) {
            return FormOneComponent;
        } else if (patientAge >= 5.0 && patientAge < 12.0) {
            return FormStageTwoComponent;
        } else if (patientAge >= 12.0 && patientAge < 18.0) {
            return FormStageThreeComponent;
        } else if (patientAge >= 18.0) {
            //return FormStageFourComponent; // TODO uncomment this 
            return FormStageFourComponent; //TO test
        }
        return null; //not possible as the default Age is set
    }

    private getAge(personDetail: any): number {

        let defAge: number = 19.0;

        if (!personDetail || !personDetail.dateofbirth)
            return defAge;// hard-coded for now

        // let currentDate = moment();
        // let dob = moment(personDetail.dateofbirth);
        // //var years = moment().diff(personDetail.dateofbirth, 'years', true).toFixed(2);
        // let years = currentDate.diff(dob, 'years');
        // dob.add(years, 'years');
        // let months = currentDate.diff(dob, 'months');
        // dob.add(months, 'months');
        // let weeks = currentDate.diff(dob, 'weeks');
        // dob.add(weeks, 'weeks');
        // let days = currentDate.diff(dob, 'days');
        // dob.add(days, 'days');

        // return Number(`${years}.${months}${weeks}${days}`);
        const years = moment(new Date(), moment.ISO_8601).diff(moment(personDetail.dateofbirth, moment.ISO_8601), 'years');
        return years;

        //References
        //http://jsfiddle.net/yqk8r9um/4/
        //https://codepen.io/blackjacques/pen/worOWE
        //https://codepen.io/blackjacques/pen/RKPKba
        //http://jsfiddle.net/knct24oh/1/
        //https://www.htmlgoodies.com/beyond/javascript/js-ref/build-a-birthday-countdown-calculator-using-moment.js.html
        //let birthday = new Date(personDetail.dateofbirth);
        //return new Number((new Date().getTime() - birthday.getTime()) / 31536000000).toFixed(0);
    }
}