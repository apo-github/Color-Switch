console.log("background");

const AWS_USER_NAME_CSS_SELECTOR = "#nav-usernameMenu";
const AZURE_USER_NAME_CSS_SELECTOR = ".fxs-avatarmenu-username"

const set_interval_id = setInterval(init, 1000);
const COL_NUM = 5
const MAX_TRY_COUNT = 10;
let wait_count = 0;

// アクティブなタブを取得 (これで問題があれば全タブを取得し、それぞれのページに適用させるようにする方向で)
// ストレージから全データを取り出す
// アクティブタブのURLとストレージに登録された全URLをチェックしマッチするかどうかを判定
// マッチした場合は、そのURLキーと同じ番号キーをすべて取得
// そのURLを持つタブ(今回はアクティブtab)に対し、バックグラウンド変更処理をインジェクト

chrome.runtime.onMessage.addListener((request) => {
    console.log(" ====== background.js! =====")

    if (request.message === 'to_background') { // 特定の関数からのリクエストかどうかをチェック
        chrome.tabs.onCreated.addListener((tabs) => { // get all tabs
            // console.log(tabs);
            if (tabs !== undefined) {
                console.log("from background: ", tabs);
                changeColor(tabs); 
            }else{
                clearInterval(set_interval_id);
            }
        });
    }
});

function changeColor(tabs) {
    chrome.storage.sync.get(null, function (datas) {
        const DATA_NUM = Object.keys(datas).length
        const DATA_LENGTH = DATA_NUM !== undefined ? DATA_NUM/COL_NUM : 0;
        const TABS = tabs['tabs']

        for (let t = 0; t < TABS.length; t++) {
            for (let i = 1; i <= DATA_LENGTH; i++) {

                // 正規表現を生成
                let pattern = datas[`url_row_${i}`];
                pattern = pattern.replace('*', '(.*)');
                let re = new RegExp(pattern); 
                // console.log(re)

                if (re.test(TABS[t].url)){ // url pattern match?
                    console.log("=======パターンが一致しました======")
                    let options = {};
                    options['query_selector_row'] = datas[`query_selector_row_${i}`];
                    options['color_row'] = datas[`color_row_${i}`];
                    options['service_row'] = datas[`service_row_${i}`];
                    options['id_row'] = datas[`id_row_${i}`];
                    options['tab_id'] = TABS[t];

                    // which service to use?
                    switch (options['service_row']){
                        case "aws":
                            chrome.runtime.sendMessage({ options:options, func:"AwsChangeColor"}, ()=> {
                                console.log("call AwsChangeColor func");
                            });
                            // AwsChangeColor(options);
                            break;
                        case "azure":
                            chrome.runtime.sendMessage({ options:options, func:"AzureChangeColor"}, ()=> {
                                console.log("call AzureChangeColor func");
                            });
                            // AzureChangeColor(options);
                            break;
                        default:
                            chrome.runtime.sendMessage({ options:options, func:"DefaultChangeColor"}, ()=> {
                                console.log("call DefaultChangeColor func");
                            });
                            // DefaultChangeColor(options);
                    }
                }
            }
        }

        // aws等のpageロード待機
        if (wait_count <= MAX_TRY_COUNT){
            console.log("Loading page...", wait_count);
            wait_count += 1;
        }else{
            clearInterval(set_interval_id);
        }
    });
}


