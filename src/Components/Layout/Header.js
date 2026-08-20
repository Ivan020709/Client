import React from 'react';
import { Cookies } from 'react-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutAction } from '../../store/userSlice';

import './Header.css';

import logo from '../../Img/logo2.png';

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

            {/* 헤더 실제 내용 영역 */}
            <div className="headerInner">

                {/* 로고 */}
                <div
                    className="logo"
                    onClick={() => navigate('/')}
                >
                    <img
                        src={logo}
                        alt="사이트 로고"
                    />
                </div>

                {/* 오른쪽 로그인 영역 */}
                <div className="login">
                    {
                        (!loginUser || !loginUser.userid) ? (
                            <div>
                                <div
                                    onClick={() => navigate('/memberLogin')}
                                >
                                    로그인
                                </div>

                                <div
                                    onClick={() => navigate('/join')}
                                >
                                    회원가입
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div
                                    onClick={() => navigate('/mypage/member')}
                                >
                                    {loginUser.name}
                                </div>

                                <div onClick={onLogout}>
                                    로그아웃
                                </div>

                                <div
                                    onClick={() => navigate('/myPage')}
                                >
                                    마이페이지
                                </div>
                            </div>
                        )
                    }
                </div>

            </div>

        </div>
    );
}

export default Header;