# Hero — medidas da referência (landonorris.com) vs implementação

Data: 26/11/2026. Fonte: `docs/visual-reference.md` (DOM/CSS medidos) + revalidação visual.

## Referência @1440×900 (MEDIDO)

| Elemento | Valor |
|---|---|
| Hero | 100vh sticky; track 2×vh |
| Header altura | 83 px |
| Margem lateral | 1.25 rem |
| Logo | 131 × 60 |
| Glifo central | 37 × 37 |
| CTA (Store) | 118 × 60, radius ≈ 7.2 px, `#d2ff00` |
| Menu | 60 × 60, borda ≈ 1.5 px |
| Topo da cabeça | ≈ 11–12 % da altura |
| Linha dos olhos | ≈ 33–36 % |
| Queixo | ≈ 70 % |
| Largura cabeça | ≈ 40 % da viewport |
| Ombros na base | ≈ 60–65 % da largura |
| Card inferior esq. | 99 × 203 (≈ 6,9 % da largura), folga 17 px |
| Fundo hero | `#fcfcf8` + blobs `#e8e8e4` + linhas 1 px |

## Mobile 390×844 (MEDIDO)

- Card inferior: oculto
- Rosto ≈ 100 % da largura
- Topo da cabeça ≈ 25 % da altura
- CTA Store à esquerda; menu à direita; logo tipográfico oculto no header

## Asset novo (Jefferson)

- Fonte: studio portrait PNG 819×819 RGBA (fundo preto)
- Cutout rembg → `public/assets/hero/portrait-base.png` (819×756, alpha limpo)
- Face mask → `public/assets/hero/face-mask.png`
