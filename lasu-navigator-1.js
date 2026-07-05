// ═══════════════════════════════
//  NAVIGATION
// ═══════════════════════════════
const PAGES = ['home','map','cgpa','timetable','profile','links','advisor','notifications'];
function showPage(id) {
  PAGES.forEach(p => {
    const el = document.getElementById('page-'+p);
    const ni = document.getElementById('nav-'+p);
    if(el) el.classList.remove('active');
    if(ni) ni.classList.remove('active');
  });
  const pg = document.getElementById('page-'+id);
  const ni = document.getElementById('nav-'+id);
  if(pg) pg.classList.add('active');
  if(ni) ni.classList.add('active');
  window.scrollTo(0,0);
}

// Small helper to escape strings used in element attributes/values
function escapeHtml(s){ return String(s===undefined||s===null?'':s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

function switchMapTab(v) {
  ['mv','dv','sv','hv'].forEach(t=>{
    document.getElementById(t).classList.remove('active');
    document.getElementById('tab-'+t).classList.remove('active');
  });
  document.getElementById(v).classList.add('active');
  document.getElementById('tab-'+v).classList.add('active');
}

// ═══════════════════════════════
//  THEME & OFFLINE
// ═══════════════════════════════
function toggleTheme() {
  document.body.classList.toggle('dark');
  localStorage.setItem('lasu_theme', document.body.classList.contains('dark')?'dark':'light');
}
window.addEventListener('online', ()=>document.getElementById('offline-banner').classList.remove('show'));
window.addEventListener('offline', ()=>document.getElementById('offline-banner').classList.add('show'));

// ═══════════════════════════════
//  TOAST
// ═══════════════════════════════
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'), 2800);
}

// ═══════════════════════════════
//  MODALS
// ═══════════════════════════════
function showLoc(name,desc,time) {
  document.getElementById('modal-name').textContent=name;
  document.getElementById('modal-desc').textContent=desc;
  document.getElementById('modal-time').textContent=time;
  document.getElementById('loc-modal').classList.add('open');
}
function closeModalById(id){document.getElementById(id).classList.remove('open')}
function handleModalBg(e,id){if(e.target===document.getElementById(id))closeModalById(id)}

// ═══════════════════════════════
//  GPS TRACKING
// ═══════════════════════════════
// LASU Ojo campus approx bounds:
// lat: 6.4680–6.4715, lng: 3.1820–3.1870
// SVG viewBox: 360x500, campus ~centre
const CAMPUS = {minLat:6.4680,maxLat:6.4720,minLng:3.1815,maxLng:3.1875};
let gpsWatcher = null;

function latLngToSVG(lat,lng) {
  const x = ((lng-CAMPUS.minLng)/(CAMPUS.maxLng-CAMPUS.minLng))*360;
  const y = ((CAMPUS.maxLat-lat)/(CAMPUS.maxLat-CAMPUS.minLat))*500;
  return {x:Math.max(10,Math.min(350,x)), y:Math.max(10,Math.min(490,y))};
}

function startGPS() {
  if(!navigator.geolocation){showToast('GPS not supported on this device');return;}
  document.getElementById('gps-unavail').classList.add('hidden');
  showToast('📍 Locating you…');
  gpsWatcher = navigator.geolocation.watchPosition(
    pos => {
      const {latitude:lat,longitude:lng} = pos.coords;
      const {x,y} = latLngToSVG(lat,lng);
      document.getElementById('gps-marker').setAttribute('cx',x);
      document.getElementById('gps-marker').setAttribute('cy',y);
      document.getElementById('gps-ring').setAttribute('cx',x);
      document.getElementById('gps-ring').setAttribute('cy',y);
      document.getElementById('gps-dot').classList.add('active');
      document.getElementById('gps-label').textContent='GPS active';
      showToast('📍 Location updated');
    },
    err => {
      document.getElementById('gps-unavail').classList.remove('hidden');
      document.getElementById('gps-dot').classList.remove('active');
      document.getElementById('gps-label').textContent='GPS unavailable';
      if(err.code===1) showToast('⚠️ Location permission denied');
      else showToast('⚠️ GPS signal lost');
    },
    {enableHighAccuracy:true, maximumAge:5000}
  );
}

function stopGPS() {
  if(gpsWatcher) navigator.geolocation.clearWatch(gpsWatcher);
  document.getElementById('gps-marker').setAttribute('cx','-50');
  document.getElementById('gps-marker').setAttribute('cy','-50');
  document.getElementById('gps-ring').setAttribute('cx','-50');
  document.getElementById('gps-ring').setAttribute('cy','-50');
  document.getElementById('gps-dot').classList.remove('active');
  document.getElementById('gps-label').textContent='GPS off';
  showToast('GPS stopped');
}

// ═══════════════════════════════
//  DIRECTIONS
// ═══════════════════════════════
const routes = {
  gate:{
    senate:{steps:["Enter campus through the Main Gate","Walk straight north along the central boulevard (~500m)","Senate Building (circular structure) is directly ahead"],time:"~8 mins"},
    spgs:{steps:["Enter via Main Gate, head north","Continue past the cafeteria area","SPGS building (teal) is on your right before the top junction"],time:"~10 mins"},
    library:{steps:["Enter gate, head north past Senate","Turn right (east) after Senate roundabout","Library is the blue-green building on your right"],time:"~11 mins"},
    science:{steps:["Enter gate, head north to Senate roundabout","Turn left (west)","Faculty of Science (blue building) is 200m ahead"],time:"~12 mins"},
    eng:{steps:["Enter gate, walk north all the way to the top road","At junction, turn left (west)","Faculty of Engineering (orange) is on your left"],time:"~18 mins"},
    mgmt:{steps:["Enter gate, walk north to the lower cross-road","Turn left (west)","Management Sciences is on your right"],time:"~7 mins"},
    arts:{steps:["Enter gate, walk north to the cross-road","Turn right (east)","Faculty of Arts is past the SUB, on the right"],time:"~9 mins"},
    sub:{steps:["Enter gate, turn right at first junction","SUB (yellow building) is immediately on your right"],time:"~4 mins"},
    sports:{steps:["Enter gate, head straight north past Senate","Cross the top road, head north-east","Sports Complex is at the far north-east corner"],time:"~20 mins"},
    cafe:{steps:["Enter gate, walk north ~350m","Cafeteria is just south of the Senate roundabout"],time:"~5 mins"},
    medicine:{steps:["Enter gate, head north to Senate roundabout","Turn left (west) past Science","College of Medicine (red) is further west"],time:"~14 mins"},
    hostel:{steps:["Enter gate, head north past Senate","Take the right fork north-east past Library","Hostels are behind the Library"],time:"~11 mins"}
  },
  senate:{
    library:{steps:["From Senate face east","Walk 150m — Library is directly to your right"],time:"~2 mins"},
    spgs:{steps:["From Senate, head north","SPGS is 200m north on the right side"],time:"~3 mins"},
    science:{steps:["From Senate, face west","Faculty of Science is 200m ahead on the left"],time:"~4 mins"},
    sub:{steps:["From Senate, head south","Turn right at first junction — SUB is on your right"],time:"~4 mins"},
    cafe:{steps:["Cafeteria is just south of the Senate Building"],time:"~2 mins"},
    gate:{steps:["From Senate, head south on the main road","Main Gate is 500m straight ahead"],time:"~8 mins"},
    eng:{steps:["From Senate, go north to the top road","Turn left (west) — Engineering is north-west"],time:"~10 mins"},
    sports:{steps:["From Senate, go north-east past SPGS","Cross the top road to the north-east corner"],time:"~12 mins"},
    mgmt:{steps:["From Senate go south-west along the cross road","Management Sciences is on the south-west block"],time:"~4 mins"},
    arts:{steps:["From Senate head south-east","Arts Faculty is past the SUB on the east side"],time:"~5 mins"},
    medicine:{steps:["From Senate, go west past Science","College of Medicine is the red building further west"],time:"~6 mins"},
    hostel:{steps:["From Senate, go east then north past Library","Hostels are north-east of Library"],time:"~5 mins"}
  },
  spgs:{
    science:{steps:["From SPGS, head south to Senate roundabout","Turn left (west) — Science faculty is ahead"],time:"~5 mins"},
    library:{steps:["From SPGS, head south slightly then east","Library is east of Senate"],time:"~4 mins"},
    senate:{steps:["From SPGS, head south on the main road","Senate is 200m ahead"],time:"~3 mins"},
    gate:{steps:["From SPGS, head south through Senate","Continue to Main Gate"],time:"~11 mins"},
    hostel:{steps:["From SPGS, head east across the top road","Hostels are on the north-east side"],time:"~6 mins"},
    sports:{steps:["From SPGS, head east across the top road","Sports complex is further north-east"],time:"~10 mins"}
  }
};

function getDirections() {
  const from=document.getElementById('from-loc').value;
  const to=document.getElementById('to-loc').value;
  const out=document.getElementById('rresult');
  if(from===to){
    out.innerHTML=`<div class="rtitle">Already There!</div><div class="rstep"><div class="snum">✓</div><div>You are already at your destination.</div></div>`;
    out.style.display='block';return;
  }
  const r=routes[from]?.[to]||routes[to]?.[from];
  if(r){
    // Escape step text to avoid accidental HTML injection from route descriptions
    const esc = (str)=>String(str).replace(/[&"'<>]/g, ch=>({
      '&':'&amp;', '"':'&quot;', "'":"&#39;", '<':'&lt;', '>':'&gt;'
    }[ch]));
    const html=r.steps.map((s,i)=>`<div class="rstep"><div class="snum">${i+1}</div><div>${esc(s)}</div></div>`).join('');
    out.innerHTML=`<div class="rtitle">Step-by-Step Route</div>${html}<div class="rtime">⏱️ ${r.time} walking</div>`;
  }else{
    out.innerHTML=`<div class="rtitle">General Route</div><div class="rstep"><div class="snum">1</div><div>Head to Senate Building roundabout — the main hub</div></div><div class="rstep"><div class="snum">2</div><div>Use main roads N/S/E/W from Senate toward your destination</div></div><div class="rstep"><div class="snum">3</div><div>Ask any security officer near Senate for help</div></div><div class="rtime">⏱️ Varies</div>`;
  }
  out.style.display='block';
}

