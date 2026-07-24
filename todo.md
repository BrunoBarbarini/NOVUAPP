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
- [ ] Commit + push para user_github (via credencial gh)
- [ ] Checkpoint no Manus e entrega
