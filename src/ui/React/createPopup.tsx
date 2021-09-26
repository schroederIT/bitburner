/**
 * Create a pop-up dialog box using React.
 *
 * Calling this function with the same ID and React Root Component will trigger a re-render
 *
 * @param id The (hopefully) unique identifier for the popup container
 * @param rootComponent Root React Component for the content (NOT the popup containers themselves)
 */
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Popup } from "./Popup";

import { createElement } from "../uiHelpers/createElement";
import { removeElementById } from "../uiHelpers/removeElementById";

let gameContainer: HTMLElement;

(function () {
  function getGameContainer(): void {
    const container = document.getElementById("root");
    if (container == null) {
      throw new Error(`Failed to find game container DOM element`);
    }

    gameContainer = container;
    document.removeEventListener("DOMContentLoaded", getGameContainer);
  }

  document.addEventListener("DOMContentLoaded", getGameContainer);
})();

// This variable is used to avoid setting the semi-transparent background
// several times on top of one another. Sometimes there's several popup at once.
let deepestPopupId = "";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function createPopup<T>(
  id: string,
  rootComponent: (props: T) => React.ReactElement,
  props: T,
  onClose?: () => void,
): HTMLElement | null {
  let container = document.getElementById(id);
  if (container == null) {
    function onClick(this: HTMLElement, event: MouseEvent): void {
      if (!event.srcElement) return;
      if (!(event.srcElement instanceof HTMLElement)) return;
      const clickedId = (event.srcElement as HTMLElement).id;
      if (clickedId !== id) return;
      removePopup(id);
      if (onClose) onClose();
    }
    const backgroundColor = deepestPopupId === "" ? "rgba(0,0,0,0.5)" : "rgba(0,0,0,0)";
    container = createElement("div", {
      class: "popup-box-container",
      display: "flex",
      id: id,
      backgroundColor: backgroundColor,
      mouseDown: onClick,
    });

    gameContainer.appendChild(container);
  }

  if (deepestPopupId === "") deepestPopupId = id;
  ReactDOM.render(
    <Popup
      content={rootComponent}
      id={id}
      props={props}
      removePopup={() => {
        removePopup(id);
        if (onClose) onClose();
      }}
    />,
    container,
  );

  return container;
}

/**
 * Closes a popup created with the createPopup() function above
 */
export function removePopup(id: string): void {
  const content = document.getElementById(`${id}`);
  if (content == null) return;

  ReactDOM.unmountComponentAtNode(content);

  removeElementById(id);
  removeElementById(`${id}-close`);
  if (id === deepestPopupId) deepestPopupId = "";
}
