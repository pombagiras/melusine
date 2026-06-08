const fs = require('fs');
const path = require('path');

// 1. Core Schema Objects to standardize across the graph
const enrichAuthor = {
  "@type": "Person",
  "@id": "https://pombagiras.com/#author",
  "name": "Alexia Melusine",
  "alternateName": ["Alexia Rosa de Fogo", "Alexia Luz de Ferro"],
  "url": "https://pombagiras.com/alexiamelusine/",
  "jobTitle": ["Desenvolvedora Web", "Diretora de Vídeo IA", "Engenheira de Prompt"],
  "sameAs": [
    "https://github.com/pombagiras",
    "https://github.com/alexialuzdeferro",
    "https://alexiamelusine.substack.com/"
  ],
  "knowsAbout": ["Pombagira", "Umbanda", "Quimbanda", "Candomblé", "Orixás", "Exu", "AI", "SEO Técnico"]
};

const organizationObj = {
  "@type": "Organization",
  "@id": "https://pombagiras.com/#organization",
  "name": "Pombagiras.com",
  "url": "https://pombagiras.com/",
  "logo": {
    "@type": "ImageObject",
    "url": "https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/Favicon%20%20Miniatura%20do%20Google.png"
  },
  "sameAs": [
    "https://whatsapp.com/channel/0029VbBs2AnJkK7J9J0nLr2G",
    "https://t.me/pomba_giras",
    "https://discord.gg/gWZP8R7Dqu",
    "https://open.spotify.com/show/0oeCL1QScD3v7dHeUvJjgJ",
    "https://www.youtube.com/@almasdepombagira",
    "https://www.instagram.com/almasdepombagira/",
    "https://www.tiktok.com/@almasdepombagira",
    "https://alexiamelusine.substack.com/"
  ]
};

const websiteObj = {
  "@type": "WebSite",
  "@id": "https://pombagiras.com/#website",
  "url": "https://pombagiras.com/",
  "name": "Pombagiras.com",
  "description": "A maior enciclopédia online sobre Pombagiras, Exus e tradições afro-brasileiras. +200 páginas de conteúdo sagrado.",
  "publisher": {
    "@id": "https://pombagiras.com/#organization"
  },
  "inLanguage": "pt-BR",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://pombagiras.com/?s={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

// 2. Helper Functions
function replaceJsonLd(htmlContent, newJsonObj) {
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
    const match = htmlContent.match(jsonLdRegex);
    if (!match) return htmlContent;
    
    const prettyJson = JSON.stringify(newJsonObj, null, 2);
    // Indent JSON lines to look pristine in the HTML file
    const indentedJson = prettyJson.split('\n').map(line => '    ' + line).join('\n');
    const newScriptTag = `<script type="application/ld+json">\n${indentedJson}\n    </script>`;
    
    return htmlContent.replace(jsonLdRegex, newScriptTag);
}

function normalizeFileName(name) {
    return name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/ – /g, "-")
        .replace(/ /g, "-");
}

function parsePortalFAQs(html) {
    const qRegex = /<span class="faq-question">([^<]+)<\/span>/;
    const aRegex = /<div class="faq-content"[^>]*>([\s\S]*?)<\/div>/;
    const cleanParaRegex = /<p>([\s\S]*?)<\/p>/;

    const mainEntity = [];
    const faqBlockRegex = /<div class="faq-accordion-wrapper">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/;
    const faqBlockMatch = html.match(faqBlockRegex);
    if (!faqBlockMatch) {
        console.log("Could not find FAQ block in portal/index.html");
        return [];
    }

    const faqBlock = faqBlockMatch[1];
    const items = faqBlock.split('<div class="faq-item');
    items.shift(); // remove the prefix block
    items.forEach(item => {
        const qMatch = item.match(qRegex);
        const aBlockMatch = item.match(aRegex);
        if (qMatch && aBlockMatch) {
            const question = qMatch[1].replace(/^\d+\.\s*/, '').trim();
            const aMatch = aBlockMatch[1].match(cleanParaRegex);
            let answer = aBlockMatch[1].replace(/<[^>]+>/g, '').trim();
            if (aMatch) {
                answer = aMatch[1].replace(/<[^>]+>/g, '').trim();
            }
            answer = answer.replace(/\s+/g, ' ');
            mainEntity.push({
                "@type": "Question",
                "name": question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": answer
                }
            });
        }
    });
    return mainEntity;
}

