import React,{useEffect,useRef,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import jaxios from '../../utils/jwtUtil';
import './ItemShop.css';
function PaymentResult(){
 const navigate=useNavigate();const loginUser=useSelector(s=>s.user);const requested=useRef(false);const [result,setResult]=useState({loading:true,success:false,message:''});
 useEffect(()=>{if(requested.current)return;requested.current=true;const q=new URLSearchParams(window.location.search);if(q.get('failed')==='true'){setResult({loading:false,success:false,message:q.get('message')||'결제가 취소되었거나 실패했습니다.'});return;}const paymentKey=q.get('paymentKey');const orderId=q.get('orderId');const amount=Number(q.get('amount'));if(!paymentKey||!orderId||!amount){setResult({loading:false,success:false,message:'결제 결과 정보가 없습니다.'});return;}jaxios.post('/api/payment/complete',{userId:loginUser.userid,paymentKey,orderId,amount}).then(()=>setResult({loading:false,success:true,message:'결제가 완료되었습니다.',orderId,amount})).catch(e=>setResult({loading:false,success:false,message:e.response?.data?.message||'결제 승인에 실패했습니다.'}));},[loginUser.userid]);
 if(result.loading)return <main className="item-shop"><article className="item-card payment-card"><h1>결제를 승인하는 중입니다.</h1></article></main>;
 return <main className="item-shop"><article className="item-card payment-card"><h1>{result.success?'결제가 완료되었습니다.':'결제에 실패했습니다.'}</h1><p>{result.message}</p>{result.success&&<><p>주문번호: {result.orderId}</p><b>{Number(result.amount).toLocaleString()}원</b></>}<button onClick={()=>navigate(result.success?'/selectAi':'/itemShop')}>{result.success?'AI와 대화하기':'상점으로 돌아가기'}</button></article></main>;
}export default PaymentResult;
