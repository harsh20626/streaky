
import { AppLayout } from "@/components/AppLayout";
import { TodoProvider } from "@/contexts/TodoContext";

const Index = () => {
  return (
    <TodoProvider>
      <AppLayout />
    </TodoProvider>
  );
};

export default Index;
