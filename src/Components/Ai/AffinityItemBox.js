// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import jaxios from '../../utils/jwtUtil';
// import './AffinityItemBox.css';

// /** 세 AI 대화 화면에서 함께 사용하는 친밀도·아이템 영역입니다. */
// function AffinityItemBox() {
//     const loginUser = useSelector(state => state.user);
//     const [info, setInfo] = useState(null);

//     const loadInfo = () => {
//         if (!loginUser?.userid) return;
//         jaxios.get('/api/affinity/myInfo', { params: { userId: loginUser.userid } })
//             .then(result => setInfo(result.data))
//             .catch(error => console.error('친밀도 조회 실패:', error));
//     };

//     useEffect(loadInfo, [loginUser?.userid]);

//     const useItem = (itemId) => {
//         jaxios.post('/api/affinity/useItem', { userId: loginUser.userid, itemId })
//             .then(result => {
//                 setInfo(result.data);
//                 alert(`${result.data.usedItemName} 사용! 친밀도 경험치가 ${result.data.addedExp} 올랐습니다.`);
//             })
//             .catch(error => alert(error.response?.data?.message || '아이템을 사용하지 못했습니다.'));
//     };

//     if (!info) return null;
//     const percent = info.level >= 5 ? 100 : Math.min(100, (info.exp / info.nextLevelExp) * 100);

//     return (
//         <section className="affinity-box">
//             <div className="affinity-summary">
//                 <strong>AI 친밀도 Lv.{info.level} · {info.levelName}</strong>
//                 <span>{info.exp} / {info.nextLevelExp} EXP</span>
//             </div>
//             <div className="affinity-progress"><span style={{ width: `${percent}%` }} /></div>
//             <div className="affinity-items">
//                 {info.items.length === 0 ? (
//                     <span className="affinity-empty">보유 아이템이 없습니다. 상점에서 구매해 주세요.</span>
//                 ) : info.items.map(item => (
//                     <button key={item.itemId} type="button" disabled={item.quantity < 1}
//                             onClick={() => useItem(item.itemId)}>
//                         {item.itemImage && <img src={item.itemImage} alt="" />}
//                         <span>{item.itemName} × {item.quantity}</span>
//                         <small>사용 +{item.expValue} EXP</small>
//                     </button>
//                 ))}
//             </div>
//         </section>
//     );
// }
// export default AffinityItemBox;
