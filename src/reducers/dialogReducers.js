import {
  ADD_DIALOG_TO_ACTIVE,
  ADD_TO_SAVE, DELETE_FROM_SAVE,
  GET_DIALOGS_FAILURE,
  GET_DIALOGS_REQUEST,
  GET_DIALOGS_SUCCESS,
  RESET_DIALOGS_STORE,
  SET_ACTIVE_DIALOG,
  SET_ACTIVE_TAB,
  SET_FILTERED_DIALOGS,
  SET_OPEN_DIALOG,
  SET_PROFILE_OPEN,
  SET_SELECTED_DIALOG,
  ADD_MESSAGE_TO_DIALOG
} from '../actions/dialogAction'

const initialState = {
  loadingData: false,
  error: null,
  dialogs: {
    start: [],
    active: [],
    complete: [],
    save: []
  },
  filteredMessages: {
    start: [],
    active: [],
    complete: [],
    save: []
  }, // состояние для отфильтрованных сообщений
  lengthDialogs: {
    active: 0,
    complete: 0,
    save: 0,
    start: 0
  }, // понадобится позже при пагинации диалогов
  isOpen: false, // открыть-закрыть окно профиля
  isSelected: {}, // подсвечивать диалог, при его выборе
  activeTab: 'start',
  activeDialog: {},
  isOpenDialog: false // состояние для определения открыт ли диалог или нет
}

export function dialogReducer (state = initialState, action) {
  switch (action.type) {
    case GET_DIALOGS_REQUEST:
      return {
        ...state,
        loadingData: true
      }
    case GET_DIALOGS_SUCCESS:
      return {
        ...state,
        dialogs: action.payload.dialogs,
        filteredMessages: action.payload.dialogs,
        lengthDialogs: action.payload.length
      }
    case GET_DIALOGS_FAILURE:
      return {
        ...state,
        error: action.error
      }
    case SET_FILTERED_DIALOGS:
      return {
        ...state,
        filteredMessages: {
          ...state.filteredMessages,
          [action.payload.tab]: action.payload.dialogs
        }
      }
    case RESET_DIALOGS_STORE:
      return initialState
    case SET_PROFILE_OPEN:
      return {
        ...state,
        isOpen: action.payload
      }
    case ADD_TO_SAVE:
      return {
        ...state,
        filteredMessages: {
          ...state.filteredMessages,
          save: [...state.filteredMessages.save, action.payload.dialog], // добавляем в сохраненных
          [action.payload.status]: state.filteredMessages[action.payload.status].filter((_, index) => index !== action.payload.index) // убираем из активных
        },
        lengthDialogs: {
          ...state.lengthDialogs,
          save: state.lengthDialogs.save + 1,
          [action.payload.dialog.status]: state.lengthDialogs[action.payload.dialog.status] - 1
        }
      }
    case DELETE_FROM_SAVE:
      return {
        ...state,
        filteredMessages: {
          ...state.filteredMessages,
          save: state.filteredMessages.save.filter((_, index) => index !== action.payload.index), // убираем из сохраненных
          [action.payload.dialog.status]: [...state.filteredMessages[action.payload.dialog.status], action.payload.dialog] // добавляем откуда взяли
        },
        lengthDialogs: {
          ...state.lengthDialogs,
          save: state.lengthDialogs.save - 1,
          [action.payload.dialog.status]: state.lengthDialogs[action.payload.dialog.status] + 1
        }
      }
    case ADD_DIALOG_TO_ACTIVE :
      return {
        ...state,
        filteredMessages: {
          ...state.filteredMessages,
          active: [...state.filteredMessages.active, action.payload]
        },
        lengthDialogs: {
          ...state.lengthDialogs,
          active: state.lengthDialogs.active + 1
        }
      }
    case SET_SELECTED_DIALOG:
      return {
        ...state,
        isSelected: action.payload
      }
    case SET_ACTIVE_TAB:
      return {
        ...state,
        activeTab: action.payload
      }
    case SET_ACTIVE_DIALOG:
      return {
        ...state,
        activeDialog: action.payload
      }
    case SET_OPEN_DIALOG:
      return {
        ...state,
        isOpenDialog: action.payload
      }
    case ADD_MESSAGE_TO_DIALOG:
      // eslint-disable-next-line no-case-declarations
      const aPl = action.payload
      // eslint-disable-next-line no-case-declarations
      const newMessagesArray = [...state.filteredMessages[aPl.status][aPl.index].messages, aPl.message]
      return {
        ...state,
        filteredMessages: {
          ...state.filteredMessages,
          // eslint-disable-next-line array-callback-return
          [aPl.status]: state.filteredMessages[aPl.status].map(dialog => {
            if (typeof dialog !== 'undefined') {
              return dialog.uuid === aPl.id
                // transform the one with a matching id
                ? { ...dialog, messages: newMessagesArray }
                // otherwise return original
                : dialog
            }
          })
        }
      }
    default:
      return state
  }
}
