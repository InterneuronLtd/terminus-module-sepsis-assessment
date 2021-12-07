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

// import { Injectable, Injector } from '@angular/core';
// import { UUID } from 'angular2-uuid'
// import { Answer } from 'src/app/models/formSection.Model';
// import { AssessmentDetail, AssessmentEntity } from 'src/app/models/Assessment.model';

// import { InAppBaseApiService } from 'src/app/services/in.appbase.service';
// import { takeUntil } from 'rxjs/operators';
// import { Subject } from 'rxjs';
// import { FormSectionDataitem } from 'src/app/models/sectionData.model';


// @Injectable({
//   providedIn: 'root'
// })
// export class FormOneDataService {
//   // public displaysectionttwo: boolean = true;
//   // public displaysectiontthree: boolean = false;
//   // public displaysectiontfour: boolean = false;

//   public sectiononeData: FormSectionDataitem[] = [];
//   public sectiontwoData: FormSectionDataitem[] = [];
//   public sectionThreeData: FormSectionDataitem[] = [];
//   public sectionFourData: FormSectionDataitem[] = [];

//   public SectionOneQuesAnswer: string = "No Answer";
//   public SectionTwoQuesAnswer: string = "No Answer";
//   public SectionThreeQuesAnswer: string = "No Answer";
//   public SectionFourQuesAnswer: string = "No Answer";

//   public PatientId: string;

//   public sectiononeId = "7f1f8c94-a7af-4537-8fc4-1271a915bc91";
//   public sectionTwoId = "562501cf-e272-4e75-b7cb-24d92a1f00c2";
//   public sectionThreeId = "165518db-6cfa-46af-9b8f-f4b114958c45";
//   public sectionFourId = "37a26a27-e44b-4800-9a9b-3cdbb6b95410";
//   uuid: string;

//   $destroy = new Subject<void>();

//   constructor(protected injector: Injector,private apiService: InAppBaseApiService
//   ) {

//   }
//   saveAssessment() {
//     this.uuid = UUID.UUID();
//     let Assessment = new AssessmentEntity();
//     Assessment.assessment_id = this.uuid;
//     Assessment.versionid = 1;
//     Assessment.isamended = true;
//     Assessment.encounter_id = "0f9fe352-d81c-4f87-898e-f80b7bcd4aa0";
//     Assessment.observationevent_id = "test";
//     Assessment.person_id = "a4074c14-568b-44e8-9314-df0737e6513f";
//     Assessment.isdraft = false;
//     Assessment.formtype_id = "1a5fa3ce-dabe-4a14-b8ba-6c44dc4b58b6";
//     Assessment.assessmenttype_id = "2d06f955-88f6-4fa0-ac5f-3c7dc134f347";
//     this.apiService.post('SYNAPSE_DYNAMIC_URI/PostObject?synapsenamespace=core&synapseentityname=assessment', Assessment)
//       .pipe(takeUntil(this.$destroy))
//       .subscribe(AssessmentDetail => {
//         this.saveAssesmentsectionOne(this.uuid);
//       });
//   }

//   saveAssesmentsectionOne(assessment_Id: string) {

//     const sectionData: { questionKey: string, answer: Answer }[] = [];
//     let sectiononeAnswers = new Answer();
//     let sectionOneAnswersMeta = new Array<{ key: string }>();
//     //Add question Answer Yes no / not answer
//     sectiononeAnswers[this.SectionOneQuesAnswer] = true;
//     let keyVal = this.SectionOneQuesAnswer;
//     sectionOneAnswersMeta.push({ key: keyVal });


//     if (this.sectiononeData.length > 0) {

//       let questionKey = this.sectiononeData[0].questionid;
//       for (let sectiondata of this.sectiononeData) {
//         sectiononeAnswers[sectiondata.key] = sectiondata.value;
//         let keyVal = sectiondata.text;//to be changed to text
//         sectionOneAnswersMeta.push({ key: keyVal });
//       }
//       sectiononeAnswers.meta = sectionOneAnswersMeta;
//       sectionData.push({ questionKey: questionKey, answer: sectiononeAnswers });
//       const sectionDataAsString = JSON.stringify(sectionData);
//       let sectionOneAssessmentDetail = new AssessmentDetail();
//       sectionOneAssessmentDetail.assessmentdata = sectionDataAsString;
//       sectionOneAssessmentDetail.assessmentdetail_id = UUID.UUID();
//       sectionOneAssessmentDetail.formtype_id = "1a5fa3ce-dabe-4a14-b8ba-6c44dc4b58b6"
//       sectionOneAssessmentDetail.assessment_id = assessment_Id;
//       sectionOneAssessmentDetail.assessmentversionid = 1;
//       sectionOneAssessmentDetail.formsection_id = this.sectiononeId;

//       //var url = `${APP_MODULE_CONFIG.app_service.base_uri}/GetList?synapsenamespace=meta&synapseentityname=assessmenttype`;
//       this.apiService.post('SYNAPSE_DYNAMIC_URI/PostObject?synapsenamespace=core&synapseentityname=assessmentdetail', sectionOneAssessmentDetail)
//         .pipe(takeUntil(this.$destroy))
//         .subscribe(AssessmentDetail => {
//           this.saveAssesmentsectiontwo(assessment_Id);
//         });


//     }

//   }
//   saveAssesmentsectiontwo(assessment_Id: string) {

