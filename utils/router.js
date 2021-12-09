import Router, { useRouter } from "next/router";

export function routeAfterSubmission(address) {
  Router.push({
    pathname: "/daos/[dao]",
    query: {
      dao: address
    },
  });
}

export function routeHome() {
  Router.push({
    pathname: '../',
    query: {
      
    }
  });
  console.log("worked")
}
