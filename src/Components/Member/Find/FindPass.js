import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Find.css';

function FindPass() {
    const [userid, setUserid] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const navigate = useNavigate();

    const handleFindPwd = () => {
        if (!userid) return alert('아이디를 입력하세요.');
        if (!name) return alert('이름을 입력하세요.');
        if (!phone) return alert('전화번호를 입력하세요.');

        axios.post('/api/member/findPwd', {
            userid: userid,
            name: name,
            phone: phone
        })
            .then((result) => {
                if (result.data.msg === 'OK') {
                    setIsSuccess(true);
                } else {
                    alert('일치하는 회원 정보를 찾을 수 없습니다.');
                }
            })
            .catch((err) => {
                console.error(err);
                alert('비밀번호 찾기 중 오류가 발생했습니다.');
            });
    };

    return (
        <div className="join-wrapper">
            {!isSuccess ? (
                <>
                    <h2 className="join-title">비밀번호 찾기</h2>

                    <div className="join-form">
                        <div className="join-box">

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

                            <div className="join-row">
                                <label className="join-label">이름</label>
                                <input
                                    className="join-input-etc"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.currentTarget.value)}
                                    placeholder="이름을 입력하세요."
                                />
                            </div>

                            <div className="join-row">
                                <label className="join-label">전화번호</label>
                                <input
                                    className="join-input-etc"
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.currentTarget.value)}
                                    placeholder="010-XXXX-XXXX"
                                />
                            </div>

                        </div>
                    </div>

                    <div className="find-btn-area">
                        <button
                            className="join-btn-join"
                            onClick={handleFindPwd}
                        >
                            비밀번호 찾기
                        </button>

                        {/* '변경' 버튼을 눌러 UpdatePwd로 이동 */}
                        <button
                            className="join-btn-join"
                            onClick={() => navigate('/updatePwd')}
                        >
                            변경
                        </button>

                        <button
                            className="join-btn-zip_num"
                            onClick={() => navigate('/find')}
                        >
                            이전으로
                        </button>
                    </div>
                </>
            ) : (
                <div className="password-success">
                    <div className="success-box">

                        <div className="success-title">
                            <span>✓</span>
                            변경 완료
                        </div>

                        <div className="success-message">
                            비밀번호가 변경되었습니다.
                        </div>

                        <p className="success-sub">
                            새로운 비밀번호로<br />
                            로그인해주세요.
                        </p>

                        <button
                            className="success-login-btn"
                            onClick={() => navigate('/Login')}
                        >
                            로그인하기
                        </button>

                    </div>
                </div>
            )}

            <hr />
        </div>
    );
}

export default FindPass;
