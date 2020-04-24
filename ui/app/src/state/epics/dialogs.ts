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

import { Epic, ofType, StateObservable } from 'redux-observable';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { closeConfirmDialog } from '../reducers/dialogs/confirm';
import { NEVER } from 'rxjs';
import GlobalState from '../../models/GlobalState';
import { closeNewContentDialog } from '../reducers/dialogs/newContent';
import { closePublishDialog } from '../reducers/dialogs/publish';
import { camelize, dasherize } from '../../utils/string';
import { closeDeleteDialog } from '../reducers/dialogs/delete';
import {
  fetchItemVersions,
  fetchItemVersionsComplete,
  fetchItemVersionsFailed,
  revertContent,
  revertContentComplete,
  revertContentFailed
} from '../reducers/dialogs/history';
import {
  getConfigurationVersions,
  getContentVersion,
  getItemVersions,
  revertContentToVersion
} from '../../services/content';
import { catchAjaxError } from '../../utils/ajax';
import {
  fetchContentVersion,
  fetchItemVersionComplete,
  fetchItemVersionFailed,
  showViewVersionDialog
} from '../reducers/dialogs/viewVersion';

function getDialogNameFromType(type: string): string {
  let name = type.replace(/(CLOSE_)|(_DIALOG)/g, '');
  return camelize(dasherize(name.toLowerCase()));
}

function getDialogState(type: string, state: GlobalState): any {
  const stateName = getDialogNameFromType(type);
  const dialog = state.dialogs[stateName];
  if (!dialog) {
    console.error(`[epics/dialogs] Unable to retrieve dialog state from "${stateName}" action`);
  }
  return dialog;
}
export default [
  // region Dialogs
  (action$, state$: StateObservable<GlobalState>) =>
    action$.pipe(
      ofType(
        closeConfirmDialog.type,
        closePublishDialog.type,
        closeDeleteDialog.type,
        closeNewContentDialog.type
      ),
      withLatestFrom(state$),
      map(([{ type, payload }, state]) =>
        [payload, getDialogState(type, state)?.onClose].filter((callback) => Boolean(callback))
      ),
      switchMap((actions) => (actions.length ? actions : NEVER))
    ),
  // endregion
  // region History Dialog
  (action$, state$: StateObservable<GlobalState>) =>
    action$.pipe(
      ofType(fetchItemVersions.type),
      withLatestFrom(state$),
      switchMap(([{ payload }, state]) => {
        const service = (payload.config)
          ? getConfigurationVersions(
            state.sites.active,
            payload.path,
            payload.environment,
            payload.module
          )
          : getItemVersions(state.sites.active, payload.path);
        return service.pipe(
          map(fetchItemVersionsComplete),
          catchAjaxError(fetchItemVersionsFailed)
        );
      })
    ),
  (action$, state$: StateObservable<GlobalState>) =>
    action$.pipe(
      ofType(revertContent.type),
      withLatestFrom(state$),
      switchMap(([{ payload }, state]) =>
        revertContentToVersion(state.sites.active, state.dialogs.history.path, payload).pipe(
          map(revertContentComplete),
          catchAjaxError(revertContentFailed)
        )
      )
    ),
  (action$, state$: StateObservable<GlobalState>) =>
    action$.pipe(
      ofType(revertContentComplete.type),
      map(fetchItemVersions)
    ),
  // endregion
  // region View Version Dialog
  (action$, state$: StateObservable<GlobalState>) =>
    action$.pipe(
      ofType(showViewVersionDialog.type, fetchContentVersion.type),
      withLatestFrom(state$),
      switchMap(([{ payload }, state]) =>
        getContentVersion(state.sites.active, payload.path, payload.versionNumber).pipe(
          map(fetchItemVersionComplete),
          catchAjaxError(fetchItemVersionFailed)
        )
      )
    )
  // endregion
] as Epic[];
