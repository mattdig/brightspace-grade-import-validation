// onload
window.onload = function () {

    let dropzone = document.getElementById('file_upload');

    ['drag', 'dragstart', 'dragend', 'dragover', 'dragenter', 'dragleave', 'drop'].forEach(function (event) {
        dropzone.addEventListener(event, function (e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    dropzone.addEventListener('drop', dropFile);

    document.getElementById('inputfile__button').onclick = function () {
        document.getElementById('inputfile').click();
    };
}

function dropFile(ev) {

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

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

    if (!file) {
        file = document.getElementById("inputfile").files[0];
    }

    if (file != "undefined" && file.type == "text/csv") {
        console.log("CSV file detected");

        $("#file_name").text(file.name);

        validateCSV(file);

    } else {
        console.log('not a CSV file');
        $("#file_name").text("This is not a CSV file. Please upload a CSV file to convert.");
    }

}



function validateCSV(file) {

    // one of these must be present
    let mandatory_fields = [
        'OrgDefinedId',
        'Username'
    ];

    // grades must end in these strings
    let grade_types = [
        'Points Grade',
        'Grade Symbol',
        'Text Grade'
    ];

    let final_grades = [
        'Adjusted Final Grade Numerator',
        'Adjusted Final Grade Denominator'
    ];

    let last_column = 'End-of-Line Indicator';

    let end_of_line_indicator = '#';

    let reader = new FileReader();
    reader.readAsText(file);

    reader.onload = function (e) {

        let text = e.target.result;

        let csv = CSV.parse(text);

        let headers = csv[0];

        let mand_fields_found = 0;

        let errors = [];


        // column order should be a, b, c, d
        // a = mandatory fields
        // b = grades
        // c = final grade numerator/denominator
        // d = last column
        let column_order = [];

        for (const [index, col] of headers.entries()) {

            let char = String.fromCharCode(65 + index);

            if (index < headers.length - 1) {

                if (mandatory_fields.includes(col)) {
                
                    mand_fields_found++;
                    column_order.push('a');
                
                } else {

                    let is_grade = false;

                    for (const string of grade_types) {
                        if (col.endsWith(string)) {
                            is_grade = true;
                            column_order.push('b');
                            console.log(`Grade type found in Column ${char}`);
                        }
                    }

                    if (!is_grade) {
                        if (final_grades.includes(col)) {
                            is_grade = true;
                            column_order.push('c');
                            console.log(`Grade type found in Column ${char}`);
                        }
                    }

                    if (!is_grade) {
                        // Column index starting at A
                        errors.push('Column ' + char + ' has an invalid title');
                        column_order.push('x');
                    }
                }

            } else {
                if (col != last_column) {
                    errors.push('Last column must be "' + last_column + '"');
                } else {
                    column_order.push('d');
                    console.log(`Last column in Column ${char}`);
                }
            }

        }

        if (mand_fields_found == 0) {
            errors.push('No student idenfier columns found, at least ' + mandatory_fields.join(' or ') + ' is required');
        } else if (mand_fields_found > mandatory_fields.length) {
            errors.push('Too many student identifier columns found, only ' + mandatory_fields.join(' or ') + ' is required');
        }

        if (!column_order.includes('b')) {
            errors.push('No grades were found');
        }

        let sorted_columns = column_order.slice(0, column_order.length - 1).sort();

        if (sorted_columns != column_order) {
            errors.push('Columns are not in the correct order');
        }

        let data = csv.slice(1);

        for (const [index, row] of data.entries()) {
            if (row[row.length - 1] != end_of_line_indicator) {
                errors.push('Row ' + (index + 2) + ' does not end with "' + end_of_line_indicator + '"');
            }
        }

        let output = document.getElementById('output');

        if (errors.length > 0)
            output.innerHTML = '<h2>The following problems were found in your CSV file:</h2><ul><li>' + errors.join("</li><li>") + '</li></ul>';
        else
            output.innerHTML = 'Your CSV is valid and ready to be imported.';


    }

    return false;
}
