import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { ArrowRight, Download, Linkedin, Github } from 'lucide-react';

const roles = [
    "Desarrollando soluciones con IA",
    "Experto en Flutter & React",
    "Ganador Nacional de Tecnología",
    "Transformando ideas en código"
];

const Hero = () => {
    const [roleIndex, setRoleIndex] = useState(0);
    const [text, setText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    // Typewriter effect logic
    useEffect(() => {
        const currentRole = roles[roleIndex];
        const typeSpeed = isDeleting ? 50 : 100;

        const timer = setTimeout(() => {
            if (!isDeleting && text === currentRole) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setRoleIndex((prev) => (prev + 1) % roles.length);
            } else {
                setText(currentRole.substring(0, text.length + (isDeleting ? -1 : 1)));
            }
        }, typeSpeed);

        return () => clearTimeout(timer);
    }, [text, isDeleting, roleIndex]);

    return (
        <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
            {/* Background Gradient Blob */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] -z-10 animate-pulse" />

            <div className="container mx-auto px-6 text-center z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-xl md:text-2xl text-accent font-medium mb-4 tracking-wide">
                        Hola, soy Maximiliano Plaza
                    </h2>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        Full Stack Developer <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                            & AI Innovator
                        </span>
                    </h1>

                    <div className="h-8 md:h-12 mb-8">
                        <span className="text-xl md:text-3xl text-gray-400 font-light border-r-2 border-accent/80 pr-1 animate-pulse">
                            {text}
                        </span>
                    </div>

                    <p className="max-w-2xl mx-auto text-gray-400 mb-10 text-lg">
                        Ayudo a empresas a escalar con soluciones tecnológicas de alto impacto.
                        Especialista en React, Flutter y Sistemas Inteligentes.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                        <Button
                            variant="primary"
                            onClick={() => document.getElementById('cotizador')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Cotizar Proyecto con IA <ArrowRight className="w-4 h-4" />
                        </Button>

                        <a href="/public/CVMaximilianoPlaza.pdf" download>
                            <Button variant="outline">
                                Descargar CV <Download className="w-4 h-4" />
                            </Button>
                        </a>

                    </div>

                    <div className="mt-12 flex items-center justify-center gap-6">
                        <a href="https://linkedin.com/in/maximiliano-plaza-397750342/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                            <Linkedin className="w-6 h-6" />
                        </a>
                        <a href="https://github.com/MaxiPlaza" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                            <Github className="w-6 h-6" />
                        </a>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Down Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-gray-500"
            >
                <span className="text-sm tracking-widest uppercase">Scroll</span>
            </motion.div>
        </section>
    );
};

export default Hero;
