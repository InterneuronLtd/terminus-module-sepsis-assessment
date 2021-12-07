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

import { FormSectionDecisionOption } from '../models/form-decision-option';
import { FORM_STG_THREE_CONFIG } from '../config/form-stg-three.config';

export class SectionThreeVM {
    Objectiveevidenceofneworalteredmentalstate = false;
    SystolicBPle90mmHg = false;
    Heartratege130perminute = false;
    Respiratoryratege25perminute = false;
    NeedsO2tokeepSpO2 = false;
    Nonblanchingrashmottledashencyanotic = false;
    Lactatege2mmolperl = false;
    Recentchemotherapy = false;
    Notpassedurinein18hours = false;

    questionid: string = FORM_STG_THREE_CONFIG.section_3_config.question_1_id;

    selectedYesNo: FormSectionDecisionOption = 'NOT ANSWERED'

}