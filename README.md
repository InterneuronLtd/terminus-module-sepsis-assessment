# Terminus - Sepsis Assessment Module

Assessment module replace traditional paper based assessments and forms allowing users to enter patient data and answer specific patient related questions. In addition, calculate scores deterred by data entered and repopulate forms where data is already available in the platform. 

Specific assessment forms will be used to capture the details for the specific assessment types e.g. Sepsis assessment forms will be used to capture details of the Sepsis Assessment.

**Sepsis Assessment:**

The purpose of the Sepsis Assessment is to assist with the early identification of patients who might have sepsis. The assessment asked questions of the clinician who is in front of the patient, prompting them to consider sepsis as an early potential diagnosis. Early detection can then lead to the early treatment of sepsis and prevention of more serious clinical deterioration.

The Sepsis Assessment module will be used by Hospital Nurses, Doctors and Allied Health Professionals.

## Prerequisites

**Development**

```
1. Visual Studio Community / Visual Studio Code
2. Angular CLI
3. Synapse Identity Server
4. Synapse Dynamic API
```

**Deployment** [windows]

```
1. IIS 7 or higher
2. Terminus Framework 
3. Synapse Identity Sever
4. Synapse Dynamic API
```

## Configure

#### Install Angular CLI and install packages

1. Download and install Node package manager on this link [NPM](https://www.npmjs.com/get-npm)

2. Follow the instructions on this link to install [Angular CLI](https://angular.io/cli)

3. Open the solution in Visual Studio and right click on the solution and open command prompt

4. Run npm install to install all dependencies.

   ```
   npm install
   ```



#### Load Master Data

Create the required master data with the details mentioned in the 'Seed_Data.md'



#### Application Development and Deployment

This module is packaged as an Angular Element [a web component] to deploy into Terminus framework.

To run and debug the application in development mode these settings needs to be done

##### Develop and debug in Visual studio

These settings needs to be done before the application could be locally run via angular cli.



**Configuration:**

Change the below configurations appropriately in assets/config/sepsis_assessment_config.json

```
 app_service: {
   base_uri: "SYNAPSE_DYNAMIC_URI" 
 }
 
 identity_service: {
 		base_uri: "SYNAPSE_IDENTITY_URI"
 }
    
  infra: {
        showLogInConsole: true,
        showErrorInConsole: true
    },
```

**1. Assessment Identifier in appcomponent.ts**

 Open appcomponent.ts and un-comment below  marked for testing. When hosted on Terminus, the framework provides a personid to the module.

```
  ngOnInit() {

    //for testing   
    // this.sepsisAssessmentConfigService.load()
    //   .then(() => {
    //     this._assessmentContext = { assessment: { versionid: 1.0, assessment_id: '5cebce21-2d06-faeb-686d-cadc2f49e08c', encounter_id: '7a017a1c-8bc5-46f8-9d4d-1afd00640103', person_id: 'd91ef1fa-e9c0-45ba-9e92-1e1c4fd468a2' }, action: 'new', apiServiceFromFW: this.apiService };
    //     this.loadSepsisAssessment();
    //   });
    //end for testing

    this.prepareSaveConfirmation();

    if (this.formModal)
      this.formModal.config = { ignoreBackdropClick: true, backdrop: 'static' };
  }
```



**2. Getting an auth. token from Synapse Identity Server - apirequest.service.ts**

Comment out the below lines in core/services/in.appbase.service.ts

```
 //return from(this.appService.apiService.getRequest(uri));

 //return from(this.appService.apiService.postRequest(uri, body));

 //return from(this.appService.apiService.deleteRequest(uri));
```

Uncomment the below lines in core/services/in.appbase.service.ts

```
this.restClient = new RestClient(this.httpClient, this.authService);
return this.restClient.get(url, { params: params, headers: headers });

this.restClient = new RestClient(this.httpClient, this.authService);
return this.restClient.post(url, body, { params: params, headers: headers });

return this.restClient.delete(url, { params: params, headers: headers });
```

**3. In the app.config.service.ts:
 Use the 'httpClient' instead of 'apiBaseService' in the 'load' method

**4. Bootsrapping a component in appmodule.ts**

The bootstrap array should contain the AppComponent.

```
  bootstrap: [AppComponent],
```

**5. Run the app via angular cli**

In Visual Studio right click on the solution and open developer command prompt. Run the below commands and then navigate to [http://localhost:4200](http://localhost:4200/) in google chrome.

```
ng serve
```

##### Publish to Terminus Framework

These settings needs to be done before the application can be packaged as a web component and hosted on Terminus Framework.

**Configuration:**

Change the below configurations appropriately in config/app,module.config.ts

```
 app_service: {
   base_uri: "SYNAPSE_DYNAMIC_URI" 
 }
 
 identity_service: {
 		base_uri: "SYNAPSE_IDENTITY_URI"
 }
  infra: {
        showLogInConsole: false,
        showErrorInConsole: true
    },
```



**1. Assessment Identifier in appcomponent.ts**

 Open appcomponent.ts and comment below marked for testing. When hosted on Terminus, the framework provides a personid to the module.

```
 ngOnInit() {

    //for testing   
    // this._assessmentContext = { assessment: { encounter_id: '7a017a1c-8bc5-46f8-9d4d-1afd00640103', person_id: 'd91ef1fa-e9c0-45ba-9e92-1e1c4fd468a2' }, action: 'new' };
    //this._assessmentContext = { assessment: { versionid: 1.0, assessment_id: '5cebce21-2d06-faeb-686d-cadc2f49e08c', encounter_id: '7a017a1c-8bc5-46f8-9d4d-1afd00640103', person_id: 'd91ef1fa-e9c0-45ba-9e92-1e1c4fd468a2' }, action: 'new' };
    this._assessmentContext = { assessment: { versionid: 1.0, assessment_id: '5b9aac3e-2225-6517-631c-fb0e70145d05', encounter_id: '19bed96b-d4e6-4f63-b7d6-e92ce0a8b1a7', person_id: 'a4074c14-568b-44e8-9314-df0737e6513f' },apiServiceFromFW:'', action: 'showtasks' };
    this.loadSepsisAssessment();
    //end for testing

    this.prepareSaveConfirmation();

    if (this.formModal)
      this.formModal.config = { ignoreBackdropClick: true, backdrop: 'static' };
  }
```

**2. Getting an auth. token from Terminus Framework - apirequest.service.ts**

***Comment*** the below lines in core/services/in.appbase.service.ts

```
        return from(this.apiClientFromFW.getRequest(url));

        return from(this.apiClientFromFW.postRequest(url, body));

        return from(this.apiClientFromFW.deleteRequest(url));
```

***Uncomment*** the below lines in core/services/in.appbase.service.ts

```
this.restClient = new RestClient(this.httpClient, this.authService);
return this.restClient.get(url, { params: params, headers: headers });

this.restClient = new RestClient(this.httpClient, this.authService);
return this.restClient.post(url, body, { params: params, headers: headers });

return this.restClient.delete(url, { params: params, headers: headers });
```

**3. Bootsrapping a component in appmodule.ts**

The bootstrap array should be empty.

```
  bootstrap: [],
```

**4. Package the app to host on Terminus**

In Visual Studio right click on the solution and open developer command prompt. Run the below commands.

```
npm run prod-build
```

open the root folder of the solution and then open the dist folder. Find main.js which is the packaged application.

#### Publish and Install

If you have not already created Interneuron sites in IIS, pls follow the below procedure to create the sites

1. Locate and copy the Interneuron-AppPools.xml and Interneuron-Sites.xml from Sample/IISSettings folder to a local folder.
2. Open command prompt in administrator mode and execute the below commands

```
   %windir%\system32\inetsrv\appcmd add apppool /in < "path to Interneuron-AppPools.xml"
   
   %windir%\system32\inetsrv\appcmd add site /in < "path to  Interneuron-Sites.xml"
```

1. Please follow the instructions on the Terminus - Framework Readme to deploy Terminus Framework.
2. Package the application using the instructions in the above section **4. Package the app to host on Terminus**
3. Rename **main.js** to ***assessments.js*** and copy into the **assessments** folder in **terminusmoduleloader** site folder in c:\inetpub\wwwroot.

## Author

- GitHub: [Interneuron CIC](https://github.com/InterneuronCIC)

------

## 📝 License

Interneuron Terminus Copyright(C) 2023  Interneuron Holdings Ltd

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by The Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.

See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see http://www.gnu.org/licenses/.