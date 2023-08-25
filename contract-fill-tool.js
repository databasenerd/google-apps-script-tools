/**
**  Contract Fill Tool
**  by David Gironda, Jr.
**  This tool will fill in variables on a google doc contract, create a folder for the client, and copy their contract into their folder 
**/

//Allows code to run in Apps Script editor
try {
  var ui = DocumentApp.getUi();
} catch (err){
  console.log(err);
}

//Create menu item in Document
function onOpen() {
  ui.createMenu("DBN")
    .addItem("Fill in agreement", "contractFiller")
    .addToUi();
}

function contractFiller(){
  //Prompt for text replacement variables
  var client = ui.prompt("Client's name").getResponseText();
  var startDate = ui.prompt("Start date").getResponseText();
  var rate = ui.prompt("Rate").getResponseText();

  console.log(client);
  console.log(startDate);
  console.log(rate);

  var adminFolder = DriveApp.getFolderById("[YOUR FOLDER ID]"); //Root client folder
  var clientFolder = adminFolder.createFolder(client); //Create folder for new client
  var copyDoc = DriveApp.getFileById("[CONTRACT FILE ID]").makeCopy().setName(client + " - Contract").moveTo(clientFolder); //Copy Contract Template into new client folder
  var clientDoc = DocumentApp.openById(copyDoc.getId()); //Verify that we are working with the new document
  var body = clientDoc.getBody(); //Get document text and replace the following variables below
  body.replaceText("{{Client's Name}}", client);
  body.replaceText("{{start date}}", startDate);
  body.replaceText("{{rate}}", rate);
  clientDoc.saveAndClose();
  
}
