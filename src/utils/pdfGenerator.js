import { jsPDF } from 'jspdf';
import { pricingData } from '../data/pricing';

const CATEGORY_LABELS = {
    web: 'Sitio Web',
    system: 'Sistema de Gestión',
    app: 'App Móvil',
};

const DEVICE_LABELS = {
    mobile: 'Celular',
    tablet: 'Tablet',
    desktop: 'Computadora',
    all: 'Todos los dispositivos',
};

const INTEGRATION_LABELS = {
    mercadopago: 'Mercado Pago',
    whatsapp: 'WhatsApp',
    instagram: 'Instagram Feed',
    excel: 'Excel / Sheets',
    afip: 'AFIP / Facturación',
    maps: 'Google Maps',
    barcode: 'Lector de código de barras',
    push: 'Notificaciones Push',
};

const PLATFORM_LABELS = {
    android: 'Android',
    ios: 'iOS (iPhone)',
    both: 'Android + iOS',
};

const HARDWARE_LABELS = {
    camera: 'Cámara / QR',
    gps: 'GPS / Mapas',
    bluetooth: 'Bluetooth',
    none: 'Ninguno',
};

/**
 * Strips emojis and characters outside WinAnsi/Latin-1 so jsPDF's built-in
 * Helvetica font never renders garbled bytes or broken character spacing.
 */
const sanitizeText = (value) => {
    if (value === null || value === undefined) return '';
    return String(value)
        .replace(/✓/g, 'Sí')
        .replace(/[^\u0020-\u007E\u00A0-\u00FF\u2013\u2014\u2018\u2019\u201C\u201D\u2022\u2026\u20AC\n\r\t]/g, '')
        .replace(/[ \t]{2,}/g, ' ')
        .trim();
};

const formatValue = (value, labelMap = null) => {
    if (value === null || value === undefined || value === '') return 'No indicado';
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    if (Array.isArray(value)) {
        if (value.length === 0) return 'Ninguno';
        const mapped = value.map((item) => (labelMap && labelMap[item]) || item);
        return sanitizeText(mapped.join(', ')) || 'No indicado';
    }
    const mapped = (labelMap && labelMap[value]) || value;
    return sanitizeText(mapped) || 'No indicado';
};

const resolveBudgetSummary = (formData, budgetSummary) => {
    if (budgetSummary && typeof budgetSummary === 'object') {
        return budgetSummary;
    }

    const projectType = formData.projectType || formData.category;
    const category = pricingData.categories.find((c) => c.id === projectType);
    const levelId = formData.selectedPlan || formData.level;
    const level = category?.levels.find((l) => l.id === levelId);
    const addonIds = formData.selectedAddons || formData.addons || [];
    const addons = addonIds
        .map((id) => pricingData.addons.find((a) => a.id === id))
        .filter(Boolean);

    const basePrice = level?.price || 0;
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);

    return {
        planName: level?.name || 'Plan personalizado',
        basePrice,
        addonsDetail:
            addons.length > 0
                ? addons.map((a) => `${a.name} (+$${a.price.toLocaleString('es-AR')})`).join(', ')
                : null,
        total: typeof formData.total === 'number' ? formData.total : basePrice + addonsTotal,
    };
};

/**
 * Generates a comprehensive PDF budget with all form data.
 * @param {Object} formData - All the form answers (or Cotizador selection)
 * @param {Object} [budgetSummary] - Pricing breakdown { planName, basePrice, addonsDetail, total }
 */
