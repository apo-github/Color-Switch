console.log("content-script");
const USER_ID = "851725623947"; //851725623947
const AWS_USER_NAME_CSS_SELECTOR = "#nav-usernameMenu";
const HEADER_COLOR = "crimson"; //crimson, green, navy
const HEADER_CSS_SELECTOR = ".globalNav-122";

chrome.runtime.onMessage.addListener((request) => {
    // 期待通りのリクエストかどうかをチェック
    console.log("呼び出されました！！")
    if (request.key === 'to-ontent-script') {
        AwsChangeColor();
    }
});

function getParams() {
    // storage.sync.get()値がなければデフォルト値が採用される
    let options = []
    chrome.storage.sync.get({
        url_row_1: "https://*.console.aws.amazon.com/*",
        css_selector_row_1: HEADER_CSS_SELECTOR,
        color_row_1:HEADER_COLOR,
        aws_id_row_1: USER_ID,
    }, function (datas) { 
        options.push(datas.url_row_1);
        options.push(datas.css_selector_row_1);
        options.push(datas.color_row_1);
        options.push(datas.aws_id_row_1);
    });
    return options
}


function AwsChangeColor() {
    console.log("loading page....");
    options = getParams(); //storageから値を取得
    console.log("options ====> ", options); //デバッグ用

    if(document.querySelector( HEADER_CSS_SELECTOR) != null) {
        console.log("user check!")
        let get_user_name = document.querySelector(AWS_USER_NAME_CSS_SELECTOR).firstElementChild.textContent
        get_user_name = get_user_name.substring(get_user_name.indexOf("@")+1).replace(/[-]/g,"");
        get_user_name = get_user_name.replace(" ", "");
        console.log("USER_ID: ", get_user_name); 
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