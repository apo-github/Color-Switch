function save_options() {
    const URL_1 = document.querySelector("#url-row-1").value;
    const CSS_SELECTOR_1 = document.querySelector("#css-selector-row-1").value;
    const COLOR_1 = document.querySelector("#color-row-1").value;
    const AWS_ID_1 = document.querySelector("#aws-id-row-1").value;

    // const URL_2 = document.querySelector("#url-row-2").value;
    // const CSS_SELECTOR_2 = document.querySelector("#css-selector-row-2").value;
    // const COLOR_2 = document.querySelector("#color-row-2").value;
    // const AWS_ID_2 = document.querySelector("#aws-id-row-2").value;

    // chrome.storage.sync.set({
    //     url_row_1: URL_1,
    //     css_selector_row_1: CSS_SELECTOR_1,
    //     color_row_1:COLOR_1,
    //     aws_id_row_1: AWS_ID_1,
    //     // url_row_2: URL_2,
    //     // css_selector_row_2: CSS_SELECTOR_2,
    //     // color_row_2:COLOR_2,
    //     // aws_id_row_2: AWS_ID_2
    // }, function() {
    //     // Update status to let user know options were saved.
    //     alert("saved your settings(｀・ω・´)");
    // });


    for (let i = 1; i <= , )
        chrome.storage.sync.set({
            url_row_${i}: URL_${i},
            css_selector_row_${i}: CSS_SELECTOR_${i},
            color_row_${i}:COLOR_${i},
            aws_id_row_${i}: AWS_ID_${i},
        }, function() {
            // Update status to let user know options were saved.
            alert("saved your settings(｀・ω・´)");
        });
}

