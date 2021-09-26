/**
 * React Subcomponent for displaying a location's UI, when that location is a tech vendor
 *
 * This subcomponent renders all of the buttons for purchasing things from tech vendors
 */
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Location } from "../Location";
import { RamButton } from "./RamButton";
import { TorButton } from "./TorButton";
import { CoresButton } from "./CoresButton";

import { IPlayer } from "../../PersonObjects/IPlayer";
import { getPurchaseServerCost } from "../../Server/ServerPurchases";

import { StdButton } from "../../ui/React/StdButton";
import { Money } from "../../ui/React/Money";
import { createPopup } from "../../ui/React/createPopup";
import { PurchaseServerPopup } from "./PurchaseServerPopup";

type IProps = {
  loc: Location;
  p: IPlayer;
};

export function TechVendorLocation(props: IProps): React.ReactElement {
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  function openPurchaseServer(ram: number, cost: number, p: IPlayer): void {
    const popupId = "purchase-server-popup";
    createPopup(popupId, PurchaseServerPopup, {
      ram: ram,
      cost: cost,
      p: p,
      popupId: popupId,
      rerender: rerender,
    });
  }

  useEffect(() => {
    const id = setInterval(rerender, 1000);
    return () => clearInterval(id);
  }, []);

  const purchaseServerButtons: React.ReactNode[] = [];
  for (let i = props.loc.techVendorMinRam; i <= props.loc.techVendorMaxRam; i *= 2) {
    const cost = getPurchaseServerCost(i);
    purchaseServerButtons.push(
      <>
        <Button key={i} onClick={() => openPurchaseServer(i, cost, props.p)} disabled={!props.p.canAfford(cost)}>
          Purchase {i}GB Server&nbsp;-&nbsp;
          <Money money={cost} player={props.p} />
        </Button>
        <br />
      </>,
    );
  }

  return (
    <div>
      {purchaseServerButtons}
      <br />
      <Typography className="noselect">
        <i>"You can order bigger servers via scripts. We don't take custom order in person."</i>
      </Typography>
      <br />
      <TorButton p={props.p} rerender={rerender} />
      <br />
      <RamButton p={props.p} rerender={rerender} />
      <br />
      <CoresButton p={props.p} rerender={rerender} />
    </div>
  );
}
