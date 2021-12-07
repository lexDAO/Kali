import React, { useState, useContext, useEffect } from 'react';
import AppContext from '../context/AppContext';
import Layout from '../components/Layout';
import HomeTile from '../components/HomeTile';
import Factory from '../components/Factory';

export default function Home() {

  return(
    <Layout>
      <HomeTile />
      <Factory />
    </Layout>
  )
}
