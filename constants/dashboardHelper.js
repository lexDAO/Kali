import DaoInfo from "../components/dashboard/DaoInfo";
import GovSettings from "../components/dashboard/GovSettings";
import Treasury from "../components/dashboard/Treasury";
import Extensions from "../components/dashboard/Extensions";

export const dashboardHelper = [
  {
    title: "DAO Info",
    component: <DaoInfo />,
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
  }
]
