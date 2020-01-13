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
 *
 *
 */

import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';
import AccessTimeIcon from '@material-ui/icons/AccessTimeRounded';
import PublicRoundedIcon from '@material-ui/icons/PublicRounded';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider, } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { getTimezones } from "../utils/datetime";

interface DateTimePickerProps {
  onChange?: Function;
  onChangeDate?: Function;
  onChangeTime?: Function;
  onChangeTimezone?: Function;
  dateFormat?: string;
  timeFormat?: string;
  initialDate?: string | moment.Moment | Number;
  timezone?: string;
  disablePast?: boolean;
  disabled?: boolean;
  classes?: any;
  controls?: string[];    // options: ['date', 'time', 'timezone'], ['date', 'time'], ['date']
}

const dateTimePickerStyles = () => ({
  root: {
    width: 'auto'
  },
  picker: {
    width: '100%',
    marginBottom: 0
  },
  pickerInput: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    fontSize: '14px'
  },
  pickerButton: {
    position: 'absolute' as 'absolute',
    right: 0
  },
  select: {
    padding: '8px 12px',
    borderRadius: '4px',
    marginTop: '16px',
    position: 'relative' as 'relative',
    backgroundColor: '#fff',
    fontSize: '14px'
  },
  selectIcon: {
    right: '12px',
    top: '22px'
  },
  autocompleteRoot: {
    marginTop: '16px',
    backgroundColor: '#fff'
  },
  autocompleteInputRoot: {
    paddingTop: '4px !important',
    paddingBottom: '4px !important',
    border: 'none'
  },
  autocompleteInput: {
    border: 'none',
    fontSize: '14px'
  },
  autocompleteEndAdornment: {
    right: '12px !important'
  }
});

interface timezoneType {
  timezoneName: string;
  timezoneOffset: string;
}

const timezones = getTimezones();

const getDateMoment = (date, timezoneObj) => {
  let dateMoment;

  switch (typeof date) {
    case 'string':
    case 'number':
      dateMoment = timezoneObj ? moment.tz(date, timezoneObj.timezoneName) : moment.tz(date);
      break;
    case 'object':
      // moment object, stays the same
      dateMoment = date;
      break;
    default:
      dateMoment = moment();
  }

  return dateMoment;
}

const DateTimePicker = withStyles(dateTimePickerStyles)((props: DateTimePickerProps) => {
  const {
    classes,
    onChange,
    onChangeDate,
    onChangeTime,
    onChangeTimezone,
    initialDate = moment(),
    timezone = moment.tz.guess(),
    dateFormat = 'YYYY-MM-DD',
    timeFormat = 'HH:MM:ss',
    disablePast = false,
    disabled = false,
    controls = ['date', 'time', 'timezone']
  } = props;

  let initialDateMoment;
  let timezoneObj = timezones.find(tz => (tz.timezoneName === unescape(timezone)));
  initialDateMoment = getDateMoment(initialDate, timezoneObj);

  const handleDateChange = (name: string) => (date: Date | null) => {
    let updatedDateTime = initialDateMoment;

    switch (name) {
      case 'scheduledDate':
        updatedDateTime.date(date.getDate());
        updatedDateTime.month(date.getMonth());
        updatedDateTime.year(date.getFullYear());
        break;
      case 'scheduledTime':
        updatedDateTime.hours(date.getHours());
        updatedDateTime.minutes(date.getMinutes());
        break;
    }

    onChange?.(updatedDateTime);

    onChangeDate?.(updatedDateTime.format(dateFormat));
    onChangeTime?.(updatedDateTime.format(timeFormat));
  };

  const handleTimezoneChange = () => (event: React.ChangeEvent<{}>, timezoneObj: any) => {
    const timezone = timezoneObj.timezoneName,
      updatedDateTime = moment.tz(initialDateMoment.format(), 'YYYY-MM-DD HH:mm A', timezone);

    onChange?.(updatedDateTime);
    onChangeTimezone?.(timezone);
  };

  return (
    <>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        { controls.includes('date') &&
          <KeyboardDatePicker
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker"
            value={initialDateMoment.format('YYYY-MM-DD HH:mm')}
            onChange={handleDateChange('scheduledDate')}
            className={classes.picker}
            InputAdornmentProps={{
              className: classes.pickerButton
            }}
            inputProps={{
              className: classes.pickerInput
            }}
            placeholder="Date"
            disabled={disabled}
            disablePast={disablePast}
          />
        }

        { controls.includes('time') &&
          <KeyboardTimePicker
            margin="normal"
            id="time-picker"
            value={initialDateMoment.format('YYYY-MM-DD HH:mm')}
            onChange={handleDateChange('scheduledTime')}
            keyboardIcon={<AccessTimeIcon />}
            className={classes.picker}
            InputAdornmentProps={{
              className: classes.pickerButton
            }}
            inputProps={{
              className: classes.pickerInput
            }}
            placeholder="Time"
            disabled={disabled}
          />
        }
      </MuiPickersUtilsProvider>

      {
        controls.includes('timezone') &&
        <Autocomplete
          options={timezones}
          getOptionLabel={(timezone: timezoneType) => (`${timezone.timezoneName} (GMT${timezone.timezoneOffset})`)}
          defaultValue={timezoneObj}
          onChange={handleTimezoneChange()}
          size="small"
          classes={{
            root: classes.autocompleteRoot,
            inputRoot: classes.autocompleteInputRoot,
            input: classes.autocompleteInput,
            endAdornment: classes.autocompleteEndAdornment
          }}
          popupIcon={<PublicRoundedIcon/>}
          disableClearable={true}
          renderInput={params => (
            <TextField {...params} variant="outlined" fullWidth/>
          )}
          disabled={disabled}
        />
      }
    </>
  )
});

export default DateTimePicker;
