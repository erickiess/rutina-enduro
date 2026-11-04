# Pendientes: que la app aprenda qué sirve y qué no

Objetivo: aguantar más tiempo en la moto, con la rutina variando según lo que se hace y lo que da resultado.
Cada etapa va en su propia sesión nueva, una a la vez, y termina con commit y push.
Antes de cada una, mirar el cupo con `get_usage`. Sobre 85 %, no arrancar.

Reglas para todas las etapas:
- Primero leer `CLAUDE.md` (el mapa) y bajar los datos reales a `datos/`.
- Nunca afirmar "esto te sirve" sin datos suficientes: mostrar cuántas salidas faltan.
- Los cambios automáticos de la rutina se muestran con su motivo y se pueden deshacer.
- Subir la versión de `sw.js`, probar en el preview `enduro-gym` y actualizar `RESUMEN.md` y el mapa.
- Este repo es público: no escribir acá datos personales ni resultados de Erick.

## Etapa 1: medir el aguante (Sonnet) — HECHA, simplificada (v24: sólo `terreno` opcional; Erick descartó anotar antebrazo/paradas). La etapa 2 compara salidas por horas y terreno.

Hoy la moto se anota con molestias de 1 a 5, pero no cuánto se aguantó, que es el objetivo.

Prompt: "Seguí la etapa 1 de PENDIENTES.md. En `motoSheet` sumá, todos opcionales y sin romper las salidas viejas: minutos hasta que se cargó el antebrazo (`pumpMin`), si tuvo que parar por cansancio o por el antebrazo (`paro`: no, una vez, varias), tipo de salida (`dureza`: tranquila, normal, dura) y cómo llegó (`llegue`, de 1 a 5, con sueño y resaca en mente). Hacé que Horas se note más, porque sin duración no se puede comparar. Documentá las claves nuevas en CLAUDE.md."

## Etapa 2: pantalla "Qué te sirve" — HECHA (v26, sin pumpMin/paro/dureza/llegue; ver CLAUDE.md, separador "Qué te sirve")

Prompt: "Seguí la etapa 2 de PENDIENTES.md. En Progreso agregá 'Qué te sirve', en una sección nueva con separador. Por ejercicio: % de series hechas en las últimas 4 semanas, tendencia de carga y etiqueta (viene bien, estancado, casi nunca lo hacés, siempre 'No llegué'), con los motivos anotados. Por salida de moto: aguante y molestias contra lo hecho en los 7 días previos (minutos de bici, gyms, días desde el último agarre fuerte), comparando salidas de duración y dureza parecidas. Hasta tener 6 salidas comparables, mostrar sólo 'faltan N salidas'. Probar con datos reales y con datos inventados de 10 salidas."

## Etapa 3: reglas que varían la rutina (Opus) — SIGUE ESTA

Diseño (manda sobre el prompt viejo de abajo). Sólo usa datos que ya se anotan: series, motivos, sensación y kg del gym; horas, molestias y terreno de la moto; `cans` de los días OTRO. Nada de preguntas nuevas.

Se evalúa al abrir Hoy o Progreso, nunca con una sesión en curso. Toda regla avisa en Hoy con motivo y botón Deshacer, y se ve en Progreso y en la sesión.

| Regla | Condición | Cambio | Termina |
|---|---|---|---|
| `sinhacer` (equipo) | Últimas 3 veces con 0 series, y "No hay equipo" en 2 o más de esas 3. Sólo si tiene parecido en `ALT` | Parecido fijo: el último usado; si no hay, el primero sin peso; si no, el primero. Su peso va en `weights[alt]` | Sólo si se deshace |
| `sinhacer` (tiempo) | Últimas 3 veces con 0 series, "Sin tiempo" en 2 o más, y es `core` | Pasa a "Si te da el tiempo", con el motivo a la vista | 4 semanas |
| `carga` | Etiqueta de `qsEjercicio`: 2 veces seguidas "No llegué" o 3 sesiones con la misma carga sin que sobre. No actúa en descarga ni en modo vuelta | Próxima sesión: 10 % menos, una sola vez | Al usarla o a las 4 semanas |
| `zona` | Arm pump, lumbar u hombros en 4 o más en las últimas 2 salidas, la última hace 21 días o menos | Sube a principal el trabajo de esa zona (arm pump: wrist roller y extensores; lumbar: suitcase y pallof; hombros: rotación externa). Pide revisar el setup | 4 semanas |
| `liviana` | Moto de hace 2 días o menos con alguna molestia en 4 o más, o día OTRO de hace 2 días o menos con `cans` 4 o más. No actúa en descarga ni en modo vuelta | El check-in arranca con la versión liviana prendida y dice por qué | Al usarla o a los 2 días de la señal |
| `dolor` | Motivo "Molestia o dolor" 2 veces en las últimas 3 (`motivosRep`) | Con peso: 10 % menos la próxima vez. Sin peso: propone un parecido. Siempre recomienda consultar si sigue | Al usarla o a las 4 semanas |

Límites comunes:
- Ninguna regla sube cargas: `suggestKg` toma el menor entre lo que iba a sugerir y el 10 % menos. En descarga, modo vuelta o día liviano no se suma la baja: queda pendiente para la próxima sesión normal.
- Deshacer: esa regla no insiste con ese ejercicio (o zona) por 4 semanas. Después hacen falta datos nuevos, porque lo anterior a la última vez que actuó ya no cuenta. `liviana` no es por ejercicio: se calla por esa señal, y una señal nueva vuelve a avisar.
- El aviso de molestia repetida de "Cómo venís" sigue aunque se deshaga la regla `dolor`.
- Una baja de carga ya usada no se deshace: es lo que se levantó de verdad, y la progresión sigue desde ahí.
- Sin motivo anotado no se adivina: Progreso lista esos ejercicios como "Esperando motivo".
- Registro en `S.reglas` (lista, sube a `historial.json`): `id, regla, ej, desde, vence, hasta, estado` (`activa`, `fin`, `deshecha`), `aplicada`, `motivo`, `cambio`, y según el caso `tipo`, `alt`, `kgId`, `de`, `a`, `visto`. Sin texto libre de las notas.
- Rotar variantes tras 4 semanas completas: **no entra en esta etapa**. Hace falta decidir contra qué variante rotar cada ejercicio y cómo comparar pesos. Queda para después de la etapa 4, con datos.

Prompt viejo, como referencia:

Prompt: "Seguí la etapa 3 de PENDIENTES.md. Diseñá e implementá reglas visibles y reversibles, por ejemplo:
- Ejercicio sin hacer 3 veces seguidas: si el motivo es falta de equipo, proponer un parecido de `ALT` como fijo; si es falta de tiempo, dejarlo como extra.
- Siempre 'No llegué' o la misma carga 3 sesiones: bajar 10 % o cambiar repeticiones o tiempo.
- Lumbar, hombros o arm pump en 4 o más en 2 salidas seguidas: subir de prioridad el trabajo de esa zona, y revisar el setup de la moto.
- Cómo llegó bajo o cansancio alto: sugerir la versión liviana.
- Cuatro semanas haciendo todo: rotar variantes para que no se estanque.
Cada regla muestra por qué actuó. Registrar en el historial qué regla actuó y cuándo, para poder evaluarla después."

## Etapa 4: revisión mensual con Claude (Opus, a partir de 6-8 semanas de datos)

Prompt: "Seguí la etapa 4 de PENDIENTES.md. Revisá `datos/historial.json` a fondo: qué mejoró el aguante, qué reglas ayudaron y qué conviene sacar. Separá lo que muestran los datos de lo que es opinión, y ajustá la rutina."
