const LINES = [
  {id:'L-01',name:'Final Assembly A',status:'green',output:412,target:440,oee:94,yield:97,downtime:'7m',takt:55,cycle:52},
  {id:'L-02',name:'Final Assembly B',status:'green',output:387,target:400,oee:91,yield:99,downtime:'12m',takt:55,cycle:54},
  {id:'L-03',name:'Weld & Join',status:'red',output:298,target:380,oee:67,yield:84,downtime:'48m',takt:42,cycle:61},
  {id:'L-04',name:'Sub-Assembly C',status:'green',output:444,target:450,oee:93,yield:98,downtime:'9m',takt:50,cycle:49},
  {id:'L-05',name:'Paint & Finish',status:'amber',output:320,target:360,oee:78,yield:91,downtime:'28m',takt:60,cycle:68},
  {id:'L-06',name:'Electrical Fit',status:'green',output:401,target:420,oee:89,yield:96,downtime:'14m',takt:48,cycle:46},
  {id:'L-07',name:'Press & Form',status:'red',output:210,target:350,oee:55,yield:79,downtime:'72m',takt:38,cycle:71},
  {id:'L-08',name:'Machining A',status:'green',output:368,target:380,oee:90,yield:97,downtime:'11m',takt:44,cycle:43},
  {id:'L-09',name:'Packaging',status:'amber',output:305,target:360,oee:75,yield:88,downtime:'24m',takt:36,cycle:42},
  {id:'L-10',name:'QA & Test',status:'green',output:430,target:440,oee:92,yield:98,downtime:'8m',takt:52,cycle:50},
];
const STATIONS = [
  {name:'Material Intake',type:'INTAKE',units:308,pass:307,cycle:'28.3s',defects:1},
  {name:'CNC Machining',type:'MACHINE',units:299,pass:296,cycle:'42.1s',defects:3},
  {name:'Press Forming',type:'PRESS',units:290,pass:289,cycle:'18.7s',defects:2},
  {name:'Deburring',type:'FINISH',units:287,pass:287,cycle:'12.4s',defects:0},
  {name:'Sub-Assembly I',type:'ASSEMBLY',units:283,pass:282,cycle:'55.2s',defects:2},
  {name:'Sub-Assembly II',type:'ASSEMBLY',units:280,pass:279,cycle:'61.8s',defects:1},
  {name:'Welding',type:'WELD',units:275,pass:271,cycle:'34.5s',defects:7},
  {name:'Heat Treatment',type:'THERMAL',units:270,pass:270,cycle:'180s',defects:0},
  {name:'Painting',type:'PAINT',units:267,pass:263,cycle:'48.0s',defects:5},
  {name:'Electrical Install',type:'ELEC',units:262,pass:261,cycle:'72.3s',defects:1},
  {name:'Final Assembly',type:'ASSEMBLY',units:259,pass:258,cycle:'88.5s',defects:1},
  {name:'QA Inspection',type:'QA',units:257,pass:257,cycle:'24.1s',defects:0},
];
const DEFECT_LOG = [
  {time:'14:18',line:'L-07',station:'ST-03',serial:'SN-00821',batch:'BATCH-44B',cat:'Dimensional',sev:'CRITICAL',op:'OP-214',status:'Open'},
  {time:'13:55',line:'L-03',station:'ST-07',serial:'SN-00694',batch:'BATCH-43A',cat:'Weld',sev:'CRITICAL',op:'OP-208',status:'In Review'},
  {time:'13:42',line:'L-05',station:'ST-09',serial:'SN-00712',batch:'BATCH-43C',cat:'Paint',sev:'WARNING',op:'OP-219',status:'Open'},
  {time:'13:11',line:'L-03',station:'ST-07',serial:'SN-00688',batch:'BATCH-43A',cat:'Weld',sev:'HIGH',op:'OP-208',status:'Rework'},
  {time:'12:48',line:'L-07',station:'ST-03',serial:'SN-00801',batch:'BATCH-44B',cat:'Dimensional',sev:'HIGH',op:'OP-214',status:'Scrap'},
  {time:'12:30',line:'L-03',station:'ST-06',serial:'SN-00675',batch:'BATCH-43A',cat:'Weld',sev:'MEDIUM',op:'OP-207',status:'Closed'},
  {time:'12:15',line:'L-01',station:'ST-11',serial:'SN-00641',batch:'BATCH-42A',cat:'Assembly',sev:'LOW',op:'OP-201',status:'Closed'},
  {time:'11:52',line:'L-05',station:'ST-09',serial:'SN-00698',batch:'BATCH-43C',cat:'Paint',sev:'MEDIUM',op:'OP-219',status:'Rework'},
];
const ASSETS = [
  {name:'L-07 Hydraulic Press #3',line:'L-07',health:23,mtbf:18,mttr:4.2,status:'red',risk:'<2h',type:'RED'},
  {name:'L-03 Weld Station #7',line:'L-03',health:48,mtbf:42,mttr:3.1,status:'amber',risk:'<8h',type:'AMBER'},
  {name:'L-05 Paint Oven #2',line:'L-05',health:61,mtbf:68,mttr:2.4,status:'amber',risk:'<24h',type:'AMBER'},
  {name:'L-01 Assembly Robot #2',line:'L-01',health:79,mtbf:112,mttr:1.8,status:'green',risk:'>48h',type:'GREEN'},
  {name:'L-06 Test Bench #1',line:'L-06',health:82,mtbf:128,mttr:1.2,status:'green',risk:'>72h',type:'GREEN'},
];
const MAINT_EVENTS = [
  {time:'13:58',type:'EMERGENCY',asset:'L-07 Hydraulic Press #3',desc:'Emergency shutdown — pressure sensor failure',status:'OPEN',dur:'Ongoing',color:'red'},
  {time:'12:30',type:'CORRECTIVE',asset:'L-03 Weld Station #7',desc:'Weld tip replacement after temp exceedance',status:'IN PROGRESS',dur:'45m',color:'amber'},
  {time:'10:00',type:'PLANNED',asset:'L-08 CNC #2',desc:'Scheduled PM — lubrication & calibration',status:'COMPLETED',dur:'62m',color:'green'},
  {time:'09:15',type:'PLANNED',asset:'L-04 Press #1',desc:'Bearing inspection — PM compliance',status:'COMPLETED',dur:'38m',color:'green'},
  {time:'UPCOMING',type:'PLANNED',asset:'L-05 Paint Oven #2',desc:'Temperature sensor calibration — overdue 2 days',status:'SCHEDULED',dur:'30m est.',color:'blue'},
  {time:'UPCOMING',type:'PLANNED',asset:'L-10 Test Bench #3',desc:'Quarterly calibration verification',status:'SCHEDULED',dur:'60m est.',color:'blue'},
];
const KPI_SUMMARY = [
  {name:'Overall OEE',actual:'82%',target:'85%',delta:'-3%',status:'amber'},
  {name:'First Pass Yield',actual:'94.3%',target:'95%',delta:'-0.7%',status:'amber'},
  {name:'Safety — Days Clean',actual:'14',target:'30',delta:'On track',status:'green'},
  {name:'Customer OTIF',actual:'96.4%',target:'98%',delta:'-1.6%',status:'amber'},
  {name:'PM Compliance',actual:'87%',target:'95%',delta:'-8%',status:'red'},
  {name:'Energy kWh/unit',actual:'2.84',target:'2.60',delta:'+0.24',status:'amber'},
  {name:'Scrap Rate',actual:'0.55%',target:'<0.5%',delta:'+0.05%',status:'amber'},
  {name:'Labor Productivity',actual:'94 u/h',target:'100 u/h',delta:'-6',status:'amber'},
];

const plantState = {
  lines: [],
  assets: [],
  alerts: [],
  defectLog: [],
  maintEvents: [],
  throughput: {today: [350,370,420,400,440,430,450,438],yesterday:[310,340,380,370,400,390,420,410],week:[330,340,360,370,390,410,430,440],month:[320,330,340,360,380,400,420,430]},
  throughputLabels:['08h','09h','10h','11h','12h','13h','14h','15h'],
  currentThroughputView:'today',
  shiftBars:[3650,3820,3710,3841],
  fpyTrend:[93,94,95,94,95,96,94,95,95,96,95,94,95,94],
  fatigue:[1,2,1,3,2,4,6,5],
  downtime:{micro:[24,18,22,30,28,20,25],unplanned:[80,62,38,55,70,45,38],planned:[45,38,50,42,35,55,48]},
  energy:[2.9,3.1,2.7,2.8,3.4,2.6,4.1,2.7,3.2,2.8],
  defectBreakdown:[{label:'Dimensional',n:8,c:'#ef4444'},{label:'Weld',n:6,c:'#f59e0b'},{label:'Paint',n:5,c:'#2563eb'},{label:'Assembly',n:3,c:'#6366f1'},{label:'Other',n:2,c:'#a8a8b8'}],
  kpiSummary: KPI_SUMMARY.map(item => ({...item})),
  sparks: {
    spk1: [350,370,420,400,440,430,450,438],
    spk2: [95,94,96,93,95,94,95,96],
    spk3: [24,26,25,24,23,22,24,25],
    spk4: [42,43,42,41,42,43,42,41],
  },
  scheduledReports:[
    {name:'Daily OEE Report',freq:'Daily 18:00',last:'17 Mar 14:32',rcpts:'sarah.m@apex.com, cto@apex.com',fmt:'PDF+XLSX'},
    {name:'Shift Quality Summary',freq:'Per shift',last:'Today 06:00',rcpts:'qa-team@apex.com',fmt:'PDF'},
    {name:'Weekly Maintenance',freq:'Mon 08:00',last:'11 Mar 08:02',rcpts:'maintenance@apex.com',fmt:'XLSX'},
    {name:'Monthly P&L Ops',freq:'1st of month',last:'1 Mar 09:00',rcpts:'management@apex.com',fmt:'PDF'},
  ],
  overview: {},
  safetyDays: 14,
  safetyNearMisses: 2,
  safetyAlertsOpen: 1,
  safetyRiskZone: 'L-07',
  bannerState: {goodLines: 6, warningLines:2, criticalLines:2, safetyDays:14, assetsAtRisk:3},
  traceCounter: 8214,
  tick: 0,
  refs: {
    overviewLines: null,
    lineCards: [],
    lineTableRows: [],
    bottlenecks: [],
    alertItems: [],
    defectRows: [],
    assetRiskNodes: [],
    maintTimelineNodes: [],
  }
};

function clamp(value,min,max){return value<min?min:value>max?max:value;}
function round1(value){return Math.round(value*10)/10;}
function formatMetric(value){if(value===undefined||value===null||Number.isNaN(value))return '—';return Number.isInteger(value)?String(value):String(Number(value).toFixed(1));}
function nextThroughputLabel(){
  const last = plantState.throughputLabels[plantState.throughputLabels.length-1] || '15h';
  const num = Number(last.replace('h',''));
  const next = (isNaN(num)?16:((num+1)%24));
  return `${String(next).padStart(2,'0')}h`;
}
function nowIso(){return new Date().toLocaleString('en-US',{weekday:'short',day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:false}).toUpperCase();}

function animateValue(el, from, to, duration = 300, format = (v) => String(v)) {
  if(!el) return;
  const start = Date.now();
  const animate = () => {
    const elapsed = Math.min(Date.now() - start, duration);
    const progress = elapsed / duration;
    const value = from + (to - from) * progress;
    el.textContent = format(value);
    if(elapsed < duration) requestAnimationFrame(animate);
  };
  animate();
}

function applyKPIGlow(el, colorVar) {
  if(!el) return;

  const color = colorVar || 'var(--blue)';
  const startShadow = `0 0 0 0 rgba(37,99,235,0.0)`;
  const glowShadow = `0 0 0 2px rgba(37,99,235,0.18), 0 0 14px 2px rgba(37,99,235,0.25)`;

  // Use inline styles so we don't depend on CSS class names.
  el.style.transition = 'box-shadow 420ms ease-out, transform 420ms ease-out, filter 420ms ease-out';
  el.style.boxShadow = startShadow;
  el.style.transform = 'translateY(0px)';
  el.style.filter = 'brightness(1)';

  // force reflow
  void el.offsetHeight;

  el.style.boxShadow = glowShadow;
  el.style.transform = 'translateY(-1px)';
  el.style.filter = 'brightness(1.04)';

  setTimeout(() => {
    el.style.boxShadow = 'none';
    el.style.transform = 'translateY(0px)';
    el.style.filter = 'none';
  }, 430);
}

function updateValueWithAnimation(el, newValue, formatter = formatMetric, deltaMeta) {
  if(!el) return;
  const currentText = el.textContent;
  const currentNum = parseFloat(currentText);
  const newNum = parseFloat(String(newValue));

  const shouldAnimateNumber = !isNaN(currentNum) && !isNaN(newNum) && currentNum !== newNum;
  const shouldSetText = !shouldAnimateNumber && currentText !== String(newValue);

  // KPI pulse on change (no aggressive animation)
  if(shouldAnimateNumber) {
    animateValue(el, currentNum, newNum, 320, formatter);
    const pulse = deltaMeta || {};
    const color = pulse.colorVar || 'var(--blue)';
    applyKPIGlow(el, color);
  } else if(shouldSetText) {
    el.textContent = formatter(newValue);
    const pulse = deltaMeta || {};
    const color = pulse.colorVar || 'var(--blue)';
    applyKPIGlow(el, color);
  }
}

function derivePlantOverview(){
  const lines = plantState.lines;
  const totalOutput = lines.reduce((acc,l)=>acc+l.output,0);
  const totalTarget = lines.reduce((acc,l)=>acc+l.target,0);
  const avgOee = round1(lines.reduce((acc,l)=>acc+l.oee,0)/lines.length);
  const avgYield = round1(lines.reduce((acc,l)=>acc+l.yield,0)/lines.length);
  const avgCycle = round1(lines.reduce((acc,l)=>acc+l.cycle,0)/lines.length);
  const totalDefects = lines.reduce((acc,l)=>acc+l.defects,0);
  const downtimeSum = lines.reduce((acc,l)=>acc+l.downtimeMinutes,0);
  const availability = clamp(round1(93 - downtimeSum/20), 72, 96);
  const performance = clamp(round1(80 + ((totalOutput/totalTarget*100)-80)/2), 68, 90);
  const quality = clamp(round1(avgYield), 90, 98);
  const oee = clamp(round1((availability * performance * quality) / 10000), 70, 96);
  const energyIntensity = clamp(round1(2.6 + ((100 - quality) / 60) + ((100 - performance) / 150)), 2.4, 4.4);
  plantState.overview = {
    unitsProduced: totalOutput,
    unitsTarget: totalTarget,
    totalDefects,
    firstPassYield: avgYield,
    avgCycleTime: avgCycle,
    oee,
    availability,
    performance,
    quality,
    cycleTarget: 42,
    otif: 96.4,
    energyIntensity,
    updatedAt: new Date().toISOString(),
  };
}

