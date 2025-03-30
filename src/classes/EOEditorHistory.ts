import { EHistory } from "@etsoo/shared";

/**
 * EOEditor history state
 */
export interface EOEditorHistoryState {
  /**
   * Title
   */
  title: string;

  /**
   * Current (redo) action
   */
  action: () => unknown;

  /**
   * Undo action
   */
  undo: () => unknown;
}

/**
 * EOEditor history
 */
export class EOEditorHistory extends EHistory<EOEditorHistoryState> {}