// ═══════════════════════════════
//  PROFILE
// ═══════════════════════════════
let profile=null;

function saveProfile() {
  const name=document.getElementById('inp-name').value.trim();
  const matric=document.getElementById('inp-matric').value.trim();
  if(!name||!matric){showToast('⚠️ Name and Matric Number required');return;}
  const finish=(photo)=>{
    profile={name,matric,reg:document.getElementById('inp-reg').value.trim(),faculty:document.getElementById('inp-faculty').value,dept:document.getElementById('inp-dept').value.trim(),level:document.getElementById('inp-level').value,phone:document.getElementById('inp-phone').value.trim(),photo};
    localStorage.setItem('lasu_profile',JSON.stringify(profile));
    if(window.saveProfileToFirebase){window.saveProfileToFirebase(profile);}
    renderProfile();showToast('✅ Profile saved!');
  };
  const fi=document.getElementById('photo-input');
  if(fi.files&&fi.files[0]){const r=new FileReader();r.onload=e=>finish(e.target.result);r.readAsDataURL(fi.files[0]);}
  else finish(profile?.photo||null);
}

function renderProfile() {
  if(profile){
    document.getElementById('profile-form').classList.add('hidden');
    document.getElementById('profile-view').classList.remove('hidden');
    document.getElementById('disp-name').textContent=profile.name;
    document.getElementById('disp-matric').textContent=profile.matric||'—';
    document.getElementById('disp-reg').textContent=profile.reg||'—';
    document.getElementById('disp-faculty').textContent=profile.faculty||'—';
    document.getElementById('disp-dept').textContent=profile.dept||'—';
    document.getElementById('disp-level').textContent=(profile.level||'—')+' Level';
    document.getElementById('disp-phone').textContent=profile.phone||'—';
    document.getElementById('disp-dept-h').textContent=`${profile.dept||'Department'} · ${profile.level||'—'} Level`;
    if(profile.photo) document.getElementById('disp-photo').src=profile.photo;
    document.getElementById('hero-name').textContent=`Welcome, ${profile.name.split(' ')[0]}! 👋`;
    generateQR();
  }else{
    document.getElementById('profile-form').classList.remove('hidden');
    document.getElementById('profile-view').classList.add('hidden');
    document.getElementById('cancel-btn').classList.add('hidden');
  }
}

