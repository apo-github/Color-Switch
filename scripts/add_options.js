window.addBlock = addBlock;

document.querySelector(".btn-outline-secondary").addEventListener('click', function(){
    
    window.rowNum = document.querySelectorAll(".row").length+1;
    console.log(rowNum);
    addBlock(rowNum);
})


function addBlock(rowNumber){
    const URL = `url-row-${rowNumber}`;
    const CSS_SELECTOR = `css-selector-row-${rowNumber}`;
    const COLOR = `color-row-${rowNumber}`;
    const SERVICE = `service-row-${rowNumber}`
    const ID = `id-row-${rowNumber}`;

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
      </div>
    `;
    
    const plusButton = document.querySelector("#plus");
    plusButton.insertAdjacentHTML('beforebegin', newRowHTML);
}


