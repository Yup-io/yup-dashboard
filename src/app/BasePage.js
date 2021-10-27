import React, { Suspense, lazy } from 'react';
// Redirect,
import { Switch, Route } from 'react-router-dom';
import { LayoutSplashScreen, ContentRoute } from '../_metronic/layout';
//import { BuilderPage } from './pages/BuilderPage';
import { YupPage } from './pages/YupPage';
import { YupGraphPage } from './pages/YupGraphPage';

const YupEmissionsPage = lazy(() => import('./pages/YupEmissionsPage'));

//const GoogleMaterialPage = lazy(() => import('./modules/GoogleMaterialExamples/GoogleMaterialPage'));
//const ReactBootstrapPage = lazy(() => import('./modules/ReactBootstrapExamples/ReactBootstrapPage'));
//const ECommercePage = lazy(() => import('./modules/ECommerce/pages/eCommercePage'));

export default function BasePage() {
  // useEffect(() => {
  //   console.log('Base page');
  // }, []) // [] - is required if you need only one call
  // https://reactjs.org/docs/hooks-reference.html#useeffect
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <ContentRoute path="/graph" component={YupGraphPage} />
        <Route path="/emissions" component={YupEmissionsPage} />
        <Route path="/page/:pageIndex" component={YupPage} />
        <Route path="/" component={YupPage} />

        {/* 
                <Route path="/emissions"/>
                <Route path="/google-material" component={GoogleMaterialPage}/>
                <Route path="/react-bootstrap" component={ReactBootstrapPage}/>
                <Route path="/e-commerce" component={ECommercePage}/>
                <Redirect to="error/error-v1"/>*/}
      </Switch>
    </Suspense>
  );
}
