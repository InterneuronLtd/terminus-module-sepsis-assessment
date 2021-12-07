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

import { Component, OnInit, Injector, OnDestroy } from '@angular/core';
import { AssessmentDetail } from 'src/app/models/Assessment.model';
import { FORM_STG_THREE_CONFIG } from './config/form-stg-three.config';
import { FormStageThreeContextService } from './services/form-stg-three-context.service';
import { SaveData } from '../shared/models/save-data.type';
import { FormBaseComponent } from '../shared/components/form-base.component';

@Component({
  selector: 'app-form-stg-three',
  templateUrl: './form-stg-three.component.html',
  styleUrls: ['./form-stg-three.component.css']
})
export class FormStageThreeComponent extends FormBaseComponent implements OnInit, OnDestroy {

  mappedFormTypeId = FORM_STG_THREE_CONFIG.form_type_id;

  showFormSections = false;

  showTasKSections = false;
  showRedFlagTasKSections = false;
  showAmberFlagTasKSections = false;

  formSection1TemplateVersionId: number;
  formSection2TemplateVersionId: number;
  formSection3TemplateVersionId: number;
  formSection4TemplateVersionId: number;

  constructor(protected injector: Injector,
    private formStageThreeContextService: FormStageThreeContextService) {
    super(injector);
  }

  ngOnInit() {
    this.loggerService.log('Showing Form for Age 12+');
  }

  ngOnDestroy() {

    this.loggerService.log('Destroying Form for Age 12+');

    this.assessment = null;
    this.assessmentContext = null;

    super.ngOnDestroy();

    if (this.formStageThreeContextService) this.formStageThreeContextService.onDestroy();

    this.formStageThreeContextService = null;

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
  }
  assignTemplateVersionId(ad: AssessmentDetail) {
    if (ad.formsection_id == FORM_STG_THREE_CONFIG.enabled_section_id.section_1_id) {
      this.formSection1TemplateVersionId = ad.sectiontemplateversionid;
    } else if (ad.formsection_id == FORM_STG_THREE_CONFIG.enabled_section_id.section_2_id) {
      this.formSection2TemplateVersionId = ad.sectiontemplateversionid;
    } else if (ad.formsection_id == FORM_STG_THREE_CONFIG.enabled_section_id.section_3_id) {
      this.formSection3TemplateVersionId = ad.sectiontemplateversionid;
    } else if (ad.formsection_id == FORM_STG_THREE_CONFIG.enabled_section_id.section_4_id) {
      this.formSection4TemplateVersionId = ad.sectiontemplateversionid;
    }
  }

  loadAssessmentTask(onLoadComplete?: () => void) {
    this.taskModeAssessmentModelBuilderService.buildAssessmentModel(this.assessmentContext, this.mappedFormTypeId, null,
      (assessmentFromDB) => {

        this.assessment = assessmentFromDB;

        if (onLoadComplete) onLoadComplete();

        if (this.assessment.taskformsectionid == FORM_STG_THREE_CONFIG.enabled_section_id.section_3_id) {
          this.showFormSections = false;
          this.showTasKSections = true;
          this.showRedFlagTasKSections = true;
        }
        else if (this.assessment.taskformsectionid == FORM_STG_THREE_CONFIG.enabled_section_id.section_4_id) {
          this.showFormSections = false;
          this.showTasKSections = true;
          this.showAmberFlagTasKSections = true;
        }
      });
  }

  handleNewAssessment(onLoadComplete?: () => void) {

    let confiruredSections = [FORM_STG_THREE_CONFIG.enabled_section_id.section_1_id, FORM_STG_THREE_CONFIG.enabled_section_id.section_2_id, FORM_STG_THREE_CONFIG.enabled_section_id.section_3_id, FORM_STG_THREE_CONFIG.enabled_section_id.section_4_id];

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
  }
}
