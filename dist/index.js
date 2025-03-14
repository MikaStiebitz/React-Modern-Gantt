"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),t=require("date-fns");function r(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var a,n,o=r(e),i=function(){return i=Object.assign||function(e){for(var t,r=1,a=arguments.length;r<a;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},i.apply(this,arguments)};function s(e,t,r){if(r||2===arguments.length)for(var a,n=0,o=t.length;n<o;n++)!a&&n in t||(a||(a=Array.prototype.slice.call(t,0,n)),a[n]=t[n]);return e.concat(a||Array.prototype.slice.call(t))}function l(e,t,r){if(void 0===t&&(t=exports.DateDisplayFormat.FULL_DATE),void 0===r&&(r="default"),!(e instanceof Date)||isNaN(e.getTime()))return"Invalid date";switch(t){case exports.DateDisplayFormat.MONTH_YEAR:return e.toLocaleString(r,{month:"short",year:"2-digit"});case exports.DateDisplayFormat.SHORT_DATE:return e.toLocaleString(r,{month:"short",day:"numeric"});case exports.DateDisplayFormat.FULL_DATE:default:return e.toLocaleString(r,{month:"short",day:"numeric",year:"numeric"})}}function c(e,t){var r=[];if(!(e instanceof Date&&t instanceof Date))return console.warn("getMonthsBetween: Invalid date parameters"),[new Date];for(var a=e.getFullYear(),n=e.getMonth(),o=t.getFullYear(),i=t.getMonth(),s=a;s<=o;s++)for(var l=s===o?i:11,c=s===a?n:0;c<=l;c++)r.push(new Date(s,c,1));return r}function u(e){if(!Array.isArray(e))return console.warn("detectTaskOverlaps: Invalid tasks array"),[];var t=e.filter((function(e){return e&&e.startDate instanceof Date&&e.endDate instanceof Date}));if(0===t.length)return[];var r=[];return t.forEach((function(e){for(var t=!1,a=0;a<r.length;a++){if(!r[a].some((function(t){return!(e.startDate>=t.endDate||e.endDate<=t.startDate)}))){r[a].push(e),t=!0;break}}t||r.push([e])})),r}function d(e){if(!Array.isArray(e)||0===e.length)return new Date;var t=new Date,r=!1;if(e.forEach((function(e){e&&Array.isArray(e.tasks)&&e.tasks.forEach((function(e){e&&e.startDate instanceof Date&&(r?e.startDate<t&&(t=new Date(e.startDate)):(t=new Date(e.startDate),r=!0))}))})),!r){var a=new Date;return new Date(a.getFullYear(),a.getMonth()-1,1)}return new Date(t.getFullYear(),t.getMonth(),1)}function f(e){if(!Array.isArray(e)||0===e.length)return new Date;var t=new Date,r=!1;if(e.forEach((function(e){e&&Array.isArray(e.tasks)&&e.tasks.forEach((function(e){e&&e.endDate instanceof Date&&(r?e.endDate>t&&(t=new Date(e.endDate)):(t=new Date(e.endDate),r=!0))}))})),!r){var a=new Date;return new Date(a.getFullYear(),a.getMonth()+2,0)}return new Date(t.getFullYear(),t.getMonth()+1,0)}"function"==typeof SuppressedError&&SuppressedError,exports.ViewMode=void 0,(a=exports.ViewMode||(exports.ViewMode={})).DAY="day",a.WEEK="week",a.MONTH="month",a.QUARTER="quarter",a.YEAR="year",exports.DateDisplayFormat=void 0,(n=exports.DateDisplayFormat||(exports.DateDisplayFormat={})).MONTH_YEAR="month-year",n.FULL_DATE="full-date",n.SHORT_DATE="short-date";var m=function(){function e(){}return e.detectOverlaps=function(e,t){var r=this;if(void 0===t&&(t=exports.ViewMode.MONTH),!Array.isArray(e)||0===e.length)return[];var a=s([],e,!0).sort((function(e,t){return e.startDate&&t.startDate?e.startDate.getTime()-t.startDate.getTime():0})),n=[];return a.forEach((function(e){for(var a=!1,o=0;o<n.length;o++){if(!n[o].some((function(a){return r.tasksVisuallyOverlap(e,a,t)}))){n[o].push(e),a=!0;break}}a||n.push([e])})),n},e.tasksVisuallyOverlap=function(e,t,r){if(void 0===r&&(r=exports.ViewMode.MONTH),!(e.startDate&&e.endDate&&t.startDate&&t.endDate))return!1;var a=e.startDate.getTime(),n=e.endDate.getTime(),o=t.startDate.getTime(),i=t.endDate.getTime(),s=this.getCollisionBufferByViewMode(r);return a+s<i-s&&n-s>o+s||Math.abs(a-o)<2*s||Math.abs(n-i)<2*s},e.getCollisionBufferByViewMode=function(e){var t=36e5,r=24*t;switch(e){case exports.ViewMode.DAY:return t;case exports.ViewMode.WEEK:return 4*t;case exports.ViewMode.MONTH:return 12*t;case exports.ViewMode.QUARTER:return r;case exports.ViewMode.YEAR:return 2*r;default:return 12*t}},e.wouldCollide=function(e,t,r,a){var n=this;return void 0===r&&(r=exports.ViewMode.MONTH),t.some((function(t){return t.id!==e.id&&t.id!==a&&n.tasksVisuallyOverlap(e,t,r)}))},e.getPreviewArrangement=function(e,t,r){void 0===r&&(r=exports.ViewMode.MONTH);var a=t.map((function(t){return t.id===e.id?e:t}));return this.detectOverlaps(a,r)},e}(),g=function(){function e(){}return e.calculateDatesFromPosition=function(e,r,a,n,o,i,s){void 0===s&&(s=exports.ViewMode.MONTH);try{var l=isNaN(e)?0:e,c=isNaN(r)||r<20?20:r,u=a.getTime(),d=(n.getTime()-u)/(o*i),f=l*d,m=c*d,g=new Date(u+f),h=new Date(u+f+m);if(s===exports.ViewMode.DAY){var v=Math.round(e/i),w=Math.max(1,Math.round(r/i)),p=new Date(a);p.setHours(0,0,0,0),(g=new Date(p)).setDate(p.getDate()+v),g.setHours(0,0,0,0),(h=new Date(g)).setDate(g.getDate()+w-1),h.setHours(23,59,59,999)}else g=t.startOfDay(g),h=t.endOfDay(h);return g<a&&(g=new Date(a)),h>n&&(h=new Date(n)),{newStartDate:g,newEndDate:h}}catch(e){return console.error("Error calculating dates from position:",e),{newStartDate:new Date(a),newEndDate:new Date(n)}}},e.createUpdatedTask=function(e,t,r){return i(i({},e),{startDate:new Date(t),endDate:new Date(r)})},e.calculateTaskPixelPosition=function(e,t,r,a,n,o){var i;void 0===o&&(o=exports.ViewMode.MONTH);try{if(!(e.startDate instanceof Date&&e.endDate instanceof Date))throw new Error("Invalid dates in task");var s=t.getTime(),l=r.getTime(),c=Math.max(e.startDate.getTime(),t.getTime()),u=Math.min(e.endDate.getTime(),r.getTime());if(o===exports.ViewMode.DAY){var d=new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0).getTime(),f=new Date(r.getFullYear(),r.getMonth(),r.getDate(),23,59,59,999).getTime();s=d,l=f;var m=new Date(new Date(c).getFullYear(),new Date(c).getMonth(),new Date(c).getDate(),0,0,0,0).getTime(),g=new Date(new Date(u).getFullYear(),new Date(u).getMonth(),new Date(u).getDate(),23,59,59,999).getTime();c=m,u=g}var h=l-s,v=a*n,w=(c-s)/h*v,p=(u-c)/h*v;o===exports.ViewMode.DAY&&(w=Math.round(w/n)*n,p=Math.max(n,Math.round(p/n)*n));var D=((i={})[exports.ViewMode.DAY]=20,i[exports.ViewMode.WEEK]=20,i[exports.ViewMode.MONTH]=20,i[exports.ViewMode.QUARTER]=30,i[exports.ViewMode.YEAR]=40,i)[o]||20;p=Math.max(D,p);var x=v-w;return{leftPx:w,widthPx:p=Math.min(x,p)}}catch(t){return console.error("Error calculating task position:",t,e),{leftPx:0,widthPx:20}}},e.getLiveDatesFromElement=function(e,t,r,a,n,o){void 0===o&&(o=exports.ViewMode.MONTH);try{if(!e)return{startDate:new Date(t),endDate:new Date(r)};var i=parseFloat(e.style.left||"0"),s=parseFloat(e.style.width||"0"),l=this.calculateDatesFromPosition(i,s,t,r,a,n,o);return{startDate:l.newStartDate,endDate:l.newEndDate}}catch(e){return console.error("Error getting live dates:",e),{startDate:new Date(t),endDate:new Date(r)}}},e.formatDate=function(e,t,r){if(void 0===t&&(t="default"),void 0===r&&(r=exports.ViewMode.MONTH),!(e instanceof Date)||isNaN(e.getTime()))return"Invalid date";var a;switch(r){case exports.ViewMode.DAY:case exports.ViewMode.WEEK:case exports.ViewMode.MONTH:a={year:"numeric",month:"short",day:"numeric"};break;case exports.ViewMode.QUARTER:a={year:"numeric",month:"short"};break;case exports.ViewMode.YEAR:a={year:"numeric"};break;default:a={year:"numeric",month:"short",day:"numeric"}}return e.toLocaleDateString(t,a)},e.getDuration=function(e,r,a){void 0===a&&(a=exports.ViewMode.MONTH);try{if(!(e instanceof Date)||!(r instanceof Date)||isNaN(e.getTime())||isNaN(r.getTime()))return{value:0,unit:"days"};var n=e<r?e:r,o=e<r?r:e;switch(a){case exports.ViewMode.DAY:var i=t.differenceInDays(o,n)+1;return{value:i,unit:1===i?"day":"days"};case exports.ViewMode.WEEK:var s=t.differenceInWeeks(o,n)+1;return{value:s,unit:1===s?"week":"weeks"};case exports.ViewMode.MONTH:var l=t.differenceInMonths(o,n)+1;return{value:l,unit:1===l?"month":"months"};case exports.ViewMode.QUARTER:var c=t.differenceInQuarters(o,n)+1;return{value:c,unit:1===c?"quarter":"quarters"};case exports.ViewMode.YEAR:var u=t.differenceInYears(o,n)+1;return{value:u,unit:1===u?"year":"years"};default:var d=t.differenceInDays(o,n)+1;return{value:d,unit:1===d?"day":"days"}}}catch(e){return console.error("Error calculating duration:",e),{value:0,unit:"days"}}},e.datesOverlap=function(e,r,a,n){return t.isWithinInterval(e,{start:a,end:n})||t.isWithinInterval(r,{start:a,end:n})||t.isWithinInterval(a,{start:e,end:r})||t.isWithinInterval(n,{start:e,end:r})},e}(),h=function(t){var r=t.task,a=t.leftPx,n=t.widthPx,s=t.topPx,l=t.isHovered,c=t.isDragging,u=t.editMode,d=t.showProgress,f=void 0!==d&&d,m=t.instanceId,g=t.renderTask,h=t.getTaskColor,v=t.onMouseDown,w=t.onMouseEnter,p=t.onMouseLeave,D=t.onClick,x=(l||c)&&u,M=e.useRef(null),y=e.useRef(!1),E=e.useRef(a),k=e.useRef(n);if(!r||!r.id)return console.warn("TaskItem: Invalid task data",r),null;var b=r.color||"bg-gantt-task",T="",N="text-gantt-task-text";if(h){var V=h({task:r,isHovered:l,isDragging:c});b=V.backgroundColor,T=V.borderColor||"",N=V.textColor||N}if(e.useEffect((function(){if(M.current&&(E.current!==a||k.current!==n)){y.current=!0,M.current.classList.add("rmg-task-updated");var e=setTimeout((function(){M.current&&M.current.classList.remove("rmg-task-updated"),y.current=!1}),1e3);return E.current=a,k.current=n,function(){return clearTimeout(e)}}}),[a,n]),g){var A=g({task:r,leftPx:a,widthPx:n,topPx:s,isHovered:l,isDragging:c,editMode:u,showProgress:f});return o.default.createElement("div",{ref:M,className:"absolute",style:{left:"".concat(Math.max(0,a),"px"),width:"".concat(Math.max(20,n),"px"),top:"".concat(s,"px")},onClick:function(e){return D(e,r)},onMouseDown:function(e){return v(e,r,"move")},onMouseEnter:function(e){return w(e,r)},onMouseLeave:p,"data-testid":"task-".concat(r.id),"data-task-id":r.id,"data-instance-id":m,"data-dragging":c?"true":"false"},A)}var Y=b.startsWith("bg-")?{}:{backgroundColor:b},R=b.startsWith("bg-")?b:"",F=T?T.startsWith("border-")?{}:{borderColor:T,borderWidth:"1px"}:{},S=T&&T.startsWith("border-")?T:"";return o.default.createElement("div",{ref:M,className:"absolute h-8 rounded ".concat(R," ").concat(S," ").concat(N," flex items-center px-2 text-xs font-medium ").concat(u?"cursor-move":"cursor-pointer"," ").concat(c?"shadow-lg":""),style:i(i(i({left:"".concat(Math.max(0,a),"px"),width:"".concat(Math.max(20,n),"px"),top:"".concat(s,"px")},Y),F),{willChange:c?"transform, left, width":"auto"}),onClick:function(e){return D(e,r)},onMouseDown:function(e){return v(e,r,"move")},onMouseEnter:function(e){return w(e,r)},onMouseLeave:p,"data-testid":"task-".concat(r.id),"data-task-id":r.id,"data-instance-id":m,"data-dragging":c?"true":"false"},x&&o.default.createElement("div",{className:"absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-l rmg-resize-handle",onMouseDown:function(e){e.stopPropagation(),v(e,r,"resize-left")}}),o.default.createElement("div",{className:"truncate select-none"},r.name||"Unnamed Task"),f&&"number"==typeof r.percent&&o.default.createElement("div",{className:"absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 dark:bg-opacity-30 rounded-full overflow-hidden"},o.default.createElement("div",{className:"h-full bg-white dark:bg-gray-200 rounded-full",style:{width:"".concat(r.percent,"%")}})),x&&o.default.createElement("div",{className:"absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-r rmg-resize-handle",onMouseDown:function(e){e.stopPropagation(),v(e,r,"resize-right")}}))},v=function(e){var r=e.task,a=e.position,n=e.dragType,i=e.taskId,s=e.startDate,l=e.endDate,c=e.totalMonths,u=e.monthWidth,d=e.showProgress,f=void 0!==d&&d,m=e.instanceId,h=e.className,v=void 0===h?"":h,w=e.viewMode,p=void 0===w?exports.ViewMode.MONTH:w,D=e.renderTooltip,x=r.startDate,M=r.endDate;try{var y=i||r.id,E=document.querySelector('[data-task-id="'.concat(y,'"][data-instance-id="').concat(m,'"]'));if(E&&(n||E.style.left||E.style.width)){var k=g.getLiveDatesFromElement(E,s,l,c,u,p);x=k.startDate,M=k.endDate}}catch(e){console.error("Error calculating live dates for tooltip:",e)}var b=g.getDuration(x,M,p),T=function(e){return e instanceof Date&&!isNaN(e.getTime())?p===exports.ViewMode.DAY?t.format(e,"EEE, MMM d, yyyy"):t.format(e,"MMM d, yyyy"):"Invalid date"},N=function(){if(!n)return null;switch(n){case"move":return"Moving task...";case"resize-left":return"Adjusting start date...";case"resize-right":return"Adjusting end date...";default:return null}}();return D?o.default.createElement("div",{className:"rmg-task-tooltip absolute z-20 ".concat(v),style:{left:"".concat(a.x,"px"),top:"".concat(a.y-40,"px")}},D({task:r,position:a,dragType:n,startDate:x,endDate:M,viewMode:p})):o.default.createElement("div",{className:"rmg-task-tooltip absolute z-20 bg-[var(--rmg-tooltip-bg,#ffffff)] text-[var(--rmg-tooltip-text,#1f2937)] border border-[var(--rmg-tooltip-border,#e5e7eb)] rounded-md shadow-md p-2 text-xs select-none ".concat(v),style:{left:"".concat(a.x,"px"),top:"".concat(a.y-40,"px"),minWidth:"200px"}},o.default.createElement("div",{className:"font-bold mb-1"},r.name||"Unnamed Task"),N&&o.default.createElement("div",{className:"text-xs text-blue-500 dark:text-blue-400 mb-1 italic"},N),o.default.createElement("div",{className:"grid grid-cols-2 gap-x-2 gap-y-1"},o.default.createElement("div",{className:"font-semibold"},"Start:"),o.default.createElement("div",null,T(x)),o.default.createElement("div",{className:"font-semibold"},"End:"),o.default.createElement("div",null,T(M)),o.default.createElement("div",{className:"font-semibold"},"Duration:"),o.default.createElement("div",null,b.value," ",b.unit),f&&"number"==typeof r.percent&&o.default.createElement(o.default.Fragment,null,o.default.createElement("div",{className:"font-semibold"},"Progress:"),o.default.createElement("div",null,r.percent,"%")),r.dependencies&&r.dependencies.length>0&&o.default.createElement(o.default.Fragment,null,o.default.createElement("div",{className:"font-semibold"},"Dependencies:"),o.default.createElement("div",null,r.dependencies.join(", ")))))},w=function(t){var r=t.taskGroup,a=t.startDate,n=t.endDate,s=t.totalMonths,l=t.monthWidth,c=t.editMode,u=void 0===c||c,d=t.showProgress,f=void 0!==d&&d,w=t.className,p=void 0===w?"":w,D=t.tooltipClassName,x=void 0===D?"":D,M=t.onTaskUpdate,y=t.onTaskClick,E=t.onTaskSelect,k=t.onAutoScrollChange,b=t.viewMode,T=void 0===b?exports.ViewMode.MONTH:b,N=t.scrollContainerRef,V=t.smoothDragging,A=void 0===V||V;t.movementThreshold;var Y=t.animationSpeed,R=void 0===Y?.25:Y,F=t.renderTask,S=t.renderTooltip,O=t.getTaskColor;if(!r||!r.id||!Array.isArray(r.tasks))return console.warn("TaskRow: Invalid task group data",r),o.default.createElement("div",{className:"relative h-16 text-gantt-text"},"Invalid task group data");var L=a instanceof Date?a:new Date,H=n instanceof Date?n:new Date,I=e.useState(null),C=I[0],P=I[1],W=e.useState(null),U=W[0],z=W[1],Q=e.useState(null),K=Q[0],q=Q[1],_=e.useState(0),j=_[0],B=_[1],G=e.useState({x:0,y:0}),X=G[0],J=G[1],Z=e.useState(null),$=Z[0],ee=Z[1],te=e.useState(null),re=te[0],ae=te[1],ne=e.useRef(null),oe=e.useRef({x:0,y:0}),ie=e.useRef(null),se=e.useRef(null),le=e.useRef({left:0,width:0}),ce=e.useRef(0),ue=e.useRef(!1),de=e.useRef(null),fe=e.useRef(0),me=e.useRef(null),ge=e.useRef({minLeft:0,maxLeft:s*l}),he=e.useRef(null),ve=e.useRef(null),we=e.useRef(null),pe=e.useRef(null),De=e.useRef("task-row-".concat(Math.random().toString(36).substring(2,11))),xe=A&&T!==exports.ViewMode.DAY,Me=function(e){ee(e),we.current=e},ye=$?m.getPreviewArrangement($,r.tasks,T):m.detectOverlaps(r.tasks,T),Ee=Math.max(60,40*ye.length+20);e.useEffect((function(){ge.current={minLeft:0,maxLeft:s*l}}),[s,l]);var ke=function(){if(pe.current&&ie.current&&se.current){var e=Date.now(),t=e-ce.current;ce.current=e;var r=R||.25,a=se.current.left+(ie.current.left-se.current.left)*r,n=se.current.width+(ie.current.width-se.current.width)*r;le.current.left=(a-se.current.left)/(t||16),le.current.width=(n-se.current.width)/(t||16),se.current={left:a,width:n},pe.current.style.left="".concat(a,"px"),pe.current.style.width="".concat(n,"px"),ve.current&&be(a,n),ne.current=requestAnimationFrame(ke)}else ne.current=null},be=function(e,t){if(ve.current)try{if(T===exports.ViewMode.DAY){var r=Math.round(e/l),a=Math.max(1,Math.round(t/l)),n=new Date(L);n.setHours(0,0,0,0),(h=new Date(n)).setDate(n.getDate()+r),h.setHours(0,0,0,0),(v=new Date(h)).setDate(h.getDate()+a-1),v.setHours(23,59,59,999);var o=L.getTime(),c=H.getTime();h.getTime()<o&&h.setTime(o),v.getTime()>c&&v.setTime(c);var u=i(i({},ve.current),{startDate:h,endDate:v});Me(u)}else{var d=Oe(L,H,T)/(s*l),f=L.getTime()+e*d,m=L.getTime()+(e+t)*d;o=L.getTime(),c=H.getTime();f<o&&(f=o),m>c&&(m=c);var g=Le(new Date(f),new Date(m),T),h=g.newStartDate,v=g.newEndDate;u=i(i({},ve.current),{startDate:h,endDate:v});Me(u)}}catch(e){console.error("Error updating dates:",e)}},Te=function(){if(!ue.current){ue.current=!0;var e=function(){if(ue.current&&(null==N?void 0:N.current)&&ie.current){var t=N.current,r=me.current,a=fe.current,n=t.scrollLeft,o=t.scrollWidth-t.clientWidth;if("left"===r){if(n<=0)return void Ne();var i=Math.max(0,n-a);if(t.scrollLeft=i,ie.current){var s=Math.max(ge.current.minLeft,ie.current.left-a);ie.current.left=s}}else if("right"===r){if(n>=o)return void Ne();i=Math.min(o,n+a);if(t.scrollLeft=i,ie.current&&re){var l=ge.current.maxLeft-ie.current.width;s=Math.min(l,ie.current.left+a);ie.current.left=s}}ue.current&&(de.current=requestAnimationFrame(e))}};de.current=requestAnimationFrame(e)}},Ne=function(){ue.current=!1,null!==de.current&&(cancelAnimationFrame(de.current),de.current=null)},Ve=function(e,t){y&&!U&&y(t,r),E&&E(t,!0)},Ae=function(e,t){U||(P(t),Re(e))},Ye=function(){U||P(null)},Re=function(e){if(he.current){var t=he.current.getBoundingClientRect();J({x:e.clientX-t.left+20,y:e.clientY-t.top})}},Fe=function(e,t,r){if(u){e.preventDefault(),e.stopPropagation();var a=document.querySelector('[data-task-id="'.concat(t.id,'"][data-instance-id="').concat(De.current,'"]'));if(a){pe.current=a;var n=parseFloat(a.style.left||"0"),o=parseFloat(a.style.width||"0");ae({left:n,width:o,startDate:new Date(t.startDate),endDate:new Date(t.endDate)}),ie.current={left:n,width:o},se.current={left:n,width:o},oe.current={x:e.clientX,y:e.clientY},ce.current=Date.now(),le.current={left:0,width:0},a.setAttribute("data-dragging","true"),a.style.transition="none",z(t),q(r),B(e.clientX),ee(t),function(e){z(e),ve.current=e}(t),Me(t),null===ne.current&&xe&&(ne.current=requestAnimationFrame(ke)),document.addEventListener("mouseup",He),document.addEventListener("mousemove",Se)}}},Se=function(e){if(oe.current={x:e.clientX,y:e.clientY},e instanceof MouseEvent&&C&&he.current){var t=he.current.getBoundingClientRect();J({x:e.clientX-t.left+20,y:e.clientY-t.top})}else e instanceof MouseEvent||Re(e);if(U&&(null==N?void 0:N.current)&&function(e){if((null==N?void 0:N.current)&&U){var t=N.current.getBoundingClientRect(),r=null,a=0;e<t.left+40?(r="left",a=Math.max(1,Math.round((40-(e-t.left))/10))):e>t.right-40&&(r="right",a=Math.max(1,Math.round((e-(t.right-40))/10))),me.current=r,fe.current=a,r&&!ue.current?(Te(),k&&k(!0)):!r&&ue.current&&(Ne(),k&&k(!1))}}(e.clientX),U&&K&&re&&he.current&&ie.current)try{var r=e.clientX-j,a=s*l,n=ie.current.left,o=ie.current.width;switch(K){case"move":n=Math.max(0,Math.min(a-re.width,re.left+r)),T===exports.ViewMode.DAY&&(n=Math.round(n/l)*l);break;case"resize-left":var i=re.width-20,c=Math.min(i,r);n=Math.max(0,re.left+c),T===exports.ViewMode.DAY&&(n=Math.round(n/l)*l);var u=re.left+re.width;o=Math.max(20,u-n),T===exports.ViewMode.DAY&&(o=Math.round(o/l)*l,o=Math.max(l,o));break;case"resize-right":o=Math.max(20,Math.min(a-re.left,re.width+r)),T===exports.ViewMode.DAY&&(o=Math.round(o/l)*l,o=Math.max(l,o))}ie.current={left:n,width:o},T===exports.ViewMode.DAY&&pe.current?(pe.current.style.left="".concat(n,"px"),pe.current.style.width="".concat(o,"px"),be(n,o)):xe?null===ne.current&&(ce.current=Date.now(),ne.current=requestAnimationFrame(ke)):pe.current&&(pe.current.style.left="".concat(n,"px"),pe.current.style.width="".concat(o,"px"),be(n,o))}catch(e){console.error("Error in handleMouseMove:",e)}},Oe=function(e,t,r){var a=new Date(e).setHours(0,0,0,0),n=new Date(t).setHours(23,59,59,999)-a;return exports.ViewMode.DAY,n},Le=function(e,t,r){var a=new Date(e),n=new Date(t);switch(r){case exports.ViewMode.DAY:a=new Date(a.getFullYear(),a.getMonth(),a.getDate(),0,0,0,0),n=new Date(n.getFullYear(),n.getMonth(),n.getDate(),23,59,59,999);case exports.ViewMode.WEEK:case exports.ViewMode.MONTH:case exports.ViewMode.QUARTER:case exports.ViewMode.YEAR:}return{newStartDate:a,newEndDate:n}},He=function(){try{null!==ne.current&&(cancelAnimationFrame(ne.current),ne.current=null),function(){if(pe.current&&ie.current&&ve.current){var e=ie.current.left,t=ie.current.width;T===exports.ViewMode.DAY?(e=Math.round(e/l)*l,t=Math.round(t/l)*l,t=Math.max(l,t),pe.current.style.transition="transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out",pe.current.style.left="".concat(e,"px"),pe.current.style.width="".concat(t,"px")):xe||(pe.current.style.transition="transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out",pe.current.style.left="".concat(e,"px"),pe.current.style.width="".concat(t,"px"));var a=we.current;if(a){var n=L.getTime(),o=H.getTime();if(a.startDate.getTime()<n&&(a=i(i({},a),{startDate:new Date(n)})),a.endDate.getTime()>o&&(a=i(i({},a),{endDate:new Date(o)})),M&&a)try{M(r.id,a)}catch(e){console.error("Error in onTaskUpdate:",e)}}}}(),pe.current&&(pe.current.setAttribute("data-dragging","false"),setTimeout((function(){pe.current&&(pe.current.style.transition="")}),200))}catch(e){console.error("Error in handleMouseUp:",e)}finally{Ne(),k&&k(!1),z(null),q(null),ee(null),ae(null),ve.current=null,we.current=null,pe.current=null,ie.current=null,se.current=null,document.removeEventListener("mouseup",He),document.removeEventListener("mousemove",Se)}};return e.useEffect((function(){return function(){document.removeEventListener("mouseup",He),document.removeEventListener("mousemove",Se),Ne(),null!==ne.current&&(cancelAnimationFrame(ne.current),ne.current=null)}}),[]),r.tasks&&0!==r.tasks.length?o.default.createElement("div",{className:"relative border-b border-gantt-border ".concat(p),style:{height:"".concat(Ee,"px")},onMouseMove:function(e){return Se(e)},onMouseLeave:function(){return P(null)},ref:he,"data-testid":"task-row-".concat(r.id),"data-instance-id":De.current},ye.map((function(e,t){return o.default.createElement(o.default.Fragment,{key:"task-row-".concat(t)},e.map((function(e){try{if(!(e&&e.id&&e.startDate instanceof Date&&e.endDate instanceof Date))return console.warn("Invalid task data:",e),null;var r=g.calculateTaskPixelPosition(e,L,H,s,l,T),a=r.leftPx,n=r.widthPx,i=(null==C?void 0:C.id)===e.id,c=(null==U?void 0:U.id)===e.id,d=40*t+10;return o.default.createElement(h,{key:"task-".concat(e.id),task:e,leftPx:a,widthPx:n,topPx:d,isHovered:i,isDragging:c,editMode:u,showProgress:f,instanceId:De.current,onMouseDown:Fe,onMouseEnter:Ae,onMouseLeave:Ye,onClick:Ve,renderTask:F,getTaskColor:O})}catch(t){return console.error("Error rendering task:",t,e),null}})))})),(C||U)&&o.default.createElement(v,{task:$||U||C,position:X,dragType:K,taskId:null==U?void 0:U.id,startDate:L,endDate:H,totalMonths:s,monthWidth:l,showProgress:f,instanceId:De.current,className:x,viewMode:T,renderTooltip:S})):o.default.createElement("div",{className:"relative h-16 text-gantt-text"},"No tasks available")},p=function(e){var r=e.months,a=e.currentMonthIndex,n=(e.locale,e.className),i=void 0===n?"":n,s=e.viewMode,l=void 0===s?exports.ViewMode.MONTH:s,c=e.unitWidth,u=void 0===c?150:c,d=[exports.ViewMode.DAY,exports.ViewMode.WEEK].includes(l),f=function(){if(![exports.ViewMode.DAY,exports.ViewMode.WEEK].includes(l)||0===r.length)return[];var e=[],t=new Date(r[0]),a=0;return r.forEach((function(r){r.getMonth()===t.getMonth()&&r.getFullYear()===t.getFullYear()?a+=1:(e.push({date:t,span:a}),t=new Date(r),a=1)})),a>0&&e.push({date:t,span:a}),e}();return o.default.createElement("div",{className:"rmg-timeline ".concat(i),style:{"--gantt-unit-width":"".concat(u,"px")}},d&&o.default.createElement("div",{className:"flex border-b border-gantt-border"},f.map((function(e,r){return o.default.createElement("div",{key:"higher-level-".concat(r),className:"flex-shrink-0 p-2 font-semibold text-center text-gantt-text border-r border-gantt-border h-10",style:{width:"".concat(e.span*u,"px")},"data-timeunit-higher":e.date.toISOString()},function(e){if(!(e instanceof Date))return"";switch(l){case exports.ViewMode.DAY:case exports.ViewMode.WEEK:}return t.format(e,"MMM yyyy",{locale:void 0})}(e.date))}))),o.default.createElement("div",{className:"flex border-b border-gantt-border"},r.map((function(e,r){return o.default.createElement("div",{key:"timeunit-".concat(r),className:"".concat("w-[var(--gantt-unit-width)]"," flex-shrink-0 p-2 font-semibold text-center text-gantt-text ").concat(r===a?"bg-gantt-highlight":""," ").concat(d?"border-r border-gantt-border":""," h-10"),"data-timeunit":e.toISOString(),"data-date":(n=e,l===exports.ViewMode.DAY?n.toISOString().slice(0,10):"")},function(e){if(!(e instanceof Date&&t.isValid(e)))return"";switch(l){case exports.ViewMode.DAY:return t.format(e,"d",{locale:void 0});case exports.ViewMode.WEEK:var r=t.getWeek(e);return"W".concat(r);case exports.ViewMode.MONTH:return t.format(e,"MMM yyyy",{locale:void 0});case exports.ViewMode.QUARTER:var a=Math.floor(e.getMonth()/3)+1;return"Q".concat(a," ").concat(e.getFullYear());case exports.ViewMode.YEAR:return e.getFullYear().toString();default:return t.format(e,"MMM yyyy",{locale:void 0})}}(e));var n}))))},D=function(e){var t=e.currentMonthIndex,r=e.height,a=e.markerClass,n=void 0===a?"bg-red-500":a,i=e.label,s=void 0===i?"Today":i,l=e.dayOfMonth,c=e.className,u=void 0===c?"":c,d=e.viewMode,f=void 0===d?exports.ViewMode.MONTH:d,m=e.unitWidth,g=void 0===m?150:m;if(t<0)return null;var h=function(){var e=new Date;switch(l||e.getDate(),f){case exports.ViewMode.DAY:return t*g+g/2;case exports.ViewMode.WEEK:var r=e.getDay();return t*g+g*(r/7);case exports.ViewMode.MONTH:r=e.getDay();return t*g+g*(r/7);case exports.ViewMode.QUARTER:var a=e.getMonth()%3;return t*g+g*(a/3);case exports.ViewMode.YEAR:var n=e.getMonth();return t*g+g*(n/12);default:return t*g+g/2}}();return o.default.createElement("div",{className:"absolute top-0 w-px ".concat(n," z-10 ").concat(u),style:{left:"".concat(h,"px"),height:"".concat(r,"px")},"data-testid":"today-marker"},o.default.createElement("div",{className:"absolute -top-3 left-1/2 transform -translate-x-1/2 ".concat(n," px-1 py-0.5 rounded text-xs text-white whitespace-nowrap")},s))},x=function(t){var r=t.activeMode,a=t.onChange,n=t.darkMode,i=[{id:exports.ViewMode.DAY,label:"Day"},{id:exports.ViewMode.WEEK,label:"Week"},{id:exports.ViewMode.MONTH,label:"Month"},{id:exports.ViewMode.QUARTER,label:"Quarter"},{id:exports.ViewMode.YEAR,label:"Year"}],s=e.useRef(null),l=e.useState({left:"0px",width:"0px"}),c=l[0],u=l[1];e.useEffect((function(){var e=function(){if(s.current){var e=s.current.querySelector('[aria-selected="true"]');if(e){var t=e,r=t.offsetLeft,a=t.offsetWidth;u({left:"".concat(r,"px"),width:"".concat(a,"px")})}}};return e(),window.addEventListener("resize",e),function(){return window.removeEventListener("resize",e)}}),[r]);var d="\n        relative inline-flex rounded-full p-0.5\n        ".concat(n?"bg-gray-800/80":"bg-gray-100/90","\n        transition-all duration-300 ease-in-out shadow-sm\n        border ").concat(n?"border-gray-700":"border-gray-200","\n    ");return o.default.createElement("div",{className:"relative flex items-center"},o.default.createElement("div",{ref:s,className:d,role:"tablist","aria-label":"View mode options"},o.default.createElement("span",{className:"\n                        absolute z-0 inset-0.5 rounded-full\n                        transition-all duration-300 ease-out transform\n                        ".concat(n?"bg-indigo-600":"bg-indigo-500","\n                    "),style:c,"aria-hidden":"true"}),i.map((function(e){return o.default.createElement("button",{key:e.id,role:"tab","aria-selected":r===e.id,"aria-controls":"panel-".concat(e.id),className:"".concat((t=r===e.id,"\n        relative z-10 px-3 py-1 text-xs font-medium\n        transition-all duration-200 ease-in-out\n        ".concat(t?"text-white":n?"text-gray-400 hover:text-gray-200":"text-gray-500 hover:text-gray-700","\n        focus:outline-none\n    "))," rounded-full"),onClick:function(){return a(e.id)}},e.label);var t}))))},M=function(e){var t=e.tasks,r=void 0===t?[]:t,a=e.headerLabel,n=void 0===a?"Resources":a,i=e.showIcon,s=void 0!==i&&i,l=e.showTaskCount,c=void 0!==l&&l,d=e.showDescription,f=void 0===d||d,m=e.rowHeight,g=void 0===m?40:m,h=e.className,v=void 0===h?"":h,w=e.onGroupClick,p=e.viewMode,D=Array.isArray(r)?r:[],x=p===exports.ViewMode.DAY||p===exports.ViewMode.WEEK;return o.default.createElement("div",{className:"rmg-task-list w-40 flex-shrink-0 z-10 bg-gantt-bg shadow-sm ".concat(v)},x?o.default.createElement(o.default.Fragment,null,o.default.createElement("div",{className:"p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"}),o.default.createElement("div",{className:"p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"},n)):o.default.createElement("div",{className:"p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"},n),D.map((function(e){if(!e)return null;var t=function(e){if(!e.tasks||!Array.isArray(e.tasks))return 60;var t=u(e.tasks);return Math.max(60,t.length*g+20)}(e);return o.default.createElement("div",{key:"task-group-".concat(e.id||"unknown"),className:"p-2 border-r border-b border-gantt-border font-medium text-gantt-text bg-gantt-bg hover:bg-gantt-highlight transition-colors duration-150",style:{height:"".concat(t,"px")},onClick:function(){return t=e,void(w&&w(t));var t},"data-testid":"task-group-".concat(e.id||"unknown")},o.default.createElement("div",{className:"flex items-center"},s&&e.icon&&o.default.createElement("span",{className:"mr-2",dangerouslySetInnerHTML:{__html:e.icon}}),o.default.createElement("div",{className:"font-medium truncate"},e.name||"Unnamed")),f&&e.description&&o.default.createElement("div",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1 truncate"},e.description),c&&e.tasks&&e.tasks.length>0&&o.default.createElement("div",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1"},e.tasks.length," ",1===e.tasks.length?"task":"tasks"))})))};exports.CollisionManager=m,exports.GanttChart=function(r){var a=r.tasks,n=void 0===a?[]:a,l=r.startDate,m=r.endDate,g=r.title,h=void 0===g?"Project Timeline":g,v=r.currentDate,y=void 0===v?new Date:v,E=r.showCurrentDateMarker,k=void 0===E||E,b=r.todayLabel,T=void 0===b?"Today":b,N=r.editMode,V=void 0===N||N,A=r.headerLabel,Y=void 0===A?"Resources":A,R=r.showProgress,F=void 0!==R&&R,S=r.darkMode,O=void 0!==S&&S,L=r.locale,H=void 0===L?"default":L,I=r.styles,C=void 0===I?{}:I,P=r.viewMode,W=void 0===P?exports.ViewMode.MONTH:P,U=r.showViewModeSelector,z=void 0===U||U,Q=r.smoothDragging,K=void 0===Q||Q,q=r.movementThreshold,_=void 0===q?3:q,j=r.animationSpeed,B=void 0===j?.25:j,G=r.renderTaskList,X=r.renderTask,J=r.renderTooltip,Z=r.getTaskColor,$=r.onTaskUpdate,ee=r.onTaskClick,te=r.onTaskSelect;r.onTaskDoubleClick;var re=r.onGroupClick,ae=r.onViewModeChange,ne=r.fontSize,oe=r.rowHeight,ie=void 0===oe?40:oe;r.timeStep;var se=e.useRef(null),le=e.useRef(null),ce=e.useState(W),ue=ce[0],de=ce[1],fe=e.useState([]);fe[0];var me=fe[1],ge=e.useState(150),he=ge[0],ve=ge[1],we=e.useState(!1),pe=we[0],De=we[1],xe=l||d(n),Me=m||f(n),ye=function(e,r){var a=[],n=new Date(e);n.setHours(0,0,0,0);var o=new Date(r);for(o.setHours(23,59,59,999);n<=o;)a.push(new Date(n)),n=t.addDays(n,1);return a},Ee=function(e,r){for(var a=[],n=new Date(e);n<=r;)a.push(new Date(n)),n=t.addDays(n,7);return a},ke=function(e,r){for(var a=[],n=t.startOfQuarter(new Date(e));n<=r;)a.push(new Date(n)),n=t.addQuarters(n,1);return a},be=function(e,r){for(var a=[],n=t.startOfYear(new Date(e));n<=r;)a.push(new Date(n)),n=t.addYears(n,1);return a},Te=function(){switch(ue){case exports.ViewMode.DAY:return ye(xe,Me);case exports.ViewMode.WEEK:return Ee(xe,Me);case exports.ViewMode.MONTH:return c(xe,Me);case exports.ViewMode.QUARTER:return ke(xe,Me);case exports.ViewMode.YEAR:return be(xe,Me);default:return c(xe,Me)}}(),Ne=Te.length,Ve=function(){var e=new Date;switch(ue){case exports.ViewMode.DAY:return Te.findIndex((function(t){return t.getDate()===e.getDate()&&t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case exports.ViewMode.WEEK:return Te.findIndex((function(t){var r=new Date(t);return r.setDate(t.getDate()+6),e>=t&&e<=r}));case exports.ViewMode.MONTH:return Te.findIndex((function(t){return t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case exports.ViewMode.QUARTER:var t=Math.floor(e.getMonth()/3);return Te.findIndex((function(r){return Math.floor(r.getMonth()/3)===t&&r.getFullYear()===e.getFullYear()}));case exports.ViewMode.YEAR:return Te.findIndex((function(t){return t.getFullYear()===e.getFullYear()}));default:return-1}}(),Ae=function(e){De(e),le.current&&(e?le.current.classList.add("rmg-auto-scrolling"):le.current.classList.remove("rmg-auto-scrolling"))},Ye=function(e,t){if($)try{var r=i(i({},t),{startDate:t.startDate instanceof Date?t.startDate:new Date(t.startDate),endDate:t.endDate instanceof Date?t.endDate:new Date(t.endDate)});$(e,r)}catch(e){console.error("Error in handleTaskUpdate:",e)}},Re=function(e,t){if(ee)try{ee(e,t)}catch(e){console.error("Error in handleTaskClick:",e)}},Fe=function(e,t){if(me((function(r){return t?s(s([],r,!0),[e.id],!1):r.filter((function(t){return t!==e.id}))})),te)try{te(e,t)}catch(e){console.error("Error in onTaskSelect handler:",e)}},Se=function(e){switch(de(e),e){case exports.ViewMode.DAY:ve(50);break;case exports.ViewMode.WEEK:ve(80);break;case exports.ViewMode.MONTH:ve(150);break;case exports.ViewMode.QUARTER:ve(180);break;case exports.ViewMode.YEAR:ve(200);break;default:ve(150)}ae&&ae(e)};e.useEffect((function(){Se(W)}),[W]),e.useEffect((function(){if(se.current){var e=Math.max(.1,Math.min(1,B||.25));se.current.style.setProperty("--rmg-animation-speed",e.toString())}}),[B,se.current]);var Oe,Le={fontSize:ne||"inherit"},He=O?"dark":"",Ie=i(i({},{container:"",title:"",header:"",taskList:"",timeline:"",taskRow:"",todayMarker:"",tooltip:""}),C);return o.default.createElement("div",{ref:se,className:"rmg-gantt-chart w-full bg-gantt-bg text-gantt-text rounded-xl shadow-lg overflow-hidden ".concat(He," ").concat(Ie.container),style:i(i({},Le),{"--gantt-unit-width":"".concat(he,"px")}),"data-testid":"gantt-chart"},o.default.createElement("div",{className:"p-6 border-b border-gantt-border"},o.default.createElement("div",{className:"flex justify-between items-center"},o.default.createElement("h1",{className:"text-2xl font-bold text-gantt-text ".concat(Ie.title)},h),z&&o.default.createElement("div",{className:"flex space-x-2"},o.default.createElement(x,{activeMode:ue,onChange:Se,darkMode:O})))),o.default.createElement("div",{className:"relative flex"},G?G({tasks:n,headerLabel:Y,onGroupClick:re,viewMode:ue}):o.default.createElement(M,{tasks:n,headerLabel:Y,onGroupClick:re,className:Ie.taskList,viewMode:ue}),o.default.createElement("div",{ref:le,className:"flex-grow overflow-x-auto rmg-gantt-scroll-container ".concat(pe?"rmg-auto-scrolling":"")},o.default.createElement("div",{className:"min-w-max"},o.default.createElement(p,{months:Te,currentMonthIndex:Ve,locale:H,className:Ie.timeline,viewMode:ue,unitWidth:he}),o.default.createElement("div",{className:"relative"},k&&Ve>=0&&o.default.createElement(D,{currentMonthIndex:Ve,height:(Oe=0,n.forEach((function(e){if(e&&Array.isArray(e.tasks)){var t=u(e.tasks);Oe+=Math.max(60,t.length*ie+20)}else Oe+=60})),Oe),label:T,dayOfMonth:y.getDate(),className:Ie.todayMarker,viewMode:ue,unitWidth:he}),n.map((function(e){return e&&e.id?o.default.createElement(w,{key:"task-row-".concat(e.id),taskGroup:e,startDate:xe,endDate:Me,totalMonths:Ne,monthWidth:he,editMode:V,showProgress:F,onTaskUpdate:Ye,onTaskClick:Re,onTaskSelect:Fe,onAutoScrollChange:Ae,className:Ie.taskRow,tooltipClassName:Ie.tooltip,viewMode:ue,scrollContainerRef:le,smoothDragging:K,movementThreshold:_,animationSpeed:B,renderTask:X,renderTooltip:J,getTaskColor:Z}):null})))))))},exports.TaskItem=h,exports.TaskList=M,exports.TaskManager=g,exports.TaskRow=w,exports.Timeline=p,exports.TodayMarker=D,exports.Tooltip=v,exports.calculateDuration=function(e,t){var r;if(!(e instanceof Date&&t instanceof Date))return 0;e>t&&(e=(r=[t,e])[0],t=r[1]);var a=Math.abs(t.getTime()-e.getTime());return Math.ceil(a/864e5)},exports.calculateTaskPosition=function(e,t,r){if(!(e.startDate instanceof Date&&e.endDate instanceof Date))return console.warn("calculateTaskPosition: Invalid task dates",e),{left:"0%",width:"10%"};var a=c(new Date(t.getFullYear(),t.getMonth(),1),new Date(r.getFullYear(),r.getMonth()+1,0)),n=a.length,o=e.startDate.getFullYear(),i=e.startDate.getMonth(),s=a.findIndex((function(e){return e.getFullYear()===o&&e.getMonth()===i})),l=s<0?0:s,u=e.endDate.getFullYear(),d=e.endDate.getMonth(),f=a.findIndex((function(e){return e.getFullYear()===u&&e.getMonth()===d})),m=((f<0?a.length-1:f)-l+1)/n*100;return{left:"".concat(l/n*100,"%"),width:"".concat(m,"%")}},exports.detectTaskOverlaps=u,exports.findEarliestDate=d,exports.findLatestDate=f,exports.formatDate=l,exports.formatDateRange=function(e,t,r){if(void 0===r&&(r="default"),!(e instanceof Date&&t instanceof Date))return"Invalid date range";var a=l(e,exports.DateDisplayFormat.SHORT_DATE,r),n=l(t,exports.DateDisplayFormat.SHORT_DATE,r);return"".concat(a," - ").concat(n)},exports.formatMonth=function(e,t){return void 0===t&&(t="default"),e.toLocaleString(t,{month:"short"})},exports.getDaysInMonth=function(e,t){return new Date(e,t+1,0).getDate()},exports.getMonthsBetween=c,exports.getStandardDayMarkers=function(){return[1,8,15,22,29]};
//# sourceMappingURL=index.js.map