function initializePlantState(){
  plantState.lines = LINES.map(line => ({
    ...line,
    output: line.output,
    actualOutput: line.output,
    defects: Math.max(0, Math.round((100 - line.yield) * 0.06)),
    downtimeMinutes: Math.max(0, Number(String(line.downtime).replace('m','')) || 0),
    microStops: Math.max(0, Math.round((Number(String(line.downtime).replace('m','')) || 0) * 0.4)),
    incidentCount: 0,
  }));
  plantState.assets = ASSETS.map(asset => ({...asset}));
  plantState.alerts = [
    {location:'L-07 - ST-03',title:'L-07 - Hydraulic Pressure Drop',issue:'Hydraulic pressure drop',detail:'SN-00821 - BATCH-44B - Station 03',operator:'OP-214',serial:'SN-00821',batch:'BATCH-44B',severity:'CRITICAL',status:'red',time:'2m'},
    {location:'L-03 - ST-07',title:'L-03 - Weld Temp Exceeded',issue:'Weld temp exceeded UCL +12C',detail:'SN-00694 - BATCH-43A - Station 07',operator:'OP-208',serial:'SN-00694',batch:'BATCH-43A',severity:'CRITICAL',status:'red',time:'18m'},
    {location:'L-05 - ST-09',title:'L-05 - Paint Color Deviation',issue:'Paint color deviation Delta=4.2',detail:'SN-00712 - BATCH-43C - Station 09',operator:'OP-219',serial:'SN-00712',batch:'BATCH-43C',severity:'WARNING',status:'amber',time:'41m'},
  ];
  plantState.defectLog = DEFECT_LOG.map(item => ({...item}));
  plantState.maintEvents = MAINT_EVENTS.map(item => ({...item}));
  plantState.bottlenecks = [
    {l:'L-07 Press',m:72,c:'var(--red)'},
    {l:'L-03 Weld',m:48,c:'var(--red)'},
    {l:'L-05 Paint',m:28,c:'var(--amber)'},
    {l:'L-09 Pack',m:24,c:'var(--amber)'},
    {l:'L-01 Assm',m:7,c:'var(--green)'},
  ];
  plantState.defectBreakdown = [{label:'Dimensional',n:8,c:'#ef4444'},{label:'Weld',n:6,c:'#f59e0b'},{label:'Paint',n:5,c:'#2563eb'},{label:'Assembly',n:3,c:'#6366f1'},{label:'Other',n:2,c:'#a8a8b8'}];
  plantState.kpiSummary = KPI_SUMMARY.map(item => ({...item}));
  derivePlantOverview();

  // cache for KPI delta pulses
  plantState.prevKPIs = {
    unitsProduced: plantState.overview.unitsProduced,
    totalDefects: plantState.overview.totalDefects,
    firstPassYield: plantState.overview.firstPassYield,
    oee: plantState.overview.oee,
    availability: plantState.overview.availability,
    performance: plantState.overview.performance,
    quality: plantState.overview.quality,
    avgCycleTime: plantState.overview.avgCycleTime,
  };
}

let isFetchingTelemetry = false;

// ═══════════════ REAL-TIME DATE/TIME UPDATER ═══════════════
function updateBannerTimestamp() {
  const bannerDateTimeEl = document.getElementById('bannerDateTime');
  if (!bannerDateTimeEl) return;

  const now = new Date();
  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: undefined,
    hour12: false,
  };

  const parts = now.toLocaleString('en-US', options).split(' ');
  const dayOfWeek = parts[0]; // Mon
  const day = parts[1]; // 12
  const month = parts[2]; // May
  const year = parts[3]; // 2026
  const timeStr = parts[4]; // 13:46

  bannerDateTimeEl.textContent =
    `${dayOfWeek.toUpperCase()} ${day} ${month.toUpperCase()} ${year} - ${timeStr} IST - PLANT 4 - PUNE NORTH - CUSTOMER OTIF: 96.4%`;
}

// Backward-compatible alias (keeps any existing calls working)
function updateBannerDateTime() {
  updateBannerTimestamp();
}

// ═══════════════ CONTINUOUS TELEMETRY EVOLUTION ═══════════════
function evolveTelemetryRealistic() {
  // Evolve KPI values continuously with realistic, non-chaotic industrial progression
  const ov = plantState.overview;

  // Ensure plantState.tick exists
  plantState.tick = (plantState.tick ?? 0) + 1;

  // Units Produced: MUST increase visibly every 1–2s
  // Deterministic-ish progression: +2..+12 per tick
  const incBucket = [2,3,4,5,6,7,8,9,10,11,12];
  const unitsInc = incBucket[plantState.tick % incBucket.length];
  ov.unitsProduced = Math.max(0, ov.unitsProduced + unitsInc);

  // Avg Cycle Time: fluctuate continuously ±0.1..±0.5 sec (smooth)
  const c = Math.sin(plantState.tick / 3.5) * 0.35 + Math.cos(plantState.tick / 7) * 0.18;
  const step = clamp(round1(c * 0.5), -0.5, 0.5);
  ov.avgCycleTime = clamp(round1(ov.avgCycleTime + step), 40, 55);

  // Defects: occasionally increase every ~10–25 seconds (tick-based)
  // (tick is ~1s cadence from interval)
  if (plantState.tick % (10 + (plantState.tick % 15)) === 0) {
    ov.totalDefects = Math.max(0, ov.totalDefects + 1);
  }

  // OEE / Availability / Performance / Quality: small continuous drift
  ov.oee = clamp(round1(ov.oee + (Math.sin(plantState.tick / 4.2) * 0.18)), 75, 88);
  ov.availability = clamp(round1(ov.availability + (Math.cos(plantState.tick / 6.1) * 0.12)), 85, 96);
  ov.performance = clamp(round1(ov.performance + (Math.sin(plantState.tick / 5.3) * 0.14)), 82, 92);
  ov.quality = clamp(round1(ov.quality + (Math.cos(plantState.tick / 8.2) * 0.08)), 92, 98);

  // FPY derived from quality/yield drift (keep realistic linkage)
  // Small drift; defects occasionally reduce it
  const fpyDrift = (Math.sin(plantState.tick / 9.0) * 0.06) + (ov.totalDefects % 3 === 0 ? -0.08 : 0.04);
  ov.firstPassYield = clamp(round1(ov.firstPassYield + fpyDrift), 90, 99);

  // Update line outputs and derived stats smoothly
  plantState.lines.forEach((line, i) => {
    const base = line.status === 'green' ? 1.6 : line.status === 'amber' ? 1.1 : 0.7;
    const jitter = (Math.sin((plantState.tick + i * 3) / 4.2) * 0.9);
    const delta = Math.round(clamp(base + jitter, 0, 3));
    const cap = Math.round(line.target * (1.12 - (line.status === 'red' ? 0.06 : line.status === 'amber' ? 0.03 : 0)));
    line.output = Math.min(Math.round(line.output + delta), cap);

    line.oee = clamp(round1(line.oee + (Math.sin((plantState.tick + i) / 5.6) * 0.18)), 55, 98);
    line.yield = clamp(round1(line.yield + (Math.cos((plantState.tick + i) / 6.4) * 0.12)), 70, 99);

    // If total defects increased, occasionally increment some lines’ defects too
    if (ov.totalDefects > (plantState.prevTotalDefects ?? ov.totalDefects - 1) && (plantState.tick + i) % 4 === 0) {
      line.defects = Math.max(0, (line.defects ?? 0) + 1);
    }
  });
  plantState.prevTotalDefects = ov.totalDefects;

  // Bottleneck minutes drift (smooth)
  if (plantState.bottlenecks[0]) {
    plantState.bottlenecks[0].m = clamp(plantState.bottlenecks[0].m + Math.round(Math.sin(plantState.tick / 6) * 2), 68, 76);
  }
  if (plantState.bottlenecks[1]) {
    plantState.bottlenecks[1].m = clamp(plantState.bottlenecks[1].m + Math.round(Math.cos(plantState.tick / 8) * 1), 46, 50);
  }

  // Throughput arrays: visibly evolve each second
  const today = plantState.throughput.today;
  if (today && today.length > 0) {
    const lastVal = today[today.length - 1];
    const newVal = clamp(lastVal + Math.round(Math.sin(plantState.tick / 3.2) * 10 + (plantState.tick % 2 ? 3 : -2)), 340, 480);
    today.shift();
    today.push(newVal);
  }

  plantState.throughputLabels.shift();
  plantState.throughputLabels.push(nextThroughputLabel());

  // Sparklines: scroll left each tick and push latest, visibly moving
  if (plantState.sparks) {
    if (plantState.sparks.spk1?.length) {
      const lastVal = plantState.sparks.spk1[plantState.sparks.spk1.length - 1];
      const newVal = clamp(lastVal + Math.round(Math.cos(plantState.tick / 2.8) * 7 + (plantState.tick % 3 ? 2 : -1)), 340, 480);
      plantState.sparks.spk1.shift();
      plantState.sparks.spk1.push(newVal);
    }
    if (plantState.sparks.spk2?.length) {
      plantState.sparks.spk2.shift();
      plantState.sparks.spk2.push(clamp(ov.firstPassYield, 90, 99));
    }
    if (plantState.sparks.spk3?.length) {
      plantState.sparks.spk3.shift();
      plantState.sparks.spk3.push(ov.totalDefects);
    }
    if (plantState.sparks.spk4?.length) {
      plantState.sparks.spk4.shift();
      plantState.sparks.spk4.push(round1(ov.avgCycleTime));
    }
  }

  // Defect breakdown counts: slow drift so donut feels alive
  plantState.defectBreakdown = plantState.defectBreakdown.map((item, idx) => ({
    ...item,
    n: clamp(
      item.n + Math.round(Math.sin((plantState.tick + idx) / 10) * 1),
      Math.max(1, item.n - 3),
      item.n + 3
    )
  }));

  // Age alert timestamps every tick
  plantState.alerts = plantState.alerts.map(alert => {
    const timeMinutes = parseInt(alert.time) || 2;
    return { ...alert, time: `${clamp(timeMinutes + 1, 1, 120)}m` };
  });

  // Occasionally resolve one alert (fade-out presence)
  if(plantState.alerts.length && plantState.tick % 31 === 0){
    const idx = plantState.tick % plantState.alerts.length;
    if(plantState.alerts[idx] && plantState.alerts[idx].status !== 'resolved'){
      plantState.alerts[idx] = { ...plantState.alerts[idx], status:'resolved', severity:'INFO', _justChanged:true, resolvedAt: Date.now() };
    }
  }

  // Occasional insertion (every 30–60s)
  if(plantState.tick % 45 === 0){
    const candidates = [
      {title:'L-03 throughput increased +2.1%', detail:'Throughput rate updated from live counters.', severity:'INFO', status:'green'},
      {title:'Weld deviation detected on ST-07', detail:'Deviation beyond threshold window.', severity:'WARNING', status:'amber'},
      {title:'Micro-stop resolved on L-05', detail:'Recovered cycle after micro-interruption.', severity:'INFO', status:'green'},
      {title:'FPY improved to 94.5%', detail:'Quality yield recovered; sampling normalized.', severity:'INFO', status:'green'},
      {title:'Predictive maintenance alert acknowledged', detail:'Operator acknowledged maintenance recommendation.', severity:'WARNING', status:'amber'},
      {title:'Minor torque fluctuation flagged on L-01', detail:'Transient torque variance corrected.', severity:'WARNING', status:'amber'},
    ];
    const pick = candidates[plantState.tick % candidates.length];
    const fresh = {
      location:'LIVE',
      issue:'Telemetry event',
      operator:'OP-AUTO',
      serial:`SN-${1000 + (plantState.tick*7)%900}`,
      batch:`BATCH-${(plantState.tick*3)%1000}`,
      title: pick.title,
      detail: pick.detail,
      severity: pick.severity,
      status: pick.status,
      time:'1m',
      _justChanged:true
    };

    // keep max visible alerts reasonable
    plantState.alerts.unshift(fresh);
    if(plantState.alerts.length>7) plantState.alerts = plantState.alerts.slice(0,7);
  }

  // Severity change occasionally
  if (plantState.alerts.length && plantState.tick % 23 === 0) {
    const idx = plantState.tick % plantState.alerts.length;
    const alert = plantState.alerts[idx];
    if (alert && alert.status !== 'resolved') {
      const prevSeverity = alert.severity;
      if (alert.severity === 'WARNING') {
        alert.severity = 'CRITICAL';
        alert.status = 'red';
      } else if (alert.severity === 'CRITICAL') {
        alert.severity = 'WARNING';
        alert.status = 'amber';
      }
      alert._justChanged = (alert.severity !== prevSeverity);
    }
  }

  // cleanup resolved alerts eventually (after fade)
  if(plantState.alerts.length){
    const now = Date.now();
    plantState.alerts = plantState.alerts.filter(a=>{
      if(a.status !== 'resolved') return true;
      const t = a.resolvedAt || now;
      return (now - t) < 5500;
    });
  }
}

function updateClock(){
  const clock = document.getElementById('clock');
  if(clock) clock.textContent = new Date().toLocaleTimeString('en-US', {hour12:false});
  updateBannerDateTime(); // Also update banner date/time
}

function showTab(id,btn){
  document.querySelectorAll('.tab-page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  if(btn) btn.classList.add('active');
  if(id==='lines') renderLinesTab();
  if(id==='quality') renderQualityTab();
  if(id==='maintenance') renderMaintenanceTab();
  if(id==='reports') renderReportsTab();
}

function ctx2d(id){
  const canvas=document.getElementById(id);
  if(!canvas) return null;
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || canvas.width;
  const H = canvas.offsetHeight || canvas.height;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,H);
  return {ctx,W,H};
}

function sparkline(id,data,color){
  const r=ctx2d(id);if(!r)return;
  const {ctx,W,H}=r;
  if(!data || data.length<2) return;

  // amplitude boost so motion is visible in peripheral vision
  const mnRaw=Math.min(...data), mxRaw=Math.max(...data);
  const span = (mxRaw - mnRaw) || 1;
  const pad = span * 0.12; // boost
  const mn = mnRaw - pad;
  const mx = mxRaw + pad;

  const px = i => i * (W / (data.length - 1));
  const py = v => H - 3 - ((v - mn) / (mx - mn || 1)) * (H - 6);

  const g = ctx.createLinearGradient(0,0,0,H);
  g.addColorStop(0,color+'34');
  g.addColorStop(1,'rgba(0,0,0,0)');

  // area
  ctx.beginPath();
  ctx.moveTo(px(0),py(data[0]));
  data.forEach((v,i)=>{ if(i>0) ctx.lineTo(px(i),py(v)); });
  ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();
  ctx.fillStyle=g;ctx.fill();

  // line
  ctx.beginPath();
  data.forEach((v,i)=>{ if(i===0) ctx.moveTo(px(i),py(v)); else ctx.lineTo(px(i),py(v)); });
  ctx.strokeStyle=color;ctx.lineWidth=2.0;ctx.lineJoin='round';
  ctx.stroke();

  // latest marker with faint glow
  const lastIdx = data.length-1;
  const lx = px(lastIdx);
  const ly = py(data[lastIdx]);
  ctx.beginPath();
  ctx.arc(lx,ly,3.6,0,Math.PI*2);
  ctx.fillStyle='#fff';
  ctx.fill();
  ctx.strokeStyle=color;
  ctx.lineWidth=2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(lx,ly,6.5,0,Math.PI*2);
  ctx.fillStyle=color+'14';
  ctx.fill();
}

