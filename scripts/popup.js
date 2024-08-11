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
    chrome.storage.sync.get(null, function (datas) { 
        const data_length = Object.keys(datas).length;
        for (i = 1; i <= data_length; i++) {
            document.querySelector(`#url-row-${i}`).value = datas[`url_row_${i}`];
            document.querySelector(`#css-selector-row-${i}`).value = datas[`query_selector_row_${i}`];
            document.querySelector(`#color-row-${i}`).value = datas[`color_row_${i}`];
            document.querySelector(`#id-row-${i}`).value = datas[`id_row_${i}`];        
        }
    });
}

function setParams(){
    console.log("Popup.js > setParams")
    const URL_1 = document.querySelector("#url-row-1").value;
    const QUERY_SELECTOR_1 = document.querySelector("#css-selector-row-1").value;
    const COLOR_1 = document.querySelector("#color-row-1").value;
    const ID_1 = document.querySelector("#id-row-1").value;

    chrome.storage.sync.set({
        "url_row_1": URL_1,
       "query_selector_row_1": QUERY_SELECTOR_1,
        "color_row_1":COLOR_1,
        "id_row_1": ID_1,
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




