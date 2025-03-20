// メッセージ
const SUCCESSED_IMP_MSG = "Success!\nデータをインポートしました。"
const SUCCESSED_EXP_MSG = "Success!\nデータをエクスポートしました。"
const ERROR_IMP_MSG = "An error occurred during import.\nインポート中にエラーが発生しました。" 
const ERROR_EXP_MSG = "An error occurred during export.\nエクスポート中にエラーが発生しました。"  
const FORMAT_ALERT_MSG = "Only JSON files are available.\nJSONファイルのみアップロードできます。"
const FILE_ERROR_MSG = "JSON format may be incorrect.\nJSONの形式が誤っている可能性があります。"

//ツールチップ
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

//エクスポート
document.querySelector("#export").addEventListener("click", async () => {
    try {
      const datas = await chrome.storage.sync.get(null); // 全てのデータを取得
      const result = convert_json(datas)
      const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
  
      // ダウンロードリンクを生成してクリック
      const a = document.createElement("a");
      a.href = url;
      a.download = "color_settings.json";
      a.click();
  
      URL.revokeObjectURL(url); // メモリ解放
      alert(SUCCESSED_EXP_MSG);
    } catch (error) {
      console.error(error);
      alert(ERROR_EXP_MSG);
    }
});

function convert_json(datas){ 
  const row_length = Object.keys(datas).length //row length
  const parent_obj = []
  for (let i = 1; i <= row_length; i++) {
    child_obj = {
      [`url`] : datas[`row${i}`][`url`],
      [`css_selector`] : datas[`row${i}`][`css_selector`],
      [`color`] : datas[`row${i}`][`color`],
      [`service`] : datas[`row${i}`][`service`], 
      [`id`] : datas[`row${i}`][`id`]
    }
    parent_obj.push(child_obj);
  }
  return parent_obj
}

// インポート処理
document.querySelector("#change-all").addEventListener('click', commonFunc);
document.querySelector("#change-add").addEventListener('click', commonFunc);
//インポート用共通関数
function commonFunc(e){
  const import_type = e.target.id
  const file = document.querySelector("#file-chooser").files[0];
  // ファイルチェック
  if (!file) return;
  if (!file.name.endsWith(".json")) {
    alert(FORMAT_ALERT_MSG);
    document.querySelector("#file-chooser").value = ""; // 選択をリセット
    return;
  }
  //アップロード処理
  file.text().then(text => { //fileからテキストを取得
    const datas = JSON.parse(text); //この時点でarray型
    const row_length = datas.length
    if(import_type === "change-all"){
      setAllParams(datas, row_length); // ストレージに保存
    } else if(import_type === "change-add"){
      setAddParams(datas, row_length) // ストレージに保存
    }else{
      alert(ERROR_IMP_MSG);
    }
    alert(SUCCESSED_IMP_MSG);
  }).catch(e => {
    let error_msg = ERROR_IMP_MSG
    if(e instanceof SyntaxError){
      error_msg = FILE_ERROR_MSG
    }
    alert(error_msg)
  })
}

function sortDatas(datas){ //ソートされたKeyの配列を返す関数
  let sort_name_array = Object.keys(datas).sort((a, b) => {
    return Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]);
  });
  return sort_name_array
}

function setAllParams(datas, row_length){
    chrome.storage.sync.clear(); //clear data
    const parent_obj = {}
    for (let i = 0; i < row_length; i++){
      child_obj = {
        [`url`] : datas[i][`url`],
        [`css_selector`] : datas[i][`css_selector`],
        [`color`] : datas[i][`color`],
        [`service`] : datas[i][`service`], 
        [`id`] : datas[i][`id`]
      }
      console.log("setAllParams" , child_obj)
      parent_obj[`row${i+1}`] = child_obj
    }
    console.log(parent_obj)
    chrome.storage.sync.set(parent_obj)
}

function setAddParams(datas, row_length){
  //storage info
  chrome.storage.sync.get(null).then(storage_datas => {
    const storage_data_length = Object.keys(storage_datas).length
    const storage_add_num = storage_data_length + 1
    //import Add datas
    const parent_obj = {}
    for (let i = 0; i < row_length; i++){
      child_obj = {
        [`url`] : datas[i][`url`],
        [`css_selector`] : datas[i][`css_selector`],
        [`color`] : datas[i][`color`],
        [`service`] : datas[i][`service`], 
        [`id`] : datas[i][`id`]
      }
      console.log("setAddParams" , child_obj)
      parent_obj[`row${storage_add_num+i}`] = child_obj
    }
    chrome.storage.sync.set(parent_obj)
  });
}

