import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    duration: '',
    mobileSidebarOpen: false
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        openMobileSideBar(state, action) {
            state.mobileSidebarOpen = true;
        },
        closeMobileSideBar(state, action) {
            state.mobileSidebarOpen = false;
        }
    }
})


export default uiSlice.reducer;


export const {openMobileSideBar, closeMobileSideBar} = uiSlice.actions

