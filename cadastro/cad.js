'use strict'

document.getElementById('cad').addEventListener('submit', async function (event) {
    event.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    const confir = document.getElementById('confirm_senha').value
    if (senha !== confir) {
        alert('as senhas são diferentes.')
        return 
    }
    try {
       
                                        //10.107.144.16
                                        //https://projeto-queropets-2025-1.onrender.com/v1/controle-pet/usuario
        const userResponse = await fetch('http://localhost:3030/v1/sosbaby/user/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                senha: senha,
                id_tipo: 1

            })
        })

        if (userResponse.ok) {
            alert('Usuário cadastrado com sucesso!')
            window.location.href = '../login/login.html'

        } else {
            const errorData = await userResponse.json()
            console.error(errorData)
            alert('Erro ao cadastrar usuário.')
        }

    } catch (error) {
        console.error(error)
        alert('Erro no processo de cadastro.')
    }

})