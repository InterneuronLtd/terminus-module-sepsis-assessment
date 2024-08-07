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

import { FORM_ONE_CONFIG } from '../config/form-one.config';
import { FormSectionDecisionOption } from '../models/form-decision-option';
import { optionType } from '../../shared/services/decorators/option-type.decorator';

export class SectionOneVM {
    @optionType({text:'Recent trauma / surgery / invasive procedure', defVal: false})
    public Recenttraumasurgeryinvasiveprocedure: boolean = false;
    @optionType({text:'Indwelling lines / broken skin', defVal: false})
    public Indwellinglinesbrokenskin: boolean = false;
    @optionType({text:'Impaired immunity (e.g. diabetes, steroids, chemotherapy)', defVal: false})
    public Impairedimmunity: boolean = false;
    public questionid: string = FORM_ONE_CONFIG.section_1_config.question_1_id;
    public selectedYesNo: FormSectionDecisionOption = 'NOT ANSWERED'
}

