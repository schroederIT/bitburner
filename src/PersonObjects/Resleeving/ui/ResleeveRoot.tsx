import React, { useState } from "react";

import { IPlayer } from "../../IPlayer";
import { generateResleeves } from "../Resleeving";
import { Resleeve } from "../Resleeve";
import { ResleeveElem } from "./ResleeveElem";

const SortOption: {
  [key: string]: string | undefined;
  Cost: string;
  Hacking: string;
  Strength: string;
  Defense: string;
  Dexterity: string;
  Agility: string;
  Charisma: string;
  AverageCombatStats: string;
  AverageAllStats: string;
  TotalNumAugmentations: string;
} = {
  Cost: "Cost",
  Hacking: "Hacking Level",
  Strength: "Strength Level",
  Defense: "Defense Level",
  Dexterity: "Dexterity Level",
  Agility: "Agility Level",
  Charisma: "Charisma Level",
  AverageCombatStats: "Average Combat Stats",
  AverageAllStats: "Average Stats",
  TotalNumAugmentations: "Number of Augmentations",
};

// Helper function for averaging
function getAverage(...values: number[]): number {
  let sum = 0;
  for (let i = 0; i < values.length; ++i) {
    sum += values[i];
  }

  return sum / values.length;
}

const SortFunctions: {
  [key: string]: ((a: Resleeve, b: Resleeve) => number) | undefined;
  Cost: (a: Resleeve, b: Resleeve) => number;
  Hacking: (a: Resleeve, b: Resleeve) => number;
  Strength: (a: Resleeve, b: Resleeve) => number;
  Defense: (a: Resleeve, b: Resleeve) => number;
  Dexterity: (a: Resleeve, b: Resleeve) => number;
  Agility: (a: Resleeve, b: Resleeve) => number;
  Charisma: (a: Resleeve, b: Resleeve) => number;
  AverageCombatStats: (a: Resleeve, b: Resleeve) => number;
  AverageAllStats: (a: Resleeve, b: Resleeve) => number;
  TotalNumAugmentations: (a: Resleeve, b: Resleeve) => number;
} = {
  Cost: (a: Resleeve, b: Resleeve): number => a.getCost() - b.getCost(),
  Hacking: (a: Resleeve, b: Resleeve): number => a.hacking_skill - b.hacking_skill,
  Strength: (a: Resleeve, b: Resleeve): number => a.strength - b.strength,
  Defense: (a: Resleeve, b: Resleeve): number => a.defense - b.defense,
  Dexterity: (a: Resleeve, b: Resleeve): number => a.dexterity - b.dexterity,
  Agility: (a: Resleeve, b: Resleeve): number => a.agility - b.agility,
  Charisma: (a: Resleeve, b: Resleeve): number => a.charisma - b.charisma,
  AverageCombatStats: (a: Resleeve, b: Resleeve): number =>
    getAverage(a.strength, a.defense, a.dexterity, a.agility) -
    getAverage(b.strength, b.defense, b.dexterity, b.agility),
  AverageAllStats: (a: Resleeve, b: Resleeve): number =>
    getAverage(a.hacking_skill, a.strength, a.defense, a.dexterity, a.agility, a.charisma) -
    getAverage(b.hacking_skill, b.strength, b.defense, b.dexterity, b.agility, b.charisma),
  TotalNumAugmentations: (a: Resleeve, b: Resleeve): number => a.augmentations.length - b.augmentations.length,
};

interface IProps {
  player: IPlayer;
}

export function ResleeveRoot(props: IProps): React.ReactElement {
  const [sort, setSort] = useState(SortOption.Cost);
  // Randomly create all Resleeves if they dont already exist
  if (props.player.resleeves.length === 0) {
    props.player.resleeves = generateResleeves();
  }

  function onSortChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    setSort(event.target.value);
  }

  const sortFunction = SortFunctions[sort];
  if (sortFunction === undefined) throw new Error(`sort function '${sort}' is undefined`);
  props.player.resleeves.sort(sortFunction);

  return (
    <>
      <p style={{ display: "block", width: "75%" }}>
        Re-sleeving is the process of digitizing and transferring your consciousness into a new human body, or 'sleeve'.
        Here at VitaLife, you can purchase new specially-engineered bodies for the re-sleeve process. Many of these
        bodies even come with genetic and cybernetic Augmentations!
        <br />
        <br />
        Re-sleeving will change your experience for every stat. It will also REMOVE all of your currently-installed
        Augmentations, and replace them with the ones provided by the purchased sleeve. However, Augmentations that you
        have purchased but not installed will NOT be removed. If you have purchased an Augmentation and then re-sleeve
        into a body which already has that Augmentation, it will be removed (since you cannot have duplicate
        Augmentations).
        <br />
        <br />
        NOTE: The stats and multipliers displayed on this page do NOT include your bonuses from Source-File.
      </p>
      <p style={{ display: "inline-block" }}>Sort By: </p>
      <select className="dropdown" defaultValue={sort} onChange={onSortChange}>
        {Object.keys(SortOption).map((opt) => (
          <option key={opt} value={opt}>
            {SortOption[opt]}
          </option>
        ))}
      </select>
      {props.player.resleeves.map((resleeve, i) => (
        <ResleeveElem key={i} player={props.player} resleeve={resleeve} />
      ))}
    </>
  );
}
