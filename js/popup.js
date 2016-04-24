//from http://www.formget.com/how-to-create-pop-up-contact-form-using-javascript/

//Function to Hide Popup for multiple user entry
function div_hide(){

    document.getElementById('popupWindowDiv').style.display = "none";
    
    //reset entry fields as blank
    document.getElementById('popupUser1').value = "";
    document.getElementById('popupUser2').value = "";
    document.getElementById('popupUser3').value = "";
    
    return false;
}

//take the data from the popup form, package it, and send it to the server to pass
//to sketch1b.
//from https://www.boutell.com/newfaq/creating/scriptpass.html
function packDataForPHP(userInput)
{
  // Initialize packed or we get the word 'undefined'
  var packed = "";
  for (i = 0; (i < userInput.length); i++) {
      if(userInput[i]){
        if (i > 0) {
          packed += ",";
        }
        packed += escape(userInput[i]);
      }
  }
    
  return 'data=' + packed;

}