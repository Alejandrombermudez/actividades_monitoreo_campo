# actividades_monitoreo_campo

App de campo de Amazonía Emprende para llevar, por **lote y núcleo forestal**, las
**actividades** que se hacen, los **insumos** que consumen, el **inventario de las bodegas**
y el **monitoreo de lo sembrado**. Un solo sitio que se instala en el celular y funciona sin
señal.

Salió del repositorio [`insumos_aves`](https://github.com/Alejandrombermudez/insumos_aves)
—donde vivía en la ruta `/insumos/` junto a las apps de aves y de árboles semilleros— para
tener su propio link y su propio despliegue.

> **Desde el 2026-10-14 está conectada a la base** (Supabase del ecosistema). Hasta entonces
> era un demo que guardaba todo en el navegador.
>
> - Los **lotes y núcleos** son los del SIG: las zonas que la oficina confirmó como lote de
>   siembra después de campo, con la nucleación que se cargó en la intranet.
> - Los **insumos** son una lista cerrada (el catálogo de la oficina) y se **descuentan de una
>   bodega**: las compras entran en la intranet con la factura electrónica de la DIAN y la oficina
>   reparte a las bodegas de cada proyecto.
> - Lo registrado va a `siembra.registros_actividad` y el consumo al kardex
>   (`inventario.movimientos`). La intranet lo ve en Administrativa → App de campo.
> - El **monitoreo de lo sembrado** todavía se guarda solo en el celular.
>
> La base y sus funciones: `Intranet-AE/docs/sql/migration_financiero_inventario.sql`.

## Cómo se entra: por título y clave

Al abrir aparece una pantalla para elegir **con qué título entras** y escribir su **clave**.
No son usuarios con nombre propio: son el **cargo o la actividad** que alguien está haciendo
ese día, para que el mismo celular sirva aunque cambie quién lo carga.

| Título | Ve |
|---|---|
| **BODEGA** | Solo el inventario de su bodega (Recepción): lo que tiene, lo que le llega y lo que envía. |
| **SIEMBRA** | Resumen, lotes y núcleos, registros de campo e inventario de sus bodegas (Conexión Biodiversa y Ley del Árbol). |
| **MONITOREO** | Lo mismo que Siembra, más el monitoreo de lo sembrado. Su bodega es el Vivero. |

Los títulos, sus claves y sus bodegas se crean en la **intranet → Administrativa → App de
campo**. Nacen sin clave: hasta que la oficina se la pone, nadie entra con ellos. Cambiar la
clave saca de la app a los celulares que entraron con la anterior; cinco claves equivocadas
seguidas bloquean el título 15 minutos.

La primera entrada necesita señal. Después la sesión dura 90 días y la app trabaja sin señal
con lo último que bajó.

### Sin señal

- Lo que se registra entra a una **cola** en el celular, se ve de una vez en la lista
  (marcado *sin enviar*) y descuenta del saldo de la bodega en pantalla.
- La cola se envía sola al volver la señal, al volver a abrir la app y cada dos minutos. El
  botón de estado de la cabecera dice si está *al día*, cuántos cambios faltan por enviar o
  si alguno tuvo problema; tocarlo sincroniza.
- Si la base rechaza un cambio (por ejemplo, descontar de una bodega que no es del título), no
  se pierde: queda en Configuración con el motivo y los botones *Reintentar* y *Descartar*.
- Cada registro lleva un identificador que pone el celular: reenviarlo con señal intermitente
  no lo duplica.
- Al salir del título con cambios sin enviar, quedan guardados y se envían al volver a entrar
  con ese mismo título.

## Cómo se registra un día de campo

La pantalla sigue el orden en que pasan las cosas en el potrero, en cuatro pasos:

1. **¿Dónde se trabajó?** — se elige el lote y se **tocan los núcleos en el mapa**. Los que se
   van marcando aparecen listados debajo, y se quitan tocándolos otra vez (en el mapa o en su
   ficha). Debajo del mapa hay una lista de números plegada, por si dos núcleos quedan muy
   pegados para acertarle con el dedo.
2. **¿Qué se hizo?** — se marcan **una o varias** actividades (ver abajo).
3. **¿Qué insumos se gastaron?** — puede que ninguno. Se elige de qué bodega salen y, para
   cada insumo, la cantidad; la unidad y el saldo de la bodega se ven al lado.
4. **¿Cuánta gente y cuánto trabajo?** — personas, jornales y valor del jornal.

Al guardar, el registro aparece en la lista **Lo registrado**, abajo. Al tocarlo se despliega
con todo el detalle y desde ahí se edita o se borra.

### El mapa

Es la cartografía del SIG que baja de la base (el lote de siembra y su nucleación), dibujada
con SVG puro: **sin mapas de internet, funciona sin señal**. Cada núcleo lleva **su número
encima** (el de la columna «Nucleo» del shapefile del SIG; si falta o se repite, se numeran en
orden), el contorno del lote va de fondo y el
botón **📍 ¿Dónde estoy?** ubica a la persona con el GPS del celular si está dentro del lote.

En el celular el mapa completo dejaría cada núcleo en 13 px —imposible de tocar y con el
número ilegible—, así que **arranca acercado** lo justo para que un núcleo mida unos 26 px y
el mapa se **arrastra de lado**. Los botones **− / ＋** cambian el acercamiento a mano.

### Varias actividades en un mismo registro

Trazado, ahoyado y plateo casi siempre se hacen **el mismo día sobre los mismos núcleos**,
así que un registro admite varias. Pero se marcan **una por una**, no en bloque: cualquiera
puede no haberse hecho —la ahoyadora no encendió, alcanzó el tiempo para una más— y eso es
justo lo que el registro tiene que poder decir.

Cuando un registro trae varias, nadie midió cuánto costó cada una por separado. En el resumen
**Rendimiento y gasto por actividad** los jornales y el gasto se **reparten en partes iguales**
entre ellas: esas filas quedan marcadas con **≈** y hay una nota debajo. Los totales de la
tabla siguen cuadrando con el gasto real.

## Qué registra

- **Lotes y núcleos:** los lotes de siembra del SIG con su nucleación (solo se ven: se
  administran en la intranet → SIG → Nucleación).
- **Registro de campo:** fecha · lote · **actividades** · **núcleos trabajados** ·
  **insumos consumidos** (varios por registro, en su unidad real) · personas · jornales.
  **Rendimiento = núcleos ÷ jornales**.
- **Actividades:** Guadaña · Preparación (trazado, ahoyado, control químico, encalado) ·
  Siembra (siembra, resiembra, fertilización, fertirriego, plateo) · Cerramiento ·
  Transporte · Control sanitario. La unidad de trabajo es **núcleos**.
- **Insumos**: el catálogo de la oficina (intranet → Administrativa → Insumos y bodegas). El
  costo de cada uno es el promedio de lo que se ha pagado en las facturas.
- **Monitoreo de lo sembrado:** especie observada por núcleo y fecha, estado, rango de
  altura, observaciones y foto opcional. Export a CSV. **Todavía solo en el celular.**
- **Resumen:** gasto total y por lote (mano de obra vs. insumos), gasto/núcleo, rendimiento
  y costo por actividad, insumos consumidos, y —al filtrar por un lote— el reparto de
  insumo y costo por núcleo.

## Inventario y bodegas

- **Bodegas**: Recepción (central), Conexión Biodiversa, Ley del Árbol y Vivero. Se crean en la
  intranet.
- **Las compras no se registran aquí.** Entran en la intranet con la factura electrónica de la
  DIAN y la oficina las reparte a las bodegas de los proyectos.
- **Traslados con aceptación:** lo que la oficina (o otra bodega) envía sale de su bodega de una
  vez y le aparece a la bodega destino en *Por aceptar*. Entra a su saldo cuando lo acepta.
- **Enviar traslado** desde el celular, con soporte de entrega opcional (foto o PDF).
- **Saldo** = lo recibido − lo enviado − lo gastado en los registros de campo. En rojo, un
  faltante: se gastó más de lo que figura recibido (falta registrar un envío, o hay que hacer un
  ajuste por conteo en la intranet).
- En cada registro de campo se elige **de qué bodega salen los insumos**. Por defecto, la del
  proyecto del predio.

## Cómo se ve, y por qué

La app entera va sobre **verde bosque profundo**, con las tarjetas en hueso flotando
encima y el **ámbar reservado para lo que se toca**. No es capricho: esto se abre a pleno
sol en un potrero, y una pantalla clara a brillo alto se lava. Sobre verde oscuro la
tarjeta clara es lo único que brilla y el ojo va directo a ella.

Reglas para no romperlo al editar:

- **Color:** sobre el verde se escribe en `--crema` y `--salvia`; dentro de una tarjeta se
  escribe en `--tinta` y `--verde`. Las clases que aparecen en los dos sitios (`.hint`,
  `.section-title`, `label`) llevan la versión clara por defecto y se corrigen dentro de
  `.card` / `.item` / `.table-wrap` / `.login-box` / `.modal-box`.
- **Toque:** nada por debajo de 44 px. Se usa de pie, con las manos sucias.
- **Contraste:** todo el texto pasa 4.5:1 contra su fondo real (3:1 el texto grande).
  Al cambiar un color de la paleta, revisar que siga cumpliendo.
- **Nada de `top` en píxeles escrito a mano.** La cabecera y las pestañas son un solo
  bloque pegajoso; en el celular la cabecera se va con el scroll y quedan solo las
  pestañas, usando el alto real que mide `ajustarTopbar()` en `--h-cabecera`.

## Estructura

```
index.html          la app entera (HTML + CSS + JS planos, sin dependencias)
config.js           dirección y key pública de la base — NO está en el repositorio:
                    lo genera generar-config.mjs al desplegar
generar-config.mjs  arma dist/ con config.js desde variables de entorno
vercel.json         le dice a Vercel que corra generar-config.mjs y publique dist/
manifest.json       PWA
sw.js               service worker: guarda la app para uso sin internet
actualizar.js       avisa con un botón cuando hay una versión nueva
icon-*.png          íconos
```

## Publicar un cambio

1. Editar `index.html`.
2. **Subir el número de `VERSION` en [`sw.js`](sw.js)** (`ae-actividades-v4` → `ae-actividades-v5`).
   Es el único paso fácil de olvidar y el que hace que el cambio llegue: sin eso, los
   celulares siguen abriendo la copia guardada.
3. Empujar a `main`. Vercel despliega solo.

### Qué ve la gente

Nadie tiene que desinstalar ni reinstalar nada. Al abrir la app, el navegador detecta el
`sw.js` nuevo y lo instala en segundo plano, pero **no lo activa por su cuenta**: se queda
esperando. `actualizar.js` lo detecta y muestra una barra arriba —*"Hay una versión nueva
de la app"*— con **Actualizar** y **Ahora no**. Solo al tocar Actualizar la app se recarga.

Que decida la persona es a propósito: recargar sola a mitad de un registro en campo sería
peor que mostrar la versión vieja un rato más. Si eligen "Ahora no", la actualización entra
la próxima vez que abran la app.

## Despliegue (Vercel)

Cada push a `main` vuelve a desplegar. `vercel.json` corre `node generar-config.mjs`, que arma
`dist/` con `config.js`. Para eso el proyecto de Vercel necesita dos variables
(**Settings → Environment Variables**, en Production y Preview):

| Variable | Valor |
|---|---|
| `SUPABASE_URL` | la dirección del proyecto de Supabase |
| `SUPABASE_ANON_KEY` | la key **anon** (pública). **Nunca la service_role**: el script la rechaza y el despliegue falla |

Sin esas dos variables el despliegue falla a propósito: es mejor que una app publicada que no
puede hablar con la base.

## Instalarla en el celular

- **Android (Chrome):** abrir el link → menú ⋮ → *Añadir a pantalla de inicio*.
- **iPhone (Safari, no Chrome):** abrir el link → botón Compartir → *Añadir a pantalla de inicio*.

Después de abrirla una vez **con** internet queda guardada en el dispositivo y funciona sin
señal, que es lo normal en campo.

## Correrlo en el PC

Tiene que servirse por HTTP desde la **raíz** del repositorio (el service worker vive en
`/sw.js`). Primero se genera `config.js` (toma la dirección y la key anon de
`../Intranet-AE/.env` si no están en el entorno):

```bash
node generar-config.mjs --local
```

```bash
python -m http.server 5700
```

Luego entrar a `http://localhost:5700`. El modo sin conexión solo se activa en `localhost`
o en el sitio desplegado con HTTPS.

## Datos y privacidad

- La app no lee tablas de la base: solo llama las funciones `inventario.campo_*`, que exigen el
  token que entrega la entrada con título y clave. La key pública (anon) no tiene permiso sobre
  ninguna tabla de inventario, finanzas ni registros.
- En el celular quedan: la sesión, la última copia de lo que bajó de la base, la cola de lo que
  falta por enviar y el monitoreo (con sus fotos en IndexedDB).
- **Respaldo (JSON)** en la cabecera descarga todo eso; **Exportar CSV** (Configuración) los
  registros, para Excel.
- Los datos del demo anterior (lo que se había guardado en el navegador antes de conectar la
  app) no se subieron: sus lotes e insumos no eran los del SIG ni los de la bodega. Siguen en el
  celular y se descargan desde Configuración.

---

Amazonía Emprende — Restauramos la biodiversidad de los ecosistemas con especies forestales nativas.
