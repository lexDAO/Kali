import React, { useState, useContext, useEffect } from "react";
import Layout from "../components/structure/Layout";
import FactoryWrapper from "../components/home/FactoryWrapper";
import HomeTile from "../components/home/HomeTile";

export default function Home() {

  const [deployerVisible, setDeployerVisible] = useState(false);

  return (
    <Layout>
      {deployerVisible==false ?
      <HomeTile setDeployerVisible={setDeployerVisible} />
      :
      <FactoryWrapper />
      }
    </Layout>
  );
}
