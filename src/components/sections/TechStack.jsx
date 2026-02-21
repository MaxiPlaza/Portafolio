import { motion } from 'framer-motion';
import { Database, Layout, Server, Brain, Smartphone, Code } from 'lucide-react';

const technologies = [
    { name: 'React', icon: Layout, color: '#61DAFB' },
    { name: 'Flutter', icon: Smartphone, color: '#02569B' },
    { name: 'Python', icon: Code, color: '#3776AB' },
    { name: 'Node.js', icon: Server, color: '#339933' },
    { name: 'Supabase', icon: Database, color: '#3ECF8E' },
    { name: 'TensorFlow', icon: Brain, color: '#FF6F00' },
];

const TechStack = () => {
    return (
        <section id="stack" className="py-20 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        <span className="text-accent">Tecnologías</span> que domino
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Un arsenal moderno para construir soluciones escalables, rápidas y seguras.
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                    {technologies.map((tech, index) => (
                        <motion.div
                            key={tech.name}
                            initial={{ y: 0 }}
                            animate={{ y: [-10, 10, -10] }}
                            transition={{
                                repeat: Infinity,
                                duration: 3 + Math.random() * 2,
                                ease: "easeInOut",
                                delay: index * 0.2
                            }}
                            whileHover={{ scale: 1.1, rotate: 5, zIndex: 10 }}
                            className="flex flex-col items-center justify-center p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-accent/50 hover:bg-white/10 transition-all backdrop-blur-sm group cursor-pointer"
                        >
                            <div
                                className="p-4 rounded-full bg-black/30 mb-4 group-hover:shadow-[0_0_20px_rgba(0,210,255,0.3)] transition-shadow"
                                style={{ color: tech.color }}
                            >
                                <tech.icon className="w-10 h-10" />
                            </div>
                            <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">
                                {tech.name}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TechStack;
