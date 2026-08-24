/* ═══════════════════════════════════════════════════════════════════
   CLASSIFICA MARCATORI SERIE A — calciodangolo.com
   Widget autocontenuto via Cloudflare Worker proxy
   Con filtri Ruolo e Squadra + sort intestazioni (incl. Pres./Min./Gol-min) + paginazione
   ═══════════════════════════════════════════════════════════════════ */
(function(){
"use strict";
var root=document.getElementById("cdaMarcatoriWidget");
if(!root){console.error("cdaMarcatoriWidget non trovato");return}
var PROXY=root.getAttribute("data-proxy")||"",
    LEAGUE_ID=root.getAttribute("data-league")||"384",
    PP=15,
    PH="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect width='60' height='60' rx='30' fill='%23e0e0e0'/%3E%3Ctext x='50%25' y='54%25' text-anchor='middle' font-family='Arial' font-size='22' fill='%23999'%3E%3F%3C/text%3E%3C/svg%3E";

var allData=[],page=1,sortKey="goals",sortDir=-1;
var filterRole="",filterTeam="";
var posMap={24:"P",25:"D",26:"C",27:"A"};
var roleOrder=["P","D","C","A"];
var teamMap={"AC Milan":"Milan","ACF Fiorentina":"Fiorentina","AS Roma":"Roma","Atalanta BC":"Atalanta","Bologna FC":"Bologna","Bologna FC 1909":"Bologna","Cagliari Calcio":"Cagliari","Como 1907":"Como","Frosinone Calcio":"Frosinone","Genoa CFC":"Genoa","Inter":"Inter","Internazionale":"Inter","SS Lazio":"Lazio","Lazio":"Lazio","SSC Napoli":"Napoli","US Lecce":"Lecce","Lecce":"Lecce","US Sassuolo":"Sassuolo","Sassuolo Calcio":"Sassuolo","AC Monza":"Monza","Parma Calcio 1913":"Parma","Parma":"Parma","Torino FC":"Torino","Udinese Calcio":"Udinese","Udinese":"Udinese","Venezia FC":"Venezia","Juventus FC":"Juventus","Juventus":"Juventus","Napoli":"Napoli","Roma":"Roma","Milan":"Milan","Atalanta":"Atalanta","Bologna":"Bologna","Cagliari":"Cagliari","Como":"Como","Frosinone":"Frosinone","Genoa":"Genoa","Monza":"Monza","Sassuolo":"Sassuolo","Torino":"Torino","Venezia":"Venezia","Fiorentina":"Fiorentina"};

var cols=[
  {key:"pos",label:"#",num:true,cls:"n",w:"width:40px"},
  {key:"name",label:"Calciatore",num:false,cls:""},
  {key:"role",label:"Ruolo",num:false,cls:"n"},
  {key:"team",label:"Sq.",num:false,cls:"n",w:"width:52px"},
  {key:"goals",label:"Gol",num:true,cls:"n"},
  {key:"apps",label:"Pres.",num:true,cls:"n"},
  {key:"mins",label:"Min.",num:true,cls:"n"},
  {key:"goalsPerMin",label:"Min/Gol",num:true,cls:"n"}
];

/* ── CSS ── */
var s=document.createElement("style");
s.textContent=[
"#cdaMarcatoriWidget{font-family:Helvetica Neue,Helvetica,Arial,sans-serif!important;color:#222!important;max-width:100%!important;box-sizing:border-box!important}",
"#cdaMarcatoriWidget *{box-sizing:border-box!important}",
".cda-m-header{background:#007d45!important;color:#fff!important;padding:18px 22px!important;border-radius:10px 10px 0 0!important;display:flex!important;align-items:center!important;justify-content:space-between!important;flex-wrap:wrap!important;gap:10px!important}",
".cda-m-header h3{margin:0!important;font-size:17px!important;font-weight:700!important;letter-spacing:0.3px!important;color:#fff!important}",
".cda-m-header .cda-m-badge{font-size:11px!important;background:rgba(255,255,255,0.2)!important;padding:3px 10px!important;border-radius:20px!important;font-weight:500!important}",
".cda-m-filters{display:flex!important;align-items:center!important;gap:10px!important;padding:12px 22px!important;background:#f5f5f5!important;border-left:1px solid #e0e0e0!important;border-right:1px solid #e0e0e0!important;flex-wrap:wrap!important}",
".cda-m-filters label{font-size:12px!important;color:#555!important;font-weight:600!important;text-transform:uppercase!important;letter-spacing:0.3px!important}",
".cda-m-filters select{padding:5px 28px 5px 10px!important;font-size:13px!important;font-weight:500!important;border:1px solid #ccc!important;border-radius:6px!important;background:#fff url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23666'/%3E%3C/svg%3E\") no-repeat right 10px center!important;appearance:none!important;-webkit-appearance:none!important;cursor:pointer!important;color:#333!important;min-width:120px!important}",
".cda-m-filters select:hover{border-color:#007d45!important}",
".cda-m-filters select:focus{outline:none!important;border-color:#007d45!important;box-shadow:0 0 0 2px rgba(0,125,69,0.15)!important}",
".cda-m-table{width:100%!important;border-collapse:collapse!important;font-size:14px!important;border-left:1px solid #e0e0e0!important;border-right:1px solid #e0e0e0!important}",
".cda-m-table thead th{background:#f8f8f8!important;color:#555!important;font-size:11px!important;font-weight:700!important;text-transform:uppercase!important;letter-spacing:0.5px!important;padding:11px 10px!important;text-align:left!important;border-bottom:2px solid #e0e0e0!important;white-space:nowrap!important;cursor:pointer!important;user-select:none!important;transition:background 0.12s!important}",
".cda-m-table thead th:hover{background:#e8f5ee!important}",
".cda-m-table thead th.n{text-align:center!important}",
".cda-m-table thead th.sorted{background:#e0f0e8!important;color:#007d45!important}",
".cda-m-table thead th .ar{margin-left:4px!important;font-size:10px!important;opacity:0.45!important}",
".cda-m-table thead th.sorted .ar{opacity:1!important;color:#007d45!important}",
".cda-m-table tbody td{padding:10px 10px!important;border-bottom:1px solid #ececec!important;vertical-align:middle!important}",
".cda-m-table tbody tr:hover{background:#e8f5ee!important}",
".cda-m-table tbody tr:nth-child(even){background:#fafafa!important}",
".cda-m-table tbody tr:nth-child(even):hover{background:#e8f5ee!important}",
".cda-m-pos{text-align:center!important;font-weight:800!important;font-size:15px!important;color:#bbb!important;width:40px!important}",
".cda-m-pos.top3{color:#007d45!important}",
".cda-m-player{display:flex!important;align-items:center!important;gap:12px!important}",
".cda-m-player img{width:42px!important;height:42px!important;border-radius:50%!important;object-fit:cover!important;border:2px solid #e8e8e8!important;flex-shrink:0!important;background:#f0f0f0!important}",
".cda-m-player .nm{font-weight:700!important;font-size:14px!important;color:#1a1a1a!important;line-height:1.2!important}",
".cda-m-team{display:flex!important;align-items:center!important;justify-content:center!important}",
".cda-m-team img{width:24px!important;height:24px!important;object-fit:contain!important;flex-shrink:0!important}",
".cda-m-stat{text-align:center!important;font-weight:600!important;font-size:14px!important;color:#333!important}",
".cda-m-stat.hi{font-size:18px!important;font-weight:800!important;color:#007d45!important}",
".cda-m-stat.mut{color:#888!important;font-weight:500!important}",
".cda-m-pag{display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;padding:16px 22px!important;background:#f8f8f8!important;border:1px solid #e0e0e0!important;border-top:none!important;border-radius:0 0 10px 10px!important}",
".cda-m-pag button{min-width:36px!important;height:36px!important;border:1px solid #ddd!important;background:#fff!important;border-radius:6px!important;cursor:pointer!important;font-size:13px!important;font-weight:600!important;color:#444!important;transition:all 0.15s!important;display:flex!important;align-items:center!important;justify-content:center!important}",
".cda-m-pag button:hover{border-color:#007d45!important;color:#007d45!important}",
".cda-m-pag button.active{background:#007d45!important;color:#fff!important;border-color:#007d45!important}",
".cda-m-pag button:disabled{opacity:0.4!important;cursor:default!important}",
".cda-m-loading{text-align:center!important;padding:60px 20px!important;border:1px solid #e0e0e0!important;border-top:none!important}",
".cda-m-loading .spinner{display:inline-block!important;width:36px!important;height:36px!important;border:3px solid #e0e0e0!important;border-top-color:#007d45!important;border-radius:50%!important;animation:cdaSpinM 0.8s linear infinite!important}",
"@keyframes cdaSpinM{to{transform:rotate(360deg)}}",
".cda-m-loading p{margin:14px 0 0!important;font-size:14px!important;color:#888!important}",
".cda-m-error{text-align:center!important;padding:40px 20px!important;border:1px solid #e0e0e0!important;border-top:none!important;border-radius:0 0 10px 10px!important;color:#c0392b!important;font-size:14px!important}",
".cda-m-empty{text-align:center!important;padding:50px 20px!important;border:1px solid #e0e0e0!important;border-top:none!important;border-radius:0 0 10px 10px!important;color:#888!important;font-size:14px!important}",
"@media(max-width:640px){.cda-m-header{padding:14px 16px!important}.cda-m-header h3{font-size:15px!important}.cda-m-filters{padding:10px 16px!important;gap:8px!important}.cda-m-filters select{min-width:100px!important;font-size:12px!important}.cda-m-table thead th,.cda-m-table tbody td{padding:8px 5px!important;font-size:11px!important}.cda-m-table thead th{font-size:9.5px!important}.cda-m-player img{width:34px!important;height:34px!important}.cda-m-player .nm{font-size:12px!important}.cda-m-team img{width:19px!important;height:19px!important}.cda-m-stat{font-size:11.5px!important}.cda-m-stat.hi{font-size:14px!important}.cda-m-pag button{min-width:30px!important;height:30px!important;font-size:12px!important}}"
].join("\n");
document.head.appendChild(s);

/* ── Initial HTML ── */
root.innerHTML='<div class="cda-m-header"><h3>Classifica marcatori Serie A</h3><span class="cda-m-badge">caricamento...</span></div><div class="cda-m-loading"><div class="spinner"></div><p>Caricamento classifica marcatori\u2026</p></div>';

/* ── Fetch ── */
if(!PROXY){showError("Proxy URL mancante.");return}

fetchJSON(PROXY+"/leagues/"+LEAGUE_ID+"?include=currentSeason")
.then(function(res){
  var season=res.data&&res.data.currentseason;
  if(!season) throw new Error("Stagione non trovata");
  var badge=root.querySelector(".cda-m-badge");
  if(badge&&season.name) badge.textContent=season.name;
  return fetchAllPages(season.id);
})
.then(function(items){
  allData=processItems(items);
  if(allData.length===0){showEmpty("Nessun dato disponibile. La stagione potrebbe non essere ancora iniziata.");return}
  buildFilters();
  render();
})
.catch(function(err){
  console.error("CDA Marcatori Widget:",err);
  showError("Errore: "+err.message);
});

function fetchJSON(url){return fetch(url).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json()})}

