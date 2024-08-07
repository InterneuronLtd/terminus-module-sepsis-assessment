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

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-form-common-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() headerText = 'SEPIS SCREENING TOOL ACUTE ASSESSMENT'; //default
  @Input() subTextRight = 'AGE 0-5'; //default

  constructor() { }

  ngOnInit() {
  }

}
