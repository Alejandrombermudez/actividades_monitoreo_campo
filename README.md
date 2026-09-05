# actividades_monitoreo_campo

App de campo de Amazonía Emprende para llevar, por **lote y núcleo forestal**, las
**actividades** que se hacen, los **insumos** que consumen, el **inventario de las bodegas**
y el **monitoreo de lo sembrado**. Un solo sitio, sin build, que se instala en el celular
y funciona sin señal.

Salió del repositorio [`insumos_aves`](https://github.com/Alejandrombermudez/insumos_aves)
—donde vivía en la ruta `/insumos/` junto a las apps de aves y de árboles semilleros— para
tener su propio link y su propio despliegue.

> **Es un demo.** No está conectado a nada (ni Supabase ni a otra app). Guarda todo en el
> navegador (`localStorage`). Pensado para que el equipo lo pruebe, lo entienda y proponga
> ajustes.

## Cómo se entra: por título, no por persona

Al abrir aparece una pantalla para elegir **con qué título entras** (sin contraseña; es un
demo local). No son usuarios con nombre propio: son el **cargo o la actividad** que alguien
está haciendo ese día, para que el mismo celular sirva aunque cambie quién lo carga.

| Título | Ve |
|---|---|
| **BODEGA** | Solo el inventario de su bodega (Recepción): sus compras, sus traslados y su bandeja "Por aceptar". |
| **SIEMBRA** | Resumen, lotes y núcleos, registros de campo, inventario de sus bodegas (Piloto Biodiversa y Ley del Árbol) y configuración. |
| **MONITOREO** | Lo mismo que Siembra, más el módulo de monitoreo de lo sembrado. Su bodega es el Vivero. |

**No hay título de coordinación.** Nadie "ve todo" por cargo. La configuración —lotes,
catálogo de insumos, valor del jornal, bodegas y títulos— queda en **Siembra** y
**Monitoreo**, que son los que arman esa información. Un título sin bodega asignada cae en
la vista general del inventario (la matriz insumo × bodega), que era el único caso que la
necesitaba.

Los títulos se gestionan en **Configuración → Títulos de acceso**. El botón **"Cambiar"**
(arriba) cierra la sesión y vuelve a la pantalla de entrada.

> **Nota (multi-dispositivo):** como el demo es local, los datos y las sesiones viven en el
> equipo donde se abre; **no se sincronizan entre celulares/PCs**. Para "cada uno en su
> dispositivo con datos en vivo" se necesita la versión conectada (backend). En un mismo
> equipo (o tablet compartido) el flujo de sesiones y aceptación funciona completo.

## Cómo se registra un día de campo

La pantalla sigue el orden en que pasan las cosas en el potrero, en cuatro pasos:

1. **¿Dónde se trabajó?** — se elige el lote y se **tocan los núcleos en el mapa**. Los que se
   van marcando aparecen listados debajo, y se quitan tocándolos otra vez (en el mapa o en su
   ficha). Debajo del mapa hay una lista de números plegada, por si dos núcleos quedan muy
   pegados para acertarle con el dedo.
2. **¿Qué se hizo?** — se marcan **una o varias** actividades (ver abajo).
3. **¿Qué insumos se gastaron?** — puede que ninguno.
4. **¿Cuánta gente y cuánto trabajo?** — personas, jornales y valor del jornal.

Al guardar, el registro aparece en la lista **Lo registrado**, abajo. Al tocarlo se despliega
con todo el detalle y desde ahí se edita o se borra.

### El mapa

Es cartografía real del SIG dibujada con SVG puro: **sin mapas de internet, funciona sin
señal**. Cada núcleo lleva **su número encima**, las áreas de restauración van de fondo y el
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

- **Lotes y núcleos:** cada lote (número, nombre, rango de núcleos de referencia, ej. `1-25`).
- **Registro de campo:** fecha · lote · **actividades** · **núcleos trabajados** ·
  **insumos consumidos** (varios por registro, en su unidad real) · personas · jornales.
  **Rendimiento = núcleos ÷ jornales**.
- **Actividades:** Guadaña · Preparación (trazado, ahoyado, control químico, encalado) ·
  Siembra (siembra, resiembra, fertilización, fertirriego, plateo) · Cerramiento ·
  Transporte · Control sanitario. La unidad de trabajo es **núcleos**.
- **Insumos** (catálogo del piloto, editable, con presentación): combustible, cal dolomita,
  fertiorgánico, fertilizante químico, glifosato, Becano, Dropex, Hormitek, avena
  hormiguera, postes/alambre/grapas.
- **Monitoreo de lo sembrado:** especie observada por núcleo y fecha, estado, rango de
  altura, observaciones y foto opcional. Export a CSV.
- **Resumen:** gasto total y por lote (mano de obra vs. insumos), gasto/núcleo, rendimiento
  y costo por actividad, insumos consumidos, y —al filtrar por un lote— el reparto de
  insumo y costo por núcleo.

Los registros guardados con **una sola** actividad (el formato anterior) se convierten solos
al abrir la app o al importar un respaldo viejo: nada de lo ya registrado se pierde.

## Inventario y bodegas (stock en vivo)

- **Bodegas y responsables** (editables en Configuración): Recepción (Bodega), Piloto
  Biodiversa (Siembra, marcada como *bodega de campo*), Vivero (Monitoreo), Ley del Árbol
  (Siembra).
- **Dos acciones:** **➕ Registrar compra** (entrada del proveedor) y **📤 Enviar traslado**
  (entre bodegas).
- **Factura / soporte obligatorio:** cada compra exige la **factura** y cada traslado el
  **soporte de entrega** (foto o PDF), que queda enlazado en el kardex. *(En el demo el
  archivo se guarda en el navegador; en la versión conectada iría a Supabase Storage.)*
- **Traslados con aceptación:** el traslado queda **pendiente** y le aparece al responsable
  de la bodega destino en su bandeja "Por aceptar". El stock se mueve **solo cuando lo
  acepta**.
- **Integración clave:** la bodega de campo (Piloto Biodiversa) **descuenta en vivo lo
  consumido en los registros de campo**: *recibido − consumido = saldo* por insumo, con
  faltantes en rojo.

## Estructura

```
index.html      la app entera (HTML + CSS + JS planos, sin build ni dependencias)
manifest.json   PWA
sw.js           service worker: guarda la app para uso sin internet
actualizar.js   avisa con un botón cuando hay una versión nueva
icon-180.png    íconos
icon-192.png
icon-512.png
```

## Publicar un cambio

1. Editar `index.html`.
2. **Subir el número de `VERSION` en [`sw.js`](sw.js)** (`ae-actividades-v2` → `ae-actividades-v3`).
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

Sitio estático, sin configuración. **Add New → Project**, importar este repositorio y
desplegar.

- Framework Preset: **Other**
- Build Command: *(vacío)*
- Output Directory: *(vacío / raíz)*

Cada push a `main` vuelve a desplegar.

## Instalarla en el celular

- **Android (Chrome):** abrir el link → menú ⋮ → *Añadir a pantalla de inicio*.
- **iPhone (Safari, no Chrome):** abrir el link → botón Compartir → *Añadir a pantalla de inicio*.

Después de abrirla una vez **con** internet queda guardada en el dispositivo y funciona sin
señal, que es lo normal en campo.

## Correrlo en el PC

Tiene que servirse por HTTP desde la **raíz** del repositorio (el service worker vive en
`/sw.js`). Abrir el archivo con doble clic no activa el modo sin conexión.

```bash
python -m http.server 5700
```

Luego entrar a `http://localhost:5700`. El modo sin conexión solo se activa en `localhost`
o en el sitio desplegado con HTTPS.

## Datos y privacidad

Nada sale del dispositivo. No hay servidor, ni cuentas, ni analítica. La pantalla de entrada
no es control de acceso real: solo separa lo que ve cada título en el demo.

- Los datos persisten en `localStorage` de ese navegador.
- **Respaldo / Importar (JSON)** en la cabecera para mover los datos a otro equipo. Las
  fotos del monitoreo no viajan en el respaldo: se quedan en el dispositivo donde se tomaron.
- **Exportar CSV** (Configuración) para abrir en Excel.

## Si el demo se aprueba

Reconstruir como app real (Vite + PWA, como `app_campo/`) conectada al proceso: los
núcleos, actividades e insumos serían la etapa **Ejecución** sobre `core`/`siembra`, y el
consumo de insumos cruzaría con el plan de siembra y el vivero (demanda vs. gasto real).

---

Amazonía Emprende — Restauramos la biodiversidad de los ecosistemas con especies forestales nativas.
