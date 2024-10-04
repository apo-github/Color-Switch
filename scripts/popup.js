getParams() //初期ロード時の設定読み込み
const save_button = document.querySelector("#save");
const add_button = document.querySelector("#plus");
const info_icon = document.querySelector("#info-icon")
let isdelete = false;
let delete_urls = [];
let last_block_No;

save_button.addEventListener( "click", () => {
    if (isdelete) {
        deleteParams();
        chrome.runtime.sendMessage({ message: "to_background", option: delete_urls }, (response) => {});
    }
    setParams(rowNum);
    isdelete = false;
});

add_button.addEventListener('click', function(){
    rowNum++;
    last_block_No++;
    
    addBlock(last_block_No);
    document.querySelector(`#delete-row-${last_block_No}`).addEventListener('click', deleteButtonFunc);
    document.querySelector(`#service-row-${last_block_No}`).addEventListener("click", selectButtonFunc);
    document.querySelector(`#css-selector-row-${last_block_No}`).addEventListener("focus", cssValidateFunc);
    document.querySelector(`#css-selector-row-${last_block_No}`).addEventListener("blur", cssValidateFunc);
    document.querySelector(`#url-row-${last_block_No}`).addEventListener("focus", urlValidateFunc);
    document.querySelector(`#url-row-${last_block_No}`).addEventListener("blur", urlValidateFunc);
    
});

info_icon.addEventListener('click', function(){
    chrome.tabs.create({"url": "./view/info.html" });
})


function deleteButtonFunc(event){
    const clickedButtonId = event.target.id;
    const buttonNumber = clickedButtonId.match(/\d+/);
    console.log(clickedButtonId);
    isdelete = true;
    deleteBrock(buttonNumber);
}

function selectButtonFunc(event){
    const elem = event.target
    const clickedButtonId = elem.id;
    const buttonNumber = clickedButtonId.match(/\d+/);

    if (elem.value == "none"){
        document.querySelector(`#id-row-${buttonNumber}`).disabled = true;
    }else{
        document.querySelector(`#id-row-${buttonNumber}`).disabled = false;
    }
}

// バリデーション
function urlValidateFunc(event){
    const elem = event.target
    const elem_parent = elem.closest(".url-div");

    if (event.type == "focus"){
        elem_parent.classList.remove('was-validated');
    }else if (event.type == "blur"){
        if (elem.value != "") {
            elem_parent.classList.add('was-validated');
        }
    }
}

function isHTMLUnknownElement(tag){
    try{
        const elem = document.createElement(tag);
        return elem instanceof HTMLUnknownElement
    } catch (error){
        return true
    }    
}

function cssValidateFunc(event){
    const elem = event.target
    const elem_value = elem.value

    if (event.type == "focus"){
        elem.classList.remove("is-invalid")
        elem.classList.remove("is-valid")
    }else if(event.type == "blur"){
        if (elem_value != "") {
            if (isHTMLUnknownElement(elem_value) && elem_value.indexOf('.') !== 0 && elem_value.indexOf('#') !== 0){
                elem.classList.add("is-invalid")
            }else{
                elem.classList.remove("is-invalid")
                elem.classList.add("is-valid")
            }
        }
    }

    
}


function getParams() {
    // storage.sync.get()値がなければデフォルト値が採用される
    // chrome.storage.sync.clear();  // 開発用
    chrome.storage.sync.get(null, function (datas) {
        const data_num = Object.keys(datas).length
        const data_length = data_num !== undefined ? data_num/5 : 0;

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
        last_block_No = rowNum;
        
        // 削除ボタン
        delete_button = document.querySelectorAll('button[id^="delete-row-"]');
        delete_button.forEach(button => {
            button.addEventListener('click', deleteButtonFunc);
        });

        // service バリデーション（ボタン非活性化）
        select_button = document.querySelectorAll('select[id^="service-row-"]');
        select_button.forEach(btn => {
            btn.addEventListener("click", selectButtonFunc);
        })

        // URL バリデーション
        url_button = document.querySelectorAll('input[id^="url-row-"]');
        url_button.forEach(btn => {
            btn.addEventListener("focus", urlValidateFunc);
            btn.addEventListener('blur', urlValidateFunc);
        })

        // CSS Selectorバリデーション
        css_selector_button = document.querySelectorAll('input[id^="css-selector-row-"]');
        css_selector_button.forEach(btn => {
            btn.addEventListener("focus", cssValidateFunc);
            btn.addEventListener('blur', cssValidateFunc);
        })

    });
}

function setParams(){
    chrome.storage.sync.clear();  // 開発用
    let data_obj = {};

    for (let i = 1; i <= rowNum; i++){
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

    chrome.runtime.sendMessage({ message: "to_background" }, (response) => {});
    
    
}

function deleteParams(){
    chrome.storage.sync.clear();
    updateRowId();
}


function deleteBrock(delete_No){
    delete_urls.push(document.querySelector(`#url-row-${delete_No}`).value); // backgroundにurlsを渡すのに必要
    document.querySelectorAll('.row')[delete_No-1].remove();
    rowNum--;
    
    if (last_block_No == delete_No){
        last_block_No = rowNum;
    }
}


function updateRowId(){
    let row_number = []
    document.querySelectorAll('input[id^="url-row-"]').forEach((element, i) => {
        row_number.push({oldNo: element.id.match(/\d+/)[0], newNo: i+1});
    });

    row_number.forEach(item => {
        document.querySelector(`#url-row-${item.oldNo}`).id = `url-row-${item.newNo}`;
        document.querySelector(`#css-selector-row-${item.oldNo}`).id = `css-selector-row-${item.newNo}`;
        document.querySelector(`#color-row-${item.oldNo}`).id = `color-row-${item.newNo}`;
        document.querySelector(`#service-row-${item.oldNo}`).id = `service-row-${item.newNo}`;
        document.querySelector(`#id-row-${item.oldNo}`).id = `id-row-${item.newNo}`;
        document.querySelector(`#delete-row-${item.oldNo}`).id = `delete-row-${item.newNo}`;
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
        <div class="col-4">
          <div class="mb-3 url-div">
              <input
              type="url"
              class="form-control"
              id="${URL}"
              placeholder=""
              required
              />
          </div>
        </div>
        <div class="col-2 pe-0">
            <div class="mb-3 css-div">
                <input
                class="form-control" 
                id="${CSS_SELECTOR}"
                placeholder=""
                required
                />
            </div>
        </div>
        <div class="col ps-0">
          <div class="mb-3">
              <input class="form-control form-control-color" type="color" id="${COLOR}" value="#eabc6c" />
          </div>
        </div>
        <div class="col-2 pe-0">
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
                disabled
                />
          </div>
        </div>
        <div class="col-1 p-0 ">
          <div class="mb-3">
            <button
              class="form-control bi bi-trash-fill"
              id="${DELETE}"
            ></button>
          </div>
        </div>
      </div>
    `;
    
    const plusButton = document.querySelector("#plus");
    plusButton.insertAdjacentHTML('beforebegin', newRowHTML);
}



