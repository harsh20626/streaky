
import { AppLayout } from "@/components/AppLayout";
import { TodoProvider } from "@/contexts/TodoContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { AuthProvider } from "@/contexts/AuthContext";

const Index = () => {
  return (
    <TodoProvider>
      <PomodoroProvider>
        <AppLayout />
      </PomodoroProvider>
    </TodoProvider>
  );
};

export default Index;
