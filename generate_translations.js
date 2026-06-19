const fs = require('fs');
const path = require('path');

// 1. Language Mappings Mapped Dynamically per File to keep layouts pristine
const translations = {
  // === A. LANDING PAGE: index.html ===
  "index.html": {
    en: [
      ["Educação e criação digital a serviço das tradições", "Digital creation and education serving the traditions"],
      ["Um mergulho profundo na sabedoria das guardiãs.", "A deep dive into the wisdom of the guardians."],
      ["Iniciar Jornada", "Start Journey"],
      ["Conhecimento, respeito e desmistificação das tradições sagradas.", "Knowledge, respect, and demystification of sacred traditions."],
      ["Desenvolvedora web e diretora de mídia. Atua na intersecção entre tecnologia e espiritualidade", "Web developer and media director. Works at the intersection of technology and spirituality"],
      ["Rosa de Fogo • Luz de Ferro. Uma jornada de criação digital guiada pela força", "Rosa de Fogo • Luz de Ferro. A digital creation journey guided by the strength"],
      ["Como Saber", "How to Know"],
      ["Sinais de Pombagira", "Signs of Pombagira"],
      ["Sombra Feminina", "Feminine Shadow"],
      ["Medo de Pombagira", "Fear of Pombagira"],
      ["As Quatro Faces", "The Four Faces"],
      ["Pombagiras na História", "Pombagiras in History"],
      ["Por Que Nunca Desaparecem", "Why They Never Disappear"],
      ["Quem Tem Pombagira", "Who Has Pombagira"],
      ["Bahuchara Mata: A Deusa que Vive Entre os Mundos", "Bahuchara Mata: The Goddess Who Lives Between Worlds"],
      ["A guardiã dos limiares que desafia as definições humanas", "The guardian of thresholds who challenges human definitions"],
      ["Dossiê Histórico-Antropológico: As Doze Pombagiras", "Historical-Anthropological Dossier: The Twelve Pombagiras"],
      ["O Que as Pombagiras Sabem Sobre a Natureza Humana", "What Pombagiras Know About Human Nature"],
      ["Desejo, rejeição, solidão, medo do fim e as máscaras do ego", "Desire, rejection, solitude, fear of the end, and the ego's masks"],
      ["Ler Estudo Completo", "Read Full Study"],
      ["Ler Dossiê Completo", "Read Full Dossier"],
      ["Perguntas", "Questions"],
      ["Livros", "Books"],
      ["Guardiãs", "Guardians"],
      ["Chico Xavier e as Pombagiras", "Chico Xavier and the Pombagiras"],
      ["Pomba-gira é um demônio ou entidade maligna?", "Is Pombagira a demon or an evil entity?"],
      ["Não, absolutamente não.", "No, absolutely not."],
      ["É uma entidade espiritual evoluída que trabalha exclusivamente para o bem", "It is an evolved spiritual entity that works exclusively for good"],
      ["Posso pedir para uma Pombagira acabar com o relacionamento", "Can I ask a Pombagira to end someone else's relationship"],
      ["Ela não vai fazer isso por vingança.", "She will not do this out of revenge."],
      ["Qual a diferença entre Umbanda e Quimbanda?", "What is the difference between Umbanda and Quimbanda?"],
      ["Por que rosas, champagne e espelhos?", "Why roses, champagne, and mirrors?"],
      ["Preciso de iniciação ou \"cambono\" para falar com uma Pombagira?", "Do I need initiation or a 'cambono' to speak with a Pombagira?"],
      ["Posso ter uma Pombagira mesmo sendo de outra religião", "Can I have a Pombagira even if I belong to another religion"],
      ["Relação com a comunidade LGBTQIA+?", "Relationship with the LGBTQIA+ community?"],
      ["São símbolos de acolhimento e resistência.", "They are symbols of welcoming and resistance."],
      ["Como descobrir qual Pombagira é a minha guia", "How to discover which Pombagira is my guide"],
      ["Posso solicitar abertura de caminhos financeiros", "Can I request the opening of financial paths"],
      ["Existe algum dia ou horário melhor para acender uma vela", "Is there a better day or time to light a candle"],
      ["O que fazer quando uma promessa a uma Pombagira não pode ser cumprida?", "What to do when a promise to a Pombagira cannot be fulfilled?"],
      ["Homem pode cultuar e incorporar Pombagira?", "Can a man worship and incorporate a Pombagira?"],
      ["É verdade que elas gostam de bebida alcoólica e cigarro?", "Is it true they like alcohol and cigarettes?"],
      ["Como faço para uma Pombagira se afastar de mim se pedi algo errado?", "How do I make a Pombagira go away if I asked for something wrong?"],
      ["Qual é a Pombagira mais forte?", "Which Pombagira is the strongest?"],
      ["Quais são as Pombagiras raras?", "Which Pombagiras are rare?"],
      ["Como saber se uma pessoa tem Pombagira?", "How to know if a person has a Pombagira?"],
      ["Quais são as Pombagiras mais famosas?", "Which Pombagiras are the most famous?"],
      ["Qual é a Pombagira 'mulher de Lúcifer'?", "Which Pombagira is the 'wife of Lucifer'?"],
      ["Qual é a Pombagira mais sedutora?", "Which Pombagira is the most seductive?"],
      ["Qual a Pombagira mais brava?", "Which Pombagira is the angriest?"],
      ["Quem é a rainha de todas as Pombagiras?", "Who is the queen of all Pombagiras?"],
      ["Quais são as Pombagiras mais velhas?", "Which Pombagiras are the oldest?"],
      ["Qual perfume a Pombagira gosta?", "Which perfume does a Pombagira like?"],
      ["Quem é Pombagira Feiticeira?", "Who is Pombagira Feiticeira?"],
      ["Quem são as Pombagiras de Oxóssi?", "Who are the Pombagiras of Oxóssi?"],
      ["Quem é a Pombagira Rainha do Cabaré?", "Who is Pombagira Rainha do Cabaré?"],
      ["Por que alguns médiuns incorporam Pombagiras que nunca ouvi falar?", "Why do some mediums incorporate Pombagiras I've never heard of?"],
      ["Como estudar Pombagiras de maneira séria e profunda?", "How to study Pombagiras in a serious and deep way?"],
      ["Por que cada terreiro parece ter suas próprias Pombagiras?", "Why does each terreiro seem to have its own Pombagiras?"],
      ["Por que parecem existir novas Pombagiras surgindo o tempo inteiro?", "Why do new Pombagiras seem to be emerging all the time?"],
      ["Como saber se uma Pombagira é verdadeira e não inventada?", "How to know if a Pombagira is real and not made up?"],
      ["Por que tantos nomes diferentes para a mesma entidade?", "Why so many different names for the same entity?"],
      ["Existe uma “bíblia” das Pombagiras?", "Is there a Pombagira 'bible'?"],
      ["Então como se organiza o conhecimento sobre Pombagiras sem uma bíblia?", "So how is knowledge about Pombagiras organized without a bible?"],
      ["Por que algumas Pombagiras têm títulos como", "Why do some Pombagiras have titles like"],
      ["Todas as Pombagiras já foram humanas?", "Have all Pombagiras been human?"],
      ["Como diferenciar uma linha de trabalho de uma Pombagira individual?", "How to differentiate a line of work from an individual Pombagira?"],
      ["Por que uma Pombagira se apresenta de um jeito em um médium e diferente em outro?", "Why does a Pombagira present herself one way in one medium and differently in another?"],
      ["É possível catalogar todas as Pombagiras existentes?", "Is it possible to catalog all existing Pombagiras?"],
      ["Voltar ao topo", "Back to top"],
      ["Política de Privacidade", "Privacy Policy"],
      ["Termos de Uso", "Terms of Use"],
      ["Portal de Desmistificação, Arte & Filosofia Ancestral.", "Portal of Demystification, Art & Ancestral Philosophy."],
      ["Todos os direitos reservados.", "All rights reserved."],
      ["Copiar e-mail", "Copy email"],
      ["Copiado!", "Copied!"],
      ["(Copiar)", "(Copy)"],
      ["Pombagiras.com", "Pombagiras.com"]
    ],
    es: [
      ["Educação e criação digital a serviço das tradições", "Educación y creación digital al servicio de las tradiciones"],
      ["Um mergulho profundo na sabedoria das guardiãs.", "Un sumergimiento profundo en la sabiduría de las guardianas."],
      ["Iniciar Jornada", "Iniciar Jornada"],
      ["Conhecimento, respeito e desmistificação das tradições sagradas.", "Conocimiento, respeto y desmitificación de las tradiciones sagradas."],
      ["Desenvolvedora web e diretora de mídia. Atua na intersecção entre tecnologia e espiritualidade", "Desarrolladora web y directora de medios. Trabaja en la intersección entre tecnología y espiritualidad"],
      ["Rosa de Fogo • Luz de Ferro. Uma jornada de criação digital guiada pela força", "Rosa de Fogo • Luz de Ferro. Un viaje de creación digital guiado por la fuerza"],
      ["Como Saber", "Cómo Saber"],
      ["Sinais de Pombagira", "Señales de Pombagira"],
      ["Sombra Feminina", "Sombra Femenina"],
      ["Medo de Pombagira", "Miedo a la Pombagira"],
      ["As Quatro Faces", "Las Cuatro Caras"],
      ["Pombagiras na História", "Pombagiras en la Historia"],
      ["Por Que Nunca Desaparecem", "Por Qué Nunca Desaparecen"],
      ["Quem Tem Pombagira", "Quién Tiene Pombagira"],
      ["Bahuchara Mata: A Deusa que Vive Entre os Mundos", "Bahuchara Mata: La Diosa que Vive Entre los Mundos"],
      ["A guardiã dos limiares que desafia as definições humanas", "La guardiana de los umbrales que desafía las definiciones humanas"],
      ["Dossiê Histórico-Antropológico: As Doze Pombagiras", "Dossier Histórico-Antropológico: Las Doce Pombagiras"],
      ["O Que as Pombagiras Sabem Sobre a Natureza Humana", "Lo Que las Pombagiras Saben Sobre la Naturaleza Humana"],
      ["Desejo, rejeição, solidão, medo do fim e as máscaras do ego", "Deseo, rechazo, soledad, miedo al fin y las máscaras del ego"],
      ["Ler Estudo Completo", "Leer Estudio Completo"],
      ["Ler Dossiê Completo", "Leer Dossier Completo"],
      ["Perguntas", "Preguntas"],
      ["Livros", "Libros"],
      ["Guardiãs", "Guardianas"],
      ["Chico Xavier e as Pombagiras", "Chico Xavier y las Pombagiras"],
      ["Pomba-gira é um demônio ou entidade maligna?", "¿Es la Pomba-gira un demonio o entidad maligna?"],
      ["Não, absolutamente não.", "No, absolutamente no."],
      ["É uma entidade espiritual evoluída que trabalha exclusivamente para o bem", "Es una entidad espiritual evolucionada que trabaja exclusivamente para el bien"],
      ["Posso pedir para uma Pombagira acabar com o relacionamento", "Puedo pedirle a una Pombagira que termine la relación"],
      ["Ela não vai fazer isso por vingança.", "Ella no hará eso por venganza."],
      ["Qual a diferença entre Umbanda e Quimbanda?", "¿Cuál es la diferencia entre Umbanda y Quimbanda?"],
      ["Por que rosas, champagne e espelhos?", "¿Por qué rosas, champagne y espejos?"],
      ["Preciso de iniciação ou \"cambono\" para falar com uma Pombagira?", "¿Necesito iniciación o 'cambono' para hablar con una Pombagira?"],
      ["Posso ter uma Pombagira mesmo sendo de outra religião", "Puedo tener una Pombagira incluso si soy de otra religión"],
      ["Relação com a comunidade LGBTQIA+?", "¿Relación con la comunidad LGBTQIA+?"],
      ["São símbolos de acolhimento e resistência.", "Son símbolos de acogida y resistencia."],
      ["Como descobrir qual Pombagira é a minha guia", "Cómo descubrir qué Pombagira es mi guía"],
      ["Posso solicitar abertura de caminhos financeiros", "Puedo solicitar la apertura de caminos financieros"],
      ["Existe algum dia ou horário melhor para acender uma vela", "¿Existe algún mejor día u horario para encender una vela"],
      ["O que fazer quando uma promessa a uma Pombagira não pode ser cumprida?", "¿Qué hacer cuando una promesa a una Pombagira no se puede cumplir?"],
      ["Homem pode cultuar e incorporar Pombagira?", "¿Puede un hombre adorar e incorporar a la Pombagira?"],
      ["É verdade que elas gostam de bebida alcoólica e cigarro?", "¿Es verdad que les gusta la bebida alcohólica y el cigarrillo?"],
      ["Como faço para uma Pombagira se afastar de mim se pedi algo errado?", "¿Cómo hago para que una Pombagira se aleje de mí si pedí algo incorrecto?"],
      ["Qual é a Pombagira mais forte?", "¿Cuál es la Pombagira más fuerte?"],
      ["Quais são as Pombagiras raras?", "¿Cuáles son las Pombagiras raras?"],
      ["Como saber se uma pessoa tem Pombagira?", "¿Cómo saber si una persona tiene Pombagira?"],
      ["Quais são as Pombagiras mais famosas?", "¿Cuáles son las Pombagiras más famosas?"],
      ["Qual é a Pombagira 'mulher de Lúcifer'?", "¿Cuál es la Pombagira 'mujer de Lucifer'?"],
      ["Qual é a Pombagira mais sedutora?", "¿Cuál es la Pombagira más seductora?"],
      ["Qual a Pombagira mais brava?", "¿Cuál es la Pombagira más brava?"],
      ["Quem é a rainha de todas as Pombagiras?", "¿Quién es la reina de todas las Pombagiras?"],
      ["Quais são as Pombagiras mais velhas?", "¿Cuáles son las Pombagiras más viejas?"],
      ["Qual perfume a Pombagira gosta?", "¿Qué perfume le gusta a la Pombagira?"],
      ["Quem é Pombagira Feiticeira?", "¿Quién es la Pombagira Feiticeira?"],
      ["Quem são as Pombagiras de Oxóssi?", "¿Quiénes son las Pombagiras de Oxóssi?"],
      ["Quem é a Pombagira Rainha do Cabaré?", "¿Quién es la Pombagira Reina del Cabaret?"],
      ["Por que alguns médiuns incorporam Pombagiras que nunca ouvi falar?", "¿Por qué algunos médiums incorporan Pombagiras de las que nunca he oído hablar?"],
      ["Como estudar Pombagiras de maneira séria e profunda?", "¿Cómo estudiar Pombagiras de manera seria y profunda?"],
      ["Por que cada terreiro parece ter suas próprias Pombagiras?", "¿Por qué cada terreiro parece tener sus propias Pombagiras?"],
      ["Por que parecem existir novas Pombagiras surgindo o tempo inteiro?", "¿Por qué parecen existir nuevas Pombagiras surgiendo todo el tiempo?"],
      ["Como saber se uma Pombagira é verdadeira e não inventada?", "¿Cómo saber si una Pombagira es verdadera y no inventada?"],
      ["Por que tantos nomes diferentes para a mesma entidade?", "¿Por qué tantos nombres diferentes para la misma entidad?"],
      ["Existe uma “bíblia” das Pombagiras?", "¿Existe una 'biblia' de las Pombagiras?"],
      ["Então como se organiza o conhecimento sobre Pombagiras sem uma bíblia?", "¿Entonces cómo se organiza el conocimiento sobre las Pombagiras sin una biblia?"],
      ["Por que algumas Pombagiras têm títulos como", "Por qué algunas Pombagiras tienen títulos como"],
      ["Todas as Pombagiras já foram humanas?", "¿Todas las Pombagiras ya fueron humanas?"],
      ["Como diferenciar uma linha de trabalho de uma Pombagira individual?", "¿Cómo diferenciar una línea de trabajo de una Pombagira individual?"],
      ["Por que uma Pombagira se apresenta de um jeito em um médium e diferente em outro?", "¿Por qué una Pombagira se presenta de una manera en un médium y de otra en otro?"],
      ["É possível catalogar todas as Pombagiras existentes?", "¿Es posible catalogar todas las Pombagiras existentes?"],
      ["Voltar ao topo", "Volver al inicio"],
      ["Política de Privacidade", "Política de Privacidad"],
      ["Termos de Uso", "Términos de Uso"],
      ["Portal de Desmistificação, Arte & Filosofia Ancestral.", "Portal de Desmitificación, Arte y Filosofía Ancestral."],
      ["Todos os direitos reservados.", "Todos los derechos reservados."],
      ["Copiar e-mail", "Copiar correo electrónico"],
      ["Copiado!", "¡Copiado!"],
      ["(Copiar)", "(Copiar)"],
      ["Pombagiras.com", "Pombagiras.com"]
    ]
  },
  // === B. PORTAL HOMEPAGE: portal/index.html ===
  "portal/index.html": {
    en: [
      ["As Guardiãs e Seus Mistérios", "The Guardians and Their Mysteries"],
      ["Explore a rica variedade de guardiãs, divididas em linhas", "Explore the rich variety of guardians, divided into lines"],
      ["Passe o mouse sobre os cards para vivenciar o mistério", "Hover over the cards to experience the mystery"],
      ["Todos", "All"],
      ["Tradições e Marias", "Traditions and Marias"],
      ["Almas e Calunga", "Almas and Calunga"],
      ["Encruzilhadas e Caminhos", "Crossroads and Paths"],
      ["Elementos da Natureza", "Elements of Nature"],
      ["Tradição & Feitiço", "Tradition & Sorcery"],
      ["Arquétipo do poder absoluto, magnetismo irresistível", "Archetype of absolute power, irresistible magnetism"],
      ["Força que resgata a pureza e a riqueza espiritual", "Strength that rescues purity and spiritual wealth"],
      ["Proteção Urbana", "Urban Protection"],
      ["Simboliza o arquétipo da perspicácia, da malandragem ágil", "Symbolizes the archetype of sharp perspective, agile street smarts"],
      ["Justiça e Ordem", "Justice and Order"],
      ["Guerreira destemida das legiões espirituais", "Fearless warrior of spiritual legions"],
      ["Desapego e Cura", "Detachment and Healing"],
      ["Recolhe detritos e dores da alma, transmutando-os", "Collects debris and pains of the soul, transmuting them"],
      ["Liberdade & Clarividência", "Freedom & Clairvoyance"],
      ["O arquétipo da intuição livre, leitura de destinos", "The archetype of free intuition, reading of destinies"],
      ["Juventude & Foco", "Youth & Focus"],
      ["Vitalidade juvenil aliada a uma perspicácia cortante", "Youthful vitality combined with cutting perspective"],
      ["Lei & Rigor", "Law & Rigor"],
      ["Guardiã das profundezas ligada à Linha das Almas", "Guardian of the depths linked to the Line of Souls"],
      ["Dinâmica dos Caminhos", "Dynamics of the Paths"],
      ["Rege os sete giros da evolução, estimulando a abundância", "Governs the seven turns of evolution, stimulating abundance"],
      ["Mistério Noturno", "Night Mystery"],
      ["Senhora do mistério noturno, refina a atração pessoal", "Lady of the night mystery, refines personal attraction"],
      ["Ancestralidade Terrena", "Earthly Ancestry"],
      ["Guardiã enraizada no mistério das matas e das figueiras", "Guardian rooted in the mystery of forests and fig trees"],
      ["Fluidez e Limpeza", "Fluidity and Cleansing"],
      ["Atua no limite da água e da terra, regendo a transmutação", "Works on the threshold of water and earth, governing transmutation"],
      ["Magnetismo Celeste", "Celestial Magnetism"],
      ["Rege as oscilações psíquicas, o subconsciente", "Governs psychic oscillations, the subconscious"],
      ["Elevação & Foco", "Elevation & Focus"],
      ["Guardiã das passagens montanhosas e das alturas", "Guardian of mountainous passes and heights"],
      ["Autoconhecimento", "Self-knowledge"],
      ["Atua no acolhimento e na transmutação das nossas fraquezas", "Works in welcoming and transmuting our weaknesses"],
      ["Subconsciente", "Subconscious"],
      ["Senhora das profundezas das águas emotivas", "Lady of the depths of emotional waters"],
      ["Consolo & Passagem", "Consolation & Passage"],
      ["Guia caridosa que atua no amparo aos espíritos", "Charitable guide working to support spirits"],
      ["Quebra de Amarras", "Breaking of Chains"],
      ["Trabalha na neutralização de obsessores severos", "Works in neutralizing severe obsessors"],
      ["Energia Primordial", "Primordial Energy"],
      ["Arquétipo do impulso vital de alta frequência", "Archetype of the high-frequency vital impulse"],
      ["Senhora da Escolha", "Lady of Choice"],
      ["Guardiã das decisões cruciais, coordenadora das encruzilhadas", "Guardian of crucial decisions, coordinator of crossroads"],
      ["Portais Minerais", "Mineral Portals"],
      ["Opera nos portais rochosos e fendas de vulcões", "Operates in rocky portals and volcano fissures"],
      ["Eternidade & Silêncio", "Eternity & Silence"],
      ["Rege os limites sagrados do esquecimento e o descanso", "Governs the sacred limits of forgetting and rest"],
      ["Ocultamento", "Ocultation"],
      ["Rege o véu das brumas sagradas. Atua ocultando", "Governs the veil of sacred mists. Works in hiding"],
      ["Libertação", "Liberation"],
      ["Guardiã sagrada que destrói correntes mentais", "Sacred guardian that destroys mental chains"],
      ["Uma jornada científica e teológica para desmistificar dogmas", "A scientific and theological journey to demystify dogmas"],
      ["Bahuchara Mata: A Deusa que Vive Entre os Mundos", "Bahuchara Mata: The Goddess Who Lives Between Worlds"],
      ["Dossiê Histórico-Antropológico: As Doze Pombagiras", "Historical-Anthropological Dossier: The Twelve Pombagiras"],
      ["O Que as Pombagiras Sabem Sobre a Natureza Humana", "What Pombagiras Know About Human Nature"],
      ["Ler Estudo Completo", "Read Full Study"],
      ["Ler Dossiê Completo", "Read Full Dossier"],
      ["Voltar ao Portal", "Back to Portal"],
      ["Filosofia Ancestral & Tecnologia", "Ancestral Philosophy & Technology"],
      ["Guardiãs dos Limiares", "Guardians of the Thresholds"]
    ],
    es: [
      ["As Guardiãs e Seus Mistérios", "Las Guardianas y Sus Misterios"],
      ["Explore a rica variedade de guardiãs, divididas em linhas", "Explore la rica variedad de guardianas, divididas en líneas"],
      ["Passe o mouse sobre os cards para vivenciar o mistério", "Pase el mouse sobre las cartas para experimentar el misterio"],
      ["Todos", "Todos"],
      ["Tradições e Marias", "Tradiciones y Marías"],
      ["Almas e Calunga", "Almas y Calunga"],
      ["Encruzilhadas e Caminhos", "Encrucijadas y Caminos"],
      ["Elementos da Natureza", "Elementos de la Naturaleza"],
      ["Tradição & Feitiço", "Tradición y Hechizo"],
      ["Arquétipo do poder absoluto, magnetismo irresistível", "Arquetipo del poder absoluto, magnetismo irresistible"],
      ["Força que resgata a pureza e a riqueza espiritual", "Fuerza que rescata la pureza y la riqueza espiritual"],
      ["Proteção Urbana", "Protección Urbana"],
      ["Simboliza o arquétipo da perspicácia, da malandragem ágil", "Simboliza el arquetipo de la perspicacia, de la astucia callejera ágil"],
      ["Justiça e Ordem", "Justicia y Orden"],
      ["Guerreira destemida das legiões espirituais", "Guerrera intrépida de las legiones espirituales"],
      ["Desapego e Cura", "Desapego y Curación"],
      ["Recolhe detritos e dores da alma, transmutando-os", "Recoge detritos y dolores del alma, transmutándolos"],
      ["Liberdade & Clarividência", "Libertad y Clarividencia"],
      ["O arquétipo da intuição livre, leitura de destinos", "El arquetipo de la intuición libre, lectura de destinos"],
      ["Juventude & Foco", "Juventud y Enfoque"],
      ["Vitalidade juvenil aliada a uma perspicácia cortante", "Vitalidad juvenil aliada a una perspicacia cortante"],
      ["Lei & Rigor", "Ley y Rigor"],
      ["Guardiã das profundezas ligada à Linha das Almas", "Guardiana de las profundidades ligada a la Línea de las Almas"],
      ["Dinâmica dos Caminhos", "Dinámica de los Caminos"],
      ["Rege os sete giros da evolução, estimulando a abundância", "Rige los siete giros de la evolución, estimulando la abundancia"],
      ["Mistério Noturno", "Misterio Nocturno"],
      ["Senhora do mistério noturno, refina a atração pessoal", "Señora del misterio nocturno, refina la atracción personal"],
      ["Ancestralidade Terrena", "Ancestralidad Terrenal"],
      ["Guardiã enraizada no mistério das matas e das figueiras", "Guardiana enraizada en el misterio de los bosques y las higueras"],
      ["Fluidez e Limpeza", "Fluidez y Limpieza"],
      ["Atua no limite da água e da terra, regendo a transmutação", "Actúa en el límite del agua y de la tierra, rigiendo la transmutación"],
      ["Magnetismo Celeste", "Magnetismo Celeste"],
      ["Rege as oscilações psíquicas, o subconsciente", "Rige las oscilaciones psíquicas, el subconsciente"],
      ["Elevação & Foco", "Elevación y Enfoque"],
      ["Guardiã das passagens montanhosas e das alturas", "Guardiana de los pasos montañosos y de las alturas"],
      ["Autoconhecimento", "Autoconocimiento"],
      ["Atua no acolhimento e na transmutação das nossas fraquezas", "Actúa en la acogida y transmutación de nuestras debilidades"],
      ["Subconsciente", "Subconsciente"],
      ["Senhora das profundezas das águas emotivas", "Señora de las profundidades de las aguas emotivas"],
      ["Consolo & Passagem", "Consuelo y Pasaje"],
      ["Guia caridosa que atua no amparo aos espíritos", "Guía caritativa que actúa en el amparo a los espíritus"],
      ["Quebra de Amarras", "Quiebra de Amarras"],
      ["Trabalha na neutralização de obsessores severos", "Trabaja en la neutralización de obsesores severos"],
      ["Energia Primordial", "Energía Primordial"],
      ["Arquétipo do impulso vital de alta frequência", "Arquetipo del impulso vital de alta frecuencia"],
      ["Senhora da Escolha", "Señora de la Elección"],
      ["Guardiã das decisões cruciais, coordenadora das encruzilhadas", "Guardiana de las decisiones cruciales, coordinadora de las encrucijadas"],
      ["Portais Minerais", "Portales Minerales"],
      ["Opera nos portais rochosos e fendas de vulcões", "Opera en los portales rocosos y grietas de volcanes"],
      ["Eternidade & Silêncio", "Eternidad y Silencio"],
      ["Rege os limites sagrados do esquecimento e o descanso", "Rige los límites sagrados del olvido y el descanso"],
      ["Ocultamento", "Ocultamiento"],
      ["Rege o véu das brumas sagradas. Atua ocultando", "Rige el velo de las brumas sagradas. Actúa ocultando"],
      ["Libertação", "Liberación"],
      ["Guardiã sagrada que destrói correntes mentais", "Guardiana sagrada que destruye corrientes mentales"],
      ["Uma jornada científica e teológica para desmistificar dogmas", "Un viaje científico y teológico para desmitificar dogmas"],
      ["Bahuchara Mata: A Deusa que Vive Entre os Mundos", "Bahuchara Mata: La Diosa que Vive Entre los Mundos"],
      ["Dossiê Histórico-Antropológico: As Doze Pombagiras", "Dossier Histórico-Antropológico: Las Doce Pombagiras"],
      ["O Que as Pombagiras Sabem Sobre a Natureza Humana", "Lo Que las Pombagiras Saben Sobre la Naturaleza Humana"],
      ["Ler Estudo Completo", "Leer Estudio Completo"],
      ["Ler Dossiê Completo", "Leer Dossier Completo"],
      ["Voltar ao Portal", "Volver al Portal"],
      ["Filosofia Ancestral & Tecnologia", "Filosofía Ancestral y Tecnología"],
      ["Guardiãs dos Limiares", "Guardianas de los Umbrales"]
    ]
  }
};

