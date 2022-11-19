import { App } from "./App";
import { useQuery, QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();
export const Intermediate = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
};
