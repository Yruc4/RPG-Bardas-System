// Character Sheet Interactivity - Ordem Paranormal RPG

// Map of Ordem Paranormal attributes
const attributesMap = {
  'for': 'Força',
  'agi': 'Agilidade',
  'int': 'Inteligência',
  'pre': 'Presença',
  'vig': 'Vigor'
};

// Store current NEX milestone for modal submission
let currentNexMilestone = null;

// NEX to PE/RODADA mapping table
const nexToPeMap = {
  '0': 0,
  '5': 1,
  '10': 2,
  '15': 3,
  '20': 4,
  '25': 5,
  '30': 6,
  '35': 7,
  '40': 8,
  '45': 9,
  '50': 10,
  '55': 11,
  '60': 12,
  '65': 13,
  '70': 14,
  '75': 15,
  '80': 16,
  '85': 17,
  '90': 18,
  '95': 19,
  '99': 20
};

// Classe to Trilha mapping
const classeToTrilhaMap = {
  'combatente': ['Aniquilador', 'Comandante de Campo', 'Guerreiro', 'Operações Especiais', 'Tropa de Choque'],
  'especialista': ['Atirador de Elite', 'Infiltrador', 'Médico de Campo', 'Negociador', 'Técnico'],
  'ocultista': ['Conduíte', 'Flagelador', 'Graduado', 'Intuitivo', 'Lâmina Paranormal']
};

// Aniquilador abilities by NEX percentage
const aniquiladorAbilities = {
  10: [{nome: 'A Favorita', custo: '-', pagina: '26', descritivo: 'Categoria da arma escolhida é reduzida em I'}],
  40: [{nome: 'Técnica Secreta', custo: '-', pagina: '26', descritivo: 'Amplo / Destruidor'}],
  65: [{nome: 'Técnica Sublime', custo: '-', pagina: '26', descritivo: 'Letal / Perfurante'}],
  99: [{nome: 'Máquina de Matar', custo: '-', pagina: '26', descritivo: '+2 na margem de ameaça e seu dano aumenta em um dado do mesmo tipo.'}]
};

// Comandante de Campo abilities by NEX percentage
const comandanteDeCampoAbilities = {
  10: [{nome: 'Inspirar Confiança', custo: '2 PE', pagina: '27', descritivo: 'Sua liderança inspira seus aliados. Você pode gastar uma reação e 2 PE para fazer um aliado que alcance outro testar novamente um teste recém realizado.'}],
  40: [{nome: 'Estrategista', custo: '1 PE', pagina: '27', descritivo: 'Você pode direcionar seus aliados em combate. Gaste uma ação padrão e 1 PE por aliado que quiser direcionar (limitado pelo seu Intelecto). No próximo turno dos aliados afetados, eles podem gastar uma ação de movimento adicional.'}],
  65: [{nome: 'Brecha na Guarda', custo: '2 PE', pagina: '27', descritivo: 'Uma vez por rodada, quando um aliado causar dano em um inimigo em alcance curto, você pode gastar uma reação e 2 PE para você ou outro aliado em alcance curto atacar o mesmo inimigo. Além disso, o alcance de inspirar confiança e estrategista aumenta para médio.'}],
  99: [{nome: 'Oficial Comandante', custo: '5 PE', pagina: '27', descritivo: 'Você pode direcionar um aliado que você possa ver em alcance médio receba uma ação padrão no próximo turno dele.'}]
};

// Guerreiro abilities by NEX percentage
const guerreiroAbilities = {
  10: [{nome: 'Técnica Letal', custo: '-', pagina: '27', descritivo: 'Você recebe um aumento de +2 na margem de ameaça com todos os seus ataques corpo a corpo'}],
  40: [{nome: 'Revidar', custo: '2 PE', pagina: '27', descritivo: 'Sempre que bloquear um ataque, você pode gastar uma reação e 2 PE para fazer um ataque corpo a corpo no inimigo que o atacou.'}],
  65: [{nome: 'Força Opressora', custo: '1 PE', pagina: '27', descritivo: 'Quando acerta um ataque corpo a corpo, você pode gastar 1 PE para realizar uma manobra derrubar ou empurrar contra o alvo do ataque como ação livre. Se escolher empurrar, recebe um bônus de +5 para cada 10 pontos de dano que causou no alvo. Se escolher derrubar e vencer no teste oposto, você pode gastar 1 PE para fazer um ataque adicional contra o alvo caído.'}],
  99: [{nome: 'Potência Máxima', custo: '-', pagina: '27', descritivo: 'Quando usa seu Ataque Especial com armas corpo a corpo, todos os bônus numéricos são dobrados. Por exemplo, se usar 5 PE para receber +5 no ataque e +15 no dano, você recebe +10 no ataque e +30 no dano.'}]
};

// Operações Especiais abilities by NEX percentage
const operacoesEspeciaisAbilities = {
  10: [{nome: 'Iniciativa Aprimorada', custo: '-', pagina: '27', descritivo: 'Você recebe +5 em Iniciativa e uma ação de movimento adicional na primeira rodada.'}],
  40: [{nome: 'Ataque Extra', custo: '2 PE', pagina: '27', descritivo: 'Uma vez por rodada, quando faz um ataque, você pode gastar 2 PE para fazer um ataque adicional.'}],
  65: [{nome: 'Surto de Adrenalina', custo: '5 PE', pagina: '27', descritivo: 'Uma vez por rodada, você pode gastar 5 PE para realizar uma ação padrão ou de movimento adicional.'}],
  99: [{nome: 'Sempre Alerta', custo: '-', pagina: '27', descritivo: 'Você recebe uma ação padrão adicional no início de cada cena de combate.'}]
};

// Tropa de Choque abilities by NEX percentage
const tropaDeChoqueAbilities = {
  10: [{nome: 'Casca Grossa', custo: '-', pagina: '27', descritivo: 'Você recebe +1 PV para cada 5% de NEX e, quando faz um bloqueio, soma seu Vigor na resistência a dano recebida.'}],
  40: [{nome: 'Cai Dentro', custo: '1 PE', pagina: '27', descritivo: 'Sempre que um oponente em alcance curto ataca um de seus aliados, você pode gastar uma reação e 1 PE para fazer com que esse oponente faça um teste de Vontade (DT Vig). Se falhar, o oponente deve atacar você em vez de seu aliado. Este poder só funciona se você puder ser efetivamente atacado e estiver no alcance do ataque. Um oponente que passe no teste de Vontade não pode ser afetado por seu poder Cai Dentro até o final da cena.'}],
  65: [{nome: 'Duro de Matar', custo: '2 PE', pagina: '27', descritivo: 'Ao sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade. Em NEX 85%, você pode usar esta habilidade para reduzir dano paranormal.'}],
  99: [{nome: 'Inquebrável', custo: '-', pagina: '27', descritivo: 'Enquanto estiver machucado, você recebe +5 na Defesa e resistência a dano 5. Enquanto estiver morrendo, em vez do normal, você não fica indefeso e ainda pode realizar ações. Você ainda segue as regras de morte normalmente.'}]
};

// Atirador de Elite abilities by NEX percentage
const atiradorDeEliteAbilities = {
  10: [{nome: 'Mira de Elite', custo: '-', pagina: '30', descritivo: 'Você recebe proficiência com armas de fogo que usam balas longas e soma seu Intelecto em rolagens de dano com essas armas.'}],
  40: [{nome: 'Disparo Letal', custo: '1 PE', pagina: '30', descritivo: 'Quando faz a ação mirar você pode gastar 1 PE para aumentar em +2 a margem de ameaça do próximo ataque que fizer até o final de seu próximo turno.'}],
  65: [{nome: 'Disparo Impactante', custo: '2 PE', pagina: '30', descritivo: 'Se estiver usando uma arma de fogo com calibre grosso você pode gastar 2 PE para fazer as manobras derrubar, desarmar, empurrar ou quebrar usando um ataque à distância.'}],
  99: [{nome: 'Atirar para Matar', custo: '-', pagina: '30', descritivo: 'Quando faz um acerto crítico com uma arma de fogo, você causa dano máximo, sem precisar rolar dados.'}]
};

// Infiltrador abilities by NEX percentage
const infiltradorAbilities = {
  10: [{nome: 'Ataque Furtivo', custo: '1 PE', pagina: '30', descritivo: 'Uma vez por rodada, quando atinge um alvo desprevenido com um ataque corpo a corpo ou em alcance curto, ou um alvo que você esteja flanqueando, você pode gastar 1 PE para causar +1d6 pontos de dano do mesmo tipo da arma. Em NEX 40% o dano adicional aumenta para +2d6, em NEX 65% aumenta para +3d6 e em NEX 99% aumenta para +4d6.'}],
  40: [{nome: 'Gatuno', custo: '-', pagina: '30', descritivo: 'Você recebe +5 em Atletismo e Crime e pode percorrer seu deslocamento normal quando se esconder sem penalidade (veja a perícia Furtividade).'}],
  65: [{nome: 'Assassinar', custo: '3 PE', pagina: '30', descritivo: 'Você pode gastar uma ação de movimento e 3 PE para analisar um alvo em alcance curto. Até o fim de seu próximo turno, seu primeiro Ataque Furtivo que causar dano a ele tem seus dados de dano extras dessa habilidade dobrados. Além disso, se sofrer dano de seu ataque, o alvo fica inconsciente ou morrendo, à sua escolha (Fortitude DT Agi evita).'}],
  99: [{nome: 'Sombra Fugaz', custo: '3 PE', pagina: '30', descritivo: 'Quando faz um teste de Furtividade após atacar ou fazer outra ação chamativa, você pode gastar 3 PE para não sofrer a penalidade de –3d20 no teste.'}]
};

// Médico de Campo abilities by NEX percentage
const medicoDeCampoAbilities = {
  10: [{nome: 'Paramédico', custo: '2 PE', pagina: '31', descritivo: 'Você pode usar uma ação padrão e 2 PE para curar 2d10 pontos de vida de si mesmo ou de um aliado adjacente. Você pode curar +1d10 PV respectivamente em NEX 40%, 65% e 99%, gastando +1 PE por dado adicional de cura.'}],
  40: [{nome: 'Equipe de Trauma', custo: '2 PE', pagina: '31', descritivo: 'Você pode usar uma ação padrão e 2 PE para remover uma condição negativa (exceto morrendo) de um aliado adjacente.'}],
  65: [{nome: 'Resgate', custo: '-', pagina: '31', descritivo: 'Uma vez por rodada, se estiver em alcance curto de um aliado machucado ou morrendo, você pode se aproximar do aliado com uma ação livre (desde que seja capaz de fazê-lo usando seu deslocamento normal). Além disso, sempre que curar PV ou remover condições do aliado, você e o aliado recebem +5 na Defesa até o início de seu próximo turno. Por fim, para você, o total de espaços ocupados por carregar um personagem é reduzido pela metade.'}],
  99: [{nome: 'Reanimação', custo: '10 PE', pagina: '31', descritivo: 'Uma vez por cena, você pode gastar uma ação completa e 10 PE para trazer de volta à vida um personagem que tenha morrido na mesma cena (exceto morte por dano massivo).'}]
};

// Negociador abilities by NEX percentage
const negociadorAbilities = {
  10: [{nome: 'Eloquência', custo: '1 PE', pagina: '31', descritivo: 'Você pode usar uma ação completa e 1 PE por alvo em alcance curto para afetar outros personagens com sua fala. Faça um teste de Diplomacia, Enganação ou Intimidação contra a Vontade dos alvos. Se você vencer, os alvos ficam fascinados enquanto você se concentrar (uma ação padrão por rodada). Um alvo hostil ou que esteja envolvido em combate recebe +5 em seu teste de resistência e tem direito a um novo teste por rodada. Um personagem que passar no teste fica imune a este efeito por um dia.'}],
  40: [{nome: 'Discurso Motivador', custo: '4 PE', pagina: '31', descritivo: 'Você pode gastar uma ação padrão e 4 PE para inspirar seus aliados com suas palavras. Você e todos os seus aliados em alcance curto ganham +5 em testes de perícia até o fim da cena. A partir de NEX 65%, você pode gastar 8 PE para fornecer um bônus total de +10.'}],
  65: [{nome: 'Eu Conheço um Cara', custo: '-', pagina: '31', descritivo: 'Uma vez por missão, você pode ativar sua rede de contatos para pedir um favor, como por exemplo trocar todo o equipamento do seu grupo (como se tivesse uma segunda fase de preparação de missão), conseguir um local de descanso ou mesmo ser resgatado de uma cena. O mestre tem a palavra final de quando é possível usar essa habilidade e quais favores podem ser obtidos.'}],
  99: [{nome: 'Truque de Mestre', custo: '5 PE', pagina: '31', descritivo: 'Acostumado a uma vida de fingimento e manipulação, você pode gastar 5 PE para simular o efeito de qualquer habilidade que você tenha visto um de seus aliados usar durante a cena. Você ignora os pré-requisitos da habilidade, mas ainda precisa pagar todos os seus custos, incluindo ações, PE e materiais, e ela usa os seus parâmetros de jogo, como se você estivesse usando a habilidade em questão.'}]
};

// Técnico abilities by NEX percentage
const tecnicoAbilities = {
  10: [{nome: 'Inventário Otimizado', custo: '-', pagina: '31', descritivo: 'Você soma seu Intelecto à sua Força para calcular sua capacidade de carga.'}],
  40: [{nome: 'Remendão', custo: '1 PE', pagina: '31', descritivo: 'Gaste uma ação completa e 1 PE para remover a condição quebrado de um equipamento adjacente até o final da cena. Além disso, qualquer equipamento geral tem sua categoria reduzida em I para você.'}],
  65: [{nome: 'Improvisar', custo: '2 PE + 2 PE por categoria', pagina: '31', descritivo: 'Escolha um equipamento geral e gaste uma ação completa e 2 PE, mais 2 PE por categoria do item. Você cria uma versão funcional que segue regras normais de espaço e categoria. Ao final da cena, o equipamento improvisado se torna inútil.'}],
  99: [{nome: 'Preparado para Tudo', custo: '3 PE por categoria', pagina: '31', descritivo: 'Sempre que precisar de um item (exceto armas), gaste uma ação de movimento e 3 PE por categoria do item para “encontrá-lo” no fundo da bolsa. Depois, o item segue as regras de inventário normalmente.'}]
};

