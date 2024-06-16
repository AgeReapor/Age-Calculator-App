//  Validates a date by checking if the day, month, and year are valid and if the date is in the past.
function validateDate(day, month, year, date) {
    // a error message per input 
    var errorStrings = ['','',''];

    // validate day input
    if (day=='') {
        errorStrings[0] = 'This field is required';
    }
    else if (day < 1 || day > 31) {
        errorStrings[0] = 'Must be a valid day';
    }

    // validate month input
    if (month=='') {
        errorStrings[1] = 'This field is required';
    }
    else if (month < 1 || month > 12) {
        errorStrings[1] = 'Must be a valid month';
    }

    // validate year input
    if (year=='') {
        errorStrings[2] = 'This field is required';
    }

    if (date - Date.now() > 0 || year > new Date().getFullYear()) {
        errorStrings[2] = 'Must be in the past';
    }

    // validate the date
    if (errorStrings[0] == '' && errorStrings[1] == '' && errorStrings[2] == '') {

        // checks if the Date object is invalid
        if (isNaN(date.valueOf())) {
            return ['Must be a valid date','',''];
        }

        // checks when Date constructor corrected invalid dates
        // e.g. April 31 -> May 1
        if (month != date.getMonth() + 1 || day != date.getDate()) {
            return ['Must be a valid date','',''];
        }

        //if no errors, return null
        return null;
    }

    // return the error messages
    return  errorStrings;
}

// Displays the output of the age calculation in the specified HTML elements.
function displayOutput(age){
    //calculate the discrete components of the age
    var age_years = Math.floor(age / 31536000000);
    var age_months = Math.floor((age % 31536000000) / 2628000000);
    var age_days = Math.floor(((age % 31536000000) % 2628000000) / 86400000);
    
    // fetch the html elements that shows the output
    var year_text = document.querySelector('#year-no');
    var month_text = document.querySelector('#month-no');
    var day_text = document.querySelector('#day-no');

    // update the age in the html attribute "target"
    year_text.setAttribute('target', age_years);
    month_text.setAttribute('target', age_months);
    day_text.setAttribute('target', age_days);
    
    // update the age in the html element
    counterAnimation(year_text);
    counterAnimation(month_text);
    counterAnimation(day_text);
}

// Animates the counter value from the current value to the target value in the specified HTML element.
function counterAnimation(text_tag, duration = 1000, reset = false) {

    // get the current value from the current attribute
    var current_val = parseInt(text_tag.getAttribute('current'));

    // get the target value from the target attribute
    var target_val = parseInt(text_tag.getAttribute('target'));

    // end if thecurrent value is already the same as the target value
    if (current_val == target_val) {
        if (reset) {
            text_tag.innerHTML='- -';
        } else if (text_tag.value == '- -') {
            text_tag.innerHTML = '0';
        }
        return;
    }
    
    // set the done attribute to zero
    text_tag.setAttribute('done', 0);


    // get the increment/decrement value
    var increment_in_val = target_val > current_val ? 1 : -1;
    var increment_duration = duration / Math.abs(target_val - current_val);


    // start the animation
    var counter = setInterval(function () {
        
        
        // if the target value is reached, stop the animation
        if (current_val == target_val) {
            // set the done attribute to 1
            text_tag.setAttribute('done', 1);
            clearInterval(counter);

            if (reset) {
                text_tag.innerHTML='- -';
            }
            return;
        }

        // if the distance is far away, increase the change of the value
        if (Math.abs(current_val - target_val) > 100) {
            current_val += 13*increment_in_val;
        }
        else if (Math.abs(current_val - target_val) > 10) {
            current_val += 3*increment_in_val;
        }else{
            current_val+=increment_in_val;
        }
    

        // update the current value
        text_tag.setAttribute('current', current_val);

        // update the text
        text_tag.innerHTML = current_val;

    }, increment_duration);

}

// Resets the target value of the given text tag to 0 and starts a counter animation.
function resetToZero(text_tag){
    text_tag.setAttribute('target', 0);
    counterAnimation(text_tag,500,true);
}

// Retrieves date values from a form submission, validates the date, and calculates the age.
function getDateData(e){

    // prevent default submission behaviour which reloads the page 
    e.preventDefault();

    // get the values from the form
    var day = document.querySelector('input[name="day"]').value;
    var month = document.querySelector('input[name="month"]').value;
    var year = document.querySelector('input[name="year"]').value;

    // convert the values to a Date object using a datestring
    var dateString = "0000".substring(0, 4 - year.length) + year;
    dateString += "-" + "00".substring(0, 2 - month.length) + month;
    dateString += "-" + "00".substring(0, 2 - day.length) + day;
    dateString += "T00:00:00";
    var birthdate = new Date(dateString);
    
    // validate the date
    var errorStrings = validateDate(day, month, year, birthdate);

    // if date is invalid
    if(errorStrings){
        // get the error tags
        var day_error = document.querySelector('#day-error');
        var month_error = document.querySelector('#month-error');
        var year_error = document.querySelector('#year-error');
        
        // display the error messages
        day_error.innerHTML = errorStrings[0];
        month_error.innerHTML = errorStrings[1];
        year_error.innerHTML = errorStrings[2];

        // color the inputs
        document.querySelectorAll('input').forEach(error => error.style.borderColor = 'red');
        document.querySelectorAll('h4').forEach(error => error.style.color = 'red');

        // reset the output messages
        resetToZero(document.querySelector('#year-no'));
        resetToZero(document.querySelector('#month-no'));
        resetToZero(document.querySelector('#day-no'));

        return;
    }
    
    // if date is valid, reset the error messages
    document.querySelector('#day-error').innerHTML = '';
    document.querySelector('#month-error').innerHTML = '';
    document.querySelector('#year-error').innerHTML = '';

    // restore the color of the inputs
    document.querySelectorAll('input').forEach(error => error.style.borderColor = '');
    document.querySelectorAll('h4').forEach(error => error.style.color = '');

    // calculate the age
    var age = Date.now() - birthdate;
    
    // display the output
    displayOutput(age);
}

// Adds leading zeros to the input value if it is a number and the length is less than the specified length.
function fixLeadingZeros(input, input_length){
    if(isNaN(input.value) || input.value=="") return;

    if(input.value.length > input_length){
        input.value = Number(input.value);
    }

    if(input.value.length < input_length){
        input.value = '0'.repeat(input_length - input.value.length) + input.value;
    }

}
