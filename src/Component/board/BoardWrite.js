import React, { useState } from 'react';
import '../../style/board/BoardWrite.css';

function BoardWrite() {

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // 취소
    const handleCancel = () => {
        console.log('게시글 작성 취소');
        // React Router 사용 시
        // navigate('/board');
    };
    // 등록
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }
        const boardData = {
            title: title,
            content: content
        };
        console.log('게시글 등록:', boardData);
        /*
        나중에 axios 연결
        axios.post('/api/boards', boardData)
            .then((response) => {
                console.log(response.data);
                navigate('/board');
            }).catch((error) => { console.error(error); }); */
    };

    return (
        <div className="board-write-page">
            {/* 페이지 헤더 */}
            <div className="board-write-header">
                <h1>고민 게시글 작성</h1>
                <p>여러분의 고민이나 이야기를 자유롭게 작성해주세요.</p>
            </div>
            {/* 작성 폼 */}
            <form className="board-write-container" onSubmit={handleSubmit}>
                {/* 제목 */}
                <div className="board-write-field">
                    <label htmlFor="board-title">제목</label>
                    <input id="board-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목을 입력해주세요." maxLength={200}/>
                    <div className="board-write-count">{title.length} / 200</div>
                </div>
                {/* 내용 */}
                <div className="board-write-field content-field">
                    <label htmlFor="board-content">내용</label>
                    <textarea id="board-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="고민이나 이야기를 자유롭게 작성해주세요."/>
                    <div className="board-write-count">{content.length}자</div>
                </div>
                {/* 버튼 */}
                <div className="board-write-buttons">
                    <button type="button" className="board-cancel-btn" onClick={handleCancel}>취소</button>
                    <button type="submit" className="board-submit-btn">게시글 등록</button>
                </div>
            </form>
        </div>
    );
}

export default BoardWrite;