import { createStandaloneToast } from '@chakra-ui/react';

export function createToast(props) {
  const toast = createStandaloneToast();
  let error;
  if(typeof props === 'object') {
    error = props['message']
    console.log("this is an object")
  } else {
    error = props;
  }
  console.log("error", props)
  console.log("length", props['message'])
  toast({
    title: "Error",
    description: error,
    status: 'error',
    duration: 9000,
    isClosable: true,
  })
}
