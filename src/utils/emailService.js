import emailjs from '@emailjs/browser';

// ⚠️ CONFIGURACIÓN EMAILJS — Reemplazá con tus propias claves
// Instrucciones al final del formulario
const SERVICE_ID = 'service_ekxqn4p';
const TEMPLATE_ID = 'template_0h1d86u';
const PUBLIC_KEY = 'nbIM52KNUzYE0kwh5';

/**
 * Sends a detailed email with all form data to plazamaxi385@gmail.com
 * @param {Object} formData - All the answers from the Formulario
 * @param {Object} budgetSummary - Pricing breakdown
 */
export const sendFormEmail = async (formData, budgetSummary) => {
    const categoryLabels = {
        web: 'Sitio Web',
        system: 'Sistema de Gestión',
        app: 'App Móvil'
    };

    const deviceLabels = {
        mobile: '📱 Celular',
        tablet: '📲 Tablet',
        desktop: '💻 Computadora',
        all: '🖥️ Todos los dispositivos'
    };

    const platformLabels = {
        android: 'Android',
        ios: 'iOS (iPhone)',
        both: 'Android + iOS'
    };

    const dashboard = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  NUEVO PROYECTO — FORMULARIO COMPLETADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fecha: ${new Date().toLocaleDateString('es-AR', { dateStyle: 'full' })}
Hora: ${new Date().toLocaleTimeString('es-AR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TIPO DE PROYECTO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Categoría: ${categoryLabels[formData.projectType] || formData.projectType}
Plan Seleccionado: ${budgetSummary.planName}
Precio Base: $${budgetSummary.basePrice?.toLocaleString('es-AR')} ARS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  INFORMACIÓN DEL NEGOCIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre del negocio: ${formData.businessName || 'No indicado'}
Antigüedad: ${formData.businessAge || 'No indicado'}
Qué vende/ofrece: ${formData.businessCore || 'No indicado'}
Diferenciador clave: ${formData.differentiator || 'No indicado'}
Cómo consigue clientes: ${formData.clientAcquisition || 'No indicado'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PROBLEMA / DOLOR ACTUAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mayor frustración: ${formData.mainPain || 'No indicado'}
Por qué busca solución digital ahora: ${formData.whyNow || 'No indicado'}
Tarea que dejaría de hacer manualmente: ${formData.manualTask || 'No indicado'}
Personas que usarán la herramienta: ${formData.internalUsers || 'No indicado'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PÚBLICO OBJETIVO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Cliente ideal: ${formData.idealClient || 'No indicado'}
Dispositivo principal: ${deviceLabels[formData.mainDevice] || formData.mainDevice || 'No indicado'}
Queja más común de clientes: ${formData.clientComplaint || 'No indicado'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  FUNCIONALIDADES REQUERIDAS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Definición de éxito: ${formData.successDefinition || 'No indicado'}
Integraciones necesarias: ${formData.integrations?.join(', ') || 'Ninguna'}
Actualización en tiempo real: ${formData.realtimeData ? 'Sí' : 'No'}
Planea escalar el negocio: ${formData.scalePlan ? 'Sí' : 'No'}
Panel de administración propio: ${formData.needsAdmin ? 'Sí' : 'No'}
Notificaciones: ${formData.notificationType || 'No indicado'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PREGUNTAS ESPECÍFICAS (${categoryLabels[formData.projectType]})
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${buildSpecificSection(formData, platformLabels)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ESTÉTICA E IDENTIDAD
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Tiene logo/manual de marca: ${formData.hasLogo ? 'Sí' : 'No'}
Colores principales: ${formData.brandColors || 'No especificado'}
Estilo de tipografía: ${formData.typography || 'No indicado'}
Webs de referencia: ${formData.referenceUrls || 'No indicado'}
Tiene fotos propias: ${formData.hasPhotos ? 'Sí' : 'No'}
Testimonios de clientes: ${formData.hasTestimonials ? 'Sí' : 'No'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  PRESUPUESTO Y TIEMPOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Fecha límite deseada: ${formData.deadline || 'No indicado'}
Rango de inversión disponible: ${formData.budget || 'No indicado'}
Responsable de decisiones: ${formData.decisionMaker || 'No indicado'}
Tiene dominio propio: ${formData.hasDomain ? `Sí — ${formData.domainName || ''}` : 'No'}
Necesita correos corporativos: ${formData.needsCorporateEmail ? 'Sí' : 'No'}
Necesita mantenimiento mensual: ${formData.needsMaintenance ? 'Sí' : 'No'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  RESUMEN ECONÓMICO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plan base: ${budgetSummary.planName} — $${budgetSummary.basePrice?.toLocaleString('es-AR')} ARS
Add-ons seleccionados: ${budgetSummary.addonsDetail || 'Ninguno'}
━━━━━━━━━━━━━━━━━━━━
TOTAL ESTIMADO: $${budgetSummary.total?.toLocaleString('es-AR')} ARS
━━━━━━━━━━━━━━━━━━━━

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  INFORMACIÓN DE CONTACTO DEL CLIENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nombre: ${formData.clientName || 'No indicado'}
Email: ${formData.clientEmail || 'No indicado'}
Teléfono/WhatsApp: ${formData.clientPhone || 'No indicado'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `;

    const projectLabel = categoryLabels[formData.projectType] || formData.projectType || 'Proyecto';

    const templateParams = {
        to_email: 'plazamaxi385@gmail.com',
        name: formData.clientName || 'Cliente',
        email: formData.clientEmail || 'plazamaxi385@gmail.com',
        subject: `🚀 Nuevo Proyecto: ${projectLabel} — ${formData.businessName || 'Cliente'}`,
        client_name: formData.clientName || 'Cliente',
        client_email: formData.clientEmail || 'No indicado',
        project_type: projectLabel,
        plan_name: budgetSummary.planName,
        total_price: `$${budgetSummary.total?.toLocaleString('es-AR')} ARS`,
        dashboard_content: dashboard,
        reply_to: formData.clientEmail || 'plazamaxi385@gmail.com',
    };

    try {
        const result = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, {
            publicKey: PUBLIC_KEY,
        });
        return { success: true, result };
    } catch (error) {
        const errorMessage = error?.text || error?.message || 'Error desconocido al conectar con EmailJS';
        console.error('EmailJS error:', error);
        return { success: false, error, errorMessage };
    }
};

const buildSpecificSection = (formData, platformLabels) => {
    if (formData.projectType === 'app') {
        return `Plataforma: ${platformLabels[formData.platform] || formData.platform || 'No indicado'}
Uso sin conexión (offline): ${formData.needsOffline ? 'Sí' : 'No'}
Notificaciones Push: ${formData.needsPushNotifications ? 'Sí' : 'No'}
Uso de hardware (cámara/GPS/Bluetooth): ${formData.hardwareFeatures?.join(', ') || 'Ninguno'}
Frecuencia de uso: ${formData.usageFrequency || 'No indicado'}
Seguridad biométrica: ${formData.biometric ? 'Sí' : 'No'}
Distribución: ${formData.appDistribution || 'No indicado'}`;
    }

    if (formData.projectType === 'system') {
        return `Cantidad de usuarios internos: ${formData.internalUsers || 'No indicado'}
Múltiples roles de usuario: ${formData.multipleRoles ? 'Sí' : 'No'}
Reportes y estadísticas: ${formData.needsReports ? 'Sí' : 'No'}
Módulos necesarios: ${formData.systemModules?.join(', ') || 'No indicado'}`;
    }

    if (formData.projectType === 'web') {
        return `Secciones del menú: ${formData.menuSections || 'No indicado'}
Necesita e-commerce: ${formData.needsEcommerce ? 'Sí' : 'No'}
Necesita blog/noticias: ${formData.needsBlog ? 'Sí' : 'No'}
Multi-idioma: ${formData.needsMultilang ? 'Sí' : 'No'}
Contenido lo redacta: ${formData.contentWriter || 'No indicado'}
Tiene FAQ redactada: ${formData.hasFaq ? 'Sí' : 'No'}`;
    }

    return 'No disponible';
};
