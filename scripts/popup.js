save_button = document.querySelector("#save");
save_button.addEventListener( "click", () => {
    setParams();
})



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
        alert("saved your settings(｀・ω・´)");
    });

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        // console.log({ tabs })
        // content_script へデータを送る
        chrome.tabs.sendMessage(tabs[0].id, { // content_script はタブごとに存在するため ID 指定する必要がある
          key: 'to-content-script'
        })
    });
    
}




