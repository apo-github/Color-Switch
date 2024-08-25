//すべてのタブ（tabs）のidを取得し、tab id ごとにcontent_scriptを実行する

console.log("background");

const COL_NUM = 5


// アクティブなタブを取得 (これで問題があれば全タブを取得し、それぞれのページに適用させるようにする方向で)
// ストレージから全データを取り出す
// アクティブタブのURLとストレージに登録された全URLをチェックしマッチするかどうかを判定
// マッチした場合は、そのURLキーと同じ番号キーをすべて取得
// そのURLを持つタブ(今回はアクティブtab)に対し、バックグラウンド変更処理をインジェクト


// chrome.runtime.onInstalled.addListener(() => {
//     console.log('拡張機能がインストールまたは更新されました。');
// });


chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    
    if (request.message === 'to_background') { // 特定の関数からのリクエストかどうかをチェック
        console.log(" ====== background.js! =====")

        chrome.tabs.query({}, (tabs) => {
            if (tabs !== undefined) {
                // changeColor(tabs); 
                chrome.storage.sync.get(null, (datas) => {
                    const TABS = tabs
                    const DATA_NUM = Object.keys(datas).length
                    const DATA_LENGTH = DATA_NUM !== undefined ? DATA_NUM/COL_NUM : 0;
                    console.log("tabs, storage datas, settings datas",TABS.length, DATA_NUM, DATA_LENGTH)
                    
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
                                        chrome.tabs.sendMessage(TABS[t].id, {message:'to_content_script', options:options, func:"aws"}, (response)=> {
                                            console.log("call AwsChangeColor func");
                                            if (chrome.runtime.lastError) {
                                                console.error("backgournd.js呼び出し時エラー:", chrome.runtime.lastError.message);
                                            }else{
                                                console.log(response.message);
                                            }
                                        });
                                        break;
                                    case "azure":
                                        chrome.tabs.sendMessage(TABS[t].id, {message:'to_content_script', options:options, func:"azure"}, (response)=> {
                                            console.log("call AzureChangeColor func");
                                            if (chrome.runtime.lastError) {
                                                console.error("backgournd.js呼び出し時エラー:", chrome.runtime.lastError.message);
                                            }else{
                                                console.log(response.message);
                                            }
                                        });
                                        break;
                                    default:
                                        chrome.tabs.sendMessage(TABS[t].id, {message:'to_content_script', options:options, func:"default"}, (response)=> {
                                            console.log("call DefaultChangeColor func");
                                            if (chrome.runtime.lastError) {
                                                console.error("backgournd.js呼び出し時エラー:", chrome.runtime.lastError.message);
                                            }else{
                                                console.log(response.message);
                                            }
                                        });
                                }
                            }
                        }
                    }
                });
            }
        });
    }

    sendResponse({message: "background received the request"});
    return true;
});


