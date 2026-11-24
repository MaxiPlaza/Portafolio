import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Globe, Settings, Smartphone, ArrowRight, ArrowLeft,
    Check, Download, Send, CheckCircle2, ChevronRight,
    Monitor, Tablet, Wifi, WifiOff, Bell, Shield,
    Palette, Clock, DollarSign, Users, Zap, Star,
    MessageSquare, Mail, Phone, Building, Camera, MapPin,
    Bluetooth, RefreshCw, ShoppingCart, FileText, BarChart3,
    Loader2, X
} from 'lucide-react';
import { pricingData, calculateTotal } from '../../data/pricing';
import { generatePDF } from '../../utils/pdfGenerator';
import { sendFormEmail } from '../../utils/emailService';
import { cn } from '../../lib/utils';

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 9;

const PROJECT_TYPES = [
    {
        id: 'web',
        icon: Globe,
        label: 'Sitio Web',
        desc: 'Landing pages, portafolios, e-commerce y presencia digital profesional',
        gradient: 'from-blue-500/20 to-cyan-500/20',
        border: 'border-blue-500/40',
        color: 'text-blue-400',
        glow: 'shadow-blue-500/20',
    },
    {
        id: 'system',
        icon: Settings,
        label: 'Sistema de Gestión',
        desc: 'Software a medida para gestionar inventario, usuarios, ventas y más',
        gradient: 'from-violet-500/20 to-purple-500/20',
        border: 'border-violet-500/40',
        color: 'text-violet-400',
        glow: 'shadow-violet-500/20',
    },
    {
        id: 'app',
        icon: Smartphone,
        label: 'App Móvil',
        desc: 'Aplicaciones nativas e híbridas para Android e iOS con alto rendimiento',
        gradient: 'from-emerald-500/20 to-teal-500/20',
        border: 'border-emerald-500/40',
        color: 'text-emerald-400',
        glow: 'shadow-emerald-500/20',
    },
];

const DEVICE_OPTIONS = [
    { id: 'mobile', icon: Smartphone, label: 'Celular' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'desktop', icon: Monitor, label: 'Computadora' },
    { id: 'all', icon: Globe, label: 'Todos' },
];

const INTEGRATIONS = [
    { id: 'mercadopago', label: 'Mercado Pago', icon: DollarSign },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { id: 'instagram', label: 'Instagram Feed', icon: Camera },
    { id: 'excel', label: 'Excel / Sheets', icon: FileText },
    { id: 'afip', label: 'AFIP / Facturación', icon: Building },
    { id: 'maps', label: 'Google Maps', icon: MapPin },
    { id: 'barcode', label: 'Lector de código de barras', icon: BarChart3 },
    { id: 'push', label: 'Notificaciones Push', icon: Bell },
];

const HARDWARE_OPTIONS = [
    { id: 'camera', label: 'Cámara / QR', icon: Camera },
    { id: 'gps', label: 'GPS / Mapas', icon: MapPin },
    { id: 'bluetooth', label: 'Bluetooth', icon: Bluetooth },
    { id: 'none', label: 'Ninguno', icon: X },
];

const PLATFORM_OPTIONS = [
    { id: 'android', label: 'Android', desc: 'Play Store' },
    { id: 'ios', label: 'iOS (iPhone)', desc: 'App Store' },
    { id: 'both', label: 'Ambos', desc: 'Android + iOS' },
];

const TYPOGRAPHY_OPTIONS = [
    { id: 'modern', label: 'Moderna y limpia', example: 'Inter · Outfit' },
    { id: 'classic', label: 'Clásica con serif', example: 'Playfair · Georgia' },
    { id: 'handwriting', label: 'Tipo manuscrita', example: 'Pacifico · Dancing' },
    { id: 'techy', label: 'Técnica / Futurista', example: 'Space Mono · Exo' },
];

const COLOR_FEELINGS = [
    { id: 'trust', label: 'Confianza', colors: ['#1e40af', '#3b82f6', '#93c5fd'] },
    { id: 'energy', label: 'Energía', colors: ['#c2410c', '#f97316', '#fed7aa'] },
    { id: 'elegance', label: 'Elegancia', colors: ['#111827', '#374151', '#9ca3af'] },
    { id: 'nature', label: 'Naturaleza', colors: ['#14532d', '#16a34a', '#86efac'] },
    { id: 'creative', label: 'Creatividad', colors: ['#6d28d9', '#8b5cf6', '#c4b5fd'] },
    { id: 'tech', label: 'Tecnología', colors: ['#0c4a6e', '#0ea5e9', '#7dd3fc'] },
];

const BUSINESS_AGE_OPTIONS = ['Nuevo proyecto (todavía no lancé)', 'Menos de 1 año', '1 a 3 años', '3 a 10 años', 'Más de 10 años'];
const CLIENT_ACQ_OPTIONS = ['Boca en boca', 'Redes sociales', 'Local / Punto de venta', 'Publicidad paga', 'Referidos / Partners', 'Otra'];
const NOTIFICATION_OPTIONS = ['Por email', 'Por WhatsApp', 'Notificación en la misma app', 'No necesito notificaciones'];
const BUDGET_RANGES = ['Menos de $100.000', '$100.000 - $200.000', '$200.000 - $350.000', '$350.000 - $500.000', 'Más de $500.000', 'A definir'];
const USAGE_FREQ = ['Todos los días', 'Varias veces por semana', 'Una vez por semana', 'Una vez al mes o menos'];
const CONTENT_WRITER = ['Lo redacto yo', 'Necesito que vos (con IA) lo redactes', 'Entre los dos'];

// ─── UTILITY COMPONENTS ──────────────────────────────────────────────────────

const ProgressBar = ({ step, total }) => (
    <div className="w-full">
        <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 font-medium">Paso {step} de {total}</span>
            <span className="text-xs text-accent font-bold">{Math.round((step / total) * 100)}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <motion.div
                className="h-full bg-gradient-to-r from-accent to-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(step / total) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
        </div>
    </div>
);

