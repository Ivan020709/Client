import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DaumPostcode from 'react-daum-postcode';
import Modal from 'react-modal';
import { useSelector } from 'react-redux';
import '../../style/member/Join.css';

function Join() {
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [reid, setReid] = useState('');
    const [idCheckResult, setIdCheckResult] = useState('');
    const [msgStyle, setMsgStyle] = useState({ flex: '1' });
    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [renickname, setRenickname] = useState('');
    const [nicknameCheckResult, setNicknameCheckResult] = useState('');
    const [nicknameMsgStyle, setNicknameMsgStyle] = useState({ flex: '1' });

    const [savefilename, setSavefilename] = useState('');
    const [imgSrc, setImgSrc] = useState('');

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [phone, setPhone] = useState('');

    const [zip_num, setZip_num] = useState('');
    const [address1, setAddress1] = useState('');
    const [address2, setAddress2] = useState('');
    const [address3, setAddress3] = useState('');


    const [isOpen, setIsOpen] = useState(false);

    const modalStyle = {
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
        content: {
            left: '0', right: '0', top: '50%', bottom: 'auto', margin: 'auto',
            width: '500px', height: '420px', padding: '0', overflow: 'hidden',
            transform: 'translateY(-50%)'
        }
    };

    useEffect(() => {
        if (loginUser && loginUser.email) navigate('/');
    }, [loginUser, navigate]);

    const completeHandler = (data) => {
        setZip_num(data.zonecode);
        setAddress1(data.address);
        setAddress3(data.buildingName);
        setIsOpen(false);
    };

    function idCheck() {
        if (!email) return alert('아이디를 입력하세요.');
        axios.post('/api/member/emailCheck', null, { params: { email: email } })
            .then((result) => {
                if (result.data.msg === 'OK') {
                    setIdCheckResult('※ 사용 가능한 아이디입니다.');
                    setMsgStyle({ color: 'blue', flex: '1', fontWeight: 'bold' });
                    setReid(email);
                } else {
                    setIdCheckResult('※ 중복되는 아이디입니다.');
                    setMsgStyle({ color: 'red', flex: '1', fontWeight: 'bold' });
                    setReid('');
                }
            })
            .catch((err) => console.error(err));
    }

    function nicknameCheck() {
        if (!nickname.trim()) return alert('닉네임을 입력하세요.');
        axios.post('/api/member/nicknameCheck', null, { params: { nickname: nickname } })
            .then((result) => {
                if (result.data.msg === 'OK') {
                    setNicknameCheckResult('※ 사용 가능한 닉네임입니다.');
                    setNicknameMsgStyle({ color: 'blue', flex: '1', fontWeight: 'bold' });
                    setRenickname(nickname);
                } else {
                    setNicknameCheckResult('※ 중복되는 닉네임입니다.');
                    setNicknameMsgStyle({ color: 'red', flex: '1', fontWeight: 'bold' });
                    setRenickname('');
                }
            })
            .catch((err) => console.error(err));
    }

    function fileup(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('이미지 파일만 선택할 수 있습니다.');
            e.target.value = '';
            return;
        }

        const formData = new FormData();
        formData.append('image', file);

        axios.post('/api/member/fileupload', formData)
            .then((result) => {
                setSavefilename(result.data.savefilename);
                setImgSrc(`http://localhost:8070/images/${result.data.savefilename}`);
            })
            .catch((err) => {
                console.error(err);
                alert('프로필 사진 업로드 중 오류가 발생했습니다.');
            });
    }

    function onSubmit() {
        if (!email) return alert('아이디를 입력하세요.');
        if (reid !== email) return alert('아이디 중복을 확인해주세요.');
        if (!pwd) return alert('비밀번호를 입력하세요.');
        if (pwd !== pwdChk) return alert('비밀번호 체크가 일치하지 않습니다.');
        if (!name) return alert('이름을 입력하세요.');
        if (!nickname) return alert('닉네임을 입력하세요.');
        if (renickname !== nickname) return alert('닉네임 중복을 확인해주세요.');
        if (!year || !month || !day) return alert('생년월일을 입력하세요.');

        if (isNaN(year) || isNaN(month) || isNaN(day) || Number(year) < 1901 || Number(year) > 2026 || Number(month) < 1 || Number(month) > 12 || Number(day) < 1 || Number(day) > 31) {
            return alert('올바른 생년월일을 입력하세요.');
        }

        const date = new Date(Number(year), Number(month) - 1, Number(day));

        if (date.getFullYear() !== Number(year) || date.getMonth() !== Number(month) - 1 || date.getDate() !== Number(day)) {
            return alert('존재하지 않는 날짜입니다.');
        }

        if (!phone) return alert('번호를 입력하세요.');
        if (!zip_num) return alert('우편번호를 입력하세요.');
        if (!address1) return alert('주소를 입력하세요.');

        const birth = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        axios.post('/api/member/insertMember', {
            email: email,
            pwd: pwd,
            name: name,
            nickname: nickname,
            birth: birth,
            phone: phone,
            zip_num: zip_num,
            address1: address1,
            address2: address2,
            address3: address3,
            savefilename: savefilename,
            provider: 'Local'
        })
            .then(() => {
                alert('회원 가입이 완료되었습니다.');
                navigate('/memberLogin');
            })
            .catch((err) => {
                console.error(err);
                alert('회원가입 중 오류가 발생했습니다.');
            });
    }

    return (
        <div className="join-wrapper">
            <h2 className="join-title">회원 가입</h2>

            <div className="profile-area">
                <div className="profile-preview">
                    {imgSrc ? <img src={imgSrc} alt="프로필 미리보기" /> : <span>사진</span>}
                    <label htmlFor="profile-image" className="profile-camera-btn">📷</label>
                </div>
                <input id="profile-image" type="file" accept="image/*" onChange={fileup} style={{ display: 'none' }} />
            </div>

            <div className="join-form">
                <div className="join-box">
                    <div className="join-row">
                        <label className="join-label">아이디</label>
                        <input className="join-input-id" type="text" value={email} onChange={(e) => { setEmail(e.currentTarget.value); setReid(''); setIdCheckResult(''); }} placeholder="이메일 형식(예: abc@abc.com)" />
                        <button className="join-btn-zip_num" onClick={idCheck}>중복확인</button>
                    </div>
                    <div><label style={msgStyle}>{idCheckResult}</label></div>

                    <div className="join-row">
                        <label className="join-label">비밀번호</label>
                        <input className="join-input-etc" type="password" value={pwd} onChange={(e) => setPwd(e.currentTarget.value)} placeholder="비밀번호를 입력하세요." />
                    </div>

                    <div className="join-row">
                        <label className="join-label">비밀번호 체크</label>
                        <input className="join-input-etc" type="password" value={pwdChk} onChange={(e) => setPwdChk(e.currentTarget.value)} placeholder="비밀번호를 다시 입력하세요." />
                    </div>

                    <div className="join-row">
                        <label className="join-label">이름</label>
                        <input className="join-input-etc" type="text" value={name} onChange={(e) => setName(e.currentTarget.value)} placeholder="이름을 입력하세요." />
                    </div>

                    <div className="join-row">
                        <label className="join-label">닉네임</label>
                        <input className="join-input-id" type="text" value={nickname} onChange={(e) => { setNickname(e.currentTarget.value); setRenickname(''); setNicknameCheckResult(''); }} placeholder="닉네임을 입력하세요." />
                        <button className="join-btn-zip_num" onClick={nicknameCheck}>중복확인</button>
                    </div>
                    <div><label style={nicknameMsgStyle}>{nicknameCheckResult}</label></div>
                    <div className="join-row">
                        <label className="join-label">생년월일</label>
                        <input className="join-input-four" type="text" placeholder="YYYY" maxLength="4" value={year} onChange={(e) => setYear(e.currentTarget.value)} />
                        <label className="join-label-birth">년</label>
                        <input className="join-input-two" type="text" placeholder="MM" maxLength="2" value={month} onChange={(e) => setMonth(e.currentTarget.value)} />
                        <label className="join-label-birth">월</label>
                        <input className="join-input-two" type="text" placeholder="DD" maxLength="2" value={day} onChange={(e) => setDay(e.currentTarget.value)} />
                        <label className="join-label-birth">일</label>
                    </div>

                    <div className="join-row">
                        <label className="join-label">전화번호</label>
                        <input className="join-input-etc" type="text" value={phone} onChange={(e) => setPhone(e.currentTarget.value)} placeholder="010-XXXX-XXXX" />
                    </div>

                    <Modal style={modalStyle} isOpen={isOpen} onRequestClose={() => setIsOpen(false)}>
                        <DaumPostcode onComplete={completeHandler} />
                        <button onClick={() => setIsOpen(false)}>CLOSE</button>
                    </Modal>

                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">우편번호</label>
                            <input className="join-input" type="text" value={zip_num} readOnly />
                            <button className="join-btn-zip_num" onClick={() => setIsOpen(true)}>우편번호검색</button>
                        </div>
                    </div>

                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">주소1</label>
                            <input className="join-input-etc" type="text" value={address1} readOnly />
                        </div>
                    </div>

                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">주소2</label>
                            <input className="join-input-etc" type="text" value={address2} onChange={(e) => setAddress2(e.currentTarget.value)} placeholder="상세주소를 입력하세요." />
                        </div>
                    </div>

                    <div className="join-field">
                        <div className="join-row">
                            <label className="join-label">주소3</label>
                            <input className="join-input-etc" type="text" value={address3} readOnly />
                        </div>
                    </div>
                </div>
            </div>

            <div className="join_msg">※ 가입 후 아이디 변경 불가</div>

            <div className="join-btn-group">
                <button className="join-btn-join" onClick={onSubmit}>확인</button>
                <button className="join-btn-cancel" onClick={() => navigate('/')}>취소</button>
            </div>

            <hr />
        </div>
    );
}

export default Join;