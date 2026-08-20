import React, { useState } from 'react';

function ErrorLog() {

    const [errorLogs, setErrorLogs] = useState([
        {
            lognum: 5,
            time: '2026-08-20 09:52:31',
            level: 'ERROR',
            type: 'NullPointerException',

            method: 'POST',
            api: '/api/member/updateMember',

            file: 'MemberService.java',
            className: 'MemberService',
            functionName: 'updateMember',
            line: 123,

            message: 'oldMember가 null입니다.',

            detail:
                '회원정보 수정 요청 처리 중 기존 회원 정보를 찾을 수 없습니다.',

            status: '확인 필요'
        },

        {
            lognum: 4,
            time: '2026-08-20 09:31:12',
            level: 'ERROR',
            type: 'AxiosError',

            method: 'GET',
            api: '/api/admin/getReportList',

            file: 'AdminPage.js',
            className: 'AdminPage',
            functionName: 'getReportList',
            line: 48,

            message: '신고 목록을 불러오지 못했습니다.',

            detail:
                'GET /api/admin/getReportList 요청이 정상적으로 처리되지 않았습니다.',

            status: '확인 필요'
        },

        {
            lognum: 3,
            time: '2026-08-19 18:44:02',
            level: 'ERROR',
            type: 'SQLException',

            method: 'GET',
            api: '/api/board/getBoardList',

            file: 'BoardRepository.java',
            className: 'BoardRepository',
            functionName: 'findAll',
            line: 87,

            message: '게시글 조회 중 SQL 오류가 발생했습니다.',

            detail:
                '게시판 데이터를 조회하는 과정에서 SQL 문 실행에 실패했습니다.',

            status: '확인 완료'
        },

        {
            lognum: 2,
            time: '2026-08-19 16:21:45',
            level: 'WARN',
            type: 'TypeError',

            method: 'GET',
            api: '/api/board/getBoardList',

            file: 'BoardList.js',
            className: 'BoardList',
            functionName: 'getBoardList',
            line: 72,

            message: 'undefined 값에 접근했습니다.',

            detail:
                '게시글 목록 렌더링 과정에서 존재하지 않는 데이터에 접근했습니다.',

            status: '확인 완료'
        },

        {
            lognum: 1,
            time: '2026-08-19 14:03:18',
            level: 'ERROR',
            type: '500 Internal Server Error',

            method: 'POST',
            api: '/api/member/updateMember',

            file: 'MemberController.java',
            className: 'MemberController',
            functionName: 'updateMember',
            line: 85,

            message:
                '회원정보 수정 요청 처리 중 서버 오류가 발생했습니다.',

            detail:
                'Spring Server에서 회원정보 수정 요청을 처리하는 과정에서 오류가 발생했습니다.',

            status: '확인 완료'
        }
    ]);


    // 현재 선택한 로그
    const [selectedLog, setSelectedLog] = useState(null);


    // 확인 필요 개수
    const waitingCount = errorLogs.filter(
        log => log.status === '확인 필요'
    ).length;


    // 로그 클릭
    const handleLogClick = (log) => {
        setSelectedLog(log);
    };


    // 확인 처리
    const handleConfirm = () => {

        if (!selectedLog) {
            return;
        }

        const updatedLogs = errorLogs.map((log) => {

            if (log.lognum === selectedLog.lognum) {

                return {
                    ...log,
                    status: '확인 완료'
                };

            }

            return log;

        });

        setErrorLogs(updatedLogs);

        setSelectedLog({
            ...selectedLog,
            status: '확인 완료'
        });
    };


    return (
        <>

            {/* =========================
                제목
            ========================= */}
            <div className="admin-header">

                <div>

                    <h2 className="admin-title">
                        에러 로그
                    </h2>

                    <p className="admin-description">
                        서버 및 서비스에서 발생한 오류를 확인합니다.
                    </p>

                </div>


                <div className="admin-count">

                    확인 필요{' '}

                    <strong>
                        {waitingCount}
                    </strong>

                </div>

            </div>


            {/* =================================================
                에러 로그 전체 컨테이너

                ★ 이거 하나만 사용
                ★ 안에서 왼쪽 로그 / 오른쪽 상세
            ================================================= */}
            <div className="error-terminal">


                {/* =========================
                    상단 터미널 바
                ========================= */}
                <div className="error-terminal-header">

                    <div className="terminal-buttons">

                        <span className="terminal-dot red"></span>

                        <span className="terminal-dot yellow"></span>

                        <span className="terminal-dot green"></span>

                    </div>


                    <div className="terminal-title">
                        system-error.log
                    </div>


                    <div className="terminal-status">
                        ● LIVE
                    </div>

                </div>


                {/* =========================
                    터미널 내부
                ========================= */}
                <div className="error-terminal-body">


                    {/* =========================
                        왼쪽 로그 영역
                    ========================= */}
                    <div className="error-log-list">


                        {/* 명령어 */}
                        <div className="terminal-start">

                            <span className="terminal-green">
                                admin@feelog
                            </span>

                            <span className="terminal-white">
                                :~$
                            </span>

                            <span className="terminal-purple">
                                tail -f system-error.log
                            </span>

                        </div>


                        {/* 로그 목록 */}
                        {errorLogs.map((log) => (

                            <div
                                key={log.lognum}
                                className={`error-log-line ${
                                    selectedLog?.lognum === log.lognum
                                        ? 'selected'
                                        : ''
                                }`}
                                onClick={() => handleLogClick(log)}
                            >

                                <div className="error-log-main">

                                    <span className="error-time">
                                        [{log.time}]
                                    </span>


                                    <span
                                        className={
                                            log.level === 'ERROR'
                                                ? 'error-level'
                                                : 'warn-level'
                                        }
                                    >
                                        {log.level}
                                    </span>


                                    <span className="error-type">
                                        {log.type}
                                    </span>

                                </div>


                                <div className="error-log-location">
                                    at {log.className}.
                                    {log.functionName}()
                                </div>


                                <div className="error-log-message">
                                    {log.message}
                                </div>


                                <div className="error-list-status">

                                    <span
                                        className={
                                            log.status === '확인 필요'
                                                ? 'log-waiting'
                                                : 'log-complete'
                                        }
                                    >
                                        {log.status}
                                    </span>

                                </div>

                            </div>

                        ))}


                        {/* 커서 */}
                        <div className="terminal-cursor">

                            <span className="terminal-green">
                                admin@feelog
                            </span>

                            <span className="terminal-white">
                                :~$
                            </span>

                            <span className="cursor">
                                ▌
                            </span>

                        </div>

                    </div>


                    {/* =========================
                        오른쪽 상세 미리보기

                        ★ 같은 터미널 내부
                    ========================= */}
                    <div className="error-log-preview">


                        {!selectedLog ? (

                            /* 선택 전 */
                            <div className="error-preview-empty">

                                <div className="preview-icon">
                                    !
                                </div>

                                <p>
                                    에러 로그를 선택해주세요.
                                </p>

                                <span>
                                    왼쪽 로그를 클릭하면
                                    상세 내용이 표시됩니다.
                                </span>

                            </div>

                        ) : (

                            /* 선택 후 */
                            <div className="error-preview-content">


                                {/* 상세 헤더 */}
                                <div className="preview-header">

                                    <div>

                                        <span
                                            className={
                                                selectedLog.level === 'ERROR'
                                                    ? 'preview-error-level'
                                                    : 'preview-warn-level'
                                            }
                                        >
                                            {selectedLog.level}
                                        </span>


                                        <h3>
                                            {selectedLog.type}
                                        </h3>

                                    </div>


                                    <span
                                        className={
                                            selectedLog.status === '확인 필요'
                                                ? 'preview-status waiting'
                                                : 'preview-status complete'
                                        }
                                    >
                                        {selectedLog.status}
                                    </span>

                                </div>


                                {/* 발생 시간 */}
                                <div className="preview-section">

                                    <div className="preview-label">
                                        발생 시간
                                    </div>

                                    <div className="preview-value">
                                        {selectedLog.time}
                                    </div>

                                </div>


                                {/* 발생 API */}
                                <div className="preview-section">

                                    <div className="preview-label">
                                        발생 API
                                    </div>

                                    <div className="preview-api">

                                        <span>
                                            {selectedLog.method}
                                        </span>

                                        {selectedLog.api}

                                    </div>

                                </div>


                                {/* 발생 위치 */}
                                <div className="preview-section">

                                    <div className="preview-label">
                                        발생 위치
                                    </div>

                                    <div className="preview-location">

                                        <strong>
                                            {selectedLog.file}
                                        </strong>

                                        <span>
                                            {selectedLog.className}.
                                            {selectedLog.functionName}()
                                        </span>

                                        <b>
                                            {selectedLog.line}번째 줄
                                        </b>

                                    </div>

                                </div>


                                {/* 에러 메시지 */}
                                <div className="preview-section">

                                    <div className="preview-label">
                                        에러 메시지
                                    </div>

                                    <div className="preview-message">
                                        {selectedLog.message}
                                    </div>

                                </div>


                                {/* 상세 내용 */}
                                <div className="preview-section">

                                    <div className="preview-label">
                                        상세 내용
                                    </div>

                                    <div className="preview-detail">
                                        {selectedLog.detail}
                                    </div>

                                </div>


                                {/* 확인 처리 */}
                                <div className="preview-footer">

                                    {selectedLog.status === '확인 필요' ? (

                                        <button
                                            type="button"
                                            className="error-confirm-button"
                                            onClick={handleConfirm}
                                        >
                                            확인 처리
                                        </button>

                                    ) : (

                                        <div className="confirmed-message">
                                            ✓ 관리자가 확인한 오류입니다.
                                        </div>

                                    )}

                                </div>

                            </div>

                        )}

                    </div>

                </div>

            </div>


            <div className="error-help-text">
                로그를 클릭하면 오른쪽에서 상세 내용을 확인할 수 있습니다.
            </div>

        </>
    );
}

export default ErrorLog;