const StepTitle = ({ icon: Icon, title, subtitle }) => (
    <div className="mb-8 text-center">
        {Icon && (
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-7 h-7 text-accent" />
            </div>
        )}
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm max-w-md mx-auto">{subtitle}</p>}
    </div>
);

const SelectCard = ({ selected, onClick, children, className = '' }) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className={cn(
            'cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative',
            selected
                ? 'bg-accent/10 border-accent shadow-lg shadow-accent/10'
                : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20',
            className
        )}
    >
        {selected && (
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-5 h-5 rounded-full bg-accent flex items-center justify-center"
            >
                <Check className="w-3 h-3 text-primary" />
            </motion.div>
        )}
        {children}
    </motion.div>
);

const MultiSelect = ({ options, selected, onToggle, columns = 2 }) => (
    <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-3`}>
        {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = Array.isArray(selected)
                ? selected.includes(opt.id)
                : selected === opt.id;
            return (
                <SelectCard key={opt.id} selected={isSelected} onClick={() => onToggle(opt.id)}>
                    <div className="flex items-center gap-3">
                        {Icon && <Icon className={cn('w-5 h-5 shrink-0', isSelected ? 'text-accent' : 'text-gray-400')} />}
                        <div>
                            <p className={cn('font-medium text-sm', isSelected ? 'text-accent' : 'text-gray-200')}>{opt.label}</p>
                            {opt.desc && <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>}
                        </div>
                    </div>
                </SelectCard>
            );
        })}
    </div>
);

const InputField = ({ label, value, onChange, placeholder, type = 'text', required = false }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">
            {label} {required && <span className="text-accent">*</span>}
        </label>
        <input
            type={type}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-white/8 transition-all duration-300"
        />
    </div>
);

const TextArea = ({ label, value, onChange, placeholder, rows = 3 }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-gray-300">{label}</label>
        <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent/50 focus:bg-white/8 transition-all duration-300 resize-none"
        />
    </div>
);

const ChipSelect = ({ options, selected, onSelect, multi = false }) => (
    <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
            const isSelected = multi ? (Array.isArray(selected) && selected.includes(opt)) : selected === opt;
            return (
                <motion.button
                    key={opt}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        if (multi) {
                            const arr = Array.isArray(selected) ? selected : [];
                            onSelect(isSelected ? arr.filter(s => s !== opt) : [...arr, opt]);
                        } else {
                            onSelect(opt);
                        }
                    }}
                    className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200',
                        isSelected
                            ? 'bg-accent/15 border-accent text-accent'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                    )}
                >
                    {opt}
                </motion.button>
            );
        })}
    </div>
);

const YesNoToggle = ({ label, value, onChange, hint }) => (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-white/5 last:border-0">
        <div>
            <p className="text-sm font-medium text-gray-200">{label}</p>
            {hint && <p className="text-xs text-gray-500 mt-0.5">{hint}</p>}
        </div>
        <div className="flex gap-2 shrink-0">
            {['Sí', 'No'].map((opt) => (
                <button
                    key={opt}
                    onClick={() => onChange(opt === 'Sí')}
                    className={cn(
                        'px-4 py-1.5 rounded-full text-xs font-semibold border transition-all',
                        value === (opt === 'Sí')
                            ? 'bg-accent/15 border-accent text-accent'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30'
                    )}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

// ─── STEP COMPONENTS ─────────────────────────────────────────────────────────

const StepIntro = ({ onStart }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center text-center py-12 space-y-8"
    >
        <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent/20 to-blue-500/20 border border-accent/30 flex items-center justify-center shadow-2xl shadow-accent/10">
                <FileText className="w-12 h-12 text-accent" />
            </div>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-2 rounded-3xl border border-accent/10"
            />
        </div>

        <div className="space-y-3 max-w-lg">
            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                Contame tu <span className="text-accent">proyecto</span>
            </h2>
            <p className="text-gray-400 leading-relaxed">
                Completá este formulario y obtené un presupuesto personalizado en minutos.
                Cuánto más detalle, mejor puedo ayudarte a hacer realidad tu idea.
            </p>
        </div>

        <div className="grid grid-cols-3 gap-4 w-full max-w-sm">
            {[
                { icon: Clock, label: '5 min', sub: 'para completar' },
                { icon: FileText, label: 'PDF', sub: 'al finalizar' },
                { icon: Mail, label: 'Email', sub: 'automático' },
            ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center gap-1 p-3 bg-white/5 rounded-xl border border-white/10">
                    <Icon className="w-5 h-5 text-accent" />
                    <span className="text-white font-bold text-sm">{label}</span>
                    <span className="text-gray-500 text-xs">{sub}</span>
                </div>
            ))}
        </div>

        <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-accent to-blue-400 text-primary font-bold rounded-2xl shadow-xl shadow-accent/25 text-base"
        >
            Comenzar ahora <ArrowRight className="w-5 h-5" />
        </motion.button>
    </motion.div>
);

const StepProjectType = ({ formData, setFormData }) => (
    <div>
        <StepTitle icon={Zap} title="¿Qué tipo de proyecto necesitás?" subtitle="Elegí la categoría que mejor describe lo que tenés en mente" />
        <div className="grid grid-cols-1 gap-4">
            {PROJECT_TYPES.map((type) => {
                const Icon = type.icon;
                const selected = formData.projectType === type.id;
                return (
                    <motion.div
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData(p => ({ ...p, projectType: type.id }))}
                        className={cn(
                            'cursor-pointer rounded-2xl border p-5 transition-all duration-300 relative bg-gradient-to-br',
                            selected
                                ? `${type.gradient} ${type.border} shadow-xl ${type.glow}`
                                : 'from-white/3 to-white/0 border-white/10 hover:border-white/20'
                        )}
                    >
                        <div className="flex items-center gap-4">
                            <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', selected ? 'bg-white/10' : 'bg-white/5')}>
                                <Icon className={cn('w-6 h-6', selected ? type.color : 'text-gray-400')} />
                            </div>
                            <div className="flex-1">
                                <p className={cn('font-bold text-base', selected ? type.color : 'text-white')}>{type.label}</p>
                                <p className="text-gray-400 text-sm mt-0.5">{type.desc}</p>
                            </div>
                            {selected && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    className="w-7 h-7 rounded-full bg-accent flex items-center justify-center shrink-0">
                                    <Check className="w-4 h-4 text-primary" />
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    </div>
);

const StepBusinessInfo = ({ formData, setFormData }) => {
    const set = (key) => (val) => setFormData(p => ({ ...p, [key]: val }));
    return (
        <div>
            <StepTitle icon={Building} title="Contame sobre tu negocio" subtitle="Esta información ayuda a entender mejor el contexto de tu proyecto" />
            <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputField label="Nombre del negocio / proyecto" value={formData.businessName} onChange={set('businessName')} placeholder="Ej: Ferretería El Tornillo" required />
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Antigüedad del negocio</label>
                        <ChipSelect options={BUSINESS_AGE_OPTIONS} selected={formData.businessAge} onSelect={set('businessAge')} />
                    </div>
                </div>
                <TextArea label="¿Qué vendés o qué servicio ofrecés? (describilo con detalle)" value={formData.businessCore} onChange={set('businessCore')} placeholder="Ej: Vendo ropa deportiva al por mayor y menor, principalmente a través de Instagram..." rows={3} />
                <TextArea label="¿Qué te diferencia de tu competencia?" value={formData.differentiator} onChange={set('differentiator')} placeholder="Ej: Precios más bajos, atención personalizada, entrega en 24 hs..." rows={2} />
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">¿Cómo conseguís clientes actualmente?</label>
                    <ChipSelect options={CLIENT_ACQ_OPTIONS} selected={formData.clientAcquisition} onSelect={set('clientAcquisition')} multi />
                </div>
                <TextArea label="¿Qué es lo que más te frustra hoy en la gestión de tu negocio?" value={formData.mainPain} onChange={set('mainPain')} placeholder="Ej: Tardo horas en hacer presupuestos, se me olvidan los turnos, la gente siempre me pregunta lo mismo por WhatsApp..." rows={3} />
                <TextArea label="¿Por qué decidiste buscar una solución digital justo ahora?" value={formData.whyNow} onChange={set('whyNow')} placeholder="Ej: Crecí mucho este año y ya no puedo manejarlo todo a mano..." rows={2} />
                <TextArea label="Si tuvieras esta herramienta funcionando, ¿qué tarea dejarías de hacer manualmente?" value={formData.manualTask} onChange={set('manualTask')} placeholder="Ej: Pasar pedidos a un Excel, recordar turnos, responder las mismas preguntas..." rows={2} />
            </div>
        </div>
    );
};

const StepTargetAudience = ({ formData, setFormData }) => {
    const set = (key) => (val) => setFormData(p => ({ ...p, [key]: val }));
    return (
        <div>
            <StepTitle icon={Users} title="¿Quién va a usar esto?" subtitle="Entender a tu usuario es clave para diseñar la mejor experiencia" />
            <div className="space-y-6">
                <TextArea label="¿Quién es tu cliente ideal? Describilo" value={formData.idealClient} onChange={set('idealClient')} placeholder="Ej: Adultos de 30-50 años, de Salta, que no son muy tecnológicos pero tienen celular Android..." rows={3} />
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">¿Desde qué dispositivo crees que van a entrar más tus usuarios?</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {DEVICE_OPTIONS.map(({ id, icon: Icon, label }) => {
                            const selected = formData.mainDevice === id;
                            return (
                                <SelectCard key={id} selected={selected} onClick={() => set('mainDevice')(id)}>
                                    <div className="flex flex-col items-center gap-2 py-1">
                                        <Icon className={cn('w-6 h-6', selected ? 'text-accent' : 'text-gray-400')} />
                                        <p className={cn('text-sm font-medium text-center', selected ? 'text-accent' : 'text-gray-300')}>{label}</p>
                                    </div>
                                </SelectCard>
                            );
                        })}
                    </div>
                </div>
                <TextArea label="¿Cuál es la queja más común que recibís de tus clientes actuales?" value={formData.clientComplaint} onChange={set('clientComplaint')} placeholder="Ej: No me contestan, es difícil comprarte, no entiendo tus precios..." rows={2} />
                <InputField label="¿Cuántas personas van a usar la herramienta internamente? (empleados)" value={formData.internalUsers} onChange={set('internalUsers')} placeholder="Ej: Solo yo, 2 vendedores, un equipo de 10 personas..." />
            </div>
        </div>
    );
};

const StepFeatures = ({ formData, setFormData }) => {
    const set = (key) => (val) => setFormData(p => ({ ...p, [key]: val }));
    const toggleIntegration = (id) => {
        const arr = formData.integrations || [];
        setFormData(p => ({
            ...p,
            integrations: arr.includes(id) ? arr.filter(i => i !== id) : [...arr, id]
        }));
    };
    return (
        <div>
            <StepTitle icon={Zap} title="¿Qué funcionalidades necesitás?" subtitle="Marcá todo lo que se aplique a tu proyecto" />
            <div className="space-y-6">
                <TextArea label="¿Qué acción sería un 'éxito' para vos?" value={formData.successDefinition} onChange={set('successDefinition')} placeholder="Ej: Que el cliente pague online, que me llegue una notificación cuando alguien se registra, que se genere una factura automática..." rows={2} />
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">Integraciones y herramientas (seleccioná las que necesitás)</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {INTEGRATIONS.map(({ id, label, icon: Icon }) => {
                            const selected = (formData.integrations || []).includes(id);
                            return (
                                <SelectCard key={id} selected={selected} onClick={() => toggleIntegration(id)}>
                                    <div className="flex items-center gap-3">
                                        <Icon className={cn('w-5 h-5 shrink-0', selected ? 'text-accent' : 'text-gray-400')} />
                                        <span className={cn('text-sm font-medium', selected ? 'text-accent' : 'text-gray-200')}>{label}</span>
                                    </div>
                                </SelectCard>
                            );
                        })}
                    </div>
                </div>
                <div className="space-y-1 bg-white/3 rounded-2xl p-4 border border-white/8">
                    <YesNoToggle label="¿La información debe actualizarse en tiempo real?" hint="Ej: stock en vivo, turnos en tiempo real" value={formData.realtimeData} onChange={set('realtimeData')} />
                    <YesNoToggle label="¿Planeás escalar el negocio pronto?" hint="Ej: nuevas sucursales, vender en otras provincias" value={formData.scalePlan} onChange={set('scalePlan')} />
                    <YesNoToggle label="¿Necesitás panel de administración propio?" hint="Para cambiar precios, subir fotos, ver mensajes sin llamarme" value={formData.needsAdmin} onChange={set('needsAdmin')} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">¿Querés recibir notificaciones cuando alguien haga algo en tu web/app?</label>
                    <ChipSelect options={NOTIFICATION_OPTIONS} selected={formData.notificationType} onSelect={set('notificationType')} />
                </div>
            </div>
        </div>
    );
};

const StepSpecificQuestions = ({ formData, setFormData }) => {
    const set = (key) => (val) => setFormData(p => ({ ...p, [key]: val }));
    const toggleArr = (key, id) => {
        const arr = formData[key] || [];
        setFormData(p => ({
            ...p,
            [key]: arr.includes(id) ? arr.filter(i => i !== id) : [...arr, id]
        }));
    };

    if (formData.projectType === 'app') {
        return (
            <div>
                <StepTitle icon={Smartphone} title="Detalles de tu App Móvil" subtitle="Estas preguntas son clave para definir la arquitectura de tu aplicación" />
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300">¿En qué plataforma necesitás la app?</label>
                        <div className="grid grid-cols-3 gap-3">
                            {PLATFORM_OPTIONS.map(({ id, label, desc }) => {
                                const selected = formData.platform === id;
                                return (
                                    <SelectCard key={id} selected={selected} onClick={() => set('platform')(id)}>
                                        <p className={cn('font-bold text-center text-sm', selected ? 'text-accent' : 'text-white')}>{label}</p>
                                        <p className="text-xs text-gray-500 text-center mt-1">{desc}</p>
                                    </SelectCard>
                                );
                            })}
                        </div>
                    </div>
                    <div className="space-y-1 bg-white/3 rounded-2xl p-4 border border-white/8">
                        <YesNoToggle label="¿Necesitás que funcione sin internet?" hint="Los datos se cargan offline y se sincronizan después" value={formData.needsOffline} onChange={set('needsOffline')} />
                        <YesNoToggle label="¿Notificaciones Push?" hint="Alertas al celular, como hace WhatsApp o Instagram" value={formData.needsPushNotifications} onChange={set('needsPushNotifications')} />
                        <YesNoToggle label="¿Seguridad biométrica?" hint="Huella digital o reconocimiento facial para entrar" value={formData.biometric} onChange={set('biometric')} />
                    </div>
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-300">¿La app necesita usar hardware del dispositivo?</label>
                        <MultiSelect options={HARDWARE_OPTIONS} selected={formData.hardwareFeatures || []} onToggle={(id) => toggleArr('hardwareFeatures', id)} columns={2} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">¿Con qué frecuencia el usuario va a usar la app?</label>
                        <ChipSelect options={USAGE_FREQ} selected={formData.usageFrequency} onSelect={set('usageFrequency')} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">¿Cómo preferís distribuir la app?</label>
                        <ChipSelect options={['Play Store / App Store', 'PWA (se instala desde el navegador, gratis)', 'Ambas formas']} selected={formData.appDistribution} onSelect={set('appDistribution')} />
                    </div>
                </div>
            </div>
        );
    }

    if (formData.projectType === 'system') {
        return (
            <div>
                <StepTitle icon={Settings} title="Detalles de tu Sistema de Gestión" subtitle="Vamos a definir qué módulos y capacidades necesita tu sistema" />
                <div className="space-y-6">
                    <div className="space-y-1 bg-white/3 rounded-2xl p-4 border border-white/8">
                        <YesNoToggle label="¿Necesitás múltiples roles de usuario?" hint="Ej: admin, vendedor, gerente con distintos permisos" value={formData.multipleRoles} onChange={set('multipleRoles')} />
                        <YesNoToggle label="¿Querés reportes y estadísticas?" hint="Gráficos, exportación a Excel/PDF, métricas" value={formData.needsReports} onChange={set('needsReports')} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">¿Qué módulos necesitás? (seleccioná todos los que apliquen)</label>
                        <ChipSelect
                            options={['Inventario / Stock', 'Ventas y facturación', 'Clientes / CRM', 'Turnos y agenda', 'Caja y finanzas', 'Compras a proveedores', 'Recursos humanos', 'Otro']}
                            selected={formData.systemModules || []}
                            onSelect={set('systemModules')}
                            multi
                        />
                    </div>
                    <TextArea label="¿Qué usás hoy para gestionar tu negocio? (Excel, papel, otra app...)" value={formData.currentTools} onChange={set('currentTools')} placeholder="Ej: Un Excel que yo armé, una planilla compartida en Drive, papel y birome..." rows={2} />
                    <TextArea label="¿Algún flujo específico que querés automatizar?" value={formData.automationFlow} onChange={set('automationFlow')} placeholder="Ej: Cuando llega un pedido, que se descuente del stock automáticamente y me mande un WhatsApp..." rows={3} />
                </div>
            </div>
        );
    }

    // Web
    return (
        <div>
            <StepTitle icon={Globe} title="Detalles de tu Sitio Web" subtitle="Definamos la estructura y funcionalidades de tu sitio" />
            <div className="space-y-6">
                <TextArea label="¿Qué secciones querés en el menú principal?" value={formData.menuSections} onChange={set('menuSections')} placeholder="Ej: Inicio, Nosotros, Servicios, Catálogo, Contacto, Blog..." rows={2} />
                <TextArea label="Si tuvieras que elegir una sola cosa que el usuario vea al entrar, ¿qué sería?" value={formData.heroHighlight} onChange={set('heroHighlight')} placeholder="Ej: Un banner con mi oferta principal, un botón de WhatsApp, un buscador de productos..." rows={2} />
                <div className="space-y-1 bg-white/3 rounded-2xl p-4 border border-white/8">
                    <YesNoToggle label="¿Necesitás vender productos online (e-commerce)?" hint="Carrito de compras + pasarela de pagos" value={formData.needsEcommerce} onChange={set('needsEcommerce')} />
                    <YesNoToggle label="¿Necesitás sección de blog / noticias?" value={formData.needsBlog} onChange={set('needsBlog')} />
                    <YesNoToggle label="¿El contenido necesita estar en más de un idioma?" value={formData.needsMultilang} onChange={set('needsMultilang')} />
                    <YesNoToggle label="¿Tenés preguntas frecuentes (FAQ) ya redactadas?" value={formData.hasFaq} onChange={set('hasFaq')} />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">¿Quién va a redactar los textos del sitio?</label>
                    <ChipSelect options={CONTENT_WRITER} selected={formData.contentWriter} onSelect={set('contentWriter')} />
                </div>
                <div className="space-y-1 bg-white/3 rounded-2xl p-4 border border-white/8">
                    <YesNoToggle label="¿Querés integrar tu feed de Instagram en vivo?" value={formData.instagramFeed} onChange={set('instagramFeed')} />
                    <YesNoToggle label="¿Necesitás buscador interno de productos?" value={formData.needsSearch} onChange={set('needsSearch')} />
                    <YesNoToggle label="¿Tenés testimonios reales de clientes para mostrar?" value={formData.hasTestimonials} onChange={set('hasTestimonials')} />
                </div>
            </div>
        </div>
    );
};

const StepAesthetics = ({ formData, setFormData }) => {
    const set = (key) => (val) => setFormData(p => ({ ...p, [key]: val }));
    return (
        <div>
            <StepTitle icon={Palette} title="Estética e identidad visual" subtitle="El diseño importa. Definamos el look & feel de tu proyecto" />
            <div className="space-y-6">
                <div className="space-y-1 bg-white/3 rounded-2xl p-4 border border-white/8">
                    <YesNoToggle label="¿Ya contás con logo o manual de marca?" hint="Archivos en SVG, AI o PNG sin fondo" value={formData.hasLogo} onChange={set('hasLogo')} />
                    <YesNoToggle label="¿Tenés fotos propias de alta calidad?" hint="De tu local, productos o equipo" value={formData.hasPhotos} onChange={set('hasPhotos')} />
                    <YesNoToggle label="¿Contás con testimonios reales de clientes?" value={formData.hasTestimonials} onChange={set('hasTestimonials')} />
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">¿Qué sensación querés transmitir con los colores?</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {COLOR_FEELINGS.map(({ id, label, colors }) => {
                            const selected = formData.brandColors === label;
                            return (
                                <SelectCard key={id} selected={selected} onClick={() => set('brandColors')(label)}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {colors.map(c => (
                                            <div key={c} className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                    <p className={cn('text-sm font-medium', selected ? 'text-accent' : 'text-gray-200')}>{label}</p>
                                </SelectCard>
                            );
                        })}
                    </div>
                </div>
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">¿Qué estilo de tipografía preferís?</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {TYPOGRAPHY_OPTIONS.map(({ id, label, example }) => {
                            const selected = formData.typography === label;
                            return (
                                <SelectCard key={id} selected={selected} onClick={() => set('typography')(label)}>
                                    <p className={cn('font-medium text-sm', selected ? 'text-accent' : 'text-white')}>{label}</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{example}</p>
                                </SelectCard>
                            );
                        })}
                    </div>
                </div>
                <TextArea label="¿Hay sitios web o apps que te gusten visualmente? Pegá los links" value={formData.referenceUrls} onChange={set('referenceUrls')} placeholder="Ej: https://ejemplo.com — me gusta la paleta de colores y las animaciones..." rows={3} />
            </div>
        </div>
    );
};

const StepTimeline = ({ formData, setFormData }) => {
    const set = (key) => (val) => setFormData(p => ({ ...p, [key]: val }));
    return (
        <div>
            <StepTitle icon={Clock} title="Plazos y presupuesto" subtitle="Esta información me permite priorizar y ofrecerte la mejor propuesta" />
            <div className="space-y-6">
                <InputField label="¿Tenés una fecha límite para el lanzamiento?" value={formData.deadline} onChange={set('deadline')} placeholder="Ej: Fines de agosto, antes de navidad, sin fecha fija..." />
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">¿Cuál es tu rango de inversión disponible?</label>
                    <ChipSelect options={BUDGET_RANGES} selected={formData.budget} onSelect={set('budget')} />
                </div>
                <InputField label="¿Quién será el responsable de tomar las decisiones y aprobar los avances?" value={formData.decisionMaker} onChange={set('decisionMaker')} placeholder="Ej: Yo mismo, mi socio, el director de la empresa..." />
                <div className="space-y-1 bg-white/3 rounded-2xl p-4 border border-white/8">
                    <YesNoToggle label="¿Ya tenés un dominio comprado?" hint="Ej: tuempresa.com o tuempresa.com.ar" value={formData.hasDomain} onChange={set('hasDomain')} />
                    {formData.hasDomain && (
                        <div className="pt-2">
                            <InputField label="¿Cuál es el dominio?" value={formData.domainName} onChange={set('domainName')} placeholder="Ej: miempresa.com.ar" />
                        </div>
                    )}
                    <YesNoToggle label="¿Necesitás correos corporativos?" hint="Ej: info@tuempresa.com" value={formData.needsCorporateEmail} onChange={set('needsCorporateEmail')} />
                    <YesNoToggle label="¿Querés mantenimiento mensual del proyecto?" hint="Actualizaciones de seguridad, backups y cambios menores" value={formData.needsMaintenance} onChange={set('needsMaintenance')} />
                </div>
                <TextArea label="¿Algo más que quieras contarme sobre el proyecto?" value={formData.extraNotes} onChange={set('extraNotes')} placeholder="Cualquier detalle adicional, idea o funcionalidad que se te ocurra..." rows={3} />
            </div>
        </div>
    );
};

const StepPlanSelection = ({ formData, setFormData }) => {
    const category = pricingData.categories.find(c => c.id === formData.projectType);
    if (!category) return null;

    return (
        <div>
            <StepTitle icon={Star} title={`Elegí tu plan de ${category.name}`} subtitle="Estos son los paquetes disponibles para tu tipo de proyecto" />
            <div className="grid grid-cols-1 gap-4">
                {category.levels.map((level, idx) => {
                    const selected = formData.selectedPlan === level.id;
                    const isRecommended = idx === 1;
                    return (
                        <motion.div
                            key={level.id}
                            whileHover={{ scale: 1.01 }}
                            onClick={() => setFormData(p => ({ ...p, selectedPlan: level.id }))}
                            className={cn(
                                'cursor-pointer rounded-2xl border p-5 transition-all duration-300 relative',
                                selected
                                    ? 'bg-accent/10 border-accent shadow-xl shadow-accent/10'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                            )}
                        >
                            {isRecommended && (
                                <div className="absolute -top-3 left-5">
                                    <span className="px-3 py-1 bg-accent text-primary text-xs font-bold rounded-full">⭐ Más elegido</span>
                                </div>
                            )}
                            <div className="flex items-start justify-between gap-4 mt-1">
                                <div className="flex-1">
                                    <h3 className={cn('font-bold text-lg', selected ? 'text-accent' : 'text-white')}>{level.name}</h3>
                                    <ul className="mt-3 space-y-1.5">
                                        {level.features.map(f => (
                                            <li key={f} className="flex items-center gap-2 text-sm text-gray-400">
                                                <Check className={cn('w-3.5 h-3.5 shrink-0', selected ? 'text-accent' : 'text-gray-600')} />
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className={cn('text-2xl font-bold', selected ? 'text-accent' : 'text-white')}>
                                        ${level.price.toLocaleString('es-AR')}
                                    </p>
                                    <p className="text-xs text-gray-500">ARS</p>
                                    {selected && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                                            className="mt-2 w-7 h-7 rounded-full bg-accent flex items-center justify-center ml-auto">
                                            <Check className="w-4 h-4 text-primary" />
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Add-ons */}
            <div className="mt-6">
                <h4 className="text-white font-bold mb-3 text-sm">Módulos extra (opcionales)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pricingData.addons.map(addon => {
                        const selected = (formData.selectedAddons || []).includes(addon.id);
                        return (
                            <SelectCard
                                key={addon.id}
                                selected={selected}
                                onClick={() => {
                                    const arr = formData.selectedAddons || [];
                                    setFormData(p => ({
                                        ...p,
                                        selectedAddons: selected ? arr.filter(id => id !== addon.id) : [...arr, addon.id]
                                    }));
                                }}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className={cn('font-semibold text-sm', selected ? 'text-accent' : 'text-gray-200')}>{addon.name}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">{addon.description}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 shrink-0">+${addon.price.toLocaleString('es-AR')}</p>
                                </div>
                            </SelectCard>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const StepContactInfo = ({ formData, setFormData }) => {
    const set = (key) => (val) => setFormData(p => ({ ...p, [key]: val }));
    return (
        <div>
            <StepTitle icon={Mail} title="¡Casi listo! Tus datos de contacto" subtitle="Para enviarte el presupuesto y poder comunicarme con vos" />
            <div className="space-y-4">
                <InputField label="Tu nombre completo" value={formData.clientName} onChange={set('clientName')} placeholder="Ej: Juan García" required />
                <InputField label="Tu email" value={formData.clientEmail} onChange={set('clientEmail')} placeholder="Ej: juan@empresa.com" type="email" required />
                <InputField label="Tu teléfono / WhatsApp" value={formData.clientPhone} onChange={set('clientPhone')} placeholder="Ej: +54 387 123-4567" />
                <div className="mt-6 p-4 bg-accent/5 border border-accent/20 rounded-2xl text-sm text-gray-400">
                    <p className="flex items-start gap-2">
                        <Shield className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                        Tu información es confidencial y solo se usa para preparar tu propuesta. Nunca se comparte con terceros.
                    </p>
                </div>
            </div>
        </div>
    );
};

const StepSummary = ({ formData, budgetSummary, onDownloadPDF, onSendEmail, emailStatus, emailError }) => {
    const categoryLabels = { web: 'Sitio Web', system: 'Sistema de Gestión', app: 'App Móvil' };
    const categoryIcons = { web: '🌐', system: '⚙️', app: '📱' };

    const DashboardCard = ({ title, icon, children }) => (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{icon}</span>
                <h4 className="text-white font-bold text-sm">{title}</h4>
            </div>
            <div className="space-y-2">
                {children}
            </div>
        </div>
    );

    const InfoRow = ({ label, value }) => {
        if (!value) return null;
        const displayVal = typeof value === 'boolean' ? (value ? 'Sí ✓' : 'No') :
            Array.isArray(value) ? value.join(', ') : value;
        return (
            <div className="flex justify-between gap-3 text-sm border-b border-white/5 pb-2 last:border-0 last:pb-0">
                <span className="text-gray-400 shrink-0">{label}</span>
                <span className="text-gray-200 text-right">{displayVal}</span>
            </div>
        );
    };

    return (
        <div>
            <div className="text-center mb-8">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4"
                >
                    <CheckCircle2 className="w-8 h-8 text-green-400" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">¡Formulario completo!</h2>
                <p className="text-gray-400 text-sm">Aquí está el resumen de tu proyecto</p>
            </div>

            {/* Budget Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-6 bg-gradient-to-br from-accent/10 to-blue-500/5 border border-accent/30 rounded-2xl text-center"
            >
                <p className="text-gray-400 text-sm mb-1">
                    {categoryIcons[formData.projectType]} {categoryLabels[formData.projectType]} — {budgetSummary.planName}
                </p>
                <div className="text-4xl font-bold text-accent mb-1">
                    ${budgetSummary.total?.toLocaleString('es-AR')}
                    <span className="text-lg text-gray-400 font-normal"> ARS</span>
                </div>
                {budgetSummary.addonsDetail && (
                    <p className="text-xs text-gray-500 mt-1">Incluye add-ons: {budgetSummary.addonsDetail}</p>
                )}
            </motion.div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <DashboardCard title="Negocio" icon="🏢">
                    <InfoRow label="Nombre" value={formData.businessName} />
                    <InfoRow label="Antigüedad" value={formData.businessAge} />
                    <InfoRow label="Diferenciador" value={formData.differentiator} />
                </DashboardCard>

                <DashboardCard title="Público objetivo" icon="🎯">
                    <InfoRow label="Cliente ideal" value={formData.idealClient} />
                    <InfoRow label="Dispositivo" value={formData.mainDevice} />
                    <InfoRow label="Usuarios internos" value={formData.internalUsers} />
                </DashboardCard>

                <DashboardCard title="Funcionalidades" icon="⚙️">
                    <InfoRow label="Éxito es" value={formData.successDefinition} />
                    <InfoRow label="Integraciones" value={formData.integrations} />
                    <InfoRow label="Tiempo real" value={formData.realtimeData} />
                    <InfoRow label="Panel admin" value={formData.needsAdmin} />
                </DashboardCard>

                <DashboardCard title="Estética" icon="🎨">
                    <InfoRow label="Colores" value={formData.brandColors} />
                    <InfoRow label="Tipografía" value={formData.typography} />
                    <InfoRow label="Tiene logo" value={formData.hasLogo} />
                    <InfoRow label="Tiene fotos" value={formData.hasPhotos} />
                </DashboardCard>

                <DashboardCard title="Plazos" icon="📅">
                    <InfoRow label="Fecha límite" value={formData.deadline} />
                    <InfoRow label="Presupuesto" value={formData.budget} />
                    <InfoRow label="Responsable" value={formData.decisionMaker} />
                </DashboardCard>

                <DashboardCard title="Contacto" icon="📬">
                    <InfoRow label="Nombre" value={formData.clientName} />
                    <InfoRow label="Email" value={formData.clientEmail} />
                    <InfoRow label="Teléfono" value={formData.clientPhone} />
                </DashboardCard>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onDownloadPDF}
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-2xl hover:bg-white/15 transition-all"
                >
                    <Download className="w-5 h-5" />
                    Descargar Presupuesto PDF
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onSendEmail}
                    disabled={emailStatus === 'sending' || emailStatus === 'sent'}
                    className={cn(
                        'flex items-center justify-center gap-2 px-6 py-4 font-semibold rounded-2xl transition-all',
                        emailStatus === 'sent'
                            ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                            : emailStatus === 'error'
                                ? 'bg-red-500/20 border border-red-500/40 text-red-400'
                                : 'bg-gradient-to-r from-accent to-blue-400 text-primary shadow-xl shadow-accent/25'
                    )}
                >
                    {emailStatus === 'sending' && <><Loader2 className="w-5 h-5 animate-spin" /> Enviando...</>}
                    {emailStatus === 'sent' && <><CheckCircle2 className="w-5 h-5" /> ¡Enviado! Te contactaré pronto</>}
                    {emailStatus === 'error' && <><X className="w-5 h-5" /> Error al enviar — Intentá de nuevo</>}
                    {(!emailStatus || emailStatus === 'idle') && <><Send className="w-5 h-5" /> Enviar y Finalizar</>}
                </motion.button>
            </div>

            {emailStatus === 'error' && emailError && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center"
                >
                    <p className="text-red-400 text-sm font-medium">No se pudo enviar el correo: {emailError}</p>
                </motion.div>
            )}

            {emailStatus === 'sent' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-center"
                >
                    <p className="text-green-400 text-sm font-medium">✅ Tu información fue enviada correctamente. Te contactaré en las próximas horas.</p>
                    <a
                        href={`https://wa.me/543875469814?text=${encodeURIComponent(`Hola Maximiliano! Acabo de completar el formulario de presupuesto en tu portfolio. Mi proyecto es: ${formData.businessName || 'Sin nombre'} (${formData.projectType || ''}).`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400 text-sm hover:bg-green-500/30 transition-all"
                    >
                        <MessageSquare className="w-4 h-4" />
                        También podés escribirme por WhatsApp
                    </a>
                </motion.div>
            )}
        </div>
    );
};

