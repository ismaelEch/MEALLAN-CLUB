const initialState = {
  distance: 50,
};

export const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DISTANCE':
      return {...state, distance: action.payload};
    default:
      return state;
  }
};
