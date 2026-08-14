import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import '../../style/board/BoardWrite.css';

function BoardWrite() {

    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // 카테고리
    const [category, setCategory] = useState('');
    // 비공개 여부
    const [isPrivate, setIsPrivate] = useState(false);
    // 취소
    const handleCancel = () => { navigate('/BoardList'); };
    // 등록
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!category) {
            alert('카테고리를 선택해주세요.');
            return;
        }
        if (!title.trim()) {
            alert('제목을 입력해주세요.');
            return;
        }
        if (!content.trim()) {
            alert('내용을 입력해주세요.');
            return;
        }
        // 서버로 보낼 데이터
        const boardData = {title: title, content: content, userid: loginUser.userid, email: loginUser.email, isPrivate, category};
        // console.log('게시글 등록:', boardData);
        axios.post('/api/board/insertBoard', boardData)
            .then((result) => {
                // console.log('게시글 등록 결과:', result.data);
                alert('게시글이 등록되었습니다.');
                navigate('/boardList');
            })
            .catch((err) => {
                console.error('게시글 등록 실패:', err);
                // alert('게시글 등록에 실패했습니다.');
            });
    };

    return (
        <div className="board-write-page">
            <div className="board-write-header">
                <h1>고민 게시글 작성</h1>
                <p>여러분의 고민이나 이야기를 자유롭게 작성해주세요.</p>
            </div>
            <form className="board-write-container" onSubmit={handleSubmit}>
                {/* 카테고리 + 비공개 */}
                <div className="board-write-option">
                    <div className="board-category">
                        <label htmlFor="board-category">카테고리</label>
                        <select id="board-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="">카테고리를 선택해주세요.</option>
                            <option value="연애">연애</option>
                            <option value="가족">가족/가정</option>
                            <option value="친구관계">친구관계</option>
                            <option value="진로">진로/취업</option>
                            <option value="학교">학교/학업</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    <label className="private-option">
                        <input type="checkbox" checked={isPrivate} onChange={(e) => setIsPrivate(e.target.checked)}/>
                        <span className="private-toggle"></span>
                        <span className="private-text">비공개 글</span>
                    </label>
                </div>
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