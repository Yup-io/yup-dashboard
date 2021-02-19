/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React, {useMemo, useLayoutEffect, useEffect} from "react";
import objectPath from "object-path";
import {useLocation} from "react-router-dom";
import {getBreadcrumbsAndTitle, useSubheader} from "../../_core/MetronicSubheader";
import {useHtmlClassService} from "../../_core/MetronicLayout"
import {Button} from "react-bootstrap"

export function SubHeader() {
  const uiService = useHtmlClassService();
  const location = useLocation();
  const subheader = useSubheader();

  const layoutProps = useMemo(() => {
    return {
      config: uiService.config,
      subheaderMobileToggle: objectPath.get(
          uiService.config,
          "subheader.mobile-toggle"
      ),
      subheaderCssClasses: uiService.getClasses("subheader", true),
      subheaderContainerCssClasses: uiService.getClasses(
          "subheader_container",
          true
      )
    };
  }, [uiService]);

  useLayoutEffect(() => {
    const aside = getBreadcrumbsAndTitle("kt_aside_menu", location.pathname);
    const header = getBreadcrumbsAndTitle("kt_header_menu", location.pathname);
    const breadcrumbs = (aside && aside.breadcrumbs.length > 0) ? aside.breadcrumbs : header.breadcrumbs;
    subheader.setBreadcrumbs(breadcrumbs);
    subheader.setTitle((aside && aside.title && aside.title.length > 0) ? aside.title : header.title);
    // eslint-disable-next-line
  }, [location.pathname]);

  // Do not remove this useEffect, need from update title/breadcrumbs outside (from the page)
  useEffect(() => {}, [subheader]);

  let modalClose = () => this.setState({ modalShow: false });

  return (
      <div
          id="kt_subheader"
          className={`subheader py-2 py-lg-4   ${layoutProps.subheaderCssClasses}`}
      >
        <div
            className={`${layoutProps.subheaderContainerCssClasses} d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap`}
        >
          {/* Info */}
          <div className="d-flex align-items-center flex-wrap mr-1">
            {layoutProps.subheaderMobileToggle && (
                <button
                    className="burger-icon burger-icon-left mr-4 d-inline-block d-lg-none"
                    id="kt_subheader_mobile_toggle"
                >
                  <span/>
                </button>
            )}

            <div className="d-flex align-items-center mr-5">
              <a href="/" target="_self">
              <h3 className="text-dark font-weight-bold my-2 mr-5">
                <>
                  {subheader.title}
                </>
                {/*<small></small>*/}
              </h3>
              </a>
              <p className="text-dark-25 my-2 mr-5">
                Yup Protocol Explorer
              </p>

            </div>
            {/*<BreadCrumbs items={subheader.breadcrumbs} />*/}
          </div>

          <div className="d-flex align-items-center">
            <Button className="mx-3" variant="primary" href="/graph" target="_self">Graph</Button>
            <Button variant="primary" href="https://app.uniswap.org/#/swap?inputCurrency=0x69bbc3f8787d573f1bbdd0a5f40c7ba0aee9bcc9&outputCurrency=ETH" target="_blank">Buy YUP</Button>
          </div>

          {/* Toolbar
          <div className="d-flex align-items-center">
            <div  className="btn btn-light btn-sm font-weight-bold" id="kt_dashboard_daterangepicker"
               data-toggle="tooltip" title="Select dashboard daterange" data-placement="left">
              <span className="text-muted font-weight-bold mr-2" id="kt_dashboard_daterangepicker_title">Today</span>
              <span className="text-primary font-weight-bold" id="kt_dashboard_daterangepicker_date">{(new Date()).toLocaleDateString()}</span>
            </div>
           {/* <QuickActions/>
          </div> */}
        </div>
      </div>
  );
}