// 2. Navigation Switcher HTML & JS logic to inject
const switcherHTML = `
<!-- Premium Global Language Switcher -->
<div class="global-lang-switcher" style="position: fixed; top: 20px; right: 20px; z-index: 99999;">
    <button onclick="toggleLangDropdown(event)" style="background: rgba(10, 12, 14, 0.8); border: 1px solid rgba(197, 160, 89, 0.4); color: #FAF6EE; padding: 8px 16px; border-radius: 25px; font-family: 'Fraunces', serif; cursor: pointer; backdrop-filter: blur(10px); display: flex; align-items: center; gap: 8px;">
        <i class="fa-solid fa-globe"></i> <span class="current-lang-label">PT</span>
    </button>
    <div class="lang-dropdown" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 10px; background: #0a0c0e; border: 1px solid #C59B27; border-radius: 12px; overflow: hidden;">
        <a href="#" onclick="changeLanguage(event, 'pt')" style="display: block; padding: 10px 20px; color: #FAF6EE; text-decoration: none;">Português</a>
        <a href="#" onclick="changeLanguage(event, 'en')" style="display: block; padding: 10px 20px; color: #FAF6EE; text-decoration: none;">English</a>
        <a href="#" onclick="changeLanguage(event, 'es')" style="display: block; padding: 10px 20px; color: #FAF6EE; text-decoration: none;">Español</a>
    </div>
</div>
<script>
function toggleLangDropdown(e) {
    e.stopPropagation();
    const dropdown = document.querySelector('.lang-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
}
function changeLanguage(e, lang) {
    e.preventDefault();
    localStorage.setItem('user-language', lang);
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p !== 'en' && p !== 'es');
    let newPath = (lang === 'pt' ? '/' : '/' + lang + '/') + parts.join('/');
    window.location.href = newPath.replace(/\/+/g, '/');
}
window.addEventListener('click', () => document.querySelector('.lang-dropdown').style.display = 'none');
</script>
`;

