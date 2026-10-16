import { readFileSync, writeFileSync } from 'node:fs';

const path = new URL('./index.html', import.meta.url);
let page = readFileSync(path, 'utf8');
if (page.includes('data-service="mateos"')) throw new Error('MATÉOS figure déjà dans le portail');

const icon = readFileSync(new URL('./mateos/mateos_256.png', import.meta.url)).toString('base64');
const card = `<section class="card" style="--accent:#dba946" data-service="mateos"><div class="card-head"><img class="icon" src="data:image/png;base64,${icon}" alt="Logo MATÉOS"><div><div class="name">MATÉOS</div><div class="kind">Équipements incendie</div></div></div><p class="desc">Gestion des équipements de sécurité incendie et systèmes associés.</p><div class="stage">En développement</div><a class="open" href="https://mateos-web.onrender.com/"><span>Ouvrir MATÉOS</span><b aria-hidden="true">↗</b></a></section>`;
if (!page.includes('</div></main>')) throw new Error('Grille des applications introuvable');
page = page.replace('</div></main>', `${card}</div></main>`);
page = page.replace('IGNÉOS, CRISÉOS et REGÉOS.', 'IGNÉOS, CRISÉOS, REGÉOS et MATÉOS.');
page = page.replace('</style>', '@media(min-width:851px){.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}</style>');
writeFileSync(path, page, 'utf8');
