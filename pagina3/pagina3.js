document.addEventListener("DOMContentLoaded", () => {
  const total = parseFloat(localStorage.getItem('valorTotal')) || 0;
  document.getElementById('resumoPagamento').textContent = `Total: R$ ${total.toFixed(2)}`;

  document.getElementById("gerarPix").addEventListener("click", gerarPix);
  document.getElementById("finalizar").addEventListener("click", finalizarCompra);
  document.getElementById("editarPedido").addEventListener("click", editarPedido);
  document.getElementById("cancelarPedido").addEventListener("click", cancelarPedido);
});

function editarPedido() {
  // Apenas redireciona para a página 2 para recomeçar a seleção
  location.href = "../pagina2/pagina2.html";
}

function cancelarPedido() {
  const confirmar = confirm("Tem certeza de que deseja cancelar o pedido?");
  if (confirmar) {
    localStorage.removeItem("carrinho");
    localStorage.removeItem("valorTotal");
    localStorage.removeItem("tipoPrato");
    alert("Pedido cancelado com sucesso.");
    location.href = "../pagina1/pagina1.html";
  }
}


function gerarPix() {
  const valor = parseFloat(localStorage.getItem('valorTotal')) || 0;

  // DADOS REAIS — USANDO CPF COMO CHAVE PIX
  const chavePix = '02964990999'; // <- chave tipo CPF, válida e sem pontuação
  const nomeRecebedor = 'Gabi';
  const cidade = 'SAO PAULO';
  const txid = 'Pedido123'; // até 35 caracteres, pode ser dinâmico se quiser

  function format(id, value) {
    const size = value.length.toString().padStart(2, '0');
    return `${id}${size}${value}`;
  }

  // Campo 26: Merchant Account Information
  const merchantInfo =
    format("00", "BR.GOV.BCB.PIX") +
    format("01", chavePix) +
    format("02", txid);

  const campo26 = format("26", merchantInfo);

  // Campo 62: Additional Data Field Template (com TXID obrigatório)
  const campo62 = format("62", format("05", txid));

  // Monta o payload Pix (sem CRC)
  const payloadSemCRC =
    format("00", "01") +
    campo26 +
    format("52", "0000") +
    format("53", "986") +
    format("54", valor.toFixed(2)) +
    format("58", "BR") +
    format("59", nomeRecebedor.substring(0, 25)) +
    format("60", cidade.substring(0, 15)) +
    campo62 +
    "6304";

  // Função para calcular CRC16 (CCITT-FALSE)
  function crc16(str) {
    let crc = 0xFFFF;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if ((crc & 0x8000) !== 0) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  const payloadCompleto = payloadSemCRC + crc16(payloadSemCRC);

  // Renderiza o QR Code
  const qrCodeDiv = document.getElementById("qrcode");
  qrCodeDiv.innerHTML = '';
  document.getElementById("qrcode-area").style.display = "block";

  new QRCode(qrCodeDiv, {
    text: payloadCompleto,
    width: 250,
    height: 250,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H
  });

  const info = document.createElement("div");
  info.className = "nome-valor";
  info.innerHTML = `
    <p><strong>Nome:</strong> ${nomeRecebedor}</p>
    <p><strong>PIX (CPF):</strong> ${chavePix}</p>
    <p><strong>Valor:</strong> R$ ${valor.toFixed(2)}</p>
  `;
  qrCodeDiv.appendChild(info);
}

function finalizarCompra() {
  alert("Compra finalizada com sucesso!");
  localStorage.removeItem("carrinho");
  localStorage.removeItem("valorTotal");
  location.href = "../pagina1/pagina1.html";
}
