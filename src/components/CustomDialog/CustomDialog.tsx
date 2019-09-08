import React, { useState } from 'react';
import {
  Paper,
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  DialogContentText
} from '@material-ui/core';

type Props = {
  content: string;
};

export default function CustomDialog(props: Props) {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open}>
      <Paper>
        <DialogContent>
          <DialogContentText>{props.content}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Paper>
    </Dialog>
  );
}
