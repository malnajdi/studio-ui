/*
 * Copyright (C) 2007-2020 Crafter Software Corporation. All Rights Reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License version 3 as published by
 * the Free Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React from 'react';
import { useStyles } from './styles';
import PhotoSizeSelectActualIcon from '@material-ui/icons/PublicRounded';
import PlaceRoundedIcon from '@material-ui/icons/PlaceRounded';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVertRounded';

interface HeaderProps {
  locale: string;
  title: string;
  icon: React.ElementType | string;
  onClick?(): void;
  onLanguageMenu?(anchor: Element): void;
  onContextMenu?(anchor: Element): void;
}

// PathNavigatorHeader
export default function (props: HeaderProps) {
  const classes = useStyles({});
  const { title, icon: Icon, locale, onLanguageMenu, onContextMenu, onClick } = props;
  const currentFlag = (locale: string) => {
    switch (locale) {
      case 'en': {
        return <PhotoSizeSelectActualIcon />;
      }
      case 'es': {
        return <PlaceRoundedIcon />;
      }
      default: {
        return <PhotoSizeSelectActualIcon />;
      }
    }
  };
  return (
    <header className={clsx(classes.headerRoot)} onClick={onClick}>
      {typeof Icon === 'string' ? (
        <span className={`fa ${Icon}`} />
      ) : (
        <Icon className={classes.pagesIcon} />
      )}
      <Typography
        variant="body1"
        component="h6"
        className={classes.headerTitle}
        children={title}
      />
      <IconButton
        aria-label="language select"
        className={classes.iconButton}
        onClick={(e) => {
          e.stopPropagation();
          onLanguageMenu(e.currentTarget);
        }}
      >
        {currentFlag(locale)}
      </IconButton>
      <IconButton
        aria-label="options"
        className={classes.iconButton}
        onClick={(e) => {
          e.stopPropagation();
          onContextMenu(e.currentTarget);
        }}
      >
        <MoreVertIcon />
      </IconButton>
    </header>
  );
}