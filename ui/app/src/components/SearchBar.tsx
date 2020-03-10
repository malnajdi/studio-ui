/*
 * Copyright (C) 2007-2019 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from 'react';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { InputBase, Theme } from '@material-ui/core';
//import { palette } from '../styles/theme';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import clsx from 'clsx';
import { defineMessages, useIntl } from 'react-intl';

const palette = {
  white: '#fff',
  black: '#000',
  blue: { tint: '#409CFF', main: '#007AFF', shade: '#0040DD' },
  green: { tint: '#30DB5B', main: '#34C759', shade: '#248A3D' },
  indigo: { tint: '#7D7AFF', main: '#5856D6', shade: '#3634A3' },
  orange: { tint: '#FFB340', main: '#FF9500', shade: '#C93400' },
  pink: { tint: '#FF6482', main: '#FF2D55', shade: '#D30F45' },
  purple: { tint: '#DA8FFF', main: '#AF52DE', shade: '#8944AB' },
  red: { tint: '#FF6961', main: '#FF3B30', shade: '#D70015' },
  teal: { tint: '#70D7FF', main: '#5AC8FA', shade: '#0071A4' },
  yellow: { tint: '#FFD426', main: '#FFCC00', shade: '#A05A00' },
  gray: {
    light0: '#FAFAFA',
    light1: '#F3F3F3',
    light2: '#F2F2F7',
    light3: '#EBEBF0',
    light4: '#E5E5EA',
    light5: '#D8D8DC',
    light6: '#D1D1D6',
    light7: '#C7C7CC',
    medium1: '#BCBCC0',
    medium2: '#AEAEB2',
    medium3: '#8E8E93',
    medium4: '#7C7C80',
    medium5: '#6C6C70',
    medium6: '#636366',
    medium7: '#545456',
    dark1: '#48484A',
    dark2: '#444446',
    dark3: '#3A3A3C',
    dark4: '#363638',
    dark5: '#2C2C2E',
    dark6: '#242426',
    dark7: '#1C1C1E'
  }
};

const useStyles = makeStyles((theme: Theme) => ({
  search: {
    position: 'relative',
    background: (props: any) => props.background,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    borderRadius: '5px',
    '&.focus': {
      backgroundColor: palette.white,
      boxShadow: '0px 0px 3px rgba(65, 69, 73, 0.15), 0px 4px 4px rgba(65, 69, 73, 0.15)'
    }
  },
  searchIcon: {
    color: theme.palette.text.secondary
  },
  closeIcon: {
    marginLeft: '10px',
    fontSize: '25px',
    color: theme.palette.text.secondary,
    cursor: 'pointer'
  },
  inputRoot: {
    flexGrow: 1
  },
  inputInput: {
    background: 'none',
    border: 'none',
    width: '100%',
    '&:focus': {
      boxShadow: 'none'
    }
  }
}));

const messages = defineMessages({
  placeholder: {
    id: 'searchBar.placeholder',
    defaultMessage: 'Search...'
  }
});

interface SearchBarProps {
  keyword: string[] | string;
  closeIcon?: boolean;
  persistentCloseIcon?: boolean;
  autofocus?: boolean;
  backgroundColor?: string;
  placeholder?: string;
  disabled?: boolean;
  classes?: {
    root?: any;
  };

  onChange(value: string): any;
}

export default function SearchBar(props: SearchBarProps) {
  const classes = useStyles({ background: props.backgroundColor || palette.gray.light5 });
  const { onChange, keyword, closeIcon = false, autofocus = false, placeholder, disabled = false, persistentCloseIcon = false } = props;
  const [focus, setFocus] = useState(false);
  const { formatMessage } = useIntl();
  return (
    <div className={clsx(classes.search, focus && 'focus', props.classes?.root)}>
      <SearchIcon className={classes.searchIcon}/>
      <InputBase
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        placeholder={placeholder || formatMessage(messages.placeholder)}
        autoFocus={autofocus}
        disabled={disabled}
        value={keyword}
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput
        }}
        inputProps={{ 'aria-label': 'search' }}
      />
      {
        (closeIcon && (persistentCloseIcon || keyword)) &&
        <CloseIcon className={classes.closeIcon} onClick={() => onChange('')}/>
      }
    </div>
  )
}
