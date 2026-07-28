export const pricingData = {
    categories: [
        {
            id: "web",
            name: "Sitio Web",
            icon: "🌐",
            description: "Presencia digital optimizada y profesional.",
            levels: [
                {
                    id: 1,
                    name: "Plan Esencial",
                    price: 60000,
                    features: ["Landing Page", "Diseño Responsive", "SEO Técnico", "Botón WhatsApp", "Hasta 3 secciones"]
                },
                {
                    id: 2,
                    name: "Plan Profesional",
                    price: 200000,
                    features: ["Hasta 6 secciones", "Panel Admin (CMS)", "Blog / Noticias", "Formulario de contacto", "Galería de fotos"]
                },
                {
                    id: 3,
                    name: "Plan Transaccional",
                    price: 300000,
                    features: ["E-commerce completo", "Carrito de Compras", "Mercado Pago integrado", "Gestión de Usuarios", "Base de Datos SQL"]
                }
            ]
        },
        {
            id: "system",
            name: "Sistema de Gestión",
            icon: "⚙️",
            description: "Automatización y control total para tu negocio.",
            levels: [
                {
                    id: 1,
                    name: "Plan Básico",
                    price: 100000,
                    features: ["Inventario simple", "Login Admin", "CRUD en la nube", "Dashboard básico"]
                },
                {
                    id: 2,
                    name: "Plan Operativo",
                    price: 200000,
                    features: ["Múltiples roles de usuario", "Reportes PDF/Excel", "Gráficos estadísticos", "Carga masiva de datos"]
                },
                {
                    id: 3,
                    name: "Plan Integrado",
                    price: 300000,
                    features: ["Sincronización de sucursales", "APIs externas (AFIP)", "Alertas en tiempo real", "Facturación electrónica"]
                }
            ]
        },
        {
            id: "app",
            name: "App Móvil",
            icon: "📱",
            description: "Apps nativas e híbridas de alto rendimiento.",
            levels: [
                {
                    id: 1,
                    name: "Plan Catálogo",
                    price: 300000,
                    features: ["Vista de productos/servicios", "Mapas y GPS", "Botones de acción", "Diseño UI/UX personalizado"]
                },
                {
                    id: 2,
                    name: "Plan Interactiva",
                    price: 400000,
                    features: ["Login Social (Google/Facebook)", "Notificaciones Push", "Perfiles de usuario", "Modo Offline"]
                },
                {
                    id: 3,
                    name: "Plan Ecosistema",
                    price: 500000,
                    features: ["Escáner QR/Barras", "Bluetooth y sensores", "Pagos In-App", "Alta performance", "Android + iOS"]
                }
            ]
        }
    ],
    addons: [
        { id: "ia", name: "Inteligencia Artificial", price: 80000, description: "Chatbots, predicción, OCR automatizado" },
        { id: "reservas", name: "Reservas y Turnos", price: 50000, description: "Calendario interactivo para citas" },
        { id: "afip", name: "Facturación AFIP", price: 80000, description: "Conexión WebServices AFIP" },
        { id: "mercadopago", name: "Mercado Pago", price: 30000, description: "Cobros online integrados" },
        { id: "whatsapp", name: "WhatsApp Business API", price: 30000, description: "Mensajería automatizada" },
        { id: "lang", name: "Multi-idioma", price: 40000, description: "Soporte internacional (ES/EN)" },
        { id: "mantenimiento", name: "Mantenimiento mensual", price: 30000, description: "Actualizaciones y backups" }
    ],
    maintenance: [
        { id: "basic", name: "Plan Básico", price: 30000, interval: "mes" },
        { id: "pro", name: "Plan Pro", price: 60000, interval: "mes" }
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
