import React, { useState, useEffect } from "react";
import { use } from "../../ui/Context";
import { getAvailableCreatePrograms } from "../ProgramHelpers";

import { Box, Tooltip, Typography } from "@mui/material";
import Button from "@mui/material/Button";

export function ProgramsRoot(): React.ReactElement {
  const player = use.Player();
  const router = use.Router();
  const setRerender = useState(false)[1];
  function rerender(): void {
    setRerender((old) => !old);
  }

  useEffect(() => {
    const id = setInterval(rerender, 200);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <Typography variant="h4">Create program</Typography>
      <Typography>
        This page displays any programs that you are able to create. Writing the code for a program takes time, which
        can vary based on how complex the program is. If you are working on creating a program you can cancel at any
        time. Your progress will be saved and you can continue later.
      </Typography>

      {getAvailableCreatePrograms(player).map((program) => {
        const create = program.create;
        if (create === null) return <></>;

        return (
          <React.Fragment key={program.name}>
            <Tooltip title={create.tooltip} disableInteractive>
              <Button
                sx={{ my: 1 }}
                onClick={(event) => {
                  if (!event.isTrusted) return;
                  player.startCreateProgramWork(router, program.name, create.time, create.level);
                }}
              >
                {program.name}
              </Button>
            </Tooltip>
            <br />
          </React.Fragment>
        );
      })}
    </>
  );
}
