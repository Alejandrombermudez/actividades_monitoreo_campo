/* Genera la versión publicable de la app en dist/, con config.js (dirección y key pública de la
 * base) armado desde variables de entorno. Así la key no queda escrita en este repositorio,
 * que es público. Lo corre Vercel en cada despliegue (vercel.json → buildCommand).
 *
 *   Variables (Vercel → Settings → Environment Variables):
 *     SUPABASE_URL       https://<proyecto>.supabase.co
 *     SUPABASE_ANON_KEY  la key pública «anon» (NUNCA la service_role)
 *
 *   En el PC, para probar con `python -m http.server`:
 *     node generar-config.mjs --local           escribe ./config.js (está en .gitignore)
 *   Si las variables no están puestas, las toma de ../Intranet-AE/.env (NEXT_PUBLIC_SUPABASE_*).
 */
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs'

const local = process.argv.includes('--local')
let url = process.env.SUPABASE_URL
let key = process.env.SUPABASE_ANON_KEY

if ((!url || !key) && local && existsSync('../Intranet-AE/.env')) {
  for (const l of readFileSync('../Intranet-AE/.env', 'utf8').split(/\r?\n/)) {
    const m = l.match(/^NEXT_PUBLIC_SUPABASE_(URL|ANON_KEY)=(.*)$/)
    if (m && m[1] === 'URL') url ||= m[2].replace(/^["']|["']$/g, '')
    if (m && m[1] === 'ANON_KEY') key ||= m[2].replace(/^["']|["']$/g, '')
  }
}
if (!url || !key) {
  console.error('Faltan SUPABASE_URL y SUPABASE_ANON_KEY. Ponlas en Vercel → Settings → Environment Variables.')
  process.exit(1)
}
// La service_role abre toda la base: si alguien la pega aquí por error, no se publica.
try {
  const rol = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role
  if (rol !== 'anon') { console.error(`La key es de rol «${rol}». Aquí va la key anon (pública), nunca la service_role.`); process.exit(1) }
} catch { /* key en otro formato: se deja pasar */ }

const config = `/* Generado por generar-config.mjs al desplegar. No editar. */\nwindow.AE_CONFIG = ${JSON.stringify({ supabaseUrl: url, supabaseAnonKey: key })};\n`

if (local) {
  writeFileSync('config.js', config)
  console.log('config.js escrito (local).')
} else {
  const ARCHIVOS = ['index.html', 'sw.js', 'actualizar.js', 'manifest.json', 'icon-180.png', 'icon-192.png', 'icon-512.png']
  rmSync('dist', { recursive: true, force: true })
  mkdirSync('dist')
  for (const a of ARCHIVOS) cpSync(a, `dist/${a}`)
  writeFileSync('dist/config.js', config)
  console.log('dist/ listo con', ARCHIVOS.length + 1, 'archivos.')
}
