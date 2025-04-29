/*
 * This script works on assumptions that you already unarchives icons from their
 * ZIP-containers already.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const PATHS = [
  'lucide-',
  'tabler-',
  'oct'
].map(x => `${x}icons`);

const ROOTS = [
  /*
   * LUCIDE:
   * -------
   * lucide-icons
   * └─── ...
   */
  {
    'type': `${PATHS[0]}`,
    'name': `${PATHS[0].replace('icons', '').toUpperCase()}`,
    'roots': [
      'icons'
    ],
    'display': `${PATHS[0]}\n └─── *.svg`
  },
  /*
   * TABLERS:
   * --------
   * tabler-icons
   * └─── eps
   *      └─── filled
   *      └─── outline
   * └─── pdf
   *      └─── filled
   *      └─── outline
   * └─── png
   *      └─── filled
   *      └─── outline
   * └─── svg
   *      └─── filled
   *      └─── outline
   * └─── webfont
   *      └─── filled
   *      └─── outline
   */
  {
    'type': `${PATHS[1]}`,
    'name': `${PATHS[1].replace('icons', '').toUpperCase()}`,
    'roots': [
      'svg/filled',
      'svg/outline'
    ],
    'display': `${PATHS[1]}\n └─── eps\n      └─── filled\n      └─── outline\n └─── pdf\n      └─── filled\n      └─── outline\n └─── png\n      └─── filled\n      └─── outline\n └─── svg\n      └─── filled\n           └─── *.svg\n      └─── outline\n           └─── *.svg\n └─── webfont\n      └─── filled\n      └─── outline`
  },
  /*
   * OCTICONS:
   * ---------
   * octicons
   * │ ...
   * └─── octicons-19.8.0
   *      └─── icons
   */
  {
    'type': `${PATHS[2]}`,
    'name': `${PATHS[2].replace('icons', '').toUpperCase()}`,
    'roots': [
      'octicons-19.8.0/icons'
    ],
    'display': `${PATHS[2]}\n │ ...\n └─── octicons-19.8.0\n      └─── icons\n           └─── *.svg`
  }
];

for (const iconset of ROOTS) {
  console.debug('\x1b[0m\x1b[36m', `Working on the ${iconset.name} icons pack:`);
  console.debug('\x1b[0m\x1b[90m', `${iconset.display}`);

  const counts = {
    'source': 0,
    'result': 0
  };

  for (const root of iconset.roots) {
    const working_dir = path.join(iconset.type, root);

    const icons = fs.readdirSync(working_dir).filter(file => file.endsWith('.svg'));

    counts.source += (iconset.type === 'tabler-icons' && working_dir.endsWith('filled')) ? icons.length : 0;

    console.debug('\x1b[0m\x1b[33m', `Found ${icons.length} icons!`);

    icons.forEach(icon => {
      fs.copyFileSync(path.join(working_dir, icon), path.join(
        iconset.type,
        /* TABLER- is an edge-case because it contains same named icons in different working directories. */
        iconset.type === 'tabler-icons' && working_dir.endsWith('outline')
          ? `${icon.split('.')[0]}-outline.svg`
          : icon
      ));
    });

    fs.readdirSync(iconset.type).filter(file => file.endsWith('.svg') === false).forEach(file => {
      /* TABLER- is an edge-case because it contains same named icons in different working directories. */
      if (file.endsWith('svg')) {
        if (working_dir.endsWith('outline'))
          fs.rmSync(path.join(iconset.type, file), { recursive: true, });
      }
      else {
        fs.rmSync(path.join(iconset.type, file), { recursive: true, });
      }
    });

    const icons_total = fs.readdirSync(iconset.type).filter(file => file.endsWith('.svg'));

    counts.source += icons.length;
    counts.result += icons_total.length;
  }

  console.debug('\x1b[0m\x1b[32m', `Successfully moved and assigned \x1b[0m\x1b[37m${counts.result}\x1b[0m\x1b[32m/\x1b[0m\x1b[35m${counts.source}\x1b[0m\x1b[32m icons!`);
}

console.debug('\x1b[0m');
