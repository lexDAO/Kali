import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { Text, IconButton, HStack, VStack, Input } from "@chakra-ui/react";
import { BsHandThumbsUpFill, BsHandThumbsDownFill } from "react-icons/bs";
import { useDisclosure } from "@chakra-ui/react";

export default function VotingModule(props) {
  const value = useContext(AppContext);
  const { web3, loading, account, address, abi } = value.state;
  const p = props["p"];
  const { isOpen, onOpen, onClose } = useDisclosure();

  const vote = async () => {

      event.preventDefault();
      value.setLoading(true);

      try {
        let object = event.target;
        var array = [];
        for (let i = 0; i < object.length; i++) {
          array[object[i].name] = object[i].value;
        }

        const { id, approval } = array;

        try {
          // * first, see if they already voted * //
          const instance = new web3.eth.Contract(abi, address);
          const voted = await instance.methods.voted(id, account).call();
          if (voted == true) {
            alert("You already voted");
          } else {
            try {
              let result = await instance.methods
                .vote(id, parseInt(approval))
                .send({ from: account });
            } catch (e) {
              value.toast(e);
              value.setLoading(false);
            }
          }
        } catch (e) {
          value.toast(e);
          value.setLoading(false);
        }
      } catch(e) {
        value.toast(e);
        value.setLoading(false);
      }
      value.setLoading(false);
  };

  return (
    <VStack
      border="#ccc"
      backgroundColor="#eee"
      width="100%"
      p={5}
      rounded="lg"
    >
      <Text fontSize="lg">
        <b>VOTE</b>
      </Text>
      <HStack gap={3}>
        <form onSubmit={vote}>
          <Input type="hidden" name="id" value={p["id"]} />
          <Input type="hidden" name="approval" value={1} />
          <IconButton icon={<BsHandThumbsUpFill />} size="lg" type="submit" />
        </form>

        <form onSubmit={vote}>
          <Input type="hidden" name="id" value={p["id"]} />
          <Input type="hidden" name="approval" value={0} />
          <IconButton icon={<BsHandThumbsDownFill />} size="lg" type="submit" />
        </form>
      </HStack>
    </VStack>
  );
}
