#!/usr/bin/env python3
"""
Disparo inaugural oficial no Threads para:
1. @almasdepombagira
2. @alexiamelusine
"""
from publish_threads import publish_thread

THREAD_ALMAS = {
    "account": "almas",
    "image_url": "https://pombagiras.com/fotos/GUARDIAS.png",
    "text": (
        "No silêncio da encruzilhada reside a maior soberania. 🥀✨\n\n"
        "Abrimos este espaço no Threads para compartilhar estudos antropológicos, memórias sagradas "
        "e os fundamentos das Guardiãs na Umbanda e Quimbanda.\n\n"
        "Que a firmeza das Almas guarde a caminhada de quem busca a verdade com respeito e ancestralidade. Laroyê! 🍷🖤\n\n"
        "📖 Conheça nossa enciclopédia digital:\n"
        "👉 pombagiras.com"
    )
}

THREAD_ALEXIA = {
    "account": "alexia",
    "image_url": "https://pombagiras.com/fotos/A.MELUSINE.png",
    "text": (
        "Existir com orgulho é a obra mais radical que podemos assinar todos os dias. 🌈✨\n\n"
        "Bem-vindos ao meu espaço de reflexão entre arte digital, inteligência artificial generativa e vanguarda estética. "
        "Onde a tecnologia se torna espelho para a multiplicidade do corpo e da imaginação livre.\n\n"
        "A arte é viva. A identidade não cabe em moldes. 🦋💜\n\n"
        "🔗 Ensaios visuais e manifestos:\n"
        "👉 alexiamelusine.com"
    )
}

def main():
    print("=" * 60)
    print("🧵 DISPARO INAUGURAL NO THREADS - THREADS API 🧵")
    print("=" * 60)

    # 1. Post Almas
    print("\n[1/2] Publicando no Threads de @almasdepombagira...")
    res_almas = publish_thread(
        THREAD_ALMAS["account"],
        THREAD_ALMAS["text"],
        image_url=THREAD_ALMAS["image_url"]
    )

    print("-" * 60)

    # 2. Post Alexia
    print("\n[2/2] Publicando no Threads de @alexiamelusine...")
    res_alexia = publish_thread(
        THREAD_ALEXIA["account"],
        THREAD_ALEXIA["text"],
        image_url=THREAD_ALEXIA["image_url"]
    )

    print("=" * 60)
    print("RESULTADOS FINAIS:")
    if res_almas:
        print(f"• @almasdepombagira: ✅ Publicado! {res_almas.get('permalink')}")
    else:
        print("• @almasdepombagira: ❌ Falha")
        
    if res_alexia:
        print(f"• @alexiamelusine:   ✅ Publicado! {res_alexia.get('permalink')}")
    else:
        print("• @alexiamelusine:   ❌ Falha")
    print("=" * 60)

if __name__ == "__main__":
    main()

