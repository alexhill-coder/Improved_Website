// Functional Website Project. These variables will contain the id of the like/review buttons & objects that will hold
// the information needed to alter/create the different details of each item selected. 
let liked = [];
let saved = [];
let reviewData = [];
let selectedWork = ""; 

// Contains all the functions that are needed to run when a page is first loaded.
function myLoad() {

    // If this the first time the website has been accessed the following statement will run.
    // This will create/assign a session storage for each variable and create another session 
    // to let the program know that it is no longer the first time. 
    if (sessionStorage.getItem("hasCodeRunBefore") === null) {
        sessionStorage.setItem("itemLiked", JSON.stringify(liked));
        sessionStorage.setItem("itemSaved", JSON.stringify(saved));
        sessionStorage.setItem("itemreview", JSON.stringify(reviewData));
        sessionStorage.setItem("itemSelected", JSON.stringify(selectedWork));

        // Creates a storage session to show that this is not the first time it has been run.
        sessionStorage.setItem("hasCodeRunBefore", true);
    }
    // If it isn't the first time accessing this website the session storages are called and 
    // assigns the variables back their data.  
    else {
        liked = JSON.parse(sessionStorage.getItem("itemLiked"));
        saved = JSON.parse(sessionStorage.getItem("itemSaved"));
        reviewData = JSON.parse(sessionStorage.getItem("itemreview"));
        selectedWork = JSON.parse(sessionStorage.getItem("itemSelected"));
    }

    // If the user is on the contact page the message confirmation is made hidden.
    // This will only be made visible should the user send a message. 
    if (document.getElementsByTagName("body")[0].id == "contact") {
        document.getElementById("centerText").style.visibility = "hidden";
    }

    // If the user is on the saved page this statement will check to see if there are any
    // items saved. If there are the no items paragraph will be hidden and the objects in
    // the array are then gone through one by one and passed into a function to be create
    // the information cards on the page. 
    if (document.getElementsByTagName("body")[0].id == "savePage") {
        if (saved.length > 0) {
            document.getElementById("noItems").style.visibility = "hidden";

            for (let i = 0; i < saved.length; i++) {
                savedCreate(saved[i].save, saved[i].like, saved[i].source, saved[i].alt);
            }
        }
    }

    // For the review page the only way to access it is through the information cards found throughout
    // the website or a table from the collections page. The page itself contains a filler image/title that will
    // be altered to the information supplied by the link the user used. As all the information is hard coded 
    // (due to this project being based on an earlier html/css only task) the information used to alter the page
    // is taken from the click event that takes the user to the page. 
    if (document.getElementsByTagName("body")[0].id == "reviewPage") {
        
        // This allows the statement to go through all items in the reviewData array.
        for (let i = 0; i < reviewData.length; i++) {

            // The information from the click not only stores the informtaion in the reviewData array but
            // also saves the button id to both the array and the selectedWork variable. As data is not deleted from
            // this array (as all the reviews are saved) to ensure that the user gets the correct works the array is 
            // compared to the button they clicked to retrieve the correct information.
            if (reviewData[i].save === selectedWork) {

                // Once the correct information is found is locates the image and sets the image source and alt text
                // attributes of this element.
                let image = document.getElementById("image");
                image.src = reviewData[i].source;
                image.alt = reviewData[i].alt;

                // Due to the location in which the buttons were placed i.e. inside the header 
                // this caused an issue where the buttons were deleted when the works title was 
                // updated. As they looked pleasent where they were the resolution was to create the buttons
                // at the same time as header was updated. 
                let save = `<a name="saveButton" class="btn btn-floating d-inline-flex card-icon" 
                id=${reviewData[i].save} role="button"><i class="fas fa-plus-square"></i></a>`;

                let like = `<a name="likeButton" class="btn btn-floating d-inline-flex card-icon"
                id=${reviewData[i].like} role="button"><i class="fas fa-check-square"></i></a>`;

                // To work with my solution above the title + buttons were placed in the innerHTML attribute
                // so the button strings would be rendered to html standard upon insertion.
                let title = document.getElementById("title");
                title.innerHTML = reviewData[i].alt + "  " + like + "  " + save;

                // This retrieves any reviews that have been created from an object array in the 
                // reveiwData variable.
                let reviews = reviewData[i].reviews;

                // Each review for this piece of work is then sent to a function to be inserted/created on the page.
                reviews.forEach(userReview => {
                    createReview(userReview.handle, userReview.message);
                });
            }
        }
    }

    // The purpose of this if statement is to skip this segment if the page doesn't have any like buttons and limit any possible
    // errors that incur from attempting to do so. The for statement should prevent these potential errors from occuring by 
    // failing to run in these circumstances but decided you can't go wrong with caution.    
    if (document.getElementsByName("likeButton").length > 0) {

        // Retrieves all instances of the like button by its name attribute. When checking for syntax errors discovered that this
        // attribute is not considered obsolete. In future will need to use 
        // document.querySelectorAll('[title="likeButton"]') attribute and selector.
        let likeButton = document.getElementsByName("likeButton");

        // Goes through each retrieved element and adds an event listener. It will also retrieve the id for the specific button.
        for (let i = 0; i < likeButton.length; i++) {
            likeButton[i].addEventListener("click", likeEvent);
            let id = likeButton[i].id;

            // A second loop goes through the liked array which contains the button id of all works the user selected.
            // If the retrieved button elements match any of the items in the liked array a class is added to indicate
            // that they have pressed it previously.  
            for (let j = 0; j < liked.length; j++) {
                if (liked[j] === id) {
                    likeButton[i].classList.toggle("cardOn");
                }
            }
        }
    }

    // Is nearly identical to the above statement but instead checks whether the user has clicked any
    // saved buttons. The retrieved elements are also compared against an array object rather than just an array.
    if (document.getElementsByName("saveButton").length > 0) {

        let saveButton = document.getElementsByName("saveButton");

        for (let i = 0; i < saveButton.length; i++) {
            saveButton[i].addEventListener("click", saveEvent);
            let id = saveButton[i].id;
            for (let j = 0; j < saved.length; j++) {
                if (saved[j].save === id) {
                    saveButton[i].classList.toggle("cardOn");
                }
            }
        }
    }

    // If the user is on the index/collections or saved page this statement will retrieve all the review buttons
    // and add an event listener to each one.
    if (document.getElementsByTagName("body")[0].id == "collections" || document.getElementsByTagName("body")[0].id == "index" ||
    document.getElementsByTagName("body")[0].id == "savePage") {

        let reviews = document.getElementsByName("review");

        for (let i = 0; i < reviews.length; i++) {
            reviews[i].addEventListener("click", reviewInfo);
        }
    }

    // Regardless of the page that the user is on the saved link/badge will be updated to show how many
    // items the user has saved.
    badgeUpdate();
}

