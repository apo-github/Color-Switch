console.log("content-script");

// backgroundを最初に呼び出す
chrome.runtime.sendMessage({ message: "to_background" }, ()=> {
    console.log("call background.js");
});

// cssをインジェクト
chrome.runtime.onMessage.addListener((options, func) => {
    
});


// 関数群

function DefaultChangeColor(options){
    console.log("=== Dafault Page ===\n"); 
    console.log("loading page....");
    show_settngs(options);
    
    add_style(options);
    clearInterval(set_interval_id);
}

function AwsChangeColor(options) {
    console.log("=== Aws Page ===\n"); 
    console.log("loading page....");
    show_settngs(options);

    if(document.querySelector(options.query_selector_row) != null) { 
        console.log("user check!");
        user_id = aws_get_user_id()

        if (user_id == options.id_row){
            console.log("matched AWS ID!");
            add_style(options);
            clearInterval(set_interval_id);
        } else {
            remove_style();
            clearInterval(set_interval_id);
        }
    }
}

function AzureChangeColor(options) {
    console.log("=== Azure Page ===\n"); 
    console.log("loading page....");
    show_settngs(options);

    if(document.querySelector(options.query_selector_row) != null) { 
        console.log("user check!");
        user_id = azure_get_user_id()

        if (user_id == options.id_row){
            console.log("matched Azure ID!");
            add_style(options);
            clearInterval(set_interval_id);
        } else {
            remove_style();
            clearInterval(set_interval_id);
        }
    }
}

function show_settngs(options){
    console.log(options)
    console.log("=== Settings ===");
    console.log("AWS ID: ", options.id_row);
    console.log("Selector: ", options.query_selector_row);
    console.log("Color: ", options.color_row);
    console.log("Tab Id: ", options.tab_id);
    console.log("=================");
}

function aws_get_user_id(){
    let user_id = document.querySelector(AWS_USER_NAME_CSS_SELECTOR).getAttribute('aria-label');
    user_id = user_id.substring(user_id.indexOf("@")+1).replace(/[-]/g,"");
    user_id = user_id.replace(" ", "");
    console.log(" AWS ID (got from page): ", user_id); 
    return user_id
}

function azure_get_user_id(){
    let user_id = document.querySelector(AZURE_USER_NAME_CSS_SELECTOR).textContent;
    // user_id = user_id.substring(user_id.indexOf("@")+1).replace(/["]/g,"");
    user_id = user_id.replace(" ", "");
    console.log("Azure ID (got from page): ", user_id); 
    return user_id
}

function add_style(options){
    const style = document.createElement("style");
    style.innerHTML = `
    ${options.query_selector_row} {
        background-color: ${options.color_row}!important;
    }
    `;
    document.head.appendChild(style);
}

function remove_style(){
    const element = document.head.lastElementChild;
    element.remove();
}