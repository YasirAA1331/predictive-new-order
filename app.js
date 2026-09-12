const origin = { latitude: -6.9818, longitude: 110.4093 };
const targetIrr = 10.73;

// Deterministic demo rows mirror the PMNO decision-engine output; coordinates are geographic
// so the map behaves like a real New Order analysis before live RPC wiring is enabled.
const candidates = [
  {site_id:'PMNO-018138',site_name:'PMNO Semarang 18138',latitude:-6.96948,longitude:110.40102,distance_m:1369,opportunity_score:75.3,irr:16.30,capex:'Rp 1.16 B',signal_fit:90,engineering_score:50,network_score:84,tower_type:'ROOFTOP',height:22,challenge:'ENGINEERING / STRUCTURAL'},
  {site_id:'PMNO-023413',site_name:'PMNO Semarang 23413',latitude:-6.97355,longitude:110.41748,distance_m:975,opportunity_score:74.8,irr:20.85,capex:'Rp 827 M',signal_fit:90,engineering_score:50,network_score:88,tower_type:'ROOFTOP',height:26,challenge:'ENGINEERING / STRUCTURAL'},
  {site_id:'PMNO-020943',site_name:'PMNO Semarang 20943',latitude:-6.97225,longitude:110.42305,distance_m:1555,opportunity_score:74.3,irr:12.65,capex:'Rp 1.28 B',signal_fit:90,engineering_score:50,network_score:79,tower_type:'SST',height:33,challenge:'ENGINEERING / STRUCTURAL'},
  {site_id:'PMNO-021221',site_name:'PMNO Semarang 21221',latitude:-6.99205,longitude:110.40425,distance_m:1392,opportunity_score:73.9,irr:11.30,capex:'Rp 1.09 B',signal_fit:90,engineering_score:50,network_score:76,tower_type:'MONOPOLE',height:23,challenge:'ENGINEERING / STRUCTURAL'},
  {site_id:'PMNO-017905',site_name:'PMNO Semarang 17905',latitude:-6.99485,longitude:110.42140,distance_m:1465,opportunity_score:73.6,irr:14.85,capex:'Rp 1.21 B',signal_fit:90,engineering_score:50,network_score:82,tower_type:'SST',height:36,challenge:'ENGINEERING / STRUCTURAL'},
  {site_id:'PMNO-010112',site_name:'PMNO Semarang 10112',latitude:-6.97230,longitude:110.39340,distance_m:1900,opportunity_score:68.2,irr:9.40,capex:'Rp 1.48 B',signal_fit:84,engineering_score:45,network_score:70,tower_type:'SST',height:40,challenge:'IRR BELOW TARGET'}
];

const nearest = [...candidates].sort((a,b)=>a.distance_m-b.distance_m);
const top5 = [...candidates].sort((a,b)=>b.opportunity_score-a.opportunity_score).slice(0,5);
let selected = top5.find(c => c.irr >= targetIrr) || top5[0];
let map;
let radiusCircle;
const towerLayers = new Map();

function markerIcon(type, rank){
  const cls = type === 'recommended' ? 'pm-marker recommended-marker' : type === 'collo' ? 'pm-marker collo-marker' : 'pm-marker nearest-marker';
  return L.divIcon({className:'', html:`<div class="${cls}">${type === 'recommended' ? '★' : type === 'collo' ? `<b>${rank}</b>` : '•'}</div>`, iconSize:type==='recommended'?[34,34]:type==='collo'?[28,28]:[20,20], iconAnchor:type==='recommended'?[17,17]:type==='collo'?[14,14]:[10,10]});
}

function initMap(){
  map = L.map('map', { zoomControl:false, attributionControl:true }).setView([origin.latitude, origin.longitude], 13.5);
  L.control.zoom({position:'bottomright'}).addTo(map);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom:19, attribution:'© OpenStreetMap contributors'}).addTo(map);
  radiusCircle = L.circle([origin.latitude,origin.longitude], {radius:3000, className:'pm-radius', color:'#35c8ff', weight:1, fillOpacity:.035}).addTo(map);
  L.marker([origin.latitude,origin.longitude], {icon:L.divIcon({className:'',html:'<div class="new-order-pin">+</div>',iconSize:[38,38],iconAnchor:[19,19]})})
    .addTo(map).bindPopup('<b>NEW ORDER</b><br>Target: IOH');
  renderMarkers();
}