function fetchAllPages(seasonId){
  var base=PROXY+"/topscorers/seasons/"+seasonId+"?include=player.statistics.details;participant&filters=seasontopscorerTypes:208;playerStatisticDetailTypes:321,119;playerStatisticSeasons:"+seasonId+"&per_page=50";
  var all=[],pg=1;
  function next(){
    return fetchJSON(base+"&page="+pg).then(function(res){
      if(res.data)all=all.concat(res.data);
      if(res.pagination&&res.pagination.has_more&&pg<5){pg++;return next()}
      return all;
    });
  }
  return next();
}

function statDetail(p,typeId){
  var stats=(p.statistics&&p.statistics[0]&&p.statistics[0].details)||[];
  for(var i=0;i<stats.length;i++){
    if(stats[i].type_id===typeId){
      var v=stats[i].value;
      return v&&typeof v.total==="number"?v.total:null;
    }
  }
  return null;
}

function processItems(items){
  return items.map(function(item,i){
    var p=item.player||{},t=item.participant||{};
    var name=p.common_name||p.display_name||((p.firstname||"")+" "+(p.lastname||"")).trim()||"\u2013";
    var parts=name.split(" ");
    var surname=parts.length>1?parts.slice(1).join(" "):parts[0];
    var rawTeam=t.name||t.short_code||"\u2013";
    var goals=item.total||0;
    var apps=statDetail(p,321);
    var mins=statDetail(p,119);
    var goalsPerMin=(goals>0&&mins!==null)?Math.round(mins/goals):null;
    return {
      pos:item.position||(i+1),
      playerName:name,
      surname:surname,
      playerImg:p.image_path||PH,
      role:posMap[p.position_id]||"\u2013",
      teamName:teamMap[rawTeam]||rawTeam,
      teamImg:t.image_path||"",
      goals:goals,
      apps:apps,
      mins:mins,
      goalsPerMin:goalsPerMin
    };
  });
}