function ringsvg(pct,color,size=38){
  const r=14,cx=19,cy=19,circ=2*Math.PI*r,dash=circ*pct/100;
  return `<svg width="${size}" height="${size}" viewBox="0 0 38 38"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(0,0,0,0.06)" stroke-width="4.5"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="4.5" stroke-dasharray="${dash} ${circ}" stroke-dashoffset="${circ/4}" stroke-linecap="round"/><text x="${cx}" y="${cy+4}" text-anchor="middle" font-size="9" font-weight="700" fill="${color}" font-family="JetBrains Mono,monospace">${pct}</text></svg>`;
}

function getStatusFromLine(line){
  if(line.oee >= 85 && line.yield >= 95) return 'green';
  if(line.oee >= 72) return 'amber';
  return 'red';
}

function initOverview(){
  const grid = document.getElementById('overviewLinesGrid');
  if(grid){
    plantState.refs.overviewLines = grid;
    grid.innerHTML = plantState.lines.map((line,index)=>lineCardHTML(line,index)).join('');
  }
  buildAlertItems();
  drawThroughput();
  drawDefectDonut();
  drawBottlenecks();
  drawShiftBars();
  plantState.refs.alertItems = Array.from(document.querySelectorAll('.alert-item'));
  updateDashboardUI();
}

function lineCardHTML(line,index){
  const pct=Math.round(line.output/line.target*100);
  const col=SC[line.status];
  const lbl = line.status==='green'?'On Target':line.status==='amber'?'Warning':'Critical';
  return `<div class="line-card ${line.status}" data-line-index="${index}" onclick="openLine(${index})">
    <div class="lc-top"><div class="lc-id">${line.id}</div><div class="badge ${line.status}"><div class="pip ${line.status}"></div>${lbl}</div></div>
    <div class="lc-name">${line.name.toUpperCase()}</div>
    <div style="display:flex;align-items:baseline;gap:3px;margin-bottom:2px;"><div class="lc-num" data-line-field="output" style="color:${col};">${line.output}</div><div class="lc-denom"> / ${line.target}</div></div>
    <div class="lc-unit">UNITS THIS SHIFT · <span data-line-field="attainment">${pct}%</span></div>
    <div class="prog-track" style="margin-bottom:10px;"><div class="prog-fill" data-line-field="progress" style="width:${pct}%;background:${col};"></div></div>
    <div style="display:flex;align-items:center;justify-content:space-between;"><div><div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:var(--muted);">OEE</div><div class="line-oee" data-line-field="oee" style="font-size:14px;font-weight:700;color:${col};">${line.oee}%</div></div>${ringsvg(Math.round(line.yield),col)}</div>
  </div>`;
}

const SC = {green:'var(--green)',amber:'var(--amber)',red:'var(--red)'};

function buildAlertItems(){
  // DOM is assumed to already have .alert-item nodes for max visible alerts.
  // We update only what exists, avoiding heavy DOM rebuild every tick.
  const alertEls = Array.from(document.querySelectorAll('.alert-item'));
  if(!alertEls.length) return;

  // Reorder occasionally to simulate “operational churn”
  if(plantState.alerts && plantState.alerts.length>1 && plantState.tick && plantState.tick % 17 === 0) {
    plantState.alerts = plantState.alerts
      .map(a=>({a, k: a.status==='red'? 3 : a.status==='amber'?2:1 + (Math.random()*0.25)}))
      .sort((x,y)=>y.k-x.k)
      .map(x=>x.a);
  }

  // insertion / resolution handled in evolveTelemetryRealistic via tick,
  // but we do a gentle “fade-out” here for resolved alerts (status==='resolved').
  const sorted = plantState.alerts.slice().sort((a,b)=> {
    const sa = a.status==='red'?3:a.status==='amber'?2:a.status==='green'?1:0;
    const sb = b.status==='red'?3:b.status==='amber'?2:b.status==='green'?1:0;
    return sb-sa;
  });

  alertEls.forEach((el,index)=>{
    const alert = sorted[index];
    if(!alert) return;

    // Resolve fade-out
    const isResolved = alert.status === 'resolved';
    el.style.transition = 'opacity 520ms ease, transform 520ms ease, filter 520ms ease';
    el.style.opacity = isResolved ? '0' : '1';
    el.style.transform = isResolved ? 'translateX(10px)' : 'translateX(0px)';
    el.style.filter = isResolved ? 'blur(1px)' : 'none';

    const title = el.querySelector('.alert-title');
    const detail = el.querySelector('.alert-detail');
    const time = el.querySelector('.alert-time');
    const icon = el.querySelector('.alert-icon');
    const badge = el.querySelector('.alert-badge');

    if(title) title.textContent = alert.title;
    if(detail) detail.textContent = alert.detail;

    // timestamp aging presence animation
    if(time) {
      time.textContent = alert.time;
      // pulse badge on severity change presence
      if(alert._justChanged) {
        applyKPIGlow(time, alert.status==='red'?'var(--red)':alert.status==='amber'?'var(--amber)':'var(--green)');
      }
    }

    if(icon){
      icon.style.background = alert.status==='red'?'var(--red-l)':alert.status==='amber'?'var(--amber-l)':'var(--green-l)';
      if(alert.severity==='CRITICAL' && alert._justChanged){
        icon.style.boxShadow = '0 0 0 1px rgba(239,68,68,0.18), 0 0 18px rgba(239,68,68,0.22)';
      } else {
        icon.style.boxShadow = 'none';
      }
    }

    // severity pulse for critical/warning
    if(badge) {
      badge.textContent = alert.severity === 'CRITICAL' ? 'CRITICAL' : 'WARNING';
      badge.style.color = alert.status==='red'?'var(--red)' : alert.status==='amber'?'var(--amber)' : 'var(--green)';
      badge.style.transition = 'transform 420ms ease, filter 420ms ease, opacity 420ms ease';
      if(alert._justChanged){
        badge.style.transform = 'scale(1.03)';
        badge.style.filter = alert.status==='red' ? 'brightness(1.08) saturate(1.2)' : 'brightness(1.04)';
        setTimeout(()=>{ badge.style.transform='scale(1)'; badge.style.filter='none'; }, 520);
      }
    }
  });

  // clear change markers after rendering to avoid repeated glow
  plantState.alerts.forEach(a=>{ a._justChanged = false; });
}

function buildLinesGrid(data,targetId){
  const g=document.getElementById(targetId);if(!g)return;
  g.innerHTML=data.map((l,i)=>lineCardHTML(l,LINES.indexOf(l))).join('');
}

function buildLinesTable(data){
  const tb=document.getElementById('linesTableBody');if(!tb)return;
  tb.innerHTML=data.map(l=>{
    const pct=Math.round(l.output/l.target*100);
    const sc=l.status==='green'?'color:var(--green)':l.status==='amber'?'color:var(--amber)':'color:var(--red)';
    const off=l.cycle>l.takt;
    return `<tr onclick="openLine(${LINES.indexOf(l)})">
      <td class="mono" style="font-weight:700;">${l.id}</td>
      <td style="font-weight:600;">${l.name}</td>
<td><span class="badge ${l.status}"><div class="pip ${l.status}"></div>${({green:'On Target',amber:'Warning',red:'Critical'})[l.status]}</span></td>
      <td class="mono" data-line-field="output">${l.output}</td>
      <td class="mono" data-line-field="target">${l.target}</td>
      <td><div style="display:flex;align-items:center;gap:6px;"><div class="prog-track" style="width:60px;"><div class="prog-fill" data-line-field="attainment" style="width:${pct}%;background:${SC[l.status]};"></div></div><span class="mono" style="${sc};font-size:11px;">${pct}%</span></div></td>
      <td class="mono" data-line-field="oee" style="${sc};font-weight:700;">${l.oee}%</td>
      <td class="mono" data-line-field="yield">${l.yield}%</td>
      <td class="mono" data-line-field="downtime" style="${l.status!=='green'?'color:var(--red)':''}">${l.downtime}</td>
      <td><span class="badge ${off?'red':'green'}">${off?'⚠ Off-takt':'✓ On-takt'}</span></td>
    </tr>`;
  }).join('');
}

function buildLeagueTable(){
  const sorted=[...plantState.lines].sort((a,b)=>b.oee-a.oee);
  const medals=['🥇','🥈','🥉'];
  const el=document.getElementById('leagueTable');
  if(!el) return;
  el.innerHTML=sorted.map((l,i)=>`
    <div class="lt-row" onclick="openLine(${LINES.indexOf(l)})">
      <div class="lt-rank">${i+1}</div>
      <div class="lt-medal">${medals[i]||''}</div>
      <div class="lt-label">${l.id} — ${l.name}</div>
      <div class="lt-bar-wrap"><div class="hbar-track"><div class="hbar-fill" style="width:${l.oee}%;background:${SC[l.status]};"></div></div></div>
      <div class="lt-score" style="color:${SC[l.status]};">${l.oee}%</div>
      ${l.oee>=90?'<span class="badge green" style="font-size:8px;">⭐ Best</span>':''}
    </div>`).join('');
}

let throughputAnim = {raf: null, lastFrameAt: 0, progress: 0, started: false};

function startThroughputAnimator(){
  if(throughputAnim.started) return;
  throughputAnim.started = true;

  const tickEveryMs = 1000; // align with fetch loop cadence
  const step = () => {
    throughputAnim.raf = requestAnimationFrame(step);

    const r = ctx2d('throughputChart');
    if(!r) return;
    if(plantState.throughputLabels?.length !== 8) {
      // still render if labels differ
    }

    // internal interpolation progress for visible left-scroll motion
    const now = performance.now();
    if(!throughputAnim.lastFrameAt) throughputAnim.lastFrameAt = now;

    // progress goes 0..1 every tickEveryMs
    const dt = now - throughputAnim.lastFrameAt;
    throughputAnim.lastFrameAt = now;

    // accumulate, clamp to [0,1) for stable interpolation
    throughputAnim.progress = (throughputAnim.progress + dt / tickEveryMs) % 1;

    drawThroughput(throughputAnim.progress);
  };

  throughputAnim.raf = requestAnimationFrame(step);
}

function drawThroughput(interp=0){
  const r=ctx2d('throughputChart');if(!r)return;
  const {ctx,W,H}=r;
  const today=plantState.throughput[plantState.currentThroughputView];
  const yest=plantState.throughput.yesterday;
  const tgt=400;
  const labels = plantState.throughputLabels;

  if(!today || today.length<2 || !yest || yest.length<2) return;

  const mn=Math.min(...today,...yest,tgt)-10;
  const mx=Math.max(...today,...yest,tgt)+10;

  // scrolling window: shift x positions left by interp (0..1)
  const leftPad = 34;
  const rightPad = 10;
  const plotW = W - leftPad - rightPad;

  const px=(i)=> leftPad + (i*(plotW/(today.length-1))) - (interp * (plotW/(today.length-1))); // scroll left
  const py=v=>H-20-((v-mn)/(mx-mn))*(H-30);

  // ground grid
  [320,360,400,440].forEach(v=>{
    ctx.strokeStyle='rgba(0,0,0,0.05)';
    ctx.lineWidth=1;
    ctx.setLineDash([3,4]);
    ctx.beginPath();
    ctx.moveTo(leftPad,py(v));
    ctx.lineTo(W-4,py(v));
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='rgba(0,0,0,.22)';
    ctx.font='8px JetBrains Mono';
    ctx.textAlign='right';
    ctx.fillText(v,leftPad-4,py(v)+3);
  });

  ctx.strokeStyle='rgba(37,99,235,.18)';
  ctx.lineWidth=1.5;
  ctx.setLineDash([5,4]);
  ctx.beginPath();
  ctx.moveTo(leftPad,py(tgt));
  ctx.lineTo(W-4,py(tgt));
  ctx.stroke();
  ctx.setLineDash([]);

  // subtle flowing gradient under current line
  const flowX = (Date.now()*0.001) % 1;
  const g1=ctx.createLinearGradient(leftPad + plotW*flowX,0,leftPad + plotW*(flowX+0.3),0);
  g1.addColorStop(0,'rgba(37,99,235,.26)');
  g1.addColorStop(1,'rgba(37,99,235,0)');

  // yesterday (faint, no dots)
  ctx.beginPath();
  ctx.moveTo(px(0),py(yest[0]));
  yest.forEach((v,i)=>{ if(i>0) ctx.lineTo(px(i),py(v)); });
  ctx.lineTo(px(yest.length-1),H-20);
  ctx.lineTo(px(0),H-20);
  ctx.closePath();
  ctx.fillStyle='rgba(0,0,0,0.04)';
  ctx.fill();

  ctx.beginPath();
  yest.forEach((v,i)=>{ if(i===0) ctx.moveTo(px(i),py(v)); else ctx.lineTo(px(i),py(v)); });
  ctx.strokeStyle='rgba(0,0,0,.16)';
  ctx.lineWidth=1.5;
  ctx.setLineDash([4,3]);
  ctx.stroke();
  ctx.setLineDash([]);

  // today area
  ctx.beginPath();
  ctx.moveTo(px(0),py(today[0]));
  today.forEach((v,i)=>{ if(i>0) ctx.lineTo(px(i),py(v)); });
  ctx.lineTo(px(today.length-1),H-20);
  ctx.lineTo(px(0),H-20);
  ctx.closePath();
  ctx.fillStyle=g1;
  ctx.fill();

  // today line (visible)
  ctx.beginPath();
  today.forEach((v,i)=>{ if(i===0) ctx.moveTo(px(i),py(v)); else ctx.lineTo(px(i),py(v)); });
  ctx.strokeStyle='#2563eb';
  ctx.lineWidth=2.6;
  ctx.lineJoin='round';
  ctx.stroke();

  // moving highlight dot at latest interpolated x
  const latestIndex = today.length-1;
  const latestX = leftPad + (latestIndex*(plotW/(today.length-1))) - (interp * (plotW/(today.length-1)));
  const latestY = py(today[latestIndex]);
  ctx.beginPath();
  ctx.arc(latestX, latestY, 4.2, 0, Math.PI*2);
  ctx.fillStyle='#fff';
  ctx.fill();
  ctx.strokeStyle='#2563eb';
  ctx.lineWidth=2;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(latestX, latestY, 9.0, 0, Math.PI*2);
  ctx.fillStyle='rgba(37,99,235,0.10)';
  ctx.fill();

  // small steady dots (less clutter)
  for(let i=0;i<today.length;i+=2){
    ctx.beginPath();
    ctx.arc(px(i),py(today[i]),2.4,0,Math.PI*2);
    ctx.fillStyle='#fff';
    ctx.fill();
    ctx.strokeStyle='#2563eb';
    ctx.lineWidth=1.6;
    ctx.stroke();
  }

  // labels (aligned to unscrolled positions)
  ctx.fillStyle='rgba(0,0,0,.28)';
  ctx.font='9px JetBrains Mono';
  ctx.textAlign='center';
  if(labels && labels.length===today.length){
    labels.forEach((l,i)=>ctx.fillText(l, leftPad + (i*(plotW/(today.length-1))), H-5));
  }
}

