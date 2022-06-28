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

import { Component, Input, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
    selector: 'message-popup',
    styles: [
        `
        .message-popup-wrapper {
            /*z-index: 100000;
            position: absolute;
            background-color: rgba(0, 0, 0, 0.6);
            width: 100%;
            height: 100%;*/
            display: block;
          }
          .message-popup-modal {
            /*position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);*/
            background-color: rgba(0, 0, 0, 0.6);
          }
        .message-popup-header {
            background-color: #606d96;
            color: #fff;
            padding: 0.3rem !important;
        }
        .message-popup-body {
            font-size: 1rem;
            font-weight: bold;
        }
        .message-content {
            text-align: center;
        }
        .action-btns {
            margin: 3px;
        }
        `
    ],
    template: `
    <div class="message-popup-wrapper" *ngIf="showMessagePopup && genericMessagePopupVM">
        <div [config]="{ show: true, backdrop: 'static' }" class="modal fade message-popup-modal" bsModal #confirmModal="bs-modal" tabindex="-1" role="dialog" style="z-index:10000; opacity: 1;">
            <div class="modal-dialog modal-sm" style="top:50%;">
                <div class="modal-content">
                    <div class="modal-header message-popup-header">
                        <h4 id="dialog-events-name" class="modal-title pull-left">{{genericMessagePopupVM.headerMessage}}</h4>
                        <ng-container *ngIf="genericMessagePopupVM.showCloseButton">
                            <button type="button" class="close pull-right" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </ng-container>
                    </div>
                    <div class="modal-body message-popup-body">
                        <div  [ngClass]="['message-content','alert', genericMessagePopupVM.messageContentClass]" role="alert">
                            {{genericMessagePopupVM.messageContent}}
                        </div>
                        <div class="d-flex justify-content-center" style="margin-top:5px;">
                            <ng-container *ngFor="let action of genericMessagePopupVM.actions">
                                <button type="button" [ngClass]="['btn', action.styleCss, 'action-btns']" (click)="action.onAction({'name':action.name, 'data': genericMessagePopupVM.data })" >{{action.name}}</button>
                            </ng-container>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `
})
export class GenericMessagePopupComponent {

    @Input() showMessagePopup = false;

    @Input() genericMessagePopupVM: GenericMessagePopup;


    @ViewChild('confirmModal', { read: false }) confirmModal: ModalDirective;

}

export class GenericMessagePopup {
    showCloseButton = false;

    messageContentClass = 'alert-dark';

    _messageType: PopUpMessageType = 'default';

    data: any;

    get messageType(): PopUpMessageType {
        return this._messageType;
    }
    set messageType(value: PopUpMessageType) {
        if (value == 'success') {
            this.messageContentClass = 'alert-success';
        } else if (value == 'error') {
            this.messageContentClass = 'alert-danger';
        }
        this._messageType = value;
    }
    headerMessage = '';
    messageContent = '';
    actions: GenericMessagePopupAction[];
}

export class GenericMessagePopupAction {
    name: string;
    styleCss: string;
    onAction: (data: any) => void;
}

export type PopUpMessageType = 'default' | 'success' | 'error';