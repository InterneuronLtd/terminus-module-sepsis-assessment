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

import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { OnInit, Input, EventEmitter, Output, Injector, Component } from '@angular/core';


@Component({
    selector: 'app-option-checkboxlist',
    template:
        `
<ng-container *ngIf="model">
    <ng-container *ngFor="let vm of model">
        <app-option-checkbox key="vm.key" text="vm.text" [modelToBind]="vm.optionModel" [disabled]="vm.disabled"  (optionChange)="onChange($event)"></app-option-checkbox>
    </ng-container>
</ng-container>
`
})
export class OptionCheckboxListComponent extends InBaseComponent implements OnInit {

    @Input() model: OptionCheckboxListComponentModel[] = [];

    @Output() optionChange: EventEmitter<{e: any, key: string, text:string}> = new EventEmitter<{e: any, key: string, text:string}>(true);

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
    }

    onChange(e) {
        this.loggerService.log('onchange');
        this.loggerService.log(e);
        if (this.optionChange) this.optionChange.emit({e: e, key: e.key, text: e.text});
    }
}



export class OptionCheckboxListComponentModel {
    optionModel: any = null;
    key: string = ''; //should be the key of optionModel
    text = '';
    disabled: boolean = false;
}
