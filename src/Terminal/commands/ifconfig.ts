import { ITerminal } from "../ITerminal";
import { IRouter } from "../../ui/Router";
import { IPlayer } from "../../PersonObjects/IPlayer";
import { BaseServer } from "../../Server/BaseServer";

export function ifconfig(
  terminal: ITerminal,
  router: IRouter,
  player: IPlayer,
  server: BaseServer,
  args: (string | number)[],
): void {
  if (args.length !== 0) {
    terminal.error("Incorrect usage of ifconfig command. Usage: ifconfig");
    return;
  }
  terminal.print(player.getCurrentServer().ip);
}
