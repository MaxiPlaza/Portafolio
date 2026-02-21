import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

const Button = ({
    children,
    onClick,
    variant = 'primary',
    className,
    ...props
}) => {
    const baseStyles = "px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden group";

    const variants = {
        primary: "bg-accent text-primary hover:shadow-[0_0_20px_rgba(0,210,255,0.5)]",
        outline: "border border-accent text-accent hover:bg-accent/10",
        ghost: "text-gray-400 hover:text-white hover:bg-white/5"
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(baseStyles, variants[variant], className)}
            onClick={onClick}
            {...props}
        >
            <span className="relative z-10">{children}</span>
            {variant === 'primary' && (
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            )}
        </motion.button>
    );
};

export default Button;
