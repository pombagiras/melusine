#!/usr/bin/env python3
"""
Disparo automatizado de REELS para:
1. @almasdepombagira (Guardiã das Almas - Sagrado)
2. @alexiamelusine (Alexia Melusine - Pride & Vanguarda)
"""
from publish_instagram import publish_reel

REEL_ALMAS = {
    "account": "almas",
    "video_url": "https://pombagiras.com/reels/almas_silencio_guardia.mp4",
    "caption": (
        "Nem toda Guardiã precisa gargalhar para se fazer respeitar. No silêncio das Almas habita a maior soberania. 🥀✨\n\n"
        "Muitos buscam na espiritualidade apenas o ruído, a pressa e o espetáculo. "
        "Mas quando a Linha das Almas e da Calunga firma os pés na encruzilhada, a noite inteira silencia para ouvir o que não se diz em palavras.\n\n"
        "O mistério não precisa de alarde: ele se sustenta na verdade, na firmeza e na ancestralidade que atravessa os séculos.\n\n"
        "Laroyê às Guardiãs que nos sustentam em cada encruzilhada da vida! 🍷🖤\n\n"
        "🕯️ Assista com som e sinta a frequência.\n"
        "📖 Dossiês, fundamentos e pontos sagrados no portal:\n"
        "👉 pombagiras.com (link na bio)\n\n"
        "#Pombagira #AlmasDePombagira #ReelsEspiritualidade #Umbanda #Quimbanda #Laroye #PombagiraDasAlmas #Ancestralidade #PontosDePombagira #Guardias"
    )
}

REEL_ALEXIA = {
    "account": "alexia",
    "video_url": "https://pombagiras.com/reels/alexia_pride_manifesto.mp4",
    "caption": (
        "Existir com orgulho é a obra mais radical que podemos assinar todos os dias. 🌈✨\n\n"
        "Entre os limites da matéria e a vastidão da inteligência generativa, o corpo e a identidade não são moldes fixos — "
        "são território vivo de criação e vanguarda.\n\n"
        "A arte digital não anula o que somos; ela amplifica o que o mundo ainda tem medo de ver: "
        "a beleza da multiplicidade e a força inegociável de quem recusa o silêncio.\n\n"
        "Orgulho Trans. Vanguarda Estética. Liberdade Absoluta. 🦋💜\n\n"
        "🔊 Ative o som para a experiência completa.\n"
        "🔗 Conheça meus ensaios visuais e reflexões:\n"
        "alexiamelusine.com (link na bio)\n\n"
        "#AlexiaMelusine #Pride #TransPride #ArteGenerativa #Cyberpunk #AIArt #VisibilidadeTrans #Vanguarda #Liberdade #ReelsArt"
    )
}

def main():
    print("=" * 60)
    print("🚀 DISPARO OFICIAL DE REELS - INSTAGRAM GRAPH API 🚀")
    print("=" * 60)

    # 1. Almas de Pombagira Reel
    print("\n[1/2] Disparando Reel em @almasdepombagira...")
    res_almas = publish_reel(
        REEL_ALMAS["account"],
        REEL_ALMAS["video_url"],
        REEL_ALMAS["caption"],
        share_to_feed=True
    )

    print("-" * 60)

    # 2. Alexia Melusine Reel
    print("\n[2/2] Disparando Reel em @alexiamelusine...")
    res_alexia = publish_reel(
        REEL_ALEXIA["account"],
        REEL_ALEXIA["video_url"],
        REEL_ALEXIA["caption"],
        share_to_feed=True
    )

    print("=" * 60)
    print("RESULTADOS FINAIS:")
    print(f"• @almasdepombagira: {'✅ REEL PUBLICADO (Media ID: ' + str(res_almas) + ')' if res_almas else '❌ Falha'}")
    print(f"• @alexiamelusine:   {'✅ REEL PUBLICADO (Media ID: ' + str(res_alexia) + ')' if res_alexia else '❌ Falha'}")
    print("=" * 60)

if __name__ == "__main__":
    main()

