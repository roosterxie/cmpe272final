
// Userlist data array for filling in info box
var classListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    var CL = $('#classList');
    CL.find('table').find('tbody').on('click', 'td a.linkshowclass', showClassInfo);

    $('#btnAddClass').on('click', addClass);

    CL.find('table').find('tbody').on('click', 'td a.linkdeleteclass', deleteClass);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/users/classlist', function( data ) {
        classListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowclass" rel="' + this._id + '">' + this.department + this.class_number+'</a></td>';
            tableContent += '<td>' + this.teacher + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteclass" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#classList').find('table').find('tbody').html(tableContent);
    });
}

function showClassInfo(event){
    event.preventDefault();

    var thisClassName = $(this).attr('rel');

    var arrayPosition = classListData.map(function(arrayItem){return arrayItem._id;}).indexOf(thisClassName);

    var thisClassObject = classListData[arrayPosition];

    //Populate Info Box
    $('#classInfoDepartment').text(thisClassObject.department);
    $('#classInfoNumber').text(thisClassObject.class_number);
    $('#classInfoTeacher').text(thisClassObject.teacher);
    $('#classInfoGrade').text(thisClassObject.grade);
    $('#classInfoGPA').text(thisClassObject.gpa);
}

function addClass(event){
    event.preventDefault();
    var addC = $('#addClass');
    var errorCount = 0;
    addC.find('input').each(function(index, val){
        if($(this).val()=== ''){ errorCount++; }
    });

    if(errorCount === 0){
        var field = addC.find('fieldset');
        var newClass = {
            'email':$("#haha").text(),
            'department': field.find('input#inputClassDepartment').val(),
            'class_number': field.find('input#inputClassNumber').val(),
            'teacher': field.find('input#inputClassTeacher').val(),
            'grade': field.find('input#inputClassGrade').val(),
            'gpa': field.find('input#inputClassGpa').val()
        };
        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newClass,
            url: '/users/addclass',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.msg === '') {

                // Clear the form inputs
                field.find('input').val('');

                // Update the table
                populateTable();
            }
            else {
                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);
            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
}

function deleteClass(event){

    event.preventDefault();

    //opp up a confirmation diaog
    var confirmation = confirm('Are you sure you want to delete this class record?');

    //check and make sure the user confirmed
    if (confirmation === true){

        $.ajax({
            type:'DELETE',
            url: '/users/deleteclass/' + $(this).attr('rel')
        }).done(function(response){

            //check for a successful (blank) response
            if (response.msg === ''){
            }else{
                alert('Error: ' + response.msg);
            }

            //update the table
            populateTable();
        })
    }else{
        //not to confirm, skip
        return false;
    }
}