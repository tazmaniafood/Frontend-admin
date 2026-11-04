/* Menú base: lo que existe hoy en la tienda (Frontend-consumidor) con sus nombres,
   descripciones y precios originales. La página Menú solo MODIFICA estos elementos:
   no se pueden crear ni borrar.
   - p: precio (lista con un precio por tamaño en pizzas y bebidas).
   - ing: ingredientes del plato [{n, g}]: cada uno con su porción (en pizzas, una por tamaño).
          La porción total del plato es la suma de sus ingredientes.
   - g: porción directa (bebidas en ml y bordes por tamaño de pizza), en la unidad u.
        null = todavía sin definir.
   - Toppings y salsas: el nombre es uno solo, pero el precio y la porción van POR PLATO
     (no se le echa lo mismo a una pizza que a un perro). En pizza la porción va por tamaño. */
window.TAZ_MENU_BASE={
 "platos": [
  {
   "id": "pizza",
   "t": "Pizza",
   "ico": "🍕"
  },
  {
   "id": "burger",
   "t": "Burguer",
   "ico": "🍔"
  },
  {
   "id": "perro",
   "t": "Perro",
   "ico": "🌭"
  },
  {
   "id": "salchipapas",
   "t": "Salchipapas",
   "ico": "🍟"
  },
  {
   "id": "mazorcada",
   "t": "Mazorcada",
   "ico": "🌽"
  }
 ],
 "tamanosPizza": [
  "Personal",
  "Medium",
  "Familiar"
 ],
 "secciones": [
  {
   "id": "pizzas",
   "t": "Pizzas",
   "ico": "🍕",
   "u": "g",
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Piña",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso rayado",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Jamón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Cerezas (opcional)",
       "g": [
        null,
        null,
        null
       ]
      }
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Pepperoni",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Jamón",
       "g": [
        null,
        null,
        null
       ]
      }
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Piña",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Cereza",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Durazno",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Jamón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Salsa de la casa",
       "g": [
        null,
        null,
        null
       ]
      }
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Pollo desmechado",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Champiñones",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Jamón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso rayado",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Salsa de la casa",
       "g": [
        null,
        null,
        null
       ]
      }
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Pollo desmechado",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Champiñones",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Camarones",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Jamón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Pimentón rojo y verde",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso rayado",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Salsa de la casa",
       "g": [
        null,
        null,
        null
       ]
      }
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Carne desmechada",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Jamón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso rayado",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Pimentón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Cebolla",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Salsa picosa de la casa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Tocineta",
       "g": [
        null,
        null,
        null
       ]
      }
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Camarones",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Jamón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso rayado",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Pimentón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Salsa de la casa",
       "g": [
        null,
        null,
        null
       ]
      }
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Jamón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Carne de res",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Pollo",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Chorizo",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Tocino",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso rayado",
       "g": [
        null,
        null,
        null
       ]
      }
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Carne molida",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Maíz",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Tocino",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Pimiento",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Jamón",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Salsa de la casa",
       "g": [
        null,
        null,
        null
       ]
      }
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
     ],
     "ing": [
      {
       "n": "Masa",
       "g": [
        null,
        null,
        null
       ]
      },
      {
       "n": "Queso",
       "g": [
        null,
        null,
        null
       ]
      }
     ]
    }
   ]
  },
  {
   "id": "bordes",
   "t": "Bordes",
   "ico": "🍞",
   "u": "g",
   "tamanos": [
    "Personal",
    "Medium",
    "Familiar"
   ],
   "nota": "Bordes de pizza: el precio es uno solo y la porción va según el tamaño de la pizza",
   "items": [
    {
     "id": "borde-normal",
     "n": "Normal",
     "p": 0.0,
     "g": [
      null,
      null,
      null
     ]
    },
    {
     "id": "borde-bocadillo",
     "n": "Bocadillo",
     "p": 3.0,
     "g": [
      null,
      null,
      null
     ]
    },
    {
     "id": "borde-queso",
     "n": "Queso",
     "p": 3.0,
     "g": [
      null,
      null,
      null
     ]
    }
   ]
  },
  {
   "id": "burger",
   "t": "Burguers",
   "ico": "🍔",
   "u": "g",
   "items": [
    {
     "id": "burger-gran-burguer",
     "n": "Gran Burguer",
     "d": "Carne, pollo apanado, tocineta",
     "p": 13.0,
     "ing": [
      {
       "n": "Pan",
       "g": null
      },
      {
       "n": "Carne",
       "g": null
      },
      {
       "n": "Pollo apanado",
       "g": null
      },
      {
       "n": "Tocineta",
       "g": null
      }
     ]
    },
    {
     "id": "burger-de-carne",
     "n": "Burguer de carne",
     "d": "Carne y papas a la francesa",
     "p": 10.0,
     "ing": [
      {
       "n": "Pan",
       "g": null
      },
      {
       "n": "Carne",
       "g": null
      },
      {
       "n": "Papas a la francesa",
       "g": null
      }
     ]
    },
    {
     "id": "burger-de-pollo",
     "n": "Burguer de pollo",
     "d": "Pollo apanado",
     "p": 10.0,
     "ing": [
      {
       "n": "Pan",
       "g": null
      },
      {
       "n": "Pollo apanado",
       "g": null
      }
     ]
    }
   ]
  },
  {
   "id": "perro",
   "t": "Perros",
   "ico": "🌭",
   "u": "g",
   "items": [
    {
     "id": "perro-perro-salvaje",
     "n": "Perro salvaje",
     "d": "Pan horneado, carne picada, pollo picado, salchicha tradicional, maíz, queso rayado, tocineta, cebolla grille o caramelizada, lechuga, salsa de la casa y chorizo",
     "p": 10.0,
     "ing": [
      {
       "n": "Pan horneado",
       "g": null
      },
      {
       "n": "Carne picada",
       "g": null
      },
      {
       "n": "Pollo picado",
       "g": null
      },
      {
       "n": "Salchicha tradicional",
       "g": null
      },
      {
       "n": "Maíz",
       "g": null
      },
      {
       "n": "Queso rayado",
       "g": null
      },
      {
       "n": "Tocineta",
       "g": null
      },
      {
       "n": "Cebolla grille o caramelizada",
       "g": null
      },
      {
       "n": "Lechuga",
       "g": null
      },
      {
       "n": "Salsa de la casa",
       "g": null
      },
      {
       "n": "Chorizo",
       "g": null
      }
     ]
    }
   ]
  },
  {
   "id": "salchipapas",
   "t": "Salchipapas",
   "ico": "🍟",
   "u": "g",
   "items": [
    {
     "id": "salchipapas-salchi-californiana",
     "n": "Salchi Californiana",
     "d": "Papas, salchicha, pollo, carne, maíz, lechuga, queso, chorizo y salsa de la casa",
     "p": 16.0,
     "ing": [
      {
       "n": "Papas",
       "g": null
      },
      {
       "n": "Salchicha",
       "g": null
      },
      {
       "n": "Pollo",
       "g": null
      },
      {
       "n": "Carne",
       "g": null
      },
      {
       "n": "Maíz",
       "g": null
      },
      {
       "n": "Lechuga",
       "g": null
      },
      {
       "n": "Queso",
       "g": null
      },
      {
       "n": "Chorizo",
       "g": null
      },
      {
       "n": "Salsa de la casa",
       "g": null
      }
     ]
    },
    {
     "id": "salchipapas-salchi-tazmania",
     "n": "Salchi Tazmania",
     "d": "Todo lo de la Californiana con camarones y tocineta",
     "p": 19.0,
     "ing": [
      {
       "n": "Papas",
       "g": null
      },
      {
       "n": "Salchicha",
       "g": null
      },
      {
       "n": "Pollo",
       "g": null
      },
      {
       "n": "Carne",
       "g": null
      },
      {
       "n": "Maíz",
       "g": null
      },
      {
       "n": "Lechuga",
       "g": null
      },
      {
       "n": "Queso",
       "g": null
      },
      {
       "n": "Chorizo",
       "g": null
      },
      {
       "n": "Salsa de la casa",
       "g": null
      },
      {
       "n": "Camarones",
       "g": null
      },
      {
       "n": "Tocineta",
       "g": null
      }
     ]
    }
   ]
  },
  {
   "id": "mazorcada",
   "t": "Mazorcada",
   "ico": "🌽",
   "u": "g",
   "items": [
    {
     "id": "mazorcada-mazorcada-taz",
     "n": "Mazorcada TAZ",
     "d": "Maíz, carne y pollo picado, lechuga, queso rayado, chorizo y salsa de la casa",
     "p": 16.0,
     "ing": [
      {
       "n": "Maíz",
       "g": null
      },
      {
       "n": "Carne picada",
       "g": null
      },
      {
       "n": "Pollo picado",
       "g": null
      },
      {
       "n": "Lechuga",
       "g": null
      },
      {
       "n": "Queso rayado",
       "g": null
      },
      {
       "n": "Chorizo",
       "g": null
      },
      {
       "n": "Salsa de la casa",
       "g": null
      }
     ]
    }
   ]
  },
  {
   "id": "bebidas",
   "t": "Bebidas",
   "ico": "🥤",
   "u": "ml",
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
     ],
     "g": [
      355,
      1500,
      2000
     ]
    },
    {
     "id": "bebida-pepsi",
     "n": "Pepsi",
     "p": [
      2.5,
      4.5,
      5.5
     ],
     "g": [
      355,
      1500,
      2000
     ]
    },
    {
     "id": "bebida-coca-cola",
     "n": "Coca-Cola",
     "p": [
      2.5,
      4.5,
      5.5
     ],
     "g": [
      355,
      1500,
      2000
     ]
    }
   ]
  },
  {
   "id": "toppings",
   "t": "Toppings",
   "ico": "🧀",
   "u": "g",
   "extras": true,
   "nota": "Precio y porción de cada topping según el plato",
   "items": [
    {
     "id": "topping-queso-extra",
     "n": "Queso extra",
     "plato": {
      "pizza": {
       "p": 2.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.0,
       "g": null
      },
      "perro": {
       "p": 2.0,
       "g": null
      },
      "salchipapas": {
       "p": 2.0,
       "g": null
      },
      "mazorcada": {
       "p": 2.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-jamon",
     "n": "Jamón",
     "plato": {
      "pizza": {
       "p": 2.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.0,
       "g": null
      },
      "perro": {
       "p": 2.0,
       "g": null
      },
      "salchipapas": {
       "p": 2.0,
       "g": null
      },
      "mazorcada": {
       "p": 2.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-tocineta",
     "n": "Tocineta",
     "plato": {
      "pizza": {
       "p": 2.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.0,
       "g": null
      },
      "perro": {
       "p": 2.0,
       "g": null
      },
      "salchipapas": {
       "p": 2.0,
       "g": null
      },
      "mazorcada": {
       "p": 2.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-pepperoni",
     "n": "Pepperoni",
     "plato": {
      "pizza": {
       "p": 2.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.0,
       "g": null
      },
      "perro": {
       "p": 2.0,
       "g": null
      },
      "salchipapas": {
       "p": 2.0,
       "g": null
      },
      "mazorcada": {
       "p": 2.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-pollo-desmechado",
     "n": "Pollo desmechado",
     "plato": {
      "pizza": {
       "p": 2.5,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.5,
       "g": null
      },
      "perro": {
       "p": 2.5,
       "g": null
      },
      "salchipapas": {
       "p": 2.5,
       "g": null
      },
      "mazorcada": {
       "p": 2.5,
       "g": null
      }
     }
    },
    {
     "id": "topping-carne-desmechada",
     "n": "Carne desmechada",
     "plato": {
      "pizza": {
       "p": 2.5,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.5,
       "g": null
      },
      "perro": {
       "p": 2.5,
       "g": null
      },
      "salchipapas": {
       "p": 2.5,
       "g": null
      },
      "mazorcada": {
       "p": 2.5,
       "g": null
      }
     }
    },
    {
     "id": "topping-carne-molida",
     "n": "Carne molida",
     "plato": {
      "pizza": {
       "p": 2.5,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.5,
       "g": null
      },
      "perro": {
       "p": 2.5,
       "g": null
      },
      "salchipapas": {
       "p": 2.5,
       "g": null
      },
      "mazorcada": {
       "p": 2.5,
       "g": null
      }
     }
    },
    {
     "id": "topping-chorizo",
     "n": "Chorizo",
     "plato": {
      "pizza": {
       "p": 2.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.0,
       "g": null
      },
      "perro": {
       "p": 2.0,
       "g": null
      },
      "salchipapas": {
       "p": 2.0,
       "g": null
      },
      "mazorcada": {
       "p": 2.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-camarones",
     "n": "Camarones",
     "plato": {
      "pizza": {
       "p": 3.5,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 3.5,
       "g": null
      },
      "perro": {
       "p": 3.5,
       "g": null
      },
      "salchipapas": {
       "p": 3.5,
       "g": null
      },
      "mazorcada": {
       "p": 3.5,
       "g": null
      }
     }
    },
    {
     "id": "topping-champinones",
     "n": "Champiñones",
     "plato": {
      "pizza": {
       "p": 2.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.0,
       "g": null
      },
      "perro": {
       "p": 2.0,
       "g": null
      },
      "salchipapas": {
       "p": 2.0,
       "g": null
      },
      "mazorcada": {
       "p": 2.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-pina",
     "n": "Piña",
     "plato": {
      "pizza": {
       "p": 2.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.0,
       "g": null
      },
      "perro": {
       "p": 2.0,
       "g": null
      },
      "salchipapas": {
       "p": 2.0,
       "g": null
      },
      "mazorcada": {
       "p": 2.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-maiz",
     "n": "Maíz",
     "plato": {
      "pizza": {
       "p": 1.5,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 1.5,
       "g": null
      },
      "perro": {
       "p": 1.5,
       "g": null
      },
      "salchipapas": {
       "p": 1.5,
       "g": null
      },
      "mazorcada": {
       "p": 1.5,
       "g": null
      }
     }
    },
    {
     "id": "topping-cebolla",
     "n": "Cebolla",
     "plato": {
      "pizza": {
       "p": 1.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 1.0,
       "g": null
      },
      "perro": {
       "p": 1.0,
       "g": null
      },
      "salchipapas": {
       "p": 1.0,
       "g": null
      },
      "mazorcada": {
       "p": 1.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-pimenton",
     "n": "Pimentón",
     "plato": {
      "pizza": {
       "p": 1.5,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 1.5,
       "g": null
      },
      "perro": {
       "p": 1.5,
       "g": null
      },
      "salchipapas": {
       "p": 1.5,
       "g": null
      },
      "mazorcada": {
       "p": 1.5,
       "g": null
      }
     }
    },
    {
     "id": "topping-tomate",
     "n": "Tomate",
     "plato": {
      "pizza": {
       "p": 1.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 1.0,
       "g": null
      },
      "perro": {
       "p": 1.0,
       "g": null
      },
      "salchipapas": {
       "p": 1.0,
       "g": null
      },
      "mazorcada": {
       "p": 1.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-jalapeno",
     "n": "Jalapeño",
     "plato": {
      "pizza": {
       "p": 1.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 1.0,
       "g": null
      },
      "perro": {
       "p": 1.0,
       "g": null
      },
      "salchipapas": {
       "p": 1.0,
       "g": null
      },
      "mazorcada": {
       "p": 1.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-durazno",
     "n": "Durazno",
     "plato": {
      "pizza": {
       "p": 2.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.0,
       "g": null
      },
      "perro": {
       "p": 2.0,
       "g": null
      },
      "salchipapas": {
       "p": 2.0,
       "g": null
      },
      "mazorcada": {
       "p": 2.0,
       "g": null
      }
     }
    },
    {
     "id": "topping-cereza",
     "n": "Cereza",
     "plato": {
      "pizza": {
       "p": 2.0,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 2.0,
       "g": null
      },
      "perro": {
       "p": 2.0,
       "g": null
      },
      "salchipapas": {
       "p": 2.0,
       "g": null
      },
      "mazorcada": {
       "p": 2.0,
       "g": null
      }
     }
    }
   ]
  },
  {
   "id": "salsas",
   "t": "Salsas",
   "ico": "🥫",
   "u": "g",
   "extras": true,
   "nota": "Precio y porción de cada salsa según el plato",
   "items": [
    {
     "id": "salsa-salsa-de-tomate",
     "n": "Salsa de tomate",
     "plato": {
      "pizza": {
       "p": 0.5,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 0.5,
       "g": null
      },
      "perro": {
       "p": 0.5,
       "g": null
      },
      "salchipapas": {
       "p": 0.5,
       "g": null
      },
      "mazorcada": {
       "p": 0.5,
       "g": null
      }
     }
    },
    {
     "id": "salsa-salsa-rosada",
     "n": "Salsa rosada",
     "plato": {
      "pizza": {
       "p": 0.5,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 0.5,
       "g": null
      },
      "perro": {
       "p": 0.5,
       "g": null
      },
      "salchipapas": {
       "p": 0.5,
       "g": null
      },
      "mazorcada": {
       "p": 0.5,
       "g": null
      }
     }
    },
    {
     "id": "salsa-salsa-verde",
     "n": "Salsa verde",
     "plato": {
      "pizza": {
       "p": 0.5,
       "g": [
        null,
        null,
        null
       ]
      },
      "burger": {
       "p": 0.5,
       "g": null
      },
      "perro": {
       "p": 0.5,
       "g": null
      },
      "salchipapas": {
       "p": 0.5,
       "g": null
      },
      "mazorcada": {
       "p": 0.5,
       "g": null
      }
     }
    }
   ]
  }
 ]
};
