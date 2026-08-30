export interface Review {
  name: string;
  /** Relative time, as shown on Google. */
  when: string;
  rating: number;
  quote: string;
  ownerReply?: string;
}

/**
 * Reseñas destacadas de clientes (Google). Selección de comentarios positivos;
 * verificá que sigan publicados y editá libremente desde este archivo.
 */
export const reviews: Review[] = [
  {
    name: "José Robles",
    when: "hace 2 semanas",
    rating: 5,
    quote:
      "¡Espectacular! Vine por la recomendación de un amigo de Buenos Aires. Hasta ahora es la mejor carne que comí en Uruguay.",
  },
  {
    name: "Marce García",
    when: "hace 3 semanas",
    rating: 5,
    quote:
      "Excelente lugar, nos sentimos muy cómodos. La parrilla estuvo exquisita, la atención muy amable y tienen estacionamiento.",
  },
  {
    name: "Washington Durán",
    when: "hace 1 mes",
    rating: 5,
    quote:
      "Todo excelente. La atención, la calidad y el precio son inmejorables. Visita obligada. Además ahora tienen estacionamiento propio.",
  },
  {
    name: "Tonatiuh Lugo Torres",
    when: "hace 1 mes",
    rating: 5,
    quote:
      "Excelente lugar con las 3 B: bueno, bonito y barato. Una experiencia de bodegón uruguayo de las de siempre.",
  },
  {
    name: "Lynda Hinnenthal",
    when: "hace 1 mes",
    rating: 5,
    quote:
      "La atención fue muy cálida y amable, con ese ambiente familiar. El asado estuvo delicioso.",
    ownerReply: "¡Muchas gracias por tan lindo comentario! Los esperamos de nuevo.",
  },
  {
    name: "Madelaine Bulkes",
    when: "hace 2 meses",
    rating: 5,
    quote:
      "Todo estaba delicioso y a un precio muy razonable. La atención fue excelente.",
  },
  {
    name: "JVI",
    when: "hace 2 meses",
    rating: 5,
    quote:
      "Pedimos una parrillada para dos. Fue abundante y la carne estaba en su punto justo.",
  },
  {
    name: "Gabriel Bellón",
    when: "hace 3 meses",
    rating: 5,
    quote: "Excelente atención y parrilla. Un ambiente espectacular.",
  },
  {
    name: "Jorge Patrone",
    when: "hace 3 meses",
    rating: 4,
    quote:
      "Excelente atención y comida. Mi única crítica es que sentí al dueño un poco distante.",
    ownerReply:
      "Gracias por la devolución, Jorge. Somos un equipo y siempre buscamos que cada mesa se vaya conforme; tomamos nota para mejorar.",
  },
];
