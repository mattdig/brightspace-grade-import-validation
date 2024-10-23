// onload
window.onload = function() {
    document.addEventListener('drop', function(e) { e.preventDefault(); }, false);
    window.addEventListener("dragover",null)
    window.addEventListener("drop",null)
    console.log("onload");
    document.getElementById('inputfile__button').onclick = function() {
        document.getElementById('inputfile').click();
    };
}

function uploadFile(ev) {
    console.log("File(s) dropped");
  
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();
  
    $("#file_name").text(ev.dataTransfer.files[0].name);

    verifyCSV(ev.dataTransfer.files[0]);

    // if (ev.dataTransfer.items) {
    //   // Use DataTransferItemList interface to access the file(s)
    //   [...ev.dataTransfer.items].forEach((item, i) => {
    //     // If dropped items aren't files, reject them
    //     if (item.kind === "file") {
    //       const file = item.getAsFile();
    //       console.log(`… file[${i}].name = ${file.name}`);
    //     }
    //   });
    // } else {
    //   // Use DataTransfer interface to access the file(s)
    //   [...ev.dataTransfer.files].forEach((file, i) => {
    //     console.log(`… file[${i}].name = ${file.name}`);
    //   });
    // }
  }

  function verifyCSV(file) {

    if (file != "undefined" && file.type == "text/csv") {
      console.log("CSV file detected");
      //convertCSVFile(file);
    } else {
      console.log("This is not a CSV file. Please upload a CSV file to convert.");
    }
    
  }