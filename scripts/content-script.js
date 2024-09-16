// cssをインジェクトする
const AWS_USER_NAME_CSS_SELECTOR = "#nav-usernameMenu";
const AZURE_USER_NAME_CSS_SELECTOR = ".fxs-avatarmenu-username"
const MAX_TRY_COUNT = 2000;
let wait_count = 0;
let oldUrl = ''; // URLの記憶用

// backgroundを最初に呼び出す
chrome.runtime.sendMessage({ message: "to_background" }, (response) => {});

// urlの変更検知用（Azureに対応）
const observer = new MutationObserver(() => {
    // ここにDOM変更時の処理を書く
    if(oldUrl !== location.href) {
        chrome.runtime.sendMessage({ message: "to_background" }, (response) => {});
        console.log('変更を検知');
        oldUrl = location.href; // oldUrlを更新
    }
});

observer.observe(document.body, {
    subtree: true,
    childList: true, 
    attributes: true,
    characterData: true
})

// cssをインジェクト
chrome.runtime.onMessage.addListener((request, sender, sendResponse) =>{
    if (request.message === 'to_content_script') { // 特定の関数からのリクエストかどうかをチェック
        
        const { options, func } = request;

        // which service to use?
        switch (func){
            case "aws":
                AwsChangeColor(options);
                break;
            case "azure":
                AzureChangeColor(options);
                break;
            case "remove":
                remove_style();
                break;
            default:
                DefaultChangeColor(options);
                // if (!interval_id){
                //     interval_id = setInterval(() => DefaultChangeColor(options), 1000); // setIntervalは動作がよくわからないので使用をやめた。(settingsの1行目以降の値が読まれない)
                // } 
        }

        
    }
    sendResponse({message: "content-script received the request"});
    return true;
});


function wait_loading(){
    // pageロード待機
    if (wait_count < MAX_TRY_COUNT){
        wait_count += 1;
    }else{
        // clearInterval(interval_id);
        // interval_id = null;
    }
}

function DefaultChangeColor(options){
    if(document.querySelector(options.query_selector_row) !== "" && options.id_row === "") { 
        add_style(options);
    }
    wait_loading();
}

function AwsChangeColor(options) {
    if(document.querySelector(options.query_selector_row) !== "") { 
        let user_id = aws_get_user_id()
        if (user_id === options.id_row){
            add_style(options);
        }
    }
    wait_loading();
}

function AzureChangeColor(options) {
    let re = new RegExp(options.id_row);
    if (re.test(options['tab_id'].url)){
        add_style(options);
    }else{
        remove_style(options);
    }
    // wait_loading();
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
    let user_id;
    try {
        user_id = JSON.parse(document.querySelectorAll("meta")[2].content).accountId;
    }catch{
        user_id = ""
    }
    return user_id
}

function azure_much_subscription_id(){
    let user_id = options['tab_id'].url
    // user_id = user_id.substring(user_id.indexOf("@")+1).replace(/["]/g,"");
    user_id = user_id.replace(" ", "");
    return user_id
}

function add_style(options){
    const BEFORE_STYLE = document.head.querySelector("#color-change");
    if (BEFORE_STYLE !== null){
        BEFORE_STYLE.remove();//要素が残っていた場合は消す
    }

    const style = document.createElement("style");
    style.id = "color-change"
    style.innerHTML = `
    ${options.query_selector_row} {
        background-color: ${options.color_row}!important;
    }
    `;
    document.head.appendChild(style);    

    // // intervalを終える
    // clearInterval(interval_id);
    // interval_id = null;
}

function remove_style(){
    const elements = document.querySelectorAll("#color-change");
    for (let i = 0; i < elements.length; i++) {
        elements[0].remove();
    }

    // // intervalを終える
    // clearInterval(interval_id);
    // interval_id = null;
}