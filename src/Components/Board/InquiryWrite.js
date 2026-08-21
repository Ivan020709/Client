import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import './Inquiry.css';

function InquiryWrite() {
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        // 유형을 제거했으므로 데이터 전달 항목에서 category를 제외했습니다.
        axios.post('/api/inquiry/insertInquiry', {
            title,
            content,
            userid: loginUser.userid
        })
            .then(() => {
                alert('문의가 등록되었습니다.');
                navigate('/InquiryList'); // 등록 성공 시 목록으로 이동
            })
            .catch((err) => {
                console.error(err);
                alert('등록에 실패했습니다.');
            });
    };

    return (
        <div className="inquiry-write-page">
            <div className="inquiry-write-header">
                <h1>문의하기</h1>
            </div>

            <form className="inquiry-write-container" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요"
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="문의 내용을 입력하세요"
                    required
                />

                {/* 버튼 영역: 등록과 목록 버튼을 나란히 배치 */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                    <button
                        type="button"
                        className="inquiry-cancel-btn"
                        onClick={() => navigate('/InquiryList')}
                        style={{ padding: '10px 30px', cursor: 'pointer' }}
                    >
                        목록으로
                    </button>
                    <button
                        type="submit"
                        className="inquiry-submit-btn"
                    >
                        등록하기
                    </button>
                </div>
            </form>
        </div>
    );
}
export default InquiryWrite;