import React from 'react';

const viewportContext = React.createContext({});

const ViewportProvider = ({ children }) => {
  const [width, setWidth] = React.useState(window.innerWidth);

  const handleWindowResize = () => {
    setWidth(window.innerWidth);
  };

  React.useEffect(() => {
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  return <viewportContext.Provider value={{ width }}>{children}</viewportContext.Provider>;
};

const useViewport = () => {
  const { width } = React.useContext(viewportContext);
  return { width };
};

export { ViewportProvider, useViewport };
