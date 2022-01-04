import DaoInfo from "../components/dashboard/DaoInfo";
import GovSettings from "../components/dashboard/GovSettings";
import Treasury from "../components/dashboard/Treasury";
import Extensions from "../components/dashboard/Extensions";
import Ricardian from "../components/dashboard/Ricardian";

// if `check` is set, front end will not display content if not set in dao object

export const dashboardHelper = [
  {
    title: "DAO Info",
    component: <DaoInfo />,
    check: null
  },
  {
    title: "Ricardian LLC",
    component: <Ricardian />,
    check: 'ricardian'
  },
  {
    title: "Governance Settings",
    component: <GovSettings />,
    check: null
  },
  {
    title: "Treasury",
    component: <Treasury />,
    check: null
  },
  {
    title: "Extensions",
    component: <Extensions />,
    check: 'extensions'
  }
]
