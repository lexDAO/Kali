import Router, { useRouter } from "next/router";

export function routeHome() {
  Router.push({
    pathname: "../",
    query: {},
  });
  console.log("worked");
}
