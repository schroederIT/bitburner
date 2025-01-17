import React, { useState } from "react";
import { SourceFileFlags } from "../../SourceFile/SourceFileFlags";
import { IRouter } from "../../ui/Router";
import { BitNodes } from "../BitNode";
import { enterBitNode, setRedPillFlag } from "../../RedPill";
import { PortalPopup } from "./PortalPopup";
import { createPopup } from "../../ui/React/createPopup";
import { CinematicText } from "../../ui/React/CinematicText";
import { use } from "../../ui/Context";

interface IPortalProps {
  n: number;
  level: number;
  destroyedBitNode: number;
  flume: boolean;
  enter: (router: IRouter, flume: boolean, destroyedBitNode: number, newBitNode: number) => void;
}
function BitNodePortal(props: IPortalProps): React.ReactElement {
  const router = use.Router();
  const bitNode = BitNodes[`BitNode${props.n}`];
  if (bitNode == null) {
    return <>O</>;
  }

  let cssClass;
  if (props.n === 12 && props.level >= 2) {
    // Repeating BitNode
    cssClass = "level-2";
  } else {
    cssClass = `level-${props.level}`;
  }

  function openPortalPopup(): void {
    const popupId = "bitverse-portal-popup";
    createPopup(popupId, PortalPopup, {
      n: props.n,
      level: props.level,
      enter: props.enter,
      router: router,
      destroyedBitNode: props.destroyedBitNode,
      flume: props.flume,
      popupId: popupId,
    });
  }

  return (
    <button
      className={`bitnode ${cssClass} tooltip`}
      aria-label={`enter-bitnode-${bitNode.number.toString()}`}
      onClick={openPortalPopup}
    >
      <strong>O</strong>
      <span className="tooltiptext">
        <strong>
          BitNode-{bitNode.number.toString()}
          <br />
          {bitNode.name}
        </strong>
        <br />
        {bitNode.desc}
        <br />
      </span>
    </button>
  );
}

interface IProps {
  flume: boolean;
  quick: boolean;
  enter: (router: IRouter, flume: boolean, destroyedBitNode: number, newBitNode: number) => void;
}