// Helper: Injects hreflang tags into <head>
function injectHrefLangs(html, urlPath) {
  const canonicalUrl = `https://pombagiras.com/${urlPath}`;
  const enUrl = `https://pombagiras.com/en/${urlPath}`;
  const esUrl = `https://pombagiras.com/es/${urlPath}`;
  
  const hreflangs = `
    <!-- Multi-Language Canonical Linkage (SEO hreflangs) -->
    <link rel="alternate" hreflang="pt" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="es" href="${esUrl}" />
    <link rel="alternate" hreflang="x-default" href="${canonicalUrl}" />
  `;
  
  if (html.includes('<!-- Multi-Language Canonical Linkage')) {
    return html; // Already injected
  }
  
  return html.replace('<head>', `<head>\n${hreflangs}`);
}

// Helper: Injects Language Switcher to footer-links or header
function injectLanguageSwitcher(html) {
  // No-op: language switcher removed per user request
  return html;
}

// Helper: Injects auto-redirection on the root page
const autoRedirectScript = `
<script>
// Automatic Browser Language Router
(function() {
    const savedLang = localStorage.getItem('user-language');
    const path = window.location.pathname;
    
    // Only auto-redirect if at root domain level
    if (path === '/' || path === '/index.html') {
        let targetLang = savedLang;
        if (!targetLang) {
            const browserLang = (navigator.language || navigator.userLanguage || 'pt').toLowerCase();
            if (browserLang.startsWith('en')) targetLang = 'en';
            else if (browserLang.startsWith('es')) targetLang = 'es';
            else targetLang = 'pt';
        }
        
        if (targetLang === 'en' && !path.includes('/en/')) {
            window.location.href = '/en/index.html';
        } else if (targetLang === 'es' && !path.includes('/es/')) {
            window.location.href = '/es/index.html';
        }
    }
})();
</script>
`;

