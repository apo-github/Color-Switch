console.log("content-script");
const USER_ID = "851725623947"; //851725623947
const AWS_USER_NAME_CSS_SELECTOR = "#nav-usernameMenu";
const HEADER_COLOR = "crimson"; //crimson, green, navy
const QUERY_SELECTOR = "#awsc-navigation-container";
const DEFAULT_URL = "https://*.console.aws.amazon.com/*"
const set_interval_id = setInterval(getParams, 1000);

chrome.runtime.onMessage.addListener((request) => {
    // 期待通りのリクエストかどうかをチェック
    console.log("呼び出されました！！")
    if (request.key === 'to-content-script') {
        getParams();
    }
});

function getParams() {
    // storage.sync.get()値がなければデフォルト値が採用される
    chrome.storage.sync.get({
        url_row_1: DEFAULT_URL,
        query_selector_row_1: QUERY_SELECTOR,
        color_row_1:HEADER_COLOR,
        aws_id_row_1: USER_ID,
    }, function (datas) { 
        let options = {};
        options.url_row_1 = datas.url_row_1;
        options.query_selector_row_1 = datas.query_selector_row_1;
        options.color_row_1 = datas.color_row_1;
        options.aws_id_row_1 = datas.aws_id_row_1;
        AwsChangeColor(options);
    });
}


function AwsChangeColor(options) {
    console.log("loading page....");
    console.log(options.aws_id_row_1)
    console.log(options.query_selector_row_1)
    console.log(options.color_row_1)
    if(document.querySelector(options.query_selector_row_1) != null) {  //ここが通らん
        console.log("user check!")
        let get_user_name = document.querySelector(AWS_USER_NAME_CSS_SELECTOR).firstElementChild.textContent
        get_user_name = get_user_name.substring(get_user_name.indexOf("@")+1).replace(/[-]/g,"");
        get_user_name = get_user_name.replace(" ", "");
        console.log("USER_ID: ", get_user_name); 
        if (get_user_name == options.aws_id_row_1){
            console.log("matched AWS account ID!");
            const style = document.createElement("style");
            style.innerHTML = `
            ${options.query_selector_row_1} {
                background-color: ${options.color_row_1}!important;
            }
            `;
            document.head.appendChild(style);
            // document.querySelector( QUERY_SELECTOR).style.backgroundColor = HEADER_COLOR;
            clearInterval(set_interval_id);
        } else {
            clearInterval(set_interval_id);
        }
    }
}

function saveOptions() {
    console.log("load saveoptions");
    // const URL_1 = document.querySelector("#url-row-1").value;
    // const CSS_SELECTOR_1 = document.querySelector("#css-selector-row-1").value;
    // const COLOR_1 = document.querySelector("#color-row-1").value;
    // const AWS_ID_1 = document.querySelector("#aws-id-row-1").value;
    
    
    // chrome.storage.sync.set({
    //     url_row_1: URL_1,
    //     css_selector_row_1: CSS_SELECTOR_1,
    //     color_row_1:COLOR_1,
    //     aws_id_row_1: AWS_ID_1,
    // }, function (datas) { 
    //     options.push(datas.url_row_1);
    //     options.push(datas.css_selector_row_1);
    //     options.push(datas.color_row_1);
    //     options.push(datas.aws_id_row_1);

    //     console.log(options);
    // });


    // for (let i = 1; i <= , )
    //     chrome.storage.sync.set({
    //         url_row_${i}: URL_${i},
    //         css_selector_row_${i}: CSS_SELECTOR_${i},
    //         color_row_${i}:COLOR_${i},
    //         aws_id_row_${i}: AWS_ID_${i},
    //     }, function() {
    //         // Update status to let user know options were saved.
    //         alert("saved your settings(｀・ω・´)");
    //     });
}

// function findTargetElement() {
//     let get_user_name = document.querySelector(AWS_USER_NAME_CSS_SELECTOR).firstElementChild.textContent
//     get_user_name = get_user_name.substring(get_user_name.indexOf("@")+1).replace(/[-]/g,"");
//     get_user_name = get_user_name.replace(" ", "");
//     if (get_user_name == USER_ID){
//         console.log("matched AWS account ID!");
//         const style = document.createElement("style");
//         style.innerHTML = `
//         ${HEADER_CSS_SELECTOR} {
//             background-color: ${HEADER_COLOR} !important;
//         }
//         `;
//         document.head.appendChild(style);
//     }else{

//     }
// }