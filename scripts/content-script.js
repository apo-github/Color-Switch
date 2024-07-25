console.log("Loaded JS");

const USER_ID = "851725623947"; //851725623947
const AWS_USER_NAME_CSS_SELECTOR = "#nav-usernameMenu";
const HEADER_COLOR = "crimson"; //crimson, green, navy
const HEADER_CSS_SELECTOR = ".globalNav-122";
const set_interval_id = setInterval(AWSfindTargetElement, 1000);

function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        url_row_1: URL_1,
        css_selector_row_1: CSS_SELECTOR_1,
        color_row_1:COLOR_1,
        aws_id_row_1: AWS_ID_1,
    }, function(items) {
      document.getElementById('color').value = items.favoriteColor;
      document.getElementById('like').checked = items.likesColor;
    });
   }
   document.addEventListener('DOMContentLoaded', restore_options);
   document.getElementById('save').addEventListener('click',
      save_options);


function AWSfindTargetElement() {
    console.log("loading page....");
    if(document.querySelector( HEADER_CSS_SELECTOR) != null) {
        console.log("user check!")
        let get_user_name = document.querySelector(AWS_USER_NAME_CSS_SELECTOR).firstElementChild.textContent
        get_user_name = get_user_name.substring(get_user_name.indexOf("@")+1).replace(/[-]/g,"");
        get_user_name = get_user_name.replace(" ", "");
        console.log("USER_ID: ", get_user_name); //1
        if (get_user_name == USER_ID){
            console.log("matched AWS account ID!");
            const style = document.createElement("style");
            style.innerHTML = `
            ${HEADER_CSS_SELECTOR} {
                background-color: ${HEADER_COLOR} !important;
            }
            `;
            document.head.appendChild(style);
            // document.querySelector( HEADER_CSS_SELECTOR).style.backgroundColor = HEADER_COLOR;
            clearInterval(set_interval_id);
        } else {
            clearInterval(set_interval_id);
        }
    }
}


function findTargetElement() {
    let get_user_name = document.querySelector(AWS_USER_NAME_CSS_SELECTOR).firstElementChild.textContent
    get_user_name = get_user_name.substring(get_user_name.indexOf("@")+1).replace(/[-]/g,"");
    get_user_name = get_user_name.replace(" ", "");
    if (get_user_name == USER_ID){
        console.log("matched AWS account ID!");
        const style = document.createElement("style");
        style.innerHTML = `
        ${HEADER_CSS_SELECTOR} {
            background-color: ${HEADER_COLOR} !important;
        }
        `;
        document.head.appendChild(style);
    }else{

    }
    
}