import e,{useRef as t,useState as r,useCallback as a,useEffect as n}from"react";import{differenceInDays as o,differenceInYears as i,differenceInQuarters as s,differenceInMonths as c,differenceInWeeks as l,format as u,isValid as d,getWeek as m,startOfDay as g,endOfDay as f,isWithinInterval as h,startOfYear as v,addYears as D,startOfQuarter as p,addQuarters as M,addDays as w,addHours as E,addMinutes as k}from"date-fns";var y,T,N=function(){return N=Object.assign||function(e){for(var t,r=1,a=arguments.length;r<a;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},N.apply(this,arguments)};function x(e,t,r){if(r||2===arguments.length)for(var a,n=0,o=t.length;n<o;n++)!a&&n in t||(a||(a=Array.prototype.slice.call(t,0,n)),a[n]=t[n]);return e.concat(a||Array.prototype.slice.call(t))}function A(e,t){return void 0===t&&(t="default"),e.toLocaleString(t,{month:"short"})}function b(e,t,r){if(void 0===t&&(t=T.FULL_DATE),void 0===r&&(r="default"),!(e instanceof Date)||isNaN(e.getTime()))return"Invalid date";switch(t){case T.MONTH_YEAR:return e.toLocaleString(r,{month:"short",year:"2-digit"});case T.SHORT_DATE:return e.toLocaleString(r,{month:"short",day:"numeric"});case T.FULL_DATE:default:return e.toLocaleString(r,{month:"short",day:"numeric",year:"numeric"})}}function H(e,t){var r=[];if(!(e instanceof Date&&t instanceof Date))return[new Date];for(var a=e.getFullYear(),n=e.getMonth(),o=t.getFullYear(),i=t.getMonth(),s=a;s<=o;s++)for(var c=s===o?i:11,l=s===a?n:0;l<=c;l++)r.push(new Date(s,l,1));return r}function Y(e,t){return new Date(e,t+1,0).getDate()}function C(e,t,r){void 0===r&&(r=y.MONTH);try{if(!(e instanceof Date)||!(t instanceof Date)||isNaN(e.getTime())||isNaN(t.getTime()))return{value:0,unit:"days"};var a=e<t?e:t,n=e<t?t:e;switch(r){case y.DAY:var u=o(n,a)+1;return{value:u,unit:1===u?"day":"days"};case y.WEEK:var d=l(n,a)+1;return{value:d,unit:1===d?"week":"weeks"};case y.MONTH:var m=c(n,a)+1;return{value:m,unit:1===m?"month":"months"};case y.QUARTER:var g=s(n,a)+1;return{value:g,unit:1===g?"quarter":"quarters"};case y.YEAR:var f=i(n,a)+1;return{value:f,unit:1===f?"year":"years"};default:var h=o(n,a)+1;return{value:h,unit:1===h?"day":"days"}}}catch(e){return console.error("Error calculating duration:",e),{value:0,unit:"days"}}}function R(e,t,r){if(void 0===r&&(r="default"),!(e instanceof Date&&t instanceof Date))return"Invalid date range";var a=b(e,T.SHORT_DATE,r),n=b(t,T.SHORT_DATE,r);return"".concat(a," - ").concat(n)}function O(e,t){var r;if(!(e instanceof Date&&t instanceof Date))return 0;e>t&&(e=(r=[t,e])[0],t=r[1]);var a=Math.abs(t.getTime()-e.getTime());return Math.ceil(a/864e5)}function F(e){if(!Array.isArray(e)||0===e.length)return new Date;var t=new Date,r=!1;if(e.forEach((function(e){e&&Array.isArray(e.tasks)&&e.tasks.forEach((function(e){e&&e.startDate instanceof Date&&(r?e.startDate<t&&(t=new Date(e.startDate)):(t=new Date(e.startDate),r=!0))}))})),!r){var a=new Date;return new Date(a.getFullYear(),a.getMonth()-1,1)}return new Date(t.getFullYear(),t.getMonth(),1)}function U(e){if(!Array.isArray(e)||0===e.length)return new Date;var t=new Date,r=!1;if(e.forEach((function(e){e&&Array.isArray(e.tasks)&&e.tasks.forEach((function(e){e&&e.endDate instanceof Date&&(r?e.endDate>t&&(t=new Date(e.endDate)):(t=new Date(e.endDate),r=!0))}))})),!r){var a=new Date;return new Date(a.getFullYear(),a.getMonth()+2,0)}return new Date(t.getFullYear(),t.getMonth()+1,0)}function L(e,t,r){if(!(e.startDate instanceof Date&&e.endDate instanceof Date))return{left:"0%",width:"10%"};var a=H(new Date(t.getFullYear(),t.getMonth(),1),new Date(r.getFullYear(),r.getMonth()+1,0)),n=a.length,o=e.startDate.getFullYear(),i=e.startDate.getMonth(),s=a.findIndex((function(e){return e.getFullYear()===o&&e.getMonth()===i})),c=s<0?0:s,l=e.endDate.getFullYear(),u=e.endDate.getMonth(),d=a.findIndex((function(e){return e.getFullYear()===l&&e.getMonth()===u})),m=((d<0?a.length-1:d)-c+1)/n*100;return{left:"".concat(c/n*100,"%"),width:"".concat(m,"%")}}function I(e){if(!Array.isArray(e))return[];var t=e.filter((function(e){return e&&e.startDate instanceof Date&&e.endDate instanceof Date}));if(0===t.length)return[];var r=[];return t.forEach((function(e){for(var t=!1,a=0;a<r.length;a++){if(!r[a].some((function(t){return!(e.startDate>=t.endDate||e.endDate<=t.startDate)}))){r[a].push(e),t=!0;break}}t||r.push([e])})),r}"function"==typeof SuppressedError&&SuppressedError,function(e){e.MINUTE="minute",e.HOUR="hour",e.DAY="day",e.WEEK="week",e.MONTH="month",e.QUARTER="quarter",e.YEAR="year"}(y||(y={})),function(e){e.MONTH_YEAR="month-year",e.FULL_DATE="full-date",e.SHORT_DATE="short-date"}(T||(T={}));var S=function(t){var r=t.months,a=t.currentMonthIndex,n=(t.locale,t.className),o=void 0===n?"":n,i=t.viewMode,s=void 0===i?y.MONTH:i,c=t.unitWidth,l=void 0===c?150:c,g=[y.MINUTE,y.HOUR,y.DAY,y.WEEK].includes(s),f=function(){if(![y.MINUTE,y.HOUR,y.DAY,y.WEEK].includes(s)||0===r.length)return[];var e=[];if(s===y.MINUTE){var t=new Date(r[0]);t.setMinutes(0,0,0);var a=0;return r.forEach((function(r){r.getHours()===t.getHours()&&r.getDate()===t.getDate()&&r.getMonth()===t.getMonth()&&r.getFullYear()===t.getFullYear()?a+=1:(e.push({date:t,span:a}),(t=new Date(r)).setMinutes(0,0,0),a=1)})),a>0&&e.push({date:t,span:a}),e}if(s===y.HOUR){var n=new Date(r[0]);n.setHours(0,0,0,0);var o=0;return r.forEach((function(t){t.getDate()===n.getDate()&&t.getMonth()===n.getMonth()&&t.getFullYear()===n.getFullYear()?o+=1:(e.push({date:n,span:o}),(n=new Date(t)).setHours(0,0,0,0),o=1)})),o>0&&e.push({date:n,span:o}),e}var i=new Date(r[0]),c=0;return r.forEach((function(t){t.getMonth()===i.getMonth()&&t.getFullYear()===i.getFullYear()?c+=1:(e.push({date:i,span:c}),i=new Date(t),c=1)})),c>0&&e.push({date:i,span:c}),e}();return e.createElement("div",{className:"rmg-timeline ".concat(o),style:{"--gantt-unit-width":"".concat(l,"px")},"data-rmg-component":"timeline"},g&&e.createElement("div",{className:"rmg-timeline-header-higher","data-rmg-component":"timeline-header-higher"},f.map((function(t,r){return e.createElement("div",{key:"higher-level-".concat(r),className:"rmg-timeline-unit",style:{width:"".concat(t.span*l,"px")},"data-timeunit-higher":t.date.toISOString(),"data-rmg-component":"timeline-unit-higher"},function(e){if(!(e instanceof Date))return"";switch(s){case y.MINUTE:return u(e,"HH:00",{locale:void 0});case y.HOUR:return u(e,"MMM d",{locale:void 0});case y.DAY:case y.WEEK:return u(e,"MMM yyyy",{locale:void 0});default:return""}}(t.date))}))),e.createElement("div",{className:"rmg-timeline-header","data-rmg-component":"timeline-header"},r.map((function(t,r){return e.createElement("div",{key:"timeunit-".concat(r),className:"rmg-timeline-unit ".concat(r===a?"rmg-timeline-unit-current":""),style:{width:"".concat(l,"px")},"data-timeunit":t.toISOString(),"data-rmg-component":"timeline-unit"},function(e){if(!(e instanceof Date&&d(e)))return"";switch(s){case y.MINUTE:return u(e,"HH:mm",{locale:void 0});case y.HOUR:return u(e,"HH:00",{locale:void 0});case y.DAY:return u(e,"d",{locale:void 0});case y.WEEK:var t=m(e);return"W".concat(t);case y.MONTH:return u(e,"MMM yyyy",{locale:void 0});case y.QUARTER:var r=Math.floor(e.getMonth()/3)+1;return"Q".concat(r," ").concat(e.getFullYear());case y.YEAR:return e.getFullYear().toString();default:return u(e,"MMM yyyy",{locale:void 0})}}(t))}))))},P=function(t){var r=t.currentMonthIndex,a=t.height,n=t.label,o=void 0===n?"Today":n,i=t.dayOfMonth,s=t.className,c=void 0===s?"":s,l=t.markerClass,u=void 0===l?"":l,d=t.viewMode,m=void 0===d?y.MONTH:d,g=t.unitWidth,f=void 0===g?150:g;if(r<0)return null;var h=function(){var e=new Date,t=i||e.getDate();switch(m){case y.MINUTE:var a=e.getMinutes(),n=e.getSeconds();return r*f+f*((a+n/60)/60);case y.HOUR:var o=e.getMinutes();return r*f+f*(o/60);case y.DAY:return r*f+f/2;case y.WEEK:var s=e.getDay();return r*f+f*((s+7)%7/6);case y.MONTH:var c=new Date(e.getFullYear(),e.getMonth()+1,0).getDate();return r*f+f*((t-1)/c);case y.QUARTER:var l=e.getMonth()%3;return r*f+f*(l/3);case y.YEAR:var u=e.getMonth();return r*f+f*(u/12);default:return r*f+f/2}}(),v=Math.max(100,a);return e.createElement("div",{className:"rmg-today-marker ".concat(c," ").concat(u),style:{left:"".concat(h,"px"),height:"".concat(v,"px")},"data-testid":"today-marker","data-rmg-component":"today-marker"},e.createElement("div",{className:"rmg-today-marker-label","data-rmg-component":"today-marker-label"},o))},W=function(){function e(){}return e.detectOverlaps=function(e,t){var r=this;if(void 0===t&&(t=y.MONTH),!Array.isArray(e)||0===e.length)return[];var a=x([],e,!0).sort((function(e,t){return e.startDate&&t.startDate?e.startDate.getTime()-t.startDate.getTime():0})),n=[];return a.forEach((function(e){for(var a=!1,o=0;o<n.length;o++){if(!n[o].some((function(a){return r.tasksVisuallyOverlap(e,a,t)}))){n[o].push(e),a=!0;break}}a||n.push([e])})),n},e.tasksVisuallyOverlap=function(e,t,r){if(void 0===r&&(r=y.MONTH),!(e.startDate&&e.endDate&&t.startDate&&t.endDate))return!1;var a=e.startDate.getTime(),n=e.endDate.getTime(),o=t.startDate.getTime(),i=t.endDate.getTime(),s=this.getCollisionBufferByViewMode(r);return a+s<i-s&&n-s>o+s||Math.abs(a-o)<2*s||Math.abs(n-i)<2*s},e.getCollisionBufferByViewMode=function(e){var t=36e5,r=24*t;switch(e){case y.MINUTE:return 3e4;case y.HOUR:return 9e5;case y.DAY:return t;case y.WEEK:return 4*t;case y.MONTH:return 12*t;case y.QUARTER:return r;case y.YEAR:return 2*r;default:return 12*t}},e.wouldCollide=function(e,t,r,a){var n=this;return void 0===r&&(r=y.MONTH),t.some((function(t){return t.id!==e.id&&t.id!==a&&n.tasksVisuallyOverlap(e,t,r)}))},e.getPreviewArrangement=function(e,t,r){void 0===r&&(r=y.MONTH);var a=t.map((function(t){return t.id===e.id?e:t}));return this.detectOverlaps(a,r)},e}(),K=function(){function e(){}return e.calculateDatesFromPosition=function(e,t,r,a,n,o,i){void 0===i&&(i=y.MONTH);try{var s=isNaN(e)?0:e,c=isNaN(t)||t<20?20:t,l=r.getTime(),u=(a.getTime()-l)/(n*o),d=s*u,m=c*u,h=new Date(l+d),v=new Date(l+d+m);switch(i){case y.MINUTE:h.setSeconds(0,0),v.setSeconds(59,999);break;case y.HOUR:h.setMinutes(0,0,0),v.setMinutes(59,59,999);break;case y.DAY:var D=Math.round(e/o),p=Math.max(1,Math.round(t/o)),M=new Date(r);M.setHours(0,0,0,0),(h=new Date(M)).setDate(M.getDate()+D),h.setHours(0,0,0,0),(v=new Date(h)).setDate(h.getDate()+p-1),v.setHours(23,59,59,999);break;default:h=g(h),v=f(v)}return h<r&&(h=new Date(r)),v>a&&(v=new Date(a)),{newStartDate:h,newEndDate:v}}catch(e){return console.error("Error calculating dates from position:",e),{newStartDate:new Date(r),newEndDate:new Date(a)}}},e.createUpdatedTask=function(e,t,r){return N(N({},e),{startDate:new Date(t),endDate:new Date(r)})},e.calculateTaskPixelPosition=function(e,t,r,a,n,o){var i;void 0===o&&(o=y.MONTH);try{if(!(e.startDate instanceof Date&&e.endDate instanceof Date))throw new Error("Invalid dates in task");var s=t.getTime(),c=r.getTime(),l=Math.max(e.startDate.getTime(),t.getTime()),u=Math.min(e.endDate.getTime(),r.getTime());if(o===y.MINUTE||o===y.HOUR||o===y.DAY){var d=void 0,m=void 0;if(o===y.MINUTE)d=s,m=c;else if(o===y.HOUR){var g=new Date(t.getFullYear(),t.getMonth(),t.getDate(),t.getHours(),0,0,0).getTime(),f=new Date(r.getFullYear(),r.getMonth(),r.getDate(),r.getHours(),59,59,999).getTime();d=g,m=f}else{var h=new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0).getTime(),v=new Date(r.getFullYear(),r.getMonth(),r.getDate(),23,59,59,999).getTime();d=h,m=v}if(s=d,c=m,o===y.DAY){var D=new Date(new Date(l).getFullYear(),new Date(l).getMonth(),new Date(l).getDate(),0,0,0,0).getTime(),p=new Date(new Date(u).getFullYear(),new Date(u).getMonth(),new Date(u).getDate(),23,59,59,999).getTime();l=D,u=p}}var M=c-s,w=a*n,E=(l-s)/M*w,k=(u-l)/M*w;o===y.MINUTE?(E=Math.round(E),k=Math.max(10,Math.round(k))):o===y.HOUR?(E=Math.round(E),k=Math.max(15,Math.round(k))):o===y.DAY&&(E=Math.round(E/n)*n,k=Math.max(n,Math.round(k/n)*n));var T=((i={})[y.MINUTE]=10,i[y.HOUR]=15,i[y.DAY]=20,i[y.WEEK]=20,i[y.MONTH]=20,i[y.QUARTER]=30,i[y.YEAR]=40,i)[o]||20;k=Math.max(T,k);var N=w-E;return{leftPx:E,widthPx:k=Math.min(N,k)}}catch(e){return console.error("Error calculating task position:",e),{leftPx:0,widthPx:20}}},e.getLiveDatesFromElement=function(e,t,r,a,n,o){void 0===o&&(o=y.MONTH);try{if(!e)return{startDate:new Date(t),endDate:new Date(r)};var i=parseFloat(e.style.left||"0"),s=parseFloat(e.style.width||"0"),c=this.calculateDatesFromPosition(i,s,t,r,a,n,o);return{startDate:c.newStartDate,endDate:c.newEndDate}}catch(e){return console.error("Error getting live dates:",e),{startDate:new Date(t),endDate:new Date(r)}}},e.datesOverlap=function(e,t,r,a){return h(e,{start:r,end:a})||h(t,{start:r,end:a})||h(r,{start:e,end:t})||h(a,{start:e,end:t})},e}(),z=function(t){var r=t.task,a=t.position,n=t.dragType,o=t.taskId,i=t.startDate,s=t.endDate,c=t.totalMonths,l=t.monthWidth,d=t.showProgress,m=void 0!==d&&d,g=t.instanceId,f=t.className,h=void 0===f?"":f,v=t.viewMode,D=void 0===v?y.MONTH:v,p=t.renderTooltip,M=r.startDate,w=r.endDate;try{var E=o||r.id,k=document.querySelector('[data-task-id="'.concat(E,'"][data-instance-id="').concat(g,'"]'));if(k&&(n||k.style.left||k.style.width)){var T=K.getLiveDatesFromElement(k,i,s,c,l,D);M=T.startDate,w=T.endDate}}catch(e){console.error("Error calculating live dates for tooltip:",e)}var N=C(M,w,D),x=function(e){return e instanceof Date&&!isNaN(e.getTime())?D===y.DAY?u(e,"EEE, MMM d, yyyy"):u(e,"MMM d, yyyy"):"Invalid date"},A=function(){if(!n)return null;switch(n){case"move":return"Moving task...";case"resize-left":return"Adjusting start date...";case"resize-right":return"Adjusting end date...";default:return null}}();return p?e.createElement("div",{className:"rmg-tooltip ".concat(h," rmg-tooltip-visible"),style:{left:"".concat(a.x,"px"),top:"".concat(a.y-40,"px")},"data-rmg-component":"tooltip"},p({task:r,position:a,dragType:n,startDate:M,endDate:w,viewMode:D})):e.createElement("div",{className:"rmg-tooltip ".concat(h," rmg-tooltip-visible"),style:{left:"".concat(a.x,"px"),top:"".concat(a.y-40,"px")},"data-rmg-component":"tooltip"},e.createElement("div",{className:"rmg-tooltip-title","data-rmg-component":"tooltip-title"},r.name||"Unnamed Task"),A&&e.createElement("div",{className:"rmg-tooltip-action","data-rmg-component":"tooltip-action"},A),e.createElement("div",{className:"rmg-tooltip-content","data-rmg-component":"tooltip-content"},e.createElement("div",{className:"rmg-tooltip-row","data-rmg-component":"tooltip-row"},e.createElement("div",{className:"rmg-tooltip-label"},"Start:"),e.createElement("div",{className:"rmg-tooltip-value"},x(M))),e.createElement("div",{className:"rmg-tooltip-row","data-rmg-component":"tooltip-row"},e.createElement("div",{className:"rmg-tooltip-label"},"End:"),e.createElement("div",{className:"rmg-tooltip-value"},x(w))),e.createElement("div",{className:"rmg-tooltip-row","data-rmg-component":"tooltip-row"},e.createElement("div",{className:"rmg-tooltip-label"},"Duration:"),e.createElement("div",{className:"rmg-tooltip-value"},N.value," ",N.unit)),m&&"number"==typeof r.percent&&e.createElement("div",{className:"rmg-tooltip-row","data-rmg-component":"tooltip-row"},e.createElement("div",{className:"rmg-tooltip-label"},"Progress:"),e.createElement("div",{className:"rmg-tooltip-value"},r.percent,"%")),r.dependencies&&r.dependencies.length>0&&e.createElement("div",{className:"rmg-tooltip-row","data-rmg-component":"tooltip-row"},e.createElement("div",{className:"rmg-tooltip-label"},"Dependencies:"),e.createElement("div",{className:"rmg-tooltip-value"},r.dependencies.join(", ")))))},B=function(t){var r=t.activeMode,a=t.onChange,n=t.darkMode,o=t.availableModes,i=[{id:y.MINUTE,label:"Minute"},{id:y.HOUR,label:"Hour"},{id:y.DAY,label:"Day"},{id:y.WEEK,label:"Week"},{id:y.MONTH,label:"Month"},{id:y.QUARTER,label:"Quarter"},{id:y.YEAR,label:"Year"}],s=[y.DAY,y.WEEK,y.MONTH,y.QUARTER,y.YEAR],c=o?i.filter((function(e){return o.includes(e.id)})):i.filter((function(e){return s.includes(e.id)}));return e.createElement("div",{className:"rmg-view-mode-selector ".concat(n?"rmg-dark":""),"data-rmg-component":"view-mode-selector"},c.map((function(t){return e.createElement("button",{key:t.id,type:"button",className:"rmg-view-mode-button ".concat(r===t.id?"rmg-view-mode-button-active":""),onClick:function(){return a(t.id)},"data-rmg-component":"view-mode-button","data-view-mode":t.id,"data-active":r===t.id?"true":"false"},t.label)})))},Q=function(o){var i=o.task,s=o.leftPx,c=o.widthPx,l=o.topPx,u=o.isHovered,d=o.isDragging,m=o.editMode,g=o.showProgress,f=void 0!==g&&g,h=o.instanceId,v=o.renderTask,D=o.getTaskColor,p=o.onMouseDown,M=o.onMouseEnter,w=o.onMouseLeave,E=o.onClick,k=o.onProgressUpdate,y=(u||d)&&m,T=t(null),N=t(null),x=r(!1),A=x[0],b=x[1],H=r(i.percent||0),Y=H[0],C=H[1];if(!i||!i.id)return null;var R=i.color||"var(--rmg-task-color)",O="",F="var(--rmg-task-text-color)";if(D){var U=D({task:i,isHovered:u,isDragging:d});R=U.backgroundColor,O=U.borderColor||"",F=U.textColor||F}var L=a((function(e){if(A&&N.current&&T.current){var t=T.current.getBoundingClientRect(),r=t.width-2,a=Math.max(0,Math.min(r,e.clientX-t.left)),n=Math.round(a/r*100);C(Math.max(0,Math.min(100,n))),N.current&&N.current.firstChild&&(N.current.firstChild.style.width="".concat(Math.max(0,Math.min(100,n)),"%"))}}),[A]),I=a((function(){A&&(b(!1),document.removeEventListener("mousemove",L),document.removeEventListener("mouseup",I),N.current&&(N.current.style.transition=""),k&&Y!==i.percent&&k(i,Y))}),[A,k,Y,i]);if(n((function(){C(i.percent||0)}),[i.percent]),n((function(){return function(){document.removeEventListener("mousemove",L),document.removeEventListener("mouseup",I)}}),[L,I]),v){var S=v({task:i,leftPx:s,widthPx:c,topPx:l,isHovered:u,isDragging:d,editMode:m,showProgress:f});return e.createElement("div",{ref:T,className:"rmg-task-item-custom",style:{position:"absolute",left:"".concat(Math.max(0,s),"px"),width:"".concat(Math.max(20,c),"px"),top:"".concat(l,"px")},onClick:function(e){return E(e,i)},onMouseDown:function(e){return p(e,i,"move")},onMouseEnter:function(e){return M(e,i)},onMouseLeave:w,"data-testid":"task-".concat(i.id),"data-task-id":i.id,"data-instance-id":h,"data-dragging":d?"true":"false","data-rmg-component":"task"},S)}var P={left:"".concat(Math.max(0,s),"px"),width:"".concat(Math.max(20,c),"px"),top:"".concat(l,"px"),willChange:d?"transform, left, width":"auto",backgroundColor:R.startsWith("var(")||R.startsWith("#")?R:"var(--rmg-task-color)",color:F.startsWith("var(")||F.startsWith("#")?F:"var(--rmg-task-text-color)"};return O&&(P.borderColor=O,P.borderWidth="1px",P.borderStyle="solid"),e.createElement("div",{ref:T,className:"rmg-task-item ".concat(d?"rmg-task-item-dragging":""),style:P,onClick:function(e){return E(e,i)},onMouseDown:function(e){return p(e,i,"move")},onMouseEnter:function(e){return M(e,i)},onMouseLeave:w,"data-testid":"task-".concat(i.id),"data-task-id":i.id,"data-instance-id":h,"data-dragging":d?"true":"false","data-rmg-component":"task"},y&&e.createElement("div",{className:"rmg-resize-handle rmg-resize-handle-left",onMouseDown:function(e){e.stopPropagation(),p(e,i,"resize-left")},"data-rmg-component":"resize-handle","data-rmg-handle":"left"}),e.createElement("div",{className:"rmg-task-item-name"},i.name||"Unnamed Task"),f&&"number"==typeof Y&&e.createElement("div",{ref:N,className:"rmg-progress-bar",onClick:function(e){if(m&&f&&k){e.stopPropagation();var t=e.currentTarget.clientWidth,r=e.nativeEvent.offsetX,a=Math.round(r/t*100);C(a),k(i,a)}},"data-rmg-component":"progress-bar"},e.createElement("div",{className:"rmg-progress-fill",style:{width:"".concat(Y,"%")},"data-rmg-component":"progress-fill"},m&&(u||A)&&e.createElement("div",{className:"rmg-progress-handle ".concat(A?"rmg-progress-handle-dragging":""),onMouseDown:function(e){m&&f&&(e.stopPropagation(),e.preventDefault(),b(!0),N.current&&(N.current.style.transition="width 0.05s ease-out"),document.addEventListener("mousemove",L),document.addEventListener("mouseup",I))},"data-rmg-component":"progress-handle"}))),y&&e.createElement("div",{className:"rmg-resize-handle rmg-resize-handle-right",onMouseDown:function(e){e.stopPropagation(),p(e,i,"resize-right")},"data-rmg-component":"resize-handle","data-rmg-handle":"right"}))},_=function(t){var r=t.tasks,a=void 0===r?[]:r,n=t.headerLabel,o=void 0===n?"Resources":n,i=t.showIcon,s=void 0!==i&&i,c=t.showTaskCount,l=void 0!==c&&c,u=t.showDescription,d=void 0===u||u,m=t.rowHeight,g=void 0===m?40:m,f=t.className,h=void 0===f?"":f,v=t.onGroupClick,D=t.viewMode,p=Array.isArray(a)?a:[],M=D===y.DAY||D===y.WEEK;return e.createElement("div",{className:"rmg-task-list ".concat(h),"data-rmg-component":"task-list"},M?e.createElement(e.Fragment,null,e.createElement("div",{className:"rmg-task-list-header"}),e.createElement("div",{className:"rmg-task-list-header"},o)):e.createElement("div",{className:"rmg-task-list-header"},o),p.map((function(t){if(!t)return null;var r=function(e){if(!e.tasks||!Array.isArray(e.tasks))return 60;var t=W.detectOverlaps(e.tasks,D);return Math.max(60,t.length*g+20)}(t);return e.createElement("div",{key:"task-group-".concat(t.id||"unknown"),className:"rmg-task-group",style:{height:"".concat(r,"px")},onClick:function(){return e=t,void(v&&v(e));var e},"data-testid":"task-group-".concat(t.id||"unknown"),"data-rmg-component":"task-group","data-group-id":t.id},e.createElement("div",{className:"rmg-task-group-content"},s&&t.icon&&e.createElement("span",{className:"rmg-task-group-icon",dangerouslySetInnerHTML:{__html:t.icon},"data-rmg-component":"task-group-icon"}),e.createElement("div",{className:"rmg-task-group-name","data-rmg-component":"task-group-name"},t.name||"Unnamed")),d&&t.description&&e.createElement("div",{className:"rmg-task-group-description","data-rmg-component":"task-group-description"},t.description),l&&t.tasks&&t.tasks.length>0&&e.createElement("div",{className:"rmg-task-group-count","data-rmg-component":"task-group-count"},t.tasks.length," ",1===t.tasks.length?"task":"tasks"))})))},q=function(a){var o=a.taskGroup,i=a.startDate,s=a.endDate,c=a.totalMonths,l=a.monthWidth,u=a.editMode,d=void 0===u||u,m=a.showProgress,g=void 0!==m&&m,f=a.className,h=void 0===f?"":f,v=a.tooltipClassName,D=void 0===v?"":v,p=a.onTaskUpdate,M=a.onTaskClick,w=a.onTaskSelect,E=a.onAutoScrollChange,k=a.viewMode,T=void 0===k?y.MONTH:k,x=a.scrollContainerRef,A=a.smoothDragging,b=void 0===A||A;a.movementThreshold;var H=a.animationSpeed,Y=void 0===H?.25:H,C=a.renderTask,R=a.renderTooltip,O=a.getTaskColor;if(!o||!o.id||!Array.isArray(o.tasks))return e.createElement("div",{className:"rmg-task-row rmg-task-row-invalid"},"Invalid task group data");var F=i instanceof Date?i:new Date,U=s instanceof Date?s:new Date,L=r(null),I=L[0],S=L[1],P=r(null),B=P[0],_=P[1],q=r(null),V=q[0],X=q[1],j=r(0),G=j[0],J=j[1],Z=r({x:0,y:0}),$=Z[0],ee=Z[1],te=r(null),re=te[0],ae=te[1],ne=r(null),oe=ne[0],ie=ne[1],se=t(null),ce=t({x:0,y:0}),le=t(null),ue=t(null),de=t({left:0,width:0}),me=t(0),ge=t(!1),fe=t(null),he=t(0),ve=t(null),De=t({minLeft:0,maxLeft:c*l}),pe=t(null),Me=t(null),we=t(null),Ee=t(null),ke=t("task-row-".concat(Math.random().toString(36).substring(2,11))),ye=b&&T!==y.DAY,Te=function(e){var t=N(N({},e),{startDate:new Date(e.startDate),endDate:new Date(e.endDate)});ae(t),we.current=t},Ne=re?W.getPreviewArrangement(re,o.tasks,T):W.detectOverlaps(o.tasks,T),xe=Math.max(60,40*Ne.length+20);n((function(){De.current={minLeft:0,maxLeft:c*l}}),[c,l]);var Ae=function(){if(Ee.current&&le.current&&ue.current){var e=Date.now(),t=e-me.current;me.current=e;var r=Y||.25,a=ue.current.left+(le.current.left-ue.current.left)*r,n=ue.current.width+(le.current.width-ue.current.width)*r;de.current.left=(a-ue.current.left)/(t||16),de.current.width=(n-ue.current.width)/(t||16),ue.current={left:a,width:n},Ee.current.style.left="".concat(a,"px"),Ee.current.style.width="".concat(n,"px"),Me.current&&be(a,n),se.current=requestAnimationFrame(Ae)}else se.current=null},be=function(e,t){if(Me.current)try{if(T===y.DAY){var r=Math.round(e/l),a=Math.max(1,Math.round(t/l)),n=new Date(F);n.setHours(0,0,0,0),(g=new Date(n)).setDate(n.getDate()+r),g.setHours(0,0,0,0),(f=new Date(g)).setDate(g.getDate()+a-1),f.setHours(23,59,59,999);var o=F.getTime(),i=U.getTime(),s=new Date(Math.max(o,g.getTime())),u=new Date(Math.min(i,f.getTime())),d=N(N({},Me.current),{startDate:s,endDate:u});Te(d)}else{var m=K.calculateDatesFromPosition(e,t,F,U,c,l,T),g=m.newStartDate,f=m.newEndDate;d=N(N({},Me.current),{startDate:g,endDate:f});Te(d)}}catch(e){console.error("Error updating dates:",e)}},He=function(){if(!ge.current){ge.current=!0;var e=function(){if(ge.current&&(null==x?void 0:x.current)&&le.current){var t=x.current,r=ve.current,a=he.current,n=t.scrollLeft,o=t.scrollWidth-t.clientWidth;if("left"===r){if(n<=0)return void Ye();var i=Math.max(0,n-a);if(t.scrollLeft=i,le.current){var s=Math.max(De.current.minLeft,le.current.left-a);le.current.left=s}}else if("right"===r){if(n>=o)return void Ye();i=Math.min(o,n+a);if(t.scrollLeft=i,le.current&&oe){var c=De.current.maxLeft-le.current.width;s=Math.min(c,le.current.left+a);le.current.left=s}}ge.current&&(fe.current=requestAnimationFrame(e))}};fe.current=requestAnimationFrame(e)}},Ye=function(){ge.current=!1,null!==fe.current&&(cancelAnimationFrame(fe.current),fe.current=null)},Ce=function(e,t){M&&!B&&M(t,o),w&&w(t,!0)},Re=function(e,t){B||(S(t),Fe(e))},Oe=function(){B||S(null)},Fe=function(e){if(pe.current){var t=pe.current.getBoundingClientRect();ee({x:e.clientX-t.left+20,y:e.clientY-t.top})}},Ue=function(e,t,r){if(d){e.preventDefault(),e.stopPropagation();var a=document.querySelector('[data-task-id="'.concat(t.id,'"][data-instance-id="').concat(ke.current,'"]'));if(a){Ee.current=a;var n=parseFloat(a.style.left||"0"),o=parseFloat(a.style.width||"0");ie({left:n,width:o,startDate:new Date(t.startDate),endDate:new Date(t.endDate)}),le.current={left:n,width:o},ue.current={left:n,width:o},ce.current={x:e.clientX,y:e.clientY},me.current=Date.now(),de.current={left:0,width:0},a.setAttribute("data-dragging","true"),a.style.transition="none",_(t),X(r),J(e.clientX),ae(t),function(e){var t=N(N({},e),{startDate:new Date(e.startDate),endDate:new Date(e.endDate)});_(t),Me.current=t}(t),Te(t),null===se.current&&ye&&(se.current=requestAnimationFrame(Ae)),document.addEventListener("mouseup",Ie),document.addEventListener("mousemove",Le)}}},Le=function(e){if(ce.current={x:e.clientX,y:e.clientY},e instanceof MouseEvent&&I&&pe.current){var t=pe.current.getBoundingClientRect();ee({x:e.clientX-t.left+20,y:e.clientY-t.top})}else e instanceof MouseEvent||Fe(e);if(B&&(null==x?void 0:x.current)&&function(e){if((null==x?void 0:x.current)&&B){var t=x.current.getBoundingClientRect(),r=null,a=0;e<t.left+40?(r="left",a=Math.max(1,Math.round((40-(e-t.left))/10))):e>t.right-40&&(r="right",a=Math.max(1,Math.round((e-(t.right-40))/10))),ve.current=r,he.current=a,r&&!ge.current?(He(),E&&E(!0)):!r&&ge.current&&(Ye(),E&&E(!1))}}(e.clientX),B&&V&&oe&&pe.current&&le.current)try{var r=e.clientX-G,a=c*l,n=le.current.left,o=le.current.width;switch(V){case"move":n=Math.max(0,Math.min(a-oe.width,oe.left+r)),T===y.DAY&&(n=Math.round(n/l)*l);break;case"resize-left":var i=oe.width-20,s=Math.min(i,r);n=Math.max(0,oe.left+s),T===y.DAY&&(n=Math.round(n/l)*l);var u=oe.left+oe.width;o=Math.max(20,u-n),T===y.DAY&&(o=Math.round(o/l)*l,o=Math.max(l,o));break;case"resize-right":o=Math.max(20,Math.min(a-oe.left,oe.width+r)),T===y.DAY&&(o=Math.round(o/l)*l,o=Math.max(l,o))}le.current={left:n,width:o},T===y.DAY&&Ee.current?(Ee.current.style.left="".concat(n,"px"),Ee.current.style.width="".concat(o,"px"),be(n,o)):ye?null===se.current&&(me.current=Date.now(),se.current=requestAnimationFrame(Ae)):Ee.current&&(Ee.current.style.left="".concat(n,"px"),Ee.current.style.width="".concat(o,"px"),be(n,o))}catch(e){console.error("Error in handleMouseMove:",e)}},Ie=function(){try{null!==se.current&&(cancelAnimationFrame(se.current),se.current=null),function(){if(Ee.current&&le.current&&Me.current){var e=le.current.left,t=le.current.width;T===y.DAY?(e=Math.round(e/l)*l,t=Math.round(t/l)*l,t=Math.max(l,t),Ee.current.style.transition="transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out",Ee.current.style.left="".concat(e,"px"),Ee.current.style.width="".concat(t,"px"),be(e,t)):ye||(Ee.current.style.transition="transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out",Ee.current.style.left="".concat(e,"px"),Ee.current.style.width="".concat(t,"px"));var r=we.current;if(r){var a=F.getTime(),n=U.getTime();if(r.startDate.getTime()<a&&(r=N(N({},r),{startDate:new Date(a)})),r.endDate.getTime()>n&&(r=N(N({},r),{endDate:new Date(n)})),p&&r)try{p(o.id,r)}catch(e){console.error("Error in onTaskUpdate:",e)}}}}(),Ee.current&&(Ee.current.setAttribute("data-dragging","false"),setTimeout((function(){Ee.current&&(Ee.current.style.transition="")}),200))}catch(e){console.error("Error in handleMouseUp:",e)}finally{Ye(),E&&E(!1),_(null),X(null),ae(null),ie(null),Me.current=null,we.current=null,Ee.current=null,le.current=null,ue.current=null,document.removeEventListener("mouseup",Ie),document.removeEventListener("mousemove",Le)}},Se=function(e,t){if(p&&o.id)try{var r=N(N({},e),{percent:t});p(o.id,r)}catch(e){console.error("Error updating task progress:",e)}};return n((function(){return function(){document.removeEventListener("mouseup",Ie),document.removeEventListener("mousemove",Le),Ye(),null!==se.current&&(cancelAnimationFrame(se.current),se.current=null)}}),[]),o.tasks&&0!==o.tasks.length?e.createElement("div",{className:"rmg-task-row ".concat(h),style:{height:"".concat(xe,"px")},onMouseMove:function(e){return Le(e)},onMouseLeave:function(){return S(null)},ref:pe,"data-testid":"task-row-".concat(o.id),"data-instance-id":ke.current,"data-rmg-component":"task-row","data-group-id":o.id},Ne.map((function(t,r){return e.createElement(e.Fragment,{key:"task-row-".concat(r)},t.map((function(t){try{if(!(t&&t.id&&t.startDate instanceof Date&&t.endDate instanceof Date))return console.warn("Invalid task data:",t),null;var a=K.calculateTaskPixelPosition(t,F,U,c,l,T),n=a.leftPx,o=a.widthPx,i=(null==I?void 0:I.id)===t.id,s=(null==B?void 0:B.id)===t.id,u=40*r+10;return e.createElement(Q,{key:"task-".concat(t.id),task:t,leftPx:n,widthPx:o,topPx:u,isHovered:i,isDragging:s,editMode:d,showProgress:g,instanceId:ke.current,onMouseDown:Ue,onMouseEnter:Re,onMouseLeave:Oe,onClick:Ce,renderTask:C,getTaskColor:O,onProgressUpdate:Se})}catch(e){return console.error("Error rendering task:",e),null}})))})),(I||B)&&e.createElement(z,{task:re||B||I,position:$,dragType:V,taskId:null==B?void 0:B.id,startDate:F,endDate:U,totalMonths:c,monthWidth:l,showProgress:g,instanceId:ke.current,className:D,viewMode:T,renderTooltip:R})):e.createElement("div",{className:"rmg-task-row rmg-task-row-empty"},"No tasks available")},V=function(a){var o=a.tasks,i=void 0===o?[]:o,s=a.startDate,c=a.endDate,l=a.title,u=void 0===l?"Project Timeline":l,d=a.currentDate,m=void 0===d?new Date:d,g=a.showCurrentDateMarker,f=void 0===g||g,h=a.todayLabel,T=void 0===h?"Today":h,A=a.editMode,b=void 0===A||A,Y=a.headerLabel,C=void 0===Y?"Resources":Y,R=a.showProgress,O=void 0!==R&&R,L=a.darkMode,I=void 0!==L&&L,K=a.locale,z=void 0===K?"default":K,Q=a.styles,V=void 0===Q?{}:Q,X=a.viewMode,j=void 0===X?y.MONTH:X,G=a.viewModes,J=a.smoothDragging,Z=void 0===J||J,$=a.movementThreshold,ee=void 0===$?3:$,te=a.animationSpeed,re=void 0===te?.25:te,ae=a.minuteStep,ne=void 0===ae?5:ae,oe=a.renderTaskList,ie=a.renderTask,se=a.renderTooltip,ce=a.renderViewModeSelector,le=a.renderHeader,ue=a.renderTimelineHeader,de=a.getTaskColor,me=a.onTaskUpdate,ge=a.onTaskClick,fe=a.onTaskSelect;a.onTaskDoubleClick;var he=a.onGroupClick,ve=a.onViewModeChange,De=a.fontSize;a.rowHeight,a.timeStep;var pe=t(null),Me=t(null),we=r(j),Ee=we[0],ke=we[1],ye=r([]);ye[0];var Te=ye[1],Ne=r(150),xe=Ne[0],Ae=Ne[1],be=r(!1),He=be[0],Ye=be[1],Ce=r(0),Re=Ce[0],Oe=Ce[1],Fe=s||F(i),Ue=c||U(i),Le=function(e,t,r){void 0===r&&(r=5);var a=[],n=new Date(e);n.setSeconds(0,0);var o=n.getMinutes(),i=Math.floor(o/r)*r;n.setMinutes(i);var s=new Date(t);for(s.setMinutes(s.getMinutes(),59,999);n<=s;)a.push(new Date(n)),n=k(n,r);return a},Ie=function(e,t){var r=[],a=new Date(e);a.setMinutes(0,0,0);var n=new Date(t);for(n.setHours(n.getHours(),59,59,999);a<=n;)r.push(new Date(a)),a=E(a,1);return r},Se=function(e,t){var r=[],a=new Date(e);a.setHours(0,0,0,0);var n=new Date(t);for(n.setHours(23,59,59,999);a<=n;)r.push(new Date(a)),a=w(a,1);return r},Pe=function(e,t){for(var r=[],a=new Date(e);a<=t;)r.push(new Date(a)),a=w(a,7);return r},We=function(e,t){for(var r=[],a=p(new Date(e));a<=t;)r.push(new Date(a)),a=M(a,1);return r},Ke=function(e,t){for(var r=[],a=v(new Date(e));a<=t;)r.push(new Date(a)),a=D(a,1);return r},ze=function(){return!1!==G&&(Array.isArray(G)?G:[y.DAY,y.WEEK,y.MONTH,y.QUARTER,y.YEAR])},Be=function(){switch(Ee){case y.MINUTE:return Le(Fe,Ue,ne);case y.HOUR:return Ie(Fe,Ue);case y.DAY:return Se(Fe,Ue);case y.WEEK:return Pe(Fe,Ue);case y.MONTH:return H(Fe,Ue);case y.QUARTER:return We(Fe,Ue);case y.YEAR:return Ke(Fe,Ue);default:return H(Fe,Ue)}}(),Qe=Be.length,_e=function(){var e=new Date;switch(Ee){case y.MINUTE:return Be.findIndex((function(t){return t.getHours()===e.getHours()&&Math.floor(t.getMinutes()/(ne||5))===Math.floor(e.getMinutes()/(ne||5))&&t.getDate()===e.getDate()&&t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case y.HOUR:return Be.findIndex((function(t){return t.getHours()===e.getHours()&&t.getDate()===e.getDate()&&t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case y.DAY:return Be.findIndex((function(t){return t.getDate()===e.getDate()&&t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case y.WEEK:return Be.findIndex((function(t){var r=new Date(t);return r.setDate(t.getDate()+6),e>=t&&e<=r}));case y.MONTH:return Be.findIndex((function(t){return t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case y.QUARTER:var t=Math.floor(e.getMonth()/3);return Be.findIndex((function(r){return Math.floor(r.getMonth()/3)===t&&r.getFullYear()===e.getFullYear()}));case y.YEAR:return Be.findIndex((function(t){return t.getFullYear()===e.getFullYear()}));default:return-1}}(),qe=function(e){Ye(e),Me.current&&(e?Me.current.classList.add("rmg-auto-scrolling"):Me.current.classList.remove("rmg-auto-scrolling"))},Ve=function(e,t){if(me)try{var r=N(N({},t),{startDate:t.startDate instanceof Date?t.startDate:new Date(t.startDate),endDate:t.endDate instanceof Date?t.endDate:new Date(t.endDate)});Oe((function(e){return e+1})),me(e,r)}catch(e){console.error("Error in handleTaskUpdate:",e)}},Xe=function(e,t){if(ge)try{ge(e,t)}catch(e){console.error("Error in handleTaskClick:",e)}},je=function(e,t){if(Te((function(r){return t?x(x([],r,!0),[e.id],!1):r.filter((function(t){return t!==e.id}))})),fe)try{fe(e,t)}catch(e){console.error("Error in onTaskSelect handler:",e)}},Ge=function(e){switch(ke(e),e){case y.MINUTE:Ae(30);break;case y.HOUR:Ae(40);break;case y.DAY:Ae(50);break;case y.WEEK:Ae(80);break;case y.MONTH:Ae(150);break;case y.QUARTER:Ae(180);break;case y.YEAR:Ae(200);break;default:Ae(150)}ve&&ve(e)};n((function(){Ge(j)}),[j]),n((function(){if(pe.current){var e=Math.max(.1,Math.min(1,re||.25));pe.current.style.setProperty("--rmg-animation-speed",e.toString())}}),[re,pe.current]);var Je={fontSize:De||"inherit"},Ze=I?"rmg-dark":"",$e=function(e,t){return"".concat(t," ").concat(V[e]||"")},et=!1!==ze();return e.createElement("div",{ref:pe,className:"rmg-gantt-chart ".concat(Ze," ").concat($e("container","")),style:N(N({},Je),{"--gantt-unit-width":"".concat(xe,"px")}),"data-testid":"gantt-chart","data-rmg-component":"gantt-chart"},le?le({title:u,darkMode:I,viewMode:Ee,onViewModeChange:Ge,showViewModeSelector:et}):e.createElement("div",{className:"rmg-header"},e.createElement("div",{className:"rmg-header-content"},e.createElement("h1",{className:$e("title","rmg-title")},u),et&&e.createElement("div",{className:"rmg-view-mode-wrapper"},ce?ce({activeMode:Ee,onChange:Ge,darkMode:I,availableModes:ze()}):e.createElement(B,{activeMode:Ee,onChange:Ge,darkMode:I,availableModes:ze()})))),e.createElement("div",{className:"rmg-container","data-rmg-component":"container"},oe?oe({tasks:i,headerLabel:C,onGroupClick:he,viewMode:Ee}):e.createElement(_,{tasks:i,headerLabel:C,onGroupClick:he,className:$e("taskList","rmg-task-list"),viewMode:Ee}),e.createElement("div",{ref:Me,className:"rmg-timeline-container ".concat(He?"rmg-auto-scrolling":""),"data-rmg-component":"timeline-container"},e.createElement("div",{className:"rmg-timeline-content","data-rmg-component":"timeline-content"},ue?ue({timeUnits:Be,currentUnitIndex:_e,viewMode:Ee,locale:z,unitWidth:xe}):e.createElement(S,{months:Be,currentMonthIndex:_e,locale:z,className:$e("timeline","rmg-timeline"),viewMode:Ee,unitWidth:xe}),e.createElement("div",{className:"rmg-timeline-grid","data-rmg-component":"timeline-grid"},f&&_e>=0&&e.createElement(P,{currentMonthIndex:_e,height:i.reduce((function(e,t){if(!t||!Array.isArray(t.tasks))return e+60;var r=W.detectOverlaps(t.tasks,Ee);return e+Math.max(60,40*r.length+20)}),0),label:T,dayOfMonth:m.getDate(),className:$e("todayMarker","rmg-today-marker"),viewMode:Ee,unitWidth:xe}),i.map((function(t){return t&&t.id?e.createElement(q,{key:"task-row-".concat(t.id,"-").concat(Re),taskGroup:t,startDate:Fe,endDate:Ue,totalMonths:Qe,monthWidth:xe,editMode:b,showProgress:O,onTaskUpdate:Ve,onTaskClick:Xe,onTaskSelect:je,onAutoScrollChange:qe,className:$e("taskRow","rmg-task-row"),tooltipClassName:$e("tooltip","rmg-tooltip"),viewMode:Ee,scrollContainerRef:Me,smoothDragging:Z,movementThreshold:ee,animationSpeed:re,renderTask:ie,renderTooltip:se,getTaskColor:de}):null})))))))},X=function(t){return e.createElement(V,N({},t))},j={bgColor:"#ffffff",textColor:"#1f2937",borderColor:"#e5e7eb",highlightColor:"#eff6ff",markerColor:"#ef4444",taskColor:"#3b82f6",taskTextColor:"#ffffff",tooltipBgColor:"#ffffff",tooltipTextColor:"#1f2937",tooltipBorderColor:"#e5e7eb",progressBgColor:"rgba(0, 0, 0, 0.2)",progressFillColor:"#ffffff",shadowColor:"rgba(0, 0, 0, 0.1)",shadowHoverColor:"rgba(0, 0, 0, 0.2)",shadowDragColor:"rgba(0, 0, 0, 0.3)",scrollbarTrackColor:"rgba(229, 231, 235, 0.5)",scrollbarThumbColor:"rgba(156, 163, 175, 0.7)",scrollbarThumbHoverColor:"rgba(107, 114, 128, 0.8)"},G={bgColor:"#1f2937",textColor:"#f3f4f6",borderColor:"#374151",highlightColor:"#374151",markerColor:"#ef4444",taskColor:"#4f46e5",taskTextColor:"#ffffff",tooltipBgColor:"#1f2937",tooltipTextColor:"#f3f4f6",tooltipBorderColor:"#374151",progressBgColor:"rgba(255, 255, 255, 0.3)",progressFillColor:"#d1d5db",shadowColor:"rgba(0, 0, 0, 0.3)",shadowHoverColor:"rgba(0, 0, 0, 0.4)",shadowDragColor:"rgba(0, 0, 0, 0.5)",scrollbarTrackColor:"rgba(55, 65, 81, 0.5)",scrollbarThumbColor:"rgba(75, 85, 99, 0.7)",scrollbarThumbHoverColor:"rgba(107, 114, 128, 0.8)"};export{W as CollisionService,T as DateDisplayFormat,V as GanttChart,X as GanttChartWithStyles,Q as TaskItem,_ as TaskList,q as TaskRow,K as TaskService,S as Timeline,P as TodayMarker,z as Tooltip,y as ViewMode,B as ViewModeSelector,O as calculateDuration,L as calculateTaskPosition,G as darkTheme,X as default,j as defaultTheme,I as detectTaskOverlaps,F as findEarliestDate,U as findLatestDate,b as formatDate,R as formatDateRange,A as formatMonth,Y as getDaysInMonth,C as getDuration,H as getMonthsBetween};
//# sourceMappingURL=index.esm.js.map
