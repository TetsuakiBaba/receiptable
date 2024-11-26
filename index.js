var version = `Last modified: 2024/11/26 10:30:12
`;


function updateReceivedFrom(dom) {
    document.querySelector('#received_from').innerText = dom.value;
}

function updateReceivedBy(dom) {
    document.querySelector('#received_by').innerText = dom.value;
}

function updateReceivedAddress(dom) {
    document.querySelector('#received_address').innerText = dom.value;
}


function updatePaymentAmount(dom) {
    document.querySelector('#payment_amount').innerText = dom.value;
}

function updatePaymentFor(dom) {
    document.querySelector('#payment_for').innerText = dom.value;
}

function updatePaymentAddress(dom) {
    document.querySelector('#payment_address').innerText = dom.value;
}

function showShareLink() {
    const params = new URLSearchParams({
        received_from: document.querySelector('#input_received_from').value,
        received_by: document.querySelector('#input_received_by').value,
        payment_amount: document.querySelector('#input_payment_amount').value,
        payment_for: document.querySelector('#input_payment_for').value,
        payment_address: document.querySelector('#input_payment_address').value
    });

    let link = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    document.querySelector('#share_link').value = link;
    document.querySelector('#share_link').select();
    document.execCommand('copy');
}


var canvas;
var signaturePad;
window.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#version').innerText = version;

    var today = new Date();
    document.querySelector('#date').innerHTML = today;


    canvas = document.querySelector("canvas");
    canvas.width = document.querySelector('.card-body').clientWidth;
    console.log(document.querySelector('#signature').clientWidth);

    signaturePad = new SignaturePad(canvas,
        {
            minWidth: 0.5,
            maxWidth: 2.5,
            penColor: "rgb(0, 0, 150)"
        }
    );

    function resizeCanvas() {
        canvas.width = document.querySelector('.card-body').clientWidth;
        signaturePad.clear(); // otherwise isEmpty() might return incorrect value
    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();


    let url = new URL(window.location.href);

    // URLSearchParamsオブジェクトを取得
    let params = url.searchParams;

    // getメソッド
    console.log(params.get('received_from'));
    console.log(params.get('received_by'));
    console.log(params.get('payment_amount'));
    console.log(params.get('payment_for'));
    console.log(params.get('payment_address'));

    document.querySelector('#input_received_from').value = params.get('received_from') || '';
    document.querySelector('#input_received_by').value = params.get('received_by') || '';
    document.querySelector('#input_payment_amount').value = params.get('payment_amount') || '';
    document.querySelector('#input_payment_for').value = params.get('payment_for') || '';
    document.querySelector('#input_payment_address').value = params.get('payment_address') || '';

    function updateStatement() {
        document.querySelector('#received_from').innerText = document.querySelector('#input_received_from').value;
        document.querySelector('#received_by').innerText = document.querySelector('#input_received_by').value;
        document.querySelector('#payment_amount').innerText = document.querySelector('#input_payment_amount').value;
        document.querySelector('#payment_for').innerText = document.querySelector('#input_payment_for').value;
        document.querySelector('#payment_address').innerText = document.querySelector('#input_payment_address').value;
    }
    updateStatement();
});



function buildElement(name_tag, innerHTML, str_class, str_style, element_appended) {
    let element = document.createElement(name_tag);
    if (innerHTML) element.innerHTML = innerHTML;
    if (str_class) element.classList = str_class;
    if (str_style) element.setAttribute('style', str_style);
    if (element_appended) element_appended.appendChild(element);
    return element;
}



function downloadPDF() {
    const element = document.querySelector('#pdf_element'); // 対象要素を指定
    const option = {
        margin: 10, // 余白
        filename: `${document.querySelector('#input_received_by').value}_${document.querySelector('#input_payment_for').value}.pdf`, // ファイル名
        //image: { type: 'png', quality: 1 }, // PDFの生成に使用される画像のタイプとクオリティ
        html2canvas: {
            scale: window.devicePixelRatio * 2,
            useCORS: false,
            scrollY: 0,
        }, // html2canvasで使用される設定を記述。useCORS: trueを設定すると別ドメインの画像を表示できる（サイトによってはできないこともある）
        jsPDF: { format: 'a4', orientation: 'portrait' }, // jsPDFで使用される設定を記述
        pagebreak: { avoid: ['li', 'h5'] },
    };

    console.log();

    html2pdf()
        .set(option)
        .from(element)
        .save()
        .then(() => {
            // 成功
        })
        .catch((e) => {
            // 失敗
        });
}
