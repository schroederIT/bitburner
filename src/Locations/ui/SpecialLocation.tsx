/**
 * React Subcomponent for displaying a location's UI, when that location has special
 * actions/options/properties
 *
 * Examples:
 *      - Bladeburner @ NSA
 *      - Re-sleeving @ VitaLife
 *      - Create Corporation @ City Hall
 *
 * This subcomponent creates all of the buttons for interacting with those special
 * properties
 */
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { Location } from "../Location";
import { CreateCorporationPopup } from "../../Corporation/ui/CreateCorporationPopup";
import { createPopup } from "../../ui/React/createPopup";
import { LocationName } from "../data/LocationNames";

import { use } from "../../ui/Context";

import { dialogBoxCreate } from "../../ui/React/DialogBox";

type IProps = {
  loc: Location;
};

export function SpecialLocation(props: IProps): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const setRerender = useState(false)[1];
  const inBladeburner = player.inBladeburner();
  /**
   * Click handler for "Create Corporation" button at Sector-12 City Hall
   */
  function createCorporationPopup(): void {
    const popupId = `create-start-corporation-popup`;
    createPopup(popupId, CreateCorporationPopup, {
      player: player,
      popupId: popupId,
      router: router,
    });
  }

  /**
   * Click handler for Bladeburner button at Sector-12 NSA
   */
  function handleBladeburner(): void {
    const p = player;
    if (p.inBladeburner()) {
      // Enter Bladeburner division
      router.toBladeburner();
    } else {
      // Apply for Bladeburner division
      if (p.strength >= 100 && p.defense >= 100 && p.dexterity >= 100 && p.agility >= 100) {
        p.startBladeburner({ new: true });
        dialogBoxCreate("You have been accepted into the Bladeburner division!");
        setRerender((old) => !old);

        const worldHeader = document.getElementById("world-menu-header");
        if (worldHeader instanceof HTMLElement) {
          worldHeader.click();
          worldHeader.click();
        }
      } else {
        dialogBoxCreate("Rejected! Please apply again when you have 100 of each combat stat (str, def, dex, agi)");
      }
    }
  }

  /**
   * Click handler for Resleeving button at New Tokyo VitaLife
   */
  function handleResleeving(): void {
    router.toResleeves();
  }

  function renderBladeburner(): React.ReactElement {
    if (!player.canAccessBladeburner()) {
      return <></>;
    }
    const text = inBladeburner ? "Enter Bladeburner Headquarters" : "Apply to Bladeburner Division";
    return <Button onClick={handleBladeburner}>{text}</Button>;
  }

  function renderNoodleBar(): React.ReactElement {
    function EatNoodles(): void {
      dialogBoxCreate(<>You ate some delicious noodles and feel refreshed.</>);
    }

    return <Button onClick={EatNoodles}>Eat noodles</Button>;
  }

  function renderCreateCorporation(): React.ReactElement {
    if (!player.canAccessCorporation()) {
      return (
        <>
          <Typography>
            <i>A business man is yelling at a clerk. You should come back later.</i>
          </Typography>
        </>
      );
    }
    return (
      <Button disabled={!player.canAccessCorporation() || player.hasCorporation()} onClick={createCorporationPopup}>
        Create a Corporation
      </Button>
    );
  }

  function renderResleeving(): React.ReactElement {
    if (!player.canAccessResleeving()) {
      return <></>;
    }
    return <Button onClick={handleResleeving}>Re-Sleeve</Button>;
  }

  switch (props.loc.name) {
    case LocationName.NewTokyoVitaLife: {
      return renderResleeving();
    }
    case LocationName.Sector12CityHall: {
      return renderCreateCorporation();
    }
    case LocationName.Sector12NSA: {
      return renderBladeburner();
    }
    case LocationName.NewTokyoNoodleBar: {
      return renderNoodleBar();
    }
    default:
      console.error(`Location ${props.loc.name} doesn't have any special properties`);
      return <></>;
  }
}
