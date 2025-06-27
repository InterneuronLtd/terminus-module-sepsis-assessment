//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

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
import { SepsisAssessmentModuleConfig, SepsisAssessmentModuleConfigData } from './app.module.config';
import { takeUntil } from 'rxjs/operators';
import { firstValueFrom, Subject } from 'rxjs';
import { InAppBaseApiService } from '../services/in.appbase.service';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root'
})
export class SepsisAssessmentConfigService {
    destroy$: Subject<boolean> = new Subject<boolean>();

    constructor(private apiBaseService: InAppBaseApiService, private httpClient: HttpClient) {
    }
    load() {
        const jsonFile = './assets/config/sepsis_assessment_config.json';
        return new Promise<boolean>((resolve, reject) => {
            firstValueFrom(this.apiBaseService
                .get(jsonFile)
                .pipe(takeUntil(this.destroy$)))
                .then((response: any) => {
                    SepsisAssessmentModuleConfigData.Config = <SepsisAssessmentModuleConfig>response;
                    resolve(true);
                }).catch((response: any) => {
                    reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
                });
        });
    }
    reset() {
        this.destroy$.next(true);
        this.destroy$.complete();
        SepsisAssessmentModuleConfigData.Config = null;
    }
}
