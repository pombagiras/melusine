#!/usr/bin/env python3
"""
Execução direta do disparo cirúrgico no Instagram:
1. @almasdepombagira
2. @alexiamelusine
"""
import sys
from publish_instagram import publish_post, check_account

POST_ALMAS = {
    "account": "almas",
    "image_url": "https://pombagiras.com/pombagira-que-nao-gosta-de-festas/capa.png",
    "caption": (
        "Nem toda Pombagira gargalha na encruzilhada. Há aquelas cujo maior mistério é o silêncio. 🥀✨\n\n"
        "Muitos esperam apenas o estalar dos dedos, o rodopiar das saias e o riso que corta a noite. "
        "Mas quando uma Guardiã das Almas ou da Calunga Profunda se aproxima em recolhimento, o chão treme em outra frequência.\n\n"
        "A soberania não precisa de alarde para se fazer respeitar. No silêncio de uma Guardiã habita a sabedoria "
        "de quem conhece cada curva do destino e cada dor da alma humana.\n\n"
        "Laroyê às que guardam a nossa caminhada com firmeza e verdade! 🍷🖤\n\n"
        "📖 Leia o dossiê antropológico completo no portal:\n"
        "👉 Link na Bio e nos Stories: pombagiras.com\n\n"
        "#Pombagira #Umbanda #Quimbanda #AlmasDePombagira #Laroye #Espiritualidade #Guardias #Ancestralidade #PombagiraDasAlmas #CulturaAfroBrasileira"
    )
}

POST_ALEXIA = {
    "account": "alexia",
    "image_url": "https://pombagiras.com/fotos/A.MELUSINE.png",
    "caption": (
        "Criar não é apenas compor formas; é um ato de coragem e manifesto. 🌈✨\n\n"
        "Entre a arte digital e a pulsação da minha própria identidade, aprendi que a verdadeira vanguarda "
        "nasce quando recusamos qualquer molde pré-estabelecido. A tecnologia e a arte generativa não são frias: "
        "são o espelho onde projeto a multiplicidade do corpo, do gênero e da imaginação livre.\n\n"
        "Existir com orgulho é a obra mais radical que podemos assinar todos os dias. 🦋💜\n\n"
        "Qual versão de você o mundo ainda tem medo de enxergar?\n\n"
        "🔗 Conheça meus ensaios visuais e reflexões:\n"
        "alexiamelusine.com\n\n"
        "#AlexiaMelusine #Pride #TransPride #ArteDigital #AIArt #GothicAesthetic #Cyberpunk #Liberdade #VisibilidadeTrans #ArteContemporanea"
    )
}

def main():
    print("=" * 60)
    print("✨ DISPARO CIRÚRGICO - INSTAGRAM GRAPH API ✨")
    print("=" * 60)

    # 1. Post Almas de Pombagira
    print("\n[1/2] Publicando em @almasdepombagira...")
    res_almas = publish_post(
        POST_ALMAS["account"],
        POST_ALMAS["image_url"],
        POST_ALMAS["caption"]
    )
    
    print("-" * 60)
    
    # 2. Post Alexia Melusine
    print("\n[2/2] Publicando em @alexiamelusine...")
    res_alexia = publish_post(
        POST_ALEXIA["account"],
        POST_ALEXIA["image_url"],
        POST_ALEXIA["caption"]
    )
    
    print("=" * 60)
    print("RESULTADO:")
    print(f"• @almasdepombagira: {'✅ Publicado (Media ID: ' + str(res_almas) + ')' if res_almas else '❌ Falha'}")
    print(f"• @alexiamelusine:   {'✅ Publicado (Media ID: ' + str(res_alexia) + ')' if res_alexia else '❌ Falha'}")
    print("=" * 60)

if __name__ == "__main__":
    main()

