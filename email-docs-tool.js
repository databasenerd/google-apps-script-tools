/**
**  Email Docs Tool
**  by David Gironda, Jr.
**  This tool will check for any emails labeled "docs" and put it into the folder with the [ADDRESS] and any subfolders within {curly brackets}
**  Example: 123 E Someplace Dr - Residential Purchase Agreement {5 - The Purchase}
**  will place the attachement to the email under the subfolder "5 - The Purchase" of "123 E Someplace Dr" with the filename of "123 E Someplace Dr - Residental Purchase Agreement.pdf"
**/

function checkForDocs() { // File names will always have to be "[ADDRESS] - [CAR FORM]"
  var label = GmailApp.getUserLabelByName("docs");
  var threads = label.getThreads();

  threads.forEach(function(e){
    console.log("Found new docs request");
    var subject = e.getFirstMessageSubject();
    var targetFolder = "";
   
    //check to see if subject contains folder
    if (subject.includes("{")){
      targetFolder = subject.split("{")[1].split("}")[0];
      subject = subject.split(" {")[0];
    }

    if (subject.includes("Signature Request Completed: Please Sign: ")){ // Glide check
      var address = subject.split("Please Sign: ")[1].split(" - ")[0];
      var fileName = subject.split("Please Sign: ")[1];
    }else{ //Everything else check
      var address = subject.split(" - ")[0];
      var fileName = subject;
    }

    var lastMessage = e.getMessageCount() -1;

    var pdf = e.getMessages()[lastMessage].getAttachments()[0].setName(fileName);

    //Find the property folder
    var currentBuyers = DriveApp.getFolderById("[FOLDER ID]"); //REPLACE FOLDER ID
    var propertyFolder = (currentBuyers.searchFolders('title contains "'+address+'"').hasNext()) ? currentBuyers.searchFolders('title contains "'+address+'"').next() : "";

    if (targetFolder !== ""){
      propertyFolder = propertyFolder.getFoldersByName(targetFolder).next();
    }
    console.log("Copying file to Google Drive");
    var copy = propertyFolder.createFile(pdf);

    //reply to all with link of file.
    var options = {from: "[YOUR EMAIL]", name:"[YOUR NAME]"}; //change from and name to your email settings
    var html = '<p><a href="';
    html += copy.getUrl();
    html += '"">';
    html += copy.getName();
    html += '</a> has been uploaded to <a href="';
    html += propertyFolder.getUrl();
    html += '"">';
    html += propertyFolder.getName();
    html += '</a>.</p>';

    options.htmlBody = html;

    var email = e.createDraftReplyAll("",options);
    console.log("Sending email");
    email.send();

    //remove labels
    e.removeLabel(label).refresh();
    console.log("Complete");

    //reply with link to file

  });


}
