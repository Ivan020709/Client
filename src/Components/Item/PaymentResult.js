import React from 'react';
import {useLocation,useNavigate} from 'react-router-dom';
import './ItemShop.css';
function PaymentResult(){const {state}=useLocation();const navigate=useNavigate();const ok=state?.success;return <main className="item-shop"><article className="item-card payment-card"><h1>{ok?'결제가 완료되었습니다.':'결제에 실패했습니다.'}</h1>{ok?<><p>상품: {state.itemName}</p><p>주문번호: {state.merchantUid}</p><b>{Number(state.totalPrice).toLocaleString()}원</b></>:<p>{state?.message||'결제 결과가 없습니다.'}</p>}<button onClick={()=>navigate(ok?'/selectAi':'/itemShop')}>{ok?'AI와 대화하기':'상점으로 돌아가기'}</button></article></main>}export default PaymentResult;
