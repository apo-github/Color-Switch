console.log("content-script");
const AWS_USER_NAME_CSS_SELECTOR = "#nav-usernameMenu";
const AZURE_USER_NAME_CSS_SELECTOR = ".fxs-avatarmenu-username"

const set_interval_id = setInterval(getParams, 1000);
const MAX_TRY_COUNT = 10;
let count = 0;

chrome.runtime.onMessage.addListener((request) => {
    // 特定の関数からのリクエストかどうかをチェック
    console.log(" ====== Read content-script! =====")
    if (request.key === 'to-content-script') {
        getParams();
    }
});

function getParams() {
    chrome.storage.sync.get({
        url_row_1: "",
        query_selector_row_1: "",
        color_row_1: "",
        id_row_1: ""
    }, function (datas) { 
        let options = {};
        options.url_row_1 = datas.url_row_1;
        options.query_selector_row_1 = datas.query_selector_row_1;
        options.color_row_1 = datas.color_row_1;
        options.id_row_1 = datas.id_row_1;

        switch (datas.id_row_1){
            case "aws":
                AwsChangeColor(options);
                break;
            case "azure":
                AzureChangeColor(options);
                break;
            default:
                DefaultChangeColor(options);
        }
    });
}

function DefaultChangeColor(options){
    console.log("loading page....");
    show_settngs(options);

    add_style(options);
    clearInterval(set_interval_id);
}


function AwsChangeColor(options) {
    console.log("loading page....");
    show_settngs(options);

    if(document.querySelector(options.query_selector_row_1) != null) { 
        console.log("user check!");
        user_id = aws_get_user_id()

        if (user_id == options.id_row_1){
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
    console.log("loading page....");
    show_settngs(options);

    if(document.querySelector(options.query_selector_row_1) != null) { 
        console.log("user check!");
        user_id = azure_get_user_id()

        if (user_id == options.id_row_1){
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
    console.log("=== Settings ===")
    console.log("AWS ID: ", options.id_row_1);
    console.log("Selector: ", options.query_selector_row_1);
    console.log("Color: ", options.color_row_1);
    console.log("=================")
}

function aws_get_user_id(){
    let user_id = document.querySelector(AWS_USER_NAME_CSS_SELECTOR).getAttribute('aria-label');
    user_id = user_id.substring(user_id.indexOf("@")+1).replace(/[-]/g,"");
    user_id = user_id.replace(" ", "");
    console.log("AWS ID (got from page): ", user_id); 
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
    ${options.query_selector_row_1} {
        background-color: ${options.color_row_1}!important;
    }
    `;
    document.head.appendChild(style);
}

function remove_style(){
    const element = document.head.lastElementChild;
    element.remove();
}