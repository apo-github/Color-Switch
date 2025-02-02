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
      a.download = "data.json";
      a.click();
  
      URL.revokeObjectURL(url); // メモリ解放
      document.querySelector("#status").textContent = "データをエクスポートしました。";
    } catch (error) {
      console.error(error);
      document.querySelector("#status").textContent = "エクスポート中にエラーが発生しました。";
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
    alert("JSONファイルのみアップロードできます。");
    document.querySelector("#file-chooser").value = ""; // 選択をリセット
    return;
  }
  //アップロード処理
  try {
    file.text().then(text => { //fileからテキストを取得
      const datas = JSON.parse(text); 
      let data_length = Object.keys(datas).length
      if(import_type === "change-all"){
        setAllParams(datas, data_length); // ストレージに保存
      } else if(import_type === "change-diff"){
        setDiffParams(datas, data_length) // ストレージに保存
      }else{
        document.getElementById("status").textContent = "インポート中にエラーが発生しました。";
      }
      document.getElementById("status").textContent = "データをインポートしました。";
    }); 
  } catch (error) {
    console.error(error);
    document.getElementById("status").textContent = "インポート中にエラーが発生しました。";
  }
}

function setAllParams(datas, data_length){
    chrome.storage.sync.clear(); //clear data
    for (let i = 1; i <= data_length; i++){
      chrome.storage.sync.set(datas[`row${i}`])
    }
}

function setDiffParams(datas, data_length){
  //storage info
  chrome.storage.sync.get(null).then(stg_datas => {
    const stg_data_num = Object.keys(stg_datas).length
    const stg_data_length = stg_data_num !== undefined ? stg_data_num/5 : 0;
    //import diff datas
    for (let i = 1; i <= data_length; i++){
      let row_num = Number(Object.keys(datas)[i-1].split("row")[1])
      if(row_num > stg_data_length){ //if row number expand storage data length, import data is added the last row
        //change all key number
        datas = changeKey(datas, data_length, stg_data_length)
        //add it to last row.
        chrome.storage.sync.set(datas[`row${i}`])
      }else if(Number(row_num) <= stg_data_length){
        chrome.storage.sync.set(datas[`row${i}`]) //if storage has the same row number, import data is overrided.
      }else{
        console.log("データ形式が誤っている可能性があります")
      }
    }
  });
}

function changeKey(datas, data_length, stg_data_length){
  let parent_obj = {}
  for (let i = 1; i <= data_length; i++){
    let row_num = Number(Object.keys(datas)[i-1].split("row")[1])
    //add overflow data to last row
    if(row_num > stg_data_length){
      child_obj = { 
        [`url_row_${i}`] : datas[`row${row_num}`][`url_row_${row_num}`],
        [`css_selector_row_${i}`] : datas[`row${row_num}`][`css_selector_row_${row_num}`],
        [`color_row_${i}`] : datas[`row${row_num}`][`color_row_${row_num}`],
        [`service_row_${i}`] : datas[`row${row_num}`][`service_row_${row_num}`], 
        [`id_row_${i}`] : datas[`row${row_num}`][`id_row_${row_num}`]
      }
      parent_obj[`row${i}`] = child_obj
    }else{
      parent_obj[`row${i}`] = Object.values(datas)[i-1]
    }
  }
  return parent_obj
}