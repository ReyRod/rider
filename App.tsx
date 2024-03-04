import React from "react";
import { Auth0Provider } from "react-native-auth0";
import * as eva from "@eva-design/eva";
import { ApplicationProvider } from "@ui-kitten/components";

import Layout from "./screens/index";
import config from "./auth0-configuration";

const App = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <Auth0Provider domain={config.domain} clientId={config.clientId}>
        <Layout />
      </Auth0Provider>
    </ApplicationProvider>
  );
};

export default App;