// Due to a lack of a database the only way to pass any of the works information from page to page was to either
// create an object variable that contains all the information needed for the website or take the needed details
// for each item as needed. It was decided the latter was the best for this site as instead of updating the html code
// and an object variable when adding to the site, it would be simpler to alter the html code and use created functions to
// retireve the needed information from the coded html.  

// When a card image or the review button from the collections page is clicked the details are retrieved and stored ina n array.
function reviewInfo(event) {
    
    // Variables are created that will store the various item information. The first is used to direct the other variables to
    // a point where they can get to the information without repeating the path multiple times.
    let item;

    // The rest retrieve the buttons id so the program can check to see if they have been pressed and the works title/image location.
    // For ease the title and the image alt text are the same.
    let saveId;
    let likeId;
    let imageSrc;
    let imageAlt;

    // As the pages aren't uniform the variables are set differently based on the page they are on.
    if (document.getElementsByTagName("body")[0].id == "collections") {
        item = event.target.parentElement.parentElement;
        saveId = item.children[0].firstChild.id;
        likeId = item.children[1].firstChild.id;
        imageSrc = item.children[2].firstChild.attributes[0].textContent;
        imageAlt = item.children[2].firstChild.alt;
    }
    else if (document.getElementsByTagName("body")[0].id == "index" || document.getElementsByTagName("body")[0].id == "savePage") {
        item = event.target;
        saveId = item.parentElement.parentElement.children[1].id;
        likeId = item.parentElement.parentElement.children[2].id;
        imageSrc = item.attributes[0].textContent;
        imageAlt = item.alt;
    }

    // Once the information has been retrieved the save button id is saved to a variable. This represents the works button the 
    // user selected and is used to find the details from the array that has multiple objects present. 
    selectedWork = saveId;

    // This is then saved to prevent the data from being lost when the user goes to the review page.
    sessionStorage.setItem("itemSelected", JSON.stringify(selectedWork));

    // The reviewData array is checked to see if the user has been to this page before and goes striaght to the page
    // if they have. This prevents the rest of the function being cancelled.
    for (let i = 0; i < reviewData.length; i++) {
        if (reviewData[i].save === saveId) {
            return window.location.href = "review.html";
        }
    }

    // If this is the first time the user has looked at this item an object is created using the information retrieved above.
    let data = {
        "save": saveId,
        "like": likeId,
        "source": imageSrc,
        "alt": imageAlt,
        "reviews": []
    };

    // This object is then pushed to the array.
    reviewData.push(data);

    // The altered variable is then saved to the session storage.
    sessionStorage.setItem("itemreview", JSON.stringify(reviewData));

    // To ensure all the information is retrieved the user will only go to the page
    // once everything has been completed.
    window.location.href = "review.html";
}