function showEditForm() {
  if(profile){
    document.getElementById('inp-name').value=profile.name||'';
    document.getElementById('inp-matric').value=profile.matric||'';
    document.getElementById('inp-reg').value=profile.reg||'';
    document.getElementById('inp-faculty').value=profile.faculty||'';
    document.getElementById('inp-dept').value=profile.dept||'';
    document.getElementById('inp-level').value=profile.level||'400';
    document.getElementById('inp-phone').value=profile.phone||'';
    if(profile.photo){const img=document.getElementById('photo-prev-img');img.src=profile.photo;img.style.display='block';document.getElementById('photo-ph').style.display='none';}
  }
  document.getElementById('profile-view').classList.add('hidden');
  document.getElementById('profile-form').classList.remove('hidden');
  document.getElementById('cancel-btn').classList.remove('hidden');
  window.scrollTo(0,0);
}
function cancelEdit(){renderProfile()}
function previewPhoto(e){
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();r.onload=ev=>{const img=document.getElementById('photo-prev-img');img.src=ev.target.result;img.style.display='block';document.getElementById('photo-ph').style.display='none';};r.readAsDataURL(f);
}

// ═══════════════════════════════
//  QR ID
// ═══════════════════════════════
function generateQR(){
  const el=document.getElementById('qr-canvas');
  el.innerHTML='';
  if(!profile)return;
  const data=`LASU STUDENT\nName: ${profile.name}\nMatric: ${profile.matric}\nReg: ${profile.reg||'N/A'}\nFaculty: ${profile.faculty}\nDept: ${profile.dept}\nLevel: ${profile.level}`;
  try{
  // Use the QRCode library to render to a temporary element, then convert to an inline data-URI image.
  const tmp = document.createElement('div');
  new QRCode(tmp,{text:data,width:180,height:180,colorDark:document.body.classList.contains('dark')?'#2d4a9e':'#1a2f6b',colorLight:document.body.classList.contains('dark')?'#141d40':'#ffffff',correctLevel:QRCode.CorrectLevel.M});
  // QRCode library may render a <canvas> or an <img> inside the container.
  const canvas = tmp.querySelector('canvas');
  if(canvas && canvas.toDataURL){
    const dataUrl = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = dataUrl;
    img.alt = 'QR code';
    el.appendChild(img);
  } else {
    const img = tmp.querySelector('img');
    if(img){
      // If the library already produced an <img>, clone it into the target (keeps it inline if it's a data URI).
      el.appendChild(img.cloneNode(true));
    } else {
      el.innerHTML='<p style="color:var(--txt3);font-size:.8rem">QR generation failed. Try reloading.</p>';
    }
  }
  }catch(e){el.innerHTML='<p style="color:var(--txt3);font-size:.8rem">QR generation failed. Try reloading.</p>';} 
}
function showQR(){showPage('profile')}
function regenerateQR(){generateQR();showToast('QR refreshed')}

