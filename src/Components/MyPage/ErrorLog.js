import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ErrorLog.css';

function ErrorLog() {

    const [errorLogs, setErrorLogs] = useState([]);

    // 현재 선택한 로그
    const [selectedLog, setSelectedLog] = useState(null);
    const [state, setState] = useState()

    useEffect(() => {

    axios.get('/api/admin/getErrorList')
            .then((result) => {

                console.log('에러 로그 전체 응답:', result.data);
                console.log('배열인가?', Array.isArray(result.data));

                setErrorLogs(
                    Array.isArray(result.data)
                        ? result.data
                        : result.data.errorLogs || result.data.list || []
                );

            })
            .catch((err) => {

                console.error('에러 로그 조회 실패:', err);

            });

    }, []);


    // 로그 클릭
    const handleLogClick = (log) => {

        setSelectedLog(log);

    };

    function CheckError(errornum) {

    axios.get('/api/admin/CheckError', {
        params: {
            errornum
        }

    })
        .then(() => {

            console.log('오류 해결 완료:', errornum);

            setErrorLogs(prevLogs =>
                prevLogs.map(log =>
                    log.errornum === errornum
                        ? { ...log, state: 'Y' }
                        : log
                )
            );

            setSelectedLog(prev =>
                prev
                    ? { ...prev, state: 'Y' }
                    : prev
            );

        })
        .catch((err) => {

            console.error('에러 확인 실패:', err);

        });
    }


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

                    총{' '}

                    <strong>
                        {errorLogs.length}
                    </strong>

                    건

                </div>

            </div>


            {/* =========================
                에러 로그 전체
            ========================= */}
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
                        왼쪽 로그 목록
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


                        {/* =========================
                            실제 에러 로그
                        ========================= */}
                        {errorLogs.map((log) => (

                            <div
                                key={log.errornum}
                                className={`error-log-line ${
                                    selectedLog?.errornum === log.errornum
                                        ? 'selected'
                                        : ''
                                } ${
                                    log.state === 'Y'
                                        ? 'resolved'
                                        : ''
                                }`}
                                onClick={() => handleLogClick(log)}
                            >

                                {/* 시간 / 상태코드 / 타입 */}
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


                                    {/* HTTP 상태 코드 */}
                                    <span className="error-status-code">
                                        {log.statusCode}
                                    </span>

                                </div>


                                {/* API 위치 */}
                                <div className="error-log-location">

                                    {log.method}

                                    {' '}

                                    {log.api}

                                </div>


                                {/* 에러 메시지 */}
                                <div className="error-log-message">
                                    {log.msg}
                                </div>

                            </div>

                        ))}


                        {/* 로그가 없을 때 */}
                        {errorLogs.length === 0 && (

                            <div className="error-log-empty">

                                저장된 에러 로그가 없습니다.

                            </div>

                        )}


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
                        오른쪽 상세
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


                                {/* =========================
                                    상세 헤더
                                ========================= */}
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


                                    {/* HTTP 상태 코드 */}
                                    <span className="preview-status complete">

                                        {selectedLog.statusCode}

                                    </span>

                                </div>


                                {/* =========================
                                    발생 시간
                                ========================= */}
                                <div className="preview-section">

                                    <div className="preview-label">
                                        발생 시간
                                    </div>

                                    <div className="preview-value">
                                        {selectedLog.time}
                                    </div>

                                </div>


                                {/* =========================
                                    HTTP 상태 코드
                                ========================= */}
                                <div className="preview-section">

                                    <div className="preview-label">
                                        상태 코드
                                    </div>

                                    <div className="preview-value">

                                        {selectedLog.statusCode}

                                    </div>

                                </div>


                                {/* =========================
                                    발생 API
                                ========================= */}
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


                                {/* =========================
                                    에러 메시지
                                ========================= */}
                                <div className="preview-section">

                                    <div className="preview-label">
                                        에러 메시지
                                    </div>

                                    <div className="preview-message">
                                        {selectedLog.msg}
                                    </div>

                                </div>


                                {/* =========================
                                    에러 번호
                                ========================= */}
                                <div className="preview-section">

                                    <div className="preview-label">
                                        에러 번호
                                    </div>

                                    <div className="preview-value">
                                        {selectedLog.errornum}
                                    </div>

                                </div>

                                {/* =========================
                                    오류 해결 완료
                                ========================= */}
                                {selectedLog.state !== 'Y' && (
                                    <div className="preview-action">
                                        <button
                                            type="button"
                                            className="error-complete-btn"
                                            onClick={() => CheckError(selectedLog.errornum)}
                                        >
                                            ✓ 오류 해결 완료
                                        </button>
                                    </div>
                                )}

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