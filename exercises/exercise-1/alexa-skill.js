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

/* 
START OF AUTH FUNCTIONS
*/

var request = require('request-promise');
var crypto = require('crypto');
var api_key = "74c110893e934f30a95adb79046260c9"

var algorithm = 'aes-256-ctr';

function encrypt(text, password){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text, password){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

function keyEncrypt(params) {
    var token = params.token;
    var secret = params.api_secret;
    
    return { "encrypted": encrypt(token, secret) };
}

var secretToken = "098bd785963c894cd9bf0144de30be34ac06eacee88d64be973430d890b1f3b452c439917f94e97c457b6c215c072854e0eb9d547ca76a6af8ce7b8b41be4e87eb8e639e077a26c51abeff995b98548044f09aa099e9afc09ed0d07cfb9f2fd9ab364018d0763e1fe1a52b11d5f40701f24497fa9d2d293dc05c7bd628e7e9146b287003fba90b9c23b3cbc45ebb624f7fa330d62b31f5fa9b1707c8d692126f48b300a0e20a64cc9a2cd6e3f7bde63fb90a239293567e64542dd8a398aa7e13ac2fd69864b1add275d61dd1a3546525cf33efc1fd6567df4e3c699f9a905b8c051149bdf501944e0965624e91e4e41ff6100690f9503a59fe151a8daafc18bc88dff0326805025d0b53ba19c11f2cef72f1b37f511b7029b9943d468be9f4990d17338259fa9075a97313537f5d6b438695490e5201f19b4f277fb1e3a8013e96fb7631e5d240466f75acbf2cd7037d95f67735df923d7f9ca333c174e70aea57a8d2a478302691ccaec1626f17145da17bdbd35c8fbf114b3f7f19c4aa905cd427e2b0d02913761f564e3a9a8cd975e9b8b235ee2a14af5f17f86a3b723c1862d860754091f573b7686019a2156837e4ceec2f09a93ba2493d1fe38b21d43a2e0e5be00fd12195a336bae599a739ca36130b4c942e45c2879b21bfb31d84cbe7f6ff4711a397dff9ab6e252959ee49a468a846f59279be66ff13d1575f5f1380ab453b6187c3f3ff95b824f1db6f1aa332923bf8f89795bbced9478cb5bee0f509e4011a5999b97e30daab63d0f5c63778622ee10e856ed44133ef127d0903ad3e91daf0727d2de061940c111b017880d8b6e02552aa7a95d9573834dccfae811cb7d89010906e49b5d58f24d61e62ea24ba401447c6fc750ace5cd785e9b03bdf236d37f8bbb847b62f89acc27f79e0b6bc165dc2664b5da6bbd2ace9c1041d676e379181a310bef3981e5225c6246d1b39d0bafc1189c88ce8e834b2e08473582f27ffe93d204930fe535136481f25b9c1b52be63425b255f0defadfff5fbf5c7278843a7b63d8dd31c5b83bb1373406ca1bd3c41193beae1f3a1b0ae7448f99d74956506dc3c7b13a3a4df6c5113a5d14f0d42691c66bc9cebe5ebee178b9e3383fefc230340388e86a1dd6bf42537072cc6ea18eb122fe0834f338bfa01706b1b84c54d91fcee405ce643845f6c7595ac065619c25916b15437d43b03a7fce51170ce32aca15b0ebcfcfe6f655fc9f8e65f9407ea7dd0e577fd2a46539d6a8803066594652b10c411dd8b41ee95bf98102de725723c4a8594c49cfc762831b2af97beb8ef7712180f3ca82fcb769105ee1059f21dd77aef69299feba0dd71a35c518f6104488dd01278a0a16f2fa584fd70a8743677d7050273329f98d9dde9eff5bdaa6a77538cc335abd50a61710f52f873fa66b46cd42ed4b6290115c7e7620dd6e02c4dc3f080d3c35d04d6ef38ed971fd319da454158784ddb6b68ffb369a741c9bcbde1f816ff717be89128106f52127c17daf49d22909de265d941267e56fdc093f73ab1770363877b709a473103c"
/*
END OF AUTH FUNCTIONS
*/


var ACTION_LOAD = "load";
var ACTION_VALIDATE = "validate";
var ACTION_SUBMIT =  "submit";
var ACTION_ENCRYPT = "encrypt";

function loadDialog() {
    
    return {
        "type":"dialog",
        "properties":{
            "headerText":"Post to Microsoft Teams",
            "bodyText":"",
            "buttonOkayText":"SUBMIT"
        },

        "children": [   
            {
                "type":"textarea",
                "properties":{
                    "label":"Message",
                    "text":"Message",
                    "placeholder":"check out this cool design in Creative Cloud",
                    "propertyName":"message"
                }
            }
        ]
    
    }
}


function validate() {
    
    return {
        "success":true,
        "valid":true
    }
}


function submit(params) {
    
    var secret = params.api_secret;
    var decToken = decrypt(secretToken, secret);
   // var assetName = params.
	var assetName = params.additionalData;
    return getMetadata(assetName,decToken);
    
}

function getMetadata(assetName, token) { 
    
	return request({
		"method":"GET", 
		"uri": "https://cc-api-storage.adobe.io/files/" + assetName + "/:metadata", 
		"headers": {"x-api-key": api_key, "Authorization":"Bearer "+token, "metadata":":metadata", "Accept": "application/vnd.adobe.file+json" }
        }).then(function(body) {
			return {body:body};
		});
}


var main = function (params) {

    var action = params.action;
    var secret = params.api_secret;
    
    

    if ( !action || action =='' ) {
        return {"error":"Missing action parameter"};
    }
	
    if ( !secret || secret =='' ) {
        return {"error":"Missing api_secret parameter"};
    }
    
		
    
    switch ( action ) {
            
        case ACTION_LOAD:
            return loadDialog(params);
        break;
            
        case ACTION_VALIDATE:
            return validate(params);
        break;
            
        case ACTION_SUBMIT:
            return submit(params);
        break;
  
        case ACTION_ENCRYPT:
            return keyEncrypt(params);
        break;
            
        default:
            return {"error":"No matching action found"};
        break;
    }
};
