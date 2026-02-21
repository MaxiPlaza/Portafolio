import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink, Cpu, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { projects } from '../../data/projects';
import Button from '../ui/Button';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

/**
 * Detailed view component for a specific project.
 * Fetches project data based on URL parameter and displays full details.
 * @component
 */
const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const project = projects.find(p => p.id === id);
    const [activeImage, setActiveImage] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (project) {
            setActiveImage(project.image);
        }
    }, [project]);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-primary flex-col gap-6">
                <h1 className="text-3xl text-white font-bold">Proyecto no encontrado</h1>
                <Button onClick={() => navigate('/')}>Volver al Inicio</Button>
            </div>
        );
    }

    return (
        <div className="bg-primary min-h-screen pt-32 pb-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-accent transition-colors mb-8 group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Volver al portafolio
                </Link>

                {/* Hero Header / Main Image Display */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative rounded-3xl overflow-hidden mb-12 h-[300px] md:h-[500px] border border-white/5 bg-gray-900 group"
                >
                    <AnimatePresence mode="wait">
                        <motion.img
                            key={activeImage}
                            src={activeImage}
                            alt={project.title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full object-cover"
                        />
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent pointer-events-none" />
                    <div className="absolute bottom-10 left-10 right-10 pointer-events-none">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 line-clamp-2 drop-shadow-2xl">
                            {project.title}
                        </h1>
                        <div className="flex flex-wrap gap-3">
                            {project.tags.map(tag => (
                                <span key={tag} className="px-4 py-1.5 bg-accent/20 text-accent rounded-full border border-accent/30 text-sm font-medium backdrop-blur-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Image Gallery Grid */}
                <section className="mb-16">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-accent" /> Galería del Sistema
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {/* Main image preview */}
                        <div
                            onClick={() => setActiveImage(project.image)}
                            className={cn(
                                "relative h-24 md:h-32 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300",
                                activeImage === project.image ? "border-accent scale-95 shadow-[0_0_15px_rgba(0,210,255,0.3)]" : "border-white/10 hover:border-white/30"
                            )}
                        >
                            <img src={project.image} alt="Gallery view" className="w-full h-full object-cover" />
                        </div>
                        {/* Gallery images */}
                        {project.gallery?.map((img, i) => (
                            <div
                                key={i}
                                onClick={() => setActiveImage(img)}
                                className={cn(
                                    "relative h-24 md:h-32 rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-300",
                                    activeImage === img ? "border-accent scale-95 shadow-[0_0_15px_rgba(0,210,255,0.3)]" : "border-white/10 hover:border-white/30"
                                )}
                            >
                                <img src={img} alt={`Gallery view ${i}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2 space-y-12"
                    >
                        <section>
                            <h2 className="text-2xl font-bold text-white mb-4">Sobre el Proyecto</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {project.fullDescription}
                            </p>
                        </section>

                        <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-6 h-6 text-accent" /> Funcionalidades Clave
                            </h2>
                            <ul className="space-y-4">
                                {project.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <AlertCircle className="w-6 h-6 text-yellow-500" /> Desafío Técnico
                            </h2>
                            <div className="p-6 border-l-4 border-yellow-500 bg-yellow-500/5 rounded-r-2xl">
                                <p className="text-gray-300 italic">
                                    "{project.challenges}"
                                </p>
                            </div>
                        </section>
                    </motion.div>

                    {/* Sidebar / Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="space-y-6"
                    >
                        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl sticky top-32">
                            <h3 className="text-xl font-bold text-white mb-6">Detalles Técnicos</h3>
                            <div className="space-y-6 mb-8">
                                <div className="flex items-center gap-4 text-gray-400">
                                    <Cpu className="w-5 h-5 text-accent" />
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-bold">Arquitectura</p>
                                        <p className="text-white">Clean Architecture / MVC</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-gray-400">
                                    <ExternalLink className="w-5 h-5 text-accent" />
                                    <div>
                                        <p className="text-xs uppercase tracking-widest font-bold">Despliegue</p>
                                        <p className="text-white">Vercel / Supabase</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button
                                    className="w-full"
                                    onClick={() => window.open(project.link, '_blank')}
                                    disabled={project.link === '#'}
                                >
                                    Repositorio / Demo <ExternalLink className="w-4 h-4" />
                                </Button>
                                <Link to="/#cotizador" className="text-accent text-sm text-center hover:underline">
                                    ¿Necesitas algo similar? Cotizá acá
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetails;
