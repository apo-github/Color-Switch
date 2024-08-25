getParams() //初期ロード時の設定読み込み
const save_button = document.querySelector("#save");
const add_button = document.querySelector("#plus");
let isdelete = false;


save_button.addEventListener( "click", () => {
    if (isdelete) {
        deleteParams()
    }
    setParams(rowNum);
    isdelete = false;
});

add_button.addEventListener('click', function(){
    // rowNum = document.querySelectorAll(".row").length;
    console.log("rownum: ", rowNum);
    rowNum++;
    console.log("rownum: ", rowNum);
    addBlock(rowNum);
});

// // ボタンの非活性処理を追加
// const service_select_btn = document.querySelector("select-service");
// service_select_btn.addEventListener( "click", () => {
//     if (service_select_btn.value == "") {
//         service_select_btn.disabled = true;
//     }
// })


function getParams() {
    // storage.sync.get()値がなければデフォルト値が採用される
    // chrome.storage.sync.clear();  // 開発用
    chrome.storage.sync.get(null, function (datas) {
        const data_num = Object.keys(datas).length
        const data_length = data_num !== undefined ? data_num/5 : 0;
        console.log(data_length);
        console.log(datas);

        for (let i = 1; i <= data_length; i++) {
            if (i > 1){
                addBlock(i);
            }
            document.querySelector(`#url-row-${i}`).value = datas[`url_row_${i}`];
            document.querySelector(`#css-selector-row-${i}`).value = datas[`query_selector_row_${i}`];
            document.querySelector(`#color-row-${i}`).value = datas[`color_row_${i}`];
            document.querySelector(`#service-row-${i}`).value = datas[`service_row_${i}`];
            document.querySelector(`#id-row-${i}`).value = datas[`id_row_${i}`];        
        }

        window.rowNum = document.querySelectorAll(".row").length; // グローバル変数
        
        // 削除ボタン
        delete_button = document.querySelectorAll('button[id^="delete-row-"]');
        console.log(delete_button);
        delete_button.forEach(button => {
            button.addEventListener('click', function(event) {
                const clickedButtonId = event.target.id;
                console.log(clickedButtonId);
                const buttonNumber = clickedButtonId.match(/\d+/);
                isdelete = true;
        
                deleteBrock(buttonNumber);
            });
        });
    });
}

function setParams(){
    chrome.storage.sync.clear();  // 開発用
    console.log("Popup.js > setParams");
    console.log("rowNum: ", rowNum);
    let data_obj = {};

    for (let i = 1; i <= rowNum; i++){
        console.log("save-num:", i);
        let URL = document.querySelector(`#url-row-${i}`).value;
        let CSS_SELECTOR = document.querySelector(`#css-selector-row-${i}`).value;
        let COLOR = document.querySelector(`#color-row-${i}`).value;
        let SERVICE = document.querySelector(`#service-row-${i}`).value;
        let ID = document.querySelector(`#id-row-${i}`).value;

        data_obj[`url_row_${i}`] = URL;
        data_obj[`query_selector_row_${i}`] = CSS_SELECTOR;
        data_obj[`color_row_${i}`] = COLOR;
        data_obj[`service_row_${i}`] = SERVICE;
        data_obj[`id_row_${i}`] = ID; 
    }

    chrome.storage.sync.set(data_obj, function () {
        alert("Saved your settings(｀・ω・´)");
    });

    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        // content_script へデータを送る
        chrome.tabs.sendMessage(tabs[0].id, { // content_script はタブごとに存在するため ID 指定する必要がある
          key: 'to-content-script'
        })
    });
    
}

function deleteParams(){
    chrome.storage.sync.clear();
    updateRowId();
}


function deleteBrock(delete_No){
    document.querySelector(`#url-row-${delete_No}`).remove();
    document.querySelector(`#css-selector-row-${delete_No}`).remove();
    document.querySelector(`#color-row-${delete_No}`).remove();
    document.querySelector(`#service-row-${delete_No}`).remove();
    document.querySelector(`#id-row-${delete_No}`).remove();
    document.querySelector(`#delete-row-${delete_No}`).remove();
    rowNum--;
    // console.log(rowNum)
}


function updateRowId(){
    let row_number = []
    document.querySelectorAll('input[id^="url-row-"]').forEach((element, i) => {
        row_number.push({oldNo: element.id.match(/\d+/)[0], newNo: i+1});
    });
    console.log(row_number);

    row_number.forEach(item => {
        console.log("item: ", item);
        // console.log(document.querySelector(`#url-row-${item}`).id);
        // console.log(document.querySelector(`#url-row-${item}`));
        // console.log(row_number);

        document.querySelector(`#url-row-${item.oldNo}`).id = `url-row-${item.newNo}`;
        document.querySelector(`#css-selector-row-${item.oldNo}`).id = `css-selector-row-${item.newNo}`;
        document.querySelector(`#color-row-${item.oldNo}`).id = `color-row-${item.newNo}`;
        document.querySelector(`#service-row-${item.oldNo}`).id = `service-row-${item.newNo}`;
        document.querySelector(`#id-row-${item.oldNo}`).id = `id-row-${item.newNo}`;
        document.querySelector(`#delete-row-${item.oldNo}`).id = `delete-row-${item.newNo}`;

        console.log(document.querySelector(`#url-row-${item.newNo}`).id);
        console.log("end")
    });
}


function addBlock(rowNumber){
    const URL = `url-row-${rowNumber}`;
    const CSS_SELECTOR = `css-selector-row-${rowNumber}`;
    const COLOR = `color-row-${rowNumber}`;
    const SERVICE = `service-row-${rowNumber}`
    const ID = `id-row-${rowNumber}`;
    const DELETE = `delete-row-${rowNumber}`

    const newRowHTML = `
      <div class="row">
        <div class="col-5">
          <div class="mb-3">
              <input
              class="form-control"
              id="${URL}"
              placeholder=""
              />
          </div>
        </div>
        <div class="col-2 pe-0">
            <div class="mb-3">
                <input
                class="form-control" 
                id="${CSS_SELECTOR}"
                placeholder=""
                />
            </div>
        </div>
        <div class="col ps-0">
          <div class="mb-3">
              <select id="${COLOR}" class="form-select form-select">
                <option value="blue">Blue</option>
                <option value="green">Green</option>
                <option value="#CC9900">Gold</option>
                <option value="crimson">Crimson</option>
              </select>
          </div>
        </div>
        <div class="col pe-0">
          <div class="mb-3">
              <select id="${SERVICE}" class="select-service form-select form-select">
                <option value="none"></option>
                <option value="aws">AWS</option>
                <option value="azure">Azure</option>
              </select>
          </div>
        </div>
        <div class="col-2 ps-0">
          <div class="mb-3">
              <input
                class="form-control"
                id="${ID}"
                placeholder=""
                />
          </div>
        </div>
        <button class="form-control btn btn-danger" id="${DELETE}"></button>
      </div>
    `;
    
    const plusButton = document.querySelector("#plus");
    plusButton.insertAdjacentHTML('beforebegin', newRowHTML);
}