function renderMarkers(){
  towerLayers.forEach(layer=>layer.remove());
  towerLayers.clear();
  nearest.forEach(c=>{
    const rank = top5.findIndex(x=>x.site_id===c.site_id)+1;
    const isTop = rank>0;
    const isRec = c.site_id===selected.site_id;
    const type = isRec ? 'recommended' : isTop ? 'collo' : 'nearest';
    const layer=L.marker([c.latitude,c.longitude], {icon:markerIcon(type,rank)}).addTo(map);
    layer.bindTooltip(`${isRec?'★ Recommended COLLO':'Tower'} · ${c.site_id}`, {direction:'top', offset:[0,-10]});
    layer.on('click',()=>selectCandidate(c));
    towerLayers.set(c.site_id,layer);
  });
}

function selectCandidate(c){selected=c;updateDetail();renderList();renderMarkers();const layer=towerLayers.get(c.site_id);if(layer){map.flyTo([c.latitude,c.longitude],15,{duration:.5});layer.openTooltip();}}

function updateDetail(){
  const viable=selected.irr>=targetIrr;
  const decision=document.getElementById('decision');
  decision.textContent=viable?'COLLO':'NEW SITE';
  decision.style.color=viable?'var(--green)':'var(--amber)';
  document.getElementById('siteName').textContent=selected.site_id+' · '+selected.site_name;
  document.getElementById('score').textContent=selected.opportunity_score.toFixed(1);
  document.getElementById('irr').textContent=selected.irr.toFixed(2)+'%';
  document.getElementById('capex').textContent=selected.capex;
  document.getElementById('distance').textContent=(selected.distance_m/1000).toFixed(2)+' km';
  document.getElementById('signal').textContent=selected.signal_fit+' / 100';
  document.getElementById('eng').textContent=selected.engineering_score;
  document.getElementById('engBar').style.width=selected.engineering_score+'%';
  document.getElementById('network').textContent=selected.network_score;
  document.getElementById('networkBar').style.width=selected.network_score+'%';
  document.getElementById('challenge').textContent=selected.challenge;
  document.getElementById('challengeText').textContent=selected.challenge==='IRR BELOW TARGET'?'Economics does not clear the 10.73% target IRR.':'Structural capacity requires further validation before final COLLO execution.';
}

function renderList(){
  document.getElementById('candidateList').innerHTML=top5.map((c,i)=>`<div class="candidate ${c.site_id===selected.site_id?'active':''}" data-id="${c.site_id}"><div class="rank">#${i+1}</div><div><strong>${c.site_id}</strong><small>${(c.distance_m/1000).toFixed(2)} km · ${c.tower_type} · ${c.height} m</small></div><div class="right"><b>${c.opportunity_score.toFixed(1)}</b><small>${c.irr.toFixed(2)}% IRR</small></div></div>`).join('');
  document.querySelectorAll('.candidate').forEach(el=>el.onclick=()=>selectCandidate(top5.find(c=>c.site_id===el.dataset.id)));
}

function updateRadius(){const km=+document.getElementById('radius').value/1000;document.getElementById('radiusText').textContent=km+' km';if(radiusCircle)radiusCircle.setRadius(km*1000);}
document.getElementById('radius').onchange=updateRadius;
document.getElementById('analyze').onclick=()=>{const lat=Number(document.getElementById('lat').value),lon=Number(document.getElementById('lon').value),tenant=document.getElementById('tenant').value;if(!Number.isFinite(lat)||!Number.isFinite(lon))return;map.flyTo([lat,lon],13.5,{duration:.6});radiusCircle.setLatLng([lat,lon]);map.eachLayer(layer=>{if(layer.getPopup && layer.getPopup() && layer.getPopup().getContent()?.includes('NEW ORDER')) layer.setLatLng([lat,lon]);});document.getElementById('siteName').textContent='ANALYZING · '+tenant+' · '+lat.toFixed(5)+', '+lon.toFixed(5);setTimeout(()=>{selected=top5.find(c=>c.irr>=targetIrr)||top5[0];renderList();updateDetail();renderMarkers()},300)};

initMap();renderList();updateDetail();updateRadius();
