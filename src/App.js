import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes/Routes';
import { Fragment } from 'react';
import GlobalStyles from './components/globalStyles/GlobalStyles.jsx';
import { AuthContextProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Navigate } from 'react-router-dom'
import { getCookie } from './utils/api.js';

const queryClient = new QueryClient();

function App() {
    const privateRouteGuard = () => {
        const authentication = getCookie('Authorization');
      
        if (authentication!=="") {
          return true;
        } else {
          return false;
        }
      };

    return (
        <QueryClientProvider client={queryClient}>
            <AuthContextProvider>
                <BrowserRouter>
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.element;
                            let Layout = Fragment;

                            if (route.layout) {
                                Layout = route.layout;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <GlobalStyles>
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        </GlobalStyles>
                                    }
                                />
                            );
                        })}
                        {privateRoutes.map((route, index) => {
                            const Page = route.element;
                            let Layout = Fragment;

                            if (route.layout) {
                                Layout = route.layout;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        
                                        <GlobalStyles>
                                            <Layout>
                                                {privateRouteGuard()?
                                                <Page />:<Navigate to="/login" />}
                                            </Layout>
                                        </GlobalStyles>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </BrowserRouter>
            </AuthContextProvider>
        </QueryClientProvider>
    );
}

export default App;