// This function is called from the form on the review page. It retrieves the values from the
// input forms and inserts them into the current works being shown on the page.
function addReview() {
    
    // Retrieves the input boxes elements.
    let handle = document.getElementById("inputHandle");
    let message = document.getElementById("review");

    // Checks to see if there is text present in both boxes.
    if(handle.value != "" && message.value != "") {
        
        // Places the retrieved input and places them into an object.
        let reviewDb = {
            "handle": handle.value,
            "message": message.value
        }

        // Locates the relevent object in the array and pushes the object into an array within the object.
        // This is then saved to the session storage.
        for (let i = 0; i < reviewData.length; i++) {
            if (reviewData[i].save === selectedWork) {
                reviewData[i].reviews.push(reviewDb);
                sessionStorage.setItem("itemreview", JSON.stringify(reviewData));
                
                // Sends the retrieved text to a seperate function to be created on the page.
                createReview(handle.value, message.value);

                // The input fields are then cleared to indicate success.
                document.getElementById("inputHandle").value = "";
                document.getElementById("review").value = "";
            }
        }
    }
}

// This function takes in two strings in order for the reviews to be created on screen. The user name and their review. 
function createReview(handle, message) {

    // Locates the id to append the review elements to. 
    let section = document.getElementById("reviewContainer");

    // Creates the container and paragraphs that will show the name of the user creating the review
    // as well as their message. These will then appear under the element above on the review page.
    let newReview = document.createElement('div');
    newReview.classList.add("reviewSection", "formContainer", "mx-auto", "mt-3");
    section.appendChild(newReview);

    let newHandle = document.createElement('p');
    newHandle.textContent = handle + ":";
    newReview.appendChild(newHandle);

    let newMessage = document.createElement('p');
    newMessage.textContent = message;
    newReview.appendChild(newMessage);
}

// In the top/bottom nav bar there is a saved badge button that shows the number of items in
// the saved variable array i.e. the works that the user has wanted to save for later.
function badgeUpdate () {
    let badge = document.getElementsByClassName("badge");

    for (let i = 0; i < badge.length; i++) {
        badge[i].textContent = saved.length;
    }
}

// Controls the like button and its actions.
function likeEvent(event) {

    // Retrieves the like button id.
    let id = event.target.parentNode.id;

    // This if statement is needed to resolve an error where the background/edge of the button is pressed and
    // instead of retrieving the button information it will select the element behind it instead.
    if (id != ""){

        // Creates a variable to toggle the selected style.
        let toggle = event.target.parentNode.classList.toggle("cardOn");

        // Checks to see if it has already been selected and removes it from the array. This is then saved,
        // has its style removed and ends the function.
        for (let i = 0; i < liked.length; i++) {
            if (liked[i] === id) {
                liked.splice(i, 1);
                sessionStorage.setItem("itemLiked", JSON.stringify(liked));
                toggle;
                return;
            }
        }

        // If it isn't present in the array it is added to it.
        liked.push(id);

        // This is then saved to a storage session.
        sessionStorage.setItem("itemLiked", JSON.stringify(liked));

        // The style is then altered.
        toggle;
    }

}

// Controls the save button and its actions.
function saveEvent(event) {

    // Sets the variables needed to create the items in the saved page. As the location of these
    // items are different they are only initilisd here and set depending on the page. 
    let item;
    let imageSrc;
    let imageAlt;
    let likeButton;

    // As this attribute is uniform it is rtrieved here. 
    let saveId = event.target.parentNode.id;
    
    // This if statement is needed to resolve an error where the background/edge of the button is pressed and
    // instead of retrieving the button information it will select the element behind it instead.
    if (saveId != ""){

        // Sets the variables to the correct information depending on the page it is selected.
        if (document.getElementsByTagName("body")[0].id == "index") {

            item = event.target.parentElement.parentElement;
            imageSrc = item.childNodes[1].firstChild.attributes[0].textContent;
            imageAlt = item.childNodes[1].firstChild.alt;
            likeButton = item.childNodes[5].id;
        }
        else if (document.getElementsByTagName("body")[0].id == "reviewPage") {

            item = event.path;
            imageSrc = document.getElementsByTagName("img")[0].attributes[1].textContent;
            imageAlt = document.getElementsByTagName("img")[0].alt;
            likeButton = document.getElementsByName("likeButton")[0].id;
        }
        else if (document.getElementsByTagName("body")[0].id == "collections") {
    
            item = event.target.parentElement.parentElement.parentElement;
            imageSrc = item.children[2].children[0].attributes[0].textContent;
            imageAlt = item.children[2].children[0].alt;
            likeButton = item.children[1].children[0].id;
        }

        // Sets the style to add.
        let toggle = event.target.parentNode.classList.toggle("cardOn");

        // Checks to see if the information is already in the array and deletes it while saving the session storage.
        for (let i = 0; i < saved.length; i++) {
            if (saved[i].save === saveId) {
                saved.splice(i, 1);
                sessionStorage.setItem("itemSaved", JSON.stringify(saved));

                // The style is updated to the default look.
                toggle;

                // The button badges are updated to show that the items have been removed.
                badgeUpdate();

                // The saved page is refreshed to remove the deleted item. 
                if (document.getElementsByTagName("body")[0].id == "savePage") {
                    location.reload();
                }

                // The function is then exited preventing the rest of the function from executing.
                return;
            }
        }

        // If the button hasn't been pressed the information is placed into an object.
        savedItem = {
            "save": saveId,
            "like": likeButton,
            "source": imageSrc,
            "alt": imageAlt
        }

        // The object is then to the saved array.
        saved.push(savedItem);

        // The array is then saved.
        sessionStorage.setItem("itemSaved", JSON.stringify(saved));

        // The style is updated.
        toggle;

        // The button badge is updated to show the new number of saved items.
        badgeUpdate();
    }
}

