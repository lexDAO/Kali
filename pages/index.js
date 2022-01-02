import React from "react";
import Layout from "../components/structure/Layout";
import FactoryWrapper from "../components/home/FactoryWrapper";
import HomeTile from "../components/home/HomeTile";

export default function Home() {
  return (
    <Layout>
      <HomeTile />
      <FactoryWrapper />
    </Layout>
  );
}