function drawDefectDonut(){
  const r=ctx2d('defDonut');if(!r)return;
  const {ctx}=r;const cx=50,cy=50,outerR=44,innerR=26;
  const total=plantState.defectBreakdown.reduce((acc,d)=>acc+d.n,0);
  let angle=-Math.PI/2;
  plantState.defectBreakdown.forEach(x=>{const sw=x.n/total*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,outerR,angle,angle+sw);ctx.closePath();ctx.fillStyle=x.c+'cc';ctx.fill();angle+=sw;});
  ctx.beginPath();ctx.arc(cx,cy,innerR,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
  ctx.fillStyle='#0d0d12';ctx.font='bold 14px Outfit,sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(total,cx,cy-4);
  ctx.font='7px JetBrains Mono';ctx.fillStyle='#6b6b7a';ctx.fillText('DEFECTS',cx,cy+8);
}

function drawBottlenecks(){
  const bns = plantState.bottlenecks;
  const container = document.getElementById('bottleneckList');
  if(!container)return;
  container.innerHTML = bns.map(b=>`
    <div class="hbar-row">
      <div class="hbar-label">${b.l}</div>
      <div class="hbar-track"><div class="hbar-fill progress-live" style="width:${b.m/72*100}%;background:${b.c};transition:width 1.2s cubic-bezier(.4,0,.2,1);"></div></div>
      <div class="hbar-val" style="color:${b.c};animation:kpiPulse 3s infinite;">${b.m}m</div>
    </div>`).join('');
}

function drawShiftBars(){
  const r=ctx2d('shiftBarChart');if(!r)return;
  const {ctx,W,H}=r;
  const data=plantState.shiftBars.map((v,i)=>({v,l:['A Mon','B Mon','A Tue','B Now'][i]}));
  const mx=4000,mn=3400;
  const bw=(W-40)/(data.length*2);

  // Add subtle animated background
  const bgGradient = ctx.createLinearGradient(0, 0, W, 0);
  bgGradient.addColorStop(0, 'rgba(37,99,235,0.02)');
  bgGradient.addColorStop(0.5, 'rgba(37,99,235,0.05)');
  bgGradient.addColorStop(1, 'rgba(37,99,235,0.02)');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, W, H);

  data.forEach((d,i)=>{
    const x=20+i*((W-40)/data.length);
    const bh=(d.v-mn)/(mx-mn)*(H-28);
    const y=H-18-bh;
    const isNow=(i===3);
    const col=isNow?'#2563eb':'rgba(0,0,0,.1)';
    ctx.fillStyle=col;
    const rr=4;
    ctx.beginPath();ctx.moveTo(x+rr,y);ctx.lineTo(x+bw-rr,y);ctx.arcTo(x+bw,y,x+bw,y+rr,rr);ctx.lineTo(x+bw,H-18);ctx.lineTo(x,H-18);ctx.lineTo(x,y+rr);ctx.arcTo(x,y,x+rr,y,rr);ctx.closePath();ctx.fill();

    // Add animated glow for current shift
    if(isNow){
      ctx.shadowColor = '#2563eb';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    const tc=isNow?'#2563eb':'rgba(0,0,0,.35)';
    ctx.fillStyle=tc;ctx.font=`${isNow?'bold ':''} 9px JetBrains Mono`;ctx.textAlign='center';ctx.fillText(`${(d.v/1000).toFixed(1)}k`,x+bw/2,y-4);
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.font='8px JetBrains Mono';ctx.fillText(d.l,x+bw/2,H-5);
  });
}

function drawTaktChart(){
  const r=ctx2d('taktChart');if(!r)return;
  const {ctx,W,H}=r;
  const bw=Math.min(18,(W-40)/plantState.lines.length-4);
  const mx=80;
  plantState.lines.forEach((l,i)=>{
    const x=24+i*((W-32)/plantState.lines.length);
    const th=(l.takt/mx)*(H-34);
    const ch=(l.cycle/mx)*(H-34);
    ctx.fillStyle='rgba(37,99,235,.15)';ctx.fillRect(x,H-18-th,bw,th);
    const cc=l.cycle>l.takt?'#ef4444':'#00b96b';
    ctx.fillStyle=cc+'cc';ctx.fillRect(x+bw+2,H-18-ch,bw,ch);
    ctx.fillStyle='rgba(0,0,0,.28)';ctx.font='8px JetBrains Mono';ctx.textAlign='center';ctx.fillText(l.id,x+bw+1,H-5);
  });
  ctx.fillStyle='rgba(37,99,235,.6)';ctx.fillRect(W-90,8,10,6);ctx.fillStyle='rgba(0,0,0,.4)';ctx.font='8px JetBrains Mono';ctx.textAlign='left';ctx.fillText('Takt',W-76,14);
  ctx.fillStyle='rgba(0,185,107,.7)';ctx.fillRect(W-50,8,10,6);ctx.fillText('Cycle',W-36,14);
}

function drawFPYChart(){
  const r=ctx2d('fpyChart');if(!r)return;
  const {ctx,W,H}=r;
  const labels=plantState.lines.map(l=>l.id);
  const vals=plantState.lines.map(l=>l.yield);
  const tgt=95;
  const mn=75,mx=102;
  const bw=(W-40)/vals.length-5;
  vals.forEach((v,i)=>{
    const x=24+i*((W-32)/vals.length);
    const bh=(v-mn)/(mx-mn)*(H-28);
    const col=v>=95?'#00b96b':v>=88?'#f59e0b':'#ef4444';
    ctx.fillStyle=col+'22';ctx.fillRect(x,H-18-bh,bw,bh);
    ctx.fillStyle=col;ctx.fillRect(x,H-18-Math.min(bh,6),bw,Math.min(bh,6));
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.font='8px JetBrains Mono';ctx.textAlign='center';ctx.fillText(`${v}%`,x+bw/2,H-18-bh-4);ctx.fillText(labels[i],x+bw/2,H-5);
  });
  const ty=H-18-((tgt-mn)/(mx-mn))*(H-28);
  ctx.strokeStyle='rgba(37,99,235,.35)';ctx.lineWidth=1.5;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(20,ty);ctx.lineTo(W-4,ty);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(37,99,235,.7)';ctx.font='8px JetBrains Mono';ctx.textAlign='right';ctx.fillText('Target 95%',W-6,ty-3);
}

function drawParetoChart(){
  const r=ctx2d('paretoChart');if(!r)return;
  const {ctx,W,H}=r;
  const cats=plantState.defectBreakdown.map(x=>({l:x.label,n:x.n,c:x.c}));
  const total=cats.reduce((acc,x)=>acc+x.n,0);
  const mx=Math.max(...cats.map(x=>x.n));
  const bw=(W-40)/cats.length-4;
  let cum=0;
  const cumPts=[];
  cats.forEach((c,i)=>{
    const x=24+i*((W-32)/cats.length);
    const bh=c.n/mx*(H-28);
    ctx.fillStyle=c.c+'33';ctx.fillRect(x,H-18-bh,bw,bh);
    ctx.fillStyle=c.c;ctx.fillRect(x,H-18-Math.min(bh,6),bw,Math.min(bh,6));
    ctx.fillStyle='rgba(0,0,0,.35)';ctx.font='8px JetBrains Mono';ctx.textAlign='center';ctx.fillText(c.n,x+bw/2,H-18-bh-4);ctx.fillText(c.l,x+bw/2,H-5);
    cum += c.n;cumPts.push({x:x+bw/2,y:H-18-((cum/total)*(H-28))});
  });
  ctx.beginPath();cumPts.forEach((p,i)=>{if(i===0)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);});ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.8;ctx.stroke();
  cumPts.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,3,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='rgba(0,0,0,.45)';ctx.lineWidth=1.5;ctx.stroke();});
}

function drawFatigueChart(){
  const r=ctx2d('fatigueChart');if(!r)return;
  const {ctx,W,H}=r;
  const data=plantState.fatigue;
  const labels=['08h','09h','10h','11h','12h','13h','14h','15h'];
  const mx=7,mn=0;
  const px=i=>32+i*(W-44)/(data.length-1);
  const py=v=>H-18-v/(mx-mn)*(H-26);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(239,68,68,.15)');g.addColorStop(1,'rgba(239,68,68,0)');
  ctx.beginPath();ctx.moveTo(px(0),py(data[0]));data.forEach((v,i)=>{if(i>0)ctx.lineTo(px(i),py(v));});ctx.lineTo(W-12,H-18);ctx.lineTo(32,H-18);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();data.forEach((v,i)=>{if(i===0)ctx.moveTo(px(i),py(v));else ctx.lineTo(px(i),py(v));});ctx.strokeStyle='#ef4444';ctx.lineWidth=2;ctx.stroke();
  data.forEach((v,i)=>{ctx.beginPath();ctx.arc(px(i),py(v),3.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle='#ef4444';ctx.lineWidth=2;ctx.stroke();});
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.font='9px JetBrains Mono';ctx.textAlign='center';labels.forEach((l,i)=>ctx.fillText(l,px(i),H-4));
  [2,4,6].forEach(v=>{ctx.strokeStyle='rgba(0,0,0,.06)';ctx.lineWidth=1;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(28,py(v));ctx.lineTo(W-4,py(v));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='rgba(0,0,0,.25)';ctx.font='8px JetBrains Mono';ctx.textAlign='right';ctx.fillText(v,26,py(v)+3);});
}

function drawFPYTrendChart(){
  const r=ctx2d('fpyTrendChart');if(!r)return;
  const {ctx,W,H}=r;
  const shiftA=plantState.fpyTrend;
  const shiftB=shiftA.map(v=>clamp(v - 1 + ((v%2===0)?1:0), 90, 96));
  const mn=89,mx=98;
  const px=i=>16+i*(W-24)/(shiftA.length-1);
  const py=v=>H-16-((v-mn)/(mx-mn))*(H-24);
  [91,93,95].forEach(v=>{ctx.strokeStyle='rgba(0,0,0,.05)';ctx.lineWidth=1;ctx.setLineDash([2,4]);ctx.beginPath();ctx.moveTo(12,py(v));ctx.lineTo(W-4,py(v));ctx.stroke();ctx.setLineDash([]);});
  const drawLine=(data,col,dash)=>{ctx.strokeStyle=col;ctx.lineWidth=2;ctx.setLineDash(dash||[]);ctx.beginPath();data.forEach((v,i)=>{if(i===0)ctx.moveTo(px(i),py(v));else ctx.lineTo(px(i),py(v));});ctx.stroke();ctx.setLineDash([]);};
  drawLine(shiftB,'rgba(0,0,0,.2)',[4,3]);
  drawLine(shiftA,'#2563eb');
  ctx.strokeStyle='rgba(37,99,235,.3)';ctx.lineWidth=1;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(12,py(95));ctx.lineTo(W-4,py(95));ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(0,0,0,.35)';ctx.font='8px JetBrains Mono';ctx.textAlign='left';ctx.fillText('Target 95%',14,py(95)-3);
}

function drawQuadrant(){
  const r=ctx2d('quadChart');if(!r)return;
  const {ctx,W,H}=r;
  const pad=32;
  ctx.strokeStyle='rgba(0,0,0,.06)';ctx.lineWidth=1;
  [0.25,0.5,0.75].forEach(f=>{ctx.beginPath();ctx.moveTo(pad+(W-pad*2)*f,pad);ctx.lineTo(pad+(W-pad*2)*f,H-pad);ctx.stroke();ctx.beginPath();ctx.moveTo(pad,pad+(H-pad*2)*f);ctx.lineTo(W-pad,pad+(H-pad*2)*f);ctx.stroke();});
  ctx.font='8px JetBrains Mono';ctx.fillStyle='rgba(0,0,0,.2)';ctx.textAlign='center';ctx.fillText('HIGH MTBF / LOW MTTR (IDEAL)',pad+(W-pad*2)*.75,pad+10);ctx.fillText('LOW MTBF / HIGH MTTR (PROBLEM)',pad+(W-pad*2)*.25,H-pad-6);
  ctx.strokeStyle='rgba(0,0,0,.15)';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(pad,H-pad);ctx.lineTo(W-pad,H-pad);ctx.stroke();ctx.beginPath();ctx.moveTo(pad,pad);ctx.lineTo(pad,H-pad);ctx.stroke();
  ctx.fillStyle='rgba(0,0,0,.4)';ctx.font='9px JetBrains Mono';ctx.textAlign='center';ctx.fillText('MTBF (hours) →',W/2,H-6);ctx.save();ctx.translate(10,H/2);ctx.rotate(-Math.PI/2);ctx.fillText('MTTR (hours) →',0,0);ctx.restore();
  const maxMTBF=150,maxMTTR=6;
  plantState.assets.forEach(a=>{
    const x=pad+(a.mtbf/maxMTBF)*(W-pad*2);
    const y=H-pad-(1-a.mttr/maxMTTR)*(H-pad*2);
    const col=a.status==='red'?'#ef4444':a.status==='amber'?'#f59e0b':'#00b96b';
    ctx.beginPath();ctx.arc(x,y,8,0,Math.PI*2);ctx.fillStyle=col+'cc';ctx.fill();ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.stroke();
    ctx.fillStyle='rgba(0,0,0,.55)';ctx.font='bold 7px JetBrains Mono';ctx.textAlign='center';ctx.fillText(a.line,x,y+3);
  });
}

function drawDowntimeChart(){
  const r=ctx2d('downtimeChart');if(!r)return;
  const {ctx,W,H}=r;
  const labels=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const planned=plantState.downtime.planned;
  const unplanned=plantState.downtime.unplanned;
  const micro=plantState.downtime.micro;
  const mx=170;
  const bw=(W-50)/labels.length-4;
  labels.forEach((l,i)=>{
    const x=26+i*((W-38)/labels.length);
    const mh=micro[i]/mx*(H-28);const uh=unplanned[i]/mx*(H-28);const ph=planned[i]/mx*(H-28);
    ctx.fillStyle='rgba(239,68,68,.7)';ctx.fillRect(x,H-18-ph-uh-mh,bw,mh);
    ctx.fillStyle='rgba(245,158,11,.7)';ctx.fillRect(x,H-18-ph-uh,bw,uh);
    ctx.fillStyle='rgba(37,99,235,.5)';ctx.fillRect(x,H-18-ph,bw,ph);
    ctx.fillStyle='rgba(0,0,0,.3)';ctx.font='8px JetBrains Mono';ctx.textAlign='center';ctx.fillText(l,x+bw/2,H-5);
  });
  [['#2563eb','Planned'],['#f59e0b','Unplanned'],['#ef4444','Micro']].forEach((e,i)=>{
    ctx.fillStyle=e[0];ctx.fillRect(W-90,8+i*12,8,5);
    ctx.fillStyle='rgba(0,0,0,.45)';ctx.font='8px JetBrains Mono';ctx.textAlign='left';ctx.fillText(e[1],W-78,14+i*12);
  });
}

function drawMTBFChart(){
  const r=ctx2d('mtbfChart');if(!r)return;
  const {ctx,W,H}=r;
  const wks=['W1','W2','W3','W4','W5','W6','W7','W8','W9','W10','W11','W12'];
  const mtbf=[72,76,68,80,84,78,82,80,84,88,86,84];
  const mttr=[3.2,3.0,3.8,2.8,2.6,3.0,2.8,2.4,2.6,2.2,2.4,2.4];
  const mn1=60,mx1=100;
  const px=i=>28+i*(W-36)/(wks.length-1);
  const py1=v=>H-18-((v-mn1)/(mx1-mn1))*(H-28);
  const py2=v=>H-18-((v/5))*(H-28);
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,'rgba(37,99,235,.1)');g.addColorStop(1,'rgba(37,99,235,0)');
  ctx.beginPath();ctx.moveTo(px(0),py1(mtbf[0]));mtbf.forEach((v,i)=>{if(i>0)ctx.lineTo(px(i),py1(v));});ctx.lineTo(px(mtbf.length-1),H-18);ctx.lineTo(px(0),H-18);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();mtbf.forEach((v,i)=>{if(i===0)ctx.moveTo(px(i),py1(v));else ctx.lineTo(px(i),py1(v));});ctx.strokeStyle='#2563eb';ctx.lineWidth=2;ctx.stroke();
  ctx.beginPath();mttr.forEach((v,i)=>{if(i===0)ctx.moveTo(px(i),py2(v));else ctx.lineTo(px(i),py2(v));});ctx.strokeStyle='#ef4444';ctx.lineWidth=2;ctx.setLineDash([4,3]);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(0,0,0,.28)';ctx.font='8px JetBrains Mono';ctx.textAlign='center';wks.forEach((l,i)=>{if(i%2===0)ctx.fillText(l,px(i),H-4);});
  ctx.fillStyle='#2563eb';ctx.fillRect(W-90,6,10,3);ctx.fillStyle='rgba(0,0,0,.4)';ctx.font='8px JetBrains Mono';ctx.textAlign='left';ctx.fillText('MTBF',W-76,11);
  ctx.strokeStyle='#ef4444';ctx.lineWidth=1.5;ctx.setLineDash([3,2]);ctx.beginPath();ctx.moveTo(W-90,18);ctx.lineTo(W-80,18);ctx.stroke();ctx.setLineDash([]);ctx.fillText('MTTR',W-76,21);
}

