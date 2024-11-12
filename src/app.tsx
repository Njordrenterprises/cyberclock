import { MetaProvider, Title } from "@solidjs/meta";
import { Router, useNavigate } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense, Show, createEffect, type ParentComponent } from "solid-js";
import { authState } from "./stores/auth.store";
import "./app.css";
import "./styles/theme.css";

interface ProtectedRouteProps {
  children: any;
}

const ProtectedRoute: ParentComponent<ProtectedRouteProps> = (props) => {
  const navigate = useNavigate();
  
  createEffect(() => {
    const auth = authState();
    if (auth.initialized && !auth.isLoading && !auth.user) {
      console.log('No user found, redirecting to login');
      navigate('/login', { replace: true });
    }
  });

  return (
    <Show 
      when={authState().initialized && !authState().isLoading}
      fallback={
        <div class="loading-container">
          <div class="loading">Checking authentication...</div>
        </div>
      }
    >
      <Show
        when={authState().user}
        fallback={null}
      >
        {props.children}
      </Show>
    </Show>
  );
};

const AppRoot: ParentComponent = (props) => {
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
