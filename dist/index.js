"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var e=require("react"),t=require("date-fns");function a(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r,n,o=a(e),i=function(){return i=Object.assign||function(e){for(var t,a=1,r=arguments.length;a<r;a++)for(var n in t=arguments[a])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},i.apply(this,arguments)};function s(e,t,a){if(a||2===arguments.length)for(var r,n=0,o=t.length;n<o;n++)!r&&n in t||(r||(r=Array.prototype.slice.call(t,0,n)),r[n]=t[n]);return e.concat(r||Array.prototype.slice.call(t))}function d(e,t,a){if(void 0===t&&(t=exports.DateDisplayFormat.FULL_DATE),void 0===a&&(a="default"),!(e instanceof Date)||isNaN(e.getTime()))return"Invalid date";switch(t){case exports.DateDisplayFormat.MONTH_YEAR:return e.toLocaleString(a,{month:"short",year:"2-digit"});case exports.DateDisplayFormat.SHORT_DATE:return e.toLocaleString(a,{month:"short",day:"numeric"});case exports.DateDisplayFormat.FULL_DATE:default:return e.toLocaleString(a,{month:"short",day:"numeric",year:"numeric"})}}function c(e,t){var a=[];if(!(e instanceof Date&&t instanceof Date))return console.warn("getMonthsBetween: Invalid date parameters"),[new Date];for(var r=e.getFullYear(),n=e.getMonth(),o=t.getFullYear(),i=t.getMonth(),s=r;s<=o;s++)for(var d=s===o?i:11,c=s===r?n:0;c<=d;c++)a.push(new Date(s,c,1));return a}function l(e){if(!Array.isArray(e))return console.warn("detectTaskOverlaps: Invalid tasks array"),[];var t=e.filter((function(e){return e&&e.startDate instanceof Date&&e.endDate instanceof Date}));if(0===t.length)return[];var a=[];return t.forEach((function(e){for(var t=!1,r=0;r<a.length;r++){if(!a[r].some((function(t){return!(e.startDate>=t.endDate||e.endDate<=t.startDate)}))){a[r].push(e),t=!0;break}}t||a.push([e])})),a}function u(e){if(!Array.isArray(e)||0===e.length)return new Date;var t=new Date,a=!1;if(e.forEach((function(e){e&&Array.isArray(e.tasks)&&e.tasks.forEach((function(e){e&&e.startDate instanceof Date&&(a?e.startDate<t&&(t=new Date(e.startDate)):(t=new Date(e.startDate),a=!0))}))})),!a){var r=new Date;return new Date(r.getFullYear(),r.getMonth()-1,1)}return new Date(t.getFullYear(),t.getMonth(),1)}function f(e){if(!Array.isArray(e)||0===e.length)return new Date;var t=new Date,a=!1;if(e.forEach((function(e){e&&Array.isArray(e.tasks)&&e.tasks.forEach((function(e){e&&e.endDate instanceof Date&&(a?e.endDate>t&&(t=new Date(e.endDate)):(t=new Date(e.endDate),a=!0))}))})),!a){var r=new Date;return new Date(r.getFullYear(),r.getMonth()+2,0)}return new Date(t.getFullYear(),t.getMonth()+1,0)}"function"==typeof SuppressedError&&SuppressedError,exports.ViewMode=void 0,(r=exports.ViewMode||(exports.ViewMode={})).DAY="day",r.WEEK="week",r.MONTH="month",r.QUARTER="quarter",r.YEAR="year",exports.DateDisplayFormat=void 0,(n=exports.DateDisplayFormat||(exports.DateDisplayFormat={})).MONTH_YEAR="month-year",n.FULL_DATE="full-date",n.SHORT_DATE="short-date";var m=function(){function e(){}return e.detectOverlaps=function(e,t){var a=this;if(void 0===t&&(t=exports.ViewMode.MONTH),!Array.isArray(e)||0===e.length)return[];var r=s([],e,!0).sort((function(e,t){return e.startDate&&t.startDate?e.startDate.getTime()-t.startDate.getTime():0})),n=[];return r.forEach((function(e){for(var r=!1,o=0;o<n.length;o++){if(!n[o].some((function(r){return a.tasksVisuallyOverlap(e,r,t)}))){n[o].push(e),r=!0;break}}r||n.push([e])})),n},e.tasksVisuallyOverlap=function(e,t,a){if(void 0===a&&(a=exports.ViewMode.MONTH),!(e.startDate&&e.endDate&&t.startDate&&t.endDate))return!1;var r=e.startDate.getTime(),n=e.endDate.getTime(),o=t.startDate.getTime(),i=t.endDate.getTime(),s=this.getCollisionBufferByViewMode(a);return r+s<i-s&&n-s>o+s||Math.abs(r-o)<2*s||Math.abs(n-i)<2*s},e.getCollisionBufferByViewMode=function(e){var t=36e5,a=24*t;switch(e){case exports.ViewMode.DAY:return t;case exports.ViewMode.WEEK:return 4*t;case exports.ViewMode.MONTH:return 12*t;case exports.ViewMode.QUARTER:return a;case exports.ViewMode.YEAR:return 2*a;default:return 12*t}},e.wouldCollide=function(e,t,a,r){var n=this;return void 0===a&&(a=exports.ViewMode.MONTH),t.some((function(t){return t.id!==e.id&&t.id!==r&&n.tasksVisuallyOverlap(e,t,a)}))},e.getPreviewArrangement=function(e,t,a){void 0===a&&(a=exports.ViewMode.MONTH);var r=t.map((function(t){return t.id===e.id?e:t}));return this.detectOverlaps(r,a)},e}(),v=function(){function e(){}return e.calculateDatesFromPosition=function(e,a,r,n,o,i,s){void 0===s&&(s=exports.ViewMode.MONTH);try{var d=isNaN(e)?0:e,c=isNaN(a)||a<20?20:a,l=r.getTime(),u=(n.getTime()-l)/(o*i),f=d*u,m=c*u,v=new Date(l+f),p=new Date(l+f+m);return v=t.startOfDay(v),p=t.endOfDay(p),v<r&&(v=new Date(r)),p>n&&(p=new Date(n)),{newStartDate:v,newEndDate:p}}catch(e){return console.error("Error calculating dates from position:",e),{newStartDate:new Date(r),newEndDate:new Date(n)}}},e.createUpdatedTask=function(e,t,a){return i(i({},e),{startDate:new Date(t),endDate:new Date(a)})},e.calculateTaskPixelPosition=function(e,t,a,r,n,o){var i;void 0===o&&(o=exports.ViewMode.MONTH);try{if(!(e.startDate instanceof Date&&e.endDate instanceof Date))throw new Error("Invalid dates in task");var s=Math.max(e.startDate.getTime(),t.getTime()),d=Math.min(e.endDate.getTime(),a.getTime()),c=t.getTime(),l=a.getTime()-c,u=r*n,f=(s-c)/l*u,m=(d-s)/l*u,v=((i={})[exports.ViewMode.DAY]=20,i[exports.ViewMode.WEEK]=20,i[exports.ViewMode.MONTH]=20,i[exports.ViewMode.QUARTER]=30,i[exports.ViewMode.YEAR]=40,i)[o]||20;m=Math.max(v,m);var p=u-f;return{leftPx:f,widthPx:m=Math.min(p,m)}}catch(t){return console.error("Error calculating task position:",t,e),{leftPx:0,widthPx:20}}},e.getLiveDatesFromElement=function(e,t,a,r,n,o){void 0===o&&(o=exports.ViewMode.MONTH);try{if(!e)return{startDate:new Date(t),endDate:new Date(a)};var i=parseFloat(e.style.left||"0"),s=parseFloat(e.style.width||"0"),d=this.calculateDatesFromPosition(i,s,t,a,r,n,o);return{startDate:d.newStartDate,endDate:d.newEndDate}}catch(e){return console.error("Error getting live dates:",e),{startDate:new Date(t),endDate:new Date(a)}}},e.formatDate=function(e,t,a){if(void 0===t&&(t="default"),void 0===a&&(a=exports.ViewMode.MONTH),!(e instanceof Date)||isNaN(e.getTime()))return"Invalid date";var r;switch(a){case exports.ViewMode.DAY:case exports.ViewMode.WEEK:case exports.ViewMode.MONTH:r={year:"numeric",month:"short",day:"numeric"};break;case exports.ViewMode.QUARTER:r={year:"numeric",month:"short"};break;case exports.ViewMode.YEAR:r={year:"numeric"};break;default:r={year:"numeric",month:"short",day:"numeric"}}return e.toLocaleDateString(t,r)},e.getDuration=function(e,a,r){void 0===r&&(r=exports.ViewMode.MONTH);try{if(!(e instanceof Date)||!(a instanceof Date)||isNaN(e.getTime())||isNaN(a.getTime()))return{value:0,unit:"days"};var n=e<a?e:a,o=e<a?a:e;switch(r){case exports.ViewMode.DAY:var i=t.differenceInDays(o,n)+1;return{value:i,unit:1===i?"day":"days"};case exports.ViewMode.WEEK:var s=t.differenceInWeeks(o,n)+1;return{value:s,unit:1===s?"week":"weeks"};case exports.ViewMode.MONTH:var d=t.differenceInMonths(o,n)+1;return{value:d,unit:1===d?"month":"months"};case exports.ViewMode.QUARTER:var c=t.differenceInQuarters(o,n)+1;return{value:c,unit:1===c?"quarter":"quarters"};case exports.ViewMode.YEAR:var l=t.differenceInYears(o,n)+1;return{value:l,unit:1===l?"year":"years"};default:var u=t.differenceInDays(o,n)+1;return{value:u,unit:1===u?"day":"days"}}}catch(e){return console.error("Error calculating duration:",e),{value:0,unit:"days"}}},e.datesOverlap=function(e,a,r,n){return t.isWithinInterval(e,{start:r,end:n})||t.isWithinInterval(a,{start:r,end:n})||t.isWithinInterval(r,{start:e,end:a})||t.isWithinInterval(n,{start:e,end:a})},e}(),p=function(e){var t=e.task,a=e.leftPx,r=e.widthPx,n=e.topPx,i=e.isHovered,s=e.isDragging,d=e.editMode,c=e.showProgress,l=void 0!==c&&c,u=e.instanceId,f=e.onMouseDown,m=e.onMouseEnter,v=e.onMouseLeave,p=e.onClick,h=(i||s)&&d;if(!t||!t.id)return console.warn("TaskItem: Invalid task data",t),null;var g=t.color||"bg-gantt-task";return o.default.createElement("div",{className:"absolute h-8 rounded ".concat(g," flex items-center px-2 text-xs text-gantt-task-text font-medium ").concat(d?"cursor-move":"cursor-pointer"),style:{left:"".concat(Math.max(0,a),"px"),width:"".concat(Math.max(20,r),"px"),top:"".concat(n,"px")},onClick:function(e){return p(e,t)},onMouseDown:function(e){return f(e,t,"move")},onMouseEnter:function(e){return m(e,t)},onMouseLeave:v,"data-testid":"task-".concat(t.id),"data-task-id":t.id,"data-instance-id":u},h&&o.default.createElement("div",{className:"absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-l",onMouseDown:function(e){e.stopPropagation(),f(e,t,"resize-left")}}),o.default.createElement("div",{className:"truncate select-none"},t.name||"Unnamed Task"),l&&"number"==typeof t.percent&&o.default.createElement("div",{className:"absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 dark:bg-opacity-30 rounded-full overflow-hidden"},o.default.createElement("div",{className:"h-full bg-white dark:bg-gray-200 rounded-full",style:{width:"".concat(t.percent,"%")}})),h&&o.default.createElement("div",{className:"absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-r",onMouseDown:function(e){e.stopPropagation(),f(e,t,"resize-right")}}))},h=function(e){var a=e.task,r=e.position,n=e.dragType,i=e.taskId,s=e.startDate,d=e.endDate,c=e.totalMonths,l=e.monthWidth,u=e.showProgress,f=void 0!==u&&u,m=e.instanceId,p=e.className,h=void 0===p?"":p,g=e.viewMode,w=void 0===g?exports.ViewMode.MONTH:g,D=a.startDate,M=a.endDate;try{var x=i||a.id,E=document.querySelector('[data-task-id="'.concat(x,'"][data-instance-id="').concat(m,'"]'));if(E&&(n||E.style.left||E.style.width)){var y=v.getLiveDatesFromElement(E,s,d,c,l,w);D=y.startDate,M=y.endDate}}catch(e){console.error("Error calculating live dates for tooltip:",e)}var k=v.getDuration(D,M,w),b=function(e){return e instanceof Date&&!isNaN(e.getTime())?w===exports.ViewMode.DAY?t.format(e,"EEE, MMM d, yyyy"):t.format(e,"MMM d, yyyy"):"Invalid date"},T=function(){if(!n)return null;switch(n){case"move":return"Moving task...";case"resize-left":return"Adjusting start date...";case"resize-right":return"Adjusting end date...";default:return null}}();return o.default.createElement("div",{className:"rmg-task-tooltip absolute z-20 bg-[var(--rmg-tooltip-bg,#ffffff)] text-[var(--rmg-tooltip-text,#1f2937)] border border-[var(--rmg-tooltip-border,#e5e7eb)] rounded-md shadow-md p-2 text-xs select-none ".concat(h),style:{left:"".concat(r.x,"px"),top:"".concat(r.y-40,"px"),minWidth:"200px"}},o.default.createElement("div",{className:"font-bold mb-1"},a.name||"Unnamed Task"),T&&o.default.createElement("div",{className:"text-xs text-blue-500 dark:text-blue-400 mb-1 italic"},T),o.default.createElement("div",{className:"grid grid-cols-2 gap-x-2 gap-y-1"},o.default.createElement("div",{className:"font-semibold"},"Start:"),o.default.createElement("div",null,b(D)),o.default.createElement("div",{className:"font-semibold"},"End:"),o.default.createElement("div",null,b(M)),o.default.createElement("div",{className:"font-semibold"},"Duration:"),o.default.createElement("div",null,k.value," ",k.unit),f&&"number"==typeof a.percent&&o.default.createElement(o.default.Fragment,null,o.default.createElement("div",{className:"font-semibold"},"Progress:"),o.default.createElement("div",null,a.percent,"%")),a.dependencies&&a.dependencies.length>0&&o.default.createElement(o.default.Fragment,null,o.default.createElement("div",{className:"font-semibold"},"Dependencies:"),o.default.createElement("div",null,a.dependencies.join(", ")))))},g=function(t){var a=t.taskGroup,r=t.startDate,n=t.endDate,s=t.totalMonths,d=t.monthWidth,c=t.editMode,l=void 0===c||c,u=t.showProgress,f=void 0!==u&&u,g=t.className,w=void 0===g?"":g,D=t.tooltipClassName,M=void 0===D?"":D,x=t.onTaskUpdate,E=t.onTaskClick,y=t.onTaskSelect,k=t.viewMode,b=void 0===k?exports.ViewMode.MONTH:k;if(!a||!a.id||!Array.isArray(a.tasks))return console.warn("TaskRow: Invalid task group data",a),o.default.createElement("div",{className:"relative h-16 text-gantt-text"},"Invalid task group data");var T=r instanceof Date?r:new Date,N=n instanceof Date?n:new Date,V=e.useState(null),A=V[0],Y=V[1],R=e.useState(null),O=R[0],F=R[1],I=e.useState(null),S=I[0],H=I[1],P=e.useState(0),W=P[0],L=P[1],C=e.useState({x:0,y:0}),U=C[0],Q=C[1],K=e.useState(null),z=K[0],_=K[1],j=e.useState(null),q=j[0],B=j[1],G=e.useRef(null),X=e.useRef(null),J=e.useRef(null),Z=e.useRef("task-row-".concat(Math.random().toString(36).substring(2,11))),$=function(e){_(e),J.current=e},ee=z?m.getPreviewArrangement(z,a.tasks,b):m.detectOverlaps(a.tasks,b),te=Math.max(60,40*ee.length+20),ae=function(e,t){E&&!O&&E(t,a),y&&y(t,!0)},re=function(e,t){O||(Y(t),oe(e))},ne=function(){O||Y(null)},oe=function(e){if(G.current){var t=G.current.getBoundingClientRect();Q({x:e.clientX-t.left+20,y:e.clientY-t.top})}},ie=function(e,t,a){if(l){e.preventDefault(),e.stopPropagation();var r=document.querySelector('[data-task-id="'.concat(t.id,'"][data-instance-id="').concat(Z.current,'"]'));r&&(B({left:parseFloat(r.style.left||"0"),width:parseFloat(r.style.width||"0"),startDate:new Date(t.startDate),endDate:new Date(t.endDate)}),F(t),H(a),L(e.clientX),_(t),function(e){F(e),X.current=e}(t),$(t),document.addEventListener("mouseup",le),document.addEventListener("mousemove",se))}},se=function(e){if(e instanceof MouseEvent&&A&&G.current){var t=e,a=G.current.getBoundingClientRect();Q({x:t.clientX-a.left+20,y:t.clientY-a.top})}else e instanceof MouseEvent||oe(e);if(O&&S&&q&&G.current)try{var r=document.querySelector('[data-task-id="'.concat(O.id,'"][data-instance-id="').concat(Z.current,'"]'));if(!r)return;var n=e.clientX-W,o=s*d,c=q.left,l=q.width;switch(S){case"move":c=Math.max(0,Math.min(o-q.width,q.left+n)),b===exports.ViewMode.DAY&&(c=Math.round(c/d)*d),r.style.left="".concat(c,"px");break;case"resize-left":var u=q.width-20,f=Math.min(u,n);c=Math.max(0,q.left+f),b===exports.ViewMode.DAY&&(c=Math.round(c/d)*d);var m=q.left+q.width;l=Math.max(20,m-c),r.style.left="".concat(c,"px"),r.style.width="".concat(l,"px");break;case"resize-right":if(l=Math.max(20,Math.min(o-q.left,q.width+n)),b===exports.ViewMode.DAY){var v=q.left+l,p=Math.round(v/d)*d;l=Math.max(20,p-q.left)}r.style.width="".concat(l,"px")}var h=de(T,N,b)/o,g=T.getTime()+c*h,w=T.getTime()+(c+l)*h,D=ce(new Date(g),new Date(w),b),M=D.newStartDate,x=D.newEndDate,E=i(i({},O),{startDate:M,endDate:x});_(E),$(E)}catch(e){console.error("Error in handleMouseMove:",e)}},de=function(e,t,a){var r=e.getTime(),n=t.getTime()-r;return exports.ViewMode.YEAR,n},ce=function(e,t,a){var r=new Date(e),n=new Date(t);switch(a){case exports.ViewMode.DAY:r.setHours(0,0,0,0),n.setHours(23,59,59,999);case exports.ViewMode.WEEK:case exports.ViewMode.MONTH:case exports.ViewMode.QUARTER:case exports.ViewMode.YEAR:}return{newStartDate:r,newEndDate:n}},le=function(){try{var e=X.current,t=J.current;e&&t&&x&&x(a.id,t)}catch(e){console.error("Error in handleMouseUp:",e)}finally{F(null),H(null),_(null),B(null),X.current=null,J.current=null,document.removeEventListener("mouseup",le),document.removeEventListener("mousemove",se)}};return e.useEffect((function(){return function(){document.removeEventListener("mouseup",le),document.removeEventListener("mousemove",se)}}),[]),a.tasks&&0!==a.tasks.length?o.default.createElement("div",{className:"relative border-b border-gantt-border ".concat(w),style:{height:"".concat(te,"px")},onMouseMove:function(e){return se(e)},onMouseLeave:function(){return Y(null)},ref:G,"data-testid":"task-row-".concat(a.id),"data-instance-id":Z.current},ee.map((function(e,t){return o.default.createElement(o.default.Fragment,{key:"task-row-".concat(t)},e.map((function(e){try{if(!(e&&e.id&&e.startDate instanceof Date&&e.endDate instanceof Date))return console.warn("Invalid task data:",e),null;var a=v.calculateTaskPixelPosition(e,T,N,s,d,b),r=a.leftPx,n=a.widthPx,i=(null==A?void 0:A.id)===e.id,c=(null==O?void 0:O.id)===e.id,u=40*t+10;return o.default.createElement(p,{key:"task-".concat(e.id),task:e,leftPx:r,widthPx:n,topPx:u,isHovered:i,isDragging:c,editMode:l,showProgress:f,instanceId:Z.current,onMouseDown:ie,onMouseEnter:re,onMouseLeave:ne,onClick:ae})}catch(t){return console.error("Error rendering task:",t,e),null}})))})),(A||O)&&o.default.createElement(h,{task:z||O||A,position:U,dragType:S,taskId:null==O?void 0:O.id,startDate:T,endDate:N,totalMonths:s,monthWidth:d,showProgress:f,instanceId:Z.current,className:M,viewMode:b})):o.default.createElement("div",{className:"relative h-16 text-gantt-text"},"No tasks available")},w=function(e){var a=e.months,r=e.currentMonthIndex,n=(e.locale,e.className),i=void 0===n?"":n,s=e.viewMode,d=void 0===s?exports.ViewMode.MONTH:s,c=e.unitWidth,l=void 0===c?150:c,u=[exports.ViewMode.DAY,exports.ViewMode.WEEK].includes(d),f=function(){if(![exports.ViewMode.DAY,exports.ViewMode.WEEK].includes(d)||0===a.length)return[];var e=[],t=new Date(a[0]),r=0;return a.forEach((function(a){a.getMonth()===t.getMonth()&&a.getFullYear()===t.getFullYear()?r+=1:(e.push({date:t,span:r}),t=new Date(a),r=1)})),r>0&&e.push({date:t,span:r}),e}();return o.default.createElement("div",{className:"rmg-timeline ".concat(i),style:{"--gantt-unit-width":"".concat(l,"px")}},u&&o.default.createElement("div",{className:"flex border-b border-gantt-border"},f.map((function(e,a){return o.default.createElement("div",{key:"higher-level-".concat(a),className:"flex-shrink-0 p-2 font-semibold text-center text-gantt-text border-r border-gantt-border h-10",style:{width:"".concat(e.span*l,"px")},"data-timeunit-higher":e.date.toISOString()},function(e){if(!(e instanceof Date))return"";switch(d){case exports.ViewMode.DAY:case exports.ViewMode.WEEK:}return t.format(e,"MMM yyyy",{locale:void 0})}(e.date))}))),o.default.createElement("div",{className:"flex border-b border-gantt-border"},a.map((function(e,a){return o.default.createElement("div",{key:"timeunit-".concat(a),className:"".concat("w-[var(--gantt-unit-width)]"," flex-shrink-0 p-2 font-semibold text-center text-gantt-text ").concat(a===r?"bg-gantt-highlight":""," ").concat(u?"border-r border-gantt-border":""," h-10"),"data-timeunit":e.toISOString()},function(e){if(!(e instanceof Date))return"";switch(d){case exports.ViewMode.DAY:return t.format(e,"d",{locale:void 0});case exports.ViewMode.WEEK:var a=t.getWeek(e);return"W".concat(a);case exports.ViewMode.MONTH:return t.format(e,"MMM yyyy",{locale:void 0});case exports.ViewMode.QUARTER:var r=Math.floor(e.getMonth()/3)+1;return"Q".concat(r," ").concat(e.getFullYear());case exports.ViewMode.YEAR:return e.getFullYear().toString();default:return t.format(e,"MMM yyyy",{locale:void 0})}}(e))}))))},D=function(e){var t=e.currentMonthIndex,a=e.height,r=e.markerClass,n=void 0===r?"bg-red-500":r,i=e.label,s=void 0===i?"Today":i,d=e.dayOfMonth,c=e.className,l=void 0===c?"":c,u=e.viewMode,f=void 0===u?exports.ViewMode.MONTH:u,m=e.unitWidth,v=void 0===m?150:m;if(t<0)return null;var p=function(){var e=new Date;switch(d||e.getDate(),f){case exports.ViewMode.DAY:return t*v+v/2;case exports.ViewMode.WEEK:var a=e.getDay();return t*v+v*(a/7);case exports.ViewMode.MONTH:a=e.getDay();return t*v+v*(a/7);case exports.ViewMode.QUARTER:var r=e.getMonth()%3;return t*v+v*(r/3);case exports.ViewMode.YEAR:var n=e.getMonth();return t*v+v*(n/12);default:return t*v+v/2}}();return o.default.createElement("div",{className:"absolute top-0 w-px ".concat(n," z-10 ").concat(l),style:{left:"".concat(p,"px"),height:"".concat(a,"px")},"data-testid":"today-marker"},o.default.createElement("div",{className:"absolute -top-6 left-1/2 transform -translate-x-1/2 ".concat(n," px-1 py-0.5 rounded text-xs text-white whitespace-nowrap")},s))},M=function(e){var t=e.tasks,a=void 0===t?[]:t,r=e.headerLabel,n=void 0===r?"Resources":r,i=e.showIcon,s=void 0!==i&&i,d=e.showTaskCount,c=void 0!==d&&d,u=e.showDescription,f=void 0===u||u,m=e.rowHeight,v=void 0===m?40:m,p=e.className,h=void 0===p?"":p,g=e.onGroupClick,w=e.viewMode,D=Array.isArray(a)?a:[],M=w===exports.ViewMode.DAY||w===exports.ViewMode.WEEK;return o.default.createElement("div",{className:"rmg-task-list w-40 flex-shrink-0 z-10 bg-gantt-bg shadow-sm ".concat(h)},M?o.default.createElement(o.default.Fragment,null,o.default.createElement("div",{className:"p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"}),o.default.createElement("div",{className:"p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"},n)):o.default.createElement("div",{className:"p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"},n),D.map((function(e){if(!e)return null;var t=function(e){if(!e.tasks||!Array.isArray(e.tasks))return 60;var t=l(e.tasks);return Math.max(60,t.length*v+20)}(e);return o.default.createElement("div",{key:"task-group-".concat(e.id||"unknown"),className:"p-2 border-r border-b border-gantt-border font-medium text-gantt-text bg-gantt-bg hover:bg-gantt-highlight transition-colors duration-150",style:{height:"".concat(t,"px")},onClick:function(){return t=e,void(g&&g(t));var t},"data-testid":"task-group-".concat(e.id||"unknown")},o.default.createElement("div",{className:"flex items-center"},s&&e.icon&&o.default.createElement("span",{className:"mr-2",dangerouslySetInnerHTML:{__html:e.icon}}),o.default.createElement("div",{className:"font-medium truncate"},e.name||"Unnamed")),f&&e.description&&o.default.createElement("div",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1 truncate"},e.description),c&&e.tasks&&e.tasks.length>0&&o.default.createElement("div",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1"},e.tasks.length," ",1===e.tasks.length?"task":"tasks"))})))},x=function(e){var t=e.activeMode,a=e.onChange,r=e.darkMode,n="px-3 py-1 text-sm font-medium rounded transition-colors duration-200 ".concat(r?"hover:bg-gray-700":"hover:bg-gray-200"),i="bg-indigo-600 text-white",s=r?"bg-gray-700 text-gray-300":"bg-gray-200 text-gray-700";return o.default.createElement("div",{className:"flex rounded-md shadow-sm"},o.default.createElement("button",{className:"".concat(n," rounded-l-md ").concat(t===exports.ViewMode.DAY?i:s),onClick:function(){return a(exports.ViewMode.DAY)}},"Day"),o.default.createElement("button",{className:"".concat(n," border-l ").concat(t===exports.ViewMode.WEEK?i:s),onClick:function(){return a(exports.ViewMode.WEEK)}},"Week"),o.default.createElement("button",{className:"".concat(n," border-l ").concat(t===exports.ViewMode.MONTH?i:s),onClick:function(){return a(exports.ViewMode.MONTH)}},"Month"),o.default.createElement("button",{className:"".concat(n," border-l ").concat(t===exports.ViewMode.QUARTER?i:s),onClick:function(){return a(exports.ViewMode.QUARTER)}},"Quarter"),o.default.createElement("button",{className:"".concat(n," rounded-r-md border-l ").concat(t===exports.ViewMode.YEAR?i:s),onClick:function(){return a(exports.ViewMode.YEAR)}},"Year"))};exports.CollisionManager=m,exports.GanttChart=function(a){var r=a.tasks,n=void 0===r?[]:r,d=a.startDate,m=a.endDate,v=a.title,p=void 0===v?"Project Timeline":v,h=a.currentDate,E=void 0===h?new Date:h,y=a.showCurrentDateMarker,k=void 0===y||y,b=a.todayLabel,T=void 0===b?"Today":b,N=a.editMode,V=void 0===N||N,A=a.headerLabel,Y=void 0===A?"Resources":A,R=a.showProgress,O=void 0!==R&&R,F=a.darkMode,I=void 0!==F&&F,S=a.locale,H=void 0===S?"default":S,P=a.styles,W=void 0===P?{}:P,L=a.viewMode,C=void 0===L?exports.ViewMode.MONTH:L,U=a.onTaskUpdate,Q=a.onTaskClick,K=a.onTaskSelect;a.onTaskDoubleClick;var z=a.onGroupClick,_=a.fontSize,j=a.rowHeight,q=void 0===j?40:j;a.timeStep;var B=e.useRef(null),G=e.useRef(null),X=e.useState(C),J=X[0],Z=X[1],$=e.useState([]);$[0];var ee=$[1],te=e.useState(150),ae=te[0],re=te[1],ne=d||u(n),oe=m||f(n),ie=function(e,a){for(var r=[],n=new Date(e);n<=a;)r.push(new Date(n)),n=t.addDays(n,1);return r},se=function(e,a){for(var r=[],n=new Date(e);n<=a;)r.push(new Date(n)),n=t.addDays(n,7);return r},de=function(e,a){for(var r=[],n=t.startOfQuarter(new Date(e));n<=a;)r.push(new Date(n)),n=t.addQuarters(n,1);return r},ce=function(e,a){for(var r=[],n=t.startOfYear(new Date(e));n<=a;)r.push(new Date(n)),n=t.addYears(n,1);return r},le=function(){switch(J){case exports.ViewMode.DAY:return ie(ne,oe);case exports.ViewMode.WEEK:return se(ne,oe);case exports.ViewMode.MONTH:return c(ne,oe);case exports.ViewMode.QUARTER:return de(ne,oe);case exports.ViewMode.YEAR:return ce(ne,oe);default:return c(ne,oe)}}(),ue=le.length,fe=function(){var e=new Date;switch(J){case exports.ViewMode.DAY:return le.findIndex((function(t){return t.getDate()===e.getDate()&&t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case exports.ViewMode.WEEK:return le.findIndex((function(t){var a=new Date(t);return a.setDate(t.getDate()+6),e>=t&&e<=a}));case exports.ViewMode.MONTH:return le.findIndex((function(t){return t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case exports.ViewMode.QUARTER:var t=Math.floor(e.getMonth()/3);return le.findIndex((function(a){return Math.floor(a.getMonth()/3)===t&&a.getFullYear()===e.getFullYear()}));case exports.ViewMode.YEAR:return le.findIndex((function(t){return t.getFullYear()===e.getFullYear()}));default:return-1}}(),me=function(e,t){if(U)try{var a=i(i({},t),{startDate:t.startDate instanceof Date?t.startDate:new Date(t.startDate),endDate:t.endDate instanceof Date?t.endDate:new Date(t.endDate)});U(e,a)}catch(e){console.error("Error in handleTaskUpdate:",e)}},ve=function(e,t){if(Q)try{Q(e,t)}catch(e){console.error("Error in handleTaskClick:",e)}},pe=function(e,t){if(ee((function(a){return t?s(s([],a,!0),[e.id],!1):a.filter((function(t){return t!==e.id}))})),K)try{K(e,t)}catch(e){console.error("Error in onTaskSelect handler:",e)}},he=function(e){switch(Z(e),e){case exports.ViewMode.DAY:re(40);break;case exports.ViewMode.WEEK:re(80);break;case exports.ViewMode.MONTH:re(150);break;case exports.ViewMode.QUARTER:re(180);break;case exports.ViewMode.YEAR:re(200);break;default:re(150)}};e.useEffect((function(){he(C)}),[C]);var ge,we={fontSize:_||"inherit"},De=I?"dark":"",Me=i(i({},{container:"",title:"",header:"",taskList:"",timeline:"",taskRow:"",todayMarker:"",tooltip:""}),W);return o.default.createElement("div",{ref:B,className:"rmg-gantt-chart w-full bg-gantt-bg text-gantt-text rounded-xl shadow-lg overflow-hidden ".concat(De," ").concat(Me.container),style:i(i({},we),{"--gantt-unit-width":"".concat(ae,"px")}),"data-testid":"gantt-chart"},o.default.createElement("div",{className:"p-6 border-b border-gantt-border"},o.default.createElement("div",{className:"flex justify-between items-center"},o.default.createElement("h1",{className:"text-2xl font-bold text-gantt-text ".concat(Me.title)},p),o.default.createElement("div",{className:"flex space-x-2"},o.default.createElement(x,{activeMode:J,onChange:he,darkMode:I})))),o.default.createElement("div",{className:"relative flex"},o.default.createElement(M,{tasks:n,headerLabel:Y,onGroupClick:z,className:Me.taskList,viewMode:J}),o.default.createElement("div",{ref:G,className:"flex-grow overflow-x-auto"},o.default.createElement("div",{className:"min-w-max"},o.default.createElement(w,{months:le,currentMonthIndex:fe,locale:H,className:Me.timeline,viewMode:J,unitWidth:ae}),o.default.createElement("div",{className:"relative"},k&&fe>=0&&o.default.createElement(D,{currentMonthIndex:fe,height:(ge=0,n.forEach((function(e){if(e&&Array.isArray(e.tasks)){var t=l(e.tasks);ge+=Math.max(60,t.length*q+20)}else ge+=60})),ge),label:T,dayOfMonth:E.getDate(),className:Me.todayMarker,viewMode:J,unitWidth:ae}),n.map((function(e){return e&&e.id?o.default.createElement(g,{key:"task-row-".concat(e.id),taskGroup:e,startDate:ne,endDate:oe,totalMonths:ue,monthWidth:ae,editMode:V,showProgress:O,onTaskUpdate:me,onTaskClick:ve,onTaskSelect:pe,className:Me.taskRow,tooltipClassName:Me.tooltip,viewMode:J}):null})))))))},exports.TaskItem=p,exports.TaskList=M,exports.TaskManager=v,exports.TaskRow=g,exports.Timeline=w,exports.TodayMarker=D,exports.Tooltip=h,exports.calculateDuration=function(e,t){var a;if(!(e instanceof Date&&t instanceof Date))return 0;e>t&&(e=(a=[t,e])[0],t=a[1]);var r=Math.abs(t.getTime()-e.getTime());return Math.ceil(r/864e5)},exports.calculateTaskPosition=function(e,t,a){if(!(e.startDate instanceof Date&&e.endDate instanceof Date))return console.warn("calculateTaskPosition: Invalid task dates",e),{left:"0%",width:"10%"};var r=c(new Date(t.getFullYear(),t.getMonth(),1),new Date(a.getFullYear(),a.getMonth()+1,0)),n=r.length,o=e.startDate.getFullYear(),i=e.startDate.getMonth(),s=r.findIndex((function(e){return e.getFullYear()===o&&e.getMonth()===i})),d=s<0?0:s,l=e.endDate.getFullYear(),u=e.endDate.getMonth(),f=r.findIndex((function(e){return e.getFullYear()===l&&e.getMonth()===u})),m=((f<0?r.length-1:f)-d+1)/n*100;return{left:"".concat(d/n*100,"%"),width:"".concat(m,"%")}},exports.detectTaskOverlaps=l,exports.findEarliestDate=u,exports.findLatestDate=f,exports.formatDate=d,exports.formatDateRange=function(e,t,a){if(void 0===a&&(a="default"),!(e instanceof Date&&t instanceof Date))return"Invalid date range";var r=d(e,exports.DateDisplayFormat.SHORT_DATE,a),n=d(t,exports.DateDisplayFormat.SHORT_DATE,a);return"".concat(r," - ").concat(n)},exports.formatMonth=function(e,t){return void 0===t&&(t="default"),e.toLocaleString(t,{month:"short"})},exports.getDaysInMonth=function(e,t){return new Date(e,t+1,0).getDate()},exports.getMonthsBetween=c,exports.getStandardDayMarkers=function(){return[1,8,15,22,29]};
//# sourceMappingURL=index.js.map