// ═══════════════════════════════
//  CGPA CALCULATOR
// ═══════════════════════════════
const gradePoints={'A':5,'B':4,'C':3,'D':2,'E':1,'F':0};
const cgpaClasses=[
  {min:4.50,label:'First Class Honours 🥇'},
  {min:3.50,label:'Second Class Upper (2.1) 🥈'},
  {min:2.40,label:'Second Class Lower (2.2) 🥉'},
  {min:1.50,label:'Third Class 📋'},
  {min:0.00,label:'Pass / Below Graduation Standard ⚠️'}
];

function addCourseRow(code='',units='3',grade='A'){
  const uid = (typeof crypto!=='undefined' && crypto.randomUUID) ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2,8));
  const id = 'cr-' + uid;
  const codeId = id + '-code';
  const unitsId = id + '-units';
  const gradeId = id + '-grade';
  const row=document.createElement('div');row.className='course-row';row.id=id;
  row.innerHTML=`
    <input id="${codeId}" name="course_code[]" class="ci" type="text" placeholder="Course code" value="${escapeHtml(code)}">
    <input id="${unitsId}" name="course_units[]" class="cu" type="number" min="1" max="6" placeholder="Units" value="${escapeHtml(units)}">
    <select id="${gradeId}" name="course_grade[]" class="cg">
      ${['A','B','C','D','E','F'].map(g=>`<option ${g===grade?'selected':''}>${g}</option>`).join('')}
    </select>
    <button class="cdel" onclick="document.getElementById('${id}').remove()">✕</button>`;
  document.getElementById('courses-list').appendChild(row);
}

function calcCGPA(){
  const rows=document.querySelectorAll('#courses-list .course-row');
  if(rows.length===0){showToast('Add at least one course');return;}
  let totalPoints=0,totalUnits=0;
  rows.forEach(row=>{
    const units=parseFloat(row.querySelector('.cu').value)||0;
    const grade=row.querySelector('.cg').value;
    const pts=gradePoints[grade]??0;
    totalPoints+=pts*units;totalUnits+=units;
  });
  if(totalUnits===0){showToast('Enter valid credit units');return;}
  const gpa=(totalPoints/totalUnits).toFixed(2);
  const cls=cgpaClasses.find(c=>parseFloat(gpa)>=c.min)||cgpaClasses[cgpaClasses.length-1];
  document.getElementById('cgpa-val').textContent=gpa;
  document.getElementById('cgpa-class').textContent=cls.label;
  document.getElementById('cgpa-detail').textContent=`Total units: ${totalUnits} · Total points: ${totalPoints.toFixed(1)}`;
  document.getElementById('cgpa-result').style.display='block';
}

// ═══════════════════════════════
//  TIMETABLE
// ═══════════════════════════════
let timetable=JSON.parse(localStorage.getItem('lasu_tt')||'{}');
let currentDay='Mon';

function selectDay(day){
  currentDay=day;
  document.querySelectorAll('.ttd').forEach(d=>d.classList.remove('active'));
  document.getElementById('ttd-'+day).classList.add('active');
  renderTT();
}

