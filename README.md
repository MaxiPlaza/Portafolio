# Portfolio Profesional - Maximiliano Plaza

Este es el portfolio web profesional de Maximiliano Plaza, diseñado como un embudo de ventas automatizado y una carta de presentación de clase mundial.

## 🚀 Tecnologías Core
- **Frontend:** React.js con Vite.
- **Estilos:** Tailwind CSS (Arquitectura de diseño personalizada).
- **Animaciones:** Framer Motion (Efectos de scroll, gradientes y micro-interacciones).
- **Iconos:** Lucide React.
- **Utilidades:** 
  - `react-router-dom` para navegación dinámica.
  - `jsPDF` para la generación automática de presupuestos.
  - `clsx` & `tailwind-merge` para gestión de clases CSS.

## 🛠 Estructura del Proyecto
```text
src/
├── components/
│   ├── layout/       # Navbar y Footer globales.
│   ├── sections/     # Secciones de la Landing y páginas de detalle.
│   └── ui/           # Componentes atómicos reutilizables (Botones, etc).
├── data/             # Lógica de negocio y contenido estático.
│   ├── pricing.js    # Matriz de precios basada en el Plan 2026.
│   └── projects.js   # Catálogo detallado de proyectos.
├── utils/            # Lógica auxiliar (Generador PDF).
└── App.jsx           # Configuración de rutas y efectos globales.
```

## 💰 Smart Quoter (Lógica de Negocio)
El sistema utiliza una matriz de precios estricta definida en `src/data/pricing.js`:
- **Categorías:** Web, Sistemas, Apps.
- **Niveles:** 1 (Esencial), 2 (Profesional), 3 (Transaccional).
- **Add-ons:** IA, Facturación AFIP, APIs, etc.
La lógica de cálculo acumula los valores base y extras para generar una propuesta en tiempo real exportable a PDF.

## 📦 Instalación y Desarrollo
1. Clonar el repositorio.
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
4. Construir para producción:
   ```bash
   npm run build
   ```

## 🌐 Despliegue
El proyecto está optimizado para ser desplegado en **Vercel**. Simplemente conecta tu repositorio de GitHub o arrastra la carpeta `dist` resultante del build.

## 📝 Contacto
- **Email:** plazamax355@gmail.com
- **LinkedIn:** [Maximiliano Plaza](https://linkedin.com/in/maximiliano-plaza-397750342/)
- **WhatsApp:** +54 3875469314
