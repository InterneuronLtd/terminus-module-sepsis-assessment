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

import { AssessmentTask } from './AssessmentTask.model';
export class AssessmentEntity {
  assessment_id: string;
  versionid: number;
  encounter_id: string;
  observationevent_id: string;
  person_id: string;
  isdraft: boolean;
  isamended: boolean;
  formtype_id: string;
  taskformsectionid: string;
  assessmenttype_id: string;
  sourceofinvocation?: string;
  assessmentdetails: AssessmentDetail[];
  assessmenttasks: AssessmentTask[];

}

export class AssessmentDetail {
  assessmentdetail_id: string;
  formtype_id: string;
  formsection_id: string;
  assessmentdata: string;
  assessmentdataAsJSON: SectionData;
  sectiontemplateversionid: number;
  assessment_id: string;
  assessmentversionid: number;

  // public convertDataToJson(): SectionData {
  //   return JSON.parse(this.assessmentdata);
  // }

  // public convertJsonDataToString(): string {
  //   return JSON.stringify(this.assessmentdataAsJSON);
  // }

  // public convertDataToJsonAndReAssign() {
  //   this.assessmentdataAsJSON = JSON.parse(this.assessmentdata);
  // }

  // public convertJsonDataToStringAndReAssign() {
  //   this.assessmentdata = JSON.stringify(this.assessmentdataAsJSON);
  // }
}

export class SectionData {
  sectiondata: SectionDataItem[];
}

export class SectionDataItem {
  questionKey: string;
  answer: Answer;
}

export class Answer {
  [key: string]: any;
  meta: { key: string }[];
}