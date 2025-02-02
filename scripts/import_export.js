//エクスポート
document.querySelector("#export").addEventListener("click", async () => {
    console.log("押されました")
    try {
      const data = await chrome.storage.sync.get(null); // 全てのデータを取得
      console.log(data)
      const result = convert_json(data)
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
    console.log(child_obj)
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
  console.log(e.target.id)
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
      const data = JSON.parse(text); 
      let data_length = Object.keys(data).length
      if(import_type === "change-all"){
        setAllParams(data, data_length); // ストレージに保存
      } else if(import_type === "change-diff"){
        setDiffParams(data, data_length) // ストレージに保存
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

function setAllParams(data, data_length){
    chrome.storage.sync.clear(); //clear data
    for (let i = 1; i <= data_length; i++){
      chrome.storage.sync.set(data[`row${i}`])
    }
}

function setDiffParams(data, data_length){
  chrome.storage.sync.clear(); //clear data
  for (let i = 1; i <= data_length; i++){
    chrome.storage.sync.set(data[`row${i}`])
  }
}