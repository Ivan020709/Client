import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import './UpdatePwd.css';

function UpdatePwd() {

    const navigate = useNavigate();
    const location = useLocation();

    // FindPass에서 전달받은 아이디
    const receivedUserid = location.state?.userid || '';

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    /* =========================================================
       비밀번호 변경
    ========================================================= */

    const handleUpdate = () => {

        if (!receivedUserid) {
            return alert('아이디 정보가 없습니다. 비밀번호 찾기부터 다시 진행해주세요.');
        }

        if (!password) {
            return alert('새 비밀번호를 입력하세요.');
        }

        if (!confirmPassword) {
            return alert('비밀번호 확인을 입력하세요.');
        }

        if (password !== confirmPassword) {
            return alert('비밀번호가 일치하지 않습니다.');
        }


        axios.post('/api/member/updatePwd', {
            userid: receivedUserid,
            password: password
        })
            .then((result) => {

                if (result.data.msg === 'OK') {

                    alert('비밀번호가 변경되었습니다.');

                    navigate('/memberLogin');

                } else {

                    alert('비밀번호 변경에 실패했습니다.');

                }

            })
            .catch((err) => {

                console.error(err);

                alert('비밀번호 변경 중 오류가 발생했습니다.');

            });
    };


    return (
        <div className="update-pwd-page">


            {/* =================================================
                제목
            ================================================= */}

            <h2 className="update-pwd-title">
                새 비밀번호 입력
            </h2>


            {/* =================================================
                입력 영역
            ================================================= */}

            <div className="update-pwd-form">

                <div className="update-pwd-box">


                    {/* =================================================
                        새 비밀번호
                    ================================================= */}

                    <div className="update-pwd-row">

                        <label className="update-pwd-label">
                            새 비밀번호
                        </label>

                        <input
                            className="update-pwd-input"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="새 비밀번호 입력"
                        />

                    </div>


                    {/* =================================================
                        비밀번호 확인
                    ================================================= */}

                    <div className="update-pwd-row">

                        <label className="update-pwd-label">
                            비밀번호 확인
                        </label>

                        <input
                            className="update-pwd-input"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                            placeholder="비밀번호 재입력"
                        />

                    </div>

                </div>

            </div>


            {/* =================================================
                버튼
            ================================================= */}

            <div className="update-pwd-button-area">

                <button
                    type="button"
                    className="update-pwd-button update-pwd-submit-button"
                    onClick={handleUpdate}
                >
                    변경 완료
                </button>

                <button
                    type="button"
                    className="update-pwd-button update-pwd-cancel-button"
                    onClick={() => navigate('/findPass')}
                >
                    취소
                </button>

            </div>


            <hr className="update-pwd-divider" />

        </div>
    );
}

export default UpdatePwd;
