import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="py-10 bg-primary border-t border-white/5 relative z-10">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-white mb-2">Maximiliano Plaza</h3>
                    <p className="text-gray-400 text-sm">
                        Diseñando el futuro con código e inteligencia artificial.
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <a href="https://linkedin.com/in/maximiliano-plaza-397750342/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                        <Linkedin className="w-5 h-5" />
                    </a>
                    <a href="https://github.com/MaxiPlaza" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-accent transition-colors">
                        <Github className="w-5 h-5" />
                    </a>
                    <a href="mailto:plazamaxi385@gmail.com" className="text-gray-400 hover:text-accent transition-colors">
                        <Mail className="w-5 h-5" />
                    </a>
                </div>
            </div>
            <div className="text-center mt-10 text-xs text-gray-600">
                &copy; {new Date().getFullYear()} Maximiliano Plaza. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;