function drawEnergyChart(){
  const r=ctx2d('energyChart');if(!r)return;
  const {ctx,W,H}=r;
  const vals = plantState.energy;
  const tgt=2.6;
  const mn=2.4,mx=4.4;
  const bw=(W-40)/vals.length-5;
  vals.forEach((v,i)=>{
    const x=22+i*((W-30)/vals.length);
    const bh=(v-mn)/(mx-mn)*(H-28);
    const col=v<=tgt?'#00b96b':v<=3.0?'#f59e0b':'#ef4444';
    ctx.fillStyle=col+'25';ctx.fillRect(x,H-18-bh,bw,bh);
    ctx.fillStyle=col;ctx.fillRect(x,H-18-Math.min(bh,6),bw,Math.min(bh,6));
    ctx.fillStyle='rgba(0,0,0,.32)';ctx.font='8px JetBrains Mono';ctx.textAlign='center';ctx.fillText(v.toFixed(1),x+bw/2,H-18-bh-4);ctx.fillText(LINES[i]?.id||'',x+bw/2,H-5);
  });
  const ty=H-18-((tgt-mn)/(mx-mn))*(H-28);
  ctx.strokeStyle='rgba(0,185,107,.4)';ctx.lineWidth=1.5;ctx.setLineDash([5,4]);ctx.beginPath();ctx.moveTo(18,ty);ctx.lineTo(W-4,ty);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle='rgba(0,185,107,.7)';ctx.font='8px JetBrains Mono';ctx.textAlign='right';ctx.fillText('Target 2.6',W-6,ty-3);
}

function buildDefectTable(){
  const tb=document.getElementById('defectTableBody');if(!tb)return;
  tb.innerHTML = plantState.defectLog.map(d=>{
    const sc=d.sev==='CRITICAL'?'color:var(--red)':d.sev==='WARNING'?'color:var(--amber)':'color:var(--dim)';
    const ss=d.status==='Open'?'red':d.status==='In Review'?'amber':d.status==='Rework'?'indigo':'green';
    return `<tr onclick="openTrace('${d.line} · ${d.station}','${d.cat} defect — ${d.sev}','${d.op}','${d.serial}','${d.batch}','${d.sev}')">
      <td class="mono">${d.time}</td>
      <td style="font-weight:700;">${d.line}</td>
      <td class="mono">${d.station}</td>
      <td class="mono hi" style="color:var(--blue);font-weight:700;">${d.serial}</td>
      <td class="mono">${d.batch}</td>
      <td style="font-weight:600;">${d.cat}</td>
      <td style="${sc};font-weight:700;">${d.sev}</td>
      <td class="mono">${d.op}</td>
      <td><span class="badge ${ss}">${d.status}</span></td>
    </tr>`;
  }).join('');
}

function drawOvLineChart(line,col){
  const r=ctx2d('ovLineChart');if(!r)return;
  const {ctx,W,H}=r;
  const data=[Math.round(line.output*0.18),Math.round(line.output*0.20),Math.round(line.output*0.17),Math.round(line.output*0.19),Math.round(line.output*0.21),Math.round(line.output*0.05)];
  const tgt=Math.round(line.target/8);const mn=0,mx=Math.max(...data,tgt)+8;
  const px=i=>28+i*(W-36)/(data.length-1);
  const py=v=>H-16-v/(mx-mn)*(H-22);
  const strokeCol= line.status==='green'?'#00b96b':line.status==='amber'?'#f59e0b':'#ef4444';
  const g=ctx.createLinearGradient(0,0,0,H);g.addColorStop(0,strokeCol+'18');g.addColorStop(1,strokeCol+'00');
  ctx.beginPath();ctx.moveTo(px(0),py(data[0]));data.forEach((v,i)=>{if(i>0)ctx.lineTo(px(i),py(v));});ctx.lineTo(W-8,H-16);ctx.lineTo(28,H-16);ctx.closePath();ctx.fillStyle=g;ctx.fill();
  ctx.beginPath();data.forEach((v,i)=>{if(i===0)ctx.moveTo(px(i),py(v));else ctx.lineTo(px(i),py(v));});ctx.strokeStyle=strokeCol;ctx.lineWidth=2.5;ctx.lineJoin='round';ctx.stroke();
  data.forEach((v,i)=>{ctx.beginPath();ctx.arc(px(i),py(v),3.5,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle=strokeCol;ctx.lineWidth=2;ctx.stroke();});
  const ty=py(tgt);ctx.strokeStyle='rgba(37,99,235,.3)';ctx.lineWidth=1.2;ctx.setLineDash([4,3]);ctx.beginPath();ctx.moveTo(24,ty);ctx.lineTo(W-4,ty);ctx.stroke();ctx.setLineDash([]);
  ['08h','09h','10h','11h','12h','13h'].forEach((label,i)=>{ctx.fillStyle='rgba(0,0,0,.28)';ctx.font='9px JetBrains Mono';ctx.textAlign='center';ctx.fillText(label,px(i),H-3);});
}

function drawOvPie(cats,total){
  const r=ctx2d('ovPie');if(!r)return;
  const {ctx}=r;const cx=84,cy=84,OR=72,IR=40;
  let angle=-Math.PI/2;
  cats.forEach(x=>{const sw=x.n/total*Math.PI*2;ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,OR,angle,angle+sw);ctx.closePath();ctx.fillStyle=x.c+'cc';ctx.fill();angle+=sw;});
  ctx.beginPath();ctx.arc(cx,cy,IR,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();
  ctx.fillStyle='#0d0d12';ctx.font='bold 18px Outfit';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(total,cx,cy-5);
  ctx.font='8px JetBrains Mono';ctx.fillStyle='#6b6b7a';ctx.fillText('TOTAL',cx,cy+12);
}

function drawOvDefBar(){
  const r=ctx2d('ovDefBar');if(!r)return;
  const {ctx,W,H}=r;
  const data=plantState.defectBreakdown.slice(0,6).map(x=>x.n);
  const labels=['08h','09h','10h','11h','12h','13h'];
  const mx=Math.max(...data,7);
  const bw=(W-32)/(data.length)-6;
  data.forEach((v,i)=>{
    const x=16+i*((W-24)/data.length)+2;
    const bh=v/mx*(H-28);
    const y=H-18-bh;
    const col=v>4?'#ef4444':v>2?'#f59e0b':'#00b96b';
    ctx.fillStyle=col+'20';const rr=3;
    ctx.beginPath();ctx.moveTo(x+rr,y);ctx.lineTo(x+bw-rr,y);ctx.arcTo(x+bw,y,x+bw,y+rr,rr);ctx.lineTo(x+bw,H-18);ctx.lineTo(x,H-18);ctx.lineTo(x,y+rr);ctx.arcTo(x,y,x+rr,y,rr);ctx.closePath();ctx.fill();
    ctx.fillStyle=col;ctx.beginPath();ctx.moveTo(x+rr,H-18-Math.min(bh,5));ctx.lineTo(x+bw-rr,H-18-Math.min(bh,5));ctx.arcTo(x+bw,H-18-Math.min(bh,5),x+bw,H-18-Math.min(bh,5)+rr,rr);ctx.lineTo(x+bw,H-18);ctx.lineTo(x,H-18);ctx.lineTo(x,H-18-Math.min(bh,5)+rr);ctx.arcTo(x,H-18-Math.min(bh,5),x+rr,H-18-Math.min(bh,5),rr);ctx.closePath();ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.4)';ctx.font='9px JetBrains Mono';ctx.textAlign='center';ctx.fillText(v,x+bw/2,y-4);ctx.fillText(labels[i],x+bw/2,H-4);
  });
}

function buildAssetRiskList(){
  const el=document.getElementById('assetRiskList');
  if(!el) return;
  el.innerHTML = plantState.assets.map(a=>{
    const col=a.status==='red'?'var(--red)':a.status==='amber'?'var(--amber)':'var(--green)';
    const bg=a.status==='red'?'var(--red-l)':a.status==='amber'?'var(--amber-l)': 'var(--green-l)';
    return `<div style="display:flex;align-items:center;gap:12px;padding:10px;border-radius:9px;background:${bg};border:1px solid ${col}22;cursor:pointer;" onclick="showTab('maintenance',document.querySelectorAll('.nav-btn')[3]);openTrace('${a.name}','Asset health ${a.health}/100 — predicted failure ${a.risk}','MAINT-TEAM','ASSET-${a.line}','N/A','${a.status==='red'?'CRITICAL':'WARNING'}')">
      <div style="font-size:22px;">${a.status==='red'?'⚙️':a.status==='amber'?'🔥':'✅'}</div>
      <div style="flex:1;"><div style="font-size:12px;font-weight:700;">${a.name}</div><div style="font-family:'JetBrains Mono',monospace;font-size:10px;color:var(--muted);margin-top:2px;">Health: ${a.health}/100 · MTBF: ${a.mtbf}h · MTTR: ${a.mttr}h</div><div style="height:4px;background:var(--surface3);border-radius:2px;overflow:hidden;margin-top:4px;"><div style="width:${a.health}%;height:100%;background:${col};border-radius:2px;"></div></div></div>
      <div><span class="badge ${a.status}" style="display:block;text-align:center;margin-bottom:3px;">${a.status==='red'?'CRITICAL':a.status==='amber'?'AT RISK':'HEALTHY'}</span><div style="font-family:'JetBrains Mono',monospace;font-size:9px;color:${col};text-align:center;">${a.risk}</div></div>
    </div>`;
  }).join('');
}

function buildMaintTimeline(){
  const el=document.getElementById('maintTimeline');
  if(!el) return;
  el.innerHTML = plantState.maintEvents.map(e=>{
    const col = e.color==='red'?'var(--red)':e.color==='amber'?'var(--amber)':e.color==='green'?'var(--green)':'var(--blue)';
    return `<div class="timeline-event" onclick="openTrace('${e.asset}','${e.desc}','MAINT-TEAM','N/A','N/A','${e.color==='red'?'CRITICAL':'INFO'}')">
      <div class="te-dot" style="background:${col};"></div>
      <div class="te-body"><div class="te-title">[${e.time}] ${e.type} — ${e.asset}</div><div class="te-meta">${e.desc} · Duration: ${e.dur}</div></div>
      <span class="badge ${e.color}">${e.status}</span>
    </div>`;
  }).join('');
}

function buildKPISummaryTable(){
  const tb=document.getElementById('kpiSummaryTable');
  if(!tb) return;
  tb.innerHTML = plantState.kpiSummary.map(k=>`
    <tr>
      <td style="font-weight:600;">${k.name}</td>
      <td class="mono" style="font-weight:700;">${k.actual}</td>
      <td class="mono" style="color:var(--muted);">${k.target}</td>
      <td class="mono" style="color:${k.status==='green'?'var(--green)':k.status==='amber'?'var(--amber)':'var(--red)'};">${k.delta}</td>
      <td><span class="badge ${k.status}">${k.status==='green'?'✓ On Track':k.status==='amber'?'⚠ Watch':'✕ Off Target'}</span></td>
    </tr>`).join('');
}

function buildScheduledReports(){
  const tb=document.getElementById('scheduledReportsBody');
  if(!tb) return;
  tb.innerHTML = plantState.scheduledReports.map(r=>`
    <tr>
      <td style="font-weight:600;">${r.name}</td>
      <td class="mono">${r.freq}</td>
      <td class="mono" style="color:var(--muted);">${r.last}</td>
      <td class="mono" style="font-size:11px;">${r.rcpts}</td>
      <td><span class="badge blue">${r.fmt}</span></td>
      <td><button onclick="openTrace('${r.name}','Report generated and sent','SYSTEM','N/A','N/A','INFO')" style="padding:4px 12px;border-radius:6px;background:var(--blue-l);color:var(--blue);font-size:11px;font-weight:700;border:none;cursor:pointer;">Run Now</button></td>
    </tr>`).join('');
}

