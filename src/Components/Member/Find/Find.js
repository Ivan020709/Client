import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import './Find.css';

function Find() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (loginUser && loginUser.userid) {
            navigate('/');
        }
    }, [loginUser, navigate]);

    return (
        <div className="find-page">

            <div className="find-page-card">

                <h2 className="find-page-title">
                    아이디 / 비밀번호 찾기
                </h2>

                <div className="find-page-button-area">

                    <div className="find-page-top-buttons">

                        <button
                            type="button"
                            className="find-page-button"
                            onClick={() => navigate('/findId')}
                        >
                            아이디 찾기
                        </button>

                        <button
                            type="button"
                            className="find-page-button"
                            onClick={() => navigate('/findPass')}
                        >
                            비밀번호 찾기
                        </button>

                    </div>

                    <button
                        type="button"
                        className="find-page-button find-page-back-button"
                        onClick={() => navigate('/MemberLogin')}
                    >
                        로그인으로 돌아가기
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Find;
