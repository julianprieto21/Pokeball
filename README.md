![image](https://camo.githubusercontent.com/93c855ae825c1757f3426f05a05f4949d3b786c5b22d0edb53143a9e8f8499f6/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4a6176615363726970742d3332333333303f7374796c653d666f722d7468652d6261646765266c6f676f3d6a617661736372697074266c6f676f436f6c6f723d463744463145)
![image](https://camo.githubusercontent.com/6cf9abe9d706421df40ff4feff208a5728df2b77f9eb21f24d09df00a0d69203/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f547970655363726970742d3030374143433f7374796c653d666f722d7468652d6261646765266c6f676f3d74797065736372697074266c6f676f436f6c6f723d7768697465)

## Mi primer projecto en Javascript/Typescript. Una imitación lo mas fiel posible de los juegos de pokémon de las primeras generaciones.
Cuando iba al colegio tuve una epoca donde jugaba bastante a estos juegos y la verdad siempre me gustaron. 
Al estar en busqueda de un nuevo proyecto para hacer se me ocurrio realizar un juego donde pueda recrear una batalla Pokemon como en los juegos.

Esto primero lo comence a realizar en Python utilizando Pygame, lo que me llevo a indagar en la programacion orientada a objetos. Pero llegue a un momento donde mis conocimientos
sobre esta libreria no fueron suficientes para lograr lo que queria, por lo que abandone el proyecto por varios meses.

Hace unas pocas semanas me interese por aprender Javascript, y se me ocurrio replicar lo que habia hecho anteriormente pero en este lenguaje, y como eso me 
permitiria compartir el juego mediante una pagina web, comence a programarlo entusiasmadamente.
De esta manera aprendi las bases de Javascript en POO y tambien el uso de diversas libreria para animaciones, sonido, etc.

Al llegar a un punto en la programacion de las batallas, me dió curiosidad de ver si podia agregarle la funcionalidad de poder controlar un personaje (con en los juegos originales),
el cual sea capaz de moverse por un mapa y que ciertas acciones activen la batalla.

## Mapa, Jugador y colisiones
![image](https://user-images.githubusercontent.com/114876710/227333555-c4d536fd-8bf0-4803-8fbf-b93158fcea2e.png)

El **mapa** princiapal fue realizado con el programa Tiled. Luego de ver algunos tutoriales pude crear una pequeña isla para darle libertad al personaje.

Para animar al **jugador** tuve que aprender ciertos mecanismos comunes para lograr por ejemplo que al mover el fondo se simule que la camara se desplazaba junto al jugador al apretar las teclas WASD.

Las **colisiones** fueron un poco mas complicadas. Utilizando una funcion del programa Tiled, logre descargar un archivo .json que contiene un array con todos los tiles del mapa,
y que mercara cuales tiles eran una colision. Por lo que luego en el codigo reformatie el array para que cuando el jugador se mueva, se itere sobre este y verifique si el 
jugador esta colisionando con alguno de los tiles de colision.

## Batallas, logica y animaciones
![image](https://user-images.githubusercontent.com/114876710/227333397-b0b7041a-43d5-4dc4-b046-f4598bb46cfd.png)

Los primero que realice fue la logica de las batallas. Entonces cree las clases para los pokemones y para los moviemientos respectivamente. Le di los atributos necesarios a cada una
 y les brinde los metodos que usarian en un futuro. Luego me encargue de investigar todas las formulas y valores que se utilizan para por ejemplo calcular el daño de un ataque o 
 las estadisticas de un pokemon.
 
 Luego, comence a crear lo visual usando HTML Canvas y algunas librerias como GSAP para las animaciones.
 
 ## Informacion y estadisticas
 Para recolectar la informacion necesaria de los pokemones y de los movimientos utilice una API de Pokemon https://pokeapi.co/.
 
 Para el tema de los sprites de los pokemones tuve que descargarlas usando un algortimo en Python el cual tambien las redimensionaba para que se vieran mas grandes y mantuvieran 
 la misma calidad. Esto es debido a que si redimensionaba las imagenes extraidas mediante codigo de la API, estas se volvian muy borrosas.

## Contacto
[![image](https://camo.githubusercontent.com/c873e86c083c071c7fd068a17ab549b763fad7088681d6d831f68b32a4305b3a/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f776562736974652d3030303030303f7374796c653d666f722d7468652d6261646765266c6f676f3d41626f75742e6d65266c6f676f436f6c6f723d7768697465)](https://julianprieto21.github.io/Portfolio-Website/)
[![image](https://camo.githubusercontent.com/a80d00f23720d0bc9f55481cfcd77ab79e141606829cf16ec43f8cacc7741e46/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f4c696e6b6564496e2d3030373742353f7374796c653d666f722d7468652d6261646765266c6f676f3d6c696e6b6564696e266c6f676f436f6c6f723d7768697465)](https://www.linkedin.com/in/julian-prieto-809397253/)
[![image](https://camo.githubusercontent.com/571384769c09e0c66b45e39b5be70f68f552db3e2b2311bc2064f0d4a9f5983b/68747470733a2f2f696d672e736869656c64732e696f2f62616467652f476d61696c2d4431343833363f7374796c653d666f722d7468652d6261646765266c6f676f3d676d61696c266c6f676f436f6c6f723d7768697465)](mailto:prietojulian2003@gmail.com)
