import React, {useMemo} from "react";
import {useHtmlClassService} from "../../_core/MetronicLayout";

export function Footer() {
  const today = new Date().getFullYear();
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      footerClasses: uiService.getClasses("footer", true),
      footerContainerClasses: uiService.getClasses("footer_container", true)
    };
  }, [uiService]);

  return (
    <div
      className={`footer bg-white py-4 d-flex flex-lg-column  ${layoutProps.footerClasses}`}
      id="kt_footer"
    >
      <div
        className={`${layoutProps.footerContainerClasses} d-flex flex-column flex-md-row align-items-center justify-content-center`}
      >
        <div className="nav nav-dark order-1 order-md-1">
          <a
            href="https://t.co/vltk6ltwCh?amp=1"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link pr-3 pl-0"
          >
            Discord
          </a>
          <a
            href="https://blog.yup.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link px-3"
          >
            Blog
          </a>
          <a
            href="https://docs.yup.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link pl-3 pr-0"
          >
            Docs
          </a>
          <a
            href="https://twitter.com/yup_io"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link pl-3 pr-0"
          >
            Twitter
          </a>
          <a
            href="https://yup.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link pl-3 pr-0"
          >
            Yup.io
          </a>
        </div>
      </div>
    </div>
  );
}