function renderTT(){
  const list=document.getElementById('tt-list');
  const classes=(timetable[currentDay]||[]).sort((a,b)=>a.start.localeCompare(b.start));
  if(classes.length===0){list.innerHTML='<div class="tt-empty">No classes on '+currentDay+'. Enjoy the break! 🎉</div>';return;}
  list.innerHTML=classes.map((c,i)=>`
    <div class="tt-item">
      <div class="tt-left">
        <h4>${c.name}</h4>
        <div class="tt-meta">⏰ ${fmt(c.start)} – ${fmt(c.end)} &nbsp;|&nbsp; 📍 ${c.venue||'TBD'}</div>
      </div>
      <button class="tt-del" onclick="deleteClass('${currentDay}',${i})">✕</button>
    </div>`).join('');
}

function fmt(t){if(!t)return'—';const[h,m]=t.split(':');const hr=parseInt(h);return`${hr>12?hr-12:hr||12}:${m} ${hr>=12?'PM':'AM'}`;}

function openAddClass(){
  document.getElementById('addclass-modal').classList.add('open');
}

function addClass(){
  const name=document.getElementById('ac-name').value.trim();
  const day=document.getElementById('ac-day').value;
  const start=document.getElementById('ac-start').value;
  const end=document.getElementById('ac-end').value;
  const venue=document.getElementById('ac-venue').value.trim();
  if(!name||!start||!end){showToast('Fill in course name and times');return;}
  if(!timetable[day])timetable[day]=[];
  timetable[day].push({name,start,end,venue});
  localStorage.setItem('lasu_tt',JSON.stringify(timetable));
  closeModalById('addclass-modal');
  selectDay(day);
  showToast('✅ Class added for '+day);
  // Clear inputs
  ['ac-name','ac-start','ac-end','ac-venue'].forEach(id=>document.getElementById(id).value='');
  scheduleClassNotif({name,start,day});
}

function deleteClass(day,idx){
  timetable[day].splice(idx,1);
  localStorage.setItem('lasu_tt',JSON.stringify(timetable));
  renderTT();showToast('Class removed');
}

// ═══════════════════════════════
//  COURSE ADVISOR
// ═══════════════════════════════
function runAdvisor(){
  const level=parseInt(document.getElementById('ca-level').value);
  const credits=parseInt(document.getElementById('ca-credits').value)||0;
  const cgpa=parseFloat(document.getElementById('ca-cgpa-val').value)||0;
  const carryover=parseInt(document.getElementById('ca-carryover').value)||0;
  const probation=document.getElementById('ca-probation').value==='yes';
  const blocks=[];

  // Credit load check
  if(credits<15) blocks.push({type:'danger',title:'⚠️ Under-Loading',msg:'You are registering fewer than 15 credit units. LASU minimum is 15. You may face registration issues — consult your HOD.'});
  else if(credits>30) blocks.push({type:'danger',title:'🚫 Credit Overload',msg:`${credits} units exceeds the maximum of 30. Only approved exceptions (Dean's letter) allow above 24. Reduce your course load.`});
  else if(credits>24) blocks.push({type:'warn',title:'⚡ High Credit Load (Dean\'s Approval Required)',msg:`${credits} units is above the standard 24-unit limit. You need a signed approval from your Dean's office to proceed.`});
  else blocks.push({type:'ok',title:'✅ Credit Load: Good',msg:`${credits} units is within the normal 15–24 range.`});

  // CGPA advice
  if(cgpa>=4.50) blocks.push({type:'ok',title:'🥇 CGPA: First Class Territory',msg:`Your ${cgpa} GPA puts you in First Class range. Maintain consistency and avoid carry-overs at all cost.`});
  else if(cgpa>=3.50) blocks.push({type:'ok',title:'🥈 CGPA: 2nd Class Upper',msg:`${cgpa} is solid 2.1 territory. Keep pushing — First Class is achievable.`});
  else if(cgpa>=2.40) blocks.push({type:'warn',title:'🥉 CGPA: 2nd Class Lower',msg:`${cgpa} GPA. You are in 2.2 range. Focus on strong scores in remaining courses to move up.`});
  else if(cgpa>=1.50) blocks.push({type:'warn',title:'📋 CGPA: Third Class',msg:`${cgpa} is in Third Class range. Prioritise improving core courses and seek your academic advisor's guidance.`});
  else if(cgpa>0) blocks.push({type:'danger',title:'🚨 CGPA: Below Graduation Standard',msg:`${cgpa} is below the 1.50 minimum for graduation. Urgent action needed — see your HOD immediately.`});

  // Carry-over
  if(carryover>0){
    const warn=carryover>3?'danger':'warn';
    blocks.push({type:warn,title:`📚 ${carryover} Carry-Over Course(s)`,msg:carryover>3?`${carryover} carry-overs is a heavy load. Consider reducing new course registrations to focus on clearing them. Contact your Faculty Officer.`:`Manageable. Ensure carry-over courses are included in this semester's registration and show up on your form.`});
  }else blocks.push({type:'ok',title:'✅ No Carry-Overs',msg:'No pending carry-over courses. Great academic standing!'});

  // Probation
  if(probation) blocks.push({type:'danger',title:'🚨 Academic Probation',msg:'You are on probation. Maximum allowed credit units is typically 15. Focus on improving CGPA above 1.50 to come off probation. Meet with your Faculty Officer this week.'});

  // 400 level
  if(level===400&&carryover===0&&cgpa>=1.50) blocks.push({type:'ok',title:'🎓 Final Year: On Track',msg:'You appear on track for graduation. Ensure your project, SIWES/IT, and all required courses are registered. Visit the Exams & Records office to confirm your clearance status.'});

  const html=blocks.map(b=>`<div class="ca-block ${b.type==='ok'?'':b.type}"><h4>${b.title}</h4><p>${b.msg}</p></div>`).join('');
  document.getElementById('ca-result').innerHTML=html;
  document.getElementById('ca-result').style.display='block';
}

