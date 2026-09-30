# Frontend Taller Joyería Cecilia Castro

## Identidad Visual

El diseño del frontend de **Taller Joyería Cecilia Castro** está inspirado en la estética de la joyería fina, buscando transmitir una sensación de **elegancia, exclusividad, confianza y profesionalismo**.

La interfaz combina tonos oscuros y cálidos con una estética moderna, limpia y minimalista.

### Concepto

> **Elegancia · Exclusividad · Modernidad · Claridad**

El diseño evita la saturación visual y utiliza el color, el espacio y la tipografía para establecer una jerarquía clara de información.

---

## Paleta de colores

### Verde oscuro

El verde oscuro es el color principal de la interfaz y representa estabilidad, elegancia y sofisticación.

```css
--green-deep: #0a2c20;
--green: #0f3b2a;
--green-light: #17503a;
```

Se utiliza principalmente en:

* Sidebar
* Navegación
* Encabezados
* Elementos principales
* Fondos oscuros

### Dorado

El dorado representa la identidad relacionada con la joyería y funciona como color de acento.

```css
--gold: #d9b970;
--gold-light: #ecd39a;
--gold-dark: #b98f45;
```

Se utiliza en:

* Títulos destacados
* Iconos
* Botones principales
* Elementos activos
* Bordes destacados
* Detalles visuales

También se utilizan versiones transparentes:

```css
--gold-soft: rgba(217, 185, 112, 0.14);
--gold-ring: rgba(217, 185, 112, 0.28);
```

Esto permite utilizar el dorado de forma más sutil.

---

## Tonos claros

Los fondos utilizan tonos crema y blanco para generar contraste con el verde oscuro.

```css
--cream: #f6efe0;

--surface: #faf6ec;
--surface-card: #ffffff;
```

El crema aporta una sensación cálida y evita que la interfaz tenga una apariencia excesivamente fría.

El blanco se utiliza principalmente en:

* Tarjetas
* Formularios
* Modales
* Paneles
* Contenedores

---

## Tipografía

La tipografía principal del proyecto es **Inter**.

```css
font-family: 'Inter', sans-serif;
```

Se utiliza de manera global para mantener consistencia en toda la interfaz.

### Pesos

* **300** — Texto secundario
* **400** — Texto normal
* **500** — Etiquetas y elementos secundarios
* **600** — Botones y subtítulos
* **700** — Títulos
* **800** — Títulos principales

La tipografía busca ser moderna, limpia y altamente legible.

---

## Estilo de componentes

Los componentes siguen una estética moderna y elegante.

### Tarjetas

Las tarjetas utilizan:

* Fondo blanco
* Bordes suaves
* Esquinas redondeadas
* Sombras ligeras
* Espaciado amplio

### Botones

Los botones mantienen una jerarquía visual clara.

El **dorado** representa las acciones principales, mientras que los tonos neutros se utilizan para acciones secundarias.

Las acciones destructivas utilizan tonos rojizos.

### Formularios

Los campos utilizan:

* Fondos claros
* Bordes sutiles
* Esquinas redondeadas
* Estados `focus`
* Indicadores visuales de validación

El estado `focus` utiliza principalmente el dorado para mantener la identidad visual.

---

## Sidebar

El sidebar utiliza principalmente el verde oscuro como fondo.

Su identidad visual se complementa con:

* Detalles dorados
* Iconografía clara
* Estados activos
* Tooltips
* Scroll vertical

El nombre de la aplicación utiliza el dorado como elemento de branding.

---

## Modales

Los modales mantienen la misma identidad visual del resto de la aplicación.

Utilizan:

* Fondo blanco
* Bordes redondeados
* Sombras profundas
* Encabezados diferenciados
* Botones claramente definidos
* Contenido desplazable cuando es necesario

En dispositivos pequeños, los modales se adaptan a la altura disponible de la pantalla.

---

## Estados visuales

Se utilizan colores específicos para comunicar diferentes estados.

### Éxito

```css
--success: #55d69a;
--success-dark: #2f8c62;
```

### Error / Peligro

```css
--danger: #f2727f;
--danger-dark: #c94d5a;
```

### Advertencia

```css
--warning: #f5b85a;
```

Estos colores se utilizan principalmente en:

* Toasts
* Alertas
* Estados
* Validaciones
* Acciones destructivas

---

## Responsive Design

El diseño está pensado para adaptarse a diferentes tamaños de pantalla:

* Desktop
* Laptop
* Tablet
* Smartphone

En pantallas pequeñas se reducen los espacios, se reorganizan los componentes y los elementos interactivos se adaptan al ancho disponible.

La prioridad es mantener la **funcionalidad y legibilidad** sin perder la identidad visual.

---

## Animaciones

Las animaciones son discretas y tienen como objetivo proporcionar retroalimentación visual.

Se utilizan principalmente en:

* Hover
* Focus
* Modales
* Toasts
* Tooltips
* Cambios de estado

Las transiciones buscan sentirse suaves y naturales sin hacer que la interfaz parezca excesivamente animada.

---

## Sombras

Las sombras se utilizan para establecer profundidad y jerarquía.

```css
--shadow-sm: 0 3px 14px rgba(38, 56, 47, 0.06);

--shadow-md: 0 18px 50px rgba(10, 44, 32, 0.14);

--shadow-lg: 0 28px 80px rgba(0, 0, 0, 0.28);
```

Se evita utilizar sombras demasiado fuertes en elementos cotidianos para conservar una apariencia limpia y elegante.

---

## Bordes y formas

La interfaz utiliza principalmente:

* Bordes redondeados
* Líneas sutiles
* Contenedores amplios
* Espaciado consistente
* Superficies limpias

El uso de esquinas redondeadas ayuda a crear una estética moderna y amigable.

---

## Filosofía de diseño

El diseño del frontend busca representar visualmente la esencia de una marca de joyería:

**Elegante**, mediante el uso del dorado y los espacios limpios.

**Sofisticado**, mediante la combinación de verde oscuro, crema y blanco.

**Moderno**, mediante una tipografía limpia, componentes redondeados y microinteracciones.

**Profesional**, mediante una jerarquía visual clara y una interfaz ordenada.

**Funcional**, priorizando siempre la facilidad de uso sobre la decoración.

---

## Resumen

| Elemento            | Definición                                |
| ------------------- | ----------------------------------------- |
| **Estilo**          | Elegante, moderno y minimalista           |
| **Identidad**       | Joyería fina                              |
| **Color principal** | Verde oscuro                              |
| **Color de acento** | Dorado                                    |
| **Fondos**          | Crema y blanco                            |
| **Tipografía**      | Inter                                     |
| **Formas**          | Redondeadas                               |
| **Sombras**         | Suaves y jerárquicas                      |
| **Diseño**          | Responsive                                |
| **Animaciones**     | Sutiles                                   |
| **Sensación**       | Elegancia, exclusividad y profesionalismo |
