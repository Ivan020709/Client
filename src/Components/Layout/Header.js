import React from 'react';
import { Cookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAction } from '../../store/userSlice';

import './Header.css';

function Header() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cookies = new Cookies();

    const onLogout = () => {
        cookies.remove('user');
        dispatch(logoutAction());
        navigate('/');
    };

    return (
        <div className="header">
            {/*로고나 사이트 이름*/}
            <div className="logo" onClick={() => navigate('/')}>
                <div>로고</div>
            </div>
            {/* 오른쪽 로그인 */}
            <div className="login">
                {
                    (!loginUser || !loginUser.userid) ? (
                        <div>
                            <div onClick={() => navigate('/memberLogin')}>로그인</div>
                            <div onClick={() => navigate('/join')}>회원가입</div>
                        </div>
                    ) : (
                        <div>
                            <div onClick={() => navigate('/mypage/member')}>{loginUser.name}</div>
                            <div onClick={onLogout}>로그아웃</div>
                            <div onClick={() => navigate('/myPage')}>마이페이지</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default Header;
