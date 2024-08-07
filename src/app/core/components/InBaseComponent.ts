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

import { OnDestroy, Injector, Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { LoggerService } from 'src/app/services/logger.service';
import { ContextStateService } from 'src/app/services/context-state.service';

// @Component({
//   selector: 'app-base',
//   template: `NO UI TO BE FOUND HERE!`,
// })
// Angular to do
@Injectable()
export class InBaseComponent implements OnDestroy {
  destroy$ = new Subject<boolean>();
  loggerService: LoggerService;
  contextStateService: ContextStateService;

  constructor(protected injector: Injector) { 
    this.loggerService = injector.get(LoggerService);
    this.contextStateService = injector.get(ContextStateService);
  }

  ngOnDestroy(): void {
    this.loggerService.log("destroying objects");
    this.destroy$.next(true);
    this.destroy$.complete();
  }

}