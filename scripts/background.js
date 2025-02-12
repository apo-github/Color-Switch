const COL_NUM = 5

// すべてのタブ（tabs）のidを取得し、tab id ごとにcontent_scriptを実行する
// ストレージから全データを取り出す
// アクティブタブのURLとストレージに登録された全URLをチェックしマッチするかどうかを判定
// マッチした場合は、そのURLキーと同じ番号キーをすべて取得
// そのURLを持つタブ(今回はアクティブtab)に対し、バックグラウンド変更処理をインジェクト


chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    
    if (request.message === 'to_background') { // 特定の関数からのリクエストかどうかをチェック
        let delete_urls;
        if (request.option != undefined){
            delete_urls = request.option
        }

        chrome.tabs.query({}, (tabs) => {
           chrome.storage.sync.get(null, (datas) => {
                const TABS = tabs
                const DATA_NUM = Object.keys(datas).length
                const DATA_LENGTH = DATA_NUM !== undefined ? DATA_NUM/COL_NUM : 0;

                for (let t = 0; t < TABS.length; t++) {
                    for (let i = 1; i <= DATA_LENGTH; i++) {
                        // 正規表現を生成
                        let settings_url = datas[`url_row_${i}`];
                        if (settings_url !== "" && settings_url !== undefined){ // not empty and undefined
                            settings_url = settings_url.replace('*', '(.*)');
                            let re = new RegExp(settings_url); 
                            if (re.test(TABS[t].url)){ // url pattern match?
                                let options = {};
                                options['css_selector_row'] = datas[`css_selector_row_${i}`];
                                options['color_row'] = datas[`color_row_${i}`];
                                options['service_row'] = datas[`service_row_${i}`];
                                options['id_row'] = datas[`id_row_${i}`];
                                options['tab_id'] = TABS[t];
            
                                // which service to use?
                                switch (options['service_row']){
                                    case "aws":
                                        if (chrome.runtime.lastError) {
                                            console.error("メッセージ送信エラー:", chrome.runtime.lastError);
                                        } else {
                                            chrome.tabs.sendMessage(TABS[t].id, {message:'to_content_script', options:options, func:"aws"}).then((res)=>{}).catch((e)=>{console.log("runtimeError BG")});
                                            console.log("メッセージ送信成功。");
                                        }
                                        break;
                                    case "azure":
                                        chrome.tabs.sendMessage(TABS[t].id, {message:'to_content_script', options:options, func:"azure"}).then((res)=>{}).catch((e)=>{console.log("runtimeError BG")});
                                        break;
                                    default:
                                        if (chrome.runtime.lastError) {
                                            console.error("メッセージ送信エラー:", chrome.runtime.lastError);
                                        } else {
                                            chrome.tabs.sendMessage(TABS[t].id, {message:'to_content_script', options:options, func:"default"}).then((res)=>{}).catch((e)=>{console.log("runtimeError BG")});
                                            console.log("メッセージ送信成功。");
                                        }
                                }
                            }
                        }
                    }
                    // deleteボタンが押された時に背景をもとに戻す処理
                    if (delete_urls != undefined){
                        delete_urls.forEach(url => {
                            let pattern = url.replace('*', '(.*)');
                            let re = new RegExp(pattern);
                            console.log(delete_urls);
                            console.log(re);
                            console.log(TABS[t].url);
                            if (re.test(TABS[t].url)){ // url pattern match?
                                console.log(delete_urls);
                                chrome.tabs.sendMessage(TABS[t].id, {message:'to_content_script', options:"", func:"remove"}).then((res)=>{}).catch((e)=>{console.log("runtimeError BG")});
                                delete_urls.shift();
                            }
                        });
                    }
                }
            });
            sendResponse({message: "background received the request"});
        });
    }

    return true;
});


