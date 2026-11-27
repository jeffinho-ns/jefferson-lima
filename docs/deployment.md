# Deploy

Guia de publicação do site na **Vercel**. Baseado em `package.json`, `next.config.ts`, `src/middleware.ts` e `.env.example`. Não há `vercel.json` no projeto — as configurações padrão do preset Next.js são suficientes.

## 1. Pré-requisitos

- Repositório Git com o código (o `.gitignore` já ignora `.env*`, `.next`, `.vercel`, `node_modules` e `*.tsbuildinfo`; apenas `.env.example` é versionado).
- Conta na Vercel.
- Conta no [Resend](https://resend.com) com **domínio verificado** (para o formulário de contato enviar e-mails de verdade).
- Domínio final do site.

## 2. Configuração do projeto na Vercel

| Campo | Valor |
| --- | --- |
| Framework Preset | Next.js (detectado automaticamente) |
| Build Command | `npm run build` (padrão) |
| Install Command | `npm install` (padrão; há `package-lock.json`) |
| Output Directory | padrão do Next.js |
| Node.js | Versão LTS compatível com Next.js 16 — confirme em *Settings → General → Node.js Version* |
| Root Directory | raiz do repositório |

Particularidades do projeto:

- **`src/middleware.ts`** aplica headers de segurança e CSP em todas as rotas, exceto estáticos/imagens.
- **`/api/contact`** roda em `runtime = "nodejs"` (necessário para o SDK do Resend).
- **Shaders GLSL** são importados por `loaders/glsl-loader.cjs`, configurado para Turbopack e webpack — nenhuma etapa extra de build.
- `/projetos/[slug]` e `/servicos/[slug]` são gerados estaticamente a partir de `src/data/*`.

## 3. Variáveis de ambiente

Cadastre em *Settings → Environment Variables* (marque **Production** e, se quiser testar o formulário em previews, **Preview**). Origem: [`.env.example`](../.env.example).

| Variável | Obrigatória para publicar? | Observação |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Sim** | Domínio final com `https://`, sem barra no fim (o código remove barras finais). Alimenta `metadataBase`, Open Graph, sitemap, robots e JSON-LD. Com o padrão `http://localhost:3000`, os metadados saem errados em produção. |
| `NEXT_PUBLIC_EMAIL` | Recomendada | Exibido publicamente; fallback de destinatário do formulário. **Precisa ser definido pelo dono do site.** |
| `NEXT_PUBLIC_WHATSAPP` | Recomendada | Somente dígitos com DDI (ex.: `5511999999999`). **Precisa ser definido pelo dono do site.** |
| `NEXT_PUBLIC_GITHUB_URL` | Opcional | Vazio = link oculto. **Precisa ser definido pelo dono do site.** |
| `NEXT_PUBLIC_LINKEDIN_URL` | Opcional | Idem. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Opcional | Idem. |
| `RESEND_API_KEY` | **Sim, para o formulário enviar** | Segredo. **Não** usar prefixo `NEXT_PUBLIC_`. Sem ela, `/api/contact` responde `503 EMAIL_NOT_CONFIGURED`. |
| `CONTACT_TO_EMAIL` | **Sim, para o formulário enviar** | Destinatário (ou defina `NEXT_PUBLIC_EMAIL`). |
| `CONTACT_FROM_EMAIL` | **Sim, em produção** | Remetente de domínio verificado no Resend, ex.: `Site <contato@seudominio.com>`. O fallback `onboarding@resend.dev` é só para testes. |
| `RATE_LIMIT` / `RATE_LIMIT_WINDOW_SECONDS` | Não | Constam no `.env.example`, mas **o código ainda não as lê** (limite fixo de 5 req/60 s por IP, em memória). Cadastrar não altera o comportamento hoje. |
| `NEXT_PUBLIC_ANALYTICS_ID` | Não | **Não utilizada** — analytics está desligado (`features.analyticsEnabled = false`). |

Observações:

- Variáveis `NEXT_PUBLIC_*` são embutidas **no build**: depois de alterá-las, é preciso **novo deploy**.
- Nunca commite `.env.local`. Para rodar localmente com os mesmos valores: `vercel env pull .env.local` (se usar a CLI da Vercel).
- O rate limit em memória não é compartilhado entre instâncias serverless; para proteção robusta, considere WAF/Firewall da Vercel ou um store externo (decisão pendente).

## 4. Primeiro deploy — passo a passo

1. **Validar localmente** (veja `quality-assurance.md`):
   ```bash
   npm run typecheck && npm run lint && npm test && npm run build
   ```
2. Importar o repositório em *Vercel → Add New → Project*.
3. Cadastrar as variáveis da seção 3.
4. *Deploy*. Abrir a URL de preview e navegar por todas as rotas.
5. Em *Settings → Domains*, adicionar o domínio e configurar o DNS conforme indicado. Ajustar `NEXT_PUBLIC_SITE_URL` para o domínio final e **redeployar**.
6. No Resend, verificar o domínio (SPF/DKIM) e testar um envio real pelo formulário.

## 5. Checklist antes de publicar

Marque cada item **antes** de divulgar o site. O estado indicado é o que foi verificado no repositório até esta documentação.

### Código e build

- [x] `npm run typecheck` sem erros
- [x] `npm run lint` sem erros
- [x] `npm test` (Vitest) — 3 testes passando
- [x] `npm run build` concluindo
- [ ] `npm run test:e2e` **totalmente verde** — na última execução registrada: 1 teste passou e 1 falhou por asserção desatualizada (ver `quality-assurance.md`)

### Configuração

- [ ] `NEXT_PUBLIC_SITE_URL` com o domínio final
- [ ] E-mail e WhatsApp reais configurados (**pendente — depende do usuário**)
- [ ] URLs de GitHub / LinkedIn / Instagram configuradas (**pendente — depende do usuário**)
- [ ] `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` configurados e domínio verificado no Resend
- [ ] Envio real do formulário testado em produção/preview (e-mail chega; `reply-to` é o do visitante)

### Ativos e conteúdo

- [ ] **Retrato definitivo**: `public/images/portrait/jefferson-cutout.png` é **provisório** (recorte automático via rembg) — substituir por cutout profissional
- [ ] **Mockup aprovado da home: PENDENTE** (não encontrado no filesystem) — localizar e comparar com a implementação
- [ ] Capas reais dos projetos em `public/images/projects/` (pasta vazia hoje; `src/data/projects.ts` referencia arquivos inexistentes)
- [ ] Imagem Open Graph dedicada (hoje não há `openGraph.images`)
- [ ] Revisão do texto de `/privacidade` (LGPD) por responsável
- [ ] Revisão de textos/dados em `src/data/*` (sem métricas ou clientes não confirmados)

### SEO e segurança

- [ ] `/sitemap.xml` e `/robots.txt` respondendo no domínio final com URLs corretas
- [ ] Metadados/Open Graph conferidos (preview de compartilhamento)
- [ ] Headers do `middleware.ts` presentes (inspecionar resposta); CSP sem violações no console
- [ ] Decidir se endurece a CSP (hoje usa `'unsafe-inline'`/`'unsafe-eval'` em `script-src`)

### Performance e acessibilidade

- [ ] Lighthouse / Web Vitals medidos **no deploy publicado** (nenhuma medição foi registrada ainda)
- [ ] Teste em dispositivo móvel real (WebGL, toque, scroll nativo)
- [ ] Teste com `prefers-reduced-motion` e navegação por teclado (menu, formulário, skip-link)

## 6. Pós-deploy

- Reenviar o sitemap no Google Search Console (após configurar o domínio).
- Monitorar erros da rota `/api/contact` (status `502` indicam falha do Resend; `503`, configuração ausente) nos logs da Vercel.
- Se analytics for ativado no futuro: implementar o carregamento (hoje inexistente), ajustar `features.analyticsEnabled`, atualizar `/privacidade` e a CSP, se necessário.

## 7. Rollback

Na Vercel, promova um deploy anterior bem-sucedido em *Deployments → … → Promote to Production*. Alterações de variáveis exigem novo deploy para valerem.
