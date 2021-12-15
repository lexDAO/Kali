import {
  BsPlusCircle,
  BsXCircle
} from "react-icons/bs";
import {
  AiFillTool
} from "react-icons/ai";
import {
  BiLoaderCircle
} from "react-icons/bi";
import {
  MdOutlineHowToVote
} from "react-icons/md";
import {
  IoIosPeople,
  IoIosGitNetwork
} from "react-icons/io";
import {
  RiScales3Line,
  RiPauseCircleFill
} from "react-icons/ri";
import {
  TiCancel
} from "react-icons/ti";

export const proposalIcons = [
  BsPlusCircle,
  BsXCircle,
  BiLoaderCircle,
  MdOutlineHowToVote,
  IoIosPeople,
  RiScales3Line,
  AiFillTool,
  RiPauseCircleFill,
  IoIosGitNetwork,
  TiCancel
];

export const proposalDescriptions = [
  "send shares",
  "remove member",
  "contract integration",
  "modify voting period",
  "modify quorum threshold",
  "modify supermajority threshold",
  "modify proposal vote type",
  "pause/unpause transfer",
  "extension integration",
  "escape"
];

export const proposalDetails = [ // descriptions for: amount, account, payload
  ["shares", "account", null],
  ["shares", "account", null],
  ["transaction value", "contract", "payload"],
  ["proposed voting period", null, null],
  ["proposed quorum threshold", null, null],
  ["proposed supermajority threshold", null, null],
  ["proposed proposal/vote type", null, null],
  [null, null, null],
  ["proposal number", null, null]
]
