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
import { Component, Input, Injector, ViewChild, OnInit, ViewEncapsulation, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { InBaseComponent } from './core/components/InBaseComponent';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { InAppBaseApiService } from './services/in.appbase.service';
import { GenericMessagePopup, GenericMessagePopupAction } from './core/components/generic-message-popup.component';
import { EventService } from './services/event.service';
import { FormTypeResolverService } from './services/form-type-resolver.service';
import { SepsisAssessmentConfigService } from './config/sepsis-assessment-config.service';
import { SepsisAssessmentModuleConfigData } from './config/app.module.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [FormTypeResolverService]
})
export class AppComponent extends InBaseComponent implements OnInit {

  _assessmentContext: IAssessmentContext;//{ assessment: any; apiServiceFromFW: any, action: ActionModeType };

  isModalShown: boolean = false;

  patientAge: number;

  showConfirmationMessagePopup = false;

  showLoadingIndicator = false;

  confirmationMessagePopup: GenericMessagePopup = new GenericMessagePopup();

  @Input()
  set assessmentContext(assessmentVal: IAssessmentContext) { //{ assessment: any; apiServiceFromFW: any, action: ActionModeType }) {

    if (assessmentVal) {
      this.apiService.apiClientFromFW = assessmentVal.apiServiceFromFW;

      if (!SepsisAssessmentModuleConfigData.Config) {
        this.sepsisAssessmentConfigService.load()
          .then(() => {
            this.assignAssessmentContext(assessmentVal);
            this.prepareSaveConfirmation();

            if (this.formModal)
              this.formModal.config = { ignoreBackdropClick: true, backdrop: 'static' };
          });
      } else {
        this.assignAssessmentContext(assessmentVal);
        this.prepareSaveConfirmation();

        if (this.formModal)
          this.formModal.config = { ignoreBackdropClick: true, backdrop: 'static' };
      }
    }


  }
  get assessmentContext() {
    return this._assessmentContext;
  }

  @Input() unload: any;

  @ViewChild('formModal', { read: ModalDirective }) formModal: ModalDirective;

  @ViewChild('formContainer', { read: ViewContainerRef }) formContainer: ViewContainerRef;

  constructor(protected injector: Injector,
    private resolver: ComponentFactoryResolver,
    private apiService: InAppBaseApiService,
    private formTypeResolverService: FormTypeResolverService,
    private eventService: EventService,
    private sepsisAssessmentConfigService: SepsisAssessmentConfigService) {

    super(injector);

  }

  ngOnInit() {

    //for testing   
    // this.sepsisAssessmentConfigService.load()
    //   .then(() => {
    //     this._assessmentContext = { assessment: { versionid: 1.0, assessment_id: '5cebce21-2d06-faeb-686d-cadc2f49e08c', encounter_id: '7a017a1c-8bc5-46f8-9d4d-1afd00640103', person_id: 'd91ef1fa-e9c0-45ba-9e92-1e1c4fd468a2' }, action: 'new', apiServiceFromFW: this.apiService };
    //     this.loadSepsisAssessment();
    //   });
    //end for testing

    // this.prepareSaveConfirmation();

    // if (this.formModal)
    //   this.formModal.config = { ignoreBackdropClick: true, backdrop: 'static' };

    // if (!SepsisAssessmentModuleConfigData.Config) {
    //   this.sepsisAssessmentConfigService.load()
    //     .then(() => {
    //       this.prepareSaveConfirmation();

    //       if (this.formModal)
    //         this.formModal.config = { ignoreBackdropClick: true, backdrop: 'static' };
    //     })
    // } else {
    //   this.prepareSaveConfirmation();

    //   if (this.formModal)
    //     this.formModal.config = { ignoreBackdropClick: true, backdrop: 'static' };
    // }


  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.apiService.onDestroy();
    this.formTypeResolverService.onDestroy();
    this.sepsisAssessmentConfigService.reset();
  }