// ═══════════════════════════════
//  NOTIFICATIONS
// ═══════════════════════════════
async function requestNotifPermission(){
  if(!('Notification' in window)){showToast('Browser does not support notifications');return;}
  const p=await Notification.requestPermission();
  const btn=document.getElementById('notif-req-btn');
  const st=document.getElementById('notif-status');
  if(p==='granted'){
    btn.textContent='✅ Notifications Enabled';
    btn.style.background='var(--green2)';
    st.textContent='You will receive class reminders and campus alerts.';
    if(window.requestFirebaseNotifications){ await window.requestFirebaseNotifications(); }
    showToast('🔔 Notifications enabled!');
  }else{
    st.textContent='Permission denied. You can re-enable in your browser settings.';
    showToast('Notifications blocked — check browser settings');
  }
}

function scheduleLocalNotif(title,body,delayMs){
  if(Notification.permission==='granted'){
    setTimeout(()=>{try{new Notification(title,{body,icon:'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="%230a5c2f"/></svg>'});}catch(e){}},delayMs);
  }
}

function scheduleClassNotif(cls){
  if(!document.getElementById('tog-class').checked)return;
  if(Notification.permission!=='granted')return;
  const now=new Date();
  const[h,m]=cls.start.split(':');
  const classTime=new Date(now);
  classTime.setHours(parseInt(h),parseInt(m),0,0);
  const remind=new Date(classTime.getTime()-15*60*1000);
  const diff=remind.getTime()-now.getTime();
  if(diff>0) scheduleLocalNotif(`Class in 15 mins: ${cls.name}`,`Starting at ${fmt(cls.start)}`,diff);
}

function sendTestNotif(){
  if(Notification.permission==='granted'){
    scheduleLocalNotif('LASU Navigator Test','Notifications are working correctly! 🎉',500);
    showToast('Test notification sent!');
  }else{
    requestNotifPermission();
  }
}

function saveNotifSettings(){
  const s={class:document.getElementById('tog-class').checked,exam:document.getElementById('tog-exam').checked,news:document.getElementById('tog-news').checked};
  localStorage.setItem('lasu_notif',JSON.stringify(s));
}

// ═══════════════════════════════
//  SERVICE WORKER (offline)
// ═══════════════════════════════
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/sw.js').catch(()=>{});
  navigator.serviceWorker.register('/firebase-messaging-sw.js').catch(()=>{});
}

// ═══════════════════════════════
//  FIREBASE SCAFFOLD
// ═══════════════════════════════
// Minimal Firebase integration (dynamic loader + helpers)
// How to use:
// 1. Create a Firebase project and obtain the web config (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId)
// 2. Call `enableFirebase(FIREBASE_CONFIG)` early (e.g., after user signs in or on init)
// 3. Use `syncToFirebase(profile)` and `loadFromFirebase(matric)` to sync data

let _firebaseEnabled = false;
let _firebaseDb = null;
let _firebaseStorage = null;
let _firebaseAuth = null;
let _firebaseUser = null;

// Firebase web config (fill with your project's values)
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyB3e9pejY7EkDO8i5cZ7HX5KUmLGpBWdz8",
  authDomain: "lasu-navigator.firebaseapp.com",
  projectId: "lasu-navigator",
  storageBucket: "lasu-navigator.firebasestorage.app",
  messagingSenderId: "128402428847",
  appId: "1:128402428847:web:eeee2966c791121829155a",
  measurementId: "G-J0R6H1LBK4"
};

