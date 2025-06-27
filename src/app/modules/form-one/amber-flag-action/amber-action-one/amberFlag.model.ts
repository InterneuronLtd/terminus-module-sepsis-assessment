//BEGIN LICENSE BLOCK 
//Interneuron Terminus

//Copyright(C) 2025  Interneuron Limited

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
/* Interneuron Sepsis Assessment App
Copyright(C) 2023  Interneuron Holdings Ltd
This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.
This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
See the
GNU General Public License for more details.
You should have received a copy of the GNU General Public License
along with this program.If not, see<http://www.gnu.org/licenses/>. */
export class amberFlagModel {
    seniorClinicalReview: string = "Required";
    antibioticsRequired: string = "No";
    bloodsSentAndReviewed = "Required";
    amberFlagNotes: string = "";
    // taskFiveaction: string="Not Done";
    seniorClinicalReviewTime: Date = new Date();
    seniorClinicalReviewDate: Date = new Date();

    bloodsSentAndReviewedTime: Date = new Date();
    bloodsSentAndReviewedate: Date = new Date();
    taskOneNotes: string = "";
    taskTwoNotes: string = "";
}