  assignAssessmentContext(assessmentVal: IAssessmentContext): any {
    if (assessmentVal && assessmentVal.assessment && !assessmentVal.assessment.assessmenttype_id)
      assessmentVal.assessment.assessmenttype_id = SepsisAssessmentModuleConfigData.Config.assessment_type_id;

    this._assessmentContext = assessmentVal;

    this.loggerService.log('Received Assessment Context');

    this.loggerService.log(assessmentVal);

    this.apiService.apiClientFromFW = assessmentVal.apiServiceFromFW;

    //Initialize the context state
    const assessmentInput = assessmentVal.assessment;

    if (assessmentInput) {
      this.contextStateService.assessmentId = assessmentInput.assessment_id;
      this.contextStateService.assessmentVersionId = assessmentInput.versionid;
      this.contextStateService.encounterId = assessmentInput.encounter_id;
      this.contextStateService.personId = assessmentInput.person_id;
      this.contextStateService.observationEventId = assessmentInput.observationevent_id;
    }

    this.loadSepsisAssessment();
  }

  prepareSaveConfirmation() {

    this.confirmationMessagePopup.headerMessage = 'Confirmation';
    this.confirmationMessagePopup.messageContent = SepsisAssessmentModuleConfigData.Config.messages.form_close_confirmation;
    this.confirmationMessagePopup.showCloseButton = false;

    let actionYes = new GenericMessagePopupAction();

    actionYes.name = 'Yes';
    actionYes.styleCss = 'btn-primary';

    actionYes.onAction = () => {
      this.loggerService.log('On Click of Yes');
      this.showConfirmationMessagePopup = false;
      this.hideAssessmentDetailsInModal();
    };

    let actionNo = new GenericMessagePopupAction();
    actionNo.name = 'NO';
    actionNo.styleCss = 'btn-secondary';
    actionNo.onAction = () => {
      this.loggerService.log('On Click of No');
      this.showConfirmationMessagePopup = false;
    };
    this.confirmationMessagePopup.actions = [actionYes, actionNo];
  }

  loadSepsisAssessment() {

    this.showAssessmentDetailsInModal();
  }

  createFormComponent() {

    this.showLoadingIndicator = true;

    this.formTypeResolverService.getFormType({ assessment: this.assessmentContext.assessment, action: this.assessmentContext.action },
      (formComponent) => {

        this.loggerService.log(`Resolved form  ${formComponent}`);

        this.showLoadingIndicator = false;

        this.formContainer.clear();
        const factory = this.resolver.resolveComponentFactory<any>(formComponent);
        const componentRef = this.formContainer.createComponent(factory);
        componentRef.instance.assessmentContext = { assessment: this.assessmentContext.assessment, action: this.assessmentContext.action };///this.assessmentContext;
        componentRef.instance.close.subscribe((data: boolean) => this.onClose(data));
      });
  }



  showAssessmentDetailsInModal(): void {
    this.loggerService.log('Executing showAssessmentDetailsInModal');

    setTimeout(() => {
      this.isModalShown = true;
    });//to give some delay

    setTimeout(() => {
      this.createFormComponent();
    });//Move to next cycle - Give time to update the modal view and then show form
  }

  hideAssessmentDetailsInModal(): void {
    this.formModal.hide();
    this.eventService.unLoadModule.next();

    if (this.unload) {
      this.unload({ name: 'sepsis' });
    }
  }

  onAssessmentDetailsInModalHidden(): void {
    this.isModalShown = false;
  }

  onClose(showConfirmation: boolean): void {
    this.loggerService.log('closing the form');
    this.loggerService.log(showConfirmation);

    if (!showConfirmation || (this.assessmentContext && (this.assessmentContext.action == 'view'))) {
      this.formModal.hide();
      this.isModalShown = false;
      this.eventService.unLoadModule.next();
      if (this.unload) {
        this.unload({ name: 'sepsis' });
      }
    }
    else {
      this.showConfirmationMessagePopup = true;
    }
  }
}

export class IAssessmentContext {
  assessment?: {
    assessment_id?: string,
    assessmenttype_id?: string,
    encounter_id?: string,
    formtype_id?: string,
    observationevent_id?: string,
    person_id?: string,
    versionid?: number,
    sourceofinvocation?: string,
  };
  apiServiceFromFW: any;
  action: 'new' | 'edit' | 'view' | 'amend' | 'viewhistory' | 'showtasks';
}


