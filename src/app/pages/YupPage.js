import React from "react";
import {useSubheader} from "../../_metronic/layout";
import YupTokenmetrics from "../../_metronic/_partials/widgets/yup/YupTokenmetrics";
import YupToplist from "../../_metronic/_partials/widgets/yup/YupToplist";
import YupFeedTableWidget from "../../_metronic/_partials/widgets/yup/YupFeedTableWidget";
export const YupPage = () => {
  const suhbeader = useSubheader();
  suhbeader.setTitle("Yup Info");
  return (<>
     <div className="row">
  <div className="col-lg-12 col-xxl-12">
  <YupTokenmetrics className="card-stretch gutter-b" />
  </div>
  </div>
  <div className="row">
  {/*<div className="col-lg-4 col-xxl-4">
  <YupToplist className="card-stretch gutter-b" />
  </div>*/}
  <div className="col-lg-12 col-xxl-12">
  <YupFeedTableWidget className="card-stretch gutter-b" />
  </div>
  </div>
  </>);
};
