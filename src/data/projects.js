export const projects = [
    {
        id: "koa",
        title: "KOA - IA para Neurodiversidad",
        shortDescription: "Aplicación móvil para niños neurodivergentes con TensorFlow Lite y Gemini API.",
        fullDescription: "KOA es una solución disruptiva que utiliza inteligencia artificial para mejorar la calidad de vida de niños con autismo y otras condiciones neurodiversas. El sistema integra modelos de visión computacional para detectar emociones y agentes conversacional basados en Gemini para ofrecer apoyo emocional y sugerencias de juegos adaptados en tiempo real.",
        tags: ["Flutter", "TensorFlow", "Gemini API", "Neurodiversity", "Python"],
        image: "http://localhost:5173/image/landingsportkombatcenter.png",
        gallery: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200", // Dashboard/Data
            "https://images.unsplash.com/photo-1558403194-611308249627?q=80&w=1200", // Mobile interface focus
            "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200"  // Deep tech/Hardware
        ],
        features: [
            "Detección de emociones mediante cámara con TensorFlow Lite.",
            "Chatbot de acompañamiento adaptado con Gemini Pro.",
            "Algoritmo de recomendación de juegos terapéuticos.",
            "Panel para padres con estadísticas de progreso emocional."
        ],
        challenges: "El mayor desafío fue optimizar el modelo de IA para que funcionara con baja latencia en dispositivos móviles de gama media.",
        link: "https://github.com/MaxiPlaza/KOA",
        featured: true
    },
    {
        id: "transito",
        title: "Sistema de Gestión de Tránsito",
        shortDescription: "Plataforma de automatización y analítica para seguridad vial.",
        fullDescription: "Desarrollado para la Dirección General de Tránsito, este sistema automatiza la carga de infracciones y genera reportes estadísticos avanzados. Incluye scripts de mantenimiento preventivo que redujeron drásticamente el downtime de los equipos operativos.",
        tags: ["Python", "SQL", "Node.js", "Automation", "Dashboard"],
        image: "/image/iniciotransito.png",
        gallery: [
            "/image/vehiculostransito.png",
            "/image/propietariostransito.png",
            "/image/reportestransito.png",
            "/image/infraccionestransito.png",
            "/image/historial.png",
            "/image/admintransito.png",
            "/image/dashboardtransito.png"
        ],
        features: [
            "Importar datos desde un excel.",
            "Visualización de datos en tiempo real mediante Dashboards.",
            "Sistema de roles y permisos para múltiples estaciones.",
            "Generación automática de reportes."
        ],
        challenges: "Migrar una infraestructura legacy a un sistema moderno basado en la nube sin interrumpir las operaciones diarias.",
        link: "https://github.com/MaxiPlaza/Sistema-de-Gestion-del-Canchon-Transito-",
        featured: false
    },
    {
        id: "sport-kombat",
        title: "Sport Kombat Center",
        shortDescription: "Plataforma integral de gestión deportiva y artes marciales.",
        fullDescription: "Una plataforma 'End-to-End' diseñada para centralizar la gestión de un Dojo. Permite el control de membresías, asistencia mediante la plataforma y una zona administrativa para el seguimiento de la performance de los atletas.",
        tags: ["React", "Node.js", "Supabase", "Scalable", "Vite"],
        image: "/image/landingsportkombatcenter.png",
        gallery: [
            "/image/galeriasportkombatcenter.png", // Gym/Weights
            "/image/paneladminsportkombatcenter.png", // Disciplined training
            "/image/planesportkombatcenter.png"  // Athlete performance
        ],
        features: [
            "Arquitectura escalable en la nube.",
            "Gestión de pagos y membresías automatizada.",
            "Módulo de entrenamiento personalizado.",
            "API optimizada para alta concurrencia."
        ],
        challenges: "Diseñar una base de datos relacional que manejara de forma eficiente la concurrencia de cientos de usuarios simultáneos.",
        link: "https://dojo-solaligue.vercel.app/",
        featured: false
    }
];
