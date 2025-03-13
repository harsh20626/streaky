
import { AppLayout } from "@/components/AppLayout";
import { TodoProvider } from "@/contexts/TodoContext";
import { PomodoroProvider } from "@/contexts/PomodoroContext";
import { AuthProvider } from "@/contexts/AuthContext";

const Index = () => {
  return (
    <AuthProvider>
      <TodoProvider>
        <PomodoroProvider>
          <AppLayout />
        </PomodoroProvider>
      </TodoProvider>
    </AuthProvider>
  );
};

export default Index;
