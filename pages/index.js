import React from 'react';
import Layout from '../components/structure/Layout';
import HomeTile from '../components/home/HomeTile';
import Factory from '../components/home/Factory';

export default function Home() {

  return(
    <Layout>
      <HomeTile />
      <Factory />
    </Layout>
  )

}
