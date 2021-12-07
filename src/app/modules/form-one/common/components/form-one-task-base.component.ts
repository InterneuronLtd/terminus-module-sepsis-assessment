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

import { Component, OnDestroy, Injector } from '@angular/core';
import { FormActionSectionBaseComponent } from 'src/app/modules/shared/components/form-action-section-base.component';
import { FormOneContextService } from '../../services/form-one-context.service';

@Component({
    selector: 'app-form-one-task-base',
    template: ''
})
export class FormOneTaskBaseComponent extends FormActionSectionBaseComponent implements OnDestroy {

    formOneContextService: FormOneContextService;
    
    constructor(protected injector: Injector) {
        super(injector);
        this.formOneContextService = injector.get(FormOneContextService);
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }
}