

// Definir políticas para cada banco
const politicasBancarias = {
  "C6 Bank": [
    {
      condicao: (idade, analfabeto, produto, beneficio) => idade >= 60 && analfabeto && produto === "Novo",
      tabela: "- INSS ML Normal - Web",
      mensagem: "Cliente acima de 60 anos e analfabeto",
      tipoFormalizacao: "Híbrido"
    },
    {
      condicao: (idade, analfabeto, produto, beneficio) => idade <= 59 && analfabeto && produto === "Novo",
      tabela: "- INSS ML Normal - Web",
      mensagem: "Cliente menor de 60 anos e analfabeto",
      tipoFormalizacao: "Híbrido"
    },
    {
      condicao: (idade, analfabeto, produto, beneficio) => idade <= 59 && analfabeto === "Não" && produto === "Novo",
      tabela: "- INSS ML Normal - Web",
      mensagem: "Cliente menor de 59 anos e assina",
      tipoFormalizacao: "Dígital"
    }
  ],

  "Panamericano": [
    {
      condicao: (idade, analfabeto, produto, beneficio) => idade >= 60 && analfabeto && produto === "Novo",
      tabela: "INSS_NOV_NORMAL_A_",
      mensagem: "Cliente acima de 60 anos e não assina, necessita rogo!",
      tipoFormalizacao: "Híbrido"
    },
    {
      condicao: (idade, analfabeto, produto, beneficio) => idade <= 59 && analfabeto && produto === "Novo",
      tabela: "INSS_NOV_NORMAL_A_",
      mensagem: "Cliente menor de 60 anos e analfabeto",
      tipoFormalizacao: "Híbrido"
    },
    {
      condicao: (idade, analfabeto, produto, beneficio) => idade <= 59 && analfabeto === "Não" && produto === "Novo",
      tabela: "INSS_NOV_NORMAL_A_",
      mensagem: "Cliente não possui nenhum impedimento.",
      tipoFormalizacao: "Dígital"
    }
  ],

  "Olé": [
    {
      condicao: (idade, analfabeto, produto, beneficio) => idade >= 60 && analfabeto === "Não" && produto === "Novo",
      tabela: "012574 - VD_INSS",
      mensagem: "Cliente acima de 60 anos e não assina, necessita rogo!",
      tipoFormalizacao: "Híbrido"
    },
    {
      condicao: (idade, analfabeto, produto, beneficio) => idade <= 59 && analfabeto === "Sim" && beneficio === 88 && beneficio === 87 && produto === "Novo",
      tabela: "VD_VP_INSS LOAS",
      mensagem: "Cliente menor de 60 anos e analfabeto",
      tipoFormalizacao: "Híbrido"
    },

    {
      condicao: (idade, analfabeto, produto, beneficio) => idade <= 59 && analfabeto === "Não" && beneficio === 88 && beneficio === 87 && produto === "Novo",
      tabela: "VD_VP_INSS LOAS",
      mensagem: "Cliente menor de 60 anos e assina",
      tipoFormalizacao: "Dígital"
    },

    {
      condicao: (idade, analfabeto, produto, beneficio) => idade <= 59 && analfabeto === "Não" && produto === "Novo",
      tabela: "012574 - VD_INSS",
      mensagem: "Cliente não possui nenhum impedimento.",
      tipoFormalizacao: "Dígital"
    }
  ],
  // Adicionar mais bancos conforme necessário
};

// Objeto para armazenar variáveis globais
const estadoCliente = {
  cpf: "",
  dataNascimento: "",
  bancos: "",
  beneficio: "",
  analfabeto: "",
  produto: "",
  idadeCliente: 0,
  tipoFormalizacao: "", 
};

// Função para validar campos e consultar o cliente
function validarCamposEConsultar() {
  // Obter valores selecionados
  estadoCliente.cpf = document.getElementById("cpf").value;
  estadoCliente.dataNascimento = document.getElementById("data_nascimento").value;
  estadoCliente.bancos = document.getElementById("bancos").value;
  estadoCliente.beneficio = document.getElementById("beneficio").value;
  estadoCliente.analfabeto = document.getElementById("analfabeto").value;
  estadoCliente.produto = document.getElementById("produto").value;

  // Verificar se todos os campos necessários estão preenchidos
  if (estadoCliente.cpf && estadoCliente.dataNascimento && estadoCliente.bancos && estadoCliente.beneficio && estadoCliente.analfabeto && estadoCliente.produto) {
    // Calcular a idade do cliente
    estadoCliente.idadeCliente = calcularIdade(estadoCliente.dataNascimento);

    // Todos os campos estão preenchidos, chame a função consultarCliente
    consultarCliente();
  } else {
    // Exiba uma mensagem de erro ou tome outra ação apropriada
    exibirAlerta("Por favor, preencha todos os campos antes de consultar.");
  }
}

// Função para consultar o cliente com base nas seleções
function consultarCliente() {
  // Obter valores selecionados
  const bancoSelecionado = estadoCliente.bancos;

  // Verificar se há políticas definidas para o banco selecionado
  if (politicasBancarias.hasOwnProperty(bancoSelecionado)) {
      const politicas = politicasBancarias[bancoSelecionado];

      // Iterar sobre as condições até encontrar uma que seja verdadeira
      for (const politica of politicas) {
          if (politica.condicao(estadoCliente.idadeCliente, estadoCliente.analfabeto, estadoCliente.produto, estadoCliente.beneficio)) {
            // Atualizar tipoFormalizacao no objeto estadoCliente
            estadoCliente.tipoFormalizacao = politica.tipoFormalizacao;
            
            exibirResultado(politica.mensagem, politica.tabela, estadoCliente.tipoFormalizacao);

              return;
          }
      }

      // Se não houver correspondência, definir tipoFormalizacao como vazio
      estadoCliente.tipoFormalizacao = "";
      exibirResultado("Cliente não atende aos critérios do banco.", "", estadoCliente.tipoFormalizacao); 
  } else {
      // Se o banco não for reconhecido, definir tipoFormalizacao como vazio
      estadoCliente.tipoFormalizacao = "";
      exibirResultado("Banco não reconhecido.", "", estadoCliente.tipoFormalizacao); 
  }
}