function openLine(idx){
  const l = plantState.lines[idx];
  if(!l) return;
  document.getElementById('ovTitle').textContent = `${l.id} — ${l.name}`;
  document.getElementById('ovSub').textContent = `STATUS: ${l.status.toUpperCase()} · OEE ${l.oee}% · FPY ${l.yield}% · ${l.output}/${l.target} UNITS · DOWNTIME: ${l.downtime}`;
  const defCats=[{c:'#ef4444',label:'Weld',n:7},{c:'#f59e0b',label:'Dimensional',n:5},{c:'#2563eb',label:'Paint',n:4},{c:'#6366f1',label:'Assembly',n:3},{c:'#a8a8b8',label:'Other',n:2}];
  const totalDef=defCats.reduce((acc,x)=>acc+x.n,0);
  document.getElementById('ovBody').innerHTML = `
  <div style="display:flex;gap:7px;margin-bottom:18px;">
    <div class="search-bar" style="flex:1;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input placeholder="Search by Serial #, Batch, WO, PO…" id="ovSearch"></div>
    <button class="search-btn" onclick="doOvSearch()">Trace</button>
  </div>
  <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:9px;margin-bottom:16px;">
    <div class="card" style="padding:13px;"><div style="font-size:9px;font-weight:600;color:var(--muted);text-transform:uppercase;margin-bottom:4px;">OEE</div><div style="font-size:20px;font-weight:800;color:${SC[l.status]};">${l.oee}%</div><div class="mono" style="font-size:9px;color:var(--muted);">Plant avg ${plantState.overview.oee}%</div></div>
    <div class="card" style="padding:13px;"><div style="font-size:9px;font-weight:600;color:var(--muted);text-transform:uppercase;margin-bottom:4px;">FPY</div><div style="font-size:20px;font-weight:800;">${l.yield}%</div><div class="mono" style="font-size:9px;color:var(--muted);">Target ≥95%</div></div>
    <div class="card" style="padding:13px;"><div style="font-size:9px;font-weight:600;color:var(--muted);text-transform:uppercase;margin-bottom:4px;">Output</div><div style="font-size:20px;font-weight:800;">${l.output}</div><div class="mono" style="font-size:9px;color:var(--muted);">/ ${l.target}</div></div>
    <div class="card" style="padding:13px;"><div style="font-size:9px;font-weight:600;color:var(--muted);text-transform:uppercase;margin-bottom:4px;">Defects</div><div style="font-size:20px;font-weight:800;color:var(--red);">${totalDef}</div><div class="mono" style="font-size:9px;color:var(--muted);">this shift</div></div>
    <div class="card" style="padding:13px;"><div style="font-size:9px;font-weight:600;color:var(--muted);text-transform:uppercase;margin-bottom:4px;">Downtime</div><div style="font-size:20px;font-weight:800;color:var(--amber);">${l.downtime}</div><div class="mono" style="font-size:9px;color:var(--muted);">planned 15m</div></div>
  </div>
  <div class="card" style="padding:14px 16px;margin-bottom:14px;"><div style="font-size:12px;font-weight:700;margin-bottom:10px;">Station Flow Map — Click station to drill down</div><div class="station-map" id="stationMap"></div></div>
  <div class="card" style="padding:14px 16px;margin-bottom:14px;"><div style="font-size:12px;font-weight:700;margin-bottom:10px;">Hourly Output — ${l.id} vs Target</div><canvas id="ovLineChart" style="width:100%;height:90px;"></canvas></div>
  <div class="card" style="margin-bottom:14px;overflow:hidden;"><div style="padding:12px 16px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between;align-items:center;"><div style="font-size:12px;font-weight:700;">12 Stations — Click row or defect to trace</div></div><table class="tbl"><thead><tr><th>#</th><th>Station</th><th>Type</th><th>Units</th><th>Pass %</th><th>Cycle</th><th>Throughput</th><th>Defects</th></tr></thead><tbody>${STATIONS.map((s,i)=>{const pr=Math.round(s.pass/s.units*100);const pc=pr>=95?'var(--green)':pr>=85?'var(--amber)':'var(--red)';const bw=Math.round(s.units/320*100);const typeColors={INTAKE:'#eff6ff|#2563eb',MACHINE:'#ccfbf1|#0d9488',PRESS:'#fef3cd|#f59e0b',FINISH:'#e3f9f0|#00b96b',ASSEMBLY:'#eef2ff|#6366f1',WELD:'#fee2e2|#ef4444',THERMAL:'#fef3cd|#f59e0b',PAINT:'#eff6ff|#2563eb',ELEC:'#e3f9f0|#00b96b',QA:'#eef2ff|#6366f1'};const [bg,tc]=(typeColors[s.type]||'#f0f0f5|#6b6b7a').split('|');const dc=s.defects>3?'var(--red)':s.defects>0?'var(--amber)':'var(--muted)';return `<tr onclick="openTrace('${l.id} · ${s.name}','${s.type} station inspection','OP-${200+i}','SN-${1001+i}','BATCH-44B','INFO')"><td class="mono">ST-${String(i+1).padStart(2,'0')}</td><td style="font-weight:600;">${s.name}</td><td><span style="background:${bg};color:${tc};padding:2px 7px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-size:8px;font-weight:700;">${s.type}</span></td><td class="mono">${s.units}</td><td style="font-weight:700;color:${pc};">${pr}%</td><td class="mono">${s.cycle}</td><td><div class="prog-track" style="width:70px;"><div class="prog-fill" style="width:${bw}%;background:${pc};"></div></div></td><td style="color:${dc};font-weight:700;cursor:pointer;" onclick="event.stopPropagation();openTrace('${l.id} · ${s.name}','Defect trace — ${s.defects} defects','OP-${200+i}','SN-${1001+i}','BATCH-44B','${s.defects>3?'CRITICAL':s.defects>0?'WARNING':'INFO'}')">${s.defects>0?s.defects:'—'}</td></tr>`}).join('')}</tbody></table></div>
  <div style="display:grid;grid-template-columns:200px 1fr;gap:14px;margin-bottom:14px;"><div class="card" style="padding:14px 16px;"><div style="font-size:12px;font-weight:700;margin-bottom:10px;">Defect Split</div><canvas id="ovPie" width="168" height="168"></canvas><div style="display:flex;flex-direction:column;gap:6px;margin-top:10px;">${defCats.map(d=>`<div style="display:flex;align-items:center;gap:6px;cursor:pointer;" onclick="openTrace('${l.id}','${d.label} defect — investigation','QA-TEAM','MULTI','BATCH-44B','WARNING')"><div style="width:8px;height:8px;border-radius:50%;background:${d.c};flex-shrink:0;"></div><div style="font-size:11px;flex:1;font-weight:500;">${d.label}</div><div style="font-family:'JetBrains Mono',monospace;font-size:11px;font-weight:600;color:${d.c};">${d.n}</div></div>`).join('')}</div></div><div class="card" style="padding:14px 16px;"><div style="font-size:12px;font-weight:700;margin-bottom:4px;">Defects Per Hour</div><div class="mono" style="font-size:10px;color:var(--muted);margin-bottom:10px;">Click bar to trace batch</div><canvas id="ovDefBar" style="width:100%;height:130px;"></canvas></div></div>
  <div style="display:flex;gap:8px;margin-top:4px;"><button onclick="openActionDrawer('L-${l.id} — Escalate Issue','Escalate this line issue to maintenance and quality teams',[{label:'Raise Work Order',cls:'primary'},{label:'Quality Hold',cls:'danger'},{label:'Notify Team',cls:'secondary'}])" style="flex:1;padding:10px;border-radius:10px;background:var(--blue);color:#fff;font-size:12px;font-weight:700;">🔧 Raise Work Order</button><button onclick="openActionDrawer('Quality Hold — ${l.id}','Place quality hold and notify downstream',[{label:'Confirm Hold',cls:'danger'},{label:'Cancel',cls:'secondary'}])" style="flex:1;padding:10px;border-radius:10px;background:var(--red-l);color:var(--red);font-size:12px;font-weight:700;">⛔ Quality Hold</button><button onclick="openTrace('${l.id}','Export line report PDF','MANAGER','N/A','N/A','INFO')" style="flex:1;padding:10px;border-radius:10px;background:var(--surface3);color:var(--text);font-size:12px;font-weight:700;">📊 Export Report</button></div>`;
  const sm=document.getElementById('stationMap');
  if(sm){
    sm.innerHTML = STATIONS.map((s,i)=>{
      const pr=Math.round(s.pass/s.units*100);
      const cls=pr>=95?'green':pr>=85?'amber':'red';
      const c=SC[cls];
      return `${i>0?'<div class="smap-arrow">→</div>':''}<div class="smap-node ${cls}" onclick="openTrace('${l.id} · ${s.name}','Station status ${pr}% pass rate','OP-${200+i}','SN-${1001+i}','BATCH-44B','${cls==='red'?'CRITICAL':cls==='amber'?'WARNING':'INFO'}')"><div class="smap-id">ST-${String(i+1).padStart(2,'0')}</div><div class="smap-name">${s.name.split(' ')[0]}</div><div class="smap-eff" style="color:${c};">${pr}%</div></div>`;
    }).join('');
  }
  document.getElementById('overlay').classList.add('open');
  requestAnimationFrame(()=>{drawOvLineChart(l,SC[l.status]);drawOvPie(defCats,totalDef);drawOvDefBar();});
}

function doOvSearch(){
  const v=document.getElementById('ovSearch')?.value?.trim();
  if(v) openTrace('Search Result','Query: '+v,'OP-AUTO',v.startsWith('SN')?v:'SN-AUTO','BATCH-SRCH','INFO');
}

function openTrace(location,issue,operator,serial,batch,severity){
  const wo='WO-'+(52000+plantState.traceCounter++);
  const po='PO-2026-'+String(1000 + (plantState.traceCounter % 900)).padStart(3,'0');
  const shipDate=new Date(); shipDate.setDate(shipDate.getDate()+2);
  const ship=shipDate.toISOString().slice(0,10);
  const sc=severity==='CRITICAL'?'bad':severity==='WARNING'?'warn':severity==='INFO'?'hi':'good';
  document.getElementById('traceTitle').textContent='🔍 Traceability Record';
  document.getElementById('traceSub').textContent=`${location} · ${new Date().toLocaleString()}`;
  document.getElementById('traceBody').innerHTML=`
    <div class="trace-row"><div class="trace-key">Serial Number</div><div class="trace-val hi">${serial||'N/A'}</div></div>
    <div class="trace-row"><div class="trace-key">Batch ID</div><div class="trace-val hi">${batch||'N/A'}</div></div>
    <div class="trace-row"><div class="trace-key">Work Order</div><div class="trace-val">${wo}</div></div>
    <div class="trace-row"><div class="trace-key">Purchase Order</div><div class="trace-val">${po}</div></div>
    <div class="trace-row"><div class="trace-key">Shipment Date</div><div class="trace-val">${ship}</div></div>
    <div class="trace-row"><div class="trace-key">Location</div><div class="trace-val">${location}</div></div>
    <div class="trace-row"><div class="trace-key">Issue / Flag</div><div class="trace-val ${sc}">${issue}</div></div>
    <div class="trace-row"><div class="trace-key">Severity</div><div class="trace-val ${sc}">${severity||'INFO'}</div></div>
    <div class="trace-row"><div class="trace-key">Operator</div><div class="trace-val">${operator||'N/A'}</div></div>
    <div class="trace-row"><div class="trace-key">Timestamp</div><div class="trace-val">${new Date().toLocaleString()}</div></div>`;
  document.getElementById('traceActions').innerHTML=`
    <button onclick="closeTrace();openActionDrawer('Action for ${location}','Choose an action to resolve this issue',[{label:'Create WO',cls:'primary'},{label:'Quality Hold',cls:'danger'},{label:'Assign Owner',cls:'secondary'}])" style="flex:1;padding:8px;border-radius:8px;background:var(--blue);color:#fff;font-size:11px;font-weight:700;cursor:pointer;">Take Action →</button>
    <button onclick="closeTrace()" style="padding:8px 16px;border-radius:8px;background:var(--surface3);font-size:11px;font-weight:700;cursor:pointer;">Close</button>`;
  document.getElementById('trace-bg').classList.add('open');
}

function closeTrace(){document.getElementById('trace-bg').classList.remove('open');}
function handleTraceBg(e){if(e.target===document.getElementById('trace-bg')) closeTrace();}

function openActionDrawer(title,sub,actions){
  document.getElementById('adTitle').textContent=title;
  document.getElementById('adSub').textContent=sub;
  document.getElementById('adActions').innerHTML=actions.map(a=>`<button class="ad-btn ${a.cls}" onclick="closeDrawer();openTrace('${title}','Action: ${a.label}','MANAGER','N/A','N/A','INFO')">${a.label}</button>`).join('');
  document.getElementById('actionDrawer').classList.add('open');
}
function closeDrawer(){document.getElementById('actionDrawer').classList.remove('open');}

function openReportModal(type){
  const names={oee:'OEE Analytics Report',quality:'Quality & FPY Report',maintenance:'Maintenance Effectiveness',energy:'Energy Intensity Report',labor:'Labor Productivity',traceability:'Traceability & Genealogy'}[type]||'Report';
  openTrace(`Report: ${names}`,'Click to generate and download this report','SYSTEM','N/A','N/A','INFO');
}