/* ── Filters ── */
function buildFilters(){
  var teams=[];
  allData.forEach(function(d){if(teams.indexOf(d.teamName)===-1)teams.push(d.teamName)});
  teams.sort(function(a,b){return a.localeCompare(b,"it")});

  var html='<div class="cda-m-filters">';
  html+='<label>Ruolo:</label><select id="cdaMFilterRole"><option value="">Tutti</option>';
  roleOrder.forEach(function(r){html+='<option value="'+r+'">'+r+'</option>'});
  html+='</select>';
  html+='<label>Squadra:</label><select id="cdaMFilterTeam"><option value="">Tutte</option>';
  teams.forEach(function(t){html+='<option value="'+esc(t)+'">'+esc(t)+'</option>'});
  html+='</select></div>';

  root.querySelector(".cda-m-header").insertAdjacentHTML("afterend",html);

  document.getElementById("cdaMFilterRole").addEventListener("change",function(){
    filterRole=this.value;page=1;render();
  });
  document.getElementById("cdaMFilterTeam").addEventListener("change",function(){
    filterTeam=this.value;page=1;render();
  });
}

/* ── Sort & render ── */
function getVal(row,key){
  if(key==="pos")return row.pos;
  if(key==="name")return row.surname;
  if(key==="role")return row.role;
  if(key==="team")return row.teamName;
  if(key==="goals")return row.goals;
  if(key==="apps")return row.apps===null?-1:row.apps;
  if(key==="mins")return row.mins===null?-1:row.mins;
  if(key==="goalsPerMin")return row.goalsPerMin===null?999999:row.goalsPerMin;
  return "";
}

