
import { AppLayout } from "@/components/AppLayout";
import { TodoProvider } from "@/contexts/TodoContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="w-full h-full"
    >
      <AuthProvider>
        <TodoProvider>
          <PomodoroProvider>
            <AppLayout />
          </PomodoroProvider>
        </TodoProvider>
      </AuthProvider>
    </motion.div>
  );
};

export default Index;
