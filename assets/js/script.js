(App => {
    const idElementoClicado = [0]

    const conteudoEditor = document.querySelector('#conteudo')
    document.querySelector('.fechar-editor').addEventListener('click', (e) => {
        e.preventDefault()
        document.querySelector('#editar-valor').style.display = 'none'
    })

    document.querySelector('#tempo-inicio').addEventListener('input', mudarIntervaloTempo)
    document.querySelector('#tempo-final').addEventListener('input', mudarIntervaloTempo)
    document.querySelector('#aplicar').addEventListener('click', aplicarAlteracoes)

    // funcões
    function firstStart() {
        document.querySelectorAll('.texto-nota').forEach(
            dado => dado.addEventListener('click', abrirEditor))

        if (localStorage.BaseDadosProgramacaoSemanal) {
            carregarDados()
        }
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
            ': ' + diasDaSemana[parseInt(idElementoClicado[2])]

        if (document.querySelector(`#total_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText != "00:00") {
            document.querySelector('#tempo-inicio').value = document.querySelector(`#inicio_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText
            document.querySelector('#tempo-final').value = document.querySelector(`#fim_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText
        }

        mudarIntervaloTempo()

        if (document.querySelector(`#${idElementoClicado.join('_')}`).innerText) {
            conteudoEditor.value = document.querySelector(`#${idElementoClicado.join('_')}`).innerText
        } else {
            conteudoEditor.value = ''
        }
    }

    function mudarIntervaloTempo() {
        let horaInicio = document.querySelector('#tempo-inicio').value.split(':')
        let horaFim = document.querySelector('#tempo-final').value.split(':')

        document.querySelector('#intervalo_tempo').value =
            tempoEntreInicioEFim(horaInicio, horaFim)
    }

    function aplicarAlteracoes(e) {
        e.preventDefault()
        document.querySelector(`#${idElementoClicado.join('_')}`).innerText = conteudoEditor.value

        document.querySelector(`#inicio_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText =
            document.querySelector('#tempo-inicio').value
        document.querySelector(`#fim_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText =
            document.querySelector('#tempo-final').value
        document.querySelector(`#total_${idElementoClicado[1]}_${idElementoClicado[2]}`).innerText =
            document.querySelector('#intervalo_tempo').value

        document.querySelector('#editar-valor').style.display = 'none'
        conteudoEditor.value = ''

        calcularTempoTotalDoDia()
        calcularTempoTotalDaSemana()

        salvarArquivoDeDadosJson()
    }

    function calcularTempoTotalDaSemana() {
        let horas = 0
        let minutos = 0
        let pegarTempo = 0
        for (let i = 1; i <= 7; i++) {
            pegarTempo = document.querySelector(`#total_dia_0${i}`).innerText.split(':')
            horas += parseInt(pegarTempo[0])
            minutos += parseInt(pegarTempo[1])
        }
        while (minutos > 59) {
            horas++
            minutos -= 60
        }

        document.querySelector('#total_da_semana').innerText =
            horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0')
    }

    function calcularTempoTotalDoDia() {
        let periodoManha = 0
        let periodoTarde = 0
        let periodoNoite = 0
        let horas = 0
        let minutos = 0
        for (let i = 1; i <= 7; i++) {
            periodoManha = document.querySelector(`#total_manha_0${i}`).innerText.split(':')
            periodoTarde = document.querySelector(`#total_tarde_0${i}`).innerText.split(':')
            periodoNoite = document.querySelector(`#total_noite_0${i}`).innerText.split(':')
            horas = parseInt(periodoManha[0]) + parseInt(periodoTarde[0]) + parseInt(periodoNoite[0])
            minutos = parseInt(periodoManha[1]) + parseInt(periodoTarde[1]) + parseInt(periodoNoite[1])

            while (minutos > 59) {
                horas++
                minutos -= 60
            }

            document.querySelector(`#total_dia_0${i}`).innerText =
                horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0')
        }
    }

    function calcularTempoDoDia(periodo, num) {
        let horaInicio = document.querySelector(`#inicio_${periodo}_0${num}`).innerText.split(':')
        let horaFim = document.querySelector(`#fim_${periodo}_0${num}`).innerText.split(':')

        document.querySelector(`#total_${periodo}_0${num}`).innerText =
            tempoEntreInicioEFim(horaInicio, horaFim)
    }

    function tempoEntreInicioEFim(horaInicio, horaFim) {
        while (parseInt(horaInicio[0]) > parseInt(horaFim[0])) {
            parseInt(horaInicio[0]) > 0 ? parseInt(horaInicio[0])-- : parseInt(horaInicio[0]) = 23
            parseInt(horaFim[0]) > 0 ? parseInt(horaFim[0])-- : parseInt(horaFim[0]) = 23
        }

        let horas = parseInt(horaFim[0]) - parseInt(horaInicio[0])
        let minutos = parseInt(horaFim[1]) - parseInt(horaInicio[1])

        if (minutos < 0) {
            horas--
            minutos += 60
        }
        return horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0')
    }

    // Manipulando os dados 
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

    // Primeira execução
    firstStart()

})()