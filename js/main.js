/**
 * 4 Patinhas Petshop — js/main.js
 * Fase 2: funções JavaScript
 *
 * Funções implementadas:
 *  1. iniciarRelogio()           — exibe data/hora em tempo real (função temporal)
 *  2. configurarDataMinima()     — impede seleção de datas passadas no agendamento
 *  3. configurarMetodoEntrega()  — mostra/oculta endereço conforme método escolhido
 *  4. configurarFeedbackForm()   — exibe confirmação visual ao enviar formulário
 */

/* ============================================================
   1. RELÓGIO EM TEMPO REAL — função temporal com setInterval
   ============================================================ */
/**
 * Atualiza o elemento #relogio com a data e hora correntes a cada segundo.
 * Utiliza setInterval (execução periódica) e o objeto Date nativo do JavaScript.
 */
function iniciarRelogio() {
  const elementoRelogio = document.getElementById('relogio');
  if (!elementoRelogio) return; /* elemento ausente nesta página; encerra sem erro */

  function atualizarHora() {
    const agora = new Date();

    /* formatar data no padrão brasileiro: dd/mm/aaaa */
    const dia    = String(agora.getDate()).padStart(2, '0');
    const mes    = String(agora.getMonth() + 1).padStart(2, '0'); /* meses de 0 a 11 */
    const ano    = agora.getFullYear();

    /* formatar hora: hh:mm:ss */
    const hora   = String(agora.getHours()).padStart(2, '0');
    const minuto = String(agora.getMinutes()).padStart(2, '0');
    const segundo = String(agora.getSeconds()).padStart(2, '0');

    elementoRelogio.textContent = `${dia}/${mes}/${ano} — ${hora}:${minuto}:${segundo}`;
  }

  atualizarHora();                 /* executa imediatamente ao carregar a página */
  setInterval(atualizarHora, 1000); /* repete a cada 1000 ms (1 segundo) */
}

/* ============================================================
   2. DATA MÍNIMA NO FORMULÁRIO DE AGENDAMENTO
   ============================================================ */
/**
 * Define o atributo "min" do campo de data como a data de hoje,
 * impedindo que o usuário selecione uma data no passado.
 */
function configurarDataMinima() {
  const campoData = document.getElementById('dataAgendamento');
  if (!campoData) return;

  const hoje = new Date();
  const ano  = hoje.getFullYear();
  const mes  = String(hoje.getMonth() + 1).padStart(2, '0');
  const dia  = String(hoje.getDate()).padStart(2, '0');

  /* formato ISO exigido pelo input type="date": yyyy-mm-dd */
  campoData.setAttribute('min', `${ano}-${mes}-${dia}`);
}

/* ============================================================
   3. CAMPO CONDICIONAL: ENDEREÇO DE COLETA (TELE-BUSCA)
   ============================================================ */
/**
 * Exibe o bloco de endereço para coleta SOMENTE quando o usuário
 * seleciona "tele-busca". Oculta quando "entrega no local" é selecionado.
 * Também ajusta o atributo "required" conforme a seleção.
 */
function configurarMetodoEntrega() {
  const radioTeleBusca    = document.getElementById('teleBusca');
  const radioEntregaLocal = document.getElementById('entregaLocal');
  const grupoEndereco     = document.getElementById('grupoEnderecoColeta');
  const campoEndereco     = document.getElementById('enderecoColeta');

  /* sai silenciosamente se algum elemento não existir (outras páginas) */
  if (!radioTeleBusca || !radioEntregaLocal || !grupoEndereco) return;

  function verificarMetodo() {
    if (radioTeleBusca.checked) {
      /* tele-busca: exibe o bloco de endereço e torna o campo obrigatório */
      grupoEndereco.style.display = 'block';
      if (campoEndereco) campoEndereco.setAttribute('required', 'required');
    } else {
      /* entrega no local: oculta o bloco e remove a obrigatoriedade */
      grupoEndereco.style.display = 'none';
      if (campoEndereco) {
        campoEndereco.removeAttribute('required');
        campoEndereco.value = ''; /* limpa o campo ao ocultar */
      }
    }
  }

  /* registra os listeners em ambos os radio buttons */
  radioTeleBusca.addEventListener('change', verificarMetodo);
  radioEntregaLocal.addEventListener('change', verificarMetodo);
}

/* ============================================================
   4. FEEDBACK VISUAL NOS FORMULÁRIOS
   ============================================================ */
/**
 * Intercepta o envio de um formulário HTML, valida os campos com a
 * API nativa do browser e exibe uma mensagem de sucesso (sem backend
 * nesta fase do projeto).
 *
 * @param {string} idFormulario — id do elemento <form>
 * @param {string} mensagem     — texto exibido após envio bem-sucedido
 */
function configurarFeedbackForm(idFormulario, mensagem) {
  const formulario = document.getElementById(idFormulario);
  if (!formulario) return;

  formulario.addEventListener('submit', function (evento) {
    evento.preventDefault(); /* evita o envio padrão (projeto sem backend) */

    if (formulario.checkValidity()) {
      /* formulário válido: cria e exibe um alerta Bootstrap de sucesso */
      const alerta = document.createElement('div');
      alerta.className = 'alert alert-success mt-3';
      alerta.setAttribute('role', 'alert');
      alerta.innerHTML = `<strong>✅ Sucesso!</strong> ${mensagem}`;
      formulario.insertAdjacentElement('beforebegin', alerta);

      formulario.reset();                          /* limpa todos os campos */
      formulario.classList.remove('was-validated'); /* remove marcação de validação */

      /* remove o alerta automaticamente após 6 segundos */
      setTimeout(() => alerta.remove(), 6000);

      /* rola a página ao topo para que o usuário veja a mensagem */
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } else {
      /* formulário inválido: ativa a exibição dos erros do Bootstrap */
      formulario.classList.add('was-validated');
    }
  });
}

/* ============================================================
   INICIALIZAÇÃO — executado quando todo o DOM estiver pronto
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  iniciarRelogio();            /* inicia o relógio em tempo real em todas as páginas */
  configurarDataMinima();      /* define data mínima no agendamento (só age se o campo existir) */
  configurarMetodoEntrega();   /* lógica condicional de tele-busca (só age se os campos existirem) */

  /* feedback do formulário de cadastro */
  configurarFeedbackForm(
    'formCadastro',
    'Cadastro realizado com sucesso! Entraremos em contato pelo telefone ou e-mail informado.'
  );

  /* feedback do formulário de agendamento */
  configurarFeedbackForm(
    'formAgendamento',
    'Agendamento confirmado! Enviaremos um lembrete para o contato informado.'
  );
});
