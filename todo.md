# Portabilização NOVUAPP (opção B)

- [x] Listar todas as URLs /manus-storage usadas no código e index.html
- [x] Baixar cada imagem do dev server para client/src/assets/ (webp)
- [x] Atualizar referências no código para os assets locais (imports)
- [x] Limpar index.html: favicon local, remover script de analytics com %VITE_%
- [x] vite.config.ts: plugins Manus carregados dinamicamente (opcional)
- [x] Script build estático puro (`pnpm build`) + `build:full` para Node
- [x] Rodar pnpm build e conferir dist (build Manus OK)
- [x] Simular host externo em /tmp/novu-test sem plugins Manus: vite build OK, index.html 4KB sem refs manus, todos assets HTTP 200
- [x] Corrigir debug-collector para apply:"serve" (não injeta script em produção)
- [x] Dev server Manus continua renderizando normalmente
- [x] Commit + push para user_github (via credencial gh)
- [x] Checkpoint no Manus e entrega

## Erro readdy.ai (round 2)
- [x] Verificar estado do repo remoto: sem alterações do readdy, remoto == local
- [x] Reproduzir build externo: npm install FALHA (ERESOLVE) por peer dep vite@^4||^5 de @builder.io/vite-plugin-jsx-loc (optionalDependencies); npm não instala nada → vite not found
- [x] Causa raiz identificada: optionalDependencies com peer deps conflitantes quebram npm; pnpm tolera
- [ ] Aplicar correções de compatibilidade (possivelmente simplificar estrutura para raiz padrão)
- [ ] Validar build + push + orientar usuário

## Roteiro de vídeo NOVU (40s)
- [ ] Escrever roteiro completo: 3 atos (mãe/vestido rasgado → costureira reparando → entrega à filha)
- [ ] Tabela cena a cena com tempos, enquadramentos e direção de fotografia
- [ ] Texto de narração (mulher de meia idade, tom afetivo: roupa guarda abraços/memórias)
- [ ] Direção de trilha sonora, som e tipografia/lettering final
- [ ] Entregar arquivo ao usuário

## Produção do vídeo "O Vestido" (40s, 9:16)
- [ ] Ler skills de música/TTS antes de gerar áudio
- [ ] Gerar clipes 9:16 das cenas (I: mãe/vestido; II: costureira; III: entrega/abraço; logo final)
- [ ] Gerar narração feminina de meia idade (texto do roteiro)
- [ ] Gerar trilha acústica (violão + cordas, crescendo suave)
- [ ] Montar com ffmpeg: cortes, mixagem narração+trilha, lettering final NOVU
- [ ] Revisar duração (~40s), sincronia e qualidade; entregar

### Diagnóstico refinado
- npm puro: ERESOLVE por peer dep vite ^4||^5 do @builder.io/vite-plugin-jsx-loc → install falha, "vite: not found"
- npm com legacy-peer-deps: instala vite-plugin-manus-runtime → injeta <script id="manus-runtime"> inline de 350KB no index.html de produção
- Decisão: REMOVER optionalDependencies do package.json. Plugins Manus só via env local (pnpm no sandbox tem node_modules já instalados? NÃO — remoção limpa; dev Manus usa import dinâmico que falhará silenciosamente = ok, mas perde runtime no preview)
- Alternativa escolhida: manter plugins fora do package.json e instalar no sandbox via pnpm add sem salvar? Simples: remover de optionalDependencies e garantir que node_modules local os mantenha (pnpm install não remove? remove). Melhor: condicionar carregamento a env MANUS (só carrega se process.env.MANUS_RUNTIME=1) e deixá-los como devDependencies… ainda quebra npm.
- Solução final: remover completamente os 2 plugins do package.json; vite.config já tolera ausência. Dev preview Manus funciona sem eles (perde apenas visual editor overlay).
