import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import '../../../style/member/Find.css';

function Find() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (loginUser && loginUser.userid) {
            navigate('/');
        }
    }, [loginUser, navigate]);

    return (
        <div className="join-wrapper">
            <h2 className="join-title">아이디 / 비밀번호 찾기</h2>
            <div className="find-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
                <button
                    className="join-btn-join"
                    onClick={() => navigate('/findId')}
                >
                    아이디 찾기
                </button>
                <button
                    className="join-btn-zip_num"
                    onClick={() => navigate('/findPass')}
                >
                    비밀번호 찾기
                </button>
                <button
                    className="join-btn-zip_num"
                    style={{ backgroundColor: '#gray' }}
                    onClick={() => navigate('/Login')}
                >
                    로그인으로 돌아가기
                </button>
            </div>
            <hr />
        </div>
    );
}

export default Find;