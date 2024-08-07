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


import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { FORM_ONE_CONFIG } from './config/form-one.config';
import { AssessmentDetail } from 'src/app/models/Assessment.model';
import { FormOneContextService } from './services/form-one-context.service';
import { SaveData } from '../shared/models/save-data.type';
import { FormBaseComponent } from '../shared/components/form-base.component';
@Component({
  selector: 'app-form-one',
  templateUrl: './form-one.component.html',
  styleUrls: ['./form-one.component.css']
})
export class FormOneComponent extends FormBaseComponent implements OnInit, OnDestroy {

  mappedFormTypeId = FORM_ONE_CONFIG.form_type_id;//'1a5fa3ce-dabe-4a14-b8ba-6c44dc4b58b6';

  showFormSections = false;

  showTasKSections = false;

  showRedFlagTasKSections = false;

  showAmberFlagTasKSections = false;


  formSection1TemplateVersionId: number;
  formSection2TemplateVersionId: number;
  formSection3TemplateVersionId: number;
  formSection4TemplateVersionId: number;

  

  constructor(protected injector: Injector,
    private formOneContextService: FormOneContextService) {
    super(injector);
  }

  ngOnInit() {
    this.loggerService.log('Showing Form for Age 0-5');
  }

  ngOnDestroy() {

    this.loggerService.log('Destroying Form for Age 0-5');

    this.assessment = null;
    this.assessmentContext = null;

    if (this.formOneContextService) this.formOneContextService.onDestroy();

    this.formOneContextService = null;
    super.ngOnDestroy();
  }

  onSaveComplete(saveData?: SaveData) {
    if (saveData && saveData.nextAction === 'showtasks') {

        this.showFormSections = false;
        let newSavedAssessment = JSON.parse(JSON.stringify(this.assessment));//clone and re-assign
        //will trigger loadAssessment again and show tasks
        this.assessmentContext = { assessment: newSavedAssessment, action: saveData.nextAction };
        //this.showTasKSections = true;

    } else if (this.close) {
        this.close.emit(false); //false - need not show re-confirmation before close
    }
}

  loadAssessment(onLoadComplete?: () => void) {

    switch (this.assessmentContext.action) {
      case 'new':
        this.handleNewAssessment(onLoadComplete);
        break;
      case 'view':
        this.handleViewAssessment(onLoadComplete);
        break;
      case 'edit':
        this.handleEditAssessment(onLoadComplete);
        break;
      case 'showtasks':
        this.loadAssessmentTask(onLoadComplete);
        break;
    }
  }

  handleEditAssessment(onLoadComplete?: () => void) {

    this.editModeAssessmentModelBuilderService.buildAssessmentModel(this.assessmentContext, this.mappedFormTypeId, null, (assessmentFromDB) => {

      this.loggerService.log('Assessment from db for edit');
      this.loggerService.log(assessmentFromDB);

      if (!assessmentFromDB) {
        this.loggerService.logError('Unable to get assessment');
      }

      this.assessment = assessmentFromDB;

      assessmentFromDB.assessmentdetails.forEach(ad => {
        this.assignTemplateVersionId(ad);
      });

      if (onLoadComplete) onLoadComplete();

      this.showFormSections = true;
    });
  }

  handleViewAssessment(onLoadComplete?: () => void) {

    this.viewModeAssessmentModelBuilderService.buildAssessmentModel(this.assessmentContext, this.mappedFormTypeId, null, (assessmentFromDB) => {

      this.loggerService.log('Assessment from db for view');
      this.loggerService.log(assessmentFromDB);

      if (!assessmentFromDB) {
        this.loggerService.logError('Unable to get assessment');
      }

      this.assessment = assessmentFromDB;

      assessmentFromDB.assessmentdetails.forEach(ad => {
        this.assignTemplateVersionId(ad);
      });

      if (onLoadComplete) onLoadComplete();

      this.showFormSections = true;
    });

    // let assessment_id = this.assessmentContext.assessment.assessment_id;

    // let verId = this.assessmentContext.assessment.versionid;

    // this.loggerService.log(`Getting assessment from db for view : ${assessment_id} ${verId}`);

    // this.formApiService.getAssessmentForIdAndVersion(assessment_id, verId, (assessmentFromDB) => {

    //   this.loggerService.log('received assessment from db for view');

    //   this.loggerService.log(assessmentFromDB);

    //   this.assessment = assessmentFromDB;

    //   this.formApiService.getAssessmentDetailsForAssessment(assessment_id, verId, (assessmentDetailFromDB) => {

    //     this.loggerService.log('received assessment detail from db for view');

    //     this.loggerService.log(assessmentDetailFromDB);

    //     this.assessment.assessmentdetails = [];

    //     assessmentDetailFromDB.forEach(ad => {

    //       this.assignTemplateVersionId(ad);

    //       this.assessment.assessmentdetails.push(ad);

    //     });

    //     if (onLoadComplete) onLoadComplete();

    //     this.showFormSections = true;
    //   });

    // });
  }


