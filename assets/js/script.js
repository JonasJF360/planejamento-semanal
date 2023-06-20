(App => {
    const idElementoClicado = [0]

    const conteudoEditor = document.querySelector('#conteudo')
    document.querySelectorAll('.fechar-editor').forEach(item => item.addEventListener('click', (e) => {
        e.preventDefault()
        document.querySelector('#editar-valor').style.display = 'none'
        document.querySelector('#editor').style.display = 'block'
        document.querySelector('#container-mensagem').style.display = 'none'
    }))

    document.querySelector('#tempo-inicio').addEventListener('input', verificarIntervaloDigitado)
    document.querySelector('#tempo-final').addEventListener('input', verificarIntervaloDigitado)
    document.querySelector('#aplicar').addEventListener('click', aplicarAlteracoes)
    document.querySelector('#ajuda').addEventListener('click', abrirAjuda)

    // ## Funcões de execução e manipulação da aplicação. ##
    function firstStart() {
        document.querySelectorAll('.texto-nota').forEach(
            dado => dado.addEventListener('click', abrirEditor))

        if (localStorage.BaseDadosProgramacaoSemanal) {
            carregarDados()
        }
    }
    function caixaMensagem() {
        document.querySelector('#editar-valor').style.display = 'flex'
        document.querySelector('#editor').style.display = 'none'
        document.querySelector('#container-mensagem').style.display = 'block'
        document.querySelector('#conteudo-mensagem').innerHTML = ''
    }

    function abrirAjuda(e) {
        e.preventDefault()
        caixaMensagem()
        document.querySelector('#container-mensagem h1').innerText = 'Menu de ajuda'

        fetch("./assets/data/dados.json").then(response => {
            response.json().then(dado => {
                document.querySelector('#conteudo-mensagem').innerHTML = dado.ajuda.join(``)
            })
        })
    }

    const abrirEditor = (e) => {
        e.preventDefault()
        let pegarId = (e.target.id).replaceAll('_', ' ').split(" ")
        idElementoClicado.splice(0)
        pegarId.forEach((valor) => idElementoClicado.push(valor))

        document.querySelector('section#editor').style.backgroundColor =
            getComputedStyle(e.target).getPropertyValue('background-color')

        document.querySelector('#editar-valor').style.display = 'flex'
        mostrarDadosExistentes()
    }

    function mostrarDadosExistentes() {
        let diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
        document.querySelector('#editor h1').innerText =
            (idElementoClicado[1] == 'manha' ? 'manhã' : idElementoClicado[1]) +
            ': ' + diasDaSemana[parseInt(idElementoClicado[2]) - 1]

        let primeiroIntervalo = "00:00"
        let segundoItervalo = "00:00"

        if (idElementoClicado[1] == 'manha') {
            primeiroIntervalo = "06:00"
            segundoItervalo = "07:00"
        } else if (idElementoClicado[1] == 'tarde') {
            primeiroIntervalo = "12:00"
            segundoItervalo = "13:00"
        } else {
            primeiroIntervalo = "18:00"
            segundoItervalo = "17:00"
        }

        if (document.querySelector(`#total_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText != "00:00") {
            primeiroIntervalo = document.querySelector(`#inicio_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText
            segundoItervalo = document.querySelector(`#fim_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText
        }
        document.querySelector('#tempo-inicio').value = primeiroIntervalo
        document.querySelector('#tempo-final').value = segundoItervalo

        mudarIntervaloTempo()

        if (document.querySelector(`#${idElementoClicado.join('_')}`).innerText) {
            conteudoEditor.value = document.querySelector(`#${idElementoClicado.join('_')}`).innerText
        } else {
            conteudoEditor.value = ''
        }
    }

    function verificarIntervaloDigitado(e) {
        e.preventDefault()
        let inicio = document.querySelector('#tempo-inicio').value.split(':').map(num => parseInt(num))
        let fim = document.querySelector('#tempo-final').value.split(':').map(num => parseInt(num))

        let corInput = [true, true]

        if (idElementoClicado[1] == 'manha') {
            (inicio[0] < 5 || inicio[0] > 11) ? corInput[0] = false : corInput[0] = true;
            (fim[0] < 5 || fim[0] > 11) ? corInput[1] = false : corInput[1] = true;
        } else if (idElementoClicado[1] == 'tarde') {
            (inicio[0] < 12 || inicio[0] > 17) ? corInput[0] = false : corInput[0] = true;
            (fim[0] < 12 || fim[0] > 17) ? corInput[1] = false : corInput[1] = true;
        } else {
            !(inicio[0] < 5 || inicio[0] >= 18) ? corInput[0] = false : corInput[0] = true;
            !(fim[0] < 5 || fim[0] >= 18) ? corInput[1] = false : corInput[1] = true;
        }

        (!corInput[0])
            ? document.querySelector('#tempo-inicio').classList.add('tempo-erro')
            : document.querySelector('#tempo-inicio').classList.remove('tempo-erro');
        (!corInput[1])
            ? document.querySelector('#tempo-final').classList.add('tempo-erro')
            : document.querySelector('#tempo-final').classList.remove('tempo-erro');

        mudarIntervaloTempo()
    }

    function mudarIntervaloTempo() {
        let horaInicio = document.querySelector('#tempo-inicio').value
        let horaFim = document.querySelector('#tempo-final').value

        document.querySelector('#intervalo_tempo').value =
            tempoEntreInicioEFim(horaInicio, horaFim)
    }

    function mensagemAlerta() {
        let texto = `Você está tentando colocar um período de tempo que foge da regra da aplicação. Gostaria de continuar assim mesmo?`

        return confirm(texto)
    }

    function aplicarAlteracoes(e) {
        e.preventDefault()

        if (document.querySelector('#tempo-inicio').classList[0] == 'tempo-erro'
            || document.querySelector('#tempo-final').classList[0] == 'tempo-erro') {
            if (!mensagemAlerta()) {
                return
            }
        }

        document.querySelector(`#${idElementoClicado.join('_')}`).innerText = conteudoEditor.value

        let tempo = ["00:00", "00:00", "00:00"]
        if (conteudoEditor.value) {
            tempo[0] = document.querySelector('#tempo-inicio').value
            tempo[1] = document.querySelector('#tempo-final').value
            tempo[2] = document.querySelector('#intervalo_tempo').value
        }
        document.querySelector(`#inicio_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText
            = tempo[0]
        document.querySelector(`#fim_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText
            = tempo[1]
        document.querySelector(`#total_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText
            = tempo[2]

        document.querySelector('#editar-valor').style.display = 'none'
        conteudoEditor.value = ''

        calcularTempoTotalDoDia()
        calcularTempoTotalDaSemana()

        salvarArquivoDeDadosJson()
    }

    // ## Funções para cálculos para períodos de tempo. ##
    function somarPeriodosDeTempo(tempo01, tempo02) {
        let intervalo = [
            tempo01.split(':').map(num => parseInt(num)),
            tempo02.split(':').map(num => parseInt(num))]

        let horas = intervalo[0][0] + intervalo[1][0]
        let minutos = intervalo[0][1] + intervalo[1][1]

        while (minutos > 59) {
            horas++
            minutos -= 60
        }

        return horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0')
    }

    function tempoEntreInicioEFim(horaInicio, horaFim) {
        let inicio = horaInicio.split(':').map(num => parseInt(num))
        let fim = horaFim.split(':').map(num => parseInt(num))

        while (inicio[0] > fim[0]) {
            inicio[0] > 0 ? inicio[0]-- : inicio[0] = 23
            fim[0] > 0 ? fim[0]-- : fim[0] = 23
        }

        let horas = fim[0] - inicio[0]
        let minutos = fim[1] - inicio[1]

        if (minutos < 0) {
            horas--
            minutos += 60
        }
        return horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0')
    }

    function calcularTempoDoDia(periodo, num) {
        let horaInicio = document.querySelector(`#inicio_${periodo}_0${num}`).innerText
        let horaFim = document.querySelector(`#fim_${periodo}_0${num}`).innerText

        document.querySelector(`#total_${periodo}_0${num}`).innerText =
            tempoEntreInicioEFim(horaInicio, horaFim)
    }

    function calcularTempoTotalDoDia() {
        let tempo = '00:00'
        for (let i = 1; i <= 7; i++) {
            tempo = somarPeriodosDeTempo(tempo, document.querySelector(`#total_manha_0${i}`).innerText)
            tempo = somarPeriodosDeTempo(tempo, document.querySelector(`#total_tarde_0${i}`).innerText)
            tempo = somarPeriodosDeTempo(tempo, document.querySelector(`#total_noite_0${i}`).innerText)

            document.querySelector(`#total_dia_0${i}`).innerText = tempo
            tempo = '00:00'
        }
    }

    function calcularTempoTotalDaSemana() {
        let tempo = '00:00'
        for (let i = 1; i <= 7; i++) {
            tempo = somarPeriodosDeTempo(tempo, document.querySelector(`#total_dia_0${i}`).innerText)
        }
        document.querySelector('#total_da_semana').innerText = tempo
    }

    // ## Funções para manipular os dados gerados. ##
    function carregarDados() {
        const dadosSalvos = JSON.parse(localStorage.getItem('BaseDadosProgramacaoSemanal'))
        let periodos = ['manha', 'tarde', 'noite']
        for (let num = 1; num <= 7; num++) {
            for (let periodo of periodos) {
                document.querySelector(`#inicio_${periodo}_0${num}`).innerText =
                    dadosSalvos[`${periodo}`][`dia0${num}`].horaInicio
                document.querySelector(`#fim_${periodo}_0${num}`).innerText =
                    dadosSalvos[`${periodo}`][`dia0${num}`].horaFim
                document.querySelector(`#texto_${periodo}_0${num}`).innerText =
                    dadosSalvos[`${periodo}`][`dia0${num}`].conteudo

                calcularTempoDoDia(periodo, num)
            }
        }
        calcularTempoTotalDoDia()
        calcularTempoTotalDaSemana()
    }

    function salvarArquivoDeDadosJson() {
        if (!localStorage.BaseDadosProgramacaoSemanal) {
            criarArquivoDeDadosJson()
        }
        if (document.querySelector('#total_da_semana').innerText == '00:00') {
            localStorage.clear('BaseDadosProgramacaoSemanal')
        } else {
            const dadosSalvos = JSON.parse(localStorage.getItem('BaseDadosProgramacaoSemanal'))
            localStorage.clear('BaseDadosProgramacaoSemanal')

            let periodos = ['manha', 'tarde', 'noite']
            for (let periodo of periodos) {
                for (let num = 1; num <= 7; num++) {
                    dadosSalvos[`${periodo}`][`dia0${num}`].horaInicio =
                        document.querySelector(`#inicio_${periodo}_0${num}`).innerText
                    dadosSalvos[`${periodo}`][`dia0${num}`].horaFim =
                        document.querySelector(`#fim_${periodo}_0${num}`).innerText
                    dadosSalvos[`${periodo}`][`dia0${num}`].conteudo =
                        document.querySelector(`#texto_${periodo}_0${num}`).innerText
                }
            }

            const jsonData = JSON.stringify(dadosSalvos)
            localStorage.setItem('BaseDadosProgramacaoSemanal', jsonData)
        }
    }

    function criarArquivoDeDadosJson() {
        const BaseDados = {
            manha: {
                dia01: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia02: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia03: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia04: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia05: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia06: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia07: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
            },
            tarde: {
                dia01: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia02: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia03: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia04: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia05: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia06: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia07: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
            },
            noite: {
                dia01: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia02: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia03: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia04: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia05: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia06: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
                dia07: { horaInicio: "00:00", horaFim: "00:00", conteudo: "" },
            }
        }

        const jsonData = JSON.stringify(BaseDados)
        localStorage.setItem('BaseDadosProgramacaoSemanal', jsonData)
    }

    // ## Primeira execução da aplicação. ##
    firstStart()

})()