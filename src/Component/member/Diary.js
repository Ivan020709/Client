import React,{useState} from "react";
import {useSelector} from "react-redux";
import "../../style/member/Diary.css";

const DIARY_API="/api/diary";

const emotionInfo={
    happy:{emoji:"😊",name:"행복"},
    calm:{emoji:"😌",name:"편안"},
    sad:{emoji:"😔",name:"우울"},
    anxious:{emoji:"😰",name:"불안"},
    angry:{emoji:"😡",name:"화남"}
};

/* =========================
   감정일기 목록
========================= */

function EmotionDiary({diaryTab,setDiaryTab,diaryList,setSelectedDiary,selectedDiary}){
    return(
        <div className="diary-section">
            <div className="section-header">
                <h2>감정일기</h2>
                <p>나의 하루와 다른 사람들의 이야기를 함께 확인해보세요.</p>
            </div>
            <div className="diary-tabs">
                <button type="button" className={diaryTab==="my"?"active":""} onClick={()=>setDiaryTab("my")}>내 일기</button>
                <button type="button" className={diaryTab==="community"?"active":""} onClick={()=>setDiaryTab("community")}>다른 사람들의 일기</button>
            </div>
            {diaryList.length===0?(
                <div className="empty-diary">
                    <div>📖</div>
                    <p>{diaryTab==="my"?"작성한 감정일기가 없습니다.":"아직 다른 사람들의 일기가 없습니다."}</p>
                    <span>{diaryTab==="my"?"감정 달력에서 하루의 감정을 기록해보세요.":"조금만 기다려주세요."}</span>
                </div>
            ):(
                <div className="diary-note-list">
                    {diaryList.map((diary,index)=><DiaryCard key={diary.diaryId||diary.date||index} diary={diary} onClick={()=>setSelectedDiary(diary)}/>)}
                </div>
            )}
            {selectedDiary&&(
                <div className="diary-modal-overlay" onClick={()=>setSelectedDiary(null)}>
                    <div className="diary-modal" onClick={e=>e.stopPropagation()}>
                        <button type="button" className="diary-modal-close" onClick={()=>setSelectedDiary(null)}>×</button>
                        <div className="diary-modal-icon">📖</div>
                        <div className="diary-modal-header">
                            <div>
                                <h3>{selectedDiary.nickname}님의 감정일기</h3>
                                <span>{selectedDiary.date}</span>
                            </div>
                            <div className="diary-modal-emotion">
                                <span>{emotionInfo[selectedDiary.emotion]?.emoji||"🙂"}</span>
                                <small>{emotionInfo[selectedDiary.emotion]?.name||"기록"}</small>
                            </div>
                        </div>
                        <div className="diary-modal-content">{selectedDiary.comment}</div>
                        <button type="button" className="diary-modal-close-btn" onClick={()=>setSelectedDiary(null)}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =========================
   일기장 카드
========================= */

function DiaryCard({diary,onClick}){
    return(
        <div className="diary-cover" onClick={onClick}>
            <div className="diary-book">
                <div className="diary-book-binding"></div>
                <div className="diary-book-icon">🖋️</div>
                <div className="diary-book-title">감정일기</div>
                <div className="diary-book-date">{diary.date}</div>
                <div className="diary-book-writer">{diary.nickname}</div>
                <div className="diary-book-hint">CLICK TO OPEN</div>
            </div>
        </div>
    );
}

/* =========================
   감정 달력
========================= */

function EmotionCalendar({currentDate,changeMonth,selectedDate,selectDate,selectedEmotion,setSelectedEmotion,comment,setComment,saveDiary,emotionData,emotionCount,isEditing,setIsEditing}){
    const year=currentDate.getFullYear();
    const month=currentDate.getMonth();
    const firstDay=new Date(year,month,1).getDay();
    const lastDate=new Date(year,month+1,0).getDate();

    const renderCalendar=()=>{
        const days=[];
        for(let i=0;i<firstDay;i++) days.push(<div key={`empty-${i}`} className="calendar-day empty"/>);
        for(let day=1;day<=lastDate;day++){
            const dateKey=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
            const data=emotionData[dateKey];
            const emotion=data?.emotion;
            const isSelected=selectedDate===dateKey;
            days.push(
                <div key={day} className={`calendar-day ${emotion||""} ${isSelected?"selected":""}`} onClick={()=>selectDate(day)}>
                    <span className="day-number">{day}</span>
                    {emotion&&<span className="emotion-emoji">{emotionInfo[emotion]?.emoji}</span>}
                    {data?.comment&&<span className="comment-mark">📝</span>}
                </div>
            );
        }
        return days;
    };

    const hasSavedDiary=selectedDate&&emotionData[selectedDate]?.comment;

    return(
        <div className="diary-section">
            <div className="section-header">
                <h2>감정 달력</h2>
                <p>하루의 감정과 한줄평을 기록해보세요.</p>
            </div>

            <div className="emotion-calendar-layout">
                <div className="calendar-box">
                    <div className="calendar-title">
                        <button type="button" onClick={()=>changeMonth(-1)}>‹</button>
                        <h3>{year}년 {month+1}월</h3>
                        <button type="button" onClick={()=>changeMonth(1)}>›</button>
                    </div>
                    <div className="calendar-week">
                        <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
                    </div>
                    <div className="calendar-grid">{renderCalendar()}</div>
                </div>

                <div className="emotion-summary">
                    <h3>이번 달 감정</h3>
                    <div className="emotion-item"><span>😊 행복</span><strong>{emotionCount.happy}일</strong></div>
                    <div className="emotion-item"><span>😌 편안</span><strong>{emotionCount.calm}일</strong></div>
                    <div className="emotion-item"><span>😔 우울</span><strong>{emotionCount.sad}일</strong></div>
                    <div className="emotion-item"><span>😰 불안</span><strong>{emotionCount.anxious}일</strong></div>
                    <div className="emotion-item"><span>😡 화남</span><strong>{emotionCount.angry}일</strong></div>
                </div>
            </div>

            {selectedDate&&(
                <div className="diary-box">
                    <h3>{selectedDate} 기록</h3>

                    <div className="emotion-select">
                        <p>오늘의 감정</p>
                        <div className="emotion-buttons">
                            {Object.entries(emotionInfo).map(([key,value])=>(
                                <button key={key} type="button" disabled={hasSavedDiary&&!isEditing} className={selectedEmotion===key?"emotion-active":""} onClick={()=>setSelectedEmotion(key)}>
                                    <span>{value.emoji}</span>
                                    <small>{value.name}</small>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="comment-area">
                        <p>오늘의 한줄평</p>
                        <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="오늘 하루는 어땠나요?" maxLength={100} readOnly={hasSavedDiary&&!isEditing}/>
                        <div className="comment-bottom">
                            <span>{comment.length}/100</span>
                            {hasSavedDiary&&!isEditing?(
                                <button type="button" onClick={()=>setIsEditing(true)}>수정</button>
                            ):(
                                <button type="button" onClick={saveDiary}>저장</button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =========================
   프로필
========================= */

function ProfileEdit({loginUser}){
    return(
        <div className="diary-section">
            <div className="section-header">
                <h2>프로필</h2>
                <p>나의 정보를 확인할 수 있습니다.</p>
            </div>
            <div className="profile-edit-box">
                <div className="profile-image-area">
                    <div className="profile-big-image">👤</div>
                    <button type="button">이미지 변경</button>
                </div>
                <div className="profile-form">
                    <div className="form-row">
                        <label>닉네임</label>
                        <input type="text" value={loginUser?.nickname||""} readOnly/>
                    </div>
                    <div className="form-row">
                        <label>이메일</label>
                        <input type="email" value={loginUser?.email||""} readOnly/>
                    </div>
                    <div className="form-row">
                        <label>전화번호</label>
                        <input type="text" value={loginUser?.phone||""} readOnly/>
                    </div>
                    <button className="save-profile-btn" type="button">변경사항 저장</button>
                </div>
            </div>
        </div>
    );
}

/* =========================
   설정
========================= */

function Setting(){
    return(
        <div className="diary-section">
            <div className="section-header">
                <h2>설정</h2>
                <p>계정 및 서비스 설정을 관리합니다.</p>
            </div>
            <div className="setting-box">
                <div className="setting-item">
                    <div><strong>알림 설정</strong><p>새로운 소식과 알림을 받습니다.</p></div>
                    <input type="checkbox" defaultChecked/>
                </div>
                <div className="setting-item">
                    <div><strong>대화 기록 저장</strong><p>AI와의 대화 기록을 저장합니다.</p></div>
                    <input type="checkbox" defaultChecked/>
                </div>
                <div className="setting-item">
                    <div><strong>로그아웃</strong><p>현재 계정에서 로그아웃합니다.</p></div>
                    <button className="logout-btn" type="button">로그아웃</button>
                </div>
            </div>
        </div>
    );
}

/* =========================
   Diary
========================= */

function Diary(){
    const loginUser=useSelector(state=>state.user);
    const [menu,setMenu]=useState("diary");
    const [diaryTab,setDiaryTab]=useState("my");
    const [currentDate,setCurrentDate]=useState(new Date());
    const [selectedDate,setSelectedDate]=useState(null);
    const [selectedEmotion,setSelectedEmotion]=useState("");
    const [comment,setComment]=useState("");
    const [selectedDiary,setSelectedDiary]=useState(null);
    const [isEditing,setIsEditing]=useState(false);

    const userId=loginUser?.userid||"guest";
    const nickname=loginUser?.nickname||loginUser?.userid||"익명";
    const storageKey=`emotionData_${userId}`;

    const [emotionData,setEmotionData]=useState(()=>{
        try{
            const saved=localStorage.getItem(storageKey);
            return saved?JSON.parse(saved):{};
        }catch{
            return {};
        }
    });

    const changeMonth=value=>{
        const year=currentDate.getFullYear();
        const month=currentDate.getMonth();
        setCurrentDate(new Date(year,month+value,1));
        setSelectedDate(null);
        setSelectedEmotion("");
        setComment("");
        setIsEditing(false);
    };

    const selectDate=day=>{
        const year=currentDate.getFullYear();
        const month=currentDate.getMonth();
        const dateKey=`${year}-${String(month+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
        const data=emotionData[dateKey]||{};
        setSelectedDate(dateKey);
        setSelectedEmotion(data.emotion||"");
        setComment(data.comment||"");
        setIsEditing(!data.comment);
    };

    const saveDiary=()=>{
        if(!selectedDate)return alert("날짜를 선택해주세요.");
        if(!selectedEmotion)return alert("오늘의 감정을 선택해주세요.");
        if(!comment.trim())return alert("한줄평을 입력해주세요.");

        const newData={
            ...emotionData,
            [selectedDate]:{
                emotion:selectedEmotion,
                comment:comment.trim(),
                userid:userId,
                nickname:nickname,
                date:selectedDate
            }
        };

        setEmotionData(newData);
        localStorage.setItem(storageKey,JSON.stringify(newData));
        setIsEditing(false);
        alert("감정일기가 저장되었습니다.");
    };

    const myDiaryList=Object.entries(emotionData)
        .filter(([date,data])=>data?.comment)
        .map(([date,data])=>({
            date,
            userid:data.userid||userId,
            nickname:data.nickname||nickname,
            emotion:data.emotion,
            comment:data.comment
        }))
        .sort((a,b)=>new Date(b.date)-new Date(a.date));

    const communityDiaryList=[
        {diaryId:1,userid:"user01",nickname:"민수",date:"2026-08-18",emotion:"happy",comment:"오늘은 기분 좋은 일이 많았다."},
        {diaryId:2,userid:"user02",nickname:"지민",date:"2026-08-17",emotion:"calm",comment:"오랜만에 여유로운 하루였다."},
        {diaryId:3,userid:"user03",nickname:"서연",date:"2026-08-16",emotion:"sad",comment:"조금 힘든 하루였지만 잘 이겨냈다."}
    ].sort((a,b)=>new Date(b.date)-new Date(a.date));

    const diaryList=diaryTab==="my"?myDiaryList:communityDiaryList;
    const year=currentDate.getFullYear();
    const month=currentDate.getMonth();

    const currentMonthData=Object.entries(emotionData).filter(([date])=>date.startsWith(`${year}-${String(month+1).padStart(2,"0")}`));

    const emotionCount={happy:0,calm:0,sad:0,anxious:0,angry:0};

    currentMonthData.forEach(([date,data])=>{
        if(data.emotion&&emotionCount[data.emotion]!==undefined) emotionCount[data.emotion]++;
    });

    return(
        <div className="diary">
            <div className="diary-header">
                <h1>My Diary</h1>
                <p>나의 감정과 이야기를 관리해보세요.</p>
            </div>

            <div className="diary-container">
                <aside className="diary-sidebar">
                    <div className="sidebar-profile">
                        <div className="sidebar-profile-image">👤</div>
                        <div className="sidebar-profile-info">
                            <strong>{loginUser?.nickname||loginUser?.userid||"로그인 필요"}</strong>
                        </div>
                    </div>

                    <div className="sidebar-menu">
                        <button type="button" className={menu==="diary"?"active":""} onClick={()=>setMenu("diary")}><span>📖</span>감정일기</button>
                        <button type="button" className={menu==="emotion"?"active":""} onClick={()=>setMenu("emotion")}><span>📅</span>감정 달력</button>
                        <button type="button" className={menu==="profile"?"active":""} onClick={()=>setMenu("profile")}><span>👤</span>프로필</button>
                        <button type="button" className={menu==="setting"?"active":""} onClick={()=>setMenu("setting")}><span>⚙️</span>설정</button>
                    </div>
                </aside>

                <main className="diary-content">
                    {menu==="diary"&&(
                        <EmotionDiary
                            diaryTab={diaryTab}
                            setDiaryTab={setDiaryTab}
                            diaryList={diaryList}
                            setSelectedDiary={setSelectedDiary}
                            selectedDiary={selectedDiary}
                        />
                    )}

                    {menu==="emotion"&&(
                        <EmotionCalendar
                            currentDate={currentDate}
                            changeMonth={changeMonth}
                            selectedDate={selectedDate}
                            selectDate={selectDate}
                            selectedEmotion={selectedEmotion}
                            setSelectedEmotion={setSelectedEmotion}
                            comment={comment}
                            setComment={setComment}
                            saveDiary={saveDiary}
                            emotionData={emotionData}
                            emotionCount={emotionCount}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                        />
                    )}

                    {menu==="profile"&&<ProfileEdit loginUser={loginUser}/>}
                    {menu==="setting"&&<Setting/>}
                </main>
            </div>
        </div>
    );
}

export default Diary;