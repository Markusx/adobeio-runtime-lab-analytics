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

var secretToken = "098bd785963c894cd9bf0144de30be34ac06eacee88d64be973430d890b1f3b452c439917f94e97c457b6c215c072854e0eb9d547ca76a6af8ce7b8b41be4e87eb8e6398006b72a11abeff9943c557f540f0b0a099e9afc09ed0d07cfb9f2fd9ab364810d0763e1fe1a52b11d5f40701f24497fa9d2d293dc05c7bd628e7e9146b287003fba90b9c23b2a48f44cf095a61fc15d43446ede29c1539f7d182281957d53e92ee2f64cc9a2cd6e3f7bde63fb90a239293567e64542dd8a398aa7e13ac2fd69864b1add275d61dd1a3546525cf33efc1fd6567df4e3c699f9a905b8c051149bdf501944e0965624e91e4e41ff6173b8dfa503a5cff3819d4aafc18bc88dff0326805025d0b53ba19c11f2cef72f1b37f511b7029b9943d468be9f4990d17338259fa9075a97313537f5d6b438695490e5201f19b4f277fb1e3a8013e96fb7631e5d240466f75acbf2cd7037d95f67735df923d7f9ca333c174e70aea57a8d2a478302691ccaec1626f17145da17bdbd35c8fbf114b3f7f19c4aa905cd427e2b0d02913761f564e3a9a8cd975e9b8b235ee2a14af5f17f86a3b723c1862d860754091f573b7686019a2156837e4ceec2f09a93ba2493d1fe38b21d43a2e0e5be00fd12195a336bae599a739ca36130b4c942e45c2879b21bfb31d84cbe7f6ff4711a397dff9ab6e252959ee49a468a846f59279be66ff13d1575f5f1380ab453b6187c3f3ff95b824f1db6f1aa332923bf8f89795bbced9478cb5bee0f509e4011a5999b97e30daab63d0f5c63778622ee10e812cd6411da9126d154dae008996f0587d2de061940c111b017880d8b2a22752843c95c94b7637e2d7e28136b7d9933da66e4a9cf38c30d61f39ff34a24d1447c5a77509da5cc185cca638e5223237c2b8e047a13c9db8f87068f588bc165dc2664b5da6bbd2ace9c1041d676e379181a310bef3981e5225c6246d1b39d0bafc1189c88ce8e834b2e08473582f27ffe93d204930fe535136481f25b9c1b52be63425b255f0defadfff5fbf5c7278843a7b63d8dd31c5b83bb1373406ca1bd3c41193beae1f3a1b0ae740d481c46c715452cfe894357757f8ee3d367767d3c209aed349b39e8a5bc09957dbc93b54aee605000d91ad5d1fd3ab41745d60ad76b5b5c834fc0b34ee7ba38c063faa8e74698030d8977ff3451133daa8427ba05756af32966929162b10d7205cec510a79ab36f56d95c2a9f6f0fd49eef38e4fc92b03e1e52a7544afa8624bffb7e73e6a552443d131780495936dd371b9a634a803432be1b3094214eebf67e11f31f25baba5e6011797f0b885daf75210418020982ece2aaaaab397899441953b33e309ed45478bee7f32862f3dcee55c64b65a94644c3d67461e6815a7f8bbf793c964f7d4a46b39db1e11b254d90a44c265ec04bd754dfa58c57674b3201c755967cc3816fab8411147582188487fc9abdd76ab389489371eb2ec9f83bf94b11eaf5518e7d3b877b73fb30898ea3cf45de50b38c93d8757a12d77ed1838811f03ca0fca0e1a17a733457c0c41f909e342331a"
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
	var assetName = params.additionalData.name;
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