// ─── MAIN FORMULARIO COMPONENT ───────────────────────────────────────────────

const Formulario = () => {
    const [currentStep, setCurrentStep] = useState(0); // 0 = intro
    const [formData, setFormData] = useState({});
    const [emailStatus, setEmailStatus] = useState('idle'); // idle | sending | sent | error
    const [emailError, setEmailError] = useState('');
    const containerRef = useRef(null);

    const scrollToTop = () => {
        containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Derived budget summary
    const getBudgetSummary = () => {
        const category = pricingData.categories.find(c => c.id === formData.projectType);
        const level = category?.levels.find(l => l.id === formData.selectedPlan);
        const addons = (formData.selectedAddons || []).map(id => pricingData.addons.find(a => a.id === id)).filter(Boolean);

        const basePrice = level?.price || 0;
        const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
        const total = basePrice + addonsTotal;

        return {
            planName: level?.name || 'Sin plan seleccionado',
            basePrice,
            addonsDetail: addons.length > 0 ? addons.map(a => `${a.name} (+$${a.price.toLocaleString('es-AR')})`).join(', ') : null,
            total,
        };
    };

    const budgetSummary = getBudgetSummary();

    // Navigation
    const canGoNext = () => {
        switch (currentStep) {
            case 1: return !!formData.projectType;
            case 8: return !!formData.selectedPlan;
            case 9: return !!formData.clientName && !!formData.clientEmail;
            default: return true;
        }
    };

    const goNext = () => {
        if (!canGoNext()) return;
        setCurrentStep(p => Math.min(p + 1, TOTAL_STEPS));
        setTimeout(scrollToTop, 100);
    };

    const goPrev = () => {
        setCurrentStep(p => Math.max(p - 1, 0));
        setTimeout(scrollToTop, 100);
    };

    const handleDownloadPDF = () => {
        generatePDF(formData, budgetSummary);
    };

    const handleSendEmail = async () => {
        setEmailStatus('sending');
        setEmailError('');
        const result = await sendFormEmail(formData, budgetSummary);
        if (result.success) {
            setEmailStatus('sent');
        } else {
            setEmailError(result.errorMessage || 'Error al enviar el correo');
            setEmailStatus('error');
        }
    };

    // Slide animation variants
    const variants = {
        enter: (dir) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
        center: { opacity: 1, x: 0 },
        exit: (dir) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
    };

    const [direction, setDirection] = useState(1);
    const handleNext = () => { setDirection(1); goNext(); };
    const handlePrev = () => { setDirection(-1); goPrev(); };

    const renderStep = () => {
        switch (currentStep) {
            case 0: return <StepIntro onStart={() => { setDirection(1); setCurrentStep(1); setTimeout(scrollToTop, 100); }} />;
            case 1: return <StepProjectType formData={formData} setFormData={setFormData} />;
            case 2: return <StepBusinessInfo formData={formData} setFormData={setFormData} />;
            case 3: return <StepTargetAudience formData={formData} setFormData={setFormData} />;
            case 4: return <StepFeatures formData={formData} setFormData={setFormData} />;
            case 5: return <StepSpecificQuestions formData={formData} setFormData={setFormData} />;
            case 6: return <StepAesthetics formData={formData} setFormData={setFormData} />;
            case 7: return <StepTimeline formData={formData} setFormData={setFormData} />;
            case 8: return <StepPlanSelection formData={formData} setFormData={setFormData} />;
            case 9: return <StepContactInfo formData={formData} setFormData={setFormData} />;
            case 10: return (
                <StepSummary
                    formData={formData}
                    budgetSummary={budgetSummary}
                    onDownloadPDF={handleDownloadPDF}
                    onSendEmail={handleSendEmail}
                    emailStatus={emailStatus}
                    emailError={emailError}
                />
            );
            default: return null;
        }
    };

    const isIntro = currentStep === 0;
    const isSummary = currentStep === 10;
    const isLastBeforeSummary = currentStep === TOTAL_STEPS;

    return (
        <section id="formulario" className="py-20 bg-primary relative min-h-screen" ref={containerRef}>
            {/* Background glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-6 max-w-3xl relative">
                {/* Section label */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10"
                >
                    <span className="inline-block px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-full text-accent text-xs font-semibold tracking-wider uppercase mb-4">
                        Formulario de Proyecto
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        ¿Tenés una <span className="text-accent">idea</span>?
                    </h2>
                    <p className="text-gray-400 max-w-md mx-auto text-sm">
                        Completá el formulario y recibí un presupuesto detallado para tu proyecto
                    </p>
                </motion.div>

                {/* Main card */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/3 border border-white/8 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl"
                >
                    {/* Card header */}
                    <div className="p-6 border-b border-white/8 bg-white/3">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-400/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                                <div className="w-3 h-3 rounded-full bg-green-400/60" />
                            </div>
                            {!isIntro && !isSummary && (
                                <button
                                    onClick={() => { setCurrentStep(0); setFormData({}); setEmailStatus('idle'); setEmailError(''); }}
                                    className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1"
                                >
                                    <RefreshCw className="w-3 h-3" /> Reiniciar
                                </button>
                            )}
                        </div>
                        {!isIntro && !isSummary && (
                            <ProgressBar step={currentStep} total={TOTAL_STEPS} />
                        )}
                    </div>

                    {/* Card body */}
                    <div className="p-6 md:p-8 min-h-[500px]">
                        <AnimatePresence mode="wait" custom={direction}>
                            <motion.div
                                key={currentStep}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: 'easeInOut' }}
                            >
                                {renderStep()}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Card footer navigation */}
                    {!isIntro && !isSummary && (
                        <div className="p-6 border-t border-white/8 bg-white/3">
                            <div className="flex items-center justify-between gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handlePrev}
                                    className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-gray-400 font-medium rounded-xl hover:bg-white/10 hover:text-white transition-all text-sm"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Anterior
                                </motion.button>

                                <motion.button
                                    whileHover={canGoNext() ? { scale: 1.03 } : {}}
                                    whileTap={canGoNext() ? { scale: 0.97 } : {}}
                                    onClick={isLastBeforeSummary ? () => { setDirection(1); setCurrentStep(10); setTimeout(scrollToTop, 100); } : handleNext}
                                    disabled={!canGoNext()}
                                    className={cn(
                                        'flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all text-sm',
                                        canGoNext()
                                            ? isLastBeforeSummary
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-lg shadow-green-500/20'
                                                : 'bg-gradient-to-r from-accent to-blue-400 text-primary shadow-lg shadow-accent/20'
                                            : 'bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed'
                                    )}
                                >
                                    {isLastBeforeSummary ? (
                                        <><CheckCircle2 className="w-4 h-4" /> Ver resumen</>
                                    ) : (
                                        <>Siguiente <ArrowRight className="w-4 h-4" /></>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Formulario;
