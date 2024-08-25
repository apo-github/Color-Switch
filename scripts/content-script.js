// cssをインジェクトする
console.log("content-script");

const AWS_USER_NAME_CSS_SELECTOR = "#nav-usernameMenu";
const AZURE_USER_NAME_CSS_SELECTOR = ".fxs-avatarmenu-username"
const MAX_TRY_COUNT = 10;
let wait_count = 0;
let interval_id;

// backgroundを最初に呼び出す
chrome.runtime.sendMessage({ message: "to_background" }, (response) => {
    if (chrome.runtime.lastError) {
        console.error("backgournd.js呼び出し時エラー:", chrome.runtime.lastError.message);
    }else{
        console.log(response.message);
    }
});


// cssをインジェクト
chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if (request.message === 'to_content_script') { // 特定の関数からのリクエストかどうかをチェック
        const { options, func } = request;
        show_settngs(options);

        // which service to use?
        switch (func){
            case "aws":
                console.log("=== Aws Page ===\n");
                if (!interval_id){
                    interval_id = setInterval(() => AwsChangeColor(options), 1000);
                }
                break;
            case "azure":
                console.log("=== Azure Page ===\n");
                if (!interval_id){
                    interval_id = setInterval(() => AzureChangeColor(options), 1000);
                } 
                break;
            default:
                console.log("=== Dafault Page ===\n"); 
                if (!interval_id){
                    interval_id = setInterval(() => DefaultChangeColor(options), 1000);
                } 
        }
    }
    sendResponse({message: "content-script received the request"});
    return true;
});


function wait_loading(){
    // pageロード待機
    if (wait_count < MAX_TRY_COUNT){
        console.log("Loading page...");
        wait_count += 1;
    }else{
        clearInterval(interval_id);
        interval_id = null;
    }
}

function DefaultChangeColor(options){
    if(document.querySelector(options.query_selector_row) != null) { 
        add_style(options);
    }
    wait_loading();
}

function AwsChangeColor(options) {
    if(document.querySelector(options.query_selector_row) != null) { 
        console.log("user check!");
        user_id = aws_get_user_id()
        
        if (user_id == options.id_row){
            console.log("matched AWS ID!");
            add_style(options);
        } else { // 色をデフォルトの状態に戻す
            remove_style();
        }
    }
    wait_loading();
}

function AzureChangeColor(options) {

    if(document.querySelector(options.query_selector_row) != null) { 
        console.log("user check!");
        user_id = azure_get_user_id()

        if (user_id == options.id_row){
            console.log("matched Azure ID!");
            add_style(options);
        } else {
            remove_style();
        }
    }
}

function show_settngs(options){
    console.log("=== Settings ===");
    console.log("Selector: ", options.query_selector_row);
    console.log("Color: ", options.color_row);
    console.log("service_row", options.service_row)
    console.log("AWS ID: ", options.id_row);
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

    // intervalを終える
    clearInterval(interval_id);
    interval_id = null;
}

function remove_style(){
    const element = document.head.lastElementChild;
    element.remove();

    // intervalを終える
    clearInterval(interval_id);
    interval_id = null;
}