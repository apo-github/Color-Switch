console.log("Loaded JS");

const USER_NAME = "user_name @ xxxx-yyyy-zzzz"
const USER_NAME_SELECTOR = "#nav-usernameMenu"
const HEADER_COLOR = "crimson"; //crimson, green, navy
const HEADER_CSS_SELECTOR = ".globalNav-122";
const set_interval_id = setInterval(findTargetElement, 1000);

function findTargetElement() {
    if(document.querySelector( HEADER_CSS_SELECTOR) != null) {
        console.log("user check!")
        const get_user_name = document.querySelector(USER_NAME_SELECTOR).firstElementChild.textContent
        if (get_user_name == USER_NAME){
            console.log("changed the header color!");
            document.querySelector( HEADER_CSS_SELECTOR).style.backgroundColor = HEADER_COLOR;
            clearInterval(set_interval_id);
        }else{
            clearInterval(set_interval_id);
        }
    }
}