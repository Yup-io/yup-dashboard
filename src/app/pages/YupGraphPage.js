import React from "react";
import {useSubheader} from "../../_metronic/layout";
import YupGraphIframe from "../../_metronic/_partials/widgets/yup/YupGraphIframe";

export const YupGraphPage = () => {
  const suhbeader = useSubheader();
suhbeader.setTitle("📊 Yup Live");
  return (<>
     
  <div className="row mb-5">
  <div className="col-lg-12 col-xxl-12">
  <YupGraphIframe src={process.env.PUBLIC_URL +"/graph-iframe/index.html"}/>
  </div>
  </div>
  </>);
};
