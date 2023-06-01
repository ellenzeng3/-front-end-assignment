const MYFORM = document.getElementById("formID");
MYFORM.setAttribute("novalidate", true);

document.addEventListener('DOMContentLoaded', function () {
    // GET request 
    fetch('https://mocki.io/v1/84954ef5-462f-462a-b692-6531e75c220d')
        .then(response => response.json())
        .then(schema => createForm(schema, MYFORM))
        .catch(error => {
            console.log('Error:', error);
        });

    MYFORM.addEventListener('submit', submit);

})

// difference between innerHTML and textContent? 
// a little unclear abt labels and legends and 
// whether I needed a fieldset
// efficient use of if-else?

function createForm(schema, MYFORM) {

    // for each question, create a div and input 
    for (let element of schema) {

        let div = document.createElement("div");
        let input = document.createElement("input");

        if (element.label) {

            // would individually setting attributes be more efficient 
            // than having to check for "required" 
            for (let key in element) {

                input.setAttribute(key, element[key]);

                if (key == "required" && element[key] == 0) {
                    input.removeAttribute("required");
                }
            }

            let label = document.createElement("label");
            label.innerHTML = element.label;

            div.appendChild(label);
            div.appendChild(input);
            MYFORM.appendChild(div);

        } else { // radio question

            // fieldsets go with legends?
            let fieldset = document.createElement("fieldset");
            let legend = document.createElement("legend");
            legend.innerHTML = element.legend;

            fieldset.appendChild(legend);
            div.appendChild(fieldset);
            MYFORM.appendChild(div);

            // create radio options 
            var options = element.options;
            options.forEach(option => {

                // is there a better way to do this - feels hardcoded
                let radioInput = document.createElement("input");
                radioInput.type = element.type;
                radioInput.name = element.name;
                radioInput.required = element.required;

                for (let key in option) {
                    radioInput.setAttribute(key, option[key])
                }

                let radioLabel = document.createElement("label");
                radioLabel.innerHTML = option.label;
                fieldset.appendChild(radioLabel);
                fieldset.appendChild(radioInput);

            })
        }
    }

    // create submit button
    var submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Submit";
    div = document.createElement("div");
    div.appendChild(submitButton);
    MYFORM.appendChild(div);
    console.log(MYFORM);

}

// validate every field
MYFORM.addEventListener("blur", function (event) {

    // each field is an input 
    var field = event.target;

    // returns error message or nothing
    var error = hasError(field);

    if (error) {
        field.setCustomValidity(error);
        field.setAttribute("aria-invalid", "true");
        field.setAttribute("aria-describedby", field.id + "-error");

    } else {
        field.setCustomValidity("");
        field.setAttribute("aria-invalid", "false");
        field.removeAttribute('aria-describedby');
    }

    field.reportValidity();

}, true);


var hasError = function (field) {

    var validity = field.validity;

    if (validity.valid) return;

    if (validity.valueMissing) return "Please fill out this field.";

    // typeMismatch doesn't pick up on 'text'?
    if (validity.typeMismatch) {
        if (field.type === "email") return "Please enter an email address.";
        else if (field.type === "tel") return "Please enter a phone number.";
        else {
            return "Please use the correct input type."
        }
    }

    if (validity.patternMismatch) {
        if (field.type == "tel") return "Please enter a phone number without hypens or spaces.";
    }
    // else statement keeps breaking 
}

function submit(e) {

    // prevent automatic submit
    e.preventDefault();

    const FORMDATA = new FormData(MYFORM);
    var isValid = MYFORM.reportValidity();

    if (isValid) {
        var formContents = [];

        // arrays = stack/queue
        for (let pair of FORMDATA.entries()) {
            formContents.push({ name: pair[0], value: pair[1] });
        }
        var requestBody = JSON.stringify(formContents);

        // Send the form data as a JSON object
        fetch("https://0211560d-577a-407d-94ab-dc0383c943e0.mock.pstmn.io/submitform", {
            method: "POST",
            body: requestBody,
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    }
}


