import React, { useRef } from "react";
import {
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  FormControl,
  FormLabel,
  Input,
  DrawerFooter,
  Stack,
  useDisclosure,
  Textarea,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";

function ContactForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, register } = useForm();
  const initialField = useRef();

  const handleSend = (values) => {
    console.log(values);
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>Contact us</Button>
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        initialFocusRef={initialField}
        onClose={onClose}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>What do you need help with?</DrawerHeader>
          <DrawerBody>
            <Stack
              as="form"
              id="contact-form"
              onSubmit={handleSubmit(handleSend)}
              spacing={2}
            >
              <FormControl>
                <FormLabel htmlFor="name">Name</FormLabel>
                <Input
                  ref={initialField}
                  id="name"
                  placeholder="Enter your name"
                  {...register("name")}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  placeholder="Enter your email"
                  {...register("email")}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="subject">Subject</FormLabel>
                <Input
                  id="subject"
                  placeholder="Enter the subject"
                  {...register("subject")}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="message">Message</FormLabel>
                <Textarea
                  id="message"
                  placeholder="Enter a description of your needs"
                  {...register("message")}
                />
              </FormControl>
            </Stack>
          </DrawerBody>
          <DrawerFooter>
            <Button type="submit" form="contact-form" mr={3}>
              Send
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default ContactForm;
