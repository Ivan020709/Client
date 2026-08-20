import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

import './BoardWrite.css';

function InquiryWrite() {
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('/api/inquiry/insertInquiry', { title, content, category, userid: loginUser.userid })
            .then(() => { alert('문의가 등록되었습니다.'); navigate('/InquiryList'); })
            .catch((err) => console.error(err));
    };

    return (
        <div className="board-write-page">
            <div className="board-write-header"><h1>문의하기</h1></div>
            <form className="board-write-container" onSubmit={handleSubmit}>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">유형 선택</option>
                    <option value="계정">계정</option>
                    <option value="결제">결제</option>
                    <option value="기타">기타</option>
                </select>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="내용" />
                <button type="submit">등록</button>
            </form>
        </div>
    );
}
export default InquiryWrite;