// Função para exibir os resultados
function exibirResultado(mensagem, tabela, tipoFormalizacao) {
  const resultadoElement = document.getElementById("resultado");
  resultadoElement.innerHTML = ` 
    <div class="child-content-result resultados">
      <h1 class="h1-title">Consulta:</h1>

      <div class="children-content-result"> 
        <p>Nome Cliente: -- </p>
        <p>CPF: ${estadoCliente.cpf}</p>
        <p>Idade: ${estadoCliente.idadeCliente}</p>
        <p>Benefício: ${estadoCliente.beneficio}</p>
        <p>Banco: ${estadoCliente.bancos}</p>
        <p>Analfabeto: ${estadoCliente.analfabeto} </p>
        <p>Produto: ${estadoCliente.produto} </p>

        <h1 class="h1-title">Resultado:</h1>

        <p>Formalização: ${tipoFormalizacao} </p>
        <p>Tabela Sugerida: ${tabela} </p>
        <p>Observação: ${mensagem} </p>
      </div>
    </div>
  `;
}

// Função auxiliar para calcular a idade com base na data de nascimento
function calcularIdade(dataNascimento) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  const idade = hoje.getFullYear() - nascimento.getFullYear();

  // Ajustar idade se ainda não tiver feito aniversário neste ano
  if (hoje.getMonth() < nascimento.getMonth() || (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate())) {
      return idade - 1;
  }
  return idade;
}

// Alert customizado:
function exibirAlerta(mensagem) {
  const modal = document.getElementById("customAlert");
  const alertMessage = document.getElementById("alertMessage");

  alertMessage.innerHTML = mensagem;
  modal.style.display = "block";
}

// Fechar alert customizado
function fecharAlerta() {
  const modal = document.getElementById("customAlert");
  modal.style.animation = "fadeOut 0.5s ease-in-out";
  setTimeout(() => {
    modal.style.display = "none";
    modal.style.animation = "";
  }, 500);
}

// Define uma classe FormSubmit
class FormSubmit {
  constructor(settings) {
    // O construtor recebe um objeto de configurações
    this.settings = settings;
    this.form = document.querySelector(settings.form); // Seleciona o elemento do formulário
    this.formButton = document.querySelector(settings.button); // Seleciona o botão do formulário
    if (this.form) {
      this.url = this.form.getAttribute("action"); // Obtém a URL de ação do formulário
    }
    this.sendForm = this.sendForm.bind(this); // Liga o método `sendForm` ao contexto da instância
  }

  // Exibe uma mensagem de sucesso no formulário
  displaySuccess() {
    this.form.innerHTML = this.settings.success;
  }

  // Exibe uma mensagem de erro no formulário
  displayError() {
    this.form.innerHTML = this.settings.error;
  }

  // Obtém os valores dos campos do formulário e retorna um objeto
  getFormObject() {
    const formObject = {};
    const fields = this.form.querySelectorAll("[name]");
    fields.forEach((field) => {
      formObject[field.getAttribute("name")] = field.value;
    });
    return formObject;
  }

  // Manipulador para a submissão do formulário
  onSubmission(event) {
    event.preventDefault();
    event.target.disabled = true;
    event.target.innerText = "Enviando solicitação...";
  }

  // Envia o formulário via AJAX
  async sendForm(event) {
    try {
      this.onSubmission(event); // Chama a função para preparar a submissão
      await fetch(this.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(this.getFormObject()), // Envia os dados do formulário como JSON
      });
      this.displaySuccess(); // Exibe uma mensagem de sucesso
    } catch (error) {
      this.displayError(); // Exibe uma mensagem de erro
      throw new Error(error);
    }
  }

  // Inicializa a classe e adiciona um ouvinte de evento ao botão do formulário
  init() {
    if (this.form) this.formButton.addEventListener("click", this.sendForm);
    return this;
  }
}

// Cria uma instância da classe FormSubmit com configurações
const formSubmit = new FormSubmit({
  form: "[data-form]", // Seletor do formulário
  button: "[data-button]", // Seletor do botão de envio do formulário
  success: "<div class='sucesso'> <h1 class='success'>Solicitação enviada!</h1> <a class='back' href='../index.html'>Voltar</a> </div>", // Mensagem de sucesso
  error: "<h1 class='error'>Não foi possível enviar sua mensagem. <a class='back' href='../index.html'>Voltar</a></h1>", // Mensagem de erro
});

formSubmit.init(); // Inicializa a instância da classe FormSubmit

// Validação de CPF
document.getElementById("cpf").addEventListener("input", function () {
  const cpfInput = this.value.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
  const formattedCPF = formatCPF(cpfInput); // Formata o CPF com pontos e traço

  this.value = formattedCPF; // Atualiza o valor do campo de CPF com o valor formatado
});

// Função para formatar o CPF com pontos e traço
function formatCPF(cpf) {
  if (cpf.length <= 3) {
    return cpf;
  } else if (cpf.length <= 6) {
    return cpf.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  } else if (cpf.length <= 9) {
    return cpf.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  } else {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
  }
}
