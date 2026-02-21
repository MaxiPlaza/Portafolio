import { motion } from 'framer-motion';
import { Briefcase, Award, GraduationCap } from 'lucide-react';

const experiences = [
    {
        type: "work",
        title: "Técnico Informático",
        company: "Dirección General de Tránsito",
        period: "Mayo 2025 - Nov 2025",
        description: "Optimización de infraestructura tecnológica y mantenimiento de 30 estaciones de trabajo. Implementación de software base y resolución de fallas críticas.",
        icon: Briefcase
    },
    {
        type: "award",
        title: "Ganador Nacional de Tecnología",
        company: "INET",
        period: "2025",
        description: "Reconocimiento nacional por la elaboracion de un proyecto simulado de infraestructura de tecnologia de empresa mediana con 100 equipos informaticos.",
        icon: Award
    },
    {
        type: "work",
        title: "Soporte Técnico de Infraestructura",
        company: "Independiente",
        period: "2024 - Actualidad",
        description: "Diseño y despliegue de redes corporativas, armado de racks y mantenimiento preventivo/corrrectivo para clientes particulares y empresas.",
        icon: Briefcase
    },
    {
        type: "education",
        title: "Tecnicatura en Informática",
        company: "E.E.T N°3117",
        period: "2020 - 2026",
        description: "Formación especializada en desarrollo de software, informatica y sistemas.",
        icon: GraduationCap
    }
];

const Experience = () => {
    return (
        <section id="experience" className="py-20 relative">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Mi <span className="text-accent">Trayectoria</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Un camino marcado por la innovación, el aprendizaje continuo y el impacto social.
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto relative">
                    {/* Vertical Line */}
                    <div className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent/50 via-gray-700 to-transparent transform md:-translate-x-1/2" />

                    {experiences.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`flex flex-col md:flex-row gap-8 mb-12 relative ${index % 2 === 0 ? 'md:flex-row-reverse' : ''
                                }`}
                        >
                            {/* Timeline Dot */}
                            <div className="absolute left-[20px] md:left-1/2 w-10 h-10 bg-primary border-2 border-accent rounded-full flex items-center justify-center transform -translate-x-1/2 z-10">
                                <item.icon className="w-5 h-5 text-accent" />
                            </div>

                            {/* Content Spacer */}
                            <div className="hidden md:block w-1/2" />

                            {/* Content Card */}
                            <div className="pl-16 md:pl-0 md:w-1/2 md:px-8">
                                <div className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-colors relative group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />

                                    <span className="text-accent text-sm font-semibold mb-2 block">{item.period}</span>
                                    <h3 className="text-xl font-bold text-white mb-1">{item.title}</h3>
                                    <h4 className="text-gray-400 text-sm mb-4">{item.company}</h4>
                                    <p className="text-gray-300 text-sm leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Experience;
