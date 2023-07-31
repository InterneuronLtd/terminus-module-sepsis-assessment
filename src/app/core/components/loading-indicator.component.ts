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
    selector: 'loading-indicator',
    styles:[
        `
        .loading-screen-wrapper {
            z-index: 100000;
            position: fixed;
            background-color: rgba(0, 0, 0, 0.5);
            width: 100%;
            height: 100%;
            display: block;
            top: 0px;
            left: 0px;
          }
          
          .loading-screen-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        `

    ],
    template: `
<!--<ng-container *ngIf="showLoadingIndicator">
    <div class="spinner-grow spinner-grow-sm text-dark" role="status">
        <span class="sr-only">Loading...</span>
    </div>
</ng-container>-->
<div *ngIf="showLoadingIndicator" class="loading-screen-wrapper">
  <div class="loading-screen-icon">
    <div class="d-flex justify-content-center">
        <div class="spinner-grow spinner-grow-sm text-dark" role="status">
            <span class="sr-only">{{message}}</span>
        </div>
    </div>
  </div>
</div>

`
})
export class LoadingIndicatorComponent {
    @Input() showLoadingIndicator = false;

    @Input() message? = 'Loading...';
}