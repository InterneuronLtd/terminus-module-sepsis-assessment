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

import { FORM_ONE_CONFIG } from '../config/form-one.config';
import { FormSectionDecisionOption } from '../models/form-decision-option';

export class SectionFourVM {
    public Notrespondingnormallynosmile: boolean = false;
    public Reducedactivityverysleepy: boolean = false;
    public parentalorcarerconcern: boolean = false;
    public Moderatetachypnoea: boolean = false;
    public Moderatetachycardia: boolean = false;
    public SpO2lessthen92perorincreasedO2requirement: boolean = false;
    public Nasalflaring: boolean = false;
    public Capillaryrefilltime3seconds: boolean = false;
    public Reducedurineoutput: boolean = false;
    public Legpainorcoldextremities: boolean = false;
    public Immunocompromised: boolean = false;

    public questionid: string = FORM_ONE_CONFIG.section_4_config.question_1_id;//"d4fa85d3-e968-4e64-b76f-f97a8e549c2c"
    
    selectedYesNo: FormSectionDecisionOption = 'NOT ANSWERED'

}