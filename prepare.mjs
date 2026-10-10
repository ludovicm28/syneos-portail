import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('./index.html', import.meta.url);
let page = readFileSync(path, 'utf8');
page = page.replace(
  '<div class="brand-sub">Sécurité · coordination · accès</div>',
  '<div class="brand-sub">Système de Navigation des Événements et Opérations de Sécurité</div>'
);
page = page.replace(/<p class="eyebrow">.*?<div class="grid">/s, '<div class="grid">');
page = page.replace('</style>', '.brand-sub{max-width:540px;white-space:normal;line-height:1.3}main{padding-top:34px}</style>');
page = page.replace(
  'Retrouvez vos trois applications opérationnelles depuis un seul point d’accès. Chaque service conserve ses comptes, ses données et ses fonctions.',
  'Accédez à vos trois applications depuis un seul portail.'
);
page = page.replace(/<div class="toolbar">.*?<div class="grid">/s, '<div class="grid">');
const statuses = [...page.matchAll(/<div class="status" data-state="unknown" role="status">.*?<\/div><\/div><a class="open"/gs)];
if (statuses.length !== 0 && statuses.length !== 3) throw new Error(`Trois panneaux d'état attendus, ${statuses.length} trouvés`);
page = page.replace(/<div class="status" data-state="unknown" role="status">.*?<\/div><\/div><a class="open"/gs, '<a class="open"');
page = page.replace(/<div class="note">.*?<\/div><\/main>/s, '</main>');
page = page.replace(/<script>.*?<\/script>/s, '');
page = page.replace(/\.supervision-link\{.*?\.note a\{[^}]*\}/s, '');
if (page.includes('class="status"') || page.includes('class="supervision-link"') || page.includes('/api/check')) {
  throw new Error('La page contient encore des éléments de supervision');
}
writeFileSync(path, page, 'utf8');
