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

var secretToken = "098bd785963c894cd9bf0144de30be34ac06eacee88d64be973430d890b1f3b452c439917f94e97c457b6c215c072854e0eb9d547ca76a6af8ce7b8b41be4e87eb8e639e075604d91abeff995b98548044f09aa099e9afc09ed0d07cfb9f2fd9ab364018d0763e1fe1a52b11d5f40701f24497fa9d2d293dc05c7bd628e7e9146b287003fba90b9c23b5a0b946d2714d79eb279037549b98b37439cfd39f1d1f62d614a7ee0564cc9a2cd6e3f7bde63fb90a239293567e64542dd8a398aa7e13ac2fd69864b1add275d61dd1a3546525cf33efc1fd6567df4e3c699f9a905b8c051149bdf501944e0965624e91e4e41ff610018def502a5cfc3f099eaafc18bc88dff0326805025d0b53ba19c11f2cef72f1b37f511b7029b9943d468be9f4990d17338259fa9075a97313537f5d6b438695490e5201f19b4f277fb1e3a8013e96fb7631e5d240466f75acbf2cd7037d95f67735df923d7f9ca333c174e70aea57a8d2a478302691ccaec1626f17145da17bdbd35c8fbf114b3f7f19c4aa905cd427e2b0d02913761f564e3a9a8cd975e9b8b235ee2a14af5f17f86a3b723c1862d860754091f573b7686019a2156837e4ceec2f09a93ba2493d1fe38b21d43a2e0e5be00fd12195a336bae599a739ca36130b4c942e45c2879b21bfb31d84cbe7f6ff4711a397dff9ab6e252959ee49a468a846f59279be66ff13d1575f5f1380ab453b6187c3f3ff95b824f1db6f1aa332923bf8f89795bbced9478cb5bee0f509e4011a5999b97e30daab63d0f5c63778622ee10e856ed44109ed117d1149ae009ddcf0587d2de061940c111b017880d8b6e02552907896d94f7237e2c3a88136b681873db26c499be89e33d61e65eb0aa6021447c6fa6337ce5cc185faec2fdf223323ffbce453a633c0bbff5665f688a8165dc2664b5da6bbd2ace9c1041d676e379181a310bef3981e5225c6246d1b39d0bafc1189c88ce8e834b2e08473582f27ffe93d204930fe535136481f25b9c1b52be63425b255f0defadfff5fbf5c7278843a7b63d8dd31c5b83bb1373406ca1bd3c41193beae1f3a1b0ae76b858cc57e555c3cc4c1b408306ff6ee12144901defd37abeb6cb6908645cff576dee516788fd42f033eb6ef6709d5897b706757b2778cada31c833050d77cd69d233b8bc64a1d980c98b53abb6b5b60fcea3e3ae15863a608a44a33437973893b25cd531f6ccb2df615a7c6cad0e3d068cbd9bb3af6281bdbef2e7165a9d84868fc80b60b77714673dc5d515cf094349061a39d1c9e5b490cd6a3755e34cd9569972f1fe529959cc2310ba9d1a19ce68d6c704bcd21dd2abe5da0f1a68b9db94dd62930f00a806b3b84c32759a91549c9b94e7dd512a77c7b6f534d321326c883b6d2b4d124cf8eef6a1ee76c7ea672c20c5db078ac2db96948ec22fb6f5fc40b7b474221d63830eeb4076c073b18876e798cb6b267fd64bb825f19eeb19389c5acfb33b452189dafee63bc2aa864988727d148c82e209e25d44ff5762ec8273c966c5aea62dd0a28619106506d0345fa2bad510b3c";

/*
END OF AUTH FUNCTIONS
*/





var ACTION_LOAD = "load";
var ACTION_VALIDATE = "validate";
var ACTION_SUBMIT =  "submit";
var ACTION_ENCRYPT = "encrypt";

var bearerToken = ""


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
                    "placeholder":"check out this cool design in Creative Cloud"
                }
            }
        ]
    
    }
}


function validate() {
    
    return {
        "succes":true,
        "vald":true
    }
}


function submit(params) {
    
    var secret = params.api_secret;
    var decToken = decrypt(secretToken, secret);
   // var assetId = "urn:aaid:sc:US:0c77966f-9ddd-47ee-8ebc-1f63befdcbf5";
	var assetId = "auditorium_group1_jpg.jpeg";
    return getColors(assetId,decToken);
    
}

function getColors(assetUrn, token) { 
    
	return request({
		"method":"GET", 
		"uri": "https://cc-api-storage.adobe.io/files/" + assetUrn + "/:metadata", 
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
