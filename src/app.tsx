import { MetaProvider, Title } from "@solidjs/meta";
import { Router, Navigate, useNavigate } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show, createEffect } from "solid-js";
import { authState } from "~/stores/auth.store";
import "./app.css";
import "./styles/theme.css";

const ProtectedRoute = (props: { children: any }) => {
  const navigate = useNavigate();
  
  createEffect(() => {
    if (!authState().isLoading && !authState().user) {
      navigate('/auth', { replace: true });
    }
  });

  return (
    <Show 
      when={authState().user} 
      fallback={null}
    >
      {props.children}
    </Show>
  );
};

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>CYBER CLOCK</Title>
          <Suspense fallback={null}>
            {props.children}
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

export { ProtectedRoute };
