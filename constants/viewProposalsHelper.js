import { BsPlusCircle, BsXCircle } from "react-icons/bs";
import { AiFillTool } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";
import { MdOutlineHowToVote } from "react-icons/md";
import { IoIosPeople, IoIosGitNetwork } from "react-icons/io";
import { RiScales3Line, RiPauseCircleFill } from "react-icons/ri";
import { TiCancel } from "react-icons/ti";

// populates data on proposal tiles
// if decode = true, will invoke function to decode `payloads`

export const viewProposalsHelper = {
  0: {
    title: "send shares",
    details: {
      amounts: "shares",
      accounts: "account(s)",
      payloads: null,
    },
    icon: BsPlusCircle,
    decode: false,
  },
  1: {
    title: "remove member",
    details: {
      amounts: "shares",
      accounts: "account(s)",
      payloads: null,
    },
    icon: BsXCircle,
    decode: false,
  },
  2: {
    title: "contract integration",
    details: {
      amounts: "value of transaction(s)",
      accounts: "contract(s)",
      payloads: "payload(s)",
    },
    icon: BiLoaderCircle,
    decode: true,
  },
  3: {
    title: "modify voting period",
    details: {
      amounts: "proposed voting period",
      accounts: null,
      payloads: null,
    },
    icon: MdOutlineHowToVote,
    decode: false,
  },
  4: {
    title: "modify quorum threshold",
    details: {
      amounts: "proposed quorum threshold",
      accounts: null,
      payloads: null,
    },
    icon: IoIosPeople,
    decode: false,
  },
  5: {
    title: "modify supermajority threshold",
    details: {
      amounts: "proposed supermajority threshold",
      accounts: null,
      payloads: null,
    },
    icon: RiScales3Line,
    decode: false,
  },
  6: {
    title: "modify proposal vote type",
    details: {
      amounts: "proposed proposal/vote type",
      accounts: null,
      payloads: null,
    },
    icon: AiFillTool,
    decode: false,
  },
  7: {
    title: "pause/unpause share transfer",
    details: {
      amounts: null,
      accounts: null,
      payloads: null,
    },
    icon: RiPauseCircleFill,
    decode: false,
  },
  8: {
    title: "extension integration",
    details: {
      amounts: null,
      accounts: "address(es) of extension(s)",
      payloads: "params",
    },
    icon: IoIosGitNetwork,
    decode: true,
  },
  9: {
    title: "escape",
    details: {
      amounts: "proposal number(s)",
      accounts: null,
      payloads: null,
    },
    icon: TiCancel,
    decode: false,
  },
  10: {
    title: "change docs",
    details: {
      amounts: null,
      accounts: null,
      payloads: null,
    },
    icon: null,
    decode: false,
  },
};
