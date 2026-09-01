import React,{useEffect,useState} from 'react';
import axios from 'axios';
import './Ranking.css';
function Ranking(){const [rows,setRows]=useState([]);useEffect(()=>{axios.get('/api/affinity/ranking').then(r=>setRows(r.data.ranking||[])).catch(e=>console.error(e));},[]);
 return <main className="ranking-page"><h1>AI 친밀도 랭킹</h1><p>AI 친구와 가장 가까워진 사용자를 확인해 보세요.</p><div className="ranking-list">{rows.map(row=><div className={`ranking-row rank-${row.rank}`} key={row.userId}><b className="ranking-number">{row.rank}</b><div className="ranking-profile">{row.savefilename?<img src={`/api/images/${row.savefilename}`} alt=""/>:<span>🙂</span>}<strong>{row.nickname}</strong></div><span>Lv.{row.level} {row.levelName}</span><em>{row.exp} EXP</em></div>)}</div></main>}
export default Ranking;