function safeNumber(value, fallback = 0){
  return Number.isFinite(value) ? value : fallback;
}
function mergeArray(source, next){
  return Array.isArray(next) ? next.slice() : source.slice();
}
function syncPlantLinesFromOverview(overview){
  const currentTotal = plantState.lines.reduce((sum,line)=>sum+line.output,0) || 1;
  const newTotal = Math.max(currentTotal, safeNumber(overview.unitsProduced, currentTotal));
  const ratio = newTotal / currentTotal;
  const defectDelta = safeNumber(overview.totalDefects, plantState.overview.totalDefects || 0) - (plantState.overview.totalDefects || 0);
  const shareScale = plantState.lines.map(line=>line.output/currentTotal);
  plantState.lines = plantState.lines.map((line,i)=>{
    const desiredOutput = Math.round(Math.max(line.output, line.output * ratio));
    const output = Math.min(desiredOutput, Math.round(line.target * 1.15));
    const defects = Math.max(0, line.defects + Math.round(shareScale[i] * Math.max(defectDelta, 0)));
    const yieldValue = clamp(round1(overview.firstPassYield + (line.yield - plantState.overview.firstPassYield) * 0.05), 70, 100);
    const oeeValue = clamp(round1(overview.oee + (line.oee - plantState.overview.oee) * 0.05), 45, 99);
    const status = getStatusFromLine({ ...line, oee: oeeValue, yield: yieldValue });
    const downtimeMinutes = Math.max(line.downtimeMinutes || Number(String(line.downtime).replace('m','')) || 0, 0);
    return { ...line, output, defects, yield: yieldValue, oee: oeeValue, status, downtimeMinutes, downtime: `${downtimeMinutes}m` };
  });
  const actualTotal = plantState.lines.reduce((sum,line)=>sum+line.output,0);
  const fix = newTotal - actualTotal;
  if(fix !== 0 && plantState.lines.length){
    plantState.lines[plantState.lines.length-1].output += fix;
  }
}
function updateDerivedChartsFromTelemetry(){
  const ov = plantState.overview;
  const lastTrend = plantState.fpyTrend[plantState.fpyTrend.length-1] || ov.firstPassYield;
  const nextFpy = clamp(round1((lastTrend * 0.8) + (ov.firstPassYield * 0.2)), 90, 99);
  plantState.fpyTrend.push(nextFpy);
  if(plantState.fpyTrend.length > 14) plantState.fpyTrend.shift();
  const energyBase = 2.6 + ((100 - ov.quality) / 35) + ((95 - ov.performance) / 200);
  plantState.energy = plantState.energy.map(val => clamp(round1((val * 4 + energyBase) / 5), 2.4, 4.3));
  const microBase = clamp(18 + (100 - ov.oee) * 0.08 + ov.totalDefects * 0.02, 12, 42);
  plantState.downtime.micro = plantState.downtime.micro.map((value,i)=>clamp(round1(value + (microBase - value) * 0.05) + (i%2?0:0.2), 12, 42));
  const unplannedBase = clamp(44 + (100 - ov.oee) * 0.5 + ov.totalDefects * 0.1, 30, 85);
  plantState.downtime.unplanned = plantState.downtime.unplanned.map((value,i)=>clamp(round1(value + (unplannedBase - value) * 0.04), 30, 85));
  const plannedBase = clamp(42 + (ov.quality < 94 ? -1 : 0.5), 30, 60);
  plantState.downtime.planned = plantState.downtime.planned.map((value,i)=>clamp(round1(value + (plannedBase - value) * 0.03), 30, 60));
}
function applyTelemetryData(data){
  if(!data || !data.overview) return;
  const ov = data.overview;
  const previousOverview = { ...plantState.overview };
  plantState.overview = {
    oee: safeNumber(ov.oee, plantState.overview.oee),
    availability: safeNumber(ov.availability, plantState.overview.availability),
    performance: safeNumber(ov.performance, plantState.overview.performance),
    quality: safeNumber(ov.quality, plantState.overview.quality),
    unitsProduced: Math.max(safeNumber(ov.unitsProduced, plantState.overview.unitsProduced), plantState.overview.unitsProduced || 0),
    unitsTarget: safeNumber(ov.unitsTarget, plantState.overview.unitsTarget || 0),
    firstPassYield: safeNumber(ov.firstPassYield, plantState.overview.firstPassYield),
    totalDefects: Math.max(safeNumber(ov.totalDefects, 0), plantState.overview.totalDefects || 0),
    avgCycleTime: safeNumber(ov.avgCycleTime, plantState.overview.avgCycleTime),
    cycleTarget: safeNumber(ov.cycleTarget, plantState.overview.cycleTarget),
    otif: safeNumber(ov.otif, plantState.overview.otif),
    updatedAt: data.updatedAt || plantState.overview.updatedAt,
  };
  if(data.banner){
    plantState.bannerState = {
      ...plantState.bannerState,
      greeting: data.banner.greeting || plantState.bannerState.greeting,
      meta: data.banner.meta || plantState.bannerState.meta,
    };
  }
  if(data.throughput){
    plantState.throughput.today = mergeArray(plantState.throughput.today, data.throughput.today);
    plantState.throughput.yesterday = mergeArray(plantState.throughput.yesterday, data.throughput.yesterday);
    plantState.throughputLabels = mergeArray(plantState.throughputLabels, data.throughput.labels);
    plantState.throughputTarget = safeNumber(data.throughput.target, plantState.throughputTarget || 400);
  }
  if(Array.isArray(data.defectBreakdown)) plantState.defectBreakdown = data.defectBreakdown.map(item=>({ ...item }));
  if(Array.isArray(data.bottlenecks)) plantState.bottlenecks = data.bottlenecks.map(item=>({ ...item }));
  if(Array.isArray(data.shiftComparison)){
    plantState.shiftBars[0] = safeNumber(data.shiftComparison[0]?.v, plantState.shiftBars[0]);
    plantState.shiftBars[1] = safeNumber(data.shiftComparison[1]?.v, plantState.shiftBars[1]);
    plantState.shiftBars[2] = safeNumber(data.shiftComparison[2]?.v, plantState.shiftBars[2]);
    plantState.shiftBars[3] = safeNumber(data.shiftComparison[3]?.v, plantState.shiftBars[3]);
  }
  if(data.quality?.defectLog) plantState.defectLog = data.quality.defectLog.map(entry => ({ ...entry }));
  if(data.quality?.kpiSummary) plantState.kpiSummary = data.quality.kpiSummary.map(entry => ({ ...entry }));
  syncPlantLinesFromOverview(plantState.overview);
  updateDerivedChartsFromTelemetry();
  const threshold = 100 - plantState.overview.oee;
  plantState.safetyDays = Math.max(12, 15 - Math.round(threshold / 4));
  plantState.safetyNearMisses = Math.max(1, Math.round((100 - plantState.overview.quality) / 6));
  plantState.safetyAlertsOpen = Math.max(1, Math.round((100 - plantState.overview.quality) / 8));
  plantState.safetyRiskZone = plantState.lines.find(l=>l.status==='red')?.id || plantState.safetyRiskZone;
  plantState.bannerState = {
    ...plantState.bannerState,
    goodLines: plantState.lines.filter(l=>l.status==='green').length,
    warningLines: plantState.lines.filter(l=>l.status==='amber').length,
    criticalLines: plantState.lines.filter(l=>l.status==='red').length,
    safetyDays: plantState.safetyDays,
    assetsAtRisk: plantState.assets.filter(a=>a.status !== 'green').length,
  };
  plantState.alerts = plantState.alerts.map((alert,i)=>({
    ...alert,
    time: `${2 + i}m`, 
    status: i < 2 ? 'red' : 'amber',
    severity: i < 2 ? 'CRITICAL' : 'WARNING',
  }));
  plantState.assets = plantState.assets.map(asset=>{
    const healthAdjustment = ((100 - plantState.overview.oee) / 100) * 0.4;
    const health = clamp(round1(asset.health - healthAdjustment), 18, 100);
    const mtbf = clamp(round1(asset.mtbf - healthAdjustment * 0.16), 14, 140);
    const mttr = clamp(round1(asset.mttr + healthAdjustment * 0.03), 1.0, 6.0);
    const status = health < 40 ? 'red' : health < 65 ? 'amber' : 'green';
    return { ...asset, health, mtbf, mttr, status };
  });
}
async function fetchTelemetry(){
  if(isFetchingTelemetry) return;
  isFetchingTelemetry = true;
  const fetchStart = Date.now();
  try{
    const response = await fetch('/kpis?t=' + Date.now(), { cache: 'no-store' });
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const fetchTime = Date.now() - fetchStart;
    applyTelemetryData(data);
    updateDashboardUI();
    updateTelemetryTicker(data);
    updateSyncStatus(fetchTime);
    triggerLiveHeartbeat();
  }catch(err){
    console.error('Telemetry fetch failed:', err);
    updateSyncStatus(-1); // Error state
  }finally{
    isFetchingTelemetry = false;
    updateClock();
  }
}
function updateDashboardUI(){
  const ov = plantState.overview;
  const prev = plantState.prevKPIs || {};

  // delta colors per requirements
  const unitsDelta = (typeof prev.unitsProduced === 'number') ? (ov.unitsProduced - prev.unitsProduced) : 0;
  const defectsDelta = (typeof prev.totalDefects === 'number') ? (ov.totalDefects - prev.totalDefects) : 0;
  const fpyDelta = (typeof prev.firstPassYield === 'number') ? (ov.firstPassYield - prev.firstPassYield) : 0;

  const unitsPulseColor = unitsDelta > 0 ? 'var(--blue)' : 'var(--blue-l)';
  const defectsPulseColor = defectsDelta > 0 ? 'var(--red)' : 'var(--red-l)';
  const fpyPulseColor =
    fpyDelta >= 0
      ? 'var(--green)'
      : (fpyDelta <= -0.15 ? 'var(--red)' : 'var(--amber)');

  const oeeEl=document.getElementById('oeeValue'); if(oeeEl) updateValueWithAnimation(oeeEl, ov.oee, formatMetric, {colorVar:'var(--indigo)'});
  const availabilityEl=document.getElementById('availabilityValue'); if(availabilityEl) updateValueWithAnimation(availabilityEl, ov.availability, (v)=>formatMetric(v)+'%', {colorVar:'var(--teal)'});
  const performanceEl=document.getElementById('performanceValue'); if(performanceEl) updateValueWithAnimation(performanceEl, ov.performance, (v)=>formatMetric(v)+'%', {colorVar:'var(--blue)'});
  const qualityEl=document.getElementById('qualityValue'); if(qualityEl) updateValueWithAnimation(qualityEl, ov.quality, (v)=>formatMetric(v)+'%', {colorVar:'var(--indigo-l)'});

  const availFill=document.getElementById('availabilityFill'); if(availFill) availFill.style.width = Math.min(100,Math.max(0,ov.availability))+'%';
  const perfFill=document.getElementById('performanceFill'); if(perfFill) perfFill.style.width = Math.min(100,Math.max(0,ov.performance))+'%';
  const qualFill=document.getElementById('qualityFill'); if(qualFill) qualFill.style.width = Math.min(100,Math.max(0,ov.quality))+'%';

  const unitsProducedEl=document.getElementById('unitsProducedValue');
  if(unitsProducedEl) updateValueWithAnimation(unitsProducedEl, ov.unitsProduced, String, {colorVar: unitsPulseColor});

  const unitsTargetEl=document.getElementById('unitsTargetValue'); if(unitsTargetEl) unitsTargetEl.textContent = String(ov.unitsTarget);

  const fpyEl=document.getElementById('fpyValue');
  if(fpyEl) updateValueWithAnimation(fpyEl, ov.firstPassYield, (v)=>formatMetric(v)+'%', {colorVar: fpyPulseColor});

  const defectsEl=document.getElementById('totalDefectsValue');
  if(defectsEl) updateValueWithAnimation(defectsEl, ov.totalDefects, String, {colorVar: defectsPulseColor});

  const cycleEl=document.getElementById('avgCycleTimeValue'); if(cycleEl) updateValueWithAnimation(cycleEl, ov.avgCycleTime, (v)=>formatMetric(v)+'s', {colorVar:'var(--amber)'});

  const banGreeting=document.querySelector('.ban-greeting'); if(banGreeting) banGreeting.innerHTML = plantState.bannerState.greeting || `Good afternoon, <strong>Sarah.</strong> Plant running at <strong>${formatMetric(ov.oee)}% OEE</strong> — ${plantState.bannerState.warningLines} lines need your attention.`;
  const banMeta=document.querySelector('.ban-meta'); if(banMeta) banMeta.textContent = plantState.bannerState.meta || `${nowIso()} · PLANT 4 — PUNE NORTH · CUSTOMER OTIF: 96.4%`;

  const safetyDays = document.getElementById('safetyDaysValue'); if(safetyDays) updateValueWithAnimation(safetyDays, plantState.safetyDays, String);
  const safetyNearMisses = document.getElementById('safetyNearMisses'); if(safetyNearMisses) updateValueWithAnimation(safetyNearMisses, plantState.safetyNearMisses, String);
  const safetyAlerts = document.getElementById('safetyAlertsValue'); if(safetyAlerts) updateValueWithAnimation(safetyAlerts, plantState.safetyAlertsOpen, String);
  const safetyRiskZone = document.getElementById('safetyRiskZone'); if(safetyRiskZone) safetyRiskZone.textContent = plantState.safetyRiskZone;

  const alertBadge=document.querySelector('.bell-badge'); if(alertBadge) alertBadge.textContent = String(plantState.alerts.length);
  document.querySelectorAll('.top-alert .badge.red').forEach(el=>{el.textContent = `${plantState.alerts.length} open`;});

  plantState.refs.overviewLines && updateOverviewLineCards();
  updateLineTableAndLeague();
  buildAlertItems();
  buildDefectTable();
  drawThroughput();
  drawDefectDonut();
  drawBottlenecks();
  drawShiftBars();
  drawFPYChart();
  drawParetoChart();
  drawFatigueChart();
  drawFPYTrendChart();
  drawQuadrant();
  drawDowntimeChart();
  drawMTBFChart();
  drawEnergyChart();
  buildAssetRiskList();
  buildMaintTimeline();
  buildKPISummaryTable();
  buildScheduledReports();

  // Draw live sparklines with continuously updating data
  if(plantState.sparks) {
    sparkline('spk1', plantState.sparks.spk1, '#2563eb');
    sparkline('spk2', plantState.sparks.spk2, '#00b96b');
    sparkline('spk3', plantState.sparks.spk3, '#ef4444');
    sparkline('spk4', plantState.sparks.spk4, '#f59e0b');
  }

  // update cache after successful UI update
  plantState.prevKPIs = {
    unitsProduced: ov.unitsProduced,
    totalDefects: ov.totalDefects,
    firstPassYield: ov.firstPassYield,
    oee: ov.oee,
    availability: ov.availability,
    performance: ov.performance,
    quality: ov.quality,
    avgCycleTime: ov.avgCycleTime,
  };
}

let lastTelemetryData = null;
const tickerEvents = [
  'L-03 throughput increased +2.1%',
  'Weld deviation detected on ST-07',
  'Micro-stop resolved on L-05',
  'FPY improved to 94.5%',
  'Predictive maintenance alert acknowledged',
  'OEE stabilization window active',
  'QA hold cleared on L-03',
  'Cycle time variance tightening',
  'Inline inspection sampling executed',
  'Thermal drift detected · compensation applied',
];

let tickerTimer = null;
let tickerPhase = 0;

function pickTelemetryEvent(prev, curr) {
  if(!prev || !curr) return tickerEvents[0];

  const dUnits = curr.unitsProduced - prev.unitsProduced;
  const dDef = curr.totalDefects - prev.totalDefects;
  const dFpy = curr.firstPassYield - prev.firstPassYield;
  const dOee = curr.oee - prev.oee;

  // Presence-optimized selection with subtle realism.
  if(dUnits >= 3) return `Production flow: +${dUnits} units streamed`;
  if(dDef >= 1) return `WIP anomaly: defects +${dDef} detected`;
  if(dFpy >= 0.1) return `FPY improved to ${curr.firstPassYield.toFixed(1)}%`;
  if(dOee >= 0.2) return `OEE improved to ${curr.oee.toFixed(1)}%`;
  if(dOee <= -0.2) return `OEE drift: ${curr.oee.toFixed(1)}% · watch trend`;
  return tickerEvents[tickerPhase % tickerEvents.length];
}

