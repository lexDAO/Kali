import { useState, useContext, useEffect } from 'react';
import { useRouter } from "next/router";
import AppContext from '../../../context/AppContext';
import {
  chakra,
  Button,
  HStack,
  Center,
  Text,
  Flex
} from "@chakra-ui/react";
import Layout from '../../../components/Layout';
import Proposals from "../../../components/Proposals"
import NewProposal from "../../../components/NewProposal"
import ActionMenu from "../../../components/ActionMenu"
const proposalTypes = require("../../../utils/proposalTypes");

export default function Dao() {

  const [visible, setVisible] = useState(1);

  return(
    <Layout>
    <ActionMenu setVisible={setVisible} />
      {visible==1 ? <Proposals /> : visible==2 ? <NewProposal /> : null}

    </Layout>
  )
}
