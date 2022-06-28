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


import { FormSectionDecisionOption } from '../models/form-decision-option';
import { FORM_ONE_CONFIG } from '../config/form-one.config';

export class SectionThreeVM {
    public Doesnwakewhenrousedwonstayawake: boolean = false;
    public Looksveryunwelltohealthcareprofessional: boolean = false;
    public Weakhighpitchedorcontinuouscry: boolean = false;
    public Severetachycardia: boolean = false;
    public Severetachypnoea: boolean = false;
    public SPO2lessthana90onairorincreasedO2requirements: boolean = false;
    public Bradycardia: boolean = false;
    public Nonblanchingrashmottledashencyanotic: boolean = false;
    public Temperature: boolean = false;
    public Ifunder3monthstemperature: boolean = false;

    public questionid: string = FORM_ONE_CONFIG.section_3_config.question_1_id;
    
    selectedYesNo: FormSectionDecisionOption = 'NOT ANSWERED'

}