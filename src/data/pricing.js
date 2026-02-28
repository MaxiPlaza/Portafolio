export const pricingData = {
    categories: [
        {
            id: "web",
            name: "Sitio Web",
            description: "Presencia digital optimizada con React y Tailwind.",
            levels: [
                { id: 1, name: "Nivel 1 (Esencial)", price: 250000, features: ["Landing Page", "Scroll Infinito", "Responsive", "SEO Técnico", "WhatsApp"] },
                { id: 2, name: "Nivel 2 (Profesional)", price: 500000, features: ["Hasta 5 secciones", "Panel Admin (CMS)", "Blog/Noticias", "Edición de fotos/textos"] },
                { id: 3, name: "Nivel 3 (Transaccional)", price: 750000, features: ["E-commerce", "Carrito de Compras", "Pasarela de Pagos", "Gestión de Usuarios", "DB SQL"] }
            ]
        },
        {
            id: "system",
            name: "Sistema de Gestión",
            description: "Automatización y control para tu negocio.",
            levels: [
                { id: 1, name: "Nivel 1 (Adm. Básico)", price: 550000, features: ["Inventario simple", "Login Admin", "CRUD en la nube"] },
                { id: 2, name: "Nivel 2 (Operativo)", price: 950000, features: ["Múltiples roles", "Reportes PDF/Excel", "Gráficos", "Carga masiva"] },
                { id: 3, name: "Nivel 3 (Integrado)", price: 1700000, features: ["Sincronización sucursales", "APIs externas (AFIP)", "Alertas Real-time"] }
            ]
        },
        {
            id: "app",
            name: "Aplicación Móvil",
            description: "Apps nativas/híbridas con Flutter.",
            levels: [
                { id: 1, name: "Nivel 1 (Catálogo)", price: 750000, features: ["Vista de productos", "Mapas/GPS", "Botones de acción"] },
                { id: 2, name: "Nivel 2 (Interactiva)", price: 1500000, features: ["Login Social", "Notificaciones Push", "Perfiles", "Modo Offline"] },
                { id: 3, name: "Nivel 3 (Ecosistema)", price: 2800000, features: ["QR/Barra scanner", "Bluetooth/Sensores", "Pagos In-App", "High Performance"] }
            ]
        }
    ],
    addons: [
        { id: "ia", name: "Inteligencia Artificial", price: 200000, description: "Chatbots, Predicción, OCR" },
        { id: "reservas", name: "Reservas y Citas", price: 100000, description: "Calendario interactivo" },
        { id: "afip", name: "Facturación AFIP", price: 200000, description: "Conexión WebServices" },
        { id: "api", name: "Integración APIs", price: 50000, description: "WhatsApp, Maps, Pagos (precio c/u)" },
        { id: "lang", name: "Multi-idioma", price: 50000, description: "Soporte internacional" }
    ],
    maintenance: [
        { id: "basic", name: "Plan Básico", price: 60000, interval: "mes" },
        { id: "pro", name: "Plan Pro", price: 100000, interval: "mes" }
    ]
};

export const calculateTotal = (selections) => {
    let total = 0;

    if (selections.category && selections.level) {
        const category = pricingData.categories.find(c => c.id === selections.category);
        const level = category?.levels.find(l => l.id === selections.level);
        if (level) total += level.price;
    }

    if (selections.addons) {
        selections.addons.forEach(addonId => {
            const addon = pricingData.addons.find(a => a.id === addonId);
            if (addon) total += addon.price;
        });
    }

    return total;
};
