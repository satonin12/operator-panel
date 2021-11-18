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
  SET_SELECTED_DIALOG
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
  }, // состояние для отфильтрованны[ сообщений
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
  console.log(action)
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
        }
        // dialogs: {
        //   ...state.filteredMessages,
        //   save: [...state.filteredMessages.save, action.payload.dialog],
        //   [action.payload.status]: state.filteredMessages[action.payload.status].filter((_, index) => index !== action.payload.index)
        // }
      }
    case DELETE_FROM_SAVE:
      return {
        ...state,
        filteredMessages: {
          ...state.filteredMessages,
          save: state.filteredMessages.save.filter((_, index) => index !== action.payload.index), // убираем из сохраненных
          [action.payload.dialog.status]: [...state.filteredMessages[action.payload.dialog.status], action.payload.dialog] // добавляем откуда взяли
        }
      }
    case ADD_DIALOG_TO_ACTIVE :
      return {
        ...state,
        // dialogs: {
        //   ...state.dialogs,
        //   active: [...state.dialogs.active, action.payload.dialog]
        // },
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
    default:
      return state
  }
}
