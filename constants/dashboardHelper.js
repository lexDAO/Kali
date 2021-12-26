import DaoInfo from "../components/dashboard/DaoInfo";
import GovSettings from "../components/dashboard/GovSettings";
import Treasury from "../components/dashboard/Treasury";
import Extensions from "../components/dashboard/Extensions";
import Members from "../components/dashboard/Members";
import Ricardian from "../components/dashboard/Ricardian";

export const dashboardHelper = [
  {
    title: "DAO Info",
    component: <DaoInfo />,
  },
  {
    title: "Ricardian LLC",
    component: <Ricardian />,
  },
  {
    title: "Governance Settings",
    component: <GovSettings />,
  },
  {
    title: "Treasury",
    component: <Treasury />,
  },
  {
    title: "Extensions",
    component: <Extensions />,
  },
  {
    title: "Members",
    component: <Members />,
  }
]
