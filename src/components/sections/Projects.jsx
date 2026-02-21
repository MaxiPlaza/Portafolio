import { motion } from 'framer-motion';
import { ExternalLink, Database, Cpu, Layout, Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { projects } from '../../data/projects';
import Button from '../ui/Button';

const ProjectCard = ({ project, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-colors"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-8 relative z-10 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-accent/20 rounded-lg text-accent">
                        <Layout className="w-6 h-6" />
                    </div>
                    {project.featured && (
                        <span className="px-3 py-1 text-xs font-medium text-accent bg-accent/10 rounded-full border border-accent/20">
                            Featured
                        </span>
                    )}
                </div>

                <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-accent transition-colors">
                    {project.title}
                </h3>

                <p className="text-gray-400 mb-6 flex-grow">
                    {project.shortDescription}
                </p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 text-sm bg-black/30 text-gray-400 rounded-full border border-white/5">
                            {tag}
                        </span>
                    ))}
                </div>

                <Link to={`/project/${project.id}`}>
                    <Button variant="outline" className="w-full group-hover:bg-accent group-hover:text-primary group-hover:border-accent transition-all duration-300">
                        Ver Detalles <ExternalLink className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </motion.div>
    );
};

const Projects = () => {
    return (
        <section id="projects" className="py-20 relative bg-black/20">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Proyectos <span className="text-accent">Destacados</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Soluciones reales que generan impacto, desde IA para la salud hasta sistemas de gestión críticos.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Projects;
