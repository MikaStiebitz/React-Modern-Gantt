import e,{useRef as t,useState as r,useEffect as n,useCallback as a}from"react";import{differenceInDays as o,differenceInYears as i,differenceInQuarters as c,differenceInMonths as s,differenceInWeeks as l,format as u,isValid as d,getWeek as f,startOfDay as m,endOfDay as g,isWithinInterval as h,startOfYear as v,addYears as D,startOfQuarter as w,addQuarters as p,addDays as M}from"date-fns";var y,x,E=function(){return E=Object.assign||function(e){for(var t,r=1,n=arguments.length;r<n;r++)for(var a in t=arguments[r])Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e},E.apply(this,arguments)};function k(e,t,r){if(r||2===arguments.length)for(var n,a=0,o=t.length;a<o;a++)!n&&a in t||(n||(n=Array.prototype.slice.call(t,0,a)),n[a]=t[a]);return e.concat(n||Array.prototype.slice.call(t))}function b(e,t){return void 0===t&&(t="default"),e.toLocaleString(t,{month:"short"})}function T(e,t,r){if(void 0===t&&(t=x.FULL_DATE),void 0===r&&(r="default"),!(e instanceof Date)||isNaN(e.getTime()))return"Invalid date";switch(t){case x.MONTH_YEAR:return e.toLocaleString(r,{month:"short",year:"2-digit"});case x.SHORT_DATE:return e.toLocaleString(r,{month:"short",day:"numeric"});case x.FULL_DATE:default:return e.toLocaleString(r,{month:"short",day:"numeric",year:"numeric"})}}function N(e,t){var r=[];if(!(e instanceof Date&&t instanceof Date))return[new Date];for(var n=e.getFullYear(),a=e.getMonth(),o=t.getFullYear(),i=t.getMonth(),c=n;c<=o;c++)for(var s=c===o?i:11,l=c===n?a:0;l<=s;l++)r.push(new Date(c,l,1));return r}function A(e,t){return new Date(e,t+1,0).getDate()}function Y(e,t,r){void 0===r&&(r=y.MONTH);try{if(!(e instanceof Date)||!(t instanceof Date)||isNaN(e.getTime())||isNaN(t.getTime()))return{value:0,unit:"days"};var n=e<t?e:t,a=e<t?t:e;switch(r){case y.DAY:var u=o(a,n)+1;return{value:u,unit:1===u?"day":"days"};case y.WEEK:var d=l(a,n)+1;return{value:d,unit:1===d?"week":"weeks"};case y.MONTH:var f=s(a,n)+1;return{value:f,unit:1===f?"month":"months"};case y.QUARTER:var m=c(a,n)+1;return{value:m,unit:1===m?"quarter":"quarters"};case y.YEAR:var g=i(a,n)+1;return{value:g,unit:1===g?"year":"years"};default:var h=o(a,n)+1;return{value:h,unit:1===h?"day":"days"}}}catch(e){return console.error("Error calculating duration:",e),{value:0,unit:"days"}}}function F(e,t,r){if(void 0===r&&(r="default"),!(e instanceof Date&&t instanceof Date))return"Invalid date range";var n=T(e,x.SHORT_DATE,r),a=T(t,x.SHORT_DATE,r);return"".concat(n," - ").concat(a)}function L(e,t){var r;if(!(e instanceof Date&&t instanceof Date))return 0;e>t&&(e=(r=[t,e])[0],t=r[1]);var n=Math.abs(t.getTime()-e.getTime());return Math.ceil(n/864e5)}function R(e){if(!Array.isArray(e)||0===e.length)return new Date;var t=new Date,r=!1;if(e.forEach((function(e){e&&Array.isArray(e.tasks)&&e.tasks.forEach((function(e){e&&e.startDate instanceof Date&&(r?e.startDate<t&&(t=new Date(e.startDate)):(t=new Date(e.startDate),r=!0))}))})),!r){var n=new Date;return new Date(n.getFullYear(),n.getMonth()-1,1)}return new Date(t.getFullYear(),t.getMonth(),1)}function C(e){if(!Array.isArray(e)||0===e.length)return new Date;var t=new Date,r=!1;if(e.forEach((function(e){e&&Array.isArray(e.tasks)&&e.tasks.forEach((function(e){e&&e.endDate instanceof Date&&(r?e.endDate>t&&(t=new Date(e.endDate)):(t=new Date(e.endDate),r=!0))}))})),!r){var n=new Date;return new Date(n.getFullYear(),n.getMonth()+2,0)}return new Date(t.getFullYear(),t.getMonth()+1,0)}function H(e,t,r){if(!(e.startDate instanceof Date&&e.endDate instanceof Date))return{left:"0%",width:"10%"};var n=N(new Date(t.getFullYear(),t.getMonth(),1),new Date(r.getFullYear(),r.getMonth()+1,0)),a=n.length,o=e.startDate.getFullYear(),i=e.startDate.getMonth(),c=n.findIndex((function(e){return e.getFullYear()===o&&e.getMonth()===i})),s=c<0?0:c,l=e.endDate.getFullYear(),u=e.endDate.getMonth(),d=n.findIndex((function(e){return e.getFullYear()===l&&e.getMonth()===u})),f=((d<0?n.length-1:d)-s+1)/a*100;return{left:"".concat(s/a*100,"%"),width:"".concat(f,"%")}}function O(e){if(!Array.isArray(e))return[];var t=e.filter((function(e){return e&&e.startDate instanceof Date&&e.endDate instanceof Date}));if(0===t.length)return[];var r=[];return t.forEach((function(e){for(var t=!1,n=0;n<r.length;n++){if(!r[n].some((function(t){return!(e.startDate>=t.endDate||e.endDate<=t.startDate)}))){r[n].push(e),t=!0;break}}t||r.push([e])})),r}"function"==typeof SuppressedError&&SuppressedError,function(e){e.DAY="day",e.WEEK="week",e.MONTH="month",e.QUARTER="quarter",e.YEAR="year"}(y||(y={})),function(e){e.MONTH_YEAR="month-year",e.FULL_DATE="full-date",e.SHORT_DATE="short-date"}(x||(x={}));var P=function(t){var r=t.months,n=t.currentMonthIndex,a=(t.locale,t.className),o=void 0===a?"":a,i=t.viewMode,c=void 0===i?y.MONTH:i,s=t.unitWidth,l=void 0===s?150:s,m=[y.DAY,y.WEEK].includes(c),g=function(){if(![y.DAY,y.WEEK].includes(c)||0===r.length)return[];var e=[],t=new Date(r[0]),n=0;return r.forEach((function(r){r.getMonth()===t.getMonth()&&r.getFullYear()===t.getFullYear()?n+=1:(e.push({date:t,span:n}),t=new Date(r),n=1)})),n>0&&e.push({date:t,span:n}),e}();return e.createElement("div",{className:"rmg-timeline ".concat(o),style:{"--gantt-unit-width":"".concat(l,"px")}},m&&e.createElement("div",{className:"flex border-b border-gantt-border"},g.map((function(t,r){return e.createElement("div",{key:"higher-level-".concat(r),className:"flex-shrink-0 p-2 font-semibold text-center text-gray-800 dark:text-gray-200 border-r border-gray-200 dark:border-gray-700 h-10",style:{width:"".concat(t.span*l,"px")},"data-timeunit-higher":t.date.toISOString()},function(e){if(!(e instanceof Date))return"";switch(c){case y.DAY:case y.WEEK:}return u(e,"MMM yyyy",{locale:void 0})}(t.date))}))),e.createElement("div",{className:"flex border-b border-gantt-border"},r.map((function(t,r){return e.createElement("div",{key:"timeunit-".concat(r),className:"".concat("w-[var(--gantt-unit-width)]"," flex-shrink-0 p-2 font-semibold text-center text-gantt-text ").concat(r===n?"bg-gantt-highlight":""," ").concat(m?"border-r border-gantt-border":""," h-10"),"data-timeunit":t.toISOString()},function(e){if(!(e instanceof Date&&d(e)))return"";switch(c){case y.DAY:return u(e,"d",{locale:void 0});case y.WEEK:var t=f(e);return"W".concat(t);case y.MONTH:return u(e,"MMM yyyy",{locale:void 0});case y.QUARTER:var r=Math.floor(e.getMonth()/3)+1;return"Q".concat(r," ").concat(e.getFullYear());case y.YEAR:return e.getFullYear().toString();default:return u(e,"MMM yyyy",{locale:void 0})}}(t))}))))},S=function(t){var r=t.currentMonthIndex,n=t.height,a=t.markerClass,o=void 0===a?"bg-red-500":a,i=t.label,c=void 0===i?"Today":i,s=t.dayOfMonth,l=t.className,u=void 0===l?"":l,d=t.viewMode,f=void 0===d?y.MONTH:d,m=t.unitWidth,g=void 0===m?150:m;if(r<0)return null;var h=function(){var e=new Date,t=s||e.getDate();switch(f){case y.DAY:return r*g+g/2;case y.WEEK:var n=e.getDay();return r*g+g*(n/7);case y.MONTH:var a=new Date(e.getFullYear(),e.getMonth()+1,0).getDate();return r*g+g*((t-1)/a);case y.QUARTER:var o=e.getMonth()%3;return r*g+g*(o/3);case y.YEAR:var i=e.getMonth();return r*g+g*(i/12);default:return r*g+g/2}}(),v=Math.max(100,n);return e.createElement("div",{className:"absolute top-0 w-px ".concat(o," z-10 ").concat(u),style:{left:"".concat(h,"px"),height:"".concat(v,"px"),boxShadow:"0 0 4px rgba(239, 68, 68, 0.5)"},"data-testid":"today-marker"},e.createElement("div",{className:"absolute -top-3 left-1/2 transform -translate-x-1/2 ".concat(o," px-1.5 py-0.5 rounded text-xs text-white dark:text-white whitespace-nowrap shadow-sm")},c))},W=function(){function e(){}return e.detectOverlaps=function(e,t){var r=this;if(void 0===t&&(t=y.MONTH),!Array.isArray(e)||0===e.length)return[];var n=k([],e,!0).sort((function(e,t){return e.startDate&&t.startDate?e.startDate.getTime()-t.startDate.getTime():0})),a=[];return n.forEach((function(e){for(var n=!1,o=0;o<a.length;o++){if(!a[o].some((function(n){return r.tasksVisuallyOverlap(e,n,t)}))){a[o].push(e),n=!0;break}}n||a.push([e])})),a},e.tasksVisuallyOverlap=function(e,t,r){if(void 0===r&&(r=y.MONTH),!(e.startDate&&e.endDate&&t.startDate&&t.endDate))return!1;var n=e.startDate.getTime(),a=e.endDate.getTime(),o=t.startDate.getTime(),i=t.endDate.getTime(),c=this.getCollisionBufferByViewMode(r);return n+c<i-c&&a-c>o+c||Math.abs(n-o)<2*c||Math.abs(a-i)<2*c},e.getCollisionBufferByViewMode=function(e){var t=36e5,r=24*t;switch(e){case y.DAY:return t;case y.WEEK:return 4*t;case y.MONTH:return 12*t;case y.QUARTER:return r;case y.YEAR:return 2*r;default:return 12*t}},e.wouldCollide=function(e,t,r,n){var a=this;return void 0===r&&(r=y.MONTH),t.some((function(t){return t.id!==e.id&&t.id!==n&&a.tasksVisuallyOverlap(e,t,r)}))},e.getPreviewArrangement=function(e,t,r){void 0===r&&(r=y.MONTH);var n=t.map((function(t){return t.id===e.id?e:t}));return this.detectOverlaps(n,r)},e}(),I=function(){function e(){}return e.calculateDatesFromPosition=function(e,t,r,n,a,o,i){void 0===i&&(i=y.MONTH);try{var c=isNaN(e)?0:e,s=isNaN(t)||t<20?20:t,l=r.getTime(),u=(n.getTime()-l)/(a*o),d=c*u,f=s*u,h=new Date(l+d),v=new Date(l+d+f);if(i===y.DAY){var D=Math.round(e/o),w=Math.max(1,Math.round(t/o)),p=new Date(r);p.setHours(0,0,0,0),(h=new Date(p)).setDate(p.getDate()+D),h.setHours(0,0,0,0),(v=new Date(h)).setDate(h.getDate()+w-1),v.setHours(23,59,59,999)}else h=m(h),v=g(v);return h<r&&(h=new Date(r)),v>n&&(v=new Date(n)),{newStartDate:h,newEndDate:v}}catch(e){return console.error("Error calculating dates from position:",e),{newStartDate:new Date(r),newEndDate:new Date(n)}}},e.createUpdatedTask=function(e,t,r){return E(E({},e),{startDate:new Date(t),endDate:new Date(r)})},e.calculateTaskPixelPosition=function(e,t,r,n,a,o){var i;void 0===o&&(o=y.MONTH);try{if(!(e.startDate instanceof Date&&e.endDate instanceof Date))throw new Error("Invalid dates in task");var c=t.getTime(),s=r.getTime(),l=Math.max(e.startDate.getTime(),t.getTime()),u=Math.min(e.endDate.getTime(),r.getTime());if(o===y.DAY){var d=new Date(t.getFullYear(),t.getMonth(),t.getDate(),0,0,0,0).getTime(),f=new Date(r.getFullYear(),r.getMonth(),r.getDate(),23,59,59,999).getTime();c=d,s=f;var m=new Date(new Date(l).getFullYear(),new Date(l).getMonth(),new Date(l).getDate(),0,0,0,0).getTime(),g=new Date(new Date(u).getFullYear(),new Date(u).getMonth(),new Date(u).getDate(),23,59,59,999).getTime();l=m,u=g}var h=s-c,v=n*a,D=(l-c)/h*v,w=(u-l)/h*v;o===y.DAY&&(D=Math.round(D/a)*a,w=Math.max(a,Math.round(w/a)*a));var p=((i={})[y.DAY]=20,i[y.WEEK]=20,i[y.MONTH]=20,i[y.QUARTER]=30,i[y.YEAR]=40,i)[o]||20;w=Math.max(p,w);var M=v-D;return{leftPx:D,widthPx:w=Math.min(M,w)}}catch(e){return console.error("Error calculating task position:",e),{leftPx:0,widthPx:20}}},e.getLiveDatesFromElement=function(e,t,r,n,a,o){void 0===o&&(o=y.MONTH);try{if(!e)return{startDate:new Date(t),endDate:new Date(r)};var i=parseFloat(e.style.left||"0"),c=parseFloat(e.style.width||"0"),s=this.calculateDatesFromPosition(i,c,t,r,n,a,o);return{startDate:s.newStartDate,endDate:s.newEndDate}}catch(e){return console.error("Error getting live dates:",e),{startDate:new Date(t),endDate:new Date(r)}}},e.datesOverlap=function(e,t,r,n){return h(e,{start:r,end:n})||h(t,{start:r,end:n})||h(r,{start:e,end:t})||h(n,{start:e,end:t})},e}(),U=function(t){var r=t.task,n=t.position,a=t.dragType,o=t.taskId,i=t.startDate,c=t.endDate,s=t.totalMonths,l=t.monthWidth,d=t.showProgress,f=void 0!==d&&d,m=t.instanceId,g=t.className,h=void 0===g?"":g,v=t.viewMode,D=void 0===v?y.MONTH:v,w=t.renderTooltip,p=r.startDate,M=r.endDate;try{var x=o||r.id,E=document.querySelector('[data-task-id="'.concat(x,'"][data-instance-id="').concat(m,'"]'));if(E&&(a||E.style.left||E.style.width)){var k=I.getLiveDatesFromElement(E,i,c,s,l,D);p=k.startDate,M=k.endDate}}catch(e){console.error("Error calculating live dates for tooltip:",e)}var b=Y(p,M,D),T=function(e){return e instanceof Date&&!isNaN(e.getTime())?D===y.DAY?u(e,"EEE, MMM d, yyyy"):u(e,"MMM d, yyyy"):"Invalid date"},N=function(){if(!a)return null;switch(a){case"move":return"Moving task...";case"resize-left":return"Adjusting start date...";case"resize-right":return"Adjusting end date...";default:return null}}();return w?e.createElement("div",{className:"rmg-task-tooltip absolute z-20 ".concat(h),style:{left:"".concat(n.x,"px"),top:"".concat(n.y-40,"px")}},w({task:r,position:n,dragType:a,startDate:p,endDate:M,viewMode:D})):e.createElement("div",{className:"rmg-task-tooltip absolute z-20 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-md shadow-md dark:shadow-gray-900 p-2 text-xs select-none ".concat(h),style:{left:"".concat(n.x,"px"),top:"".concat(n.y-40,"px"),minWidth:"200px"}},e.createElement("div",{className:"font-bold mb-1"},r.name||"Unnamed Task"),N&&e.createElement("div",{className:"text-xs text-blue-500 dark:text-blue-400 mb-1 italic"},N),e.createElement("div",{className:"grid grid-cols-2 gap-x-2 gap-y-1"},e.createElement("div",{className:"font-semibold"},"Start:"),e.createElement("div",null,T(p)),e.createElement("div",{className:"font-semibold"},"End:"),e.createElement("div",null,T(M)),e.createElement("div",{className:"font-semibold"},"Duration:"),e.createElement("div",null,b.value," ",b.unit),f&&"number"==typeof r.percent&&e.createElement(e.Fragment,null,e.createElement("div",{className:"font-semibold"},"Progress:"),e.createElement("div",null,r.percent,"%")),r.dependencies&&r.dependencies.length>0&&e.createElement(e.Fragment,null,e.createElement("div",{className:"font-semibold"},"Dependencies:"),e.createElement("div",null,r.dependencies.join(", ")))))},z=function(a){var o=a.activeMode,i=a.onChange,c=a.darkMode,s=a.availableModes,l=[{id:y.DAY,label:"Day"},{id:y.WEEK,label:"Week"},{id:y.MONTH,label:"Month"},{id:y.QUARTER,label:"Quarter"},{id:y.YEAR,label:"Year"}],u=s?l.filter((function(e){return s.includes(e.id)})):l,d=t(null),f=r({left:"0px",width:"0px"}),m=f[0],g=f[1];n((function(){var e=function(){if(d.current){var e=d.current.querySelector('[aria-selected="true"]');if(e){var t=e,r=t.offsetLeft,n=t.offsetWidth;g({left:"".concat(r,"px"),width:"".concat(n,"px")})}}};return e(),window.addEventListener("resize",e),function(){return window.removeEventListener("resize",e)}}),[o]);var h="\n    relative inline-flex rounded-full p-0.5\n    ".concat(c?"bg-gray-800/80":"bg-gray-100/90","\n    transition-all duration-300 ease-in-out shadow-sm dark:shadow-gray-900\n    border ").concat(c?"border-gray-700":"border-gray-200","\n    ");return e.createElement("div",{className:"relative flex items-center"},e.createElement("div",{ref:d,className:h,role:"tablist","aria-label":"View mode options"},e.createElement("span",{className:"\n                        absolute z-0 inset-0.5 rounded-full\n                        transition-all duration-300 ease-out transform\n                        ".concat(c?"bg-indigo-600":"bg-indigo-500","\n                    "),style:m,"aria-hidden":"true"}),u.map((function(t){return e.createElement("button",{key:t.id,role:"tab","aria-selected":o===t.id,"aria-controls":"panel-".concat(t.id),className:"".concat((r=o===t.id,"\n    relative z-10 px-3 py-1 text-xs font-medium\n    transition-all duration-200 ease-in-out\n    ".concat(r?"text-white":c?"text-gray-400 hover:text-gray-200":"text-gray-500 hover:text-gray-700","\n    focus:outline-none\n    "))," rounded-full"),onClick:function(){return i(t.id)}},t.label);var r}))))},K=function(o){var i=o.task,c=o.leftPx,s=o.widthPx,l=o.topPx,u=o.isHovered,d=o.isDragging,f=o.editMode,m=o.showProgress,g=void 0!==m&&m,h=o.instanceId,v=o.renderTask,D=o.getTaskColor,w=o.onMouseDown,p=o.onMouseEnter,M=o.onMouseLeave,y=o.onClick,x=o.onProgressUpdate,k=(u||d)&&f,b=t(null),T=t(null),N=r(!1),A=N[0],Y=N[1],F=r(i.percent||0),L=F[0],R=F[1];if(!i||!i.id)return null;var C=i.color||"bg-gantt-task",H="",O="text-gantt-task-text";if(D){var P=D({task:i,isHovered:u,isDragging:d});C=P.backgroundColor,H=P.borderColor||"",O=P.textColor||O}var S=a((function(e){if(A&&T.current&&b.current){var t=b.current.getBoundingClientRect(),r=t.width-2,n=Math.max(0,Math.min(r,e.clientX-t.left)),a=Math.round(n/r*100);R(Math.max(0,Math.min(100,a)))}}),[A]),W=a((function(){A&&(Y(!1),document.removeEventListener("mousemove",S),document.removeEventListener("mouseup",W),x&&L!==i.percent&&x(i,L))}),[A,x,L,i]);if(n((function(){R(i.percent||0)}),[i.percent]),n((function(){return function(){document.removeEventListener("mousemove",S),document.removeEventListener("mouseup",W)}}),[S,W]),v){var I=v({task:i,leftPx:c,widthPx:s,topPx:l,isHovered:u,isDragging:d,editMode:f,showProgress:g});return e.createElement("div",{ref:b,className:"absolute",style:{left:"".concat(Math.max(0,c),"px"),width:"".concat(Math.max(20,s),"px"),top:"".concat(l,"px")},onClick:function(e){return y(e,i)},onMouseDown:function(e){return w(e,i,"move")},onMouseEnter:function(e){return p(e,i)},onMouseLeave:M,"data-testid":"task-".concat(i.id),"data-task-id":i.id,"data-instance-id":h,"data-dragging":d?"true":"false"},I)}var U=C.startsWith("bg-")?{}:{backgroundColor:C},z=C.startsWith("bg-")?C:"",K=H?H.startsWith("border-")?{}:{borderColor:H,borderWidth:"1px"}:{},Q=H&&H.startsWith("border-")?H:"";return e.createElement("div",{ref:b,className:"absolute h-8 rounded ".concat(z," ").concat(Q," ").concat(O," flex items-center px-2 text-xs font-medium ").concat(f?"cursor-move":"cursor-pointer"," ").concat(d?"shadow-lg dark:shadow-gray-900":""),style:E(E(E({left:"".concat(Math.max(0,c),"px"),width:"".concat(Math.max(20,s),"px"),top:"".concat(l,"px")},U),K),{willChange:d?"transform, left, width":"auto"}),onClick:function(e){return y(e,i)},onMouseDown:function(e){return w(e,i,"move")},onMouseEnter:function(e){return p(e,i)},onMouseLeave:M,"data-testid":"task-".concat(i.id),"data-task-id":i.id,"data-instance-id":h,"data-dragging":d?"true":"false"},k&&e.createElement("div",{className:"absolute left-0 top-0 bottom-0 w-2 bg-white dark:bg-gray-600 bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-l rmg-resize-handle",onMouseDown:function(e){e.stopPropagation(),w(e,i,"resize-left")}}),e.createElement("div",{className:"truncate select-none"},i.name||"Unnamed Task"),g&&"number"==typeof L&&e.createElement("div",{ref:T,className:"absolute bottom-1 left-1 right-1 h-1 bg-black dark:bg-white bg-opacity-20 dark:bg-opacity-30 rounded-full overflow-hidden ".concat(f?"cursor-pointer":""),onClick:function(e){if(f&&g&&x){e.stopPropagation();var t=e.currentTarget.clientWidth,r=e.nativeEvent.offsetX,n=Math.round(r/t*100);R(n),x(i,n)}}},e.createElement("div",{className:"h-full bg-white dark:bg-gray-200 rounded-full relative",style:{width:"".concat(L,"%")}},f&&(u||A)&&e.createElement("div",{className:"absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 h-4 w-4 rounded-full bg-white dark:bg-gray-300 border-2 ".concat(H||C.startsWith("bg-")?Q||z:"border-blue-500 dark:border-blue-400"," cursor-ew-resize shadow-sm hover:shadow-md transition-shadow ").concat(A?"scale-110":""),onMouseDown:function(e){f&&g&&(e.stopPropagation(),e.preventDefault(),Y(!0),document.addEventListener("mousemove",S),document.addEventListener("mouseup",W))}}))),k&&e.createElement("div",{className:"absolute right-0 top-0 bottom-0 w-2 bg-white dark:bg-gray-600 bg-opacity-30 dark:bg-opacity-40 cursor-ew-resize rounded-r rmg-resize-handle",onMouseDown:function(e){e.stopPropagation(),w(e,i,"resize-right")}}))},Q=function(t){var r=t.tasks,n=void 0===r?[]:r,a=t.headerLabel,o=void 0===a?"Resources":a,i=t.showIcon,c=void 0!==i&&i,s=t.showTaskCount,l=void 0!==s&&s,u=t.showDescription,d=void 0===u||u,f=t.rowHeight,m=void 0===f?40:f,g=t.className,h=void 0===g?"":g,v=t.onGroupClick,D=t.viewMode,w=Array.isArray(n)?n:[],p=D===y.DAY||D===y.WEEK;return e.createElement("div",{className:"rmg-task-list w-40 flex-shrink-0 z-10 bg-gantt-bg shadow-sm ".concat(h)},p?e.createElement(e.Fragment,null,e.createElement("div",{className:"p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"}),e.createElement("div",{className:"p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"},o)):e.createElement("div",{className:"p-2 font-semibold text-gantt-text border-r border-b border-gantt-border h-10"},o),w.map((function(t){if(!t)return null;var r=function(e){if(!e.tasks||!Array.isArray(e.tasks))return 60;var t=W.detectOverlaps(e.tasks,D);return Math.max(60,t.length*m+20)}(t);return e.createElement("div",{key:"task-group-".concat(t.id||"unknown"),className:"p-2 border-r border-b border-gray-200 dark:border-gray-700 font-medium text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150",style:{height:"".concat(r,"px")},onClick:function(){return e=t,void(v&&v(e));var e},"data-testid":"task-group-".concat(t.id||"unknown")},e.createElement("div",{className:"flex items-center"},c&&t.icon&&e.createElement("span",{className:"mr-2",dangerouslySetInnerHTML:{__html:t.icon}}),e.createElement("div",{className:"font-medium truncate"},t.name||"Unnamed")),d&&t.description&&e.createElement("div",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1 truncate"},t.description),l&&t.tasks&&t.tasks.length>0&&e.createElement("div",{className:"text-xs text-gray-500 dark:text-gray-400 mt-1"},t.tasks.length," ",1===t.tasks.length?"task":"tasks"))})))},q=function(a){var o=a.taskGroup,i=a.startDate,c=a.endDate,s=a.totalMonths,l=a.monthWidth,u=a.editMode,d=void 0===u||u,f=a.showProgress,m=void 0!==f&&f,g=a.className,h=void 0===g?"":g,v=a.tooltipClassName,D=void 0===v?"":v,w=a.onTaskUpdate,p=a.onTaskClick,M=a.onTaskSelect,x=a.onAutoScrollChange,k=a.viewMode,b=void 0===k?y.MONTH:k,T=a.scrollContainerRef,N=a.smoothDragging,A=void 0===N||N;a.movementThreshold;var Y=a.animationSpeed,F=void 0===Y?.25:Y,L=a.renderTask,R=a.renderTooltip,C=a.getTaskColor;if(!o||!o.id||!Array.isArray(o.tasks))return e.createElement("div",{className:"relative h-16 text-gantt-text"},"Invalid task group data");var H=i instanceof Date?i:new Date,O=c instanceof Date?c:new Date,P=r(null),S=P[0],z=P[1],Q=r(null),q=Q[0],V=Q[1],_=r(null),X=_[0],B=_[1],j=r(0),G=j[0],J=j[1],Z=r({x:0,y:0}),$=Z[0],ee=Z[1],te=r(null),re=te[0],ne=te[1],ae=r(null),oe=ae[0],ie=ae[1],ce=t(null),se=t({x:0,y:0}),le=t(null),ue=t(null),de=t({left:0,width:0}),fe=t(0),me=t(!1),ge=t(null),he=t(0),ve=t(null),De=t({minLeft:0,maxLeft:s*l}),we=t(null),pe=t(null),Me=t(null),ye=t(null),xe=t("task-row-".concat(Math.random().toString(36).substring(2,11))),Ee=A&&b!==y.DAY,ke=function(e){var t=E(E({},e),{startDate:new Date(e.startDate),endDate:new Date(e.endDate)});ne(t),Me.current=t},be=re?W.getPreviewArrangement(re,o.tasks,b):W.detectOverlaps(o.tasks,b),Te=Math.max(60,40*be.length+20);n((function(){De.current={minLeft:0,maxLeft:s*l}}),[s,l]);var Ne=function(){if(ye.current&&le.current&&ue.current){var e=Date.now(),t=e-fe.current;fe.current=e;var r=F||.25,n=ue.current.left+(le.current.left-ue.current.left)*r,a=ue.current.width+(le.current.width-ue.current.width)*r;de.current.left=(n-ue.current.left)/(t||16),de.current.width=(a-ue.current.width)/(t||16),ue.current={left:n,width:a},ye.current.style.left="".concat(n,"px"),ye.current.style.width="".concat(a,"px"),pe.current&&Ae(n,a),ce.current=requestAnimationFrame(Ne)}else ce.current=null},Ae=function(e,t){if(pe.current)try{if(b===y.DAY){var r=Math.round(e/l),n=Math.max(1,Math.round(t/l)),a=new Date(H);a.setHours(0,0,0,0),(m=new Date(a)).setDate(a.getDate()+r),m.setHours(0,0,0,0),(g=new Date(m)).setDate(m.getDate()+n-1),g.setHours(23,59,59,999);var o=H.getTime(),i=O.getTime(),c=new Date(Math.max(o,m.getTime())),u=new Date(Math.min(i,g.getTime())),d=E(E({},pe.current),{startDate:c,endDate:u});ke(d)}else{var f=I.calculateDatesFromPosition(e,t,H,O,s,l,b),m=f.newStartDate,g=f.newEndDate;d=E(E({},pe.current),{startDate:m,endDate:g});ke(d)}}catch(e){console.error("Error updating dates:",e)}},Ye=function(){if(!me.current){me.current=!0;var e=function(){if(me.current&&(null==T?void 0:T.current)&&le.current){var t=T.current,r=ve.current,n=he.current,a=t.scrollLeft,o=t.scrollWidth-t.clientWidth;if("left"===r){if(a<=0)return void Fe();var i=Math.max(0,a-n);if(t.scrollLeft=i,le.current){var c=Math.max(De.current.minLeft,le.current.left-n);le.current.left=c}}else if("right"===r){if(a>=o)return void Fe();i=Math.min(o,a+n);if(t.scrollLeft=i,le.current&&oe){var s=De.current.maxLeft-le.current.width;c=Math.min(s,le.current.left+n);le.current.left=c}}me.current&&(ge.current=requestAnimationFrame(e))}};ge.current=requestAnimationFrame(e)}},Fe=function(){me.current=!1,null!==ge.current&&(cancelAnimationFrame(ge.current),ge.current=null)},Le=function(e,t){p&&!q&&p(t,o),M&&M(t,!0)},Re=function(e,t){q||(z(t),He(e))},Ce=function(){q||z(null)},He=function(e){if(we.current){var t=we.current.getBoundingClientRect();ee({x:e.clientX-t.left+20,y:e.clientY-t.top})}},Oe=function(e,t,r){if(d){e.preventDefault(),e.stopPropagation();var n=document.querySelector('[data-task-id="'.concat(t.id,'"][data-instance-id="').concat(xe.current,'"]'));if(n){ye.current=n;var a=parseFloat(n.style.left||"0"),o=parseFloat(n.style.width||"0");ie({left:a,width:o,startDate:new Date(t.startDate),endDate:new Date(t.endDate)}),le.current={left:a,width:o},ue.current={left:a,width:o},se.current={x:e.clientX,y:e.clientY},fe.current=Date.now(),de.current={left:0,width:0},n.setAttribute("data-dragging","true"),n.style.transition="none",V(t),B(r),J(e.clientX),ne(t),function(e){var t=E(E({},e),{startDate:new Date(e.startDate),endDate:new Date(e.endDate)});V(t),pe.current=t}(t),ke(t),null===ce.current&&Ee&&(ce.current=requestAnimationFrame(Ne)),document.addEventListener("mouseup",Se),document.addEventListener("mousemove",Pe)}}},Pe=function(e){if(se.current={x:e.clientX,y:e.clientY},e instanceof MouseEvent&&S&&we.current){var t=we.current.getBoundingClientRect();ee({x:e.clientX-t.left+20,y:e.clientY-t.top})}else e instanceof MouseEvent||He(e);if(q&&(null==T?void 0:T.current)&&function(e){if((null==T?void 0:T.current)&&q){var t=T.current.getBoundingClientRect(),r=null,n=0;e<t.left+40?(r="left",n=Math.max(1,Math.round((40-(e-t.left))/10))):e>t.right-40&&(r="right",n=Math.max(1,Math.round((e-(t.right-40))/10))),ve.current=r,he.current=n,r&&!me.current?(Ye(),x&&x(!0)):!r&&me.current&&(Fe(),x&&x(!1))}}(e.clientX),q&&X&&oe&&we.current&&le.current)try{var r=e.clientX-G,n=s*l,a=le.current.left,o=le.current.width;switch(X){case"move":a=Math.max(0,Math.min(n-oe.width,oe.left+r)),b===y.DAY&&(a=Math.round(a/l)*l);break;case"resize-left":var i=oe.width-20,c=Math.min(i,r);a=Math.max(0,oe.left+c),b===y.DAY&&(a=Math.round(a/l)*l);var u=oe.left+oe.width;o=Math.max(20,u-a),b===y.DAY&&(o=Math.round(o/l)*l,o=Math.max(l,o));break;case"resize-right":o=Math.max(20,Math.min(n-oe.left,oe.width+r)),b===y.DAY&&(o=Math.round(o/l)*l,o=Math.max(l,o))}le.current={left:a,width:o},b===y.DAY&&ye.current?(ye.current.style.left="".concat(a,"px"),ye.current.style.width="".concat(o,"px"),Ae(a,o)):Ee?null===ce.current&&(fe.current=Date.now(),ce.current=requestAnimationFrame(Ne)):ye.current&&(ye.current.style.left="".concat(a,"px"),ye.current.style.width="".concat(o,"px"),Ae(a,o))}catch(e){console.error("Error in handleMouseMove:",e)}},Se=function(){try{null!==ce.current&&(cancelAnimationFrame(ce.current),ce.current=null),function(){if(ye.current&&le.current&&pe.current){var e=le.current.left,t=le.current.width;b===y.DAY?(e=Math.round(e/l)*l,t=Math.round(t/l)*l,t=Math.max(l,t),ye.current.style.transition="transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out",ye.current.style.left="".concat(e,"px"),ye.current.style.width="".concat(t,"px"),Ae(e,t)):Ee||(ye.current.style.transition="transform 0.15s ease-out, left 0.15s ease-out, width 0.15s ease-out",ye.current.style.left="".concat(e,"px"),ye.current.style.width="".concat(t,"px"));var r=Me.current;if(r){var n=H.getTime(),a=O.getTime();if(r.startDate.getTime()<n&&(r=E(E({},r),{startDate:new Date(n)})),r.endDate.getTime()>a&&(r=E(E({},r),{endDate:new Date(a)})),w&&r)try{w(o.id,r)}catch(e){console.error("Error in onTaskUpdate:",e)}}}}(),ye.current&&(ye.current.setAttribute("data-dragging","false"),setTimeout((function(){ye.current&&(ye.current.style.transition="")}),200))}catch(e){console.error("Error in handleMouseUp:",e)}finally{Fe(),x&&x(!1),V(null),B(null),ne(null),ie(null),pe.current=null,Me.current=null,ye.current=null,le.current=null,ue.current=null,document.removeEventListener("mouseup",Se),document.removeEventListener("mousemove",Pe)}},We=function(e,t){if(w&&o.id)try{var r=E(E({},e),{percent:t});w(o.id,r)}catch(e){console.error("Error updating task progress:",e)}};return n((function(){return function(){document.removeEventListener("mouseup",Se),document.removeEventListener("mousemove",Pe),Fe(),null!==ce.current&&(cancelAnimationFrame(ce.current),ce.current=null)}}),[]),o.tasks&&0!==o.tasks.length?e.createElement("div",{className:"relative border-b border-gray-200 dark:border-gray-700 ".concat(h),style:{height:"".concat(Te,"px")},onMouseMove:function(e){return Pe(e)},onMouseLeave:function(){return z(null)},ref:we,"data-testid":"task-row-".concat(o.id),"data-instance-id":xe.current},be.map((function(t,r){return e.createElement(e.Fragment,{key:"task-row-".concat(r)},t.map((function(t){try{if(!(t&&t.id&&t.startDate instanceof Date&&t.endDate instanceof Date))return console.warn("Invalid task data:",t),null;var n=I.calculateTaskPixelPosition(t,H,O,s,l,b),a=n.leftPx,o=n.widthPx,i=(null==S?void 0:S.id)===t.id,c=(null==q?void 0:q.id)===t.id,u=40*r+10;return e.createElement(K,{key:"task-".concat(t.id),task:t,leftPx:a,widthPx:o,topPx:u,isHovered:i,isDragging:c,editMode:d,showProgress:m,instanceId:xe.current,onMouseDown:Oe,onMouseEnter:Re,onMouseLeave:Ce,onClick:Le,renderTask:L,getTaskColor:C,onProgressUpdate:We})}catch(e){return console.error("Error rendering task:",e),null}})))})),(S||q)&&e.createElement(U,{task:re||q||S,position:$,dragType:X,taskId:null==q?void 0:q.id,startDate:H,endDate:O,totalMonths:s,monthWidth:l,showProgress:m,instanceId:xe.current,className:D,viewMode:b,renderTooltip:R})):e.createElement("div",{className:"relative h-16 text-gantt-text"},"No tasks available")},V=function(a){var o=a.tasks,i=void 0===o?[]:o,c=a.startDate,s=a.endDate,l=a.title,u=void 0===l?"Project Timeline":l,d=a.currentDate,f=void 0===d?new Date:d,m=a.showCurrentDateMarker,g=void 0===m||m,h=a.todayLabel,x=void 0===h?"Today":h,b=a.editMode,T=void 0===b||b,A=a.headerLabel,Y=void 0===A?"Resources":A,F=a.showProgress,L=void 0!==F&&F,H=a.darkMode,O=void 0!==H&&H,I=a.locale,U=void 0===I?"default":I,K=a.styles,V=void 0===K?{}:K,_=a.viewMode,X=void 0===_?y.MONTH:_,B=a.showViewModeSelector,j=void 0===B||B,G=a.smoothDragging,J=void 0===G||G,Z=a.movementThreshold,$=void 0===Z?3:Z,ee=a.animationSpeed,te=void 0===ee?.25:ee,re=a.renderTaskList,ne=a.renderTask,ae=a.renderTooltip,oe=a.renderViewModeSelector,ie=a.renderHeader,ce=a.renderTimelineHeader,se=a.getTaskColor,le=a.onTaskUpdate,ue=a.onTaskClick,de=a.onTaskSelect;a.onTaskDoubleClick;var fe=a.onGroupClick,me=a.onViewModeChange,ge=a.fontSize;a.rowHeight,a.timeStep;var he=t(null),ve=t(null),De=r(X),we=De[0],pe=De[1],Me=r([]);Me[0];var ye=Me[1],xe=r(150),Ee=xe[0],ke=xe[1],be=r(!1),Te=be[0],Ne=be[1],Ae=r(0),Ye=Ae[0],Fe=Ae[1],Le=c||R(i),Re=s||C(i),Ce=function(e,t){var r=[],n=new Date(e);n.setHours(0,0,0,0);var a=new Date(t);for(a.setHours(23,59,59,999);n<=a;)r.push(new Date(n)),n=M(n,1);return r},He=function(e,t){for(var r=[],n=new Date(e);n<=t;)r.push(new Date(n)),n=M(n,7);return r},Oe=function(e,t){for(var r=[],n=w(new Date(e));n<=t;)r.push(new Date(n)),n=p(n,1);return r},Pe=function(e,t){for(var r=[],n=v(new Date(e));n<=t;)r.push(new Date(n)),n=D(n,1);return r},Se=function(){switch(we){case y.DAY:return Ce(Le,Re);case y.WEEK:return He(Le,Re);case y.MONTH:return N(Le,Re);case y.QUARTER:return Oe(Le,Re);case y.YEAR:return Pe(Le,Re);default:return N(Le,Re)}}(),We=Se.length,Ie=function(){var e=new Date;switch(we){case y.DAY:return Se.findIndex((function(t){return t.getDate()===e.getDate()&&t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case y.WEEK:return Se.findIndex((function(t){var r=new Date(t);return r.setDate(t.getDate()+6),e>=t&&e<=r}));case y.MONTH:return Se.findIndex((function(t){return t.getMonth()===e.getMonth()&&t.getFullYear()===e.getFullYear()}));case y.QUARTER:var t=Math.floor(e.getMonth()/3);return Se.findIndex((function(r){return Math.floor(r.getMonth()/3)===t&&r.getFullYear()===e.getFullYear()}));case y.YEAR:return Se.findIndex((function(t){return t.getFullYear()===e.getFullYear()}));default:return-1}}(),Ue=function(e){Ne(e),ve.current&&(e?ve.current.classList.add("rmg-auto-scrolling"):ve.current.classList.remove("rmg-auto-scrolling"))},ze=function(e,t){if(le)try{var r=E(E({},t),{startDate:t.startDate instanceof Date?t.startDate:new Date(t.startDate),endDate:t.endDate instanceof Date?t.endDate:new Date(t.endDate)});Fe((function(e){return e+1})),le(e,r)}catch(e){console.error("Error in handleTaskUpdate:",e)}},Ke=function(e,t){if(ue)try{ue(e,t)}catch(e){console.error("Error in handleTaskClick:",e)}},Qe=function(e,t){if(ye((function(r){return t?k(k([],r,!0),[e.id],!1):r.filter((function(t){return t!==e.id}))})),de)try{de(e,t)}catch(e){console.error("Error in onTaskSelect handler:",e)}},qe=function(e){switch(pe(e),e){case y.DAY:ke(50);break;case y.WEEK:ke(80);break;case y.MONTH:ke(150);break;case y.QUARTER:ke(180);break;case y.YEAR:ke(200);break;default:ke(150)}me&&me(e)};n((function(){qe(X)}),[X]),n((function(){if(he.current){var e=Math.max(.1,Math.min(1,te||.25));he.current.style.setProperty("--rmg-animation-speed",e.toString())}}),[te,he.current]);var Ve={fontSize:ge||"inherit"},_e=O?"dark":"",Xe=E(E({},{container:"",title:"",header:"",taskList:"",timeline:"",taskRow:"",todayMarker:"",tooltip:""}),V);return e.createElement("div",{ref:he,className:"rmg-gantt-chart w-full bg-gantt-bg text-gantt-text rounded-xl shadow-lg overflow-hidden ".concat(_e," ").concat(Xe.container),style:E(E({},Ve),{"--gantt-unit-width":"".concat(Ee,"px")}),"data-testid":"gantt-chart"},ie?ie({title:u,darkMode:O,viewMode:we,onViewModeChange:qe,showViewModeSelector:j}):e.createElement("div",{className:"p-6 border-b border-gantt-border bg-gantt-bg"},e.createElement("div",{className:"flex justify-between items-center"},e.createElement("h1",{className:"text-2xl font-bold text-gantt-text ".concat(Xe.title)},u),j&&e.createElement("div",{className:"flex space-x-2"},oe?oe({activeMode:we,onChange:qe,darkMode:O,availableModes:[y.DAY,y.WEEK,y.MONTH,y.QUARTER,y.YEAR]}):e.createElement(z,{activeMode:we,onChange:qe,darkMode:O})))),e.createElement("div",{className:"relative flex"},re?re({tasks:i,headerLabel:Y,onGroupClick:fe,viewMode:we}):e.createElement(Q,{tasks:i,headerLabel:Y,onGroupClick:fe,className:Xe.taskList,viewMode:we}),e.createElement("div",{ref:ve,className:"flex-grow overflow-x-auto rmg-gantt-scroll-container ".concat(Te?"rmg-auto-scrolling":"")},e.createElement("div",{className:"min-w-max"},ce?ce({timeUnits:Se,currentUnitIndex:Ie,viewMode:we,locale:U,unitWidth:Ee}):e.createElement(P,{months:Se,currentMonthIndex:Ie,locale:U,className:Xe.timeline,viewMode:we,unitWidth:Ee}),e.createElement("div",{className:"relative"},g&&Ie>=0&&e.createElement(S,{currentMonthIndex:Ie,height:i.reduce((function(e,t){if(!t||!Array.isArray(t.tasks))return e+60;var r=W.detectOverlaps(t.tasks,we);return e+Math.max(60,40*r.length+20)}),0),label:x,dayOfMonth:f.getDate(),className:Xe.todayMarker,viewMode:we,unitWidth:Ee}),i.map((function(t){return t&&t.id?e.createElement(q,{key:"task-row-".concat(t.id,"-").concat(Ye),taskGroup:t,startDate:Le,endDate:Re,totalMonths:We,monthWidth:Ee,editMode:T,showProgress:L,onTaskUpdate:ze,onTaskClick:Ke,onTaskSelect:Qe,onAutoScrollChange:Ue,className:Xe.taskRow,tooltipClassName:Xe.tooltip,viewMode:we,scrollContainerRef:ve,smoothDragging:J,movementThreshold:$,animationSpeed:te,renderTask:ne,renderTooltip:ae,getTaskColor:se}):null})))))))},_=function(t){return e.createElement(V,E({},t))};export{W as CollisionService,x as DateDisplayFormat,V as GanttChart,_ as GanttChartWithStyles,K as TaskItem,Q as TaskList,q as TaskRow,I as TaskService,P as Timeline,S as TodayMarker,U as Tooltip,y as ViewMode,z as ViewModeSelector,L as calculateDuration,H as calculateTaskPosition,_ as default,O as detectTaskOverlaps,R as findEarliestDate,C as findLatestDate,T as formatDate,F as formatDateRange,b as formatMonth,A as getDaysInMonth,Y as getDuration,N as getMonthsBetween};
//# sourceMappingURL=index.esm.js.map
