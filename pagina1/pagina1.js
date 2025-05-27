let escolha = "";

function mostrarApimentados() {
  document.getElementById("resultado").innerHTML = "Você escolheu pratos apimentados.";
  escolha = "apimentados";
  document.getElementById("botao-escolher").style.display = "inline-block";
}

function mostrarSemPimenta() {
  document.getElementById("resultado").innerHTML = "Você escolheu pratos não apimentados.";
  escolha = "nao-apimentados";
  document.getElementById("botao-escolher").style.display = "inline-block";
}

function ESCOLHER() {
  localStorage.setItem("tipoPrato", escolha); 
  window.location.href = "../pagina2/pagina2.html"; // Correção do caminho relativo
}
