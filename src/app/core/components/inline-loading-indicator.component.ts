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

import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'inline-loading-indicator',
    template: `
<ng-container *ngIf="showLoadingIndicator">
    <!--<div class="spinner-grow spinner-grow-sm text-dark" role="status">
        <span class="sr-only">Loading...</span>
        <ng-content></ng-content>
    </div>-->
    <div class="d-flex justify-content-left">
        <div class="spinner-grow spinner-grow-sm text-dark" role="status">
        </div>
        <div style="margin-left:2%;font-style:italic;">
            <ng-content></ng-content>
        </div>
    </div>
</ng-container>
`
})
export class InlineLoadingIndicatorComponent {
    @Input() showLoadingIndicator = false;
}