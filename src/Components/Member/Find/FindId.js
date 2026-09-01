
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './FindId.css';

function FindId() {

    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [foundId, setFoundId] = useState('');
    const [usernumber, setUserNumber] = useState('');

    // 인증번호 입력란 표시 여부
    const [verificationSent, setVerificationSent] = useState(false);

    const navigate = useNavigate();


    /* =========================================================
       전화번호 입력
       숫자만 입력 가능
       최대 11자리
       자동으로 - 추가
    ========================================================= */

    const handlePhoneChange = (e) => {

        let value = e.target.value.replace(/[^0-9]/g, '');

        value = value.substring(0, 11);

        if (value.length <= 3) {

            value = value;

        } else if (value.length <= 7) {

            value =
                value.substring(0, 3) +
                '-' +
                value.substring(3);

        } else {

            value =
                value.substring(0, 3) +
                '-' +
                value.substring(3, 7) +
                '-' +
                value.substring(7);
        }

        setPhone(value);

        // 전화번호 변경 시 인증 초기화
        setVerificationSent(false);
        setUserNumber('');
        setFoundId('');
    };


    /* =========================================================
       인증번호 발송
    ========================================================= */

    async function onSMS_Send() {

        if (!name) {
            return alert('이름을 입력하세요');
        }

        if (!phone) {
            return alert('전화번호를 입력하세요');
        }

        const phoneNumber = phone.replace(/[^0-9]/g, '');

        if (phoneNumber.length !== 11) {
            return alert('전화번호 11자리를 정확하게 입력하세요');
        }

        const snsBtn = document.getElementById('snsBtn');

        // 인증번호 받기 버튼 비활성화
        snsBtn.disabled = true;

        try {

            const result = await axios.post(
                '/api/sms/sendSMS',
                null,
                {
                    params: {
                        phone: phoneNumber
                    }
                }
            );

            if (result) {

                alert(
                    'SMS 전송이 완료되었습니다. 해당 SMS 수신내역을 확인하세요'
                );

                // 인증번호 입력란 표시
                setVerificationSent(true);
            }

        } catch (err) {

            console.error('SMS 전송 실패:', err);

            alert('SMS 전송 중 오류가 발생했습니다.');

            // 전송 실패 시 다시 활성화
            snsBtn.disabled = false;
        }
    }


    /* =========================================================
       아이디 찾기
       
       아이디 찾기 버튼을 눌렀을 때
       1. 이름 확인
       2. 전화번호 확인
       3. 인증번호 입력 확인
       4. 인증번호 검증
       5. 회원정보 확인
       6. 이메일 표시
    ========================================================= */

    function handleFindId() {

        if (!name) {
            return alert('이름을 입력하세요.');
        }

        if (!phone) {
            return alert('전화번호를 입력하세요.');
        }

        const phoneNumber = phone.replace(/[^0-9]/g, '');

        if (phoneNumber.length !== 11) {
            return alert('전화번호 11자리를 정확하게 입력하세요.');
        }

        if (!verificationSent) {
            return alert('인증번호를 먼저 받아주세요.');
        }
        if (!usernumber) {
            return alert('인증번호를 입력하세요.');
        }
        axios.post(
            '/api/sms/confirmNumber',
            null,
            {
                params: {
                    usernumber: usernumber
                }
            }
        )
        .then((result) => {

            
            if (result.data.msg === 'ok') {

                
                axios.post('/api/member/findId', {

                    name: name,
                    phone

                })
                .then((result) => {

                    if (result.data && result.data.userid) {

                        setFoundId(result.data.userid);
                        

                    } else {

                        
                        alert('일치하는 회원 정보를 찾을 수 없습니다.');

                        setFoundId('');
                    }

                })
                .catch((err) => {

                    console.error('아이디 찾기 실패:', err);

                    alert('아이디 찾기 중 오류가 발생했습니다.');

                });

            } else {

        
                alert('입력한 코드가 일치하지 않습니다');

            }

        })
        .catch((err) => {

            console.error('인증번호 확인 실패:', err);

            alert('인증번호 확인 중 오류가 발생했습니다.');

        });
    }


    return (

        <div className="find-id-page">

            <h2 className="find-id-title">
                아이디 찾기
            </h2>


            <div className="find-id-form">

                <div className="find-id-box">


                    {/* =================================================
                        이름
                    ================================================= */}

                    <div className="find-id-row">

                        <label className="find-id-label">
                            이름
                        </label>

                        <input
                            className="find-id-input"
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.currentTarget.value)
                            }
                            placeholder="이름을 입력하세요."
                        />

                    </div>


                    {/* =================================================
                        전화번호
                    ================================================= */}

                    <div className="find-id-row">

                        <label className="find-id-label">
                            전화번호
                        </label>

                        <div className="find-id-phone-area">

                            <input
                                className="find-id-input"
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="010-XXXX-XXXX"
                                inputMode="numeric"
                                maxLength={13}
                            />

                            <button
                                type="button"
                                className="find-id-cert-button"
                                id="snsBtn"
                                onClick={onSMS_Send}
                            >
                                인증번호 받기
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        인증번호 입력
                        → 인증번호 받기를 눌렀을 때만 표시
                    ================================================= */}

                    {verificationSent && (

                        <div className="find-id-row find-id-verification-row">

                            <label className="find-id-label">
                                인증번호
                            </label>

                            <div className="find-id-verification-area">

                                <input
                                    className="find-id-input"
                                    type="text"
                                    value={usernumber}
                                    onChange={(e) =>
                                        setUserNumber(
                                            e.target.value
                                                .replace(/[^0-9]/g, '')
                                                .substring(0, 6)
                                        )
                                    }
                                    placeholder="인증번호 6자리"
                                    inputMode="numeric"
                                    maxLength={6}
                                />

                            </div>

                        </div>

                    )}

                </div>

            </div>


            {/* =================================================
                아이디 찾기 결과
            ================================================= */}

            {foundId ? (

                <div className="find-id-result">

                    <p className="find-id-result-message">
                        회원님의 아이디(이메일)는 다음과 같습니다.
                    </p>

                    <p className="find-id-result-value">
                        {foundId}
                    </p>

                    <button
                        type="button"
                        className="find-id-result-button"
                        onClick={() => navigate('/memberLogin')}
                    >
                        로그인으로 가기
                    </button>

                </div>

            ) : (

                <div className="find-id-button-area">

                    <button
                        type="button"
                        className="find-id-button find-id-search-button"
                        onClick={handleFindId}
                    >
                        아이디 찾기
                    </button>

                    <button
                        type="button"
                        className="find-id-button find-id-back-button"
                        onClick={() => navigate('/find')}
                    >
                        이전으로
                    </button>

                </div>

            )}


            <hr className="find-id-divider" />

        </div>
    );
}

export default FindId;