function setTickerAnimated(text) {
  const tickerEl = document.getElementById('telemetryTicker');
  if (!tickerEl) return;

  // fade + slide horizontally slightly (no layout shift)
  tickerEl.style.transition = 'opacity 220ms ease, transform 220ms ease';
  tickerEl.style.opacity = '0';
  tickerEl.style.transform = 'translateX(-8px)';

  setTimeout(() => {
    tickerEl.textContent = text;
    tickerEl.style.opacity = '1';
    tickerEl.style.transform = 'translateX(0px)';
  }, 230);
}

function updateTelemetryTicker(data) {
  const tickerEl = document.getElementById('telemetryTicker');
  if (!tickerEl) return;

  const prev = lastTelemetryData?.overview;
  const curr = data?.overview;

  const message = pickTelemetryEvent(prev, curr);
  tickerPhase++;

  setTickerAnimated(message);

  lastTelemetryData = JSON.parse(JSON.stringify(data)); // Deep copy
}

function startTelemetryTicker() {
  const tickerEl = document.getElementById('telemetryTicker');
  if (!tickerEl) return;
  if (tickerTimer) return;

  // Rotate independent of fetch cadence for perceived liveness (2–3s).
  let localPrev = null;

  tickerTimer = setInterval(() => {
    const curr = plantState.overview;
    const message = pickTelemetryEvent(localPrev, curr);
    setTickerAnimated(message);
    localPrev = { ...curr };
  }, 2400);
}

let lastSuccessfulSyncAt = null;
let syncAgeTimer = null;

function updateSyncStatus(fetchTime) {
  const syncEl = document.getElementById('syncStatus');
  if (!syncEl) return;

  if (fetchTime === -1) {
    syncEl.textContent = 'Last Sync: ERROR';
    syncEl.style.color = 'var(--red)';
    return;
  }

  const now = Date.now();
  lastSuccessfulSyncAt = now;

  const color = fetchTime < 200 ? 'var(--green)' : fetchTime < 500 ? 'var(--amber)' : 'var(--blue)';
  syncEl.style.color = color;
  syncEl.textContent = `Last Sync: ${fetchTime}ms ago`;
}

function startSyncAgeTicker() {
  const syncEl = document.getElementById('syncStatus');
  if (!syncEl) return;
  if (syncAgeTimer) return;

  syncAgeTimer = setInterval(() => {
    if (!lastSuccessfulSyncAt) {
      syncEl.textContent = 'Last Sync: 0.0s ago';
      syncEl.style.color = 'var(--green)';
      return;
    }
    const ageMs = Date.now() - lastSuccessfulSyncAt;
    const ageS = Math.max(0, ageMs / 1000);
    syncEl.textContent = `Last Sync: ${ageS.toFixed(1)}s ago`;
  }, 100);
}

function triggerLiveHeartbeat() {
  const liveChip = document.querySelector('.live-chip');
  if (!liveChip) return;

  // Heartbeat pulse on successful update; lightweight inline effect.
  liveChip.style.transition = 'transform 180ms ease-out, filter 180ms ease-out, box-shadow 180ms ease-out';
  liveChip.style.transform = 'scale(1.02)';
  liveChip.style.filter = 'brightness(1.06)';
  liveChip.style.boxShadow = '0 0 0 2px rgba(0,185,107,0.22), 0 0 18px 2px rgba(0,185,107,0.15)';

  setTimeout(() => {
    liveChip.style.transform = 'scale(1)';
    liveChip.style.filter = 'none';
    liveChip.style.boxShadow = 'none';
  }, 520);
}

function updateOverviewLineCards(){
  const cards = document.querySelectorAll('#overviewLinesGrid .line-card');
  cards.forEach((card,index)=>{
    const line = plantState.lines[index];
    if(!line) return;
    const outputEl = card.querySelector('[data-line-field="output"]');
    const attEl = card.querySelector('[data-line-field="attainment"]');
    const fillEl = card.querySelector('[data-line-field="progress"]');
    const oeeEl = card.querySelector('[data-line-field="oee"]');
    if(outputEl) outputEl.textContent = String(line.output);
    if(attEl) attEl.textContent = `${Math.round(line.output/line.target*100)}%`;
    if(fillEl) fillEl.style.width = `${Math.round(line.output/line.target*100)}%`;
    if(oeeEl) oeeEl.textContent = `${line.oee}%`;
    card.className = `line-card ${line.status}`;
    const badge = card.querySelector('.badge');
    if(badge) badge.className = `badge ${line.status}`;
    const pip = card.querySelector('.pip');
    if(pip) pip.className = `pip ${line.status}`;
    const col = SC[line.status];
    if(outputEl) outputEl.style.color = col;
    if(fillEl) fillEl.style.background = col;
  });
}

function updateLineTableAndLeague(){
  buildLinesTable(plantState.lines);
  buildLeagueTable();
  drawTaktChart();
}

function simulatePlantTick(){
  plantState.tick++;
  const idx = plantState.tick % 5;
  const outputDeltas = {green:[2,3,1,2,2],amber:[1,1,0,1,1],red:[0,1,0,0,1]};
  const defectDeltas = {green:[0,0,0,0,0],amber:[0,0,1,0,0],red:[0,1,0,1,0]};
  const cycleDeltas = {green:[0,-0.1,0,0.1,0],amber:[0.1,0.1,-0.1,0,0.2],red:[0.2,0.1,0.1,-0.1,0.3]};
  const downtimeDeltas = {green:[0,0,0,0,0],amber:[0,1,0,0,1],red:[1,0,1,0,1]};

  plantState.lines.forEach(line=>{
    const status = line.status;
    const outputIncrease = outputDeltas[status][idx];
    line.output = Math.round(Math.max(line.output + outputIncrease, line.output));
    line.output = Math.min(line.output, Math.round(line.target * 1.15));
    line.defects += defectDeltas[status][idx];
    line.defects = Math.max(line.defects, 0);
    line.cycle = clamp(round1(line.cycle + cycleDeltas[status][idx]), 35, 90);
    const downtimeAdd = downtimeDeltas[status][idx];
    line.downtimeMinutes += downtimeAdd;
    line.downtime = `${line.downtimeMinutes}m`;
    line.microStops += downtimeAdd;
    const qualityLoss = clamp(line.defects / Math.max(1, line.output) * 120, 0, 18);
    line.yield = clamp(round1(100 - qualityLoss), 70, 99.9);
    line.oee = clamp(round1((100 - line.downtimeMinutes/1.5) * 0.6 + line.yield * 0.4 - (line.cycle - line.takt) * 0.1), 45, 98);
    line.status = getStatusFromLine(line);
  });

  derivePlantOverview();
  plantState.overview.oee = clamp(round1(plantState.overview.oee + [0.0,0.1,-0.1,0.0,0.1][idx]), 80, 83.5);
  plantState.overview.avgCycleTime = clamp(round1(plantState.overview.avgCycleTime + [0,0.1,-0.1,0.1,0][idx]), 42, 52);
  plantState.overview.firstPassYield = clamp(round1(plantState.overview.firstPassYield + [0,0,-0.1,0,0.1][idx]), 93.5, 96.5);
  plantState.overview.totalDefects = Math.max(plantState.overview.totalDefects, plantState.lines.reduce((acc,l)=>acc+l.defects,0));

  const today = plantState.throughput.today;
  const nextThroughput = clamp(today[today.length-1] + [2,1,0,2,1][idx], 330, 470);
  today.push(nextThroughput);
  if(today.length > 8) today.shift();
  plantState.throughputLabels.push(nextThroughputLabel());
  if(plantState.throughputLabels.length > 8) plantState.throughputLabels.shift();

  plantState.shiftBars[3] = clamp(plantState.shiftBars[3] + [5,-2,3,0,4][idx], 3700, 3900);
  plantState.fpyTrend.push(clamp(round1(plantState.overview.firstPassYield + (idx===2?-0.2:0))), 92.5, 96.5);
  if(plantState.fpyTrend.length > 14) plantState.fpyTrend.shift();
  plantState.fatigue = plantState.fatigue.map((value,i)=>clamp(value + [0,1,0,-1,0,0,1,0][i%8], 0, 7));
  plantState.downtime.micro = plantState.downtime.micro.map((value,i)=>clamp(value + [0,0,1,-1,0,0,1][i%7], 12, 42));
  plantState.downtime.unplanned = plantState.downtime.unplanned.map((value,i)=>clamp(value + [0,-1,0,1,0,0,-1][i%7], 30, 85));
  plantState.downtime.planned = plantState.downtime.planned.map((value,i)=>clamp(value + [0,1,0,-1,0,1,0][i%7], 30, 60));
  plantState.energy = plantState.energy.map((value,i)=>clamp(round1(value + [0,0.1,-0.1,0,0,0.05,-0.05,0,0,0][i%10]), 2.4, 4.3));
  plantState.defectBreakdown[0].n = clamp(8 + Math.floor(plantState.tick % 3), 6, 10);
  plantState.defectBreakdown[1].n = clamp(6 + Math.floor((plantState.tick+1) % 2), 5, 8);
  plantState.defectBreakdown[2].n = clamp(5 + Math.floor((plantState.tick+2) % 2), 4, 7);
  plantState.defectBreakdown[3].n = clamp(3 + Math.floor((plantState.tick+3) % 2), 2, 5);
  plantState.defectBreakdown[4].n = clamp(2 + Math.floor((plantState.tick+4) % 2), 2, 4);

  plantState.bottlenecks[0].m = 72 + Math.floor((plantState.tick % 3));
  plantState.bottlenecks[1].m = 48 + Math.floor((plantState.tick % 2));

  plantState.assets.forEach(asset=>{
    if(asset.status === 'red'){
      asset.health = clamp(asset.health - 0.1, 16, 24);
      asset.mtbf = clamp(round1(asset.mtbf - 0.2), 14, 20);
      asset.mttr = clamp(round1(asset.mttr + 0.02), 3.8, 4.4);
    } else if(asset.status==='amber'){
      asset.health = clamp(asset.health - 0.05, 42, 62);
      asset.mtbf = clamp(round1(asset.mtbf - 0.1), 40, 70);
      asset.mttr = clamp(round1(asset.mttr + 0.01), 2.8, 3.2);
    }
    if(asset.health < 40) asset.status='red';
    else if(asset.health < 65) asset.status='amber';
    else asset.status='green';
  });

  const warnings = plantState.lines.filter(l=>l.status==='amber').length;
  const criticals = plantState.lines.filter(l=>l.status==='red').length;
  plantState.bannerState.warningLines = warnings;
  plantState.bannerState.criticalLines = criticals;
  plantState.bannerState.goodLines = 10 - warnings - criticals;
  plantState.safetyAlertsOpen = Math.max(1, criticals);
  plantState.safetyDays = Math.max(12, 14 - Math.floor(criticals/2));
  plantState.safetyRiskZone = plantState.lines.find(l=>l.status==='red')?.id || 'L-07';
  if(criticals>0){
    plantState.alerts = plantState.alerts.map((alert,i)=>({
      ...alert,
      time: `${2 + i + idx}m`,
      severity: i===0?'CRITICAL':i===1?'CRITICAL':'WARNING',
      status: i<2?'red':'amber',
    }));
  }
}

function startRealtimeLoop(){
  updateClock();
  updateBannerTimestamp();
  fetchTelemetry();

  // Banner time every second
  setInterval(() => {
    try { updateBannerTimestamp(); } catch (e) { /* DEBUG */ console.error('banner tick failed', e); }
  }, 1000);

  // ticker & sync age presence (may be missing in some HTML variants; never let it break the loop)
  try { startTelemetryTicker(); } catch (e) { /* DEBUG */ console.error('startTelemetryTicker failed', e); }
  try { startSyncAgeTicker(); } catch (e) { /* DEBUG */ console.error('startSyncAgeTicker failed', e); }

  // Start throughput rAF animator once (visible streaming even between fetches)
  try { startThroughputAnimator(); } catch (e) { /* DEBUG */ console.error('startThroughputAnimator failed', e); }

  // Fetch telemetry from backend every 1 second
  setInterval(() => {
    try {
      fetchTelemetry();

      // Between backend fetches, evolve telemetry continuously (so KPIs never look frozen)
      evolveTelemetryRealistic();

      // Render directly to existing DOM structure to avoid selector mismatches stopping updates.
      syncRealtimeDOMForDashboard();
    } catch (e) {
      /* DEBUG */ console.error('realtime loop tick failed (interval continues)', e);
    }
  }, 1000);
}

function renderLinesTab(){
  buildLinesGrid(plantState.lines,'linesTabGrid');
  buildLinesTable(plantState.lines);
  buildLeagueTable();
  drawTaktChart();
}

function renderQualityTab(){
  buildDefectTable();
  drawFPYChart();
  drawParetoChart();
  drawFatigueChart();
  drawFPYTrendChart();
}

function renderMaintenanceTab(){
  buildAssetRiskList();
  buildMaintTimeline();
  drawQuadrant();
  drawDowntimeChart();
  drawMTBFChart();
}

function renderReportsTab(){
  buildKPISummaryTable();
  drawEnergyChart();
  buildScheduledReports();
}

function filterLinesStatus(btn,f){
  document.querySelectorAll('#tab-lines .filter-chip').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  const filtered = f==='all'?plantState.lines:plantState.lines.filter(l=>l.status===f);
  buildLinesGrid(filtered,'linesTabGrid');
  buildLinesTable(filtered);
}

function filterLinesTab(q){
  const filtered=plantState.lines.filter(l=>l.id.toLowerCase().includes(q.toLowerCase())||l.name.toLowerCase().includes(q.toLowerCase()));
  buildLinesGrid(filtered,'linesTabGrid');
  buildLinesTable(filtered);
}

function doQualSearch(){
  const v=document.getElementById('qualSearch').value.trim();
  if(v) openTrace('Quality Search','Search query: '+v,'QA-SYSTEM',v,'AUTO','INFO');
}

window.addEventListener('DOMContentLoaded',()=>{
  initializePlantState();
  initOverview();
  renderLinesTab();
  renderQualityTab();
  renderMaintenanceTab();
  renderReportsTab();
  startRealtimeLoop();
  document.getElementById('overlay')?.addEventListener('click',e=>{if(e.target===document.getElementById('overlay')) closeOverlay();});
  document.getElementById('trace-bg')?.addEventListener('click',handleTraceBg);
});

function closeOverlay(){document.getElementById('overlay')?.classList.remove('open');}
