const HEADER_COLOR = "crimson"; //crimson, green, navy
const QUERY_SELECTOR = ".globalNav-123";
const DEFAULT_URL = "https://*.console.aws.amazon.com/*";
const AWS_ID = "851725623947"; //851725623947



getParams(); //初期ロード時の設定読み込み
save_button = document.querySelector("#save");
save_button.addEventListener( "click", () => {
    setParams();
})

// // ボタンの非活性処理を追加
// const service_select_btn = document.querySelector("select-service");
// service_select_btn.addEventListener( "click", () => {
//     if (service_select_btn.value == "") {
//         service_select_btn.disabled = true;
//     }
// })


function getParams() {
    // storage.sync.get()値がなければデフォルト値が採用される
    chrome.storage.sync.get({
        url_row_1: DEFAULT_URL,
        query_selector_row_1: QUERY_SELECTOR,
        color_row_1: HEADER_COLOR,
        aws_id_row_1: AWS_ID
    }, function (datas) { 
        document.querySelector("#url-row-1").value = datas.url_row_1;
        document.querySelector("#css-selector-row-1").value = datas.query_selector_row_1;
        document.querySelector("#color-row-1").value = datas.color_row_1;
        document.querySelector("#aws-id-row-1").value = datas.aws_id_row_1;        
    });
}

function setParams(){
    console.log("Popup.js > setParams")
    const URL_1 = document.querySelector("#url-row-1").value;
    const QUERY_SELECTOR_1 = document.querySelector("#css-selector-row-1").value;
    const COLOR_1 = document.querySelector("#color-row-1").value;
    const AWS_ID_1 = document.querySelector("#aws-id-row-1").value;

    chrome.storage.sync.set({
        url_row_1: URL_1,
        query_selector_row_1: QUERY_SELECTOR_1,
        color_row_1:COLOR_1,
        aws_id_row_1: AWS_ID_1,
    }, function () {
        alert("Saved your settings(｀・ω・´)");
    });

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        // content_script へデータを送る
        chrome.tabs.sendMessage(tabs[0].id, { // content_script はタブごとに存在するため ID 指定する必要がある
          key: 'to-content-script'
        })
    });
    
}