//     const sectionData: { questionKey: string, answer: Answer }[] = [];
//     let sectiontwoAnswers = new Answer();
//     let sectionTwoAnswersMeta = new Array<{ key: string }>();
//     //Add question Answer Yes no / not answer
//     sectiontwoAnswers[this.SectionTwoQuesAnswer] = true;
//     let keyVal = this.SectionTwoQuesAnswer;
//     sectionTwoAnswersMeta.push({ key: keyVal });
//     if (this.sectiontwoData.length > 0) {

//       let questionKey = this.sectiontwoData[0].questionid;
//       for (let sectiondata of this.sectiontwoData) {
//         sectiontwoAnswers[sectiondata.key] = sectiondata.value;
//         let keyVal = sectiondata.text;//to be changed to text
//         sectionTwoAnswersMeta.push({ key: keyVal });
//       }
//       sectiontwoAnswers.meta = sectionTwoAnswersMeta;
//       sectionData.push({ questionKey: questionKey, answer: sectiontwoAnswers });
//       const sectionDataAsString = JSON.stringify(sectionData);
//       let sectionTwoAssessmentDetail = new AssessmentDetail();
//       sectionTwoAssessmentDetail.assessmentdata = sectionDataAsString;
//       sectionTwoAssessmentDetail.assessmentdetail_id = UUID.UUID();
//       sectionTwoAssessmentDetail.formtype_id = "1a5fa3ce-dabe-4a14-b8ba-6c44dc4b58b6"
//       sectionTwoAssessmentDetail.assessment_id = assessment_Id;
//       sectionTwoAssessmentDetail.assessmentversionid = 1;
//       sectionTwoAssessmentDetail.formsection_id = this.sectionTwoId;
//       this.apiService.post('SYNAPSE_DYNAMIC_URI/PostObject?synapsenamespace=core&synapseentityname=assessmentdetail', sectionTwoAssessmentDetail)
//         .pipe(takeUntil(this.$destroy))
//         .subscribe(AssessmentDetail => {
//         });
//     }

//   }


//   saveAssesmentsectionThree() {

//     const sectionData: { questionKey: string, answer: Answer }[] = [];
//     let sectionThreeAnswers = new Answer();
//     let sectionTHreeAnswersMeta = new Array<{ key: string }>();
//     if (this.sectionThreeData.length > 0) {

//       let questionKey = this.sectionThreeData[0].questionid;
//       for (let sectiondata of this.sectionThreeData) {
//         sectionThreeAnswers[sectiondata.key] = sectiondata.value;
//         let keyVal = sectiondata.text;//to be changed to text
//         sectionTHreeAnswersMeta.push({ key: keyVal });
//       }
//       sectionThreeAnswers.meta = sectionTHreeAnswersMeta;
//       sectionData.push({ questionKey: questionKey, answer: sectionThreeAnswers });
//       const sectionDataAsString = JSON.stringify(sectionData);
//       let sectionThreeAssessmentDetail = new AssessmentDetail();
//       sectionThreeAssessmentDetail.assessmentdata = sectionDataAsString;
//       sectionThreeAssessmentDetail.assessmentdetail_id = UUID.UUID();
//       sectionThreeAssessmentDetail.formtype_id = "1a5fa3ce-dabe-4a14-b8ba-6c44dc4b58b6"
//       sectionThreeAssessmentDetail.assessment_id = this.uuid;
//       sectionThreeAssessmentDetail.assessmentversionid = 1;
//       sectionThreeAssessmentDetail.formsection_id = this.sectionThreeId;
//       this.apiService.post('SYNAPSE_DYNAMIC_URI/PostObject?synapsenamespace=core&synapseentityname=assessmentdetail', sectionThreeAssessmentDetail)
//         .pipe(takeUntil(this.$destroy))
//         .subscribe(AssessmentDetail => {
//         });
//     }

//   }

//   saveAssesmentsectionFour() {

//     const sectionData: { questionKey: string, answer: Answer }[] = [];
//     let sectionFourAnswers = new Answer();
//     let sectionFourAnswersMeta = new Array<{ key: string }>();
//     if (this.sectionFourData.length > 0) {

//       let questionKey = this.sectionFourData[0].questionid;
//       for (let sectiondata of this.sectionFourData) {
//         sectionFourAnswers[sectiondata.key] = sectiondata.value;
//         let keyVal = sectiondata.text;//to be changed to text
//         sectionFourAnswersMeta.push({ key: keyVal });
//       }
//       sectionFourAnswers.meta = sectionFourAnswersMeta;
//       sectionData.push({ questionKey: questionKey, answer: sectionFourAnswers });
//       const sectionDataAsString = JSON.stringify(sectionData);
//       let sectionFourAssessmentDetail = new AssessmentDetail();
//       sectionFourAssessmentDetail.assessmentdata = sectionDataAsString;
//       sectionFourAssessmentDetail.assessmentdetail_id = UUID.UUID();
//       sectionFourAssessmentDetail.formtype_id = "1a5fa3ce-dabe-4a14-b8ba-6c44dc4b58b6"
//       sectionFourAssessmentDetail.assessment_id = this.uuid;
//       sectionFourAssessmentDetail.assessmentversionid = 1;
//       sectionFourAssessmentDetail.formsection_id = this.sectionFourId;
//       this.apiService.post('SYNAPSE_DYNAMIC_URI/PostObject?synapsenamespace=core&synapseentityname=assessmentdetail', sectionFourAssessmentDetail)
//         .pipe(takeUntil(this.$destroy))
//         .subscribe(AssessmentDetail => {
//         });
//     }

//   }


// }


