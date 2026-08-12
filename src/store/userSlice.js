import {createSlice} from '@reduxjs/toolkit'
import {Cookies} from 'react-cookie'
const cookies = new Cookies()

const initialState={
    userid : '',
    // id : '',
    // pass : '',
    // birth : '',
    // name : '',
    // phone : '',
    // zip_num : '',
    // add1 : '',
    // add2 : '',
    // add3 : '',
    // provider : '',

    // roleNames :[],
    // accessToken : '',
    // refreshToken : '',
}
const getLoginUser=()=>{
    const memberInfo = cookies.get('user');
    if( memberInfo  && memberInfo.id ){
        memberInfo.userid = decodeURIComponent( memberInfo.userid )
        // memberInfo.id = decodeURIComponent( memberInfo.id )
        // memberInfo.pass = decodeURIComponent( memberInfo.pass )
        // memberInfo.birth = decodeURIComponent( memberInfo.birth )
        // memberInfo.name = decodeURIComponent( memberInfo.name )
        // memberInfo.phone = decodeURIComponent( memberInfo.phone )
        // memberInfo.zip_num = decodeURIComponent( memberInfo.zip_num )
        // memberInfo.add1 = decodeURIComponent( memberInfo.add1 )
        // memberInfo.add2 = decodeURIComponent( memberInfo.add2 )
        // memberInfo.add3 = decodeURIComponent( memberInfo.add3 )
        // memberInfo.provider = decodeURIComponent( memberInfo.provider )

        // memberInfo.roleNames = decodeURIComponent( memberInfo.roleNames)
        // memberInfo.accessToken = decodeURIComponent( memberInfo.accessToken)
        // memberInfo.refreshToken = decodeURIComponent( memberInfo.refreshToken)
    }
    return memberInfo
}

const userSlice = createSlice( 
    {
        name : 'user',
        
        initialState : getLoginUser() || initialState,

        reducers : {
            loginAction : ( state, action )=>{
                state.userid = action.payload.userid
                // state.id = action.payload.id
                // state.pass = action.payload.pass
                // state.birth = action.payload.birth
                // state.name = action.payload.name
                // state.phone = action.payload.phone
                // state.zip_num = action.payload.zip_num
                // state.add1 = action.payload.add1
                // state.add2 = action.payload.add2
                // state.add3 = action.payload.add3
                // state.provider = action.payload.provider

                // state.roleNames = action.payload.roleNames
                // state.accessToken = action.payload.accessToken
                // state.refreshToken = action.payload.refreshToken
            },
            logoutAction : (state)=>{
                state.userid = ''
                // state.id = ''
                // state.pass = ''
                // state.birth = ''
                // state.name = ''
                // state.phone = ''
                // state.zip_num = ''
                // state.add1 = ''
                // state.add2 = ''
                // state.add3 = ''
                // state.provider = ''

                // state.roleNames = []
                // state.accessToken = ''
                // state.refreshToken = ''
            },
        }
    }
)

export const { loginAction, logoutAction } = userSlice.actions;
export default userSlice.reducer;