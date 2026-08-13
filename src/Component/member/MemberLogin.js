import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { loginAction } from '../../store/userSlice';
import '../../style/member/MemberLogin.css'

function MemberLogin() {
    const loginUser = useSelector(state => state.user);

    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const [msg, setMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cookies = new Cookies();

    useEffect(() => {
        if (loginUser && loginUser.userid) {
            navigate('/');
        }
    }, [loginUser, navigate]);


    function onSubmit(){
        if(!userid){return alert('아이디를 입력하세요.')}
        if(!pwd){return alert('비밀번호를 입력하세요.')}
        axios.post('/api/member/login', null, {params:{email:userid, pwd}})
        .then((result)=>{
            if(result.data.msg=='OK'){
                dispatch(loginAction(result.data.loginUser))
                cookies.set('user', JSON.stringify(result.data.loginUser), {path:'/'})
                navigate('/')
            }else{
                setMsg(result.data.msg)
            }
        })
        .catch((err)=>{console.error(err)})
    }

    return (
        <div>
            <div className="login-wrapper">
                <h2 className="login-title">로그인</h2>
                <div className="login-form">
                    <div className="login-box">
                        <div className="login-row">
                            <label className="login-label">ID</label>
                            <input className="login-input" type="text" value={userid} onChange={(e)=>setUserid(e.currentTarget.value)} placeholder="아이디를 입력해주세요."/>
                        </div>
                        <div className="login-row">
                            <label className="login-label">PW</label>
                            <input className="login-input" type="password" value={pwd} onChange={(e)=>setPwd(e.currentTarget.value)} placeholder="비밀번호를 입력해주세요."/>
                        </div>
                    </div>
                    <button className="btn-login" onClick={() => onSubmit()}>확인</button>
                </div>
                <label className="login-msg">{msg}</label>
                <div className="login-extra">
                    <button className="btn-kakao" onClick={()=>navigate('/join')}>회원 가입</button>
                    <button className="btn-find" onClick={()=>navigate('/find')}>아이디/비밀번호 찾기</button>
                </div>
                <div className="login-footer">
                    <button className="btn-join" onClick={()=>window.location.href='http://localhost:8070/member/kakaostart'}>KAKAO</button>
                </div>
            </div>
        </div>
    )
}

export default MemberLogin