/**
**  Contract Fill Tool
**  by David Gironda, Jr.
**  This tool will fill in variables on a google doc contract, create a folder for the client, and copy their contract into their folder 
**/

try {
  var ui = DocumentApp.getUi();
} catch (err){
  console.log(err);
}

function onOpen() {
  ui.createMenu("DBN")
    .addItem("Fill in agreement", "contractFiller")
    .addToUi();
}

function contractFiller(){
  var client = ui.prompt("Client's name").getResponseText();
  var startDate = ui.prompt("Start date").getResponseText();
  var rate = ui.prompt("Rate").getResponseText();

  console.log(client);
  console.log(startDate);
  console.log(rate);

  var adminFolder = DriveApp.getFolderById("[YOUR FOLDER ID]");
  var clientFolder = adminFolder.createFolder(client);
  var copyDoc = DriveApp.getFileById("[CONTRACT FILE ID]").makeCopy().setName(client + " - Contract").moveTo(clientFolder);
  var clientDoc = DocumentApp.openById(copyDoc.getId());
  var body = clientDoc.getBody();
  body.replaceText("{{Client's Name}}", client);
  body.replaceText("{{start date}}", startDate);
  body.replaceText("{{rate}}", rate);
  clientDoc.saveAndClose();
  
}
