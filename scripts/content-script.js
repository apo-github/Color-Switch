console.log("Loaded JS");

const HEADER_COLOR = "#dc143c";
const SELECTOR = ".globalNav-122";
const set_interval_id = setInterval(findTargetElement, 1000);

function findTargetElement() {
    if(document.querySelector(SELECTOR) != null) {
        console.log("changed the header color!");
        document.querySelector(SELECTOR).style.backgroundColor = HEADER_COLOR;
        clearInterval(set_interval_id);
    }
}



