/*
 * Copyright 2017 Adobe Systems Incorporated. All rights reserved.
 *
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS OF ANY KIND,
 * either express or implied.  See the License for the specific language governing permissions and
 * limitations under the License.
 */

var ACTION_LOAD = "load";
var ACTION_VALIDATE = "validate";
var ACTION_SUBMIT =  "submit";



function loadDialog() {
    
    return {
        "type":"dialog",
        "properties":{
            "headerText":"Custom Header Text",
            "bodyText":"Some general body text for the dialog",
            "buttonOkayText":"OKIE"
        },

        "children": [   
            {
                "type":"textarea",
                "properties":{
                    "label":"My Text Area Label",
                    "text":"My Custom Text",
                    "placeholder":"placeholder text here, like 'Mark is awesome!' "
                }
            },

            {
                "type":"button",
                "properties":{
                    "label":"My Cool Button",
                    "buttonText":"My Button Text"
                }
            }

        ]
    
    }
}


function validate() {
    
    
}


function submit() {
    
    
}




var main = function (params) {

    var action = params.action;
    
    if ( !action || action =='' ) {
        return {"error":"Missing action parameter"};
    }
    
    switch ( action ) {
            
        case ACTION_LOAD:
            return loadDialog();
        break;
            
        case ACTION_VALIDATE:
            return validate(parms);
        break;
            
        case ACTION_SUBMIT:
            return submit(params);
        break;
  
            
        default:
            return {"error":"No matching action found"};
        break;
    }
};