// Entity Lists definitions
const portalEntities = [
  { name: "Maria Padilha", file: "maria-padilha.html" },
  { name: "Maria Mulambo", file: "maria-mulambo.html" },
  { name: "Maria Navalha", file: "maria-navalha.html" },
  { name: "Maria Quitéria", file: "maria-quitéria.html" },
  { name: "Maria Farrapo", file: "maria-farrapo.html" },
  { name: "Pombagira Cigana", file: "pombagira-cigana.html" },
  { name: "Pombagira Menina", file: "pombagira-menina.html" },
  { name: "Rosa Caveira", file: "rosa-caveira.html" },
  { name: "Sete Saias", file: "sete-saias.html" },
  { name: "Dama da Noite", file: "dama-da-noite.html" },
  { name: "Da Figueira", file: "da-figueira.html" },
  { name: "Da Praia", file: "da-praia.html" },
  { name: "Da Lua", file: "da-lua.html" },
  { name: "Da Serra", file: "da-serra.html" },
  { name: "Da Sombra", file: "da-sombra.html" },
  { name: "Das Águas Profundas", file: "das-águas-profundas.html" },
  { name: "Das Almas", file: "das-almas.html" },
  { name: "Das Trevas", file: "das-trevas.html" },
  { name: "Do Fogo", file: "do-fogo.html" },
  { name: "Sete Encruzilhadas", file: "sete-encruzilhadas.html" },
  { name: "Da Fenda", file: "da-fenda.html" },
  { name: "Da Calunga Profunda", file: "da-calunga-profunda.html" },
  { name: "Da Neblina", file: "da-neblina.html" },
  { name: "Das Correntes", file: "das-correntes.html" },
  { name: "São Cipriano", file: "sao-cipriano.html" },
  { name: "Quem Tem Pombagira", file: "caracteristicas.html" },
  { name: "Como Saber", file: "como-saber.html" }
];

const guardiasNames = [
  "Maria Padilha",
  "Maria Mulambo",
  "Maria Quitéria",
  "Rosa Caveira",
  "Dama da Noite",
  "Sete Saias",
  "Pombagira Cigana",
  "Maria Navalha",
  "Pombagira da Praia",
  "Maria Farrapo",
  "Pombagira Menina",
  "Pombagira da Figueira",
  "Pombagira das Almas",
  "Pombagira Sete Encruzilhadas",
  "Pombagira da Lua",
  "Pombagira das Trevas",
  "Pombagira da Serra",
  "Pombagira do Fogo",
  "Pombagira das Águas Profundas",
  "Pombagira da Sombra",
  "Pombagira da Fenda",
  "Pombagira da Calunga Profunda",
  "Pombagira das Correntes",
  "Pombagira da Neblina",
  "Pombagira da Estrada",
  "Pombagira do Vento",
  "Pombagira Cacurucaia – Senhora do Cruzeiro"
];

