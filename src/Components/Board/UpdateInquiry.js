import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './Inquiry.css';

function UpdateInquiry() {
    const navigate = useNavigate();
    const { inquirynum } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        // 수정할 글 정보를 불러오기
        axios.get(`/api/inquiry/getInquiry/${inquirynum}`)
            .then((result) => {
                setTitle(result.data.inquiry.title);
                setContent(result.data.inquiry.content);
            })
            .catch((err) => { console.error(err); });
    }, [inquirynum]);

    const handleUpdate = (e) => {
        e.preventDefault();
        // 서버에 수정 요청 (백엔드 경로가 'updateInquiry'라고 가정합니다)
        axios.post('/api/inquiry/updateInquiry', { inquirynum, title, content })
            .then(() => {
                alert('문의가 수정되었습니다.');
                navigate(`/InquiryView/${inquirynum}`);
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="inquiry-write-page">
            <div className="inquiry-write-header"><h1>문의 수정</h1></div>
            <form className="inquiry-write-container" onSubmit={handleUpdate}>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button type="button" className="inquiry-cancel-btn" onClick={() => navigate(-1)}>취소</button>
                    <button type="submit" className="inquiry-submit-btn">수정 완료</button>
                </div>
            </form>
        </div>
    );
}
export default UpdateInquiry;