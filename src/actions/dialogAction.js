export const GET_DIALOGS_REQUEST = 'GET_DIALOGS_REQUEST'
export const GET_DIALOGS_SUCCESS = 'GET_DIALOGS_SUCCESS'
export const GET_DIALOGS_FAILURE = 'GET_DIALOGS_FAILURE'

export const GET_TOPICS_REQUEST = 'GET_TOPICS_REQUEST'
export const GET_TOPICS_SUCCESS = 'GET_TOPICS_SUCCESS'
export const GET_TOPICS_FAILURE = 'GET_TOPICS_FAILURE'

export const SET_FILTERED_DIALOGS = 'SET_FILTERED_DIALOGS'
export const SET_END_DIALOGS = 'SET_END_DIALOGS'

export const RESET_DIALOGS_STORE = 'RESET_DIALOGS_STORE'

export const ADD_TO_SAVE = 'ADD_TO_SAVE'
export const DELETE_FROM_SAVE = 'DELETE_FROM_SAVE'
export const ADD_DIALOG_TO_ACTIVE = 'ADD_DIALOG_TO_ACTIVE'
export const ADD_DIALOG_TO_STATE = 'ADD_DIALOG_TO_STATE'

export const ADD_MESSAGE_TO_DIALOG = 'ADD_MESSAGE_TO_DIALOG'

export const CHECK_ATTACH_OPERATOR = 'CHECK_ATTACH_OPERATOR'

// используем - если хотим чтобы после перезагрузки сохранялись выбранные диалоги, вкладки, подсветка активной вкладки, окно профиля открытыми
export const SET_ACTIVE_TAB = 'SET_ACTIVE_TAB'
export const SET_OPEN_DIALOG = 'SET_OPEN_DIALOG'
export const SET_PROFILE_OPEN = 'SET_PROFILE_OPEN'
export const SET_ACTIVE_DIALOG = 'SET_ACTIVE_DIALOG'
export const SET_SELECTED_DIALOG = 'SET_SELECTED_DIALOG'

// =======================================

export function getDialogs () {
  return {
    type: GET_DIALOGS_REQUEST
  }
}

export function getDialogsSuccess (dialogs) {
  return {
    type: GET_DIALOGS_REQUEST,
    dialogs
  }
}

export function getDialogsError (error) {
  return {
    type: GET_DIALOGS_REQUEST,
    error
  }
}

export function getTopics () {
  return {
    type: GET_TOPICS_REQUEST
  }
}

export function getTopicsSuccess (topics) {
  return {
    type: GET_TOPICS_SUCCESS,
    topics
  }
}

export function getTopicsError (error) {
  return {
    type: GET_TOPICS_FAILURE,
    error
  }
}

// =======================================

export function setFilteredDialogs (dialogs) {
  return {
    type: SET_FILTERED_DIALOGS,
    dialogs
  }
}

export function setEndDialogs () {
  return {
    type: SET_END_DIALOGS
  }
}

// =======================================

export function resetDialogs () {
  return {
    type: RESET_DIALOGS_STORE
  }
}

// =======================================

export function addToSave () {
  return {
    type: ADD_TO_SAVE
  }
}

export function deleteFromSave () {
  return {
    type: DELETE_FROM_SAVE
  }
}

export function addToActive () {
  return {
    type: ADD_DIALOG_TO_ACTIVE
  }
}

export function addDialogToState () {
  return {
    type: ADD_DIALOG_TO_STATE
  }
}

// =======================================

export function setProfileOpen () {
  return {
    type: SET_PROFILE_OPEN
  }
}

export function setOpenDialog () {
  return {
    type: SET_OPEN_DIALOG
  }
}

export function setActiveTab () {
  return {
    type: SET_ACTIVE_TAB
  }
}

export function setActiveDialog () {
  return {
    type: SET_ACTIVE_DIALOG
  }
}

export function setSelectedDialog () {
  return {
    type: SET_SELECTED_DIALOG
  }
}

// =======================================

export function addMessageToDialog () {
  return {
    type: ADD_MESSAGE_TO_DIALOG
  }
}

export function checkAttachOperator () {
  return {
    type: CHECK_ATTACH_OPERATOR
  }
}
