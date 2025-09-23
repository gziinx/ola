'use strict'

document.getElementById('form').addEventListener('submit', async function (event) {
    event.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value
    
    try {
       
                                        //10.107.144.16
                                        //https://projeto-queropets-2025-1.onrender.com/v1/controle-pet/usuario
        const userResponse = await fetch('http://localhost:3030/v1/user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: email,
                senha: senha,
                id_tipo: 1

            })
        })

        if (userResponse.ok) {
            alert('Usuário logado com sucesso!')
            window.location.href = '../index.html'

        } else {
            const errorData = await userResponse.json()
            console.error(errorData)
            alert('Erro ao logar usuário.')
        }

    } catch (error) {
        console.error(error)
        alert('Erro no processo de login.')
    }

})