import type { NormasData } from './types';

export const normasData: NormasData = {
  "NOM-051-SCFI/SSA1-2010": {
    "norma": "NOM-051-SCFI/SSA1-2010",
    "titulo": "Especificaciones generales de etiquetado para alimentos y bebidas no alcohólicas preenvasados-Información comercial y sanitaria",
    "principios_normativos": {
      "criterios_de_aceptacion": [
        {
          "numeral": "4.2",
          "principio": "La etiqueta de los productos preenvasados debe contener con carácter obligatorio la siguiente información: Nombre o denominación del alimento; Lista de ingredientes; Contenido neto y masa drenada; Nombre y domicilio fiscal del responsable; País de origen; Identificación del lote; Fecha de caducidad o de consumo preferente; e Información nutrimental."
        },
        {
          "numeral": "4.2.2.1.2",
          "principio": "Los ingredientes deben enumerarse por orden cuantitativo decreciente (m/m)."
        },
        {
          "numeral": "4.2.2.2.3",
          "principio": "Se deben declarar siempre los alimentos e ingredientes que causan hipersensibilidad (cereales con gluten, crustáceos, huevo, pescado, cacahuate, soya, leche, nueces de árboles, sulfito en concentraciones de 10 mg/kg o más)."
        },
        {
          "numeral": "4.2.7.2",
          "principio": "Al declarar la fecha de caducidad o de consumo preferente, se debe indicar en la etiqueta cualquier condición especial requerida para la conservación del producto si de su cumplimiento depende la validez de la fecha."
        },
        {
          "numeral": "4.2.8.1",
          "principio": "La declaración nutrimental en la etiqueta de los productos preenvasados es obligatoria."
        },
        {
          "numeral": "4.2.11.1",
          "principio": "Los alimentos y bebidas no alcohólicas preenvasados deben ostentar la información obligatoria en idioma español, sin perjuicio de que se exprese en otros idiomas."
        },
        {
          "numeral": "7.1.1",
          "principio": "Las leyendas precautorias deben hacer referencia al ingrediente u origen del ingrediente que, basado en información científica reconocida, se asocie a riesgos reales o potenciales."
        }
      ],
      "criterios_de_rechazo": [
        {
          "numeral": "4.1.1",
          "principio": "La información contenida en las etiquetas debe ser veraz y no debe inducir a error al consumidor con respecto a la naturaleza y características del producto."
        },
        {
          "numeral": "4.1.3",
          "principio": "Los alimentos y bebidas no deberán describirse ni presentarse con una etiqueta que utilice palabras, ilustraciones u otras descripciones que sugieran o se refieran a cualquier otro producto con el que pueda confundirse."
        },
        {
          "numeral": "4.2.7.3",
          "principio": "La fecha de caducidad o de consumo preferente que incorpore el fabricante no puede ser alterada en ningún caso y bajo ninguna circunstancia."
        },
        {
          "numeral": "6.1.1",
          "principio": "Se prohíbe el uso de declaraciones que hagan suponer que una alimentación equilibrada no puede suministrar nutrimentos suficientes, declaraciones que no pueden comprobarse, o declaraciones sobre la utilidad de un alimento para prevenir, aliviar, tratar o curar una enfermedad."
        },
        {
          "numeral": "6.1.1 (párrafo 4)",
          "principio": "Se prohíbe el uso de declaraciones que puedan suscitar dudas sobre la inocuidad de alimentos análogos, o puedan suscitar o provocar miedo en el consumidor."
        },
        {
          "numeral": "6.1.2",
          "principio": "Se prohíben las declaraciones de propiedades respecto a prácticas correctas de higiene o comercio, tales como: 'genuinidad', 'salubridad', 'sanidad', 'sano', 'saludable', excepto las señaladas en otros ordenamientos jurídicos."
        },
        {
          "numeral": "6.3.4",
          "principio": "No se podrán hacer declaraciones de propiedades cuando se pretenda atribuir al producto características que no contiene o posee, ni declaraciones asociadas a la disminución o reducción de riesgo de enfermedad."
        }
      ]
    }
  },
  "NOM-251-SSA1-2009": {
    "norma": "NOM-251-SSA1-2009",
    "titulo": "Prácticas de higiene para el proceso de alimentos, bebidas o suplementos alimenticios",
    "principios_normativos": {
      "criterios_generales": [
        {
          "numeral": "5.6.2",
          "principio": "No utilizar materias primas que ostenten fecha de caducidad vencida.",
          "criterio": "Rechazo"
        },
        {
          "numeral": "5.6.4",
          "principio": "Separar y eliminar del lugar las materias primas que evidentemente no sean aptas, a fin de evitar mal uso, contaminaciones y adulteraciones.",
          "criterio": "Rechazo"
        },
        {
          "numeral": "5.6.6",
          "principio": "No aceptar materia prima cuando el envase no garantice su integridad.",
          "criterio": "Rechazo"
        },
        {
          "numeral": "5.6.7",
          "principio": "No aceptar las materias primas enlistadas en la tabla No 1, cuando al corroborar sus características alguna de éstas corresponda a la de rechazo.",
          "criterio": "Rechazo"
        }
      ],
      "criterios_por_categoria": [
        {
          "categoria": "Preenvasadas",
          "parametros": [
            {
              "parametro": "Envase",
              "aceptacion": "Íntegro y en buen estado.",
              "rechazo": "Rotos, rasgado, con fugas o con evidencia de fauna nociva."
            },
            {
              "parametro": "Fecha de caducidad o de consumo preferente",
              "aceptacion": "Vigente.",
              "rechazo": "Vencida."
            }
          ]
        },
        {
          "categoria": "Enlatadas",
          "parametros": [
            {
              "parametro": "Latas",
              "aceptacion": "Íntegras.",
              "rechazo": "Abombadas, oxidadas, con fuga, abolladas en costura y/o engargolado o en cualquier parte del cuerpo, o con abolladuras mayores a los límites especificados."
            }
          ]
        },
        {
          "categoria": "Congeladas",
          "parametros": [
            {
              "parametro": "Apariencia",
              "aceptacion": "Sin signos de descongelación.",
              "rechazo": "Con signos de descongelación."
            }
          ]
        },
        {
          "categoria": "Refrigeradas",
          "parametros": [
            {
              "parametro": "Temperatura",
              "aceptacion": "4°C o menos, excepto los productos de la pesca vivos, que pueden aceptarse a 7°C.",
              "rechazo": "Mayor de 4°C, excepto los productos de la pesca vivos, que pueden aceptarse a 7°C."
            }
          ]
        },
        {
          "categoria": "Bebidas embotelladas",
          "parametros": [
            {
              "parametro": "Apariencia",
              "aceptacion": "Libre de materia extraña y tapas íntegras y sin corrosión.",
              "rechazo": "Con materia extraña o con fugas, oxidadas o con signos de violación."
            }
          ]
        },
        {
          "categoria": "Productos de origen vegetal",
          "parametros": [
            {
              "parametro": "Apariencia y Olor",
              "aceptacion": "Fresca y con olor característico.",
              "rechazo": "Con mohos, coloración extraña, magulladuras u olor a putrefacto."
            }
          ]
        },
        {
          "categoria": "Carnes frescas",
          "parametros": [
            {
              "parametro": "Color",
              "aceptacion": "Res: rojo brillante; Cordero: rojo; Cerdo: rosa pálido.",
              "rechazo": "Verdosa o café obscuro, descolorida en el tejido elástico."
            },
            {
              "parametro": "Grasa",
              "aceptacion": "Blanca o ligeramente amarilla.",
              "rechazo": "N/A"
            },
            {
              "parametro": "Textura",
              "aceptacion": "Firme y elástica.",
              "rechazo": "Viscosa, pegajosa."
            },
            {
              "parametro": "Olor",
              "aceptacion": "Característico.",
              "rechazo": "Putrefacto, agrio."
            }
          ]
        },
        {
          "categoria": "Aves",
          "parametros": [
            {
              "parametro": "Color, Textura y Olor",
              "aceptacion": "Color característico, textura firme y olor característico.",
              "rechazo": "Coloración verdosa, amoratada o con diferentes coloraciones; textura blanda y pegajosa; olor putrefacto o rancio."
            }
          ]
        },
        {
          "categoria": "Pescado",
          "parametros": [
            {
              "parametro": "Apariencia",
              "aceptacion": "Agallas rojo brillante, húmedas, ojos saltones, limpios, transparentes y brillantes.",
              "rechazo": "Agallas gris o verde, secas, ojos hundidos y opacos con bordes rojos."
            },
            {
              "parametro": "Textura y Olor",
              "aceptacion": "Firme y olor característico.",
              "rechazo": "Flácida y olor agrio, putrefacto o amoniacal."
            }
          ]
        },
        {
          "categoria": "Moluscos",
          "parametros": [
            {
              "parametro": "Apariencia y Vitalidad",
              "aceptacion": "Apariencia brillante; conchas cerradas o que se abren y cierran al contacto.",
              "rechazo": "Apariencia mate; conchas abiertas que no cierran al tacto."
            },
             {
              "parametro": "Olor, Color y Textura",
              "aceptacion": "Olor, color y textura característicos.",
              "rechazo": "Olor putrefacto o amoniacal, color no característico y textura viscosa."
            }
          ]
        },
        {
          "categoria": "Crustáceos",
          "parametros": [
            {
              "parametro": "Apariencia",
              "aceptacion": "Articulaciones firmes.",
              "rechazo": "Articulaciones con pérdida de tensión y contracción, sin brillo, con manchas obscuras."
            },
            {
              "parametro": "Color, Textura y Olor",
              "aceptacion": "Color característico, textura firme y olor característico al marisco.",
              "rechazo": "Color no característico, textura flácida y olor putrefacto o amoniacal."
            }
          ]
        },
        {
          "categoria": "Cefalópodos",
          "parametros": [
            {
              "parametro": "Color, Textura y Olor",
              "aceptacion": "Color, textura y olor característicos.",
              "rechazo": "Color no característico, textura flácida y viscosa, y olor a putrefacto."
            }
          ]
        },
         {
          "categoria": "Leche y derivados",
          "parametros": [
            {
              "parametro": "Origen",
              "aceptacion": "A base de leche pasteurizada.",
              "rechazo": "Que proceda de leche sin pasteurizar."
            }
          ]
        },
        {
          "categoria": "Quesos",
          "parametros": [
            {
              "parametro": "Olor, color y textura",
              "aceptacion": "Característico.",
              "rechazo": "Con manchas no propias del queso o partículas extrañas, o contaminado con hongos (en productos no inoculados)."
            }
          ]
        },
        {
          "categoria": "Mantequilla",
          "parametros": [
            {
              "parametro": "Apariencia y Olor",
              "aceptacion": "Característicos.",
              "rechazo": "Con mohos o partículas extrañas, y olor a rancio."
            }
          ]
        },
        {
          "categoria": "Huevo fresco",
          "parametros": [
            {
              "parametro": "Apariencia",
              "aceptacion": "Limpios y con cascarón entero.",
              "rechazo": "Cascarón quebrado o manchado con excremento o sangre."
            }
          ]
        },
        {
          "categoria": "Granos, harinas, productos de panificación, tortillas y otros productos secos",
          "parametros": [
            {
              "parametro": "Apariencia",
              "aceptacion": "Sin mohos y con coloración característica.",
              "rechazo": "Con mohos o coloración ajena al producto o con infestaciones."
            }
          ]
        }
      ]
    }
  }
}