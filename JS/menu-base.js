/* Menú base: los platos, bebidas, toppings y salsas que existen hoy en la tienda
   (Frontend-consumidor), con sus nombres, descripciones y precios originales.
   La página Menú solo puede MODIFICAR estos elementos: no se pueden crear ni borrar.
   Cada elemento tiene un id fijo; lo que cambia la cocina se guarda aparte (por id).
   Precio con tamaños (pizzas y bebidas): p es una lista, un precio por tamaño. */
window.TAZ_MENU_BASE=[
 {
  "id": "pizzas",
  "t": "Pizzas",
  "ico": "🍕",
  "tamanos": [
   "Personal",
   "Medium",
   "Familiar"
  ],
  "items": [
   {
    "id": "pizza-hawaiana",
    "n": "Hawaiana",
    "d": "Piña, queso rayado, jamón (opcional cerezas)",
    "p": [
     13.0,
     19.0,
     24.0
    ]
   },
   {
    "id": "pizza-pepperoni",
    "n": "Pepperoni",
    "d": "Pepperoni, queso y jamón",
    "p": [
     13.0,
     19.0,
     24.0
    ]
   },
   {
    "id": "pizza-tropical",
    "n": "Tropical",
    "d": "Piña, cereza, durazno, jamón, queso y salsa de la casa",
    "p": [
     15.0,
     22.0,
     26.0
    ]
   },
   {
    "id": "pizza-ay-dios-mio",
    "n": "Ay Dios Mío",
    "d": "Pollo desmechado, champiñones, jamón, queso rayado y salsa de la casa",
    "p": [
     15.0,
     22.0,
     28.0
    ]
   },
   {
    "id": "pizza-californiana",
    "n": "Californiana",
    "d": "Pollo desmechado, champiñones, camarones, jamón, pimentón rojo y verde, queso rayado y salsa de la casa",
    "p": [
     16.0,
     24.0,
     29.0
    ]
   },
   {
    "id": "pizza-mexicana",
    "n": "Mexicana",
    "d": "Carne desmechada, jamón, queso rayado, pimentón, cebolla, salsa picosa de la casa y tocineta",
    "p": [
     16.0,
     24.0,
     29.0
    ]
   },
   {
    "id": "pizza-camarones",
    "n": "Camarones",
    "d": "Camarones, jamón, queso rayado, pimentón y salsa de la casa",
    "p": [
     20.0,
     26.0,
     32.0
    ]
   },
   {
    "id": "pizza-la-4k",
    "n": "La 4K",
    "d": "Jamón, carne de res, pollo, chorizo, tocino y queso rayado",
    "p": [
     22.0,
     28.0,
     34.0
    ]
   },
   {
    "id": "pizza-legendaria",
    "n": "Legendaria",
    "d": "Carne molida, maíz, tocino, pimiento, jamón, queso y salsa de la casa",
    "p": [
     16.0,
     22.0,
     28.0
    ]
   },
   {
    "id": "pizza-pizza-a-tu-gusto",
    "n": "Pizza a tu gusto",
    "d": "Empieza con una pizza en blanco (masa y queso) y ponle todos los ingredientes que quieras.",
    "p": [
     10.0,
     15.0,
     19.0
    ]
   }
  ]
 },
 {
  "id": "bordes",
  "t": "Bordes de pizza",
  "ico": "🍞",
  "items": [
   {
    "id": "borde-normal",
    "n": "Normal",
    "p": 0.0
   },
   {
    "id": "borde-bocadillo",
    "n": "Bocadillo",
    "p": 3.0
   },
   {
    "id": "borde-queso",
    "n": "Queso",
    "p": 3.0
   }
  ]
 },
 {
  "id": "burger",
  "t": "Burguers",
  "ico": "🍔",
  "items": [
   {
    "id": "burger-gran-burguer",
    "n": "Gran Burguer",
    "d": "Carne, pollo apanado, tocineta",
    "p": 13.0
   },
   {
    "id": "burger-de-carne",
    "n": "Burguer de carne",
    "d": "Carne y papas a la francesa",
    "p": 10.0
   },
   {
    "id": "burger-de-pollo",
    "n": "Burguer de pollo",
    "d": "Pollo apanado",
    "p": 10.0
   }
  ]
 },
 {
  "id": "perro",
  "t": "Perros",
  "ico": "🌭",
  "items": [
   {
    "id": "perro-perro-salvaje",
    "n": "Perro salvaje",
    "d": "Pan horneado, carne picada, pollo picado, salchicha tradicional, maíz, queso rayado, tocineta, cebolla grille o caramelizada, lechuga, salsa de la casa y chorizo",
    "p": 10.0
   }
  ]
 },
 {
  "id": "salchipapas",
  "t": "Salchipapas",
  "ico": "🍟",
  "items": [
   {
    "id": "salchipapas-salchi-californiana",
    "n": "Salchi Californiana",
    "d": "Papas, salchicha, pollo, carne, maíz, lechuga, queso, chorizo y salsa de la casa",
    "p": 16.0
   },
   {
    "id": "salchipapas-salchi-tazmania",
    "n": "Salchi Tazmania",
    "d": "Todo lo de la Californiana con camarones y tocineta",
    "p": 19.0
   }
  ]
 },
 {
  "id": "mazorcada",
  "t": "Mazorcada",
  "ico": "🌽",
  "items": [
   {
    "id": "mazorcada-mazorcada-taz",
    "n": "Mazorcada TAZ",
    "d": "Maíz, carne y pollo picado, lechuga, queso rayado, chorizo y salsa de la casa",
    "p": 16.0
   }
  ]
 },
 {
  "id": "bebidas",
  "t": "Bebidas",
  "ico": "🥤",
  "tamanos": [
   "Personal (lata)",
   "1.5 L",
   "2 L"
  ],
  "items": [
   {
    "id": "bebida-sprite",
    "n": "Sprite",
    "p": [
     2.5,
     4.5,
     5.5
    ]
   },
   {
    "id": "bebida-pepsi",
    "n": "Pepsi",
    "p": [
     2.5,
     4.5,
     5.5
    ]
   },
   {
    "id": "bebida-coca-cola",
    "n": "Coca-Cola",
    "p": [
     2.5,
     4.5,
     5.5
    ]
   }
  ]
 },
 {
  "id": "toppings",
  "t": "Toppings extra",
  "ico": "🧀",
  "nota": "Se usan en todos los platos",
  "items": [
   {
    "id": "topping-queso-extra",
    "n": "Queso extra",
    "p": 2.0
   },
   {
    "id": "topping-jamon",
    "n": "Jamón",
    "p": 2.0
   },
   {
    "id": "topping-tocineta",
    "n": "Tocineta",
    "p": 2.0
   },
   {
    "id": "topping-pepperoni",
    "n": "Pepperoni",
    "p": 2.0
   },
   {
    "id": "topping-pollo-desmechado",
    "n": "Pollo desmechado",
    "p": 2.5
   },
   {
    "id": "topping-carne-desmechada",
    "n": "Carne desmechada",
    "p": 2.5
   },
   {
    "id": "topping-carne-molida",
    "n": "Carne molida",
    "p": 2.5
   },
   {
    "id": "topping-chorizo",
    "n": "Chorizo",
    "p": 2.0
   },
   {
    "id": "topping-camarones",
    "n": "Camarones",
    "p": 3.5
   },
   {
    "id": "topping-champinones",
    "n": "Champiñones",
    "p": 2.0
   },
   {
    "id": "topping-pina",
    "n": "Piña",
    "p": 2.0
   },
   {
    "id": "topping-maiz",
    "n": "Maíz",
    "p": 1.5
   },
   {
    "id": "topping-cebolla",
    "n": "Cebolla",
    "p": 1.0
   },
   {
    "id": "topping-pimenton",
    "n": "Pimentón",
    "p": 1.5
   },
   {
    "id": "topping-tomate",
    "n": "Tomate",
    "p": 1.0
   },
   {
    "id": "topping-jalapeno",
    "n": "Jalapeño",
    "p": 1.0
   },
   {
    "id": "topping-durazno",
    "n": "Durazno",
    "p": 2.0
   },
   {
    "id": "topping-cereza",
    "n": "Cereza",
    "p": 2.0
   }
  ]
 },
 {
  "id": "salsas",
  "t": "Salsas",
  "ico": "🥫",
  "nota": "Se usan en todos los platos",
  "items": [
   {
    "id": "salsa-salsa-de-tomate",
    "n": "Salsa de tomate",
    "p": 0.5
   },
   {
    "id": "salsa-salsa-rosada",
    "n": "Salsa rosada",
    "p": 0.5
   },
   {
    "id": "salsa-salsa-verde",
    "n": "Salsa verde",
    "p": 0.5
   }
  ]
 }
];
