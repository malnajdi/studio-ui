import React, { useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import MenuIcon from '@material-ui/icons/MenuRounded';
import AppBar from '@material-ui/core/AppBar';
import { closeTools, openTools, usePreviewContext } from './previewContext';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import KeyboardArrowDownRounded from '@material-ui/icons/KeyboardArrowDownRounded';
import KeyboardArrowLeftRounded from '@material-ui/icons/KeyboardArrowLeftRounded';
import KeyboardArrowRightRounded from '@material-ui/icons/KeyboardArrowRightRounded';
import RefreshRounded from '@material-ui/icons/RefreshRounded';
import MoreVertRounded from '@material-ui/icons/MoreVertRounded';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    padding: '2px 4px',
    display: 'flex',
    alignItems: 'center',
    width: 400
  },
  inputContainer: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  input: {
    border: 'none',
    '&:focus:invalid, &:focus': {
      border: 'none',
      boxShadow: 'none'
    }
  },
  iconButton: {

  },
  divider: {
    height: 28,
    margin: 4
  },

  grow: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  emptyPlaceholder: {
    width: 48,
    height: '100%'
  }

}));

export function AddressBar() {
  const classes = useStyles({});

  const [site, setSite] = useState('editorial');

  return (
    <>
      <IconButton className={classes.iconButton} aria-label="search">
        <KeyboardArrowLeftRounded/>
      </IconButton>
      <IconButton className={classes.iconButton} aria-label="search">
        <KeyboardArrowRightRounded/>
      </IconButton>
      <IconButton className={classes.iconButton} aria-label="search">
        <RefreshRounded/>
      </IconButton>
      <Paper className={classes.root}>
        <Select value={site} classes={{ select: classes.input }} onChange={(e: any) => setSite(e.target.value)}>
          <MenuItem value="editorial">
            editorial
          </MenuItem>
          <MenuItem value="empty">
            empty
          </MenuItem>
          <MenuItem value="ecom">
            ecommerce
          </MenuItem>
        </Select>
        <InputBase
          placeholder="/"
          className={classes.inputContainer}
          classes={{ input: classes.input }}
          inputProps={{ 'aria-label': '' }}
        />
        <IconButton className={classes.iconButton} aria-label="search">
          <KeyboardArrowDownRounded/>
        </IconButton>
      </Paper>
      <IconButton className={classes.iconButton} aria-label="search">
        <MoreVertRounded/>
      </IconButton>
    </>
  );
}

export default function ToolBar() {
  const [{ showToolsPanel }, dispatch] = usePreviewContext();
  return (
    <ToolBarUI
      onMenuButtonClicked={() => dispatch(showToolsPanel ? closeTools() : openTools())}
    />
  );
}

export function ToolBarUI(props: any) {
  const { onMenuButtonClicked } = props;
  const classes = useStyles({});
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <IconButton
          aria-label="Open drawer"
          onClick={onMenuButtonClicked}
        >
          <MenuIcon/>
        </IconButton>
        <section className={classes.grow}>
          <AddressBar/>
        </section>
        <div className={classes.emptyPlaceholder}/>
      </Toolbar>
    </AppBar>
  );
}