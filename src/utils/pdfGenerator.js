import { jsPDF } from 'jspdf';
import { pricingData } from '../data/pricing';

/**
 * Generates a comprehensive PDF budget with all form data.
 * @param {Object} formData - All the form answers
 * @param {Object} budgetSummary - Pricing breakdown { planName, basePrice, addonsDetail, total }
 */
export const generatePDF = (formData, budgetSummary) => {
    const doc = new jsPDF();
    const pageWidth = 210;
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;

    // Colors
    const darkBg = [5, 5, 5];
    const accentCyan = [0, 210, 255];
    const white = [255, 255, 255];
    const lightGray = [200, 200, 200];
    const midGray = [120, 120, 120];
    const sectionBg = [18, 18, 28];
    const cardBg = [25, 25, 40];

    const categoryLabels = { web: 'Sitio Web', system: 'Sistema de Gestión', app: 'App Móvil' };
    const categoryIcons = { web: '🌐', system: '⚙️', app: '📱' };

    // ─── HEADER ────────────────────────────────────────
    doc.setFillColor(...darkBg);
    doc.rect(0, 0, pageWidth, 50, 'F');

    // Accent line
    doc.setFillColor(...accentCyan);
    doc.rect(0, 48, pageWidth, 2, 'F');

    doc.setTextColor(...white);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Maximiliano Plaza', margin, 22);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...lightGray);
    doc.text('Full Stack Developer · AI Solutions · Apps Móviles', margin, 30);

    doc.setTextColor(...accentCyan);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('PRESUPUESTO OFICIAL', pageWidth - margin, 22, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(...lightGray);
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-AR')}`, pageWidth - margin, 30, { align: 'right' });
    doc.text('Validez: 15 días hábiles', pageWidth - margin, 37, { align: 'right' });

    let y = 62;

    // ─── CLIENT INFO ────────────────────────────────────
    doc.setFillColor(...cardBg);
    doc.roundedRect(margin, y, contentWidth, 28, 3, 3, 'F');

    doc.setTextColor(...accentCyan);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL CLIENTE', margin + 5, y + 8);

    doc.setTextColor(...white);
    doc.setFontSize(10);
    doc.text(formData.clientName || 'Cliente', margin + 5, y + 17);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...lightGray);
    doc.setFontSize(9);
    doc.text(`${formData.clientEmail || ''}   ${formData.clientPhone ? '· ' + formData.clientPhone : ''}`, margin + 5, y + 24);

    y += 36;

    // ─── PROJECT TYPE BADGE ─────────────────────────────
    doc.setFillColor(0, 50, 70);
    doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'F');
    doc.setDrawColor(...accentCyan);
    doc.setLineWidth(0.5);
    doc.roundedRect(margin, y, contentWidth, 22, 3, 3, 'S');

    doc.setTextColor(...accentCyan);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('TIPO DE PROYECTO', margin + 5, y + 8);
    doc.setTextColor(...white);
    doc.setFontSize(12);
    doc.text(`${categoryIcons[formData.projectType] || ''} ${categoryLabels[formData.projectType] || formData.projectType}  —  ${budgetSummary.planName}`, margin + 5, y + 17);

    y += 30;

    // Helper: section header
    const sectionHeader = (title) => {
        doc.setFillColor(...sectionBg);
        doc.rect(margin, y, contentWidth, 10, 'F');
        doc.setFillColor(...accentCyan);
        doc.rect(margin, y, 3, 10, 'F');
        doc.setTextColor(...accentCyan);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text(title, margin + 8, y + 7);
        y += 14;
    };

    // Helper: row
    const addRow = (label, value) => {
        if (y > 265) { doc.addPage(); y = 20; }
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...midGray);
        doc.text(label + ':', margin + 2, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...white);
        const lines = doc.splitTextToSize(String(value || 'No indicado'), contentWidth - 55);
        doc.text(lines, margin + 55, y);
        y += Math.max(7, lines.length * 5.5);
    };

    // ─── BUSINESS INFO ──────────────────────────────────
    sectionHeader('📋  INFORMACIÓN DEL NEGOCIO');
    addRow('Nombre del negocio', formData.businessName);
    addRow('Antigüedad', formData.businessAge);
    addRow('Producto / Servicio', formData.businessCore);
    addRow('Diferenciador clave', formData.differentiator);
    addRow('Cómo consigue clientes', formData.clientAcquisition);
    y += 4;

    // ─── PROBLEM / PAIN ─────────────────────────────────
    sectionHeader('💡  PROBLEMA ACTUAL');
    addRow('Mayor frustración', formData.mainPain);
    addRow('Por qué busca solución ahora', formData.whyNow);
    addRow('Tarea manual a eliminar', formData.manualTask);
    y += 4;

    // ─── TARGET AUDIENCE ────────────────────────────────
    sectionHeader('🎯  PÚBLICO OBJETIVO');
    addRow('Cliente ideal', formData.idealClient);
    addRow('Dispositivo principal', formData.mainDevice);
    addRow('Queja más común', formData.clientComplaint);
    y += 4;

    // ─── FEATURES ───────────────────────────────────────
    sectionHeader('⚙️  FUNCIONALIDADES REQUERIDAS');
    addRow('Definición de éxito', formData.successDefinition);
    addRow('Integraciones', Array.isArray(formData.integrations) ? formData.integrations.join(', ') : formData.integrations);
    addRow('Tiempo real', formData.realtimeData ? 'Sí' : 'No');
    addRow('Planea escalar', formData.scalePlan ? 'Sí' : 'No');
    addRow('Panel de administración', formData.needsAdmin ? 'Sí' : 'No');
    addRow('Notificaciones', formData.notificationType);
    y += 4;

    // ─── AESTHETICS ─────────────────────────────────────
    sectionHeader('🎨  ESTÉTICA E IDENTIDAD VISUAL');
    addRow('Tiene logo/marca', formData.hasLogo ? 'Sí' : 'No');
    addRow('Colores principales', formData.brandColors);
    addRow('Estilo tipográfico', formData.typography);
    addRow('Referencias visuales', formData.referenceUrls);
    addRow('Tiene fotos propias', formData.hasPhotos ? 'Sí' : 'No');
    y += 4;

    // ─── TIMELINE ───────────────────────────────────────
    sectionHeader('📅  PLAZOS Y PRESUPUESTO');
    addRow('Fecha límite deseada', formData.deadline);
    addRow('Inversión disponible', formData.budget);
    addRow('Responsable de decisiones', formData.decisionMaker);
    addRow('Dominio propio', formData.hasDomain ? `Sí — ${formData.domainName || ''}` : 'No');
    addRow('Correos corporativos', formData.needsCorporateEmail ? 'Sí' : 'No');
    addRow('Mantenimiento mensual', formData.needsMaintenance ? 'Sí' : 'No');
    y += 8;

    // ─── BUDGET SUMMARY ─────────────────────────────────
    if (y > 230) { doc.addPage(); y = 20; }

    doc.setFillColor(0, 30, 50);
    doc.roundedRect(margin, y, contentWidth, budgetSummary.addonsDetail ? 52 : 38, 4, 4, 'F');
    doc.setDrawColor(...accentCyan);
    doc.setLineWidth(0.8);
    doc.roundedRect(margin, y, contentWidth, budgetSummary.addonsDetail ? 52 : 38, 4, 4, 'S');

    doc.setTextColor(...accentCyan);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('RESUMEN ECONÓMICO', margin + 6, y + 9);

    doc.setTextColor(...lightGray);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`Plan base: ${budgetSummary.planName}`, margin + 6, y + 18);
    doc.text(`$${budgetSummary.basePrice?.toLocaleString('es-AR')} ARS`, pageWidth - margin - 4, y + 18, { align: 'right' });

    let summaryY = y + 18;
    if (budgetSummary.addonsDetail) {
        summaryY += 7;
        doc.text(`Add-ons: ${budgetSummary.addonsDetail}`, margin + 6, summaryY);
    }

    summaryY += 10;
    doc.setDrawColor(50, 50, 80);
    doc.setLineWidth(0.3);
    doc.line(margin + 6, summaryY - 3, pageWidth - margin - 4, summaryY - 3);

    doc.setTextColor(...white);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.text('INVERSIÓN TOTAL:', margin + 6, summaryY + 5);
    doc.setTextColor(...accentCyan);
    doc.setFontSize(15);
    doc.text(`$${budgetSummary.total?.toLocaleString('es-AR')} ARS`, pageWidth - margin - 4, summaryY + 5, { align: 'right' });

    y = summaryY + 18;

    // ─── DELIVERABLES ───────────────────────────────────
    if (y > 245) { doc.addPage(); y = 20; }

    doc.setFillColor(...cardBg);
    doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F');

    doc.setTextColor(...accentCyan);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('📦  ENTREGABLES INCLUIDOS', margin + 5, y + 9);

    const deliverables = [
        'Diseño UI/UX (Figma + Mockups)',
        'Frontend con React/Flutter & Backend Escalable',
        'Base de Datos Segura en Supabase',
        'Documentación Técnica + Video-Manual',
        'Garantía de 30 días post-entrega'
    ];

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...lightGray);
    doc.setFontSize(8.5);
    deliverables.forEach((item, i) => {
        const col = i < 3 ? 0 : 1;
        const row = i < 3 ? i : i - 3;
        doc.text(`✓  ${item}`, margin + 5 + col * (contentWidth / 2), y + 17 + row * 7);
    });

    y += 46;

    // ─── FOOTER ─────────────────────────────────────────
    const footerY = 287;
    doc.setFillColor(...darkBg);
    doc.rect(0, footerY - 6, pageWidth, 14, 'F');
    doc.setFillColor(...accentCyan);
    doc.rect(0, footerY - 6, pageWidth, 1.5, 'F');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...midGray);
    doc.text('Este presupuesto es estimativo y está sujeto a revisión técnica final.', 105, footerY, { align: 'center' });
    doc.setTextColor(...accentCyan);
    doc.text('plazamaxi385@gmail.com   ·   +54 3875469814', 105, footerY + 5, { align: 'center' });

    doc.save(`Presupuesto_MaximilianoPlaza_${new Date().toLocaleDateString('es-AR').replace(/\//g, '-')}.pdf`);
};
