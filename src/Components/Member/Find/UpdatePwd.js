import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './Find.css';

function UpdatePwd() {
    const [userid, setUserid] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleUpdate = () => {
        if (!userid) return alert('아이디를 입력하세요.');
        if (!password) return alert('새 비밀번호를 입력하세요.');

        if (password !== confirmPassword) {
            return alert('비밀번호가 일치하지 않습니다.');
        }

        axios.post('/api/member/updatePwd', {
            userid: userid,
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
        <div className="join-wrapper">
            <div className="join-row">
                <label className="join-label">아이디</label>
                <input
                    className="join-input-etc"
                    type="text"
                    value={userid}
                    onChange={(e) => setUserid(e.currentTarget.value)}
                    placeholder="abc@abc.com"
                />
            </div>

            <h2 className="join-title">새 비밀번호 입력</h2>

            <div className="join-form">
                <div className="join-box">
                    <div className="join-row">
                        <label className="join-label">새 비밀번호</label>
                        <input
                            className="join-input-etc"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.currentTarget.value)}
                            placeholder="새 비밀번호 입력"
                        />
                    </div>

                    <div className="join-row">
                        <label className="join-label">비밀번호 확인</label>
                        <input
                            className="join-input-etc"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.currentTarget.value)}
                            placeholder="비밀번호 재입력"
                        />
                    </div>
                </div>
            </div>

            <div className="find-btn-area">
                <button
                    className="join-btn-join"
                    onClick={handleUpdate}
                >
                    변경 완료
                </button>
                <button
                    className="join-btn-zip_num"
                    onClick={() => navigate('/findPass')}
                >
                    취소
                </button>
            </div>

            <hr />
        </div>
    );
}

export default UpdatePwd;
