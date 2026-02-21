/**
 * Generates a professional PDF budget/proposal based on selected options.
 * @module utils/pdfGenerator
 * @param {Object} quoteData - The calculated pricing and selection data.
 */
export const generatePDF = (quoteData) => {
    const doc = new jsPDF();
    const { category, level, addons, total } = quoteData;

    // Colors
    const primaryColor = "#050505";
    const accentColor = "#00d2ff";

    // Header
    doc.setFillColor(5, 5, 5); // Dark background
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Maximiliano Plaza", 20, 20);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Full Stack Developer & AI Solutions", 20, 28);

    doc.setTextColor(0, 210, 255); // Cyan
    doc.text("COTIZACIÓN OFICIAL", 150, 25);

    // Date
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, 50);

    // Project Details
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Detalles del Proyecto", 20, 60);

    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 210, 255);
    doc.line(20, 63, 190, 63);

    let y = 75;

    // Selected Plan
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Tipo de Solución:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${category?.name || 'N/A'}`, 70, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text(`Nivel Seleccionado:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`${level?.name || 'N/A'}`, 70, y);
    y += 10;

    doc.setFont("helvetica", "bold");
    doc.text(`Precio Base:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(`$${(level?.price || 0).toLocaleString('es-AR')}`, 70, y);
    y += 15;

    // Add-ons
    if (addons && addons.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.text("Módulos Extra (Add-ons):", 20, y);
        y += 10;

        addons.forEach(addon => {
            doc.setFont("helvetica", "normal");
            doc.text(`• ${addon.name}`, 25, y);
            doc.text(`$${addon.price.toLocaleString('es-AR')}`, 150, y, { align: "right" });
            y += 8;
        });
        y += 5;
    }

    // Total
    doc.setDrawColor(0, 0, 0);
    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("INVERSIÓN TOTAL:", 20, y);
    doc.setTextColor(0, 210, 255);
    doc.text(`$${total.toLocaleString('es-AR')}`, 190, y, { align: "right" });

    y += 20;

    // "WOW" Deliverables
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Pack de Entregables WOW (Incluido):", 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const deliverables = [
        "Diseño UI/UX (Figma + Mockups)",
        "Frontend con React/Flutter & Backend Escalable",
        "Base de Datos Segura en Supabase",
        "Documentación Técnica y Video-Manual",
        "Garantía de 30 días post-entrega"
    ];

    deliverables.forEach(item => {
        doc.text(`• ${item}`, 25, y);
        y += 7;
    });

    // Footer
    y = 270;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Este documento es un presupuesto preliminar basado en la información proporcionada.", 105, y, { align: "center" });
    doc.text("Validez: 15 días hábiles.", 105, y + 5, { align: "center" });
    doc.text("Consultas: plazamax355@gmail.com | +54 3875469314", 105, y + 10, { align: "center" });

    // Save
    doc.save("Presupuesto_MaximilianoPlaza.pdf");
};
