save_button = document.querySelector("#save");
save_button.addEventListener( "click", () => {
    setParams();
})



function setParams(){
    console.log("読まれました")
    const URL_1 = document.querySelector("#url-row-1").value;
    const CSS_SELECTOR_1 = document.querySelector("#css-selector-row-1").value;
    const COLOR_1 = document.querySelector("#color-row-1").value;
    const AWS_ID_1 = document.querySelector("#aws-id-row-1").value;

    chrome.storage.sync.set({
        url_row_1: URL_1,
        css_selector_row_1: CSS_SELECTOR_1,
        color_row_1:COLOR_1,
        aws_id_row_1: AWS_ID_1,
    }, function () {
        console.log("saved")
        alert("saved your settings(｀・ω・´)");
    });

    chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
        chrome.runtime.sendMessage( tabs[0].id, { key: 'to-content-script' });
        // 取得したタブid(tabs[0].id)を利用してsendMessageする
    });
    

    
}