  assignTemplateVersionId(ad: AssessmentDetail) {
    if (ad.formsection_id == FORM_ONE_CONFIG.enabled_section_id.section_1_id) {
      this.formSection1TemplateVersionId = ad.sectiontemplateversionid;
    } else if (ad.formsection_id == FORM_ONE_CONFIG.enabled_section_id.section_2_id) {
      this.formSection2TemplateVersionId = ad.sectiontemplateversionid;
    } else if (ad.formsection_id == FORM_ONE_CONFIG.enabled_section_id.section_3_id) {
      this.formSection3TemplateVersionId = ad.sectiontemplateversionid;
    } else if (ad.formsection_id == FORM_ONE_CONFIG.enabled_section_id.section_4_id) {
      this.formSection4TemplateVersionId = ad.sectiontemplateversionid;
    }
  }




  handleNewAssessment(onLoadComplete?: () => void) {

    let confiruredSections = [FORM_ONE_CONFIG.enabled_section_id.section_1_id, FORM_ONE_CONFIG.enabled_section_id.section_2_id, FORM_ONE_CONFIG.enabled_section_id.section_3_id, FORM_ONE_CONFIG.enabled_section_id.section_4_id];

    this.newModeAssessmentModelBuilderService.buildAssessmentModel(this.assessmentContext, this.mappedFormTypeId, confiruredSections, (assessmentFromDB) => {
      this.loggerService.log('Assessment from db for new assessment');
      this.loggerService.log(assessmentFromDB);

      if (!assessmentFromDB) {
        this.loggerService.logError('Unable to get assessment');
      }

      this.assessment = assessmentFromDB;

      assessmentFromDB.assessmentdetails.forEach(ad => {
        this.assignTemplateVersionId(ad);
      });

      if (onLoadComplete) onLoadComplete();

      this.showFormSections = true;
    });
    // this.createNewAssessmentEntity();

    // this.getFormSectionMeta(() => {

    //   this.createNewAssessmentDetails();

    //   if (onLoadComplete) onLoadComplete();

    //   this.showFormSections = true;
    // });
  }

  loadAssessmentTask(onLoadComplete?: () => void) {

    this.taskModeAssessmentModelBuilderService.buildAssessmentModel(this.assessmentContext, this.mappedFormTypeId, null,
      (assessmentFromDB) => {

        this.assessment = assessmentFromDB;

        if (onLoadComplete) onLoadComplete();

        if (this.assessment.taskformsectionid == FORM_ONE_CONFIG.enabled_section_id.section_3_id) {
          this.showFormSections = false;
          this.showTasKSections = true;
          this.showRedFlagTasKSections = true;
        }
        else if (this.assessment.taskformsectionid == FORM_ONE_CONFIG.enabled_section_id.section_4_id) {
          this.showFormSections = false;
          this.showTasKSections = true;
          this.showAmberFlagTasKSections = true;
        }
      });

    //let assessment_id = "5cebce21-2d06-faeb-686d-cadc2f49e08c"// testing
    //let verId = 1.0;//

    // let assessment_id = this.assessmentContext.assessment.assessment_id;

    // let verId = this.assessmentContext.assessment.versionid;

    // this.loggerService.log(`Gettting taks for assessmentid: ${assessment_id} and versionid: ${verId}`);

    // this.formApiService.getAssessmentForIdAndVersion(assessment_id, verId, (assessmentFromDB) => {

    //   this.loggerService.log('received assessment from db for task view');

    //   this.loggerService.log(assessmentFromDB);

    //   this.assessment = assessmentFromDB;

    //   this.assessment.assessmenttasks = [];

    //   this.formApiService.getAssessmentTaskForAssessment(assessment_id, verId, (assessmentTaskFromDB) => {

    //     assessmentTaskFromDB.forEach(ts => {
    //       this.assessment.assessmenttasks.push(ts);
    //     });

    //     if (onLoadComplete) onLoadComplete();

    //     if (this.assessment.taskformsectionid == FORM_ONE_CONFIG.enabled_section_id.section_3_id) {
    //       this.showFormSections = false;
    //       this.showTasKSections = true;
    //       this.showRedFlagTasKSections = true;
    //     }
    //     else if (this.assessment.taskformsectionid == FORM_ONE_CONFIG.enabled_section_id.section_4_id) {
    //       this.showFormSections = false;
    //       this.showTasKSections = true;
    //       this.showAmberFlagTasKSections = true;
    //     }
    //   });
    // });
    // this.getFormTaskMeta(() => {

    //   this.createNewAssessmentTasks();
    //   this.showTasKSections = true;
    // });
  }

  // getFormSectionMeta(onSucessfullFormSectionFetch: () => void) {

  //   const url = `${APP_MODULE_CONFIG.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=formsection&synapseattributename=formtype_id&attributevalue=${this.mappedFormTypeId}&returnsystemattributes=1&orderby=displayorder ASC`

  //   //const url = `${APP_MODULE_CONFIG.app_service.base_uri}/GetListByAttribute?synapsenamespace=meta&synapseentityname=formsection&formtype_id=${this.mappedFormTypeId}&_recordstatus=1&orderby=displayorder ASC`;

