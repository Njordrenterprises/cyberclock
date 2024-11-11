import { MetaProvider, Title } from "@solidjs/meta";
import { Router, useNavigate } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show, createEffect } from "solid-js";
import { authState } from "~/stores/auth.store";
import "./app.css";
import "./styles/theme.css";

const ProtectedRoute = (props: { children: any }) => {
  const navigate = useNavigate();
  
  createEffect(() => {
    if (!authState().isLoading && !authState().user) {
      navigate('/login', { replace: true });
    }
  });

  return (
    <Show 
      when={!authState().isLoading && authState().user}
      fallback={<div class="loading">Checking authentication...</div>}
    >
      {props.children}
    </Show>
  );
};

const AppRoot = (props: { children: any }) => {
  return (
    <>
      <div class="grid-background" />
      <div class="scanlines" />
      {props.children}
    </>
  );
};

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Title>CYBER CLOCK</Title>
          <Suspense fallback={<div class="loading">Loading...</div>}>
            <AppRoot>
              {props.children}
            </AppRoot>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}

export { ProtectedRoute };
