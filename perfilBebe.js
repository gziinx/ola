// Função para formatar datas no padrão BR dd/mm/yyyy
function formatDateBR(isoDate) {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

// Mapeamento de sexo e sangue caso venha como ID
function getSexoText(id) {
    const sexos = {
        1: 'Masculino',
        2: 'Feminino',
    };
    return sexos[id] || '';
}

function getSangueText(id) {
    const tiposSanguineos = {
        1: 'A',
        2: 'B',
        3: 'AB',
        4: 'O',
    };
    return tiposSanguineos[id] || '';
}

// Função principal para carregar o perfil do bebê
async function carregarPerfilBebe() {
    try {
        // Troque o 1 pelo ID do bebê que você quer buscar
        const res = await fetch(`http://localhost:3030/v1/sosbaby/baby/1`);
        const data = await res.json();

        if (res.ok && data.bebe) {
            const bebe = data.bebe[0]; // assumindo que vem em array

            // Atualizando o nome do H3
            const nomeH3 = document.getElementById('nomeBebeH3');
            nomeH3.textContent = bebe.nome;

            // Preenchendo os inputs
            document.getElementById('inputNomeBebe').value = bebe.nome || '';
            document.getElementById('inputNascimentoBebe').value = bebe.data_nascimento || '';
            document.getElementById('inputCpfBebe').value = bebe.cpf || '';
            document.getElementById('inputSexoBebe').value = getSexoText(bebe.id_sexo);
            document.getElementById('inputNacionalidadeBebe').value = 'Brasileiro'; // caso não venha do backend
            document.getElementById('inputPesoBebe').value = bebe.peso || '';
            document.getElementById('inputAlturaBebe').value = bebe.altura || '';
            document.getElementById('inputCartaoBebe').value = bebe.cartao_medico || '';
            document.getElementById('inputSangueBebe').value = getSangueText(bebe.id_sangue);
            document.getElementById('inputCertidaoBebe').value = bebe.certidao_nascimento || '';

        } else {
            console.error('Bebê não encontrado ou erro na API');
        }

    } catch (error) {
        console.error('Erro ao carregar perfil do bebê:', error);
    }
}

// Executa ao carregar a página
window.addEventListener('DOMContentLoaded', carregarPerfilBebe);
