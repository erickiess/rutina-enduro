# Rutina gym enduro — mapa

- App: `index.html` (todo en un archivo, ~930 líneas) + `sw.js` (subir versión `enduro-gym-vN` en cada cambio) + manifest. Publicada en https://erickiess.github.io/rutina-enduro/ (repo público en cuenta personal erickiess).
- Probar: preview `enduro-gym` (`.claude/launch.json`, node serve.js, puerto 8080).
- Secciones de `index.html` (Grep): `/* ============ Estado` (S, save, sync), `// ---------- Sync a GitHub`, `function planWeek` (planificador), `function heroCard` / `function otroSheet` (pantalla Hoy), `// ---------- Por qué toca esto` (whyTxt, kindParts), `// ---------- Coach` (insights, ayudaSheet, cambiarSheet), `function dayOptions`, `function renderAjustes`, `case '` (acciones de botones).
- Constantes: `SES` (gym A/B/C), `ACT` (moto, bici, descanso, OTRO), `HOW` (cómo se hace cada ejercicio).

## Datos reales de Erick
La app sube `historial.json` al repo privado `erickiess/rutina-enduro-datos`. Para leerlo:
`git -C datos pull` (clon en `datos/`, ignorado por git). Si no existe: `git clone https://github.com/erickiess/rutina-enduro-datos datos`.
Claves útiles: `log[fecha]` (type A/B/C/OTRO/REST/MOTO, status, ex con kg, OTRO: stretch, cans 1-5, nota), `bici[fecha]`, `moto[fecha]` (zonas 1-5), `block`.

No leer: `reports/`, `research_notes/`, `img/`.
