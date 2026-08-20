import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import './UpdateBoard.css';

function UpdateInquiry() {
    const navigate = useNavigate();
    const { inquirynum } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        axios.get(`/api/inquiry/getInquiry/${inquirynum}`)
            .then((res) => {
                setTitle(res.data.inquiry.title);
                setContent(res.data.inquiry.content);
            });
    }, [inquirynum]);

    const handleUpdate = (e) => {
        e.preventDefault();
        axios.post('/api/inquiry/updateInquiry', { inquirynum, title, content })
            .then(() => { navigate(`/InquiryView/${inquirynum}`); });
    };

    return (
        <div className="update-board-page">
            <form className="update-board-container" onSubmit={handleUpdate}>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                <button type="submit">수정 완료</button>
            </form>
        </div>
    );
}
export default UpdateInquiry;