function _loadScript(src){
  return new Promise((res, rej)=>{
    const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);
  });
}

async function enableFirebase(config){
  if(_firebaseEnabled) return true;
  if(!config || !config.apiKey){
    console.warn('Firebase config missing - skipping init');
    return false;
  }
  // Load compat libraries so this file can remain non-module
  try{
    await _loadScript('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
    await _loadScript('https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js');
    await _loadScript('https://www.gstatic.com/firebasejs/9.22.1/firebase-storage-compat.js');
    await _loadScript('https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js');
  }catch(e){
    console.error('Failed to load Firebase SDKs',e);return false;
  }
  try{
    firebase.initializeApp(config);
    _firebaseDb = firebase.firestore();
    _firebaseStorage = firebase.storage();
    _firebaseAuth = firebase.auth();
    // Monitor auth state
    _firebaseAuth.onAuthStateChanged(user=>{
      _firebaseUser = user || null;
      // update UI
      const btn = document.getElementById('cloud-btn');
      if(btn){
        btn.disabled = false;
        if(_firebaseUser){
          btn.textContent = `☁️ ${_firebaseUser.displayName||'Cloud'}`;
          btn.setAttribute('aria-pressed','true');
          btn.title = 'Cloud Sync (signed in)';
        } else {
          btn.textContent = '☁️';
          btn.setAttribute('aria-pressed','false');
          btn.title = 'Cloud Sync (not signed in)';
        }
      }
    });
    _firebaseEnabled = true;
    showToast('☁️ Firebase enabled');
    return true;
  }catch(e){console.error('Firebase init error',e);return false}
}

async function syncToFirebase(profileObj){
  if(!_firebaseEnabled || !_firebaseDb) return false;
  if(!profileObj) return false;
  try{
    if(_firebaseUser && _firebaseUser.uid){
      // Save under authenticated user's doc
      await _firebaseDb.collection('users').doc(_firebaseUser.uid).set({profile:profileObj}, {merge:true});
    } else if(profileObj.matric){
      await _firebaseDb.collection('students').doc(profileObj.matric).set(profileObj, {merge:true});
    } else {
      return false;
    }
    showToast('☁️ Profile synced');
    return true;
  }catch(e){console.error('syncToFirebase failed',e);showToast('Sync failed');return false}
}

async function loadFromFirebase(matric){
  if(!_firebaseEnabled || !_firebaseDb) return null;
  try{
    if(_firebaseUser && _firebaseUser.uid){
      const doc = await _firebaseDb.collection('users').doc(_firebaseUser.uid).get();
      if(doc.exists && doc.data().profile){ profile = doc.data().profile; renderProfile(); showToast('☁️ Profile loaded'); return profile; }
      return null;
    } else {
      const doc = await _firebaseDb.collection('students').doc(matric).get();
      if(doc.exists){ profile = doc.data(); renderProfile(); showToast('☁️ Profile loaded'); return profile; }
      return null;
    }
  }catch(e){console.error('loadFromFirebase failed',e);return null}
}

async function uploadProfilePhoto(file, matric){
  if(!_firebaseEnabled || !_firebaseStorage) return null;
  if(!file || !matric) return null;
  try{
    const key = _firebaseUser && _firebaseUser.uid ? _firebaseUser.uid : matric;
    const ref = _firebaseStorage.ref().child(`profiles/${key}/${Date.now()}_${file.name}`);
    const snap = await ref.put(file);
    const url = await snap.ref.getDownloadURL();
    return url;
  }catch(e){console.error('uploadProfilePhoto failed',e);return null}
}

// Authentication helpers
async function signInWithGoogle(){
  if(!_firebaseEnabled) await enableFirebase(FIREBASE_CONFIG);
  if(!_firebaseAuth) return false;
  try{
    const provider = new firebase.auth.GoogleAuthProvider();
    await _firebaseAuth.signInWithPopup(provider);
    showToast('🔐 Signed in');
    return true;
  }catch(e){console.error('signIn failed',e);showToast('Sign-in failed');return false}
}

async function signOutFirebase(){
  if(!_firebaseAuth) return;
  try{ await _firebaseAuth.signOut(); showToast('🔓 Signed out'); }catch(e){console.error(e)}
}

// UI handler for cloud button
function handleCloudBtn(){
  const btn = document.getElementById('cloud-btn');
  console.log('Cloud button clicked', {enabled:_firebaseEnabled, user:_firebaseUser});
  // Ensure Firebase SDKs are loaded when user wants cloud
  if(!_firebaseEnabled){
    enableFirebase(FIREBASE_CONFIG).then(ok=>{
      if(ok){
        // show modal to let user choose sign-in method
        showAuthModal();
      } else {
        showToast('Unable to init cloud sync');
      }
    }).catch(e=>{console.error('enableFirebase failed',e);showToast('Unable to init cloud sync')});
    return;
  }
  // If enabled but not signed in, show modal
  if(!_firebaseUser){ showAuthModal(); return; }
  // If signed in, sign out
  signOutFirebase();
}

function showAuthModal(){
  const m = document.getElementById('auth-modal'); if(!m) return; m.classList.add('open');
}
function closeAuthModal(){ const m=document.getElementById('auth-modal'); if(!m) return; m.classList.remove('open'); }

async function signInWithEmail(){
  const email = (document.getElementById('auth-email')||{}).value||'';
  const pass = (document.getElementById('auth-pass')||{}).value||'';
  if(!email||!pass){ showToast('Enter email and password'); return; }
  try{
    if(!_firebaseEnabled) await enableFirebase(FIREBASE_CONFIG);
    await _firebaseAuth.signInWithEmailAndPassword(email,pass);
    showToast('🔐 Signed in');
    closeAuthModal();
  }catch(e){ console.error('Email sign-in failed',e); showToast('Sign-in failed'); }
}

async function signUpWithEmail(){
  const email = (document.getElementById('auth-email')||{}).value||'';
  const pass = (document.getElementById('auth-pass')||{}).value||'';
  if(!email||!pass){ showToast('Enter email and password'); return; }
  try{
    if(!_firebaseEnabled) await enableFirebase(FIREBASE_CONFIG);
    const res = await _firebaseAuth.createUserWithEmailAndPassword(email,pass);
    // Optionally set displayName from profile
    if(profile && profile.name){ await res.user.updateProfile({displayName: profile.name}); }
    showToast('✅ Account created');
    closeAuthModal();
  }catch(e){ console.error('Sign-up failed',e); showToast('Sign-up failed'); }
}

async function resetPassword(){
  const email = (document.getElementById('auth-email')||{}).value||'';
  if(!email){ showToast('Enter email to reset'); return; }
  try{ await _firebaseAuth.sendPasswordResetEmail(email); showToast('Reset email sent'); }
  catch(e){ console.error('Reset failed',e); showToast('Reset failed'); }
}

// Wire saveProfile to optionally sync when Firebase is enabled
const _origSaveProfile = saveProfile;
saveProfile = function(){
  // call original implementation to save to localStorage
  _origSaveProfile();
  // If firebase is enabled and profile now exists, try sync (+ upload photo if present)
  (async ()=>{
    if(!_firebaseEnabled) return;
    if(!profile) return;
    // If profile.photo is a File object (from file input) upload it
    const fi=document.getElementById('photo-input');
    if(fi && fi.files && fi.files[0]){
      const url = await uploadProfilePhoto(fi.files[0], profile.matric);
      if(url){ profile.photo = url; localStorage.setItem('lasu_profile', JSON.stringify(profile)); renderProfile(); }
    }
    await syncToFirebase(profile);
  })();
}

// ═══════════════════════════════
//  INIT
// ═══════════════════════════════
window.onload=()=>{
  if(localStorage.getItem('lasu_theme')==='dark') document.body.classList.add('dark');

  // Load profile
  profile=JSON.parse(localStorage.getItem('lasu_profile')||'null');
  renderProfile();

  // Init timetable
  timetable=JSON.parse(localStorage.getItem('lasu_tt')||'{}');
  renderTT();

  // Load notif settings
  const ns=JSON.parse(localStorage.getItem('lasu_notif')||'null');
  if(ns){
    document.getElementById('tog-class').checked=ns.class??true;
    document.getElementById('tog-exam').checked=ns.exam??true;

    document.getElementById('tog-news').checked=ns.news??false;
  }

  // Check notification state
  if('Notification' in window && Notification.permission==='granted'){
    const btn=document.getElementById('notif-req-btn');
    btn.textContent='✅ Notifications Enabled';btn.style.background='var(--green2)';
  }

  // Add sample CGPA rows
  ['CSC 421','CSC 413','CSC 419'].forEach((c,i)=>addCourseRow(c,'3',['A','B','A'][i]));

  // Offline check
  if(!navigator.onLine) document.getElementById('offline-banner').classList.add('show');

  // Cloud sync button: reflect signed-in state
  const cloudBtn = document.getElementById('cloud-btn');
  if(cloudBtn){
    cloudBtn.textContent = _firebaseUser ? `☁️ ${_firebaseUser.displayName||'Cloud'}` : '☁️';
  }
};
