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
  const data_num = Object.keys(datas).length
  const data_length = data_num !== undefined ? data_num/5 : 0;
  const parent_obj = {}
  for (let i = 1; i <= data_length; i++) {
    child_obj = {
      [`url_row_${i}`] : datas[`url_row_${i}`],
      [`css_selector_row_${i}`] : datas[`css_selector_row_${i}`],
      [`color_row_${i}`] : datas[`color_row_${i}`],
      [`service_row_${i}`] : datas[`service_row_${i}`], 
      [`id_row_${i}`] : datas[`id_row_${i}`]
    }
    parent_obj[`row${i}`] = child_obj
  }
  return parent_obj
}

// インポート処理
document.querySelector("#change-all").addEventListener('click', commonFunc);
document.querySelector("#change-diff").addEventListener('click', commonFunc);
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
    const datas = JSON.parse(text); 
    const data_length = Object.keys(datas).length
    const sort_name_array = sortDatas(datas) //ソート
    if(import_type === "change-all"){
      setAllParams(datas, sort_name_array, data_length); // ストレージに保存
    } else if(import_type === "change-diff"){
      setDiffParams(datas, sort_name_array, data_length) // ストレージに保存
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

function setAllParams(datas, sort_name_array, data_length){
    chrome.storage.sync.clear(); //clear data
    for (let i = 1; i <= data_length; i++){
      //番号を1から振りなおす処理
      let row_num = Number(sort_name_array[i-1].split("row")[1])
      let keys = Object.keys(datas[`row${row_num}`])
      child_obj = {}
      child_obj[`url_row_${i}`] = datas[`row${row_num}`][keys[0]]
      child_obj[`css_selector_row_${i}`] = datas[`row${row_num}`][keys[1]]
      child_obj[`color_row_${i}`] = datas[`row${row_num}`][keys[2]]
      child_obj[`service_row_${i}`] = datas[`row${row_num}`][keys[3]]
      child_obj[`id_row_${i}`] = datas[`row${row_num}`][keys[4]]
      //storageにセットする処理
      console.log("child_obj")
      console.log(child_obj)
      chrome.storage.sync.set(child_obj)
    }
}

function setDiffParams(datas, sort_name_array, data_length){
  //storage info
  chrome.storage.sync.get(null).then(stg_datas => {
    const stg_data_num = Object.keys(stg_datas).length
    let stg_data_length = stg_data_num !== undefined ? stg_data_num/5 : 0;
    //import diff datas
    for (let i = 1; i <= data_length; i++){
      let row_num = Number(sort_name_array[i-1].split("row")[1]) //get json key
      if(row_num > stg_data_length){ //if row number expand storage data length, import data is added the last row
        stg_data_length += 1
        //change all key number
        let child_obj = changeKey(stg_data_length, row_num, datas)
        //add it to last row.
        chrome.storage.sync.set(child_obj)
      }else if(row_num <= stg_data_length){
        let child_obj = changeKey(row_num, row_num, datas)
        chrome.storage.sync.set(child_obj) //if storage has the same row number, import data is overrided.
      }else{
        alert(ERROR_IMP_MSG)
      }
    }
  });
}

function changeKey(i, row_num, datas){
  //add overflow data to last row
  let keys = Object.keys(datas[`row${row_num}`])
  child_obj = { 
    [`url_row_${i}`] : datas[`row${row_num}`][keys[0]],
    [`css_selector_row_${i}`] : datas[`row${row_num}`][keys[1]],
    [`color_row_${i}`] : datas[`row${row_num}`][keys[2]],
    [`service_row_${i}`] : datas[`row${row_num}`][keys[3]], 
    [`id_row_${i}`] : datas[`row${row_num}`][keys[4]]
  } 
  return child_obj
}