// Conduíte abilities by NEX percentage
const conduíteAbilities = {
  10: [{nome: 'Ampliar Ritual', custo: '2 PE', pagina: '34', descritivo: 'Quando lança um ritual, você pode gastar +2 PE para aumentar seu alcance em um passo (curto → médio, médio → longo ou longo → extremo) ou dobrar sua área de efeito.'}],
  40: [{nome: 'Acelerar Ritual', custo: '4 PE', pagina: '34', descritivo: 'Uma vez por rodada, você pode aumentar o custo de um ritual em 4 PE para conjurá-lo como uma ação livre.'}],
  65: [{nome: 'Anular Ritual', custo: 'Igual ao custo do ritual', pagina: '34', descritivo: 'Quando for alvo de um ritual, você pode gastar uma quantidade de PE igual ao custo pago por esse ritual e fazer um teste oposto de Ocultismo contra o conjurador. Se vencer, você anula o ritual, cancelando todos os seus efeitos.'}],
  99: [{nome: 'Canalizar o Medo', custo: '-', pagina: '34', descritivo: 'Você aprende o ritual Canalizar o Medo.'}]
};

// Flagelador abilities by NEX percentage
const flageladorAbilities = {
  10: [{nome: 'Poder do Flagelo', custo: '2 PV por 1 PE', pagina: '34/35', descritivo: 'Ao conjurar um ritual, você pode gastar seus próprios PV para pagar o custo em PE, à taxa de 2 PV por 1 PE. PV gastos assim só são recuperados com descanso.'}],
  40: [{nome: 'Abraçar a Dor', custo: '2 PE', pagina: '34/35', descritivo: 'Sempre que sofrer dano não paranormal, você pode gastar uma reação e 2 PE para reduzir esse dano à metade.'}],
  65: [{nome: 'Absorver Agonia', custo: '-', pagina: '34/35', descritivo: 'Sempre que reduzir um ou mais inimigos a 0 PV com um ritual, você recebe PE temporários iguais ao círculo do ritual utilizado.'}],
  99: [{nome: 'Medo Tangível', custo: '-', pagina: '34/35', descritivo: 'Você aprende o ritual Medo Tangível.'}]
};

// Graduado abilities by NEX percentage
const graduadoAbilities = {
  10: [{nome: 'Saber Ampliado', custo: '-', pagina: '35', descritivo: 'Você aprende um ritual de 1º círculo. Sempre que ganha acesso a um novo círculo, aprende 1 ritual adicional daquele círculo. Esses rituais não contam no seu limite.'}],
  40: [{nome: 'Grimório Ritualístico', custo: '-', pagina: '35', descritivo: 'Cria um grimório especial que armazena rituais além do seu limite. Aprende uma quantidade de rituais de 1º ou 2º círculos igual ao seu Intelecto; ao ganhar novo círculo, pode incluir 1 ritual desse círculo no grimório. Para conjurar um ritual do grimório, empunhe-o e gaste uma ação completa folheando. O grimório ocupa 1 espaço; se perdido, pode ser replicado com 2 ações de interlúdio.'}],
  65: [{nome: 'Rituais Eficientes', custo: '-', pagina: '35', descritivo: 'A DT para resistir a todos os seus rituais aumenta em +5.'}],
  99: [{nome: 'Conhecendo o Medo', custo: '-', pagina: '35', descritivo: 'Você aprende o ritual Conhecendo o Medo.'}]
};

// Intuitivo abilities by NEX percentage
const intuitivoAbilities = {
  10: [{nome: 'Mente Sã', custo: '-', pagina: '35', descritivo: 'Você recebe resistência paranormal +5 (bônus de +5 em testes de resistência contra efeitos paranormais).'}],
  40: [{nome: 'Presença Poderosa', custo: '-', pagina: '35', descritivo: 'Adiciona sua Presença ao seu limite de PE por turno, apenas para conjurar rituais (não afeta DT).'}],
  65: [{nome: 'Inabalável', custo: '-', pagina: '35', descritivo: 'Resistência a dano mental e paranormal 10. Em efeitos paranormais com teste de Vontade para reduzir dano à metade, você não sofre dano se passar.'}],
  99: [{nome: 'Presença do Medo', custo: '-', pagina: '35', descritivo: 'Você aprende o ritual Presença do Medo.'}]
};

// Lâmina Paranormal abilities by NEX percentage
const laminaParanormalAbilities = {
  10: [{nome: 'Lâmina Maldita', custo: '-', pagina: '35', descritivo: 'Você aprende o ritual Amaldiçoar Arma (se já conhece, custo –1 PE). Ao conjurá-lo, pode usar Ocultismo no lugar de Luta ou Pontaria para ataques com a arma amaldiçoada.'}],
  40: [{nome: 'Gladiador Paranormal', custo: '-', pagina: '35', descritivo: 'Sempre que acerta um ataque corpo a corpo em um inimigo, recebe 2 PE temporários (máximo por cena igual ao seu limite de PE). PE temporários somem no fim da cena.'}],
  65: [{nome: 'Conjuração Marcial', custo: '2 PE', pagina: '35', descritivo: 'Uma vez por rodada, quando lança um ritual com execução de ação padrão, pode gastar 2 PE para fazer um ataque corpo a corpo como ação livre.'}],
  99: [{nome: 'Lâmina do Medo', custo: '-', pagina: '35', descritivo: 'Você aprende o ritual Lâmina do Medo.'}]
};

// Ocultista generic abilities (available at various NEX thresholds via IDE)
const ocultistaGenericAbilities = {
  0: [
    { nome: 'Camuflar Ocultismo', descritivo: 'Você pode gastar uma ação livre para esconder símbolos e sigilos que estejam desenhados ou gravados em objetos ou em sua pele, tornando-os invisíveis para outras pessoas além de você mesmo. Além disso, quando lança um ritual, pode gastar +2 PE para lançá-lo sem usar componentes ritualísticos e sem gesticular (o que permite conjurar um ritual com as mãos presas), usando apenas concentração. Outros seres só perceberão que você lançou um ritual se passarem num teste de Ocultismo (DT 25).' },
    { nome: 'Criar Selo', descritivo: 'Você sabe fabricar selos paranormais de rituais que conheça (veja a página 151). Fabricar um selo gasta uma ação de interlúdio e um número de PE iguais ao custo de conjurar o ritual. Você pode ter um número máximo de selos criados ao mesmo tempo igual à sua Presença.' },
    { nome: 'Envolto em Mistério', descritivo: 'Sua aparência e postura assombrosas o permitem manipular e assustar pessoas ignorantes ou supersticiosas. O mestre define o que exatamente você pode fazer e quem se encaixa nessa descrição. Como regra geral, você recebe +5 em Enganação e Intimidação contra pessoas não treinadas em Ocultismo.' },
    { nome: 'Especialista em Elemento', descritivo: 'Escolha um elemento. A DT para resistir aos seus rituais desse elemento aumenta em +2.' },
    { nome: 'Ferramentas Paranormais', descritivo: 'Você reduz a categoria de um item paranormal em I e pode ativar itens paranormais sem pagar seu custo em PE.' },
    { nome: 'Guiado pelo Paranormal', descritivo: 'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional.' },
    { nome: 'Identificação Paranormal', descritivo: 'Você recebe +10 em testes de Ocultismo para identificar criaturas, objetos ou rituais.' },
    { nome: 'Improvisar Componentes', descritivo: 'Uma vez por cena, você pode gastar uma ação completa para fazer um teste de Investigação (DT 15). Se passar, encontra objetos que podem servir como componentes ritualísticos de um elemento à sua escolha. O mestre define se é possível usar esse poder na cena atual.' },
    { nome: 'Intuição Paranormal', descritivo: 'Sempre que usa a ação facilitar investigação, você soma seu Intelecto ou Presença no teste (à sua escolha).' },
    { nome: 'Ritual Potente', descritivo: 'Você soma seu Intelecto nas rolagens de dano ou nos efeitos de cura de seus rituais. Pré-requisito: Int 2.' },
    { nome: 'Ritual Predileto', descritivo: 'Escolha um ritual que você conhece. Você reduz em –1 PE o custo do ritual. Essa redução se acumula com reduções fornecidas por outras fontes.' },
    { nome: 'Tatuagem Ritualística', descritivo: 'Símbolos marcados em sua pele reduzem em –1 PE o custo de rituais de alcance pessoal que têm você como alvo.' },
    { nome: 'Transcender', descritivo: 'Escolha um poder paranormal (veja a página 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.' },
    { nome: 'Treinamento em Perícia', descritivo: 'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.' }
  ],
  45: [
    { nome: 'Mestre em Elemento', descritivo: 'Escolha um elemento. O custo para lançar rituais desse elemento diminui em –1 PE. Pré-requisitos: Especialista em Elemento no elemento escolhido, NEX 45%.' }
  ],
  60: [
    { nome: 'Fluxo de Poder', descritivo: 'Você pode manter dois efeitos sustentados de rituais ativos ao mesmo tempo com apenas uma ação livre, pagando o custo de cada efeito separadamente. Pré-requisito: NEX 60%.' }
  ]
};

// Especialista base abilities (apply regardless of Trilha)
const especialistaBaseAbilities = [
  { nome: 'Eclético', custo: '2 PE', pagina: '28', descritivo: 'Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia.' },
  { nome: 'Perito', custo: '2 PE (+1 PE conforme NEX)', pagina: '28', descritivo: 'Escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Ao testar uma delas, gaste 2 PE para somar +1d6 no resultado. Conforme avança de NEX, pode gastar +1 PE para aumentar o dado de bônus (veja a Tabela 1.4). Ex.: em NEX 55%, 4 PE para +1d10.' }
];

// Especialista generic abilities (available at various NEX thresholds via IDE)
const especialistaGenericAbilities = {
  0: [
    { nome: 'Artista Marcial', descritivo: 'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.' },
    { nome: 'Balística Avançada', descritivo: 'Você recebe proficiência com armas táticas de fogo e +2 em rolagens de dano com armas de fogo.' },
    { nome: 'Conhecimento Aplicado', descritivo: 'Quando faz um teste de perícia (exceto Luta e Pontaria), você pode gastar 2 PE para mudar o atributo-base da perícia para Int. Pré-requisito: Int 2.' },
    { nome: 'Hacker', descritivo: 'Você recebe +5 em testes de Tecnologia para invadir sistemas e diminui o tempo necessário para hackear qualquer sistema para uma ação completa. Pré-requisito: treinado em Tecnologia.' },
    { nome: 'Mãos Rápidas', descritivo: 'Ao fazer um teste de Crime, você pode pagar 1 PE para fazê-lo como uma ação livre. Pré-requisitos: Agi 3, treinado em Crime.' },
    { nome: 'Mochila de Utilidades', descritivo: 'Um item a sua escolha (exceto armas) conta como uma categoria abaixo e ocupa 1 espaço a menos.' },
    { nome: 'Movimento Tático', descritivo: 'Você pode gastar 1 PE para ignorar a penalidade em deslocamento por terreno difícil e por escalar até o final do turno. Pré-requisito: treinado em Atletismo.' },
    { nome: 'Na Trilha Certa', descritivo: 'Sempre que tiver sucesso em um teste para procurar pistas, você pode gastar 1 PE para receber +1d20 no próximo teste. Os custos e os bônus são cumulativos (se passar num segundo teste, pode pagar 2 PE para receber um total de +2d20 no próximo teste, e assim por diante).' },
    { nome: 'Nerd', descritivo: 'Você é um repositório de conhecimento útil (e inútil). Uma vez por cena, pode gastar 2 PE para fazer um teste de Atualidades (DT 20). Se passar, recebe uma informação útil para essa cena (se for uma investigação, uma dica para uma pista; se for um combate, uma fraqueza de um inimigo, e assim por diante). A fonte da informação pode ser desde um livro antigo que você leu na biblioteca até um episódio de sua série de ficção favorita.' },
    { nome: 'Ninja Urbano', descritivo: 'Você recebe proficiência com armas táticas de ataque corpo a corpo e de disparo (exceto de fogo) e +2 em rolagens de dano com armas de corpo a corpo e de disparo.' },
    { nome: 'Pensamento Ágil', descritivo: 'Uma vez por rodada, durante uma cena de investigação, você pode gastar 2 PE para fazer uma ação de procurar pistas adicional.' },
    { nome: 'Perito em Explosivos', descritivo: 'Você soma seu Intelecto na DT para resistir aos seus explosivos e pode excluir dos efeitos da explosão um número de alvos igual ao seu valor de Intelecto.' },
    { nome: 'Primeira Impressão', descritivo: 'Você recebe +2d20 no primeiro teste de Diplomacia, Enganação, Intimidação ou Intuição que fizer em uma cena.' },
    { nome: 'Transcender', descritivo: 'Escolha um poder paranormal (veja a página 114). Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.' },
    { nome: 'Treinamento em Perícia', descritivo: 'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.' }
  ]
};

// Combatente base abilities (apply regardless of Trilha)
const combatenteBaseAbilities = [];

