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

import { FORM_STG_FOUR_CONFIG } from '../config/form-stg-four.config'
import { FormSectionDecisionOption } from '../models/form-decision-option'

export class SectionTwoVM {
    public Respiratory: boolean = false;
    public Urine: boolean = false;
    public Skinjointwound: boolean = false;
    public Brain: boolean = false;
    public Surgical: boolean = false;
    public Other: boolean = false;
    public Indwellingdevice: boolean = false;
    showSubmitPanel: boolean = false;

    questionid: string = FORM_STG_FOUR_CONFIG.section_2_config.question_1_id;// "8a916540-51d1-4989-aede-8bebcbad5c50"
    selectedYesNo: FormSectionDecisionOption = 'NOT ANSWERED'

}