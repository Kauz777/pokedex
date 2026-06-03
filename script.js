async function buscarpokemon() {
    const pokemonInput = document.getElementById('pokemon-input').value.trim().toLowerCase();
    const resultadoDiv = document.getElementById('resultado-pokemon');

    // Limpa o resultado da busca anterior
    resultadoDiv.innerHTML = '';

    if (pokemonInput === '') {
        alert('Por favor, digite o nome de um Pokémon!');
        return;
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
        
        // 2. Se o Pokémon não tiver sprite animado (ex: Pokémons muito recentes), 
        // ele usa a arte oficial que você já usava antes como plano B.
        if (!imagemUrl) {
            imagemUrl = dadosPokemon.sprites.other['official-artwork'].front_default;
        }

        // Coloca o conteúdo direto dentro da div que já está posicionada por cima da Pokédex
        resultadoDiv.innerHTML = `
            <h2 style="text-transform: capitalize; font-family: sans-serif;">${nome}</h2>
            <img src="${imagemUrl}" alt="${nome}" class="pokemon-foto">
        `;

    } catch (erro) {
        resultadoDiv.innerHTML = `<p style="color: red; font-weight: bold; font-family: sans-serif;">Não encontrado!</p>`;
    }
}
