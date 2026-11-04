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

## Etapa 1: medir el aguante (Sonnet) — SIGUE ESTA

Hoy la moto se anota con molestias de 1 a 5, pero no cuánto se aguantó, que es el objetivo.

Prompt: "Seguí la etapa 1 de PENDIENTES.md. En `motoSheet` sumá, todos opcionales y sin romper las salidas viejas: minutos hasta que se cargó el antebrazo (`pumpMin`), si tuvo que parar por cansancio o por el antebrazo (`paro`: no, una vez, varias), tipo de salida (`dureza`: tranquila, normal, dura) y cómo llegó (`llegue`, de 1 a 5, con sueño y resaca en mente). Hacé que Horas se note más, porque sin duración no se puede comparar. Documentá las claves nuevas en CLAUDE.md."

## Etapa 2: pantalla "Qué te sirve" (Opus para el diseño de las reglas, Sonnet para implementar)

Prompt: "Seguí la etapa 2 de PENDIENTES.md. En Progreso agregá 'Qué te sirve', en una sección nueva con separador. Por ejercicio: % de series hechas en las últimas 4 semanas, tendencia de carga y etiqueta (viene bien, estancado, casi nunca lo hacés, siempre 'No llegué'), con los motivos anotados. Por salida de moto: aguante y molestias contra lo hecho en los 7 días previos (minutos de bici, gyms, días desde el último agarre fuerte), comparando salidas de duración y dureza parecidas. Hasta tener 6 salidas comparables, mostrar sólo 'faltan N salidas'. Probar con datos reales y con datos inventados de 10 salidas."

## Etapa 3: reglas que varían la rutina (Opus)

Prompt: "Seguí la etapa 3 de PENDIENTES.md. Diseñá e implementá reglas visibles y reversibles, por ejemplo:
- Ejercicio sin hacer 3 veces seguidas: si el motivo es falta de equipo, proponer un parecido de `ALT` como fijo; si es falta de tiempo, dejarlo como extra.
- Siempre 'No llegué' o la misma carga 3 sesiones: bajar 10 % o cambiar repeticiones o tiempo.
- Lumbar, hombros o arm pump en 4 o más en 2 salidas seguidas: subir de prioridad el trabajo de esa zona, y revisar el setup de la moto.
- Cómo llegó bajo o cansancio alto: sugerir la versión liviana.
- Cuatro semanas haciendo todo: rotar variantes para que no se estanque.
Cada regla muestra por qué actuó. Registrar en el historial qué regla actuó y cuándo, para poder evaluarla después."

## Etapa 4: revisión mensual con Claude (Opus, a partir de 6-8 semanas de datos)

Prompt: "Seguí la etapa 4 de PENDIENTES.md. Revisá `datos/historial.json` a fondo: qué mejoró el aguante, qué reglas ayudaron y qué conviene sacar. Separá lo que muestran los datos de lo que es opinión, y ajustá la rutina."
