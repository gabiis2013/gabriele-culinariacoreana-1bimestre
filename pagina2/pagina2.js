const tipoPrato = localStorage.getItem("tipoPrato");

const pratosApimentados = [
  { nome: "Kimchi Jjigae", 
    descricao: "Ensopado apimentado com kimchi e tofu.", 
    imagem: "../imagens/kimchi.png", 
    preco: 21.50 },
  { nome: "Tteokbokki", 
    descricao: "Bolinhos de arroz cozidos em molho de gojuchang picante.", 
    imagem: "../imagens/tteokbokki.png", 
    preco: 28.00 },
  { nome: "Buldak",
    descricao: "Frango grelhado ultra apimentado.", 
    imagem: "../imagens/buldak.png",
    preco: 32.90 },
  { nome: "Bibimbap Apimentado", 
    descricao: "Arroz misturado com legumes, carne e pimenta.", 
    imagem: "../imagens/bibimbap.png", 
    preco: 27.00 },
  { nome: "Jjamppong", 
    descricao: "Sopa de macarrão com frutos-do-mar e caldo vermelho apimentado.",
    imagem: "../imagens/jjamppong.png",
    preco: 34.00 },
  { nome: "Dak Galbi",
    descricao: "Frango frito com legumes e massa de pimenta gochujang.",
    imagem: "../imagens/dak galbi.png",
    preco: 30.00},
  { nome: "Sundubu Jjigae",
    descricao: "Ensopado de tofu macio com frutos-do-mar e pimenta.",
    imagem: "../imagens/sundubu.png",
    preco: 26.50},
  { nome: "Ojingeo Bokkeum",
    descricao: "Lula salteada com legumes em molho picante.",
    imagem: "../imagens/ojingeo bokkeum.png",
    preco: 33.00}
];

const pratosNaoApimentados = [
  {  nome: "Japchae", descricao: "Macarrão de batata-doce com legumes.", imagem: "./../imagens/Japchae.png", preco: 24.00 },
  { nome: "Samgyeopsal", descricao: "Churrasco de barriga de porco grelhada.", imagem: "./../imagens/samgyeopsal.png", preco: 30.00 },
  { nome: "Galbitang", descricao: "Sopa clara de costela bovina.", imagem:  "./../imagens/galbitang.png", preco: 26.50 },
  { nome: "Kimbap", descricao: "Rolinho de arroz com vegetais e carne.", imagem:  "./../imagens/kimchi.png", preco: 21.75 }
];

const quantidades = {};
const selecionados = {};
let totalCarrinho = 0;

function criarHTML(pratos, titulo) {
  let html = `<h2>${titulo}</h2>`;

  pratos.forEach((prato, index) => {
    quantidades[index] = 0;
    selecionados[index] = false;

    html += `
      <div class="prato">
        <img src="${prato.imagem}" alt="${prato.nome}" style="width: 200px; height: auto;">
        <div class="prato-info">
          <h3>${prato.nome}</h3>
          <p>${prato.descricao}</p>
          <p>Preço unitário: R$ ${prato.preco.toFixed(2)}</p>
          <div id="controle-${index}">
            <p>Quantidade: <span id="quantidade-${index}">0</span></p>
            <button onclick="aumentarQuantidade(${index})">▲</button>
            <button id="diminuir-${index}" onclick="diminuirQuantidade(${index})" style="display: none;">▼</button>
            <p>Preço total: R$ <span id="preco-${index}">0.00</span></p>
            <button onclick="selecionarPrato('${prato.nome}', ${index}, ${prato.preco})">Selecionar no carrinho</button>
          </div>
        </div>
      </div>
    `;
  });

  html += `<div class="carrinho"><strong>Total do Carrinho: R$ <span id="total-carrinho">0.00</span></strong></div>`;
  document.getElementById("pratos").innerHTML = html;
}

function aumentarQuantidade(index) {
  const quantidadeSpan = document.getElementById(`quantidade-${index}`);
  const botaoDiminuir = document.getElementById(`diminuir-${index}`);

  let quantidade = parseInt(quantidadeSpan.textContent);
  quantidade += 1;
  quantidadeSpan.textContent = quantidade;
  quantidades[index] = quantidade;

  if (quantidade >= 1) {
    botaoDiminuir.style.display = "inline";
  }

  atualizarPreco(index);
}

function diminuirQuantidade(index) {
  const quantidadeSpan = document.getElementById(`quantidade-${index}`);
  const botaoDiminuir = document.getElementById(`diminuir-${index}`);

  let quantidade = parseInt(quantidadeSpan.textContent);
  if (quantidade > 0) {
    quantidade -= 1;
    quantidadeSpan.textContent = quantidade;
    quantidades[index] = quantidade;

    if (quantidade === 0) {
      botaoDiminuir.style.display = "none";
    }

    atualizarPreco(index);
  }
}

function atualizarPreco(index) {
  const pratos = tipoPrato === "apimentados" ? pratosApimentados : pratosNaoApimentados;
  const precoSpan = document.getElementById(`preco-${index}`);
  precoSpan.textContent = (quantidades[index] * pratos[index].preco).toFixed(2);
}

function selecionarPrato(nome, index, preco) {
  if (quantidades[index] === 0) {
    alert("Por favor, selecione uma quantidade antes.");
    return;
  }

  if (!selecionados[index]) {
    totalCarrinho += quantidades[index] * preco;
    selecionados[index] = true;
    alert(`Você adicionou ${quantidades[index]} unidade(s) de ${nome} ao carrinho.`);
    atualizarCarrinho();
  } else {
    alert(`${nome} já foi adicionado ao carrinho.`);
  }
}

function atualizarCarrinho() {
  document.getElementById("total-carrinho").textContent = totalCarrinho.toFixed(2);
}

if (tipoPrato === "apimentados") {
  criarHTML(pratosApimentados, "Pratos Tradicionais Apimentados");
} else if (tipoPrato === "nao-apimentados") {
  criarHTML(pratosNaoApimentados, "Pratos Tradicionais Não Apimentados");
} else {
  document.getElementById("pratos").innerHTML = "<p>Escolha um tipo de prato na primeira página.</p>";
}

window.irParaPagina3 = function () {
  const tipo = localStorage.getItem("tipoPrato");

  if (tipo === "apimentados" || tipo === "nao-apimentados") {
    window.location.href = "../pagina3/pagina3.html";
  } else {
    alert("Por favor, escolha um tipo de prato na primeira página antes de prosseguir.");
  }
};

window.irParaPagina3 = function () {
  const tipo = localStorage.getItem("tipoPrato");

  if (tipo === "apimentados" || tipo === "nao-apimentados") {
    localStorage.setItem("valorTotal", totalCarrinho.toFixed(2)); // Salva o total
    window.location.href = "../pagina3/pagina3.html";
  } else {
    alert("Por favor, escolha um tipo de prato na primeira página antes de prosseguir.");
  }
};
localStorage.setItem("valorTotal", totalCarrinho.toFixed(2)); // Garante que o valor é salvo
