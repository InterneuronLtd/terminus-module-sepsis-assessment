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

import { FORM_STG_FOUR_CONFIG } from '../config/form-stg-four.config';
import { FormSectionDecisionOption } from '../models/form-decision-option';

export class SectionOneVM {
    public Agegreaterthen75:boolean=false;
    public Recenttraumasurgeryinvasiveprocedure: boolean = false;
    public Indwellinglinesbrokenskin: boolean = false;
    public Impairedimmunity: boolean = false;
    public questionid: string = FORM_STG_FOUR_CONFIG.section_1_config.question_1_id;
    public selectedYesNo: FormSectionDecisionOption = 'NOT ANSWERED'
}

