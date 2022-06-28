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

import { FORM_STG_TWO_CONFIG } from '../config/form-stg-two.config';
import { FormSectionDecisionOption } from '../models/form-decision-option';
import { FormOptionDataType, ReadOnly,  } from '../../form-one/models/form-option-datatype';

export class SectionFourVM {
    Behavingabnormallynotwantingtoplay : boolean = false;
    Parentalconcern : boolean = false;
    Moderatetachypnoea : boolean = false;
    Moderatetachycardia : boolean = false;
    SpO2lt92pconair : boolean = false;
    Capillaryrefilltimege3seconds : boolean = false;
    Reducedurineoutput : boolean = false;
    Legpain : boolean = false;
    Temperaturelt36 : boolean = false;
    Immunocompromised : boolean = false;

    questionid: string = FORM_STG_TWO_CONFIG.section_4_config.question_1_id;//FORM_ONE_CONFIG.section_4_config.question_1_id;//"d4fa85d3-e968-4e64-b76f-f97a8e549c2c"

    selectedYesNo: FormSectionDecisionOption = 'NOT ANSWERED'

}