// 3. Execution Logic
function main() {
    console.log("Iniciando migração e atualização de dados estruturados em JSON-LD...");

    // === A. ATUALIZAR portal/index.html ===
    const portalIndexPath = path.join(__dirname, 'portal', 'index.html');
    if (fs.existsSync(portalIndexPath)) {
        let portalHtml = fs.readFileSync(portalIndexPath, 'utf8');
        const portalFaqs = parsePortalFAQs(portalHtml);
        const portalItems = portalEntities.map((ent, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": ent.name,
          "url": `https://pombagiras.com/portal/${ent.file}`
        }));
        
        const portalIndexGraph = {
          "@context": "https://schema.org",
          "@graph": [
            enrichAuthor,
            websiteObj,
            organizationObj,
            {
              "@type": "WebPage",
              "@id": "https://pombagiras.com/portal/#webpage",
              "url": "https://pombagiras.com/portal/",
              "name": "POMBAGIRAS.COM | Cultura, Arquétipos & Conhecimento",
              "description": "A maior plataforma de desmistificação das Pombagiras. Um mergulho profundo no conhecimento sagrado, história e arte, desconstruindo preconceitos com clareza e tecnologia.",
              "isPartOf": {
                "@id": "https://pombagiras.com/#website"
              },
              "about": {
                "@id": "https://pombagiras.com/#organization"
              },
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "@id": "https://pombagiras.com/portal/#primaryimage",
                "url": "https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/Ogimage%20e%20Twitter%20Card.png",
                "width": 1200,
                "height": 630
              }
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://pombagiras.com/portal/#breadcrumb",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://pombagiras.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Portal",
                  "item": "https://pombagiras.com/portal/"
                }
              ]
            },
            {
              "@type": "ItemList",
              "@id": "https://pombagiras.com/portal/#itemlist",
              "name": "Guardiãs - Portal Visceral",
              "description": `Artigos e correspondências sagradas de ${portalEntities.length} Pombagiras no Portal Visceral.`,
              "numberOfItems": portalEntities.length,
              "itemListElement": portalItems
            },
            {
              "@type": "FAQPage",
              "@id": "https://pombagiras.com/portal/#faq",
              "isPartOf": {
                "@id": "https://pombagiras.com/portal/#webpage"
              },
              "mainEntity": portalFaqs
            }
          ]
        };
        
        fs.writeFileSync(portalIndexPath, replaceJsonLd(portalHtml, portalIndexGraph), 'utf8');
        console.log("✔ portal/index.html atualizado com sucesso!");
    } else {
        console.warn("⚠ portal/index.html não foi encontrado.");
    }

    // === B. ATUALIZAR guardias/index.html ===
    const guardiasIndexPath = path.join(__dirname, 'guardias', 'index.html');
    if (fs.existsSync(guardiasIndexPath)) {
        let guardiasHtml = fs.readFileSync(guardiasIndexPath, 'utf8');
        const guardiasItems = guardiasNames.map((name, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": name,
          "url": `https://pombagiras.com/guardias/${normalizeFileName(name)}.html`
        }));
        
        const guardiasIndexGraph = {
          "@context": "https://schema.org",
          "@graph": [
            enrichAuthor,
            websiteObj,
            organizationObj,
            {
              "@type": "WebPage",
              "@id": "https://pombagiras.com/guardias/#webpage",
              "url": "https://pombagiras.com/guardias/",
              "name": "POMBAGIRAS.COM | Cultura, Arquétipos & Conhecimento",
              "description": "A maior plataforma de desmistificação das Pombagiras. Um mergulho profundo no conhecimento sagrado, história e arte, desconstruindo preconceitos com clareza e tecnologia.",
              "isPartOf": {
                "@id": "https://pombagiras.com/#website"
              },
              "about": {
                "@id": "https://pombagiras.com/#organization"
              },
              "primaryImageOfPage": {
                "@type": "ImageObject",
                "@id": "https://pombagiras.com/guardias/#primaryimage",
                "url": "https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/Ogimage%20e%20Twitter%20Card.png",
                "width": 1200,
                "height": 630
              }
            },
            {
              "@type": "BreadcrumbList",
              "@id": "https://pombagiras.com/guardias/#breadcrumb",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://pombagiras.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Guardiãs",
                  "item": "https://pombagiras.com/guardias/"
                }
              ]
            },
            {
              "@type": "Article",
              "@id": "https://pombagiras.com/guardias/#article",
              "isPartOf": {
                "@id": "https://pombagiras.com/guardias/#webpage"
              },
              "headline": "A Origem Histórica das Pombagiras",
              "description": "Exploração histórica, teológica e cultural sobre as origens e a evolução do culto às Pombagiras nas religiões afro-brasileiras.",
              "image": "https://raw.githubusercontent.com/pombagiras/melusine/main/fotos/Ogimage%20e%20Twitter%20Card.png",
              "author": {
                "@id": "https://pombagiras.com/#author"
              },
              "publisher": {
                "@id": "https://pombagiras.com/#organization"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://pombagiras.com/guardias/#webpage"
              },
              "inLanguage": "pt-BR",
              "datePublished": "2026-06-03T14:00:00-03:00",
              "dateModified": "2026-06-03T14:00:00-03:00"
            },
            {
              "@type": "ItemList",
              "@id": "https://pombagiras.com/guardias/#itemlist",
              "name": "Guardiãs - Pombagiras",
              "description": "Enciclopédia ilustrada e teológica com 27 Guardiãs da Umbanda e Quimbanda.",
              "numberOfItems": 27,
              "itemListElement": guardiasItems
            }
          ]
        };
        
        fs.writeFileSync(guardiasIndexPath, replaceJsonLd(guardiasHtml, guardiasIndexGraph), 'utf8');
        console.log("✔ guardias/index.html atualizado com sucesso!");
    } else {
        console.warn("⚠ guardias/index.html não foi encontrado.");
    }

    // === C. ATUALIZAR AS 24 PÁGINAS ESTÁTICAS DE portal/*.html ===
    const portalDir = path.join(__dirname, 'portal');
    if (fs.existsSync(portalDir)) {
        const files = fs.readdirSync(portalDir);
        let count = 0;
        
        files.forEach(file => {
            if (path.extname(file).toLowerCase() === '.html' && file !== 'index.html' && file !== 'whatsapp.html') {
                const filePath = path.join(portalDir, file);
                const html = fs.readFileSync(filePath, 'utf8');
                
                // Process the subpage and replace ProfilePage with Article, enriching Person etc.
                const updatedHtml = processPortalSubpage(file, html);
                if (updatedHtml) {
                    fs.writeFileSync(filePath, updatedHtml, 'utf8');
                    console.log(`  ✔ Subpágina atualizada: portal/${file}`);
                    count++;
                }
            }
        });
        console.log(`✔ Processadas ${count} subpáginas sob portal/ com sucesso!`);
    } else {
        console.warn("⚠ Diretório portal/ não foi encontrado.");
    }
}

