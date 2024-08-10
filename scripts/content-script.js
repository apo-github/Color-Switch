console.log("content-script");
const AWS_ID = "851725623947"; //851725623947
const AWS_USER_NAME_CSS_SELECTOR = "#nav-usernameMenu";
const HEADER_COLOR = "crimson"; //crimson, green, navy
const QUERY_SELECTOR = ".globalNav-123";
const DEFAULT_URL = "https://*.console.aws.amazon.com/*";
const set_interval_id = setInterval(getParams, 1000);
const MAX_TRY_COUNT = 10;
let count = 0;

chrome.runtime.onMessage.addListener((request) => {
    // 期待通りのリクエストかどうかをチェック
    console.log(" ====== Read content-script! =====")
    if (request.key === 'to-content-script') {
        getParams(count);
    }
});

function getParams(count) {
    // storage.sync.get()値がなければデフォルト値が採用される
    chrome.storage.sync.get({
        url_row_1: DEFAULT_URL,
        query_selector_row_1: QUERY_SELECTOR,
        color_row_1: HEADER_COLOR,
        aws_id_row_1: AWS_ID
    }, function (datas) { 
        let options = {};
        options.url_row_1 = datas.url_row_1;
        options.query_selector_row_1 = datas.query_selector_row_1;
        options.color_row_1 = datas.color_row_1;
        options.aws_id_row_1 = datas.aws_id_row_1;
        AwsChangeColor(options ,count);
    });
}


function AwsChangeColor(options, count) {
    if (count < MAX_TRY_COUNT){
        console.log(options)
        console.log("loading page....");
        console.log("AWS ID: ", options.aws_id_row_1);
        console.log("Selector: ", options.query_selector_row_1);
        console.log("Color: ", options.color_row_1);
        if(document.querySelector(options.query_selector_row_1)) { 
            console.log("user check!");
            user_id = aws_get_user_id()
            console.log("AWS ID: ", user_id); 
            if (user_id == options.aws_id_row_1){
                console.log("matched AWS ID!");
                add_style(options);
                clearInterval(set_interval_id);
            } else {
                remove_style();
                clearInterval(set_interval_id);
            }
        }
        count += 1;
    }else{
        clearInterval(set_interval_id);
    }
}

function aws_get_user_id(){
    let user_id = document.querySelector(AWS_USER_NAME_CSS_SELECTOR).getAttribute('aria-label');
    console.log("========> ",user_id);
    user_id = user_id.substring(user_id.indexOf("@")+1).replace(/[-]/g,"");
    user_id = user_id.replace(" ", "");
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