function injectAutoRedirect(html) {
  if (html.includes('// Automatic Browser Language Router')) {
      return html;
  }
  return html.replace('<head>', `<head>\n${autoRedirectScript}`);
}

// 3. Automated Translation Engine
function translatePage(fileName, enDict, esDict, isRoot = false) {
  const filePath = path.join(__dirname, fileName);
  if (!fs.existsSync(filePath)) {
    console.warn(`File not found: ${filePath}`);
    return;
  }
  
  let html = fs.readFileSync(filePath, 'utf8');
  const urlPath = fileName.replace(/[\\/]+/g, '/'); // normalize backslashes
  
  // Inject language switcher and hreflangs in PT version
  html = injectHrefLangs(html, urlPath);
  // injectLanguageSwitcher removed
  if (isRoot) {
      html = injectAutoRedirect(html);
  }
  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`✔ Injetado switcher/hreflangs no arquivo original (PT): ${fileName}`);
  
  // Create English folder structures
  const enFolder = path.join(__dirname, 'en', path.dirname(fileName));
  fs.mkdirSync(enFolder, { recursive: true });
  
  let enHtml = html;
  enHtml = enHtml.replace('lang="pt-BR"', 'lang="en"');
  
  // Replace links
  enHtml = enHtml.replace(/href="bahuchara-mata.html"/g, 'href="bahuchara-mata.html"');
  enHtml = enHtml.replace(/href="dossie.html"/g, 'href="dossie.html"');
  enHtml = enHtml.replace(/href="portal\/bahuchara-mata.html"/g, 'href="en/portal/bahuchara-mata.html"');
  enHtml = enHtml.replace(/href="portal\/dossie.html"/g, 'href="en/portal/dossie.html"');
  enHtml = enHtml.replace(/href="portal\/"/g, 'href="en/portal/"');
  enHtml = enHtml.replace(/href="guardias\/"/g, 'href="guardias/"'); // keep PT encyclopedia or modify if translated later
  
  // Apply translation dictionary
  enDict.forEach(([ptText, enText]) => {
      enHtml = enHtml.split(ptText).join(enText);
  });
  
  fs.writeFileSync(path.join(__dirname, 'en', fileName), enHtml, 'utf8');
  console.log(`✔ Gerado arquivo (EN): en/${fileName}`);
  
  // Create Spanish folder structures
  const esFolder = path.join(__dirname, 'es', path.dirname(fileName));
  fs.mkdirSync(esFolder, { recursive: true });
  
  let esHtml = html;
  esHtml = esHtml.replace('lang="pt-BR"', 'lang="es"');
  
  // Replace links
  esHtml = esHtml.replace(/href="bahuchara-mata.html"/g, 'href="bahuchara-mata.html"');
  esHtml = esHtml.replace(/href="dossie.html"/g, 'href="dossie.html"');
  esHtml = esHtml.replace(/href="portal\/bahuchara-mata.html"/g, 'href="es/portal/bahuchara-mata.html"');
  esHtml = esHtml.replace(/href="portal\/dossie.html"/g, 'href="es/portal/dossie.html"');
  esHtml = esHtml.replace(/href="portal\/"/g, 'href="es/portal/"');
  
  // Apply translation dictionary
  esDict.forEach(([ptText, esText]) => {
      esHtml = esHtml.split(ptText).join(esText);
  });
  
  fs.writeFileSync(path.join(__dirname, 'es', fileName), esHtml, 'utf8');
  console.log(`✔ Gerado arquivo (ES): es/${fileName}`);
}

