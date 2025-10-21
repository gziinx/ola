// ======== SELETORES ========
const nomeH3 = document.querySelector('.perfil h3');
const imgPerfil = document.querySelector('.perfil img');
const inputNome = document.querySelector('input[placeholder="ROBERTO"]');
const inputEmail = document.querySelector('input[placeholder="pediatra@gmail.com"]');
const inputCRM = document.querySelector('input[placeholder="00000000-0/BR"]');
const inputTelefone = document.querySelector('input[placeholder="(11) 99132-3444"]');
const inputNascimento = document.querySelector('input[placeholder="00/00/0000"]');

// Inputs para troca de foto
const botaoTrocar = document.getElementById('btnTrocarFoto');
const inputFoto = document.getElementById('inputFoto');

// ======== FUNÇÃO PARA FORMATAR DATA ========
function formatDateBR(isoDate) {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// ======== FUNÇÃO PARA CARREGAR PERFIL ========
async function carregarPerfil() {
    try {
        const res = await fetch('http://localhost:3030/v1/sosbaby/resp/2');
        const data = await res.json();

        if (res.ok && data.responsavel) {
            const resp = data.responsavel[0];

            // Atualiza HTML
            nomeH3.textContent = resp.nome;
            imgPerfil.src = resp.foto_perfil || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

            // Atualiza inputs
            inputNome.value = resp.nome;
            inputEmail.value = (resp.usuario && resp.usuario[0] && resp.usuario[0].email) || '';
            inputCRM.value = resp.cartao_medico || '';
            inputTelefone.value = resp.telefone || '';
            inputNascimento.value = formatDateBR(resp.data_nascimento);
        } else {
            console.error('Responsável não encontrado');
        }
    } catch (error) {
        console.error('Erro ao carregar perfil:', error);
    }
}

// Carrega o perfil ao abrir a página
carregarPerfil();

// ======== TROCAR FOTO DE PERFIL ========
botaoTrocar.addEventListener('click', () => {
    inputFoto.click();
});

inputFoto.addEventListener('change', (event) => {
    const arquivo = event.target.files[0];
    if (arquivo) {
        const urlImagem = URL.createObjectURL(arquivo);
        imgPerfil.src = urlImagem;
    }
});
