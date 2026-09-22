import fs from 'node:fs/promises';
import sharp from '/Users/anastasiavolkova/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp/dist/index.cjs';

const dir = new URL('../', import.meta.url);
const gold = '#E2CA79';
// Original geometry: flat terminals, chamfered corners, bowed shoulders.
const icons = [
  ['01-clients', 'Клиенты', `
    <path d="M19 10C14.6 10 12 13 12 17.5S14.6 25 19 25S26 22 26 17.5S23.4 10 19 10Z"/>
    <path d="M44 10C39.6 10 37 13 37 17.5S39.6 25 44 25S51 22 51 17.5S48.4 10 44 10Z"/>
    <path d="M8 54V44C8 36.5 12 32 19 32H24"/>
    <path d="M23 54L27 41C28.8 35.2 33 32 39 32H43C50.5 32 55 36.5 55 44V54"/>
  `],
  ['02-calculations', 'Расчёты', `
    <path d="M45.5 17.2A20 20 0 0 0 12 32C12 43 21 52 32 52A20 20 0 0 0 51.3 26.8"/>
    <path d="M18.5 17.2L23 22M13 38L20 36M33 44V51"/>
    <path d="M8.6 36.5C4 43.5 5.6 48.4 12 48.4C20.4 48.4 33 40.4 43.5 30.2C52 22 58.7 12.7 55.4 9.5C52.7 6.8 47.8 8.2 42.8 10.5"/>
    <path d="M36 32A4 4 0 1 1 28 32A4 4 0 1 1 36 32Z"/>
  `],
  ['03-calendar', 'Запись и календарь', `
    <path d="M22 7V20M42 7V20"/>
    <path d="M16 14H48L54 20V48L48 54H16L10 48V20Z"/>
    <path d="M10 26H54M20 36H28M36 36H44M20 45H28"/>
  `],
  ['04-services', 'Ваши услуги', `
    <path d="M28 8H36L53 18L56 23V42L52 48L36 57H28L12 48L8 42V23L11 18Z"/>
    <path d="M9 21L28 32H36L55 21M32 33V56M21 14L43 27"/>
  `],
  ['05-consultations', 'Консультации', `
    <path d="M14 15H34L41 22V43L35 49H14L8 43V21Z"/>
    <path d="M41 27L55 18H57V47H55L41 38"/>
    <path d="M17 24H25"/>
  `],
  ['06-support', 'Сопровождение', `
    <path d="M32 18C28 14 23 13 17 13H8V48H18C24 48 28.5 50 32 54C35.5 50 40 48 46 48H56V13H47C41 13 36 14 32 18Z"/>
    <path d="M32 18V54M43 14V31L47 28L51 31V13M16 24H24M16 32H24"/>
  `],
  ['07-automation', 'AI и автоматизация', `
    <path d="M11 9H21L25 13V23L21 27H11L7 23V13ZM43 9H53L57 13V23L53 27H43L39 23V13Z"/>
    <path d="M16 27V33C16 38 20 40 25 40H39C44 40 48 38 48 33V27M32 40V46"/>
    <path d="M27 46H37L41 50V54L37 58H27L23 54V50Z"/>
  `],
  ['08-content', 'Контент', `
    <path d="M18 8H39L51 20V50L45 56H18L12 50V14Z"/>
    <path d="M38 8V21H51M21 29H42M21 38H42M21 47H34"/>
  `],
  ['09-practice', 'Моя практика', `
    <path d="M52 17V14L47 9H18L10 17V47L16 53H48L54 47V24L49 19H18C12.7 19 10 18.3 10 17"/>
    <path d="M54 30H41L36 35V39L41 44H54"/>
    <path d="M44 37H47"/>
  `],
];

for (const [name, title, geometry] of icons) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" role="img" aria-labelledby="title">\n  <title id="title">${title} — ElevenHouse</title>\n  <g stroke="${gold}" stroke-width="3.6" stroke-linecap="butt" stroke-linejoin="round">${geometry}  </g>\n</svg>\n`;
  await fs.writeFile(new URL(`${name}.svg`, dir), svg);
}

// Private visual check at large and actual UI sizes; delivered icons have no background.
const panels = icons.map(([name, title, geometry], i) => {
  const x = (i % 3) * 300, y = Math.floor(i / 3) * 250;
  return `<g transform="translate(${x},${y})"><g transform="translate(83,26) scale(2.1)" fill="none" stroke="${gold}" stroke-width="3.6" stroke-linecap="butt" stroke-linejoin="round">${geometry}</g><g transform="translate(202,171) scale(.5)" fill="none" stroke="${gold}" stroke-width="3.6" stroke-linecap="butt" stroke-linejoin="round">${geometry}</g><text x="150" y="224" text-anchor="middle" font-family="Arial" font-size="16" fill="#F2F1EB">${title}</text></g>`;
});
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="900" height="750"><path fill="#152037" d="M0 0H900V750H0Z"/>${panels.join('')}</svg>`)).png().toFile(decodeURIComponent(new URL('preview.png', import.meta.url).pathname));
console.log(`Created ${icons.length} individual transparent SVG icons in ${dir.pathname}`);
