document.querySelector(".btn-outline-secondary").addEventListener('click', function(){
    // 複製元の要素
    let originalBlock = document.querySelectorAll('.row')[1];
    
    // 複製（trueを渡すことで子要素含めた複製になる）
    let cloneBlock = originalBlock.cloneNode(true);
    originalBlock.insertAdjacentElement('afterend', cloneBlock);

})