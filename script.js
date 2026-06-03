async function buscarpokemon() {
    let pokemonInput = document.getElementById('pokemon-input').value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultado-pokemon');

    // Limpa o resultado da busca anterior e remove o fundo antigo
    resultadoDiv.innerHTML = '';
    resultadoDiv.style.backgroundImage = 'none';

    if (pokemonInput === '') {
        alert('Por favor, digite o nome de um Pokémon!');
        return;
    }

    // Tratamento inteligente para buscar Mega Evoluções de forma simples
    if (pokemonInput.includes('mega')) {
        let nomeBase = pokemonInput.replace('mega', '').trim();
        
        if (nomeBase.endsWith('x') || nomeBase.endsWith('y')) {
            const sufixo = nomeBase.slice(-1);
            nomeBase = nomeBase.slice(0, -1).trim();
            pokemonInput = `${nomeBase}-mega-${sufixo}`;
        } else {
            pokemonInput = `${nomeBase}-mega`;
        }
    }

    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonInput}`);
        
        if (!resposta.ok) {
            throw new Error('Pokémon não encontrado');
        }

        const dadosPokemon = await resposta.json();
        const nome = dadosPokemon.name;
        
        // 1. Tenta pegar o sprite animado (Geração 5 - Black/White)
        let imagemUrl = dadosPokemon.sprites.versions['generation-v']['black-white'].animated.front_default;
        
        // 2. Se o Pokémon não tiver sprite animado, usa a arte oficial em HD como Plano B
        if (!imagemUrl) {
            imagemUrl = dadosPokemon.sprites.other['official-artwork'].front_default;
        }

        
        const imagemFundo = cenarios[tipo] || 'https://i.imgur.com/P4E23uG.png';

        // Aplica o cenário na tela de exibição
        resultadoDiv.style.backgroundImage = `url('${imagemFundo}')`;
        resultadoDiv.style.backgroundSize = '100% 100%';
        resultadoDiv.style.backgroundPosition = 'center';
        resultadoDiv.style.backgroundRepeat = 'no-repeat';

        // Monta o HTML interno com uma caixinha transparente para o nome continuar legível
        resultadoDiv.innerHTML = `
            <h2 style="text-transform: capitalize; font-family: sans-serif; background-color: rgba(255,255,255,0.6); padding: 2px 6px; border-radius: 4px; margin-top: 5px; font-size: 0.9rem;">${nome.replace('-mega', ' Mega')}</h2>
            <img src="${imagemUrl}" alt="${nome}" class="pokemon-foto">
        `;

    } catch (erro) {
        resultadoDiv.innerHTML = `<p style="color: red; font-weight: bold; font-family: sans-serif; font-size: 0.9rem;">Não encontrado!</p>`;
    }
}
