import React, { useState } from "react";

import { Sleeve } from "../Sleeve";
import { SleeveTaskType } from "../SleeveTaskTypesEnum";

import { IPlayer } from "../../IPlayer";
import { CONSTANTS } from "../../../Constants";

import { Crimes } from "../../../Crime/Crimes";

import { numeralWrapper } from "../../../ui/numeralFormat";

import { dialogBoxCreate } from "../../../ui/React/DialogBox";

import { createProgressBarText } from "../../../utils/helpers/createProgressBarText";

import { createPopup } from "../../../ui/React/createPopup";

import { SleeveAugmentationsPopup } from "../ui/SleeveAugmentationsPopup";
import { TravelPopup } from "../ui/TravelPopup";
import { EarningsTableElement } from "../ui/EarningsTableElement";
import { Money } from "../../../ui/React/Money";
import { MoneyRate } from "../../../ui/React/MoneyRate";
import { ReputationRate } from "../../../ui/React/ReputationRate";
import { StatsElement } from "../ui/StatsElement";
import { MoreStatsContent } from "../ui/MoreStatsContent";
import { MoreEarningsContent } from "../ui/MoreEarningsContent";
import { TaskSelector } from "../ui/TaskSelector";
import { FactionWorkType } from "../../../Faction/FactionWorkTypeEnum";

interface IProps {
  player: IPlayer;
  sleeve: Sleeve;
  rerender: () => void;
}

