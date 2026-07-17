- Eliminar el doble toque en el menú -> no es cómodo y no es usable. Tocamos, leemos en voz alta y entramos. En PC (con ratón) si pasamos el cursor por arriba lee el nombre. (implementado parcialmente)
- Evitar que las banderas se repitan en rondas seguidas. Ej.: si ahora ha salido sudáfrica, que la siguiente no sea sudáfrica.
- Mantener los textos al mínimo, sustituir los textos que se pueda por emojis. Adaptarlo para niños en etapa de PRE-LECTURA.
- En "lluvia de banderas", no está leyendo la bandera que tiene que atrapar.
- En "lluvia de banderas", cuando atrapes la bandera, cambiala.
- En "lluvia de banderas", modifica la velocidad de caída para que sea ligeramente más lenta.
- En "cual es la diferente" siempre se repiten las mismas banderas.
- Cuando entras a cualquier minijuego, solo lee el título pero no el nombre del país.

---
- En @AdivinaJuegos.tsx, @ParejasJuego.tsx, cuando aciertas lee "cañon de confeti país". Tendría que decir: "acertaste".
- En @AdivinaJuegos.tsx, hacemos rondas de 10 banderas. En esa ronda, no se puede repetir ninguna bandera.
  - Cuando termine la ronda, diremos cuantos aciertos y cuantos fallos.
  - Posible fase 6: añadir un modo de repaso de las banderas que fallemos.
- En ParejasJuego.tsx, cuando entremos al juego, tendrá que decir "Selecciona las parejas de banderas".
- En ParejasJuego.tsx también permitiremos elegir de las banderas de abajo. Ahora mismo solo se puede seleccionar una arriba y su correspondiente abajo.
- En la celebración al finalizar un juego, diremos "Muy bien".

--- 
Fase 6 
- El "rasca" en el móvil no funciona.
- Añade algunos textos y títulos en los menús  y botones (muy sencillos) para los padres. Manten los emojis.

---
Fase 7.
- AnimalesJuego nunca termina. Se queda parado y no muestra la pantalla de fin (5 rondas).
- CucuJuego no funciona bien: la bandera está escondida detrás de un elemento y al pulsar ese, no pasa nada. Pulsas otro y te dice que la bandera estaba ahí.
- PuzleJuego muestra la misma mitad para completar el puzle que la que ya hay. Si tiene que dividir la bandera en AB , te enseña A y las opciones de abajo son A todas.

---
Fase 8.
- Sigue diciendo "confeti" en vez de "muy bien", al acertar en algunos juegos.
- En el juego de cucu la bandera siempre se esconde detrás del mismo emoji.
- En el juego de animales, lo ideal sería que cuando hiciera click en una bandera dijera su nombre.