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

    const idReferencia = [0]

    const dadosTexto = document.querySelectorAll('.texto-nota')
    const editorDeDados = document.querySelector('#editar-valor')
    const corDoEditor = document.querySelector('section#editor')
    const conteudoEditor = document.querySelector('#conteudo')

    document.querySelector('.fechar-editor').addEventListener('click', (e) => {
        e.preventDefault()
        editorDeDados.style.display = 'none'
    })

    document.querySelector('#tempo-inicio').addEventListener('input', mudarIntervaloTEmpo)
    document.querySelector('#tempo-final').addEventListener('input', mudarIntervaloTEmpo)

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
        let pegarId = (e.target.id).replaceAll('_', ' ').split(" ")
        idReferencia.splice(0)
        pegarId.forEach((valor) => idReferencia.push(valor))

        if (idReferencia[2] % 2 == 0) {
            corDoEditor.classList.remove('fundo-amarelo-claro')
            corDoEditor.classList.add('fundo-azul-claro')
        } else {
            corDoEditor.classList.remove('fundo-azul-claro')
            corDoEditor.classList.add('fundo-amarelo-claro')
        }

        mostrarDadosExistentes()

        editorDeDados.style.display = 'flex'
    }

    function mostrarDadosExistentes() {
        let periodo = idReferencia[1] == 'manha' ? 'manhã' : idReferencia[1]
        document.querySelector('#editor h1').innerText = periodo + ': '
            + diasDaSemana[`dia${idReferencia[2]}`]


        if (document.querySelector(`#total_${idReferencia[1]}_${idReferencia[2]}`).innerText != "00:00") {
            document.querySelector('#tempo-inicio').value = document.querySelector(`#inicio_${idReferencia[1]}_${idReferencia[2]}`).innerText
            document.querySelector('#tempo-final').value = document.querySelector(`#fim_${idReferencia[1]}_${idReferencia[2]}`).innerText
            console.log('Aqui funciona')
        }
        document.querySelector('#intervalo_tempo').value = calcularTempo()[2]

        if (document.querySelector(`#${idReferencia.join('_')}`).innerText) {
            conteudoEditor.value = document.querySelector(`#${idReferencia.join('_')}`).innerText
        } else {
            conteudoEditor.value = ''
        }
    }

    function mudarIntervaloTEmpo(e) {
        e.preventDefault()
        document.querySelector('#intervalo_tempo').value = calcularTempo()[2]
    }

    function aplicarAlteracoes(e) {
        e.preventDefault()
        document.querySelector(`#${idReferencia.join('_')}`).innerText = conteudoEditor.value

        let tempoCalculado = calcularTempo()

        document.querySelector(`#inicio_${idReferencia[1]}_${idReferencia[2]}`).innerText = tempoCalculado[0]
        document.querySelector(`#fim_${idReferencia[1]}_${idReferencia[2]}`).innerText = tempoCalculado[1]
        document.querySelector(`#total_${idReferencia[1]}_${idReferencia[2]}`).innerText = tempoCalculado[2]

        editorDeDados.style.display = 'none'
        conteudoEditor.value = ''

        let totalHoraDia = calcularTempoTotalDoDia()
        document.querySelector(`#total_dia_${idReferencia[2]}`).innerText = totalHoraDia

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
        let periodoManha = document.querySelector(`#total_manha_${idReferencia[2]}`).innerText.split(':')
        let periodoTarde = document.querySelector(`#total_tarde_${idReferencia[2]}`).innerText.split(':')
        let periodoNoite = document.querySelector(`#total_noite_${idReferencia[2]}`).innerText.split(':')

        let horas = parseInt(periodoManha[0]) + parseInt(periodoTarde[0]) + parseInt(periodoNoite[0])
        let minutos = parseInt(periodoManha[1]) + parseInt(periodoTarde[1]) + parseInt(periodoNoite[1])

        while (minutos > 59) {
            horas++
            minutos -= 60
        }

        return horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0')
    }


    function calcularTempo() {
        let horaInicio = document.querySelector('#tempo-inicio').value.split(':')
        let horaFim = document.querySelector('#tempo-final').value.split(':')

        let horaInicioHoras = parseInt(horaInicio[0])
        let horaInicioMinutos = parseInt(horaInicio[1])
        let horaFimHoras = parseInt(horaFim[0])
        let horaFimMinutos = parseInt(horaFim[1])

        while (horaInicioHoras > horaFimHoras) {
            horaInicioHoras > 0 ? horaInicioHoras-- : horaInicioHoras = 23
            horaFimHoras > 0 ? horaFimHoras-- : horaFimHoras = 23
        }

        let horas = horaFimHoras - horaInicioHoras
        let minutos = horaFimMinutos - horaInicioMinutos

        if (minutos < 0) {
            horas--
            minutos += 60
        }

        return [
            horaInicio.join(':'),
            horaFim.join(':'),
            (horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0'))
        ]
    }

    // Primeira execução
    firstStart()

})()