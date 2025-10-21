// ======== SELETORES ========
const nomeH3 = document.querySelector('.perfil h3');
const inputNome = document.getElementById('inputNomeBebe');
const inputNascimento = document.getElementById('inputNascimentoBebe');
const inputCpf = document.getElementById('inputCpfBebe');
const inputSexo = document.getElementById('inputSexoBebe');
const inputPeso = document.getElementById('inputPesoBebe');
const inputAltura = document.getElementById('inputAlturaBebe');
const inputCartao = document.getElementById('inputCartaoBebe');
const inputSangue = document.getElementById('inputSangueBebe');
const inputCertidao = document.getElementById('inputCertidaoBebe');

const botaoTrocar = document.getElementById('btnTrocarFoto');
const inputFoto = document.getElementById('inputFoto');
const imgPerfil = document.getElementById('fotoPerfil');

// ======== FUNÇÃO PARA FORMATAR DATA PARA INPUT TYPE="DATE" ========
function formatDateForInput(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // formato yyyy-mm-dd
}

// ======== CARREGAR PERFIL DO BEBÊ ========
async function carregarPerfilBebe() {
    try {
        const res = await fetch(`http://localhost:3030/v1/sosbaby/baby/2`);
        const data = await res.json();

        if (res.ok && data.bebe && data.bebe.length > 0) {
            const bebe = data.bebe[0];

            // Atualizar H3
            nomeH3.textContent = bebe.nome || '';

            // Preencher inputs
            inputNome.value = bebe.nome || '';
            inputNascimento.value = formatDateForInput(bebe.data_nascimento);
            inputCpf.value = bebe.cpf || '';
            inputSexo.value = bebe.sexo || '';
            inputPeso.value = bebe.peso || '';
            inputAltura.value = bebe.altura || '';
            inputCartao.value = bebe.cartao_medico || '';
            inputSangue.value = bebe.tipo_sanguineo || '';
            inputCertidao.value = bebe.certidao_nascimento || '';

            // Atualizar imagem do perfil, se houver
            if (bebe.imagem_certidao) {
                imgPerfil.src = bebe.imagem_certidao;
            }

        } else {
            console.error('Bebê não encontrado ou array vazio');
        }
    } catch (error) {
        console.error('Erro ao carregar perfil do bebê:', error);
    }
}

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

// ======== EXECUTAR AO CARREGAR A PÁGINA ========
window.addEventListener('DOMContentLoaded', carregarPerfilBebe);