// 4. Execution logic for core hubs
function main() {
  console.log("Iniciando geração de traduções...");
  
  // Translate Landing Page
  translatePage("index.html", translations["index.html"].en, translations["index.html"].es, true);
  
  // Translate Portal Homepage
  translatePage("portal/index.html", translations["portal/index.html"].en, translations["portal/index.html"].es);
  
  console.log("Traduzindo Dossiê Histórico-Antropológico...");
  // Load custom translation for Dossiê (written as complete files or exact mapping)
  translateDossie();

  console.log("Traduzindo Bahuchara Mata...");
  // Load custom translation for Bahuchara Mata
  translateBahuchara();
  
  console.log("✔ Processo de traduções concluído com sucesso!");
}

function translateDossie() {
  // PT
  const ptDossiePath = path.join(__dirname, 'portal', 'dossie.html');
  if (fs.existsSync(ptDossiePath)) {
    let ptHtml = fs.readFileSync(ptDossiePath, 'utf8');
    ptHtml = injectHrefLangs(ptHtml, 'portal/dossie.html');
    ptHtml = injectLanguageSwitcher(ptHtml);
    fs.writeFileSync(ptDossiePath, ptHtml, 'utf8');
    console.log("✔ Injetado switcher/hreflangs no dossie.html original (PT)");
  }
  // EN
  const enDossiePath = path.join(__dirname, 'en', 'portal', 'dossie.html');
  if (fs.existsSync(enDossiePath)) {
    let enHtml = fs.readFileSync(enDossiePath, 'utf8');
    enHtml = injectHrefLangs(enHtml, 'portal/dossie.html');
    enHtml = injectLanguageSwitcher(enHtml);
    fs.writeFileSync(enDossiePath, enHtml, 'utf8');
    console.log("✔ Injetado switcher/hreflangs no dossie.html inglês (EN)");
  }
  // ES
  const esDossiePath = path.join(__dirname, 'es', 'portal', 'dossie.html');
  if (fs.existsSync(esDossiePath)) {
    let esHtml = fs.readFileSync(esDossiePath, 'utf8');
    esHtml = injectHrefLangs(esHtml, 'portal/dossie.html');
    esHtml = injectLanguageSwitcher(esHtml);
    fs.writeFileSync(esDossiePath, esHtml, 'utf8');
    console.log("✔ Injetado switcher/hreflangs no dossie.html espanhol (ES)");
  }
}

