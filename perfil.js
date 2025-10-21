const nomeH3 = document.querySelector('.perfil h3');
const inputNome = document.querySelector('input[placeholder="ROBERTO"]');
const inputNascimento = document.querySelector('input[placeholder="01/04/1998"]');
const inputTelefone = document.querySelector('input[placeholder="(11) 99132-3444"]');
const inputEmail = document.querySelector('input[placeholder="feliccc31@gmail.com"]');
const inputCartao = document.querySelector('input[placeholder="3704 5563 7184 423"]');

function formatDateBR(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function carregarPerfil() {
    try {
        const res = await fetch(`http://localhost:3030/v1/sosbaby/resp/1`);
        const data = await res.json();

        if (res.ok && data.responsavel) {
            const resp = data.responsavel[0];

            nomeH3.textContent = resp.nome;
            inputNome.value = resp.nome;
            inputNascimento.value = formatDateBR(resp.data_nascimento);
            inputTelefone.value = resp.telefone;
            inputEmail.value = resp.email || '';
            inputCartao.value = resp.cartao_medico;

        } else {
            console.error('Responsável não encontrado');
        }

    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
}

carregarPerfil();
