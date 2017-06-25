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
    var secret = params.secret;
    
    return { "encrypted": encrypt(token, secret) };
}

var secretToken = "2e97fcc3bd16fc40ef9c7f7ae43d991da721dfd4fc9476b09f2278ec8ba8d1bd629d08ae5bb7c36c764b565e782d115ad4c8fe2f59830e09f7e203af75f729d4dba844972b4974d93b9fea8d51fb40e545c19aacf9fddad499c4a568ec983ec6ac2d7c02d5465477e7a75d78c8ad4938ff2ce3dabb330a14fa495fed23c0dc0e7a0c7308cf953ae303af9bae6bc30e7240fd4cc22869f5e4bc7118e9c4b34b7f50973bb1ef2936affa35eef1fb968915b01b1abd9c575557430ef7f182be41198822a790708db9ad60ff1db08451060eeb22b4f5e47058a14b2d5a938f8238ab26365ea6f010ab642d5e196ab3fede60d24b149bf34e4924dc1b27bea7d01798bcbcc40d62353e5776748638dc0d7cc941ee9d605a652004b6af4d7a9693fbad384f05ea56c5b06e9e62672f594b487589e1371c6868cba8312146bf89a93814bc825006ebd71354395284d61ab54a6d9bc93f3cd2ec1a6c819c37ed51d83cfd48f6c8b34f1b6dbc9df0fa415878374bcb0797e1698e9f3a205d4510f2a7b175e147bcb9ea3d5a644f0e7c2e90dbe77bddd0fd0cda233e8f0878b45c1e63030d56a2747f4d90d76190576435872a5e20fb90f6383e82708f183c53cabc41ec2a20056ecc1bf11c9cf23886d990841599240a0352a03f4ded8dd11580be7d99a2b6d5df772d88dfc6cdba3c343313da7cab639f66a6844f8e31fa3fc35652791da5cd6017528f90a1a99b8f2cfbaa11179909cb1de985bdc69b96cb6edcc5e8d0d432de084b53a69d593de6a356b4db923944661f9e1ce412f16a39930b566936a405a8a2d4424c10c36f802921381d58a0e08c9c0079a0068cf2370d3de7f6d6a52cffa7b7098f126ac1caa94ce6591cf10780781b23ecd95004ed64cc83c29332e7670003cf9a8e5afc5ea8c7d8055ffb81ca327bc81c3542ab90f2a6c99e081c724c14a1b68433b18ea0326b59ea09172038d8d2f20cb7c0a3cbde0febae95497b0a7287ba2a706e3d896d76153b262891c19136953b1c8175acb79095e36ea1032d49e7655a46ebea0ae4ef1c8b2a0e13834ee4d4319da0fd6b093b3fa57ad68add5d4c1f41eec68f3e197fc3c539365f398bd51b97ef2b83bfaa67959c52eec6077ba4db53063ab3ad1a52baad3c4f724bc508a688cd2dcd2952d013caae4303a3b760649d17c6e92cdc4d0f67eff33573e6754ab72c966614441e4cd51f7cdd4f1977d45ca1119dc9cef2ccf063c0f19070d92271a2c0737c5ac889636bc9b9e9045f5c4670b6204932ed9066f45cfdc715b9581608e296727614e9c632a1271ded2d85fae01a3a8ffcc3a6a0b452453cf213f628c84ba9a0a4b182a600f91d3f9341f37332ade82e26f0313ee8a5125cd03d9d6e5e217e383e302ddb8be3e78ce53ef19ecf4128da19648c6fd61468e42c8108b96a5ed678925143c355597b741d8e3718e6dd370b14033bf77e7a8b96bf13d965a0f87d35b7b3d0bde9aa862a955734cdf7cb7cda2ca1039eb533d774d22f0eb002856af27870d12e39dc0b65ee2cda25105c9c3e70371c43a3248f472335b2b4764a935fbd"


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
    
    var secret = params.secret;
    var decToken = decrypt(secretToken, secret);
    var assetId = "urn:aaid:sc:US:0c77966f-9ddd-47ee-8ebc-1f63befdcbf5";
    return {asset:assetId,token:decToken};
    return getColors(assetId,decToken);
    
}

function getColors(assetUrn, token) { 
    
	return request({
		"method":"GET", 
		"uri": "https://cc-api-storage.adobe.io/id/" + assetUrn + "/:metadata", 
		"headers": {"x-api-key": api_key, "Authorization":token, "Accept": "application/vnd.adobe.file+json"}, 
		"json": true}).then(function(body) {
			return {"colors": body};
		});
}


var main = function (params) {

    var action = params.action;
    
    if ( !action || action =='' ) {
        return {"error":"Missing action parameter"};
    }
    
    switch ( action ) {
            
        case ACTION_LOAD:
            return loadDialog(params);
        break;
            
        case ACTION_VALIDATE:
            return validate(parms);
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
