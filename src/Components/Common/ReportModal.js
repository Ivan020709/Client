import React, { useState , useEffect} from 'react';
import axios from 'axios';
import './ReportModal.css';
import { useSelector, useDispatch } from 'react-redux';


function ReportModal({ post, boardnum, onClose }) {

    const loginUser = useSelector(state => state.user);

    const [reasontype, setReasontype] = useState('부적절한 내용');
    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');
    const [reporter, setReporter] = useState('');
    const [criminal, setCriminal] = useState('');
    const [submitting, setSubmitting] = useState(false);



    const submit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        try {
            await axios.post(`/api/admin/report`, {boardnum, reporter:loginUser.nickname, criminal, reasontype, content, title });
            alert('신고가 접수되었습니다.');
            onClose();
        } catch (error) {
            if (error.response?.status === 409) alert('이미 신고한 게시글입니다.');
            else if (error.response?.status === 401) alert('로그인 후 이용해주세요.');
            else alert(error.response?.data?.content || '신고 접수에 실패했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

  


    return (
        <div className="report-modal-backdrop" onClick={onClose} role="presentation">
            <form className="report-modal" onSubmit={submit} onClick={(event) => event.stopPropagation()}>
                <div className="report-modal-header">
                    <h2>게시글 신고</h2>
                    <button type="button" onClick={onClose} aria-label="신고 창 닫기">×</button>
                </div>
                <p className="report-modal-post-title">{post.title}</p>
                <label htmlFor="board-report-reason">신고 사유</label>
                <select id="board-report-reason" value={reasontype} onChange={(event) => setReasontype(event.target.value)}>
                    <option>부적절한 내용</option><option>욕설·혐오 표현</option><option>개인정보 노출</option>
                    <option>광고·도배</option><option>기타</option>
                </select>
                <label htmlFor="board-report-content">상세 내용 <span>(선택)</span></label>
                <textarea id="board-report-content" value={content} onChange={(event) => setContent(event.target.value)}
                    maxLength={500} placeholder="검토에 필요한 내용을 입력해주세요." />
                <button type="submit" className="report-modal-submit" disabled={submitting}>
                    {submitting ? '접수 중...' : '신고 접수'}
                </button>
            </form>
        </div>
    );
}

export default ReportModal;