  //   this.apiService.get(url)
  //     .pipe(takeUntil(this.$destroy))
  //     .subscribe((formsections: any) => {
  //       if (!formsections || !Array.isArray(formsections) || formsections.length == 0) {
  //         this.showErrorMessage = true;
  //       } else {
  //         const templateVersionForSection1: number[] = formsections.filter(fs => fs.formsection_id === FORM_ONE_CONFIG.enabled_section_id.section_1_id)
  //           .map(fs => fs.templateversionid);
  //         this.formSection1TemplateVersionId = Math.max(...templateVersionForSection1);

  //         const templateVersionForSection2: number[] = formsections.filter(fs => fs.formsection_id ===
  //           FORM_ONE_CONFIG.enabled_section_id.section_2_id)
  //           .map(fs => fs.templateversionid);
  //         this.formSection2TemplateVersionId = Math.max(...templateVersionForSection2);

  //         const templateVersionForSection3: number[] = formsections.filter(fs => fs.formsection_id === FORM_ONE_CONFIG.enabled_section_id.section_3_id)
  //           .map(fs => fs.templateversionid);
  //         this.formSection3TemplateVersionId = Math.max(...templateVersionForSection3);

  //         const templateVersionForSection4: number[] = formsections.filter(fs => fs.formsection_id === FORM_ONE_CONFIG.enabled_section_id.section_4_id)
  //           .map(fs => fs.templateversionid);
  //         this.formSection4TemplateVersionId = Math.max(...templateVersionForSection4);

  //         if (onSucessfullFormSectionFetch) {
  //           onSucessfullFormSectionFetch();
  //         }
  //       }
  //     });
  // }

  // createNewAssessmentDetails() {
  //   this.assessment.assessmentdetails = [];

  //   let assessmentDetailSec1 = this.generateNewAssessmentDetail(FORM_ONE_CONFIG.enabled_section_id.section_1_id, this.formSection1TemplateVersionId);
  //   this.assessment.assessmentdetails.push(assessmentDetailSec1);

  //   let assessmentDetailSec2 = this.generateNewAssessmentDetail(FORM_ONE_CONFIG.enabled_section_id.section_2_id,
  //     this.formSection2TemplateVersionId);
  //   this.assessment.assessmentdetails.push(assessmentDetailSec2);

  //   let assessmentDetailSec3 = this.generateNewAssessmentDetail(FORM_ONE_CONFIG.enabled_section_id.section_3_id,
  //     this.formSection3TemplateVersionId);
  //   this.assessment.assessmentdetails.push(assessmentDetailSec3);

  //   let assessmentDetailSec4 = this.generateNewAssessmentDetail(FORM_ONE_CONFIG.enabled_section_id.section_4_id,
  //     this.formSection4TemplateVersionId);
  //   this.assessment.assessmentdetails.push(assessmentDetailSec4);

  //   // let assessmentDetailSec1 = new AssessmentDetail();
  //   // assessmentDetailSec1.assessment_id = this.assessment.assessment_id;
  //   // assessmentDetailSec1.assessmentdetail_id = UUID.UUID();
  //   // assessmentDetailSec1.assessmentversionid = this.assessment.versionid;
  //   // assessmentDetailSec1.formsection_id = FORM_ONE_CONFIG.enabled_section_id.section_1_id;
  //   // assessmentDetailSec1.formtype_id = this.mappedFormTypeId;
  //   // assessmentDetailSec1.sectiontemplateversionid = this.forsection1TemplateVersionId;
  //   // this.assessment.assessmentdetails.push(assessmentDetailSec1);
  // }

  // generateNewAssessmentDetail(section_id: string, formSectionTemplateVersionId: number) {
  //   let assessmentDetailSec1 = new AssessmentDetail();
  //   assessmentDetailSec1.assessment_id = this.assessment.assessment_id;
  //   assessmentDetailSec1.assessmentdetail_id = UUID.UUID();
  //   assessmentDetailSec1.assessmentversionid = this.assessment.versionid;
  //   assessmentDetailSec1.formsection_id = section_id;
  //   assessmentDetailSec1.formtype_id = this.mappedFormTypeId;
  //   assessmentDetailSec1.sectiontemplateversionid = formSectionTemplateVersionId;
  //   assessmentDetailSec1.assessmentdataAsJSON = new SectionData();
  //   assessmentDetailSec1.assessmentdata = '';


  //   return assessmentDetailSec1;
  // }

  // private createNewAssessmentEntity() {
  //   this.assessment = new AssessmentEntity();
  //   this.assessment.assessment_id = UUID.UUID();
  //   this.assessment.formtype_id = this.mappedFormTypeId;
  //   this.assessment.assessmenttype_id = this.assessmentContext.assessment.assessmenttype_id;//APP_MODULE_CONFIG.assessment_type_id; //this should come from context
  //   this.assessment.encounter_id = this._assessmentContextInput.assessment.encounter_id;
  //   this.assessment.person_id = this._assessmentContextInput.assessment.person_id;
  //   this.assessment.observationevent_id = this._assessmentContextInput.assessment.observationevent_id;
  //   this.assessment.versionid = 1.0;
  // }

}