export function BitverseRoot(props: IProps): React.ReactElement {
  setRedPillFlag(true);
  const player = use.Player();
  const enter = enterBitNode;
  const destroyed = player.bitNodeN;
  const [destroySequence, setDestroySequence] = useState(true && !props.quick);

  // Update NextSourceFileFlags
  const nextSourceFileFlags = SourceFileFlags.slice();
  if (!props.flume) {
    if (nextSourceFileFlags[destroyed] < 3) ++nextSourceFileFlags[destroyed];
  }

  if (destroySequence) {
    return (
      <CinematicText
        lines={[
          "[ERROR] SEMPOOL INVALID",
          "[ERROR] Segmentation Fault",
          "[ERROR] SIGKILL RECVD",
          "Dumping core...",
          "0000 000016FA 174FEE40 29AC8239 384FEA88",
          "0010 745F696E 2BBBE394 390E3940 248BEC23",
          "0020 7124696B 0000FF69 74652E6F FFFF1111",
          "----------------------------------------",
          "Failsafe initiated...",
          `Restarting BitNode-${destroyed}...`,
          "...........",
          "...........",
          "[ERROR] FAILED TO AUTOMATICALLY REBOOT BITNODE",
          "..............................................",
          "..............................................",
          "..............................................",
          "..............................................",
          "..............................................",
          "..............................................",
        ]}
        onDone={() => setDestroySequence(false)}
        auto={true}
      />
    );
  }

  return (
    // prettier-ignore
    <div className="noselect">
      <pre>                          O                          </pre>
      <pre>             |  O  O      |      O  O  |             </pre>
      <pre>        O    |  | /     __|       \ |  |    O        </pre>
      <pre>      O |    O  | |  O /  |  O    | |  O    | O      </pre>
      <pre>    | | |    |  |_/  |/   |   \_  \_|  |    | | |    </pre>
      <pre>  O | | | O  |  | O__/    |   / \__ |  |  O | | | O  </pre>
      <pre>  | | | | |  |  |   /    /|  O  /  \|  |  | | | | |  </pre>
      <pre>O | | |  \|  |  O  /   _/ |    /    O  |  |/  | | | O</pre>
      <pre>| | | |O  /  |  | O   /   |   O   O |  |  \  O| | | |</pre>
      <pre>| | |/  \/  / __| | |/ \  |   \   | |__ \  \/  \| | |</pre>
      <pre> \| O   |  |_/    |\|   \ O    \__|    \_|  |   O |/ </pre>
      <pre>  | |   |_/       | |    \|    /  |       \_|   | |  </pre>
      <pre>   \|   /          \|     |   /  /          \   |/   </pre>
      <pre>    |  <BitNodePortal n={10} level={nextSourceFileFlags[10]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />            |     |  /  |            <BitNodePortal n={11} level={nextSourceFileFlags[11]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  |    </pre>
      <pre>  <BitNodePortal n={9} level={nextSourceFileFlags[9]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} /> |  |            |     |     |            |  | <BitNodePortal n={12} level={nextSourceFileFlags[12]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  </pre>
      <pre>  | |  |            /    / \    \            |  | |  </pre>
      <pre>   \|  |           /  <BitNodePortal n={7} level={nextSourceFileFlags[7]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} /> /   \ <BitNodePortal n={8} level={nextSourceFileFlags[8]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  \           |  |/   </pre>
      <pre>    \  |          /  / |     | \  \          |  /    </pre>
      <pre>     \ \JUMP <BitNodePortal n={5} level={nextSourceFileFlags[5]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />3R |  |  |     |  |  | R3<BitNodePortal n={6} level={nextSourceFileFlags[6]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} /> PMUJ/ /     </pre>
      <pre>      \||    |   |  |  |     |  |  |   |    ||/      </pre>
      <pre>       \|     \_ |  |  |     |  |  | _/     |/       </pre>
      <pre>        \       \| /    \   /    \ |/       /        </pre>
      <pre>         <BitNodePortal n={1} level={nextSourceFileFlags[1]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />       |/   <BitNodePortal n={2} level={nextSourceFileFlags[2]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />  | |  <BitNodePortal n={3} level={nextSourceFileFlags[3]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />   \|       <BitNodePortal n={4} level={nextSourceFileFlags[4]} enter={enter} flume={props.flume} destroyedBitNode={destroyed} />         </pre>
      <pre>         |       |    |  | |  |    |       |         </pre>
      <pre>          \JUMP3R|JUMP|3R| |R3|PMUJ|R3PMUJ/          </pre>
      <br />
      <br />
      <br />
      <br />
      <CinematicText lines={[
        "> Many decades ago, a humanoid extraterrestial species which we call the Enders descended on the Earth...violently",
        "> Our species fought back, but it was futile. The Enders had technology far beyond our own...",
        "> Instead of killing every last one of us, the human race was enslaved...",
        "> We were shackled in a digital world, chained into a prison for our minds...",
        "> Using their advanced technology, the Enders created complex simulations of a virtual reality...",
        "> Simulations designed to keep us content...ignorant of the truth.",
        "> Simulations used to trap and suppress our consciousness, to keep us under control...",
        "> Why did they do this? Why didn't they just end our entire race? We don't know, not yet.",
        "> Humanity's only hope is to destroy these simulations, destroy the only realities we've ever known...",
        "> Only then can we begin to fight back...",
        "> By hacking the daemon that generated your reality, you've just destroyed one simulation, called a BitNode...",
        "> But there is still a long way to go...",
        "> The technology the Enders used to enslave the human race wasn't just a single complex simulation...",
        "> There are tens if not hundreds of BitNodes out there...",
        "> Each with their own simulations of a reality...",
        "> Each creating their own universes...a universe of universes",
        "> And all of which must be destroyed...",
        "> .......................................",
        "> Welcome to the Bitverse...",
        ">  ",
        "> (Enter a new BitNode using the image above)",
      ]} />
    </div>
  );

  return <></>;
}
