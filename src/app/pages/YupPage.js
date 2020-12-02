import React from "react";
import {useSubheader} from "../../_metronic/layout";
import YupTokenmetrics from "../../_metronic/_partials/widgets/yup/YupTokenmetrics";
import YupToplist from "../../_metronic/_partials/widgets/yup/YupToplist";
import YupFeedTableWidget from "../../_metronic/_partials/widgets/yup/YupFeedTableWidget";
import YupActionsWidget from "../../_metronic/_partials/widgets/yup/YupActionsWidget";
import {Button,Jumbotron} from "react-bootstrap";

export const YupPage = () => {
  const suhbeader = useSubheader();
suhbeader.setTitle("📊 Yup.Info");
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
  <div className="col-lg-12 col-xxl-12">
  {/* action widget <YupActionsWidget className="card-stretch gutter-b" /> */}
  <iframe
    src="https://app.uniswap.org/#/swap?use=v1?outputCurrency=0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359"
    height="660px"
    width="100%"
    style={{ 
      border: 0,
      margin: 0+ " auto",
      display: "block",
      borderRadius: 10+"px",
      maxWidth: 600+"px",
      minWidth: 300+"px",
    }}
    id="myId"
  />
  </div>
  </div>
  </>);
};
