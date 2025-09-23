'use strict'

document.getElementById('cad').addEventListener('submit', async function (event) {
  event.preventDefault()

  const nome = document.getElementById('nome').value
  const data_nascimento = document.getElementById('data_nascimento').value
  const cpf = document.getElementById('cpf').value
  const telefone = document.getElementById('telefone').value
  const email = document.getElementById('email').value
  const cartao_medico = document.getElementById('cartao_medico').value
  const cep = document.getElementById('cep').value

  const arquivoInput = document.getElementById('arquivo')
  const arquivo = arquivoInput.files.length > 0 ? arquivoInput.files[0].name : ""


  try {
    const response = await fetch('http://localhost:3030/v1/responsable', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: nome,
        data_nascimento: data_nascimento,
        cpf: cpf,
        telefone: telefone,
        arquivo: arquivo,
        cartao_medico: cartao_medico,
        cep: cep,
        id_sexo: 1,
        id_user: 1
      })
    })

    if (response.ok) {
      alert('Responsável cadastrado com sucesso!')
      // redireciona se quiser
      // window.location.href = '../login/login.html'
    } else {
      const errorData = await response.json()
      console.error(errorData)
      alert('Erro ao cadastrar responsável.')
    }

  } catch (error) {
    console.error(error)
    alert('Erro no processo de cadastro.')
  }
})