export const generatePDF = (formData = {}, budgetSummary) => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const pageBottom = 272;

    const summary = resolveBudgetSummary(formData, budgetSummary);
    const projectType = formData.projectType || formData.category;

    // Palette
    const darkBg = [10, 15, 28];
    const accentCyan = [0, 210, 255];
    const white = [255, 255, 255];
    const lightGray = [205, 213, 225];
    const sectionBg = [15, 23, 42];
    const cardBg = [20, 28, 46];
    const labelColor = [85, 95, 110];
    const valueColor = [20, 25, 38];
    const rowDivider = [229, 234, 242];

    const todayStr = new Date().toLocaleDateString('es-AR');

    // ─── HEADER (PAGE 1) ─────────────────────────────────
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, 48, 'F');
    doc.setFillColor(...accentCyan);
    doc.rect(0, 48, pageWidth, 2, 'F');

    doc.setTextColor(...white);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Maximiliano Plaza', margin, 21);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...lightGray);
    doc.text('Full Stack Developer · AI Solutions · Apps Móviles', margin, 29);

    doc.setTextColor(...accentCyan);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRESUPUESTO OFICIAL', pageWidth - margin, 21, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...lightGray);
    doc.text(`Fecha: ${todayStr}`, pageWidth - margin, 29, { align: 'right' });
    doc.text('Validez: 15 días hábiles', pageWidth - margin, 36, { align: 'right' });

    let y = 58;

    const addNewPage = () => {
        doc.addPage();
        doc.setFillColor(...darkBg);
        doc.rect(0, 0, pageWidth, 8, 'F');
        doc.setFillColor(...accentCyan);
        doc.rect(0, 8, pageWidth, 1.2, 'F');
        y = 18;
    };

    const ensureSpace = (neededHeight) => {
        if (y + neededHeight > pageBottom) {
            addNewPage();
        }
    };

    // ─── CLIENT INFO (IF PRESENT) ────────────────────────
    const hasClientInfo = formData.clientName || formData.clientEmail || formData.clientPhone;
    if (hasClientInfo) {
        const clientName = sanitizeText(formData.clientName || 'Cliente');
        const contactParts = [sanitizeText(formData.clientEmail), sanitizeText(formData.clientPhone)].filter(Boolean);
        const contactLine = contactParts.join('  ·  ') || 'Sin datos de contacto adicionales';

        doc.setFillColor(...cardBg);
        doc.roundedRect(margin, y, contentWidth, 26, 3, 3, 'F');

        doc.setTextColor(...accentCyan);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.text('INFORMACIÓN DEL CLIENTE', margin + 5, y + 7.5);

        doc.setTextColor(...white);
        doc.setFontSize(10.5);
        doc.text(clientName, margin + 5, y + 15.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...lightGray);
        doc.setFontSize(9);
        doc.text(contactLine, margin + 5, y + 22);

        y += 33;
    }

    // ─── PROJECT TYPE BADGE ──────────────────────────────
    const projectLabel = CATEGORY_LABELS[projectType] || sanitizeText(projectType) || 'Proyecto a medida';
    const projectTitle = sanitizeText(`${projectLabel}  —  ${summary.planName}`);
    doc.setFontSize(11.5);
    const titleLines = doc.splitTextToSize(projectTitle, contentWidth - 10);
    const badgeHeight = 14 + titleLines.length * 6;

    doc.setFillColor(0, 45, 65);
    doc.roundedRect(margin, y, contentWidth, badgeHeight, 3, 3, 'F');
    doc.setDrawColor(...accentCyan);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, badgeHeight, 3, 3, 'S');

    doc.setTextColor(...accentCyan);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('TIPO DE PROYECTO', margin + 5, y + 7.5);

    doc.setTextColor(...white);
    doc.setFontSize(11.5);
    doc.text(titleLines, margin + 5, y + 15.5);

    y += badgeHeight + 8;

    // ─── SECTION & ROW HELPERS ───────────────────────────
    const sectionHeader = (title) => {
        // Reserve room for header + at least one row to avoid orphaned headers
        ensureSpace(22);
        doc.setFillColor(...sectionBg);
        doc.roundedRect(margin, y, contentWidth, 9, 1.5, 1.5, 'F');
        doc.setFillColor(...accentCyan);
        doc.rect(margin, y, 3, 9, 'F');

        doc.setTextColor(...accentCyan);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(sanitizeText(title), margin + 7, y + 6.2);
        y += 13;
    };

    const labelColWidth = 58;
    const valueX = margin + labelColWidth + 2;
    const valueMaxWidth = contentWidth - labelColWidth - 4;

    const addRow = (label, rawValue, labelMap = null) => {
        const displayValue = formatValue(rawValue, labelMap);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        const lines = doc.splitTextToSize(displayValue, valueMaxWidth);
        const rowHeight = Math.max(7, lines.length * 4.6 + 2.5);

        ensureSpace(rowHeight);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...labelColor);
        doc.text(`${sanitizeText(label)}:`, margin + 2, y);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.8);
        doc.setTextColor(...valueColor);
        doc.text(lines, valueX, y);

        // Subtle row separator
        const lineY = y + rowHeight - 3.2;
        doc.setDrawColor(...rowDivider);
        doc.setLineWidth(0.2);
        doc.line(margin + 2, lineY, margin + contentWidth - 2, lineY);

        y += rowHeight;
    };

    // Detailed sections when coming from Formulario
    const isFullForm = Boolean(
        formData.businessName ||
        formData.businessCore ||
        formData.clientName ||
        formData.idealClient
    );

    if (isFullForm) {
        sectionHeader('INFORMACIÓN DEL NEGOCIO');
        addRow('Nombre del negocio', formData.businessName);
        addRow('Antigüedad', formData.businessAge);
        addRow('Producto / Servicio', formData.businessCore);
        addRow('Diferenciador clave', formData.differentiator);
        addRow('Cómo consigue clientes', formData.clientAcquisition);
        y += 4;

        sectionHeader('PROBLEMA ACTUAL');
        addRow('Mayor frustración', formData.mainPain);
        addRow('Por qué busca solución ahora', formData.whyNow);
        addRow('Tarea manual a eliminar', formData.manualTask);
        y += 4;

        sectionHeader('PÚBLICO OBJETIVO');
        addRow('Cliente ideal', formData.idealClient);
        addRow('Dispositivo principal', formData.mainDevice, DEVICE_LABELS);
        addRow('Queja más común', formData.clientComplaint);
        if (formData.internalUsers) {
            addRow('Usuarios internos', formData.internalUsers);
        }
        y += 4;

        sectionHeader('FUNCIONALIDADES REQUERIDAS');
        addRow('Definición de éxito', formData.successDefinition);
        addRow('Integraciones', formData.integrations, INTEGRATION_LABELS);
        addRow('Tiempo real', formData.realtimeData);
        addRow('Planea escalar', formData.scalePlan);
        addRow('Panel de administración', formData.needsAdmin);
        addRow('Notificaciones', formData.notificationType);
        y += 4;

        if (projectType === 'app') {
            sectionHeader('DETALLES DE LA APP MÓVIL');
            addRow('Plataforma', formData.platform, PLATFORM_LABELS);
            addRow('Uso sin conexión', formData.needsOffline);
            addRow('Notificaciones Push', formData.needsPushNotifications);
            addRow('Seguridad biométrica', formData.biometric);
            addRow('Uso de hardware', formData.hardwareFeatures, HARDWARE_LABELS);
            addRow('Frecuencia de uso', formData.usageFrequency);
            addRow('Distribución', formData.appDistribution);
            y += 4;
        } else if (projectType === 'system') {
            sectionHeader('DETALLES DEL SISTEMA DE GESTIÓN');
            addRow('Múltiples roles', formData.multipleRoles);
            addRow('Reportes y estadísticas', formData.needsReports);
            addRow('Módulos necesarios', formData.systemModules);
            addRow('Herramientas actuales', formData.currentTools);
            addRow('Flujo a automatizar', formData.automationFlow);
            y += 4;
        } else if (projectType === 'web') {
            sectionHeader('DETALLES DEL SITIO WEB');
            addRow('Secciones del menú', formData.menuSections);
            addRow('Destacado principal', formData.heroHighlight);
            addRow('E-commerce', formData.needsEcommerce);
            addRow('Blog / Noticias', formData.needsBlog);
            addRow('Multi-idioma', formData.needsMultilang);
            addRow('Redacción de textos', formData.contentWriter);
            y += 4;
        }

        sectionHeader('ESTÉTICA E IDENTIDAD VISUAL');
        addRow('Tiene logo / marca', formData.hasLogo);
        addRow('Colores principales', formData.brandColors);
        addRow('Estilo tipográfico', formData.typography);
        addRow('Referencias visuales', formData.referenceUrls);
        addRow('Tiene fotos propias', formData.hasPhotos);
        y += 4;

        sectionHeader('PLAZOS Y PRESUPUESTO');
        addRow('Fecha límite deseada', formData.deadline);
        addRow('Inversión disponible', formData.budget);
        addRow('Responsable de decisiones', formData.decisionMaker);
        addRow(
            'Dominio propio',
            formData.hasDomain
                ? formData.domainName
                    ? `Sí — ${formData.domainName}`
                    : 'Sí'
                : 'No'
        );
        addRow('Correos corporativos', formData.needsCorporateEmail);
        addRow('Mantenimiento mensual', formData.needsMaintenance);
        if (formData.extraNotes) {
            addRow('Notas adicionales', formData.extraNotes);
        }
        y += 6;
    }

    // ─── ECONOMIC SUMMARY ────────────────────────────────
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const addonsText = summary.addonsDetail
        ? sanitizeText(`Add-ons: ${summary.addonsDetail}`)
        : null;
    const addonLines = addonsText ? doc.splitTextToSize(addonsText, contentWidth - 12) : [];
    const summaryBoxHeight = 36 + (addonLines.length > 0 ? addonLines.length * 5 + 3 : 0);

    ensureSpace(summaryBoxHeight + 6);

    doc.setFillColor(0, 30, 50);
    doc.roundedRect(margin, y, contentWidth, summaryBoxHeight, 3.5, 3.5, 'F');
    doc.setDrawColor(...accentCyan);
    doc.setLineWidth(0.7);
    doc.roundedRect(margin, y, contentWidth, summaryBoxHeight, 3.5, 3.5, 'S');

    doc.setTextColor(...accentCyan);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN ECONÓMICO', margin + 6, y + 9);

    doc.setTextColor(...lightGray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(sanitizeText(`Plan base: ${summary.planName}`), margin + 6, y + 17);
    doc.text(`$${(summary.basePrice || 0).toLocaleString('es-AR')} ARS`, pageWidth - margin - 6, y + 17, {
        align: 'right',
    });

    let innerY = y + 17;
    if (addonLines.length > 0) {
        innerY += 6.5;
        doc.text(addonLines, margin + 6, innerY);
        innerY += (addonLines.length - 1) * 5;
    }

    innerY += 7;
    doc.setDrawColor(45, 75, 105);
    doc.setLineWidth(0.35);
    doc.line(margin + 6, innerY, pageWidth - margin - 6, innerY);

    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12.5);
    doc.text('INVERSIÓN TOTAL:', margin + 6, innerY + 8);

    doc.setTextColor(...accentCyan);
    doc.setFontSize(14);
    doc.text(`$${(summary.total || 0).toLocaleString('es-AR')} ARS`, pageWidth - margin - 6, innerY + 8, {
        align: 'right',
    });

    y += summaryBoxHeight + 8;

    // ─── DELIVERABLES ────────────────────────────────────
    const deliverables = [
        'Diseño UI/UX (Figma + Mockups)',
        'Frontend con React/Flutter & Backend Escalable',
        'Base de Datos Segura en Supabase',
        'Documentación Técnica + Video-Manual',
        'Garantía de 30 días post-entrega',
    ];
    const deliverablesHeight = 16 + deliverables.length * 6.5 + 3;

    ensureSpace(deliverablesHeight + 4);

    doc.setFillColor(...cardBg);
    doc.roundedRect(margin, y, contentWidth, deliverablesHeight, 3, 3, 'F');

    doc.setTextColor(...accentCyan);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('ENTREGABLES INCLUIDOS', margin + 6, y + 9);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.8);
    deliverables.forEach((item, index) => {
        const itemY = y + 17 + index * 6.5;
        doc.setFillColor(...accentCyan);
        doc.circle(margin + 7.5, itemY - 1.1, 0.9, 'F');
        doc.setTextColor(...lightGray);
        doc.text(item, margin + 11.5, itemY);
    });

    // ─── FOOTER ON ALL PAGES ─────────────────────────────
    const totalPages = doc.getNumberOfPages();
    const footerTop = pageHeight - 16;

    for (let page = 1; page <= totalPages; page++) {
        doc.setPage(page);
        doc.setFillColor(...darkBg);
        doc.rect(0, footerTop, pageWidth, 16, 'F');
        doc.setFillColor(...accentCyan);
        doc.rect(0, footerTop, pageWidth, 1.2, 'F');

        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...lightGray);
        doc.text(
            'Este presupuesto es estimativo y está sujeto a revisión técnica final.',
            pageWidth / 2,
            footerTop + 6.5,
            { align: 'center' }
        );

        doc.setTextColor(...accentCyan);
        doc.text('plazamaxi385@gmail.com  ·  +54 3875469814', pageWidth / 2, footerTop + 11.5, {
            align: 'center',
        });

        doc.setTextColor(...lightGray);
        doc.text(`Pág. ${page}/${totalPages}`, pageWidth - margin, footerTop + 11.5, {
            align: 'right',
        });
    }

    doc.save(`Presupuesto_MaximilianoPlaza_${todayStr.replace(/\//g, '-')}.pdf`);
};
