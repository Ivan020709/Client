import React, { useState } from 'react'
// import { useDispatch } from 'react-redux'
import { loginAction } from '../../store/userSlice'
import { Cookies } from 'react-cookie'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// import SubImg from './SubImg'
// import SubMenu from './SubMenu'

// import '../../style/login.css'

function Login() {

    const [ userid, setUserid ] = useState('') // ID = email
    const [ pwd, setPwd ] = useState('')
    const cookies = new Cookies()
    const navigate = useNavigate()
    // const dispatch = useDispatch()

    // EMAIL 검증(맞나?)
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Local LOGIN
    function loginLocal(){
        if( !userid ){ return alert('이메일(아이디)을 입력하세요.')}
        if( !validateEmail(userid) ){ return alert('올바른 이메일 형식으로 입력 바랍니다.')}
        if( !pwd ){ return alert('패스워드를 입력하세요.')}

        axios.post('/api/member/loginLocal', null, { params : { userid, pwd } } )
        .then((result)=>{
            console.log('result.data', result.data)
            if( result.data.msg === 'OK'){
                cookies.set('user', JSON.stringify(result.data.loginUser), { path:'/' })
                // dispatch( loginAction( result.data.loginUser ));
                navigate('/')
            }else{
                alert( result.data.msg )
                setPwd('')
            }
        })
        .catch((err)=>{ console.error(err) })
    }

    // Kakao, Google 로그인 준비 (추후 Backend 연결 필요하겠지요?)
    const handleSocialLogin = (provider) => {
        switch(provider) {
            case 'kakao':
                window.location.href = 'http://localhost:8070/member/kakaostart';
                break;
            case 'google':
                window.location.href = 'http://localhost:8070/member/googlestart';
                break;
            default:
                break;
        }
    }

    return (
        <article>
            {/* <SubImg /> */}
            <div className='subPage'>
                {/* <SubMenu /> */}
                <div className='memberform'>
                    <div className='field'>
                        <label>EMAIL ID</label>
                        <input 
                            type="email" 
                            placeholder="example@email.com"
                            value={userid} 
                            onChange={(e)=>{ setUserid( e.currentTarget.value )}}
                        />
                    </div>
                    <div className='field'>
                        <label>PASSWORD</label>
                        <input 
                            type="password"  
                            value={pwd} 
                            onChange={(e)=>{ setPwd( e.currentTarget.value )}} 
                        />
                    </div>           
                    <div className="btns">
                        <button onClick={()=>{ loginLocal() }}>LOGIN</button>
                        <button onClick={()=>{ navigate('/join') }}>JOIN</button>
                    </div>
                    <div className="sns-btns" style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginTop: '15px' }}>
                        <button 
                            style={{ backgroundColor: '#FEE500', border: 'none', padding: '10px', cursor: 'pointer', fontWeight: 'bold' }} 
                            onClick={ () => handleSocialLogin('kakao') }
                        >
                            KAKAO LOGIN
                        </button>

                        <button 
                            style={{ backgroundColor: '#03C75A', border: 'none', color: 'white', padding: '10px', cursor: 'pointer', fontWeight: 'bold' }} 
                            onClick={ () => handleSocialLogin('google') }
                        >
                            GOOGLE LOGIN
                        </button>
                    </div>
                </div>
            </div>
        </article>
    )
}

export default Login