// Combatente generic abilities (available at various NEX thresholds via IDE)
const combatenteGenericAbilities = {
  0: [
    { nome: 'Armamento Pesado', descritivo: 'Você recebe proficiência com armas pesadas. Pré-requisito: For 2.' },
    { nome: 'Artista Marcial', descritivo: 'Seus ataques desarmados causam 1d6 pontos de dano, podem causar dano letal e contam como armas ágeis. Em NEX 35%, o dano aumenta para 1d8 e, em NEX 70%, para 1d10.' },
    { nome: 'Ataque de Oportunidade', descritivo: 'Sempre que um ser sair voluntariamente de um espaço adjacente ao seu, você pode gastar uma reação e 1 PE para fazer um ataque corpo a corpo contra ele.' },
    { nome: 'Combater com Duas Armas', descritivo: 'Se estiver empunhando duas armas (e pelo menos uma for leve) e fizer a ação agredir, você pode fazer dois ataques, um com cada arma. Se fizer isso, sofre –1d20 em todos os testes de ataque até o seu próximo turno. Pré-requisitos: Agi 3, treinado em Luta ou Pontaria.' },
    { nome: 'Combate Defensivo', descritivo: 'Quando usa a ação agredir, você pode combater defensivamente. Se fizer isso, até seu próximo turno, sofre –1d20 em todos os testes de ataque, mas recebe +5 na Defesa. Pré-requisito: Int 2.' },
    { nome: 'Golpe Demolidor', descritivo: 'Quando usa a manobra quebrar ou ataca um objeto, você pode gastar 1 PE para causar dois dados de dano extra do mesmo tipo de sua arma. Pré-requisitos: For 2, treinado em Luta.' },
    { nome: 'Golpe Pesado', descritivo: 'O dano de suas armas corpo a corpo aumenta em mais um dado do mesmo tipo.' },
    { nome: 'Presteza Atlética', descritivo: 'Quando faz um teste de facilitar a investigação, você pode gastar 1 PE para usar Força ou Agilidade no lugar do atributo-base da perícia. Se passar no teste, o próximo aliado que usar seu bônus também recebe +1d20 no teste.' },
    { nome: 'Reflexos Defensivos', descritivo: 'Você recebe +2 em Defesa e em testes de resistência. Pré-requisitos: Agi 2.' },
    { nome: 'Saque Rápido', descritivo: 'Você pode sacar ou guardar itens como uma ação livre (em vez de ação de movimento). Além disso, caso esteja usando a regra opcional de contagem de munição, uma vez por rodada pode recarregar uma arma de disparo como uma ação livre. Pré-requisito: treinado em Iniciativa.' },
    { nome: 'Tiro Certeiro', descritivo: 'Se estiver usando uma arma de disparo, você soma sua Agilidade nas rolagens de dano e ignora a penalidade contra alvos envolvidos em combate corpo a corpo (mesmo se não usar a ação mirar). Pré-requisito: treinado em Pontaria.' },
    { nome: 'Tiro de Cobertura', descritivo: 'Você pode gastar uma ação padrão e 1 PE para disparar uma arma de fogo na direção de um personagem no alcance da arma para forçá-lo a se proteger. Faça um teste de Pontaria contra a Vontade do alvo. Se vencer, até o início do seu próximo turno o alvo não pode sair do lugar onde está e sofre –5 em testes de ataque.' },
    { nome: 'Transcender', descritivo: 'Escolha um poder paranormal. Você recebe o poder escolhido, mas não ganha Sanidade neste aumento de NEX. Você pode escolher este poder várias vezes.' },
    { nome: 'Treinamento em Perícia', descritivo: 'Escolha duas perícias. Você se torna treinado nessas perícias. A partir de NEX 35%, você pode escolher perícias nas quais já é treinado para se tornar veterano. A partir de NEX 70%, pode escolher perícias nas quais já é veterano para se tornar expert. Você pode escolher este poder várias vezes.' }
  ],
  15: [
    { nome: 'Incansável', descritivo: 'Uma vez por cena, você pode gastar 2 PE para fazer uma ação de investigação adicional, mas deve usar Força ou Agilidade como atributo-base do teste.' }
  ],
  30: [
    { nome: 'Proteção Pesada', descritivo: 'Você recebe proficiência com Proteções Pesadas. Pré-requisito: NEX 30%.' }
  ],
  60: [
    { nome: 'Segurar o Gatilho', descritivo: 'Sempre que acerta um ataque com uma arma de fogo, pode fazer outro ataque com a mesma arma contra o mesmo alvo, pagando 2 PE por cada ataque já realizado no turno. Pré-requisito: NEX 60%.' }
  ]
};

// Origin to trained skills mapping
const origemToSkillsMap = {
  'academico': ['Ciências', 'Investigação'],
  'agente-saude': ['Intuição', 'Medicina'],
  'artista': ['Artes', 'Enganação'],
  'atleta': ['Acrobacia', 'Atletismo'],
  'chef': ['Fortitude', 'Profissão'],
  'criminoso': ['Crime', 'Furtividade'],
  'culista-arrependido': ['Ocultismo', 'Religião'],
  'desgarrado': ['Fortitude', 'Sobrevivência'],
  'engenheiro': ['Profissão', 'Tecnologia'],
  'executivo': ['Diplomacia', 'Profissão'],
  'investigador': ['Investigação', 'Percepção'],
  'lutador': ['Luta', 'Reflexos'],
  'magnata': ['Diplomacia', 'Pilotagem'],
  'mercenario': ['Iniciativa', 'Intimidação'],
  'militar': ['Pontaria', 'Tática'],
  'operario': ['Fortitude', 'Profissão'],
  'policial': ['Percepção', 'Pontaria'],
  'religioso': ['Religião', 'Vontade'],
  'servidor-publico': ['Intuição', 'Vontade'],
  'teorico-da-conspiracao': ['Investigação', 'Ocultismo'],
  'T.I.': ['Investigação', 'Tecnologia'],
  'trabalhador-rural': ['Adestramento', 'Sobrevivência'],
  'transeunte': ['Enganação', 'Furtividade'],
  'universitario': ['Atualidades', 'Investigação'],
  'vitima': ['Reflexos', 'Vontade']
};

// When any attribute or equipment value changes, update Defesa
document.querySelectorAll('.attr-input').forEach(input => {
  input.addEventListener('input', () => { updateDefesa(); updateDtRituais(); updateVida(); updatePeTotal(); });
  input.addEventListener('change', () => { updateDefesa(); updateDtRituais(); updateVida(); updatePeTotal(); });
});

// also listen to equipamentos input
const equipamentosInput = document.getElementById('equipamentos');
if (equipamentosInput) {
  equipamentosInput.addEventListener('input', updateDefesa);
  equipamentosInput.addEventListener('change', updateDefesa);
}

// listen to protecao dropdown
const protecaoSelect = document.getElementById('protecao');
if (protecaoSelect) {
  protecaoSelect.addEventListener('change', updateDefesa);
}

// listen to nex dropdown for PE/RODADA calculation
const nexSelect = document.getElementById('nex');
if (nexSelect) {
  nexSelect.addEventListener('change', updatePeRodada);
  nexSelect.addEventListener('change', checkNexMilestoneAndShowModal);
  nexSelect.addEventListener('change', () => {
    // Update ritual stats if rituais page is visible
    const rituaisPage = document.getElementById('rituais-page');
    if (rituaisPage && rituaisPage.style.display === 'block') {
      loadRituaisData();
    }
  });
}

// listen to origem dropdown to set trained skills
const origemSelect = document.getElementById('origem');
if (origemSelect) {
  origemSelect.addEventListener('change', setTrainedSkillsFromOrigem);
}

// listen to afinidade dropdown to switch theme
const afinidadeSelect = document.getElementById('afinidade');
if (afinidadeSelect) {
  afinidadeSelect.addEventListener('change', updateThemeFromAfinidade);
}

// listen to classe dropdown to update trilha options
const classeSelect = document.getElementById('classe');
if (classeSelect) {
  classeSelect.addEventListener('change', () => { 
    updateTrilhaOptions(); 
    updateVida(); 
    updatePeTotal(); 
    updateSanCombatente();
    handleEspecialistaSelection();
  });
}

// listen to trilha dropdown to auto-fill abilities
const trilhaSelect = document.getElementById('trilha');
if (trilhaSelect) {
  trilhaSelect.addEventListener('change', autoFillAbilities);
}

// listen to nex changes to update abilities
if (nexSelect) {
  nexSelect.addEventListener('change', () => {
    updatePeRodada();
    autoFillAbilities();
    updateVida();
    updatePeTotal();
    updateSanCombatente();
  });
}

// Auto-resize helper for Descritivo textareas
function attachAutoResize(textarea) {
  if (!textarea) return;
  textarea.style.overflow = 'hidden';
  textarea.style.resize = 'vertical';
  const resize = () => {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };
  textarea.addEventListener('input', resize);
  // Initialize height after value is applied
  setTimeout(resize, 0);
}

// Upgrade existing Descritivo inputs (4th column) to auto-expanding textareas
function upgradeDescritivoInputsToTextareas() {
  const tbody = document.getElementById('abilities-tbody');
  if (!tbody) return;
  Array.from(tbody.querySelectorAll('tr')).forEach(row => {
    const cells = row.querySelectorAll('td');
    if (cells.length >= 4) {
      const fourth = cells[3];
      const input = fourth.querySelector('input.table-input');
      const textarea = fourth.querySelector('textarea.table-input');
      if (input && !textarea) {
        const value = input.value || '';
        const ta = document.createElement('textarea');
        ta.className = 'table-input';
        ta.rows = 1;
        ta.value = value;
        fourth.innerHTML = '';
        fourth.appendChild(ta);
        ta.addEventListener('change', saveCharacterData);
        attachAutoResize(ta);
      } else if (textarea) {
        attachAutoResize(textarea);
      }
    }
  });
}

// Utility: get ability name from a table row (first cell input)
function getAbilityNameFromRow(row) {
  const input = row?.querySelector('td:first-child input');
  return input ? input.value.trim() : '';
}

// Keep Especialista base abilities fixed at the top (Eclético, Perito)
function pinEspecialistaBaseAbilitiesTop() {
  const tbody = document.getElementById('abilities-tbody');
  if (!tbody) return;
  const classeSelect = document.getElementById('classe');
  let baseNames = [];
  if (classeSelect && classeSelect.value === 'especialista') {
    baseNames = especialistaBaseAbilities.map(a => a.nome);
  } else if (classeSelect && classeSelect.value === 'combatente') {
    baseNames = combatenteBaseAbilities.map(a => a.nome);
  }
  // Find current rows for base abilities by name
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const rowsByName = Object.create(null);
  rows.forEach(r => {
    const name = getAbilityNameFromRow(r);
    if (baseNames.includes(name)) rowsByName[name] = r;
  });
  // Insert in reverse desired order so final order is [Eclético, Perito]
  for (let i = baseNames.length - 1; i >= 0; i--) {
    const name = baseNames[i];
    const row = rowsByName[name];
    if (row) tbody.insertBefore(row, tbody.firstChild);
  }
}

// Insert a row right after the base abilities block (if present), else at top
function insertRowAfterBaseBlock(row) {
  const tbody = document.getElementById('abilities-tbody');
  if (!tbody) return;
  const classeSelect = document.getElementById('classe');
  let baseNames = [];
  if (classeSelect && classeSelect.value === 'especialista') {
    baseNames = especialistaBaseAbilities.map(a => a.nome);
  } else if (classeSelect && classeSelect.value === 'combatente') {
    baseNames = combatenteBaseAbilities.map(a => a.nome);
  }
  const currentRows = Array.from(tbody.querySelectorAll('tr'));
  // Find the first non-base row to use as anchor
  const firstNonBase = currentRows.find(r => !baseNames.includes(getAbilityNameFromRow(r)));
  if (firstNonBase) {
    tbody.insertBefore(row, firstNonBase);
  } else {
    // All rows are base or none exist — append at end or insert at top
    if (tbody.firstChild) tbody.appendChild(row); else tbody.insertBefore(row, null);
  }
}

function updateThemeFromAfinidade() {
  const val = document.getElementById('afinidade')?.value || '';
  const body = document.body;
  body.classList.remove('theme-default', 'theme-sangue', 'theme-morte', 'theme-conhecimento', 'theme-energia', 'theme-medo');
  if (val === 'sangue') {
    body.classList.add('theme-sangue');
  } else if (val === 'morte') {
    body.classList.add('theme-morte');
  } else if (val === 'conhecimento') {
    body.classList.add('theme-conhecimento');
  } else if (val === 'energia') {
    body.classList.add('theme-energia');
  } else if (val === 'medo') {
    body.classList.add('theme-medo');
  } else {
    body.classList.add('theme-default');
  }
}

// Handle Especialista class selection - auto-add abilities and prompt for Perito skills
function handleEspecialistaSelection() {
  const classeSelect = document.getElementById('classe');
  if (!classeSelect || classeSelect.value !== 'especialista') return;
  
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  
  // Check if already handled
  if (characterData.especialistaAbilitiesAdded) return;
  
  // Initialize selectedAbilities if not exists
  if (!characterData.selectedAbilities) {
    characterData.selectedAbilities = {};
  }
  
  // Add Eclético at NEX 0 (always available)
  if (!characterData.selectedAbilities['especialista_ecletico']) {
    characterData.selectedAbilities['especialista_ecletico'] = {
      nome: 'Eclético',
      custo: '2 PE',
      pagina: '28',
      descritivo: 'Quando faz um teste de uma perícia, você pode gastar 2 PE para receber os benefícios de ser treinado nesta perícia.'
    };
  }
  
  // Add Perito at NEX 0 (always available)
  if (!characterData.selectedAbilities['especialista_perito']) {
    characterData.selectedAbilities['especialista_perito'] = {
      nome: 'Perito',
      custo: '2 PE (+1 PE conforme NEX)',
      pagina: '28',
      descritivo: 'Escolha duas perícias nas quais você é treinado (exceto Luta e Pontaria). Ao testar uma delas, gaste 2 PE para somar +1d6 no resultado. Conforme avança de NEX, pode gastar +1 PE para aumentar o dado de bônus (veja a Tabela 1.4). Ex.: em NEX 55%, 4 PE para +1d10.'
    };
  }
  
  // Mark as added
  characterData.especialistaAbilitiesAdded = true;
  localStorage.setItem(storageKey, JSON.stringify(characterData));
  
  // Refresh IDE page
  renderIdeAbilitiesPage();
  
  // Show modal to select Perito skills
  showPeritoSkillSelectionModal();
}

// Show modal for selecting 2 perícias for Perito ability
function showPeritoSkillSelectionModal() {
  const modal = document.getElementById('perito-skill-modal');
  if (!modal) return;
  
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  
  // Check if already selected
  if (characterData.peritoSkills && characterData.peritoSkills.length === 2) return;
  
  // Get all skills from the table
  const skillsTable = document.querySelector('.skills-table tbody');
  if (!skillsTable) return;
  
  const skills = [];
  skillsTable.querySelectorAll('tr').forEach(row => {
    const skillName = row.cells[0]?.textContent.trim();
    if (skillName && skillName !== 'Luta' && skillName !== 'Pontaria') {
      skills.push(skillName);
    }
  });
  
  // Populate checkboxes
  const skillsList = modal.querySelector('.perito-skills-list');
  skillsList.innerHTML = skills.map(skill => `
    <label class="perito-skill-option">
      <input type="checkbox" name="perito-skill" value="${skill}">
      <span>${skill}</span>
    </label>
  `).join('');
  
  // Add change listeners to limit to 2 selections
  const checkboxes = skillsList.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = skillsList.querySelectorAll('input[type="checkbox"]:checked');
      if (checked.length > 2) {
        cb.checked = false;
      }
    });
  });
  
  modal.style.display = 'flex';
}

