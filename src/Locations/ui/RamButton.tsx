import React from "react";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";

import { CONSTANTS } from "../../Constants";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { purchaseRamForHomeComputer } from "../../Server/ServerPurchases";

import { Money } from "../../ui/React/Money";
import { MathComponent } from "mathjax-react";

type IProps = {
  p: IPlayer;
  rerender: () => void;
};

export function RamButton(props: IProps): React.ReactElement {
  const homeComputer = props.p.getHomeComputer();
  if (homeComputer.maxRam >= CONSTANTS.HomeComputerMaxRam) {
    return <Button>Upgrade 'home' RAM - MAX</Button>;
  }

  const cost = props.p.getUpgradeHomeRamCost();

  function buy(): void {
    purchaseRamForHomeComputer(props.p);
    props.rerender();
  }

  return (
    <Tooltip title={<MathComponent tex={String.raw`\large{cost = 3.2 \times 10^3 \times 1.58^{log_2{(ram)}}}`} />}>
      <Button disabled={!props.p.canAfford(cost)} onClick={buy}>
        Upgrade 'home' RAM ({homeComputer.maxRam}GB -&gt;&nbsp;{homeComputer.maxRam * 2}GB) -&nbsp;
        <Money money={cost} player={props.p} />
      </Button>
    </Tooltip>
  );
}