function getFiltered(){
  return allData.filter(function(d){
    if(filterRole&&d.role!==filterRole)return false;
    if(filterTeam&&d.teamName!==filterTeam)return false;
    return true;
  });
}

function doSort(data){
  var sorted=data.slice();
  sorted.sort(function(a,b){
    var va=getVal(a,sortKey),vb=getVal(b,sortKey),cmp;
    if(typeof va==="number")cmp=(va-vb)*sortDir;
    else cmp=String(va).localeCompare(String(vb),"it")*sortDir;
    if(cmp!==0)return cmp;
    return b.goals-a.goals;
  });
  for(var i=0;i<sorted.length;i++)sorted[i].pos=i+1;
  return sorted;
}

function render(){
  var filtered=getFiltered();
  var data=doSort(filtered);
  var tp=Math.ceil(data.length/PP);
  if(page>tp)page=tp;if(page<1)page=1;
  var st=(page-1)*PP,pd=data.slice(st,st+PP);

  var old=root.querySelector(".cda-m-table");if(old)old.remove();
  var oldP=root.querySelector(".cda-m-pag");if(oldP)oldP.remove();
  var oldL=root.querySelector(".cda-m-loading");if(oldL)oldL.remove();
  var oldE=root.querySelector(".cda-m-error");if(oldE)oldE.remove();
  var oldM=root.querySelector(".cda-m-empty");if(oldM)oldM.remove();

  if(data.length===0){
    var insertAfter=root.querySelector(".cda-m-filters")||root.querySelector(".cda-m-header");
    insertAfter.insertAdjacentHTML("afterend",'<div class="cda-m-empty">Nessun giocatore trovato con questi filtri.</div>');
    return;
  }

  var h='<table class="cda-m-table"><thead><tr>';
  cols.forEach(function(c){
    var isSorted=sortKey===c.key;
    var arrow=isSorted?(sortDir===1?"\u25B2":"\u25BC"):"\u21C5";
    var sc=isSorted?" sorted":"";
    var sty=c.w?' style="'+c.w+'"':"";
    h+='<th class="'+c.cls+sc+'" data-k="'+c.key+'"'+sty+'>'+c.label+'<span class="ar">'+arrow+'</span></th>';
  });
  h+="</tr></thead><tbody>";

  pd.forEach(function(r){
    h+="<tr>";
    h+='<td class="cda-m-pos'+(r.pos<=3?" top3":"")+'">'+r.pos+"</td>";
    h+='<td><div class="cda-m-player"><img src="'+esc(r.playerImg)+'" alt="" loading="lazy" onerror="this.src=\''+PH+'\'"><span class="nm">'+esc(r.playerName)+"</span></div></td>";
    h+='<td class="cda-m-stat">'+esc(r.role)+"</td>";
    h+='<td><div class="cda-m-team">'+(r.teamImg?'<img src="'+esc(r.teamImg)+'" alt="'+esc(r.teamName)+'" title="'+esc(r.teamName)+'" loading="lazy" onerror="this.style.display=\'none\'">':"")+"</div></td>";
    h+='<td class="cda-m-stat hi">'+r.goals+"</td>";
    h+='<td class="cda-m-stat">'+(r.apps===null?'<span class="mut">\u2013</span>':r.apps)+"</td>";
    h+='<td class="cda-m-stat">'+(r.mins===null?'<span class="mut">\u2013</span>':r.mins)+"</td>";
    h+='<td class="cda-m-stat">'+(r.goalsPerMin===null?'<span class="mut">\u2013</span>':r.goalsPerMin+"'")+"</td>";
    h+="</tr>";
  });
  h+="</tbody></table>";

  var insertAfter=root.querySelector(".cda-m-filters")||root.querySelector(".cda-m-header");
  insertAfter.insertAdjacentHTML("afterend",h);

  root.querySelector(".cda-m-table thead").addEventListener("click",function(e){
    var th=e.target.closest("th");if(!th)return;
    var k=th.getAttribute("data-k");
    if(k===sortKey)sortDir*=-1;
    else{sortKey=k;sortDir=cols.find(function(c){return c.key===k}).num?-1:1}
    page=1;render();
  });

  if(tp>1){
    var ph='<div class="cda-m-pag">';
    ph+='<button data-p="prev"'+(page===1?" disabled":"")+">\u25C0</button>";
    var sp=Math.max(1,page-2),ep=Math.min(tp,sp+4);
    if(ep-sp<4)sp=Math.max(1,ep-4);
    for(var i=sp;i<=ep;i++)ph+='<button data-p="'+i+'"'+(i===page?' class="active"':"")+">"+i+"</button>";
    ph+='<button data-p="next"'+(page===tp?" disabled":"")+">\u25B6</button></div>";
    root.querySelector(".cda-m-table").insertAdjacentHTML("afterend",ph);
    root.querySelector(".cda-m-pag").addEventListener("click",function(e){
      var btn=e.target.closest("button");if(!btn||btn.disabled)return;
      var v=btn.getAttribute("data-p");
      if(v==="prev")page--;else if(v==="next")page++;else page=parseInt(v);
      render();
      root.querySelector(".cda-m-table").scrollIntoView({behavior:"smooth",block:"start"});
    });
  }
}

function showError(msg){var el=root.querySelector(".cda-m-loading");if(el)el.remove();root.querySelector(".cda-m-header").insertAdjacentHTML("afterend",'<div class="cda-m-error">'+esc(msg)+"</div>")}
function showEmpty(msg){var el=root.querySelector(".cda-m-loading");if(el)el.remove();root.querySelector(".cda-m-header").insertAdjacentHTML("afterend",'<div class="cda-m-empty">'+esc(msg)+"</div>")}
function esc(s){var d=document.createElement("div");d.textContent=s;return d.innerHTML}
})();
