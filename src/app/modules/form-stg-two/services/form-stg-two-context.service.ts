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
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';

@Injectable()
export class FormStageTwoContextService {
    displaySectionTwo: boolean = false;
    displaySectionThree: boolean = false;
    displaySectionFour: boolean = false;
    formValidation = new Subject();
    public errorCount: number = 0;

    constructor(private loggerService: LoggerService) {
        this.loggerService.log('Creating instance of FormOneContextService');
    }

    onDestroy() {
        this.displaySectionFour = this.displaySectionThree = this.displaySectionTwo = false;
        // this.formValidation.next();
        // this.formValidation.complete();
    }

    ngOnDestroy(): void {
        this.displaySectionFour = this.displaySectionThree = this.displaySectionTwo = false;
        // this.formValidation.complete();
        this.loggerService.log('Destroying instance of FormOneContextService');
    }
}