// Close Perito skill selection modal
function closePeritoSkillModal() {
  const modal = document.getElementById('perito-skill-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Confirm Perito skill selection
function confirmPeritoSkills() {
  const modal = document.getElementById('perito-skill-modal');
  if (!modal) return;
  
  const checked = modal.querySelectorAll('input[name="perito-skill"]:checked');
  if (checked.length !== 2) {
    alert('Por favor, selecione exatamente 2 perícias.');
    return;
  }
  
  const selectedSkills = Array.from(checked).map(cb => cb.value);
  
  // Save to localStorage
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  characterData.peritoSkills = selectedSkills;
  localStorage.setItem(storageKey, JSON.stringify(characterData));
  
  // Update Perito ability description
  updatePeritoDescription(selectedSkills);
  
  // Close modal
  closePeritoSkillModal();
  
  alert(`Perícias selecionadas para Perito: ${selectedSkills.join(', ')}`);
}

// Update Perito ability description with selected skills
function updatePeritoDescription(skills) {
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  
  if (!characterData.selectedAbilities) {
    characterData.selectedAbilities = {};
  }
  
  // Update Perito ability with selected skills
  if (characterData.selectedAbilities['especialista_perito']) {
    characterData.selectedAbilities['especialista_perito'].descritivo = 
      `Perícias escolhidas: ${skills.join(', ')}. Ao testar uma delas, gaste 2 PE para somar +1d6 no resultado. Conforme avança de NEX, pode gastar +1 PE para aumentar o dado de bônus (veja a Tabela 1.4). Ex.: em NEX 55%, 4 PE para +1d10.`;
    
    localStorage.setItem(storageKey, JSON.stringify(characterData));
    
    // Refresh IDE page to show updated description
    renderIdeAbilitiesPage();
  }
}

// Update Trilha dropdown options based on selected Classe
function updateTrilhaOptions() {
  const classeSelect = document.getElementById('classe');
  const trilhaSelect = document.getElementById('trilha');
  
  if (!classeSelect || !trilhaSelect) return;
  
  const classeValue = classeSelect.value;
  
  // Clear current options
  trilhaSelect.innerHTML = '<option value="">Selecionar</option>';
  
  // If a classe is selected and exists in map, populate trilha options
  if (classeValue && classeToTrilhaMap[classeValue]) {
    const trilhas = classeToTrilhaMap[classeValue];
    trilhas.forEach(trilha => {
      const option = document.createElement('option');
      option.value = trilha.toLowerCase().replace(/ /g, '-');
      option.textContent = trilha;
      trilhaSelect.appendChild(option);
    });
  }
  // Also ensure base class abilities (e.g., Especialista) are applied
  autoFillAbilities();
  
  // Update IDE title with class name
  updateIdeTitleAndOption();

  saveCharacterData();
}

// Update IDE tab title and select option with class name
function updateIdeTitleAndOption() {
  const classeSelect = document.getElementById('classe');
  const classeValue = classeSelect?.value || '';
  
  // Capitalize class name for display
  const classNameMap = {
    'combatente': 'Combatente',
    'especialista': 'Especialista',
    'ocultista': 'Ocultista'
  };
  
  const displayName = classNameMap[classeValue] || '(Escolha uma Classe)';
  
  // Update IDE page title
  const idePageTitle = document.getElementById('ide-page-title');
  if (idePageTitle) {
    idePageTitle.textContent = `Poder de ${displayName}`;
  }
  
  // Show/hide IDE button based on classe selection
  const ideBtn = document.getElementById('show-ide-btn');
  if (ideBtn) {
    ideBtn.style.display = classeValue ? 'block' : 'none';
  }
  
  // Show/hide Rituais button only for Ocultista
  const rituaisBtn = document.getElementById('show-rituais-btn');
  if (rituaisBtn) {
    rituaisBtn.style.display = (classeValue === 'ocultista') ? 'block' : 'none';
  }
  
  // Render all abilities for the IDE page
  renderIdeAbilitiesPage();
}

// Check if NEX reached a milestone and show ability selection modal
function checkNexMilestoneAndShowModal() {
  const nexSelect = document.getElementById('nex');
  const nex = parseInt(nexSelect?.value || '0', 10) || 0;
  const milestones = [15, 30, 45, 50, 60, 75, 90];
  
  if (!milestones.includes(nex)) {
    return; // Not a milestone
  }
  
  // Get current character data to check if ability already selected for this NEX
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const selectedAbilities = characterData.selectedAbilities || {};
  
  if (selectedAbilities[nex]) {
    return; // Already selected for this NEX level
  }
  
  // Show special modal for NEX 50 with two options
  if (nex === 50) {
    showNex50SpecialModal();
  } else {
    // Show normal ability selection modal
    showAbilitySelectionModal(nex);
  }
}

// Show the ability selection modal
function showAbilitySelectionModal(nex) {
  const modal = document.getElementById('ability-modal');
  const modalTitle = document.getElementById('modal-title');
  const abilitiesList = document.getElementById('abilities-list');
  
  if (!modal) return;
  
  // Store current NEX milestone globally for button submission
  currentNexMilestone = nex;
  
  modalTitle.textContent = `Escolha uma Habilidade para NEX ${nex}`;
  
  // Get all available abilities
  const classeSelect = document.getElementById('classe');
  const trilhaSelect = document.getElementById('trilha');
  const classeVal = (classeSelect?.value || '').toLowerCase();
  const trilhaVal = (trilhaSelect?.value || '').toLowerCase();
  
  const allAbilities = getAllAbilitiesForClass(classeVal, trilhaVal);
  
  // Get already selected abilities to filter them out
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const selectedAbilities = characterData.selectedAbilities || {};
  
  // Build a set of selected ability names
  const selectedNames = new Set();
  Object.keys(selectedAbilities).forEach(key => {
    if (selectedAbilities[key] && selectedAbilities[key].nome) {
      selectedNames.add(selectedAbilities[key].nome);
    }
  });
  
  // Filter abilities: remove already selected ones EXCEPT "Transcender" and "Treinamento em Perícia"
  const repeatableAbilities = ['Transcender', 'Treinamento em Perícia'];
  const availableAbilities = allAbilities.filter(ability => {
    // Always allow repeatable abilities
    if (repeatableAbilities.includes(ability.nome)) {
      return true;
    }
    // Otherwise, only show if not already selected
    return !selectedNames.has(ability.nome);
  });
  
  // Build ability options
  let html = '';
  if (availableAbilities.length === 0) {
    html = '<p style="padding: 20px; text-align: center;">Todas as habilidades já foram selecionadas.</p>';
  } else {
    availableAbilities.forEach((ability, index) => {
      html += `
        <label class="ability-option">
          <input type="radio" name="selected-ability" value="${ability.nome}" data-ability-json='${JSON.stringify(ability)}'>
          <div class="ability-option-label">
            <div class="ability-option-name">${ability.nome}</div>
            <div class="ability-option-desc">${ability.descritivo.substring(0, 100)}...</div>
          </div>
        </label>
      `;
    });
  }
  
  abilitiesList.innerHTML = html;
  modal.style.display = 'flex';
}

// Show special NEX 50 modal with two choice options
function showNex50SpecialModal() {
  const modal = document.getElementById('ability-modal');
  const modalTitle = document.getElementById('modal-title');
  const abilitiesList = document.getElementById('abilities-list');
  
  if (!modal) return;
  
  modalTitle.textContent = 'Escolha uma Opção para NEX 50';
  
  const html = `
    <div style="display: flex; flex-direction: column; gap: 20px; padding: 20px;">
      <button class="btn btn-primary" onclick="showNex50GenericAbilities()" style="padding: 20px; font-size: 16px;">
        Selecionar Habilidade Genérica da Classe
      </button>
      <button class="btn btn-secondary" onclick="showNex50OtherTrilhaAbility()" style="padding: 20px; font-size: 16px;">
        Selecionar Primeira Habilidade de Outra Trilha
      </button>
    </div>
  `;
  
  abilitiesList.innerHTML = html;
  modal.style.display = 'flex';
}

// Show generic abilities for NEX 50
function showNex50GenericAbilities() {
  showAbilitySelectionModal(50);
}

// Show first abilities from other trilhas for NEX 50
function showNex50OtherTrilhaAbility() {
  const modal = document.getElementById('ability-modal');
  const modalTitle = document.getElementById('modal-title');
  const abilitiesList = document.getElementById('abilities-list');
  
  if (!modal) return;
  
  currentNexMilestone = 50;
  
  modalTitle.textContent = 'Escolha a Primeira Habilidade de Outra Trilha (NEX 50)';
  
  // Get current classe and trilha
  const classeSelect = document.getElementById('classe');
  const trilhaSelect = document.getElementById('trilha');
  const classeVal = (classeSelect?.value || '').toLowerCase();
  const currentTrilha = (trilhaSelect?.value || '').toLowerCase();
  
  if (!classeVal) {
    abilitiesList.innerHTML = '<p style="padding: 20px; text-align: center;">Selecione uma classe primeiro.</p>';
    modal.style.display = 'flex';
    return;
  }
  
  // Get all trilhas for this classe
  const allTrilhas = classeToTrilhaMap[classeVal] || [];
  
  // Filter out current trilha
  const otherTrilhas = allTrilhas.filter(t => t.toLowerCase().replace(/ /g, '-') !== currentTrilha);
  
  // Get first ability from each other trilha
  const availableAbilities = [];
  otherTrilhas.forEach(trilhaName => {
    const trilhaKey = trilhaName.toLowerCase().replace(/ /g, '-').replace(/ç/g, 'c').replace(/ã/g, 'a').replace(/á/g, 'a').replace(/é/g, 'e');
    const firstAbility = getFirstAbilityFromTrilha(classeVal, trilhaKey);
    if (firstAbility) {
      firstAbility.trilhaSource = trilhaName; // Add source trilha name
      availableAbilities.push(firstAbility);
    }
  });
  
  // Build ability options
  let html = '';
  if (availableAbilities.length === 0) {
    html = '<p style="padding: 20px; text-align: center;">Nenhuma habilidade disponível de outras trilhas.</p>';
  } else {
    availableAbilities.forEach((ability) => {
      html += `
        <label class="ability-option">
          <input type="radio" name="selected-ability" value="${ability.nome}" data-ability-json='${JSON.stringify(ability)}'>
          <div class="ability-option-label">
            <div class="ability-option-name">${ability.nome} <span style="font-size: 12px; color: var(--text-secondary);">(${ability.trilhaSource})</span></div>
            <div class="ability-option-desc">${ability.descritivo.substring(0, 100)}...</div>
          </div>
        </label>
      `;
    });
  }
  
  abilitiesList.innerHTML = html;
  modal.style.display = 'flex';
}

// Get the first ability (NEX 5 or 10) from a specific trilha
function getFirstAbilityFromTrilha(classe, trilha) {
  // Map trilha names to their ability objects
  const trilhaAbilitiesMap = {
    'combatente': {
      'aniquilador': aniquiladorAbilities,
      'comandante-de-campo': comandanteDeCampoAbilities,
      'guerreiro': guerreiroAbilities,
      'operacoes-especiais': operacoesEspeciaisAbilities,
      'tropa-de-choque': tropaDeChoqueAbilities
    },
    'especialista': {
      'atirador-de-elite': atiradorDeEliteAbilities,
      'infiltrador': infiltradorAbilities,
      'medico-de-campo': medicoDeCampoAbilities,
      'negociador': negociadorAbilities,
      'tecnico': tecnicoAbilities
    },
    'ocultista': {
      'conduite': conduiteAbilities,
      'flagelador': flageladorAbilities,
      'graduado': graduadoAbilities,
      'intuitivo': intuitivoAbilities,
      'lamina-paranormal': laminaParanormalAbilities
    }
  };
  
  const classeAbilities = trilhaAbilitiesMap[classe];
  if (!classeAbilities) return null;
  
  const trilhaAbilities = classeAbilities[trilha];
  if (!trilhaAbilities) return null;
  
  // Get the first NEX level (usually 5 or 10)
  const firstNexLevel = Math.min(...Object.keys(trilhaAbilities).map(Number));
  const firstAbilities = trilhaAbilities[firstNexLevel];
  
  if (firstAbilities && firstAbilities.length > 0) {
    return firstAbilities[0];
  }
  
  return null;
}

// Save the selected ability for a NEX level
function saveSelectedAbility(nex) {
  const selectedRadio = document.querySelector('input[name="selected-ability"]:checked');
  
  if (!selectedRadio) {
    alert('Por favor, selecione uma habilidade.');
    return;
  }
  
  const abilityJson = selectedRadio.dataset.abilityJson;
  const ability = JSON.parse(abilityJson);
  
  // Save to localStorage
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  
  if (!characterData.selectedAbilities) {
    characterData.selectedAbilities = {};
  }
  
  characterData.selectedAbilities[nex] = ability;
  localStorage.setItem(storageKey, JSON.stringify(characterData));
  
  // Close modal
  closeAbilityModal();
  
  // Refresh the IDE page display
  renderIdeAbilitiesPage();
  
  // Show confirmation message
  alert(`Habilidade "${ability.nome}" adicionada ao seu Poder de Classe!`);
}

// Wrapper function for modal button (uses stored currentNexMilestone)
function saveSelectedAbilityFromModal() {
  if (currentNexMilestone !== null) {
    const selectedRadio = document.querySelector('input[name="selected-ability"]:checked');
    
    if (!selectedRadio) {
      alert('Por favor, selecione uma habilidade.');
      return;
    }
    
    const abilityJson = selectedRadio.dataset.abilityJson;
    const ability = JSON.parse(abilityJson);
    
    // Check if "Transcender" was selected
    if (ability.nome === 'Transcender') {
      closeAbilityModal();
      showTranscenderModal(currentNexMilestone);
    } else {
      saveSelectedAbility(currentNexMilestone);
    }
  }
}

// Show Transcender element selection modal
function showTranscenderModal(nex) {
  const modal = document.getElementById('transcender-modal');
  if (!modal) return;
  
  // Store the NEX for later use
  modal.dataset.nex = nex;
  
  // Add click handlers to element cards
  const elementCards = modal.querySelectorAll('.element-card');
  elementCards.forEach(card => {
    card.onclick = function() {
      const element = this.dataset.element;
      selectTranscenderElement(element, nex);
    };
  });
  
  modal.style.display = 'flex';
}

// Element abilities data
const elementAbilities = {
  sangue: [
    {
      nome: 'Resistir a Sangue',
      descricao: 'Você recebe resistência 10 contra esse elemento. Este poder conta como um poder do elemento escolhido.',
      afinidade: 'Aumenta a resistência para 20.'
    },
    {
      nome: 'Anatomia Insana',
      descricao: 'O seu corpo é transfigurado e parece desenvolver um instinto próprio separado da sua consciência. Você tem 50% de chance (resultado par em 1d4) de ignorar o dano adicional de um acerto crítico ou ataque furtivo. Pré-requisito: Sangue 2.',
      afinidade: 'Você é imune aos efeitos de acertos críticos e ataques furtivos.'
    },
    {
      nome: 'Arma de Sangue',
      descricao: 'O Sangue devora parte de seu corpo e se manifesta como parte de você. Você pode gastar uma ação de movimento e 2 PE para produzir garras, chifres ou uma lâmina de sangue cristalizado que brota de seu antebraço. Qualquer que seja sua escolha, é considerada uma arma simples, corpo a corpo e leve, que você não precisa empunhar e causa 1d6 pontos de dano de Sangue. Uma vez por turno, quando você usa a ação agredir, pode gastar 1 PE para fazer um ataque adicional com essa arma. A arma dura até o final da cena, e então se desfaz numa poça de sangue coagulado.',
      afinidade: 'A arma se torna parte permanente de você e causa 1d10 pontos de dano de Sangue.'
    },
    {
      nome: 'Sangue de Ferro',
      descricao: 'O seu sangue flui de forma paranormal e agressiva, concedendo vigor não natural. Você recebe +2 pontos de vida por NEX. Quando sobe de NEX, os PV que recebe por este poder aumentam de acordo. Por exemplo, se escolher este poder em NEX 50%, recebe 20 PV. Quando subir para NEX 55%, recebe +2 PV, e assim por diante.',
      afinidade: 'Você recebe +5 em Fortitude e se torna imune a venenos e doenças.'
    },
    {
      nome: 'Sangue Fervente',
      descricao: 'A intensidade da dor desperta em você sentimentos bestiais e prazerosos que você nem imaginava que existiam. Enquanto estiver machucado, você recebe +1 em Agilidade ou Força, à sua escolha (escolha sempre que este efeito for ativado). Pré-requisito: Sangue 2.',
      afinidade: 'O bônus que você recebe em Agilidade ou Força aumenta para +2.'
    },
    {
      nome: 'Sangue Vivo',
      descricao: 'A carnificina não pode parar, o Sangue precisa continuar fluindo. Na primeira vez que ficar machucado durante uma cena, você recebe cura acelerada 2 (veja a página 179). Esse efeito nunca cura você acima da metade dos PV máximos (ou seja, você nunca deixa de estar machucado) e termina no fim da cena ou caso você perca a condição machucado. Pré-requisito: Sangue 1.',
      afinidade: 'A cura acelerada aumenta para 5.'
    }
  ],
  morte: [
    {
      nome: 'Resistir a Morte',
      descricao: 'Você recebe resistência 10 contra esse elemento. Este poder conta como um poder do elemento escolhido.',
      afinidade: 'Aumenta a resistência para 20.'
    },
    {
      nome: 'Encarar a Morte',
      descricao: 'Sua conexão com a Morte faz com que você não hesite em situações de perigo. Durante cenas de ação, seu limite de gasto de PE aumenta em +1 (isso não afeta a DT de seus efeitos).',
      afinidade: 'Durante cenas de ação, seu limite de gasto de PE aumenta em +2 (para um total de +3).'
    },
    {
      nome: 'Escapar da Morte',
      descricao: 'A Morte tem um interesse especial em sua caminhada. Uma vez por cena, quando receber dano que o deixaria com 0 PV, você fica com 1 PV. Não funciona em caso de dano massivo. Pré-requisito: Morte 1.',
      afinidade: 'Em vez do normal, você evita completamente o dano. Em caso de dano massivo, você fica com 1 PV.'
    },
    {
      nome: 'Potencial Aprimorado',
      descricao: 'A Morte lhe concede potencial latente de momentos roubados de outro lugar. Você recebe +1 ponto de esforço por NEX. Quando sobe de NEX, os PE que recebe por este poder aumentam de acordo. Por exemplo, se escolher este poder em NEX 30%, recebe 6 PE. Quando subir para NEX 35%, recebe +1 PE adicional, e assim por diante.',
      afinidade: 'Você recebe +1 PE adicional por NEX (para um total de +2 PE por NEX).'
    },
    {
      nome: 'Potencial Reaproveitado',
      descricao: 'Você absorve os momentos desperdiçados de outros seres. Uma vez por rodada, quando passa num teste de resistência, você ganha 2 PE temporários cumulativos. Os pontos desaparecem no final da cena.',
      afinidade: 'Você ganha 3 PE temporários, em vez de 2.'
    },
    {
      nome: 'Surto Temporal',
      descricao: 'A sua percepção temporal se torna distorcida e espiralizada, fazendo com que a noção de passagem do tempo nunca mais seja a mesma para você. Uma vez por cena, durante seu turno, você pode gastar 3 PE para realizar uma ação padrão adicional. Pré-requisito: Morte 2.',
      afinidade: 'Em vez de uma vez por cena, você pode usar este poder uma vez por turno.'
    }
  ],
  conhecimento: [
    {
      nome: 'Resistir a Conhecimento',
      descricao: 'Você recebe resistência 10 contra esse elemento. Este poder conta como um poder do elemento escolhido.',
      afinidade: 'Aumenta a resistência para 20.'
    },
    {
      nome: 'Expansão de Conhecimento',
      descricao: 'Você se conecta com o Conhecimento do Outro Lado, rompendo os limites de sua compreensão. Você aprende um poder de classe que não pertença à sua classe (caso o poder possua pré-requisitos, você precisa preenchê-los). Pré-requisito: Conhecimento 1.',
      afinidade: 'Você aprende um segundo poder de classe que não pertença à sua classe.'
    },
    {
      nome: 'Percepção Paranormal',
      descricao: 'O Conhecimento sussurra em sua mente. Em cenas de investigação, sempre que fizer um teste para procurar pistas, você pode rolar novamente um dado com resultado menor que 10. Você deve aceitar a segunda rolagem, mesmo que seja menor que a primeira.',
      afinidade: 'Você pode rolar novamente até dois dados com resultado menor que 10.'
    },
    {
      nome: 'Precognição',
      descricao: 'Você possui um "sexto sentido" que o avisa do perigo antes que ele aconteça. Você recebe +2 em Defesa e em testes de resistência. Pré-requisito: Conhecimento 1.',
      afinidade: 'Você fica imune à condição desprevenido.'
    },
    {
      nome: 'Sensitivo',
      descricao: 'Você consegue sentir as emoções e intenções de outros seres, como medo, raiva ou malícia, recebendo +5 em testes de Diplomacia, Intimidação e Intuição.',
      afinidade: 'Quando você faz um teste oposto usando uma dessas perícias, o oponente sofre –1d20.'
    },
    {
      nome: 'Visão do Oculto',
      descricao: 'Você não enxerga mais pelos olhos, mas sim pela percepção do Conhecimento em sua mente. Você recebe +5 em testes de Percepção e enxerga no escuro.',
      afinidade: 'Você ignora camuflagem.'
    }
  ],
  energia: [
    {
      nome: 'Resistir a Energia',
      descricao: 'Você recebe resistência 10 contra esse elemento. Este poder conta como um poder do elemento escolhido.',
      afinidade: 'Aumenta a resistência para 20.'
    },
    {
      nome: 'Afortunado',
      descricao: 'A Energia considera resultados medíocres entediantes. Uma vez por rolagem, você pode rolar novamente um resultado 1 em qualquer dado que não seja d20.',
      afinidade: 'Além disso, uma vez por teste, você pode rolar novamente um resultado 1 em d20.'
    },
    {
      nome: 'Campo Protetor',
      descricao: 'Você consegue gerar um campo de Energia que o protege de perigos. Quando usa a ação esquiva, você pode gastar 1 PE para receber +5 em Defesa. Pré-requisito: Energia 1.',
      afinidade: 'Quando usa este poder, você também recebe +5 em Reflexo e, até o início de seu próximo turno, se passar em um teste de Reflexo que reduziria o dano à metade, em vez disso não sofre nenhum dano.'
    },
    {
      nome: 'Causalidade Fortuita',
      descricao: 'A Energia o conduz rumo a descobertas. Em cenas de investigação, a DT para procurar pistas diminui em –5 para você até você encontrar uma pista.',
      afinidade: 'A DT para procurar pistas sempre diminui em –5 para você.'
    },
    {
      nome: 'Golpe de Sorte',
      descricao: 'Seus ataques recebem +1 na margem de ameaça. Pré-requisito: Energia 1.',
      afinidade: 'Seus ataques recebem +1 no multiplicador de crítico.'
    },
    {
      nome: 'Manipular Entropia',
      descricao: 'Nada diverte mais a Energia do que a possibilidade de um desastre ainda maior. Quando outro ser em alcance curto faz um teste de perícia, você pode gastar 2 PE para fazê-lo rolar novamente um dos dados desse teste. Pré-requisito: Energia 1.',
      afinidade: 'O alvo rola novamente todos os dados que você escolher.'
    }
  ]
};

// Select an element for Transcender
function selectTranscenderElement(element, nex) {
  // Close transcender modal
  closeTranscenderModal();
  
  // Show element abilities modal
  showElementAbilitiesModal(element, nex);
}

// Show element abilities selection modal
function showElementAbilitiesModal(element, nex) {
  const modal = document.getElementById('element-abilities-modal');
  if (!modal) return;
  
  modal.dataset.element = element;
  modal.dataset.nex = nex;
  
  // Update modal title and theme
  const modalContent = modal.querySelector('.modal-content');
  const modalTitle = modal.querySelector('.modal-header h2');
  modalTitle.textContent = `Transcender - ${element.charAt(0).toUpperCase() + element.slice(1)}`;
  
  // Apply theme class
  modalContent.className = `modal-content element-abilities-modal-content theme-${element}`;
  
  // Populate abilities list
  const abilitiesList = modal.querySelector('.element-abilities-list');
  const abilities = elementAbilities[element] || [];
  
  abilitiesList.innerHTML = abilities.map((ability, index) => `
    <label class="element-ability-card" for="element-ability-${index}">
      <input type="radio" name="element-ability-selection" id="element-ability-${index}" 
             value="${index}" data-ability-json='${JSON.stringify(ability)}'>
      <div class="ability-card-content">
        <h3 class="ability-name">${ability.nome}</h3>
        <p class="ability-description">${ability.descricao}</p>
        <p class="ability-affinity"><strong>Afinidade:</strong> ${ability.afinidade}</p>
      </div>
    </label>
  `).join('');
  
  modal.style.display = 'flex';
}

// Close element abilities modal
function closeElementAbilitiesModal() {
  const modal = document.getElementById('element-abilities-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Confirm element selection from abilities modal
function confirmElementSelection() {
  const modal = document.getElementById('element-abilities-modal');
  const element = modal.dataset.element;
  const nex = modal.dataset.nex;
  
  // Get selected ability
  const selectedRadio = modal.querySelector('input[name="element-ability-selection"]:checked');
  if (!selectedRadio) {
    alert('Por favor, selecione uma habilidade.');
    return;
  }
  
  const abilityData = JSON.parse(selectedRadio.dataset.abilityJson);
  
  const ability = {
    nome: `Transcender (${element.charAt(0).toUpperCase() + element.slice(1)}) - ${abilityData.nome}`,
    custo: '-',
    pagina: '-',
    descritivo: abilityData.descricao + '\n\nAfinidade: ' + abilityData.afinidade
  };
  
  // Save to localStorage
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  
  if (!characterData.selectedAbilities) {
    characterData.selectedAbilities = {};
  }
  
  characterData.selectedAbilities[nex] = ability;
  localStorage.setItem(storageKey, JSON.stringify(characterData));
  
  // Close modal
  closeElementAbilitiesModal();
  
  // Refresh the IDE page display
  renderIdeAbilitiesPage();
  
  // Show confirmation message
  alert(`Habilidade "${ability.nome}" adicionada ao seu Poder de Classe!`);
}

// Close the Transcender modal
function closeTranscenderModal() {
  const modal = document.getElementById('transcender-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Close the ability selection modal
function closeAbilityModal() {
  const modal = document.getElementById('ability-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// Toggle between main character sheet and IDE page
function toggleIdePage() {
  const mainPage = document.querySelector('.page');
  const idePage = document.getElementById('ide-page');
  const rituaisPage = document.getElementById('rituais-page');
  
  if (mainPage.style.display === 'none') {
    // Show main page
    mainPage.style.display = 'block';
    idePage.style.display = 'none';
    if (rituaisPage) rituaisPage.style.display = 'none';
  } else {
    // Show IDE page
    mainPage.style.display = 'none';
    idePage.style.display = 'block';
    if (rituaisPage) rituaisPage.style.display = 'none';
    
    // Update character name on IDE page
    const charName = document.getElementById('character-name')?.value || 'Sem nome';
    const ideCharName = document.getElementById('ide-character-name');
    if (ideCharName) {
      ideCharName.value = charName;
    }
  }
}

// Toggle between main character sheet and Rituais page
function toggleRituaisPage() {
  const mainPage = document.querySelector('.page');
  const idePage = document.getElementById('ide-page');
  const rituaisPage = document.getElementById('rituais-page');
  
  if (!rituaisPage) return;
  
  if (mainPage.style.display === 'none') {
    // Show main page
    mainPage.style.display = 'block';
    if (idePage) idePage.style.display = 'none';
    rituaisPage.style.display = 'none';
  } else {
    // Show Rituais page
    mainPage.style.display = 'none';
    if (idePage) idePage.style.display = 'none';
    rituaisPage.style.display = 'block';
    
    // Update character name on Rituais page
    const charName = document.getElementById('character-name')?.value || 'Sem nome';
    const rituaisCharName = document.getElementById('rituais-character-name');
    if (rituaisCharName) {
      rituaisCharName.value = charName;
    }
    
    // Load rituals data
    loadRituaisData();
  }
}

// Load rituals data
function loadRituaisData() {
  // Calculate círculo máximo based on NEX
  const nexSelect = document.getElementById('nex');
  const nex = parseInt(nexSelect?.value || '0', 10);
  
  // Círculo based on NEX: 1º (5-24), 2º (25-49), 3º (50-74), 4º (75-99)
  let circuloMax = 1;
  if (nex >= 75) circuloMax = 4;
  else if (nex >= 50) circuloMax = 3;
  else if (nex >= 25) circuloMax = 2;
  else if (nex >= 5) circuloMax = 1;
  else circuloMax = 0; // Below NEX 5 cannot learn rituals
  
  const circuloField = document.getElementById('ritual-circulo-max');
  if (circuloField) {
    circuloField.value = circuloMax > 0 ? circuloMax + 'º' : '-';
  }
  
  // Calculate DT dos Rituais (10 + Presença + NEX/2)
  const preInput = document.getElementById('pre');
  const pre = parseInt(preInput?.value || '0', 10);
  const dt = 10 + pre + Math.floor(nex / 2);
  
  const dtField = document.getElementById('ritual-dt');
  if (dtField) {
    dtField.value = dt;
  }
  
  // Load saved rituals
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const rituais = characterData.rituais || [];
  
  const rituaisTbody = document.getElementById('rituais-tbody');
  if (rituaisTbody) {
    rituaisTbody.innerHTML = '';
    rituais.forEach((ritual, index) => {
      addRitualRowWithData(ritual, index);
    });
  }
  
  // Update rituais conhecidos count
  const conhecidosField = document.getElementById('ritual-conhecidos');
  if (conhecidosField) {
    conhecidosField.value = rituais.length;
  }
}

// Add a new ritual row
function addRitualRow() {
  addRitualRowWithData({}, null);
  saveRituaisData();
}

// Add ritual row with data
function addRitualRowWithData(ritual, index) {
  const tbody = document.getElementById('rituais-tbody');
  if (!tbody) return;
  
  const row = document.createElement('tr');
  row.dataset.ritualIndex = index !== null ? index : tbody.children.length;
  row.dataset.descricao = ritual.descricao || '';
  
  row.innerHTML = `
    <td><input type="text" class="table-input" value="${ritual.nome || ''}" data-field="nome"></td>
    <td>
      <select class="table-input" data-field="circulo">
        <option value="">-</option>
        <option value="1" ${ritual.circulo === '1' ? 'selected' : ''}>1º</option>
        <option value="2" ${ritual.circulo === '2' ? 'selected' : ''}>2º</option>
        <option value="3" ${ritual.circulo === '3' ? 'selected' : ''}>3º</option>
        <option value="4" ${ritual.circulo === '4' ? 'selected' : ''}>4º</option>
      </select>
    </td>
    <td>
      <select class="table-input" data-field="elemento">
        <option value="">-</option>
        <option value="Conhecimento" ${ritual.elemento === 'Conhecimento' ? 'selected' : ''}>Conhecimento</option>
        <option value="Energia" ${ritual.elemento === 'Energia' ? 'selected' : ''}>Energia</option>
        <option value="Morte" ${ritual.elemento === 'Morte' ? 'selected' : ''}>Morte</option>
        <option value="Sangue" ${ritual.elemento === 'Sangue' ? 'selected' : ''}>Sangue</option>
        <option value="Medo" ${ritual.elemento === 'Medo' ? 'selected' : ''}>Medo</option>
      </select>
    </td>
    <td><input type="text" class="table-input" value="${ritual.execucao || ''}" data-field="execucao" placeholder="Ex: padrão"></td>
    <td><input type="text" class="table-input" value="${ritual.alcance || ''}" data-field="alcance" placeholder="Ex: toque"></td>
    <td><input type="text" class="table-input" value="${ritual.alvo || ''}" data-field="alvo" placeholder="Ex: 1 pessoa"></td>
    <td><input type="text" class="table-input" value="${ritual.duracao || ''}" data-field="duracao" placeholder="Ex: cena"></td>
    <td><input type="text" class="table-input" value="${ritual.resistencia || ''}" data-field="resistencia" placeholder="Ex: Vontade"></td>
    <td><button class="btn-delete-small" onclick="deleteRitualRow(this)" title="Deletar">×</button></td>
  `;
  
  tbody.appendChild(row);
  
  // Add event listeners
  row.querySelectorAll('input, select').forEach(input => {
    input.addEventListener('change', saveRituaisData);
    input.addEventListener('input', saveRituaisData);
  });
  
  // Add click listener to show description
  row.addEventListener('click', (e) => {
    if (!e.target.classList.contains('btn-delete-small')) {
      showRitualDescription(row);
    }
  });
}

// Delete ritual row
function deleteRitualRow(button) {
  const row = button.closest('tr');
  if (row && confirm('Deletar este ritual?')) {
    row.remove();
    saveRituaisData();
  }
}

// Save rituals data
function saveRituaisData() {
  const tbody = document.getElementById('rituais-tbody');
  if (!tbody) return;
  
  const rituais = [];
  tbody.querySelectorAll('tr').forEach(row => {
    const ritual = {
      nome: row.querySelector('[data-field="nome"]')?.value || '',
      circulo: row.querySelector('[data-field="circulo"]')?.value || '',
      elemento: row.querySelector('[data-field="elemento"]')?.value || '',
      execucao: row.querySelector('[data-field="execucao"]')?.value || '',
      alcance: row.querySelector('[data-field="alcance"]')?.value || '',
      alvo: row.querySelector('[data-field="alvo"]')?.value || '',
      duracao: row.querySelector('[data-field="duracao"]')?.value || '',
      resistencia: row.querySelector('[data-field="resistencia"]')?.value || '',
      descricao: row.dataset.descricao || ''
    };
    rituais.push(ritual);
  });
  
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  characterData.rituais = rituais;
  localStorage.setItem(storageKey, JSON.stringify(characterData));
  
  // Update count
  const conhecidosField = document.getElementById('ritual-conhecidos');
  if (conhecidosField) {
    conhecidosField.value = rituais.length;
  }
}

// Show ritual description
function showRitualDescription(row) {
  // Remove highlight from all rows
  document.querySelectorAll('#rituais-tbody tr').forEach(r => r.classList.remove('selected-row'));
  // Highlight selected row
  row.classList.add('selected-row');
  
  const nome = row.querySelector('[data-field="nome"]')?.value || 'Sem nome';
  const circulo = row.querySelector('[data-field="circulo"]')?.value || '-';
  const elemento = row.querySelector('[data-field="elemento"]')?.value || '-';
  const execucao = row.querySelector('[data-field="execucao"]')?.value || '-';
  const alcance = row.querySelector('[data-field="alcance"]')?.value || '-';
  const alvo = row.querySelector('[data-field="alvo"]')?.value || '-';
  const duracao = row.querySelector('[data-field="duracao"]')?.value || '-';
  const resistencia = row.querySelector('[data-field="resistencia"]')?.value || '-';
  
  const container = document.getElementById('ritual-description-container');
  if (container) {
    container.innerHTML = `
      <h3>${nome}</h3>
      <div class="ritual-details-grid">
        <div><strong>Círculo:</strong> ${circulo}º</div>
        <div><strong>Elemento:</strong> ${elemento}</div>
        <div><strong>Execução:</strong> ${execucao}</div>
        <div><strong>Alcance:</strong> ${alcance}</div>
        <div><strong>Alvo:</strong> ${alvo}</div>
        <div><strong>Duração:</strong> ${duracao}</div>
        <div><strong>Resistência:</strong> ${resistencia}</div>
      </div>
      <div class="ritual-description-section">
        <h4>Descrição</h4>
        <textarea class="ritual-description-textarea" data-ritual-nome="${nome}" placeholder="Digite a descrição do ritual aqui...">${row.dataset.descricao || ''}</textarea>
      </div>
    `;
    
    // Add event listener for description textarea
    const textarea = container.querySelector('.ritual-description-textarea');
    if (textarea) {
      textarea.addEventListener('input', (e) => {
        row.dataset.descricao = e.target.value;
        saveRituaisData();
      });
    }
  }
}

// Render all abilities on the IDE page with full descriptions
function renderIdeAbilitiesPage() {
  const container = document.getElementById('ide-abilities-container');
  const selectedContainer = document.getElementById('ide-selected-abilities');
  const classeSelect = document.getElementById('classe');
  const trilhaSelect = document.getElementById('trilha');
  const nexSelect = document.getElementById('nex');
  const classeVal = (classeSelect?.value || '').toLowerCase();
  const trilhaVal = (trilhaSelect?.value || '').toLowerCase();
  const nexValue = parseInt(nexSelect?.value || '0', 10) || 0;
  
  if (!container || !classeVal) {
    if (container) container.innerHTML = '<p>Selecione uma Classe para ver as habilidades.</p>';
    if (selectedContainer) selectedContainer.innerHTML = '';
    return;
  }
  
  // Get selected abilities from storage
  const storageKey = getPlayerStorageKey();
  const characterData = JSON.parse(localStorage.getItem(storageKey) || '{}');
  const selectedAbilities = characterData.selectedAbilities || {};
  
  // Render selected abilities (from NEX milestones)
  let selectedHtml = '<h3>Habilidades Escolhidas (NEX 15, 30, 45...)</h3>';
  let hasSelected = false;
  
  // Add Especialista base abilities if they exist
  if (selectedAbilities['especialista_ecletico']) {
    const ability = selectedAbilities['especialista_ecletico'];
    selectedHtml += `
      <div class="ide-selected-ability-card">
        <div class="nex-badge">BASE</div>
        <div class="ability-name">${ability.nome}</div>
        <div class="ability-description">${ability.descritivo}</div>
      </div>
    `;
    hasSelected = true;
  }
  
  if (selectedAbilities['especialista_perito']) {
    const ability = selectedAbilities['especialista_perito'];
    // Check if perícias are stored and update description if needed
    const peritoSkills = characterData.peritoSkills;
    let description = ability.descritivo;
    let abilityName = ability.nome;
    
    if (peritoSkills && peritoSkills.length === 2) {
      abilityName = `${ability.nome} (${peritoSkills.join(', ')})`;
      description = `Perícias escolhidas: ${peritoSkills.join(', ')}. Ao testar uma delas, gaste 2 PE para somar +1d6 no resultado. Conforme avança de NEX, pode gastar +1 PE para aumentar o dado de bônus (veja a Tabela 1.4). Ex.: em NEX 55%, 4 PE para +1d10.`;
    }
    
    selectedHtml += `
      <div class="ide-selected-ability-card">
        <div class="nex-badge">BASE</div>
        <div class="ability-name">${abilityName}</div>
        <div class="ability-description">${description}</div>
      </div>
    `;
    hasSelected = true;
  }
  
  // Add NEX milestone abilities
  const milestones = [15, 30, 45, 60, 75, 90];
  milestones.forEach(nex => {
    if (selectedAbilities[nex]) {
      const ability = selectedAbilities[nex];
      selectedHtml += `
        <div class="ide-selected-ability-card">
          <div class="nex-badge">NEX ${nex}</div>
          <div class="ability-name">${ability.nome}</div>
          <div class="ability-description">${ability.descritivo}</div>
        </div>
      `;
      hasSelected = true;
    }
  });
  
  // Add automatic trilha abilities section
  selectedHtml += '<h3 style="margin-top: 30px;">Habilidades da Trilha (Automáticas)</h3>';
  let trilhaAbilities = null;
  
  if (classeVal === 'combatente') {
    if (trilhaVal === 'aniquilador') trilhaAbilities = aniquiladorAbilities;
    else if (trilhaVal === 'comandante-de-campo') trilhaAbilities = comandanteDeCampoAbilities;
    else if (trilhaVal === 'guerreiro') trilhaAbilities = guerreiroAbilities;
    else if (trilhaVal === 'operações-especiais') trilhaAbilities = operacoesEspeciaisAbilities;
    else if (trilhaVal === 'tropa-de-choque') trilhaAbilities = tropaDeChoqueAbilities;
  } else if (classeVal === 'especialista') {
    if (trilhaVal === 'atirador-de-elite') trilhaAbilities = atiradorDeEliteAbilities;
    else if (trilhaVal === 'infiltrador') trilhaAbilities = infiltradorAbilities;
    else if (trilhaVal === 'médico-de-campo') trilhaAbilities = medicoDeCampoAbilities;
    else if (trilhaVal === 'negociador') trilhaAbilities = negociadorAbilities;
    else if (trilhaVal === 'técnico') trilhaAbilities = tecnicoAbilities;
  } else if (classeVal === 'ocultista') {
    if (trilhaVal === 'conduíte') trilhaAbilities = conduíteAbilities;
    else if (trilhaVal === 'flagelador') trilhaAbilities = flageladorAbilities;
    else if (trilhaVal === 'graduado') trilhaAbilities = graduadoAbilities;
    else if (trilhaVal === 'intuitivo') trilhaAbilities = intuitivoAbilities;
    else if (trilhaVal === 'lâmina-paranormal') trilhaAbilities = laminaParanormalAbilities;
  }
  
  let hasTrilhaAbilities = false;
  if (trilhaAbilities) {
    Object.keys(trilhaAbilities).sort((a, b) => parseInt(a) - parseInt(b)).forEach(nex => {
      const nexNum = parseInt(nex, 10);
      if (nexNum <= nexValue) {
        trilhaAbilities[nex].forEach(ability => {
          selectedHtml += `
            <div class="ide-selected-ability-card">
              <div class="nex-badge">NEX ${nex}</div>
              <div class="ability-name">${ability.nome}</div>
              <div class="ability-description">${ability.descritivo}</div>
            </div>
          `;
          hasTrilhaAbilities = true;
        });
      }
    });
  }
  
  if (!hasTrilhaAbilities) {
    selectedHtml += '<p style="opacity: 0.7;">Nenhuma habilidade de trilha desbloqueada ainda.</p>';
  }
  
  if (selectedContainer) {
    selectedContainer.innerHTML = selectedHtml;
  }
  
  let html = '<h3>Habilidades Genéricas (Escolha a cada 15 NEX)</h3>';
  
  // Get all generic abilities for this class
  const allAbilities = getAllAbilitiesForClass(classeVal, trilhaVal);
  
  if (allAbilities.length === 0) {
    html += '<p>Nenhuma habilidade disponível para esta classe.</p>';
  } else {
    html += '<div class="abilities-list">';
    allAbilities.forEach((ability, index) => {
      html += `
        <div class="ability-card">
          <div class="ability-header">
            <h3 class="ability-name">${ability.nome}</h3>
            ${ability.custo ? `<span class="ability-cost">${ability.custo}</span>` : ''}
            ${ability.pagina ? `<span class="ability-page">p. ${ability.pagina}</span>` : ''}
          </div>
          <p class="ability-description">${ability.descritivo}</p>
        </div>
      `;
    });
    html += '</div>';
  }
  
  container.innerHTML = html;
}

// Get all abilities for a given class and trilha (for manual selection - generic abilities only)
function getAllAbilitiesForClass(classe, trilha) {
  const allAbilities = [];
  
  // Add only generic abilities (not trilha abilities - those are auto-added)
  if (classe === 'combatente') {
    allAbilities.push(...combatenteBaseAbilities);
    // Add Combatente generic abilities
    Object.keys(combatenteGenericAbilities).forEach(key => {
      allAbilities.push(...combatenteGenericAbilities[key]);
    });
  } else if (classe === 'especialista') {
    allAbilities.push(...especialistaBaseAbilities);
    // Add Especialista generic abilities
    Object.keys(especialistaGenericAbilities).forEach(key => {
      allAbilities.push(...especialistaGenericAbilities[key]);
    });
  } else if (classe === 'ocultista') {
    // Add Ocultista generic abilities
    Object.keys(ocultistaGenericAbilities).forEach(key => {
      allAbilities.push(...ocultistaGenericAbilities[key]);
    });
  }
  
  // DO NOT add trilha abilities here - they are automatically added based on NEX
  
  // Remove duplicates by ability name
  const uniqueAbilities = [];
  const seenNames = new Set();
  allAbilities.forEach(ability => {
    if (!seenNames.has(ability.nome)) {
      seenNames.add(ability.nome);
      uniqueAbilities.push(ability);
    }
  });
  
  return uniqueAbilities;
}

// Auto-fill abilities based on selected Trilha and NEX
function autoFillAbilities() {
  const trilhaSelect = document.getElementById('trilha');
  const nexSelect = document.getElementById('nex');
  const abilitiesTbody = document.getElementById('abilities-tbody');
  const classeSelect = document.getElementById('classe');
  
  if (!trilhaSelect || !nexSelect || !abilitiesTbody) return;
  
  const trilhaValue = trilhaSelect.value;
  const nexValue = parseInt(nexSelect.value, 10) || 0;

  // Track existing abilities before inserting anything
  let existingRows = Array.from(abilitiesTbody.querySelectorAll('tr'));
  const existingAbilities = new Set();
  existingRows.forEach(row => {
    const nameInput = row.querySelector('td:first-child input');
    if (nameInput && nameInput.value.trim()) {
      existingAbilities.add(nameInput.value.trim());
    }
  });

  // Apply base abilities for Especialista regardless of Trilha
  let baseAdded = false;
  if (classeSelect && classeSelect.value === 'especialista') {
    especialistaBaseAbilities.forEach(ability => {
      if (!existingAbilities.has(ability.nome)) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><input type="text" class="table-input" value="${ability.nome}"></td>
          <td><input type="text" class="table-input" value="${ability.custo}"></td>
          <td><input type="text" class="table-input" value="${ability.pagina}"></td>
          <td><textarea class="table-input" rows="1">${ability.descritivo}</textarea></td>
        `;
        abilitiesTbody.insertBefore(row, abilitiesTbody.firstChild);
        row.querySelectorAll('input').forEach(input => {
          input.addEventListener('change', saveCharacterData);
        });
        const ta = row.querySelector('textarea');
        if (ta) {
          ta.addEventListener('change', saveCharacterData);
          attachAutoResize(ta);
        }
        existingAbilities.add(ability.nome);
        baseAdded = true;
      }
    });
    // After ensuring base abilities are present, pin them to the top
    pinEspecialistaBaseAbilitiesTop();
  } else if (classeSelect && classeSelect.value === 'combatente') {
    combatenteBaseAbilities.forEach(ability => {
      if (!existingAbilities.has(ability.nome)) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><input type="text" class="table-input" value="${ability.nome}"></td>
          <td><input type="text" class="table-input" value="${ability.custo}"></td>
          <td><input type="text" class="table-input" value="${ability.pagina}"></td>
          <td><textarea class="table-input" rows="1">${ability.descritivo}</textarea></td>
        `;
        abilitiesTbody.insertBefore(row, abilitiesTbody.firstChild);
        row.querySelectorAll('input').forEach(input => {
          input.addEventListener('change', saveCharacterData);
        });
        const ta = row.querySelector('textarea');
        if (ta) {
          ta.addEventListener('change', saveCharacterData);
          attachAutoResize(ta);
        }
        existingAbilities.add(ability.nome);
        baseAdded = true;
      }
    });
    pinEspecialistaBaseAbilitiesTop();
  }
  
  // Determine which ability set to use
  let abilitySet = null;
  if (trilhaValue === 'aniquilador') {
    abilitySet = aniquiladorAbilities;
  } else if (trilhaValue === 'comandante-de-campo') {
    abilitySet = comandanteDeCampoAbilities;
  } else if (trilhaValue === 'guerreiro') {
    abilitySet = guerreiroAbilities;
  } else if (trilhaValue === 'operações-especiais') {
    abilitySet = operacoesEspeciaisAbilities;
  } else if (trilhaValue === 'tropa-de-choque') {
    abilitySet = tropaDeChoqueAbilities;
  } else if (trilhaValue === 'atirador-de-elite') {
    abilitySet = atiradorDeEliteAbilities;
  } else if (trilhaValue === 'infiltrador') {
    abilitySet = infiltradorAbilities;
  } else if (trilhaValue === 'médico-de-campo') {
    abilitySet = medicoDeCampoAbilities;
  } else if (trilhaValue === 'negociador') {
    abilitySet = negociadorAbilities;
  } else if (trilhaValue === 'técnico') {
    abilitySet = tecnicoAbilities;
  } else if (trilhaValue === 'conduíte') {
    abilitySet = conduíteAbilities;
  } else if (trilhaValue === 'flagelador') {
    abilitySet = flageladorAbilities;
  } else if (trilhaValue === 'graduado') {
    abilitySet = graduadoAbilities;
  } else if (trilhaValue === 'intuitivo') {
    abilitySet = intuitivoAbilities;
  } else if (trilhaValue === 'lâmina-paranormal') {
    abilitySet = laminaParanormalAbilities;
  }
  
  if (abilitySet) {
    // Collect all abilities up to current NEX that aren't already in the table
    const newAbilities = [];
    Object.keys(abilitySet).forEach(nex => {
      if (parseInt(nex, 10) <= nexValue) {
        abilitySet[nex].forEach(ability => {
          if (!existingAbilities.has(ability.nome)) {
            newAbilities.push(ability);
          }
        });
      }
    });
    
    // Add new abilities at the top of the table
    newAbilities.forEach(ability => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><input type="text" class="table-input" value="${ability.nome}"></td>
        <td><input type="text" class="table-input" value="${ability.custo}"></td>
        <td><input type="text" class="table-input" value="${ability.pagina}"></td>
        <td><textarea class="table-input" rows="1">${ability.descritivo}</textarea></td>
      `;
      // Insert new abilities right after the fixed base block (if any)
      insertRowAfterBaseBlock(row);
      
      // Add event listeners for auto-save
      row.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', saveCharacterData);
      });
      const ta = row.querySelector('textarea');
      if (ta) {
        ta.addEventListener('change', saveCharacterData);
        attachAutoResize(ta);
      }
    });
    // Ensure base abilities remain pinned after inserts
    pinEspecialistaBaseAbilitiesTop();
    
    // Ensure at least 3 empty rows exist at the bottom (recompute rows now)
    const allRows = Array.from(abilitiesTbody.querySelectorAll('tr'));
    const emptyRowsNeeded = Math.max(0, 3 - allRows.filter(row => {
      const fields = row.querySelectorAll('input, textarea');
      return Array.from(fields).every(f => !f.value.trim());
    }).length);
    
    for (let i = 0; i < emptyRowsNeeded; i++) {
      const row = document.createElement('tr');
      row.innerHTML = '<td><input type="text" class="table-input"></td><td><input type="text" class="table-input"></td><td><input type="text" class="table-input"></td><td><textarea class="table-input" rows="1"></textarea></td>';
      abilitiesTbody.appendChild(row);
      
      row.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', saveCharacterData);
      });
      const ta = row.querySelector('textarea');
      if (ta) {
        ta.addEventListener('change', saveCharacterData);
        attachAutoResize(ta);
      }
    }
    
    if (newAbilities.length > 0 || baseAdded) {
      saveCharacterData();
    }
  }

  // If no trilha ability set but base abilities were added, still save
  if (!abilitySet && baseAdded) {
    saveCharacterData();
  }
  // Keep base abilities pinned whenever we run autofill
  pinEspecialistaBaseAbilitiesTop();
}

function calculateModifiers() {
  // kept for compatibility — currently modifiers are not shown on sheet
  updateDefesa();
}

// Update Defesa value based on AGI attribute and equipamentos/outros
function updateDefesa() {
  const agiInput = document.getElementById('agi');
  const defesaField = document.getElementById('defesa');
  const equipInput = document.getElementById('equipamentos');
  const protecaoSelect = document.getElementById('protecao');

  if (!defesaField) return;

  const agiValue = agiInput ? parseInt(agiInput.value, 10) || 0 : 0;
  const equipValue = equipInput ? parseInt(equipInput.value, 10) || 0 : 0;
  
  // Calculate protection bonus based on armor type
  let protecaoBonus = 0;
  if (protecaoSelect) {
    const protecaoValue = protecaoSelect.value;
    if (protecaoValue === 'leve') {
      protecaoBonus = 5;
    } else if (protecaoValue === 'pesada') {
      protecaoBonus = 10;
    }
  }

  // Defesa = 10 + AGI (attribute value) + Equipamentos/Outros + Proteção bonus
  const baseDefesa = 10 + agiValue + equipValue + protecaoBonus;
  defesaField.value = baseDefesa;
}

// Update Vida (PV) based on Classe Combatente and NEX progression
function updateVida() {
  const classeSelect = document.getElementById('classe');
  const vigInput = document.getElementById('vig');
  const nexSelect = document.getElementById('nex');
  // Explicitly target the standardized PV field id
  const vidaField = document.getElementById('PV');

  if (!vidaField || !vigInput || !nexSelect || !classeSelect) return;

  const classeVal = (classeSelect.value || '').toLowerCase();
  const vig = parseInt(vigInput.value, 10) || 0;
  const nex = parseInt(nexSelect.value, 10) || 0;

  const levelCount = Math.max(0, Math.floor(nex / 5) - 1);
  let base = null;
  let perLevel = null;

  if (classeVal === 'combatente') {
    base = 20 + vig;
    perLevel = 4 + vig;
  } else if (classeVal === 'ocultista') {
    base = 12 + vig;
    perLevel = 2 + vig;
  } else if (classeVal === 'especialista') {
    base = 16 + vig;
    perLevel = 3 + vig;
  }

  if (base !== null && perLevel !== null) {
    const totalVida = base + levelCount * perLevel;
    vidaField.value = totalVida;
  }
}

// Update SAN for Combatente: starts at 12 and grows +4 per NEX level
function updateSanCombatente() {
  const classeSelect = document.getElementById('classe');
  const nexSelect = document.getElementById('nex');
  const sanField = document.getElementById('SAN');

  if (!sanField || !nexSelect || !classeSelect) return;

  const classeVal = (classeSelect.value || '').toLowerCase();
  const nex = parseInt(nexSelect.value, 10) || 0;

  const levelCount = Math.max(0, Math.floor(nex / 5) - 1);
  let base = null;
  let perLevel = null;

  if (classeVal === 'combatente') {
    base = 12;
    perLevel = 4;
  } else if (classeVal === 'ocultista') {
    base = 20;
    perLevel = 5;
  } else if (classeVal === 'especialista') {
    base = 16;
    perLevel = 4;
  }

  if (base !== null && perLevel !== null) {
    const totalSan = base + levelCount * perLevel;
    sanField.value = totalSan;
  }
}

// Update SAN based on Classe Combatente and NEX progression
function updatePeTotal() {
  const classeSelect = document.getElementById('classe');
  const preInput = document.getElementById('pre');
  const nexSelect = document.getElementById('nex');
  // Explicitly target the standardized PE total field id
  const peTotalField = document.getElementById('PE');

  if (!peTotalField || !preInput || !nexSelect || !classeSelect) return;

  const classeVal = (classeSelect.value || '').toLowerCase();
  const pre = parseInt(preInput.value, 10) || 0;
  const nex = parseInt(nexSelect.value, 10) || 0;

  const levelCount = Math.max(0, Math.floor(nex / 5) - 1);
  let base = null;
  let perLevel = null;

  if (classeVal === 'combatente') {
    base = 2 + pre;
    perLevel = 2 + pre;
  } else if (classeVal === 'ocultista') {
    base = 4 + pre;
    perLevel = 4 + pre;
  } else if (classeVal === 'especialista') {
    base = 3 + pre;
    perLevel = 3 + pre;
  }

  if (base !== null && perLevel !== null) {
    const totalPe = base + levelCount * perLevel;
    peTotalField.value = totalPe;
  }
}

// Update PE/RODADA based on NEX selection
function updatePeRodada() {
  const nexSelect = document.getElementById('nex');
  const peRodadaField = document.getElementById('pe_rodada');
  
  if (!nexSelect || !peRodadaField) return;
  
  const nexValue = nexSelect.value;
  const peValue = nexToPeMap[nexValue] || 0;
  peRodadaField.value = peValue;
  // Update DT de Rituais when PE/RODADA changes
  updateDtRituais();
}

// Update DT DE RITUAIS = 10 + PE/RODADA + PRE
function updateDtRituais() {
  const peRodadaField = document.getElementById('pe_rodada');
  const preInput = document.getElementById('pre');
  const dtField = document.getElementById('dt_rituais');
  if (!dtField) return;

  const peRodada = peRodadaField ? parseInt(peRodadaField.value, 10) || 0 : 0;
  const preValue = preInput ? parseInt(preInput.value, 10) || 0 : 0;
  const dtValue = 10 + peRodada + preValue;
  dtField.value = dtValue;
  
  // Also update rituais page DT if visible
  const rituaisPage = document.getElementById('rituais-page');
  if (rituaisPage && rituaisPage.style.display === 'block') {
    const nexSelect = document.getElementById('nex');
    const nex = parseInt(nexSelect?.value || '0', 10);
    const ritualDtField = document.getElementById('ritual-dt');
    if (ritualDtField) {
      const dt = 10 + preValue + Math.floor(nex / 2);
      ritualDtField.value = dt;
    }
  }
}

// Set trained skills based on selected origin
function setTrainedSkillsFromOrigem() {
  const origemSelect = document.getElementById('origem');
  if (!origemSelect) return;
  
  const origemValue = origemSelect.value;
  
  // First, reset all training dropdowns to "Nenhum"
  document.querySelectorAll('.skill-training').forEach(select => {
    select.value = '';
    // Update bonus for each skill
    updateSkillBonus(select);
  });
  
  // If origem is selected and exists in map, set the trained skills
  if (origemValue && origemToSkillsMap[origemValue]) {
    const trainedSkills = origemToSkillsMap[origemValue];
    
    // Get all skill rows
    const skillRows = document.querySelectorAll('.skills-table tbody tr');
    
    skillRows.forEach(row => {
      const skillName = row.querySelector('td:first-child').textContent.trim();
      // Remove the asterisk if present
      const cleanSkillName = skillName.replace(' *', '');
      
      // Check if this skill should be trained
      if (trainedSkills.includes(cleanSkillName)) {
        const trainingSelect = row.querySelector('.skill-training');
        if (trainingSelect) {
          trainingSelect.value = 'treinado';
          updateSkillBonus(trainingSelect);
        }
      }
    });
  }
}

// Handle skill training bonus calculations
document.querySelectorAll('.skill-training').forEach(select => {
  select.addEventListener('change', function() {
    updateSkillBonus(this);
  });
});

function updateSkillBonus(selectElement) {
  const row = selectElement.closest('tr');
  const bonusInput = row.querySelector('.skill-bonus');
  const notesInput = row.querySelector('.skill-notes');
  const trainingValue = selectElement.value;
  
  let bonusValue = 0;
  if (trainingValue === 'treinado') {
    bonusValue = 5;
  } else if (trainingValue === 'veterano') {
    bonusValue = 10;
  } else if (trainingValue === 'expert') {
    bonusValue = 15;
  }
  
  // Add the value from "OUTROS" field if it exists and is a number
  if (notesInput && notesInput.value) {
    const notesValue = parseInt(notesInput.value, 10) || 0;
    bonusValue += notesValue;
  }
  
  bonusInput.value = bonusValue;
  saveCharacterData();
}

// Get storage key based on current player, room, and character
function getPlayerStorageKey() {
  const currentPlayer = sessionStorage.getItem('currentPlayer');
  const currentRoomCode = sessionStorage.getItem('currentRoomCode');
  const currentCharacter = sessionStorage.getItem('currentCharacter');
  
  if (!currentPlayer || !currentRoomCode) {
    return 'characterSheet_OrdemParanormal'; // fallback
  }
  
  if (!currentCharacter) {
    return `characterSheet_${currentRoomCode}_${currentPlayer}`; // fallback for single character
  }
  
  return `characterSheet_${currentRoomCode}_${currentPlayer}_${currentCharacter}`;
}

// Track last modified time
function updateLastModifiedTime() {
  const storageKey = getPlayerStorageKey();
  const now = new Date().toLocaleString('pt-BR');
  localStorage.setItem(`${storageKey}_lastModified`, now);
}

// Auto-save to localStorage
document.querySelectorAll('input, textarea').forEach(field => {
  field.addEventListener('change', () => {
    // If this is a skill notes field, update the bonus for that skill
    if (field.classList.contains('skill-notes')) {
      const row = field.closest('tr');
      const trainingSelect = row.querySelector('.skill-training');
      if (trainingSelect) {
        updateSkillBonus(trainingSelect);
      }
    }
    saveCharacterData();
  });
});

// Also handle select elements for auto-save
document.querySelectorAll('select').forEach(select => {
  select.addEventListener('change', () => {
    saveCharacterData();
  });
});

// Handle tab switching
const sectionTabs = document.getElementById('section-tabs');
if (sectionTabs) {
  sectionTabs.addEventListener('change', function() {
    switchTab(this.value);
  });
}

function switchTab(tabValue) {
  // Remove active class from all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active class to selected tab
  const selectedTab = document.getElementById(`tab-${tabValue}`);
  if (selectedTab) {
    selectedTab.classList.add('active');
  }
}

function saveCharacterData() {
  const characterData = {};
  document.querySelectorAll('input, textarea').forEach(f => {
    const key = f.id || f.name || f.placeholder || 'unnamed-' + Math.random();
    characterData[key] = f.value;
  });
  const storageKey = getPlayerStorageKey();
  localStorage.setItem(storageKey, JSON.stringify(characterData));
  updateLastModifiedTime();
}

// Load from localStorage on page load
window.addEventListener('load', () => {
  // Restore admin session if it exists (for admins viewing sheets)
  const isAdmin = sessionStorage.getItem('adminSession') === 'true';
  
  // Get or restore current player from session
  let currentPlayer = sessionStorage.getItem('currentPlayer');
  
  // If no current player but admin is viewing, check if there's a stored one
  if (!currentPlayer && !isAdmin) {
    // Try to restore from a persistent session marker
    currentPlayer = localStorage.getItem('lastSessionPlayer');
  }
  
  // Store player for page reload persistence
  if (currentPlayer) {
    localStorage.setItem('lastSessionPlayer', currentPlayer);
    sessionStorage.setItem('currentPlayer', currentPlayer);
  }

  const playerNameField = document.getElementById('player-name');
  const characterNameField = document.getElementById('character-name');
  
  // Auto-fill player and character names from session
  if (currentPlayer && playerNameField) {
    playerNameField.value = currentPlayer;
  }
  
  // Check if a character is selected from character-select screen
  let currentCharacter = sessionStorage.getItem('currentCharacter');
  if (!currentCharacter) {
    // Try to restore from localStorage for page reload persistence
    currentCharacter = localStorage.getItem('lastSessionCharacter');
  }
  
  if (currentCharacter) {
    localStorage.setItem('lastSessionCharacter', currentCharacter);
    sessionStorage.setItem('currentCharacter', currentCharacter);
    if (characterNameField) {
      characterNameField.value = currentCharacter;
    }
  }

  const storageKey = getPlayerStorageKey();
  const saved = localStorage.getItem(storageKey);
  const isNewPlayer = !saved;
  
  if (saved) {
    try {
      const data = JSON.parse(saved);
      Object.keys(data).forEach(key => {
        const field = document.getElementById(key) || 
                     document.querySelector(`[name="${key}"]`) ||
                     document.querySelector(`[placeholder="${key}"]`);
        if (field) {
          field.value = data[key];
        }
      });
      calculateModifiers();
      updateDefesa();
      updatePeRodada();
      updateDtRituais();
      updateVida();
      updatePeTotal();
      updateSanCombatente();
      updateThemeFromAfinidade();
      renderIdeSlots();
      // Ensure Descritivo column uses auto-expanding textareas
      upgradeDescritivoInputsToTextareas();
      // Keep Especialista base abilities pinned at the top if present
      pinEspecialistaBaseAbilitiesTop();
    } catch (e) {
      console.log('Could not load saved character data');
    }
  } else {
    // NEW PLAYER: Set NEX to 5 by default
    const nexField = document.getElementById('nex');
    if (nexField) {
      nexField.value = '5';
    }
    
    calculateModifiers();
    updateDefesa();
    updatePeRodada();
    updateDtRituais();
    updateVida();
    updatePeTotal();
    updateSanCombatente();
    updateThemeFromAfinidade();
    renderIdeSlots();
  }
  // Attempt upgrade even if no saved data populated rows
  upgradeDescritivoInputsToTextareas();
  // Also pin base abilities in case rows exist without saved data
  pinEspecialistaBaseAbilitiesTop();
});

// Print function
function printCharacterSheet() {
  window.print();
}

// Export as JSON
function exportCharacterSheet() {
  const characterName = document.getElementById('character-name')?.value || 'character';
  const characterData = {};

  document.querySelectorAll('input, textarea').forEach(f => {
    const key = f.id || f.name || f.placeholder;
    if (key) {
      characterData[key] = f.value;
    }
  });

  const dataStr = JSON.stringify(characterData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${characterName}-ordem-paranormal.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// Add new row to Habilidades & Rituais table
function addAbilityRow() {
  const tbody = document.getElementById('abilities-tbody');
  if (!tbody) return;
  
  const newRow = document.createElement('tr');
  newRow.innerHTML = '<td><input type="text" class="table-input"></td><td><input type="text" class="table-input"></td><td><input type="text" class="table-input"></td><td><textarea class="table-input" rows="1"></textarea></td>';
  
  tbody.appendChild(newRow);
  
  // Add event listeners to new inputs for auto-save
  newRow.querySelectorAll('input').forEach(input => {
    input.addEventListener('change', saveCharacterData);
  });
  const ta = newRow.querySelector('textarea');
  if (ta) {
    ta.addEventListener('change', saveCharacterData);
    attachAutoResize(ta);
  }
}

// Logout and return to character selection page
function logoutPlayer() {
  // Clear current character and player session but keep the stored reference
  // so admin viewers can still navigate properly
  if (!sessionStorage.getItem('adminSession')) {
    sessionStorage.removeItem('currentPlayer');
    sessionStorage.removeItem('currentCharacter');
    localStorage.removeItem('lastSessionCharacter');
  }
  window.location.href = 'character-select.html';
}

// Initialize on load
window.addEventListener('load', () => {
  calculateModifiers();
  updateDefesa();
  updateIdeTitleAndOption();
  renderIdeAbilitiesPage();
});

// Render IDE slots based on NEX milestones (every 15)
function renderIdeSlots() {
  const container = document.getElementById('ide-slots');
  const nexSelect = document.getElementById('nex');
  const classeSelect = document.getElementById('classe');
  const trilhaSelect = document.getElementById('trilha');
  if (!container || !nexSelect || !classeSelect) return;

  const nex = parseInt(nexSelect.value, 10) || 0;
  const slots = Math.floor(nex / 15); // unlocks at 15, 30, 45, ...

  // Build suggestions from current classe/trilha ability set up to current NEX
  const suggestions = getCurrentAbilitySuggestionsUpToNex();

  // Clear and rebuild
  container.innerHTML = '';

  // Ensure a single datalist for suggestions exists
  let dataList = document.getElementById('ide-suggestions');
  if (!dataList) {
    dataList = document.createElement('datalist');
    dataList.id = 'ide-suggestions';
    document.body.appendChild(dataList);
  }
  dataList.innerHTML = '';
  suggestions.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    dataList.appendChild(opt);
  });

  for (let i = 1; i <= slots; i++) {
    const slot = document.createElement('div');
    slot.className = 'ide-slot';
    // Use stable IDs so values persist with saveCharacterData
    const inputId = `ide_slot_${i}`;
    slot.innerHTML = `
      <label>Slot ${i} (NEX ≥ ${i * 15})</label>
      <input type="text" class="input-field" id="${inputId}" placeholder="Escolha sua IDE" list="ide-suggestions" />
    `;
    container.appendChild(slot);
    const inp = slot.querySelector('input');
    if (inp) inp.addEventListener('change', saveCharacterData);
  }
}

// Gather ability names to suggest based on current classe/trilha and NEX
function getCurrentAbilitySuggestionsUpToNex() {
  const classeSelect = document.getElementById('classe');
  const trilhaSelect = document.getElementById('trilha');
  const nexSelect = document.getElementById('nex');
  const nex = parseInt(nexSelect?.value || '0', 10) || 0;
  const classeVal = (classeSelect?.value || '').toLowerCase();
  const trilhaVal = (trilhaSelect?.value || '').toLowerCase();

  let abilitySet = null;
  if (classeVal === 'combatente') {
    if (trilhaVal === 'aniquilador') abilitySet = aniquiladorAbilities;
    else if (trilhaVal === 'comandante-de-campo') abilitySet = comandanteDeCampoAbilities;
    else if (trilhaVal === 'guerreiro') abilitySet = guerreiroAbilities;
    else if (trilhaVal === 'operações-especiais') abilitySet = operacoesEspeciaisAbilities;
    else if (trilhaVal === 'tropa-de-choque') abilitySet = tropaDeChoqueAbilities;
  } else if (classeVal === 'especialista') {
    if (trilhaVal === 'atirador-de-elite') abilitySet = atiradorDeEliteAbilities;
    else if (trilhaVal === 'infiltrador') abilitySet = infiltradorAbilities;
    else if (trilhaVal === 'médico-de-campo') abilitySet = medicoDeCampoAbilities;
    else if (trilhaVal === 'negociador') abilitySet = negociadorAbilities;
    else if (trilhaVal === 'técnico') abilitySet = tecnicoAbilities;
  } else if (classeVal === 'ocultista') {
    if (trilhaVal === 'conduíte') abilitySet = conduíteAbilities;
    else if (trilhaVal === 'flagelador') abilitySet = flageladorAbilities;
    else if (trilhaVal === 'graduado') abilitySet = graduadoAbilities;
    else if (trilhaVal === 'intuitivo') abilitySet = intuitivoAbilities;
    else if (trilhaVal === 'lâmina-paranormal') abilitySet = laminaParanormalAbilities;
  }

  const names = new Set();
  if (abilitySet) {
    Object.keys(abilitySet).forEach(k => {
      const pct = parseInt(k, 10) || 0;
      if (pct <= nex) {
        abilitySet[k].forEach(a => names.add(a.nome));
      }
    });
  }
  
  // Include Combatente generic abilities when classe is combatente
  if (classeVal === 'combatente') {
    Object.keys(combatenteGenericAbilities).forEach(k => {
      const nexThreshold = parseInt(k, 10) || 0;
      if (nexThreshold <= nex) {
        combatenteGenericAbilities[k].forEach(a => names.add(a.nome));
      }
    });
  }
  
  // Include Especialista generic abilities when classe is especialista
  if (classeVal === 'especialista') {
    Object.keys(especialistaGenericAbilities).forEach(k => {
      const nexThreshold = parseInt(k, 10) || 0;
      if (nexThreshold <= nex) {
        especialistaGenericAbilities[k].forEach(a => names.add(a.nome));
      }
    });
  }
  
  // Include Ocultista generic abilities when classe is ocultista
  if (classeVal === 'ocultista') {
    Object.keys(ocultistaGenericAbilities).forEach(k => {
      const nexThreshold = parseInt(k, 10) || 0;
      if (nexThreshold <= nex) {
        ocultistaGenericAbilities[k].forEach(a => names.add(a.nome));
      }
    });
  }
  
  // Always include base class ability names too
  if (classeVal === 'especialista') {
    especialistaBaseAbilities.forEach(a => names.add(a.nome));
  } else if (classeVal === 'combatente') {
    combatenteBaseAbilities.forEach(a => names.add(a.nome));
  }
  return Array.from(names);
}

// Refresh IDE slots when relevant fields change
if (document.getElementById('nex')) {
  document.getElementById('nex').addEventListener('change', renderIdeSlots);
}
if (document.getElementById('classe')) {
  document.getElementById('classe').addEventListener('change', renderIdeSlots);
}
if (document.getElementById('trilha')) {
  document.getElementById('trilha').addEventListener('change', renderIdeSlots);
}

