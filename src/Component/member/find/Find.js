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
            <div className="find-container">
                {/* 아이디 찾기, 비밀번호 찾기 버튼을 한 줄에 같은 크기로 배치 */}
                <div className="find-top-buttons">
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
                </div>

                {/* 로그인으로 돌아가기 버튼 (아래쪽에 길쭉하게 분리) */}
                <button
                    className="join-btn-full"
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