function translateBahuchara() {
  // PT
  const ptBahucharaPath = path.join(__dirname, 'portal', 'bahuchara-mata.html');
  if (fs.existsSync(ptBahucharaPath)) {
    let ptHtml = fs.readFileSync(ptBahucharaPath, 'utf8');
    ptHtml = injectHrefLangs(ptHtml, 'portal/bahuchara-mata.html');
    ptHtml = injectLanguageSwitcher(ptHtml);
    fs.writeFileSync(ptBahucharaPath, ptHtml, 'utf8');
    console.log("✔ Injetado switcher/hreflangs no bahuchara-mata.html original (PT)");
  }
  // EN
  const enBahucharaPath = path.join(__dirname, 'en', 'portal', 'bahuchara-mata.html');
  if (fs.existsSync(enBahucharaPath)) {
    let enHtml = fs.readFileSync(enBahucharaPath, 'utf8');
    enHtml = injectHrefLangs(enHtml, 'portal/bahuchara-mata.html');
    enHtml = injectLanguageSwitcher(enHtml);
    fs.writeFileSync(enBahucharaPath, enHtml, 'utf8');
    console.log("✔ Injetado switcher/hreflangs no bahuchara-mata.html inglês (EN)");
  }
  // ES
  const esBahucharaPath = path.join(__dirname, 'es', 'portal', 'bahuchara-mata.html');
  if (fs.existsSync(esBahucharaPath)) {
    let esHtml = fs.readFileSync(esBahucharaPath, 'utf8');
    esHtml = injectHrefLangs(esHtml, 'portal/bahuchara-mata.html');
    esHtml = injectLanguageSwitcher(esHtml);
    fs.writeFileSync(esBahucharaPath, esHtml, 'utf8');
    console.log("✔ Injetado switcher/hreflangs no bahuchara-mata.html espanhol (ES)");
  }
}

main();
