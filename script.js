async function buscarpokemon() {
    let pokemonInput = document.getElementById('pokemon-input').value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultado-pokemon');

    // Limpa o resultado da busca anterior e garante que não haja fundo
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

        // Monta o HTML interno de forma limpa (removi o fundo branco do texto já que não há cenário atrás)
        resultadoDiv.innerHTML = `
            <h2 style="text-transform: capitalize; font-family: sans-serif; margin-top: 5px; font-size: 0.9rem; color: #000;">${nome.replace('-mega', ' Mega')}</h2>
            <img src="${imagemUrl}" alt="${nome}" class="pokemon-foto">
        `;

    } catch (erro) {
        resultadoDiv.innerHTML = `<p style="color: red; font-weight: bold; font-family: sans-serif; font-size: 0.9rem;">Não encontrado!</p>`;
    }
}
