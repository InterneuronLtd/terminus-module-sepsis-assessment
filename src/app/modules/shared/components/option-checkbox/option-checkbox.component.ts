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

import { Component, OnInit, Input, EventEmitter, Output, Injector } from '@angular/core';
import { InBaseComponent } from 'src/app/core/components/InBaseComponent';
import { UUID } from 'angular2-uuid';

@Component({
    selector: 'app-option-checkbox',
    template:
        `
<div class="form-check form-check-inline custom-checkbox checkbox-lg">
    <input type="checkbox" [disabled]="disabled" [(ngModel)]="modelToBind[key]"
    (change)="onChange($event)"
    class="custom-control-input" [id]="cntrlId">
    <label class="custom-control-label" [for]="cntrlId">{{text}}
        <a href="#" *ngIf="actionText && actionTextClick" (click)="onActionTextClick(actionText)">{{actionText}}</a>
    </label>
</div>
`,
    styleUrls: ['option-checkbox.component.css']
})
export class OptionCheckboxComponent extends InBaseComponent implements OnInit {

    @Input() key: string = '';
    @Input() text = '';
    @Input() modelToBind: any = null;
    @Input() disabled: boolean = false;
    @Input() actionText?: string;
    @Output() actionTextClick?: EventEmitter<any> = new EventEmitter<any>();


    @Output() optionChange: EventEmitter<{ e: any, key: string, text: string }> = new EventEmitter<{ e: any, key: string, text: string }>(true);

    cntrlId: UUID = UUID.UUID();

    constructor(protected injector: Injector) {
        super(injector);
    }

    ngOnInit(): void {
    }

    onChange(e) {
        if (this.optionChange) this.optionChange.emit({ e: e, key: this.key, text: this.text });
    }

    onActionTextClick(text) {
        if (this.actionTextClick) this.actionTextClick.emit(text);
    }

}