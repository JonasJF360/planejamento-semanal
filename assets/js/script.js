(App => {
    const diasDaSemana = {
        dia01: 'Domingo',
        dia02: 'Segunda',
        dia03: 'Terça',
        dia04: 'Quarta',
        dia05: 'Quinta',
        dia06: 'Sexta',
        dia07: 'Sábado'
    }

    const idReferencia = []

    const dadosTexto = document.querySelectorAll('.texto-nota')
    const editorDeDados = document.querySelector('#editar-valor')
    const corDoEditor = document.querySelector('section#editor')
    const conteudoEditor = document.querySelector('#conteudo')

    document.querySelector('.fechar-editor').addEventListener('click', (e) => {
        e.preventDefault()
        editorDeDados.style.display = 'none'
    })

    document.querySelector('#aplicar').addEventListener('click', aplicarAlteracoes)


    // funcões
    function firstStart() {
        for (let dado of dadosTexto) {
            for (let filho of dado.children) {
                filho.addEventListener('click', abrirEditor)
            }
        }
    }

    const abrirEditor = (e) => {
        e.preventDefault()
        let pegarId = e.target.id
        let listaId = (pegarId.replaceAll('_', ' ')).split(" ")

        if (listaId[2] % 2 == 0) {
            corDoEditor.classList.remove('fundo-amarelo-claro')
            corDoEditor.classList.add('fundo-azul-claro')
        } else {
            corDoEditor.classList.remove('fundo-azul-claro')
            corDoEditor.classList.add('fundo-amarelo-claro')
        }

        let periodo = listaId[1] == 'manha' ? 'manhã' : listaId[1]
        document.querySelector('#editor h1').innerText = periodo + ': '
            + diasDaSemana[`dia${listaId[2]}`]

        if (document.querySelector(`#${pegarId}`).innerText) {
            conteudoEditor.value = document.querySelector(`#${pegarId}`).innerText
        }

        editorDeDados.style.display = 'flex'
        idReferencia[0] = pegarId
    }

    function aplicarAlteracoes(e) {
        e.preventDefault()
        let listaId = (idReferencia[0].replaceAll('_', ' ')).split(" ")
        document.querySelector(`#${idReferencia[0]}`).innerText = conteudoEditor.value

        let tempoCalculado = calcularTempo()

        document.querySelector(`#inicio_${listaId[1]}_${listaId[2]}`).innerText = tempoCalculado[0]
        document.querySelector(`#fim_${listaId[1]}_${listaId[2]}`).innerText = tempoCalculado[1]
        document.querySelector(`#total_${listaId[1]}_${listaId[2]}`).innerText = tempoCalculado[2]

        editorDeDados.style.display = 'none'
        conteudoEditor.value = ''

        let totalHoraDia = calcularTempoTotalDoDia()
        document.querySelector(`#total_dia_${listaId[2]}`).innerText = totalHoraDia

        calcularTempoTotal()
    }

    function calcularTempoTotal() {
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

        let tempoTotal = horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0')

        document.querySelector('#total_da_semana').innerText = tempoTotal
    }

    function calcularTempoTotalDoDia() {
        let listaId = (idReferencia[0].replaceAll('_', ' ')).split(" ")
        let periodoManha = document.querySelector(`#total_manha_${listaId[2]}`).innerText.split(':')
        let periodoTarde = document.querySelector(`#total_tarde_${listaId[2]}`).innerText.split(':')
        let periodoNoite = document.querySelector(`#total_noite_${listaId[2]}`).innerText.split(':')

        let horas = parseInt(periodoManha[0]) + parseInt(periodoTarde[0]) + parseInt(periodoNoite[0])
        let minutos = parseInt(periodoManha[1]) + parseInt(periodoTarde[1]) + parseInt(periodoNoite[1])

        while (minutos > 59) {
            horas++
            minutos -= 60
        }

        return horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0')
    }


    function calcularTempo() {
        let inputTempoInicio = document.querySelector('#tempo-inicio')
        let inputTempofinal = document.querySelector('#tempo-final')

        let horaInicio = inputTempoInicio.value.split(':')
        let horaFim = inputTempofinal.value.split(':')

        let horaInicioHoras = parseInt(horaInicio[0])
        let horaInicioMinutos = parseInt(horaInicio[1])
        let horaFimHoras = parseInt(horaFim[0])
        let horaFimMinutos = parseInt(horaFim[1])

        while (horaInicioHoras > horaFimHoras) {
            horaInicioHoras > 0 ? horaInicioHoras-- : horaInicioHoras = 23
            horaFimHoras > 0 ? horaFimHoras-- : horaFimHoras = 23
        }

        let horasDecorridas = horaFimHoras - horaInicioHoras
        let minutosDecorridos = horaFimMinutos - horaInicioMinutos

        if (minutosDecorridos < 0) {
            horasDecorridas--
            minutosDecorridos += 60
        }

        // Formatando o texto de saída
        let horasDecorridasFormatadas = horasDecorridas.toString().padStart(2, '0')
        let minutosDecorridosFormatados = minutosDecorridos.toString().padStart(2, '0')


        return [inputTempoInicio.value, inputTempofinal.value, horasDecorridasFormatadas + ':' + minutosDecorridosFormatados]
    }

    // Primeira execução
    firstStart()

})()