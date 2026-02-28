import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, Check, Download, ArrowRight, RefreshCcw } from 'lucide-react';
import Button from '../ui/Button';
import { pricingData, calculateTotal } from '../../data/pricing';
import { generatePDF } from '../../utils/pdfGenerator';
import { cn } from '../../lib/utils';

/**
 * Smart Quoter Component (Cotizador Inteligente).
 * Handles conversational project diagnostics and pricing calculation.
 * @returns {JSX.Element}
 */
const Cotizador = () => {
    const [step, setStep] = useState('intro'); // intro, chat, proposal
    const [messages, setMessages] = useState([]);
    const [selection, setSelection] = useState({ category: null, level: null, addons: [] });
    const [total, setTotal] = useState(0);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        setTotal(calculateTotal(selection));
    }, [selection]);

    const addMessage = (text, sender = 'bot', options = null) => {
        setMessages(prev => [...prev, { text, sender, options, id: Date.now() }]);
    };

    const startChat = () => {
        setStep('chat');
        setSelection({ category: null, level: null, addons: [] });
        setMessages([]);
        addMessage("¡Hola! Soy tu asistente IA. Vamos a definir tu proyecto ideal.", 'bot');
        setTimeout(() => {
            addMessage("Primero, ¿cuál es el objetivo principal de tu proyecto?", 'bot', [
                { label: "Vender productos online (E-commerce)", value: "web_l3", action: () => handleCategorySelect('web', 3) },
                { label: "Tener presencia profesional en la web", value: "web_l1", action: () => handleCategorySelect('web', 1) },
                { label: "Gestionar mi negocio (Inventario/Usuarios)", value: "system_l2", action: () => handleCategorySelect('system', 2) },
                { label: "Crear una App Móvil", value: "app_l2", action: () => handleCategorySelect('app', 2) }
            ]);
        }, 1000);
    };

    const handleCategorySelect = (catId, levelId) => {
        setSelection(prev => ({ ...prev, category: catId, level: levelId }));
        const catName = pricingData.categories.find(c => c.id === catId)?.name;
        // User response visualisation could be added here if needed, skipping for brevity

        setTimeout(() => {
            addMessage(`Entendido. Una solución tipo ${catName} es un excelente punto de partida.`, 'bot');
        }, 500);

        setTimeout(() => {
            addMessage("¿Tu proyecto necesitará funciones inteligentes como leer documentos o tomar decisiones automáticas?", 'bot', [
                { label: "Sí, necesito IA", value: "yes_ia", action: () => handleAddonSelect('ia', true, "Perfecto, agregaremos el módulo de IA.") },
                { label: "No por ahora", value: "no_ia", action: () => handleAddonSelect(null, true, "Bien, mantengamoslo simple.") }
            ]);
        }, 1500);
    };

    const handleAddonSelect = (addonId, finish = false, responseText = "") => {
        if (addonId) {
            setSelection(prev => ({ ...prev, addons: [...prev.addons, addonId] }));
        }

        addMessage(responseText, 'bot');

        if (finish) {
            setTimeout(() => {
                addMessage("¡Genial! He procesado tu información. Aquí tienes una propuesta preliminar.", 'bot');
                setTimeout(() => setStep('proposal'), 1500);
            }, 1000);
        }
    };

    const toggleAddon = (addonId) => {
        setSelection(prev => {
            const exists = prev.addons.includes(addonId);
            return {
                ...prev,
                addons: exists ? prev.addons.filter(id => id !== addonId) : [...prev.addons, addonId]
            };
        });
    };

    const handleWhatsApp = () => {
        const text = `Hola Maximiliano! Me interesa un proyecto de ${pricingData.categories.find(c => c.id === selection.category).name} (Nivel ${selection.level}). Presupuesto estimado: $${total.toLocaleString('es-AR')}.`;
        window.open(`https://wa.me/543875469814?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <section id="cotizador" className="py-20 bg-primary relative min-h-[800px]">
            <div className="container mx-auto px-6 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl min-h-[600px] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 bg-white/5 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                                <RefreshCcw className={`w-5 h-5 text-accent ${step === 'intro' ? 'animate-spin-slow' : ''}`} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white">Cotizador Inteligente</h3>
                                <p className="text-xs text-green-400 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Online
                                </p>
                            </div>
                        </div>
                        {step !== 'intro' && (
                            <button onClick={() => setStep('intro')} className="text-gray-400 hover:text-white text-sm hover:underline">
                                Reiniciar
                            </button>
                        )}
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-6 relative overflow-y-auto bg-black/20">
                        {step === 'intro' && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <MessageSquare className="w-20 h-20 text-accent mb-4 mx-auto" />
                                    <h2 className="text-3xl font-bold text-white mb-2">¿Tienes una idea?</h2>
                                    <p className="text-gray-400 max-w-md mx-auto mb-8">
                                        Contame qué necesitas y generaré un presupuesto a medida con IA en segundos.
                                    </p>
                                    <Button onClick={startChat}>
                                        Iniciar Conversación <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </motion.div>
                            </div>
                        )}

                        {step === 'chat' && (
                            <div className="space-y-4">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: msg.sender === 'bot' ? -20 : 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className={cn(
                                            "flex flex-col max-w-[80%]",
                                            msg.sender === 'bot' ? "self-start" : "self-end items-end"
                                        )}
                                    >
                                        <div className={cn(
                                            "p-4 rounded-2xl text-sm leading-relaxed",
                                            msg.sender === 'bot'
                                                ? "bg-white/10 text-gray-200 rounded-tl-none"
                                                : "bg-accent/20 text-accent rounded-tr-none"
                                        )}>
                                            {msg.text}
                                        </div>

                                        {msg.options && (
                                            <div className="mt-3 flex flex-wrap gap-2">
                                                {msg.options.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={opt.action}
                                                        className="px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent text-sm hover:bg-accent hover:text-primary transition-all duration-300"
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>
                        )}

                        {step === 'proposal' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col"
                            >
                                <div className="flex-1 space-y-8">
                                    <div className="text-center">
                                        <h2 className="text-2xl font-bold text-white mb-2">Tu Propuesta Ideal</h2>
                                        <p className="text-gray-400">Personaliza tu paquete final</p>
                                    </div>

                                    <div className="p-6 bg-white/5 rounded-2xl border border-accent/20">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h4 className="text-accent font-bold text-lg">
                                                    {pricingData.categories.find(c => c.id === selection.category)?.name}
                                                </h4>
                                                <p className="text-gray-400 text-sm">Nivel {selection.level}</p>
                                            </div>
                                            <div className="text-2xl font-bold text-white">
                                                ${pricingData.categories.find(c => c.id === selection.category)?.levels.find(l => l.id === selection.level)?.price.toLocaleString()}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-sm font-semibold text-gray-300">Incluye:</p>
                                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                {pricingData.categories.find(c => c.id === selection.category)?.levels.find(l => l.id === selection.level)?.features.map(f => (
                                                    <li key={f} className="text-xs text-gray-400 flex items-center gap-2">
                                                        <Check className="w-3 h-3 text-accent" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-white font-bold mb-4">Potencia tu proyecto (Add-ons)</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {pricingData.addons.map(addon => (
                                                <div
                                                    key={addon.id}
                                                    onClick={() => toggleAddon(addon.id)}
                                                    className={cn(
                                                        "p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center group",
                                                        selection.addons.includes(addon.id)
                                                            ? "bg-accent/10 border-accent"
                                                            : "bg-white/5 border-white/5 hover:bg-white/10"
                                                    )}
                                                >
                                                    <div>
                                                        <p className={cn("text-sm font-semibold", selection.addons.includes(addon.id) ? "text-accent" : "text-gray-300")}>
                                                            {addon.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500">{addon.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-400">+${addon.price.toLocaleString()}</p>
                                                        {selection.addons.includes(addon.id) && <Check className="w-4 h-4 text-accent ml-auto mt-1" />}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer Actions (Only in Proposal) */}
                    {step === 'proposal' && (
                        <div className="p-6 bg-white/5 border-t border-white/10">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                                <span className="text-gray-400">Total Estimado:</span>
                                <span className="text-3xl font-bold text-accent">${total.toLocaleString('es-AR')}</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Button variant="outline" onClick={() => generatePDF({ ...selection, total })}>
                                    <Download className="w-4 h-4" /> Descargar PDF
                                </Button>
                                <Button variant="primary" onClick={handleWhatsApp}>
                                    <Send className="w-4 h-4" /> Confirmar por WhatsApp
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default Cotizador;
