import { createSlice } from '@reduxjs/toolkit'
import { Cookies } from 'react-cookie'
const cookies = new Cookies()

const initialState = {
    userid: '',
    pwd: '',
    nickname: '',
    name: '',
    email: '',
    phone: '',
    birth: '',
    savefilename: '',
    zip_num: '',
    address1: '',
    address2: '',
    address3: '',
    indate: '',
    provider: '',
    snsid: '',
    role: '',
    accessToken: '',
    refreshToken: '',
}
const getLoginUser = () => {
    const memberInfo = cookies.get('user');
    if (memberInfo && memberInfo.userid) {
        memberInfo.userid = decodeURIComponent(memberInfo.userid)
        memberInfo.pwd = decodeURIComponent(memberInfo.pwd)
        memberInfo.nickname = decodeURIComponent(memberInfo.nickname)
        memberInfo.name = decodeURIComponent(memberInfo.name)
        memberInfo.email = decodeURIComponent(memberInfo.email)
        memberInfo.phone = decodeURIComponent(memberInfo.phone)
        memberInfo.birth = decodeURIComponent(memberInfo.birth)
        memberInfo.mbti = decodeURIComponent(memberInfo.mbti)
        memberInfo.savefilename = decodeURIComponent(memberInfo.savefilename)
        memberInfo.zip_num = decodeURIComponent(memberInfo.zip_num)
        memberInfo.address1 = decodeURIComponent(memberInfo.address1)
        memberInfo.address2 = decodeURIComponent(memberInfo.address2)
        memberInfo.address3 = decodeURIComponent(memberInfo.address3)
        memberInfo.indate = decodeURIComponent(memberInfo.indate)
        memberInfo.provider = decodeURIComponent(memberInfo.provider)
        memberInfo.snsid = decodeURIComponent(memberInfo.snsid)
        memberInfo.editcom = decodeURIComponent(memberInfo.editcom)
        memberInfo.role = decodeURIComponent(memberInfo.role)
        memberInfo.accessToken = decodeURIComponent(memberInfo.accessToken)
        memberInfo.refreshToken = decodeURIComponent(memberInfo.refreshToken)
    }
    return memberInfo
}

const userSlice = createSlice(
    {
        name: 'user',

        initialState: getLoginUser() || initialState,

        reducers: {
            loginAction: (state, action) => {
                state.userid = action.payload.userid
                state.pwd = action.payload.pwd
                state.name = action.payload.name
                state.nickname = action.payload.nickname
                state.email = action.payload.email
                state.phone = action.payload.phone
                state.birth = action.payload.birth
                state.mbti = action.payload.mbti
                state.savefilename = action.payload.savefilename
                state.zip_num = action.payload.zip_num
                state.address1 = action.payload.address1
                state.address2 = action.payload.address2
                state.address3 = action.payload.address3
                state.indate = action.payload.indate
                state.provider = action.payload.provider
                state.snsid = action.payload.snsid
                state.editcom = action.payload.editcom
                state.role = action.payload.role
                state.accessToken = action.payload.accessToken
                state.refreshToken = action.payload.refreshToken
            },
            logoutAction: (state) => {
                state.userid = ''
                state.pwd = ''
                state.name = ''
                state.nickname = ''
                state.email = ''
                state.phone = ''
                state.birth = ''
                state.mbti = ''
                state.savefilename = ''
                state.zip_num = ''
                state.address1 = ''
                state.address2 = ''
                state.address3 = ''
                state.indate = ''
                state.provider = ''
                state.snsid = ''
                state.editcom = ''
                state.role = ''
                state.accessToken = ''
                state.refreshToken = ''
            },
        }
    }
)

export const { loginAction, logoutAction } = userSlice.actions;
export default userSlice.reducer;