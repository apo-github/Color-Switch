getParams(); //初期ロード時の設定読み込み
window.rowNum = document.querySelectorAll(".row").length;
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
    // chrome.storage.sync.clear();  // 開発用
    chrome.storage.sync.get(null, function (datas) { 
        const data_length = Object.keys(datas).length > 0 ? (Object.keys(datas).length) / 5 : 0;
        console.log(data_length);
        console.log(datas);

        for (i = 1; i <= data_length; i++) {
            if (i > 1){
                addBlock(i);
            }
            document.querySelector(`#url-row-${i}`).value = datas[`url_row_${i}`];
            document.querySelector(`#css-selector-row-${i}`).value = datas[`query_selector_row_${i}`];
            document.querySelector(`#color-row-${i}`).value = datas[`color_row_${i}`];
            document.querySelector(`#service-row-${i}`).value = datas[`service_row_${i}`];
            document.querySelector(`#id-row-${i}`).value = datas[`id_row_${i}`];        
        }
    });
}

function setParams(){
    chrome.storage.sync.clear();  // 開発用
    console.log("Popup.js > setParams");
    data_obj = {};

    for (i = 1; i <= rowNum; i++){
        console.log("rowNum", rowNum)
        console.log("save-num:", i);
        const URL = document.querySelector(`#url-row-${i}`).value;
        const CSS_SELECTOR = document.querySelector(`#css-selector-row-${i}`).value;
        const COLOR = document.querySelector(`#color-row-${i}`).value;
        const SERVICE = document.querySelector(`#service-row-${i}`).value;
        const ID = document.querySelector(`#id-row-${i}`).value;

        data_obj[`url_row_${i}`] = URL;
        data_obj[`query_selector_row_${i}`] = CSS_SELECTOR;
        data_obj[`color_row_${i}`] = COLOR;
        data_obj[`service_row_${i}`] = SERVICE;
        data_obj[`id_row_${i}`] = ID; 
    }

    chrome.storage.sync.set(data_obj, function () {
        alert("Saved your settings(｀・ω・´)");
    });

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        // content_script へデータを送る
        chrome.tabs.sendMessage(tabs[0].id, { // content_script はタブごとに存在するため ID 指定する必要がある
          key: 'to-content-script'
        })
    });
    
}




