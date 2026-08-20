import React, { useState } from 'react';
import ErrorLog from './ErrorLog';
import './AdminPage.css';

function AdminPage() {

    const [menu, setMenu] = useState('report');
    const [selectedReport, setSelectedReport] = useState(null);

    // 신고 목록
    const [reportList] = useState([
        {
            reportnum: 654,
            type: '부적절한 내용',
            target: 'user123',
            content: '게시글에 부적절한 내용이 포함되어 있습니다.',
            reporter: 'user456',
            date: '2026-08-20',
            status: '처리대기'
        },
        {
            reportnum: 653,
            type: '욕설·혐오 표현',
            target: 'user789',
            content: '댓글에 욕설 및 비하 표현이 포함되어 있습니다.',
            reporter: 'study01',
            date: '2026-08-20',
            status: '처리대기'
        },
        {
            reportnum: 652,
            type: '개인정보 노출',
            target: 'user321',
            content: '게시글에 개인정보가 노출되어 있습니다.',
            reporter: 'student01',
            date: '2026-08-19',
            status: '처리완료'
        },
        {
            reportnum: 651,
            type: '광고·도배',
            target: 'user555',
            content: '동일한 광고성 게시물을 반복적으로 작성했습니다.',
            reporter: 'user111',
            date: '2026-08-19',
            status: '처리완료'
        },
        {
            reportnum: 650,
            type: '기타',
            target: 'user222',
            content: '커뮤니티 이용에 적절하지 않은 게시물입니다.',
            reporter: 'user333',
            date: '2026-08-18',
            status: '처리대기'
        }
    ]);


    return (
        <div className="admin-layout">

        <div className="admin-page">
            {/* =========================
                관리자 사이드바
            ========================= */}
            <aside className="admin-sidebar">

                <div className="admin-sidebar-title">
                    관리자 페이지
                </div>


                <div className="admin-sidebar-menu">

                    {/* 신고함 */}
                    <button
                        type="button"
                        className={`admin-sidebar-item ${
                            menu === 'report' ? 'active' : ''
                        }`}
                        onClick={() => setMenu('report')}
                    >
                        신고함
                    </button>


                    {/* 에러 로그 */}
                    <button
                        type="button"
                        className={`admin-sidebar-error ${
                            menu === 'error' ? 'active' : ''
                        }`}
                        onClick={() => setMenu('error')}
                    >
                        에러 로그
                    </button>

                </div>

            </aside>


            {/* =========================
                메인
            ========================= */}
            <main className="admin-content">

                <div className="admin-wrapper">

                    {/* =========================
                        신고함
                    ========================= */}
                    {menu === 'report' && (

                        <>

                            <div className="admin-header">

                                <div>
                                    <h2 className="admin-title">
                                        신고함
                                    </h2>

                                    <p className="admin-description">
                                        접수된 신고 내역을 확인하고 관리합니다.
                                    </p>
                                </div>

                                <div className="admin-count">
                                    총 <strong>{reportList.length}</strong>건
                                </div>

                            </div>


                            {/* 신고 게시판 */}
                            <div className="admin-board">

                                <div className="admin-board-header">

                                    <div>번호</div>
                                    <div>신고 유형</div>
                                    <div>신고 대상</div>
                                    <div>신고 내용</div>
                                    <div>신고자</div>
                                    <div>신고일</div>
                                    <div>상태</div>

                                </div>


                                {reportList.map((report) => (
    <React.Fragment key={report.reportnum}>

        {/* 신고 목록 */}
        <div
            className={`admin-board-row ${
                selectedReport?.reportnum === report.reportnum
                    ? 'selected'
                    : ''
            }`}
            onClick={() => setSelectedReport(report)}
        >

            <div className="report-num">
                {report.reportnum}
            </div>

            <div>
                <div className="report-type">
                    {report.type}
                </div>
            </div>

            <div>
                {report.target}
            </div>

            <div className="report-content">
                {report.content}
            </div>

            <div>
                {report.reporter}
            </div>

            <div>
                {report.date}
            </div>

            <div>
                <div
                    className={
                        report.status === '처리완료'
                            ? 'report-status complete'
                            : 'report-status waiting'
                    }
                >
                    {report.status}
                </div>
            </div>

        </div>


        {/* 신고 상세 */}
        {selectedReport?.reportnum === report.reportnum && (

            <div className="report-detail">

                <div className="report-detail-title">
                    신고 상세
                </div>

                <div className="report-detail-info">

                    <div className="report-detail-item">
                        <div className="report-detail-label">
                            신고 유형
                        </div>

                        <div className="report-detail-value">
                            {report.type}
                        </div>
                    </div>


                    <div className="report-detail-item">
                        <div className="report-detail-label">
                            신고 대상
                        </div>

                        <div className="report-detail-value">
                            {report.target}
                        </div>
                    </div>


                    <div className="report-detail-item">
                        <div className="report-detail-label">
                            신고자
                        </div>

                        <div className="report-detail-value">
                            {report.reporter}
                        </div>
                    </div>


                    <div className="report-detail-item">
                        <div className="report-detail-label">
                            신고일
                        </div>

                        <div className="report-detail-value">
                            {report.date}
                        </div>
                    </div>

                </div>


                <div className="report-detail-content">
                    <div className="report-detail-label">
                        신고 내용
                    </div>

                    <div className="report-detail-text">
                        {report.content}
                    </div>
                </div>


                <button
                    type="button"
                    className="report-delete-button"
                    onClick={(e) => {

                        e.stopPropagation();

                        const result = window.confirm(
                            `신고된 ${report.targetType}을(를) 삭제하시겠습니까?`
                        );

                        if (!result) {
                            return;
                        }

                        console.log(
                            `${report.targetType} 삭제`,
                            report.targetId
                        );

                    }}
                >
                    {report.targetType} 삭제
                </button>

            </div>

        )}

    </React.Fragment>
))} 

                            </div>


                            {/* 페이지네이션 */}
                            <div className="admin-pagination">

                                <button type="button">
                                    &lt;
                                </button>

                                <button
                                    type="button"
                                    className="active"
                                >
                                    1
                                </button>

                                <button type="button">
                                    2
                                </button>

                                <button type="button">
                                    3
                                </button>

                                <button type="button">
                                    &gt;
                                </button>

                            </div>

                        </>

                    )}


                    {/* =========================
                        에러 로그
                    ========================= */}
                    {menu === 'error' && (
                        <ErrorLog />
                    )}

                </div>

            </main>
            </div>
        </div>
    );
}

export default AdminPage;