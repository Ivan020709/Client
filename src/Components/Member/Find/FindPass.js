
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import './FindPass.css';

function FindPass() {

    const [userid, setUserid] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [usernumber, setUserNumber] = useState('');

    // 인증번호 입력란 표시 여부
    const [verificationSent, setVerificationSent] = useState(false);

    const navigate = useNavigate();


    /* =========================================================
       전화번호 자동 하이픈
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
    };


    /* =========================================================
       인증번호 발송
    ========================================================= */

    async function onSMS_Send() {

        if (!userid) {
            return alert('아이디를 입력하세요');
        }

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

            // 전송 실패 시 버튼 다시 활성화
            snsBtn.disabled = false;
        }
    }



    function handleFindPwd() {



        if (!userid) {
            return alert('아이디를 입력하세요.');
        }


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


                axios.post('/api/member/findPwd', {

                    userid: userid,
                    name: name,
                    phone

                })
                .then((result) => {


                    if (result.data.msg === 'OK') {

                        console.log(
                            '회원정보 확인 성공'
                        );

                    
                        navigate('/updatePwd', {

                            state: {
                                userid: userid
                            }

                        });

                    } else {


                        alert(
                            '일치하는 회원 정보를 찾을 수 없습니다.'
                        );

                    }

                })
                .catch((err) => {

                    console.error(
                        '[비밀번호 찾기 API 오류]',
                        err
                    );

                    console.error(
                        'response:',
                        err.response
                    );

                    console.error(
                        'response.data:',
                        err.response?.data
                    );

                    alert(
                        '비밀번호 찾기 중 오류가 발생했습니다.'
                    );

                });

            } else {

                /*
                 * 인증번호가 틀린 경우
                 */

                alert(
                    '입력한 코드가 일치하지 않습니다'
                );

            }

        })
        .catch((err) => {

            console.error(
                '[인증번호 확인 API 오류]',
                err
            );

            console.error(
                'response:',
                err.response
            );

            console.error(
                'response.data:',
                err.response?.data
            );

            alert(
                '인증번호 확인 중 오류가 발생했습니다.'
            );

        });
    }


    return (

        <div className="find-pass-page">


            {/* =================================================
                제목
            ================================================= */}

            <h2 className="find-pass-title">
                비밀번호 찾기
            </h2>


            {/* =================================================
                입력 영역
            ================================================= */}

            <div className="find-pass-form">

                <div className="find-pass-box">


                    {/* =================================================
                        아이디
                    ================================================= */}

                    <div className="find-pass-row">

                        <label className="find-pass-label">
                            아이디
                        </label>

                        <input
                            className="find-pass-input"
                            type="text"
                            value={userid}
                            onChange={(e) =>
                                setUserid(e.currentTarget.value)
                            }
                            placeholder="abc@abc.com"
                        />

                    </div>


                    {/* =================================================
                        이름
                    ================================================= */}

                    <div className="find-pass-row">

                        <label className="find-pass-label">
                            이름
                        </label>

                        <input
                            className="find-pass-input"
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

                    <div className="find-pass-row">

                        <label className="find-pass-label">
                            전화번호
                        </label>

                        <div className="find-pass-phone-area">

                            <input
                                className="find-pass-input"
                                type="tel"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="010-XXXX-XXXX"
                                inputMode="numeric"
                                maxLength={13}
                            />

                            <button
                                type="button"
                                className="find-pass-cert-button"
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

                        <div className="find-pass-row find-pass-verification-row">

                            <label className="find-pass-label">
                                인증번호
                            </label>

                            <div className="find-pass-verification-area">

                                <input
                                    className="find-pass-input"
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
                버튼
            ================================================= */}

            <div className="find-pass-button-area">


                {/* 비밀번호 찾기 */}

                <button
                    type="button"
                    className="find-pass-button find-pass-search-button"
                    onClick={handleFindPwd}
                >
                    비밀번호 찾기
                </button>


                {/* 이전으로 */}

                <button
                    type="button"
                    className="find-pass-button find-pass-back-button"
                    onClick={() => navigate('/find')}
                >
                    이전으로
                </button>

            </div>


            {/* =================================================
                구분선
            ================================================= */}

            <hr className="find-pass-divider" />

        </div>
    );
}

export default FindPass;

