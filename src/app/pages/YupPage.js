import React from "react";
import {useSubheader} from "../../_metronic/layout";
import YupTokenmetrics from "../../_metronic/_partials/widgets/yup/YupTokenmetrics";
import YupToplist from "../../_metronic/_partials/widgets/yup/YupToplist";
import YupGraph from "../../_metronic/_partials/widgets/yup/YupGraph";
import YupFeedTableWidget from "../../_metronic/_partials/widgets/yup/YupFeedTableWidget";
import YupActionsWidget from "../../_metronic/_partials/widgets/yup/YupActionsWidget";
import {Button,Jumbotron} from "react-bootstrap";
import YupGraphIframe from "../../_metronic/_partials/widgets/yup/YupGraphIframe";

export const YupPage = () => {
  const suhbeader = useSubheader();
suhbeader.setTitle("📊 Yup Live");
  return (<>
     <div className="row">
  <div className="col-lg-12 col-xxl-12">
  <YupTokenmetrics className="card-stretch gutter-b" />
  </div>
  </div>
  <div className="row">
  <div className="col-lg-4 col-xxl-4">
  <YupToplist className="card-stretch gutter-b" />
  </div>
  <div className="col-lg-12 col-xxl-12">
  <YupFeedTableWidget className="card-stretch gutter-b" />
  </div>
  <div className="col-lg-12 col-xxl-12">
  <YupActionsWidget className="card-stretch gutter-b" />
  </div>  
  </div>
  
  </>);
};
