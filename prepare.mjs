import { readFileSync, writeFileSync } from 'node:fs';

const source = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const supervision = 'https://syneos-securite.ludovic-macq.chatgpt.site/';
let page = source
  .replace('Retrouvez vos applications opérationnelles et vérifiez leur état à la demande. Chaque service conserve ses comptes, ses données et ses fonctions.', 'Retrouvez vos trois applications opérationnelles depuis un seul point d’accès. Chaque service conserve ses comptes, ses données et ses fonctions.')
  .replace('<span id="last">Aucun contrôle effectué</span><button id="check" type="button">Vérifier maintenant ↻</button>', `<a class="supervision-link" href="${supervision}" target="_blank" rel="noopener noreferrer">Ouvrir la supervision ↗</a>`)
  .replaceAll('État non vérifié', 'État à consulter')
  .replaceAll('Lancer un contrôle pour obtenir un état réel.', 'Utilisez la supervision pour vérifier ce service.');
const tableStart = page.indexOf('<table class="overview">');
const tableEnd = page.indexOf('</main>', tableStart);
if (tableStart < 0 || tableEnd < 0) throw new Error('Bloc de supervision introuvable');
page = page.slice(0, tableStart) + `<div class="note">Pour vérifier l’état réel des applications et des bases, <a href="${supervision}" target="_blank" rel="noopener noreferrer">ouvrir le tableau de supervision</a>. Aucun état n’est présumé opérationnel sans contrôle.</div>` + page.slice(tableEnd);
page = page.replace(/<script>\s*const button=.*?<\/script>/s, '');
page = page.replace('</style>', '.supervision-link{display:inline-flex;align-items:center;min-height:42px;padding:10px 14px;border:1px solid #537995;border-radius:8px;color:#edf4f8;text-decoration:none;background:#1b3953}.supervision-link:hover,.supervision-link:focus-visible{background:#294e6c}.note a{color:#9ed6ff}</style>');
if (page.includes('/api/check') || page.includes('id="check"')) throw new Error('Ancien contrôle dynamique encore présent');
writeFileSync(new URL('./index.html', import.meta.url), page, 'utf8');
