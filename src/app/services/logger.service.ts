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

import { Injectable } from '@angular/core';
import { SepsisAssessmentConfigService } from '../config/sepsis-assessment-config.service';
import { SepsisAssessmentModuleConfigData } from '../config/app.module.config';

@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    public log(msg: any) {
        if (SepsisAssessmentModuleConfigData.Config) {
            if (SepsisAssessmentModuleConfigData.Config.infra.showLogInConsole)
                console.log(msg);
        }
        else
            console.log(msg);

    }
    public logError(err: any) {
        if (SepsisAssessmentModuleConfigData.Config) {
            if (SepsisAssessmentModuleConfigData.Config.infra.showErrorInConsole)
                console.error(err);
        }
        else
            console.log(err);
    }
}