// Controls the confirmation message on the contact page.
function messageSent() {

    // Retrieves all the user input values from the contact form.
    let email = document.getElementById("inputEmail");
    let subject = document.querySelector('input[name="flexRadioDefault"]:checked').id;
    let message = document.getElementById("message");
    let newsLetter = document.getElementById("gridCheck");

    // Inserts the values into elements that are present but hidden.
    document.getElementById("sentEmail").textContent = "Email: " + email.value;
    document.getElementById("sentSubject").textContent = "Subject: " + subject;
    document.getElementById("sentMessage").textContent = message.value;

    // Returns a different text string depending on whether the check box was selected.
    if (newsLetter.checked == true) {
        document.getElementById("sentSubs").textContent = "I'm interested in subscribing.";
    }
    else {
        document.getElementById("sentSubs").textContent = "I'm not interested in subscribing.";
    }

    // Resets the form by clearing the input fields and setting the radio/check buttons to their default
    // position.
    document.getElementById("inputEmail").value = "";
    document.getElementById("General").checked = true;
    document.getElementById("message").value = "";
    document.getElementById("gridCheck").checked = false;

    // Shows the section to provide user feedback that the message has been sent.
    document.getElementById("centerText").style.visibility = "visible";
}

// Creates the work/information cards on the saved page. Takes in the buttons ids, image location and title as strings. 
function savedCreate(saveId, likeId, source, itemName) {

    // Locates the element in which the cardsa re going to be appended to.
    let section = document.getElementById("cardLocation");

    // Creates cards based on the bootstrap componants using the information provided to fill in the elements.
    let mainDiv = document.createElement('div');
    mainDiv.classList.add("card");
    section.appendChild(mainDiv);

    let mainLink = document.createElement('a');
    mainLink.name = "review";
    mainDiv.appendChild(mainLink);

    let image = document.createElement('img');
    image.src = source;
    image.alt = itemName;
    image.classList.add("card-img-top");
    mainLink.appendChild(image);

    let save = document.createElement('a');
    save.name = "saveButton";
    save.classList.add("btn", "btn-floating", "d-inline-flex", "card-button", "card-icon");
    save.id = saveId;
    save.role = "button";
    mainDiv.appendChild(save);

    let saveIcon = document.createElement('i');
    saveIcon.classList.add("fas", "fa-plus-square");
    save.appendChild(saveIcon);

    let like = document.createElement('a');
    like.name = "likeButton";
    like.classList.add("btn", "btn-floating", "d-inline-flex", "card-button", "card-icon", "me-5");
    like.id = likeId;
    like.role = "button";
    mainDiv.appendChild(like);

    let likeIcon = document.createElement('i');
    likeIcon.classList.add("fas", "fa-check-square");
    like.appendChild(likeIcon);

    let lastDiv = document.createElement('div');
    lastDiv.classList.add("card-body");
    mainDiv.appendChild(lastDiv);

    let title = document.createElement('h5');
    title.classList.add("card-title");
    title.innerText = itemName;
    lastDiv.appendChild(title);
}

// Used the tutorialstonight.com to find information on the retrieving elements by attributes.
// https://www.tutorialstonight.com/javascript-get-element-by-attribute
// Used the w3schools.com website to find information on refreshing pages and linking to other pages.
// https://www.w3schools.com/jsref/met_loc_reload.asp
// https://www.w3schools.com/howto/howto_js_redirect_webpage.asp