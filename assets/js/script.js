(App => {

    const dados = document.querySelectorAll('.texto-nota')
    const editorDeDados = document.querySelector('#editar-valor')
    document.querySelector('.fechar-editor').addEventListener('click', (e) => {
        e.preventDefault()
        editorDeDados.style.display = 'none'
    })

    // funcões
    function firstStart() {
        for (let dado of dados) {
            for (let filho of dado.children) {
                filho.addEventListener('click', (e) => {
                    e.preventDefault()
                    let pegarId = e.target.id
                    document.querySelector(`#${pegarId}`).innerHTML = `${pegarId}`
                    document.querySelector('#conteudo').innerHTML = pegarId
                    editorDeDados.style.display = 'flex'
                })
            }
        }
    }

    // Ordem de execução
    firstStart()

})()