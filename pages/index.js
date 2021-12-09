import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
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
