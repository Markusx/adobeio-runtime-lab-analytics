import "torq/utils/Disposable";
import "../constants/Constants";

export default class ConfigurableDialogController extends Disposable {

    @Observable static defaults = {
        remoteUrl:"https://runtime-preview.adobe.io/github.com/Markusx/adobeio-runtime-lab-analytics/master/alexa-skill/adobe-analytics-skill"
    }

    //Dialog definition loaded successfully and ready to be displyed
    @Observable ready = false;
    
    //DialogProperties = definition for the dialog itself. Header, Footer, Button, etc.
    @Observable dialogProperties = {};
     
    //Form Fields/layout definitions
    @Observable children = [];
    
    //Config options (defaults to 'defaults'
    @Observable internalConfig = {};
    
    //results object of load dialog 
    results = {};
    
    //components / field values registered to be collected when form is submitted, must extend BaseComponent 
    registeredComponents = [];
    
    //additional data passed in from the site.  
    additionalData = {};

    constructor(options) {
        
        super();
        
        if ( !options ) {
            options = {};
        }

        this.internalConfig.remoteUrl = options.remoteUrl || ConfigurableDialogController.defaults.remoteUrl; 
        console.log("Loading config from:" + this.internalConfig.remoteUrl);
        
        this.loadDialog();
    }

    registerComponent(component) {
        this.registeredComponents.push(component);
    }

    //Create the body data of the dialog, including additional data being passed in
    createDialogBodyData() {

        var data = {};
        data["action"] = "submit";
        data["dialogData"] = this.gatherDialogComponentData();
        data["additionalData"] = this.gatherAdditionalData();
        return data;
    }

    //Pass in additional data from the page itself
    //change to actual setters and getters and remove gatherAddtionalData?
    // 
    appendAdditionalData(data) {
        Object.assign(this.additionalData, data);
    }

    gatherAdditionalData() {
        return this.additionalData;
    }

    gatherDialogComponentData() {
        var data = [] ;
        for ( var i=0; i < this.registeredComponents.length; i++ ) {
            var cmp = this.registeredComponents[i];
            console.log("Field data: ", cmp.fieldData() );
            data.push( cmp.fieldData() );
        }
        return data;
    }

    //Load dialog definition
    loadDialog() {
        
        var self = this;
        var newRequest = new XMLHttpRequest();
        
        newRequest.open("GET",this.internalConfig.remoteUrl + "?action="+Constants.ACTION_LOAD, true);
        
        newRequest.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                self.results = JSON.parse(this.responseText);
                self.dialogProperties = self.results.properties;
                self.children = self.results.children;
                self.ready = true;
            }
        }

        newRequest.send();
    }


    //Validate all fields + other properties of dialog
    validateDialog() {
        
        //make a generic request function?
        var newRequest = new XMLHttpRequest();
        newRequest.open("GET",this.internalConfig.remoteUrl + "?action="+Constants.ACTION_VALIDATE, true);
        newRequest.onreadystatechange = function() {
            
            if (this.readyState == 4 && this.status == 200) {
                console.log("validation status ", JSON.parse(this.responseText) );
            }
            
        }
        newRequest.send();
    }


    //Gather all field data, append any additional data, submit to service
    submitDialog() {
    
      var b = JSON.stringify( this.createDialogBodyData() );
      console.log("POSTing with :", b);

      var opts = { 
        method: "POST",
        body: JSON.stringify( this.createDialogBodyData() )
      };
    
      fetch(this.internalConfig.remoteUrl, opts).then(function(res) {
        console.log(res);
        res.json().then(function(data) {  
            console.log(data);  
        });        
      }).catch(function(err){
        console.log(err);  
      });  
      
    }
}
