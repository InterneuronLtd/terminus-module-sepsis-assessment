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

import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { Injector, Component, OnDestroy, Input, ViewEncapsulation, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
   selector: 'chart-reading',
   templateUrl: `./chart-reading.component.html`,
   styleUrls: ['./chart-reading.component.css']
})
export class ChartReadingComponent extends InBaseComponent implements OnDestroy {

   @Input() showUpto5 = false;
   @Input() showUpto12 = false;
   @Input() showUpto18 = false;
   @Input() showAbove18 = false;

   @Output() close: EventEmitter<any> = new EventEmitter<any>();

   @Input()
   set displayChart(val) {
      this.isModalShown = val;
   }
   
   isModalShown = false;

   @ViewChild('chartModal', { read: ModalDirective }) chartModal: ModalDirective;

   constructor(protected injector: Injector) {
      super(injector);
   }

   ngOnDestroy() {
      super.ngOnDestroy();
   }

   hideModal(): void {
      this.chartModal.hide();
    }

    onHidden(): void {
      this.isModalShown = false;

      this.loggerService.log('hiding the show chart popup');

      if(this.close) this.close.emit(true);

    }
}