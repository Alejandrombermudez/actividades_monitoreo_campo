# actividades_monitoreo_campo

App de campo de Amazonía Emprende para llevar, por **lote y núcleo forestal**, las
**actividades** que se hacen, los **insumos** que consumen, **quiénes** las hicieron
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

## 2026-11-24: solo el registro de campo

La app se dejó en lo que hace el ingeniero en el potrero: **registrar qué se hizo, dónde, con qué
insumos y quiénes**. Salieron el resumen de gasto, «Lotes y núcleos», el inventario (saldos,
traslados, por aceptar) y los jornales y su valor: eso se lleva en la intranet. El título BODEGA ya no
aparece en la entrada.

Migración de la base: `Intranet-AE/docs/sql/migration_campo_registro_v2.sql`. **La app funciona sin
ella**: llama primero `campo_datos_v2` / `campo_guardar_registro_v2` y, si no existen, usa las de
siempre y escribe quiénes trabajaron y los insumos «otro» en la nota del registro.

## Cómo se entra: una sola vez

Se elige el título (SIEMBRA o MONITOREO) y se escribe su clave, que se administra en la intranet
(Administrativa → App de campo). La primera entrada necesita señal. **Después la app no vuelve a sacar
a nadie**: solo sale con *Cerrar sesión* (menú ⋯), que antes de salir dice lo que aplica en ese momento:

- Lo que no se ha enviado **no se borra** al cerrar sesión: queda en el celular, en una cola por título,
  y se envía al volver a entrar **con el mismo título** y con señal.
- Sin señal no se puede volver a entrar: hasta tenerla, no se registra nada.
- Lo único que sí pierde lo pendiente es borrar los datos del navegador o desinstalar la app.

Si la oficina cambia la clave del título, la base deja de aceptar el token viejo, pero la app **no cierra
la sesión**: sigue registrando y muestra arriba un campo para escribir la clave nueva y enviar.

## Cómo se registra

1. **¿Dónde?** Fecha, predio, lote y los núcleos tocados en el mapa. Al marcar aparece un aviso con
   cuáles quedaron marcados, para no llevarse uno de más o el vecino.
2. **¿Qué se hizo?** Al elegir una actividad la lista se recoge. *＋ Otra actividad* la vuelve a abrir;
   desde ahí ya no se recoge sola y aparece *Recoger la lista*.
3. **Insumos.** Salen los que suele llevar esa actividad (`INSUMOS_DE` en `index.html`, por categoría
   del catálogo); se escribe la cantidad solo en lo que se usó. *＋ Otro insumo* abre la lista completa y,
   si no está, *Otro* para escribir cuál y su unidad. Ya no se elige bodega ni se mira el saldo: la base
   anota el consumo en la bodega del proyecto del predio y la oficina concilia.
4. **¿Quiénes?** La lista de trabajadores de campo que carga la oficina. Mientras esté vacía, se
   escriben los nombres.

Predio, lote, actividades y cuadrilla **se quedan elegidos** entre un registro y otro (y al volver a
abrir la app): lo normal es pasar semanas en lo mismo. Al guardar se limpian solo núcleos, cantidades y
nota. *Lo registrado* lista lo guardado por día; tocar un registro lo abre para editarlo o borrarlo.

El monitoreo de lo sembrado (título MONITOREO) sigue igual y todavía se guarda solo en el celular.

### El mapa

Es la cartografía del SIG que baja de la base, dibujada con SVG: **sin mapas de internet, funciona sin
señal**. Cada núcleo lleva su número. En el celular arranca acercado para que un núcleo se pueda tocar
y se arrastra de lado; *Ver lista* muestra los números en botones por si dos núcleos quedan pegados.

## Cómo se ve

Fondo hueso con manchas suaves de salvia y ámbar, superficies de vidrio, Poppins con Fraunces en los
títulos (como la intranet), listas sin bordes (filas separadas por una línea fina) y el ámbar para lo
que se toca. Nada por debajo de 44 px: se usa de pie y con las manos sucias.

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
2. **Subir el número de `VERSION` en [`sw.js`](sw.js)** (`ae-actividades-v5` → `ae-actividades-v6`).
   Es el único paso fácil de olvidar y el que hace que el cambio llegue: sin eso, los
   celulares siguen abriendo la copia guardada.
3. Empujar a `main`. Vercel despliega solo.

### Qué ve la gente

Nadie tiene que desinstalar ni reinstalar nada. Además, en el menú ⋯ está **Actualizar la app**: busca la versión nueva en ese momento y, si hay, la activa y recarga (lo pendiente por enviar no se pierde). Al cambiar `VERSION` en `sw.js`, cambiar también `APP_VERSION` en `index.html`: es la que se muestra en el menú. Al abrir la app, el navegador detecta el
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

La app trae su propio botón: **⤓ Instalar** arriba (y en la pantalla de entrada y en el menú ⋯).
En Android con Chrome abre el instalador; en iPhone, o si el navegador no lo ofrece, explica los
pasos. Desaparece cuando la app ya está instalada. A mano:

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
