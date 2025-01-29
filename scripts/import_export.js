//インポート・エクスポート
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
      [`url-row-${i}`] : datas[`url_row_${i}`],
      [`css-selector-row-${i}`] : datas[`query_selector_row_${i}`],
      [`color-row-${i}`] : datas[`color_row_${i}`],
      [`service-row-${i}`] : datas[`service_row_${i}`], 
      [`id-row-${i}`] : datas[`id_row_${i}`]
    }
    console.log(child_obj)
    parent_obj[`row${i}`] = child_obj
  }
  return parent_obj
}