export function SleeveElem(props: IProps): React.ReactElement {
  const [abc, setABC] = useState(["------", "------", "------"]);

  function openMoreStats(): void {
    dialogBoxCreate(<MoreStatsContent sleeve={props.sleeve} />);
  }

  function openTravel(): void {
    const popupId = "sleeve-travel-popup";
    createPopup(popupId, TravelPopup, {
      popupId: popupId,
      sleeve: props.sleeve,
      player: props.player,
      rerender: props.rerender,
    });
  }

  function openManageAugmentations(): void {
    const popupId = "sleeve-augmentation-popup";
    createPopup(popupId, SleeveAugmentationsPopup, {
      sleeve: props.sleeve,
      player: props.player,
    });
  }

  function openMoreEarnings(): void {
    dialogBoxCreate(<MoreEarningsContent sleeve={props.sleeve} />);
  }

  function setTask(): void {
    props.sleeve.resetTaskStatus(); // sets to idle
    switch (abc[0]) {
      case "------":
        break;
      case "Work for Company":
        props.sleeve.workForCompany(props.player, abc[1]);
        break;
      case "Work for Faction":
        props.sleeve.workForFaction(props.player, abc[1], abc[2]);
        break;
      case "Commit Crime":
        props.sleeve.commitCrime(props.player, abc[1]);
        break;
      case "Take University Course":
        props.sleeve.takeUniversityCourse(props.player, abc[2], abc[1]);
        break;
      case "Workout at Gym":
        props.sleeve.workoutAtGym(props.player, abc[2], abc[1]);
        break;
      case "Shock Recovery":
        props.sleeve.shockRecovery(props.player);
        break;
      case "Synchronize":
        props.sleeve.synchronize(props.player);
        break;
      default:
        console.error(`Invalid/Unrecognized taskValue in setSleeveTask(): ${abc[0]}`);
    }
    props.rerender();
  }

  let desc = <></>;
  switch (props.sleeve.currentTask) {
    case SleeveTaskType.Idle:
      desc = <>This sleeve is currently idle</>;
      break;
    case SleeveTaskType.Company:
      desc = <>This sleeve is currently working your job at {props.sleeve.currentTaskLocation}.</>;
      break;
    case SleeveTaskType.Faction: {
      let doing = "nothing";
      switch (props.sleeve.factionWorkType) {
        case FactionWorkType.Field:
          doing = "Field work";
          break;
        case FactionWorkType.Hacking:
          doing = "Hacking contracts";
          break;
        case FactionWorkType.Security:
          doing = "Security work";
          break;
      }
      desc = (
        <>
          This sleeve is currently doing {doing} for {props.sleeve.currentTaskLocation}.
        </>
      );
      break;
    }
    case SleeveTaskType.Crime:
      desc = (
        <>
          This sleeve is currently attempting to {Crimes[props.sleeve.crimeType].type} (Success Rate:{" "}
          {numeralWrapper.formatPercentage(Crimes[props.sleeve.crimeType].successRate(props.sleeve))}).
        </>
      );
      break;
    case SleeveTaskType.Class:
      desc = <>This sleeve is currently studying/taking a course at {props.sleeve.currentTaskLocation}.</>;
      break;
    case SleeveTaskType.Gym:
      desc = <>This sleeve is currently working out at {props.sleeve.currentTaskLocation}.</>;
      break;
    case SleeveTaskType.Recovery:
      desc = (
        <>
          This sleeve is currently set to focus on shock recovery. This causes the Sleeve's shock to decrease at a
          faster rate.
        </>
      );
      break;
    case SleeveTaskType.Synchro:
      desc = (
        <>
          This sleeve is currently set to synchronize with the original consciousness. This causes the Sleeve's
          synchronization to increase.
        </>
      );
      break;
    default:
      console.error(`Invalid/Unrecognized taskValue in updateSleeveTaskDescription(): ${abc[0]}`);
  }

  let data: any[][] = [];
  if (props.sleeve.currentTask === SleeveTaskType.Crime) {
    data = [
      [`Money`, <Money money={parseFloat(props.sleeve.currentTaskLocation)} />, `(on success)`],
      [`Hacking Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.hack), `(2x on success)`],
      [`Strength Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.str), `(2x on success)`],
      [`Defense Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.def), `(2x on success)`],
      [`Dexterity Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.dex), `(2x on success)`],
      [`Agility Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.agi), `(2x on success)`],
      [`Charisma Exp`, numeralWrapper.formatExp(props.sleeve.gainRatesForTask.cha), `(2x on success)`],
    ];

    // elems.taskProgressBar.innerText = createProgressBarText({
    //   progress: props.sleeve.currentTaskTime / props.sleeve.currentTaskMaxTime,
    //   totalTicks: 25,
    // });
  } else {
    data = [
      [`Money:`, <MoneyRate money={5 * props.sleeve.gainRatesForTask.money} />],
      [`Hacking Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.hack)} / s`],
      [`Strength Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.str)} / s`],
      [`Defense Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.def)} / s`],
      [`Dexterity Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.dex)} / s`],
      [`Agility Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.agi)} / s`],
      [`Charisma Exp:`, `${numeralWrapper.formatExp(5 * props.sleeve.gainRatesForTask.cha)} / s`],
    ];
    if (props.sleeve.currentTask === SleeveTaskType.Company || props.sleeve.currentTask === SleeveTaskType.Faction) {
      const repGain: number = props.sleeve.getRepGain(props.player);
      data.push([`Reputation:`, ReputationRate(5 * repGain)]);
    }

    // elems.taskProgressBar.innerText = "";
  }

  return (
    <div className="sleeve-elem">
      <div className="sleeve-panel" style={{ width: "25%" }}>
        <div className="sleeve-stats-text">
          <StatsElement sleeve={props.sleeve} />
          <button className="std-button" onClick={openMoreStats}>
            More Stats
          </button>
          <button
            className={`std-button${props.player.money.lt(CONSTANTS.TravelCost) ? " tooltip" : ""}`}
            onClick={openTravel}
            disabled={props.player.money.lt(CONSTANTS.TravelCost)}
          >
            Travel
            {props.player.money.lt(CONSTANTS.TravelCost) && <span className="tooltiptext">Not enough money</span>}
          </button>
          <button
            className={`std-button${props.sleeve.shock < 100 ? " tooltip" : ""}`}
            onClick={openManageAugmentations}
            style={{ display: "block" }}
            disabled={props.sleeve.shock < 100}
          >
            Manage Augmentations
            {props.sleeve.shock < 100 && <span className="tooltiptext">Unlocked when sleeve has fully recovered</span>}
          </button>
        </div>
      </div>
      <div className="sleeve-panel" style={{ width: "40%" }}>
        <TaskSelector player={props.player} sleeve={props.sleeve} setABC={setABC} />
        <p>{desc}</p>
        <p>
          {props.sleeve.currentTask === SleeveTaskType.Crime &&
            createProgressBarText({
              progress: props.sleeve.currentTaskTime / props.sleeve.currentTaskMaxTime,
              totalTicks: 25,
            })}
        </p>
        <button className="std-button" onClick={setTask}>
          Set Task
        </button>
      </div>
      <div className="sleeve-panel" style={{ width: "35%" }}>
        <EarningsTableElement title="Earnings (Pre-Synchronization)" stats={data} />
        <button className="std-button" onClick={openMoreEarnings}>
          More Earnings Info
        </button>
      </div>
    </div>
  );
}