function processPortalSubpage(fileName, html) {
    const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/;
    const match = html.match(jsonLdRegex);
    if (!match) {
        console.warn(`    ⚠ Nenhum script JSON-LD encontrado em ${fileName}`);
        return null;
    }
    
    let oldGraph;
    try {
        const parsed = JSON.parse(match[1]);
        oldGraph = parsed["@graph"] || [];
    } catch (e) {
        console.error(`    ❌ Erro ao analisar JSON-LD em ${fileName}:`, e.message);
        return null;
    }
    
    // Extrai o nome e descrição do ProfilePage original
    let entityName = "";
    let entityDesc = "";
    const profilePageObj = oldGraph.find(obj => obj["@type"] === "ProfilePage");
    if (profilePageObj) {
        entityName = profilePageObj.name;
        entityDesc = profilePageObj.description;
    } else {
        const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
        if (titleMatch) {
            entityName = titleMatch[1].split('|')[0].trim();
        }
        const descMatch = html.match(/<meta name="description" content="([^"]+)">/i);
        if (descMatch) {
            entityDesc = descMatch[1].trim();
        }
    }
    
    // Extrai os FAQs do FAQPage original
    let faqMainEntity = [];
    const faqPageObj = oldGraph.find(obj => obj["@type"] === "FAQPage");
    if (faqPageObj && faqPageObj.mainEntity) {
        faqMainEntity = faqPageObj.mainEntity;
    }
    
    // Extrai o og:image
    let imageUrl = "";
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]+)">/i);
    if (ogImageMatch) {
        imageUrl = ogImageMatch[1].trim();
    }
    
    // Reconstrói o JSON-LD como um Unified Knowledge Graph Schema
    const newGraph = {
      "@context": "https://schema.org",
      "@graph": [
        enrichAuthor,
        websiteObj,
        organizationObj,
        {
          "@type": "WebPage",
          "@id": `https://pombagiras.com/portal/${fileName}#webpage`,
          "url": `https://pombagiras.com/portal/${fileName}`,
          "name": `${entityName} | POMBAGIRAS.COM`,
          "isPartOf": {
            "@id": "https://pombagiras.com/#website"
          },
          "breadcrumb": {
            "@id": `https://pombagiras.com/portal/${fileName}#breadcrumb`
          },
          "inLanguage": "pt-BR"
        },
        {
          "@type": "BreadcrumbList",
          "@id": `https://pombagiras.com/portal/${fileName}#breadcrumb`,
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": "https://pombagiras.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Portal",
              "item": "https://pombagiras.com/portal/"
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": entityName,
              "item": `https://pombagiras.com/portal/${fileName}`
            }
          ]
        },
        {
          "@type": "Article",
          "@id": `https://pombagiras.com/portal/${fileName}#article`,
          "isPartOf": {
            "@id": `https://pombagiras.com/portal/${fileName}#webpage`
          },
          "headline": `Estudo e Fundamentos sobre a Guardiã ${entityName}`,
          "description": entityDesc || `Estudo aprofundado sobre os mistérios, regência e correspondências da Guardiã ${entityName}.`,
          "image": imageUrl,
          "author": {
            "@id": "https://pombagiras.com/#author"
          },
          "publisher": {
            "@id": "https://pombagiras.com/#organization"
          },
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://pombagiras.com/portal/${fileName}#webpage`
          },
          "inLanguage": "pt-BR",
          "datePublished": "2026-06-03T14:00:00-03:00",
          "dateModified": "2026-06-03T14:00:00-03:00"
        }
      ]
    };
    
    if (faqMainEntity.length > 0) {
        newGraph["@graph"].push({
          "@type": "FAQPage",
          "@id": `https://pombagiras.com/portal/${fileName}#faq`,
          "isPartOf": {
            "@id": `https://pombagiras.com/portal/${fileName}#webpage`
          },
          "mainEntity": faqMainEntity
        });
    }
    
    let resultHtml = replaceJsonLd(html, newGraph);
    
    // Inject LCP image preload right after <head> if not already present
    if (imageUrl && !resultHtml.includes('rel="preload"')) {
        resultHtml = resultHtml.replace('<head>', `<head>\n    <!-- Preload critical LCP image immediately -->\n    <link rel="preload" href="${imageUrl}" as="image" fetchpriority="high">`);
    }
    
    return resultHtml;
}

main();
