# Portrait assets — status

> **O recorte atual é PROVISÓRIO.** Não publicar comercialmente com ele.

## Arquivos

| Arquivo | Estado | Observação |
| --- | --- | --- |
| `jefferson-original.jpg` | Provisório | Foto original (provisória, vinda de `Desktop/jeffinho.jpeg`). Usada como **fallback** (`PORTRAIT_FALLBACK_SRC`) e na imagem do JSON-LD. 800×800 px. |
| `jefferson-cutout.png` | **PROVISÓRIO** | Recorte **automático gerado com `rembg`**. É o arquivo usado pelo site (`PORTRAIT_SRC` em `src/components/hero/portrait-assets.ts`). 800×800 px. |
| `jefferson-transparent.png` | Provisório | Mesmo tamanho em bytes que o `cutout` (cópia/alias). **Não é referenciado no código.** |
| `jefferson-provisional.png` | Provisório / histórico | Versão anterior do recorte, feita por **máscara elíptica**. **Não é referenciada no código.** |

## Limitações conhecidas do recorte rembg

- É um recorte automático: **não foi revisado manualmente** quanto a bordas, cabelo, óculos e boné. Podem existir halos, serrilhado ou partes cortadas/mantidas indevidamente.
- Afeta diretamente o hero: o shader (`portrait.frag`) usa o **alpha** do retrato como máscara do efeito rosto → código, então falhas no recorte aparecem como falhas no efeito.
- Resolução de 800×800 px pode ser baixa para telas grandes / alta densidade (não validada).

## Ação necessária

Substituir por **cutout profissional**: fundo transparente, **óculos e boné preservados**, bordas limpas, resolução maior. Manter o nome/caminho `jefferson-cutout.png` (ou ajustar `portrait-assets.ts`). Depois, rever visualmente o hero em desktop e mobile e remover os arquivos não utilizados (`jefferson-transparent.png`, `jefferson-provisional.png`) se não forem mais necessários.

## Outras pendências relacionadas

- **Mockup aprovado da home: PENDENTE** — não encontrado no filesystem. Sem ele não há baseline para a comparação visual (ver `docs/quality-assurance.md`).
- E-mail, WhatsApp e URLs de redes sociais **dependem de configuração pelo usuário** (`.env`), ver `docs/deployment.md`.
