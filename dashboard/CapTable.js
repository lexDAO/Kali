import { useState, useContext, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Text,
  UnorderedList,
  ListItem,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption
} from "@chakra-ui/react";
import { fromDecimals } from "../../utils/formatters";

export default function CapTable() {
  const value = useContext(AppContext);
  const { dao } = value.state;

  return(
    <>
    <Table>
      <Thead>
        <Tr>
          <Th>Member</Th>
          <Th>Shares</Th>
        </Tr>
      </Thead>
      <Tbody>
      {dao["members"].map((m, index) => (
        <Tr key={index}>
          <Td>{m['member']}</Td>
          <Td>{fromDecimals(m['shares'], 18)}</Td>
        </Tr>
      ))}
    </Tbody>
    </Table>
    </>
  );
}
