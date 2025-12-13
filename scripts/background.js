const COL_NUM = 5

// すべてのタブ（tabs）のidを取得し、tab id ごとにcontent_scriptを実行する
// ストレージから全データを取り出す
// アクティブタブのURLとストレージに登録された全URLをチェックしマッチするかどうかを判定
// マッチした場合は、そのURLキーと同じ番号キーをすべて取得
// そのURLを持つタブ(今回はアクティブtab)に対し、バックグラウンド変更処理をインジェクト

function convert_params(datas){
    //データとる
    const data_num = Object.keys(datas).length
    const data_length = data_num !== undefined ? data_num/5 : 0;
    const parent_obj = {}
    if(datas["row1"] == undefined){
        //コンバート
        for (let i = 1; i <= data_length; i++) {
            child_obj = {
                [`url`] : datas[`url_row_${i}`],
                [`css_selector`] : datas[`css_selector_row_${i}`],
                [`color`] : datas[`color_row_${i}`],
                [`service`] : datas[`service_row_${i}`], 
                [`id`] : datas[`id_row_${i}`]
            }
            parent_obj[`row${i}`] = child_obj
        }
        //clear
        chrome.storage.sync.clear();
        //set
        chrome.storage.sync.set(parent_obj);
        return parent_obj
    }else{
        //コンバートしない
        return datas
    }
}

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    
    if (request.message === 'to_background') { // 特定の関数からのリクエストかどうかをチェック
        let delete_urls;
        if (request.option != undefined){
            delete_urls = request.option
        }

        chrome.tabs.query({}, (tabs) => {
           chrome.storage.sync.get(null, (datas) => {
                datas = convert_params(datas) //データをコンバート（次期バージョンでconvert処理は廃止予定）
                const TABS = tabs
                const ROW_LENGTH = Object.keys(datas).length //row length

                for (let t = 0; t < TABS.length; t++) {
                    for (let i = 1; i <= ROW_LENGTH; i++) {
                        // 正規表現を生成
                        let settings_url = datas[`row${i}`][`url`];
                        if (settings_url !== "" && settings_url !== undefined){ // not empty and undefined
                            let re = new RegExp(settings_url); 
                            if (re.test(TABS[t].url)){ // url pattern match?
                                let options = {};
                                options['css_selector_row'] = datas[`row${i}`][`css_selector`];
                                options['color_row'] = datas[`row${i}`][`color`];
                                options['service_row'] = datas[`row${i}`][`service`];
                                options['id_row'] = datas[`row${i}`][`id`];
                                options['tab_id'] = TABS[t];
            
                                // which service to use?
                                switch (options['service_row']){
                                    case "aws":
                                        if (chrome.runtime.lastError) {
                                            console.error("メッセージ送信エラー:", chrome.runtime.lastError);
                                        } else {
                                            chrome.tabs.sendMessage(TABS[t].id, {message:'to_content_script', options:options, func:"aws"}).then((res)=>{}).catch((e)=>{console.log("runtimeError BG")});
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
                                        }
                                }
                            }
                        }
                    }
                    // deleteボタンが押された時に背景をもとに戻す処理
                    if (delete_urls != undefined){
                        delete_urls.forEach(url => {
                            let re = new RegExp(url);
                            if (re.test(TABS[t].url)){ // url pattern match?
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


