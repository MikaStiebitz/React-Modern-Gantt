import e,{useState as t,useRef as n,useEffect as a,cloneElement as r,Children as o,isValidElement as i}from"react";var l,c=function(){return c=Object.assign||function(e){for(var t,n=1,a=arguments.length;n<a;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},c.apply(this,arguments)};function s(e,t,n){if(n||2===arguments.length)for(var a,r=0,o=t.length;r<o;r++)!a&&r in t||(a||(a=Array.prototype.slice.call(t,0,r)),a[r]=t[r]);return e.concat(a||Array.prototype.slice.call(t))}"function"==typeof SuppressedError&&SuppressedError,function(e){e.MONTH_YEAR="month-year",e.FULL_DATE="full-date",e.SHORT_DATE="short-date"}(l||(l={}));var d={headerBackground:"bg-white",headerText:"text-gray-700",backgroundHighlight:"bg-blue-50",borderColor:"border-gray-200",todayMarkerColor:"bg-red-500"};function u(e){return e.toLocaleString("default",{month:"short"})}function m(e,t){switch(void 0===t&&(t=l.FULL_DATE),t){case l.MONTH_YEAR:return e.toLocaleString("default",{month:"short",year:"2-digit"});case l.SHORT_DATE:return e.toLocaleString("default",{month:"short",day:"numeric"});case l.FULL_DATE:default:return e.toLocaleString("default",{month:"short",day:"numeric",year:"numeric"})}}function f(e,t){for(var n=[],a=e.getFullYear(),r=e.getMonth(),o=t.getFullYear(),i=t.getMonth(),l=a;l<=o;l++)for(var c=l===o?i:11,s=l===a?r:0;s<=c;s++)n.push(new Date(l,s,1));return n}function h(e,t){return new Date(e,t+1,0).getDate()}function v(){return[1,8,15,22,29]}function g(e,t,n){var a=f(new Date(t.getFullYear(),t.getMonth(),1),new Date(n.getFullYear(),n.getMonth()+1,0)),r=a.length,o=e.startDate.getFullYear(),i=e.startDate.getMonth(),l=a.findIndex((function(e){return e.getFullYear()===o&&e.getMonth()===i})),c=l<0?0:l,s=e.endDate.getFullYear(),d=e.endDate.getMonth(),u=a.findIndex((function(e){return e.getFullYear()===s&&e.getMonth()===d})),m=((u<0?a.length-1:u)-c+1)/r*100;return{left:"".concat(c/r*100,"%"),width:"".concat(m,"%")}}function p(e){var t=[];return e.forEach((function(e){for(var n=!1,a=0;a<t.length;a++){if(!t[a].some((function(t){return!(e.startDate>=t.endDate||e.endDate<=t.startDate)}))){t[a].push(e),n=!0;break}}n||t.push([e])})),t}function D(e){var t=new Date;return e.forEach((function(e){e.tasks.forEach((function(e){e.startDate<t&&(t=new Date(e.startDate))}))})),new Date(t.getFullYear(),t.getMonth(),1)}function w(e){var t=new Date;return e.forEach((function(e){e.tasks.forEach((function(e){e.endDate>t&&(t=new Date(e.endDate))}))})),new Date(t.getFullYear(),t.getMonth()+1,0)}var b=function(){function e(){}return e.detectOverlaps=function(e){if(!Array.isArray(e)||0===e.length)return[];var t=[];return e.forEach((function(e){for(var n=!1,a=0;a<t.length;a++){if(!t[a].some((function(t){return!(e.startDate>=t.endDate||e.endDate<=t.startDate)}))){t[a].push(e),n=!0;break}}n||t.push([e])})),t},e.wouldCollide=function(e,t,n){return t.some((function(t){return t.id!==e.id&&t.id!==n&&!(e.startDate>=t.endDate||e.endDate<=t.startDate)}))},e.getPreviewArrangement=function(e,t){var n=t.map((function(t){return t.id===e.id?e:t}));return this.detectOverlaps(n)},e}(),k=function(){function e(){}return e.calculateDatesFromPosition=function(e,t,n,a,r,o){try{var i=isNaN(e)?0:e,l=isNaN(t)||t<20?20:t,c=n.getTime(),s=(a.getTime()-c)/(r*o),d=i*s,u=l*s;return{newStartDate:new Date(c+d),newEndDate:new Date(c+d+u)}}catch(e){return console.error("Error calculating dates from position:",e),{newStartDate:new Date(n),newEndDate:new Date(a)}}},e.createUpdatedTask=function(e,t,n){return c(c({},e),{startDate:new Date(t),endDate:new Date(n)})},e.calculateTaskPixelPosition=function(e,t,n,a,r){try{if(!(e.startDate instanceof Date&&e.endDate instanceof Date))throw new Error("Invalid dates in task");var o=e.startDate.getTime(),i=e.endDate.getTime(),l=t.getTime(),c=n.getTime()-l,s=(i-o)/c*100;return{leftPx:(o-l)/c*100/100*a*r,widthPx:Math.max(20,s/100*a*r)}}catch(t){return console.error("Error calculating task position:",t,e),{leftPx:0,widthPx:20}}},e.getLiveDatesFromElement=function(e,t,n,a,r){try{if(!e)return{startDate:new Date(t),endDate:new Date(n)};var o=parseFloat(e.style.left||"0"),i=parseFloat(e.style.width||"0"),l=this.calculateDatesFromPosition(o,i,t,n,a,r);return{startDate:l.newStartDate,endDate:l.newEndDate}}catch(e){return console.error("Error getting live dates:",e),{startDate:new Date(t),endDate:new Date(n)}}},e.formatDate=function(e){return e instanceof Date&&!isNaN(e.getTime())?e.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}):"Invalid date"},e.getDuration=function(e,t){try{var n=Math.abs(t.getTime()-e.getTime());return Math.ceil(n/864e5)}catch(e){return console.error("Error calculating duration:",e),0}},e}(),y=function(t){var n=t.task,a=t.leftPx,r=t.widthPx,o=t.topPx,i=t.isHovered,l=t.isDragging,c=t.editMode,s=t.showProgress,d=void 0!==s&&s,u=t.onMouseDown,m=t.onMouseEnter,f=t.onMouseLeave,h=t.onClick,v=(i||l)&&c;return n&&n.id?e.createElement("div",{className:"absolute h-8 rounded ".concat(n.color||"bg-blue-500"," flex items-center px-2 text-xs text-white font-medium ").concat(c?"cursor-move":"cursor-pointer"),style:{left:"".concat(Math.max(0,a),"px"),width:"".concat(Math.max(20,r),"px"),top:"".concat(o,"px")},onClick:function(e){return h(e,n)},onMouseDown:function(e){return u(e,n,"move")},onMouseEnter:function(e){return m(e,n)},onMouseLeave:f,"data-testid":"task-".concat(n.id),"data-task-id":n.id},v&&e.createElement("div",{className:"absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-l",onMouseDown:function(e){e.stopPropagation(),u(e,n,"resize-left")}}),e.createElement("div",{className:"truncate select-none"},n.name||"Unnamed Task"),d&&"number"==typeof n.percent&&e.createElement("div",{className:"absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden"},e.createElement("div",{className:"h-full bg-white rounded-full",style:{width:"".concat(n.percent,"%")}})),v&&e.createElement("div",{className:"absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-r",onMouseDown:function(e){e.stopPropagation(),u(e,n,"resize-right")}})):(console.warn("TaskRenderer: Invalid task data",n),null)},x=function(t){var n=t.task,a=t.position,r=t.dragType,o=t.taskId,i=t.startDate,l=t.endDate,c=t.totalMonths,s=t.monthWidth,d=t.showProgress,u=void 0!==d&&d,m=n.startDate,f=n.endDate;try{var h=o||n.id,v=document.querySelector('[data-task-id="'.concat(h,'"]'));if(v&&(r||v.style.left||v.style.width)){var g=k.getLiveDatesFromElement(v,i,l,c,s);m=g.startDate,f=g.endDate}}catch(e){console.error("Error calculating live dates for tooltip:",e)}return e.createElement("div",{className:"absolute z-20 bg-white border border-gray-200 rounded-md shadow-md p-2 text-xs select-none",style:{left:"".concat(a.x,"px"),top:"".concat(a.y-40,"px"),minWidth:"150px"}},e.createElement("div",{className:"font-bold mb-1"},n.name||"Unnamed Task"),e.createElement("div",{className:"grid grid-cols-2 gap-x-2 gap-y-1"},e.createElement("div",{className:"font-semibold"},"Start:"),e.createElement("div",null,k.formatDate(m)),e.createElement("div",{className:"font-semibold"},"End:"),e.createElement("div",null,k.formatDate(f)),e.createElement("div",{className:"font-semibold"},"Duration:"),e.createElement("div",null,k.getDuration(m,f)," days"),u&&"number"==typeof n.percent&&e.createElement(e.Fragment,null,e.createElement("div",{className:"font-semibold"},"Progress:"),e.createElement("div",null,n.percent,"%"))))},E=function(r){var o=r.taskGroup,i=r.startDate,l=r.endDate,c=r.totalMonths,s=r.monthWidth,d=r.editMode,u=void 0===d||d,m=r.showProgress,f=void 0!==m&&m,h=r.onTaskUpdate,v=r.onTaskClick;if(!o||!o.id||!Array.isArray(o.tasks))return console.warn("TaskRow: Invalid task group data",o),e.createElement("div",{className:"relative h-16"},"Invalid task group data");var g=i instanceof Date?i:new Date,p=l instanceof Date?l:new Date,D=t(null),w=D[0],E=D[1],M=t(null),N=M[0],T=M[1],P=t(null),L=P[0],S=P[1],C=t(0),F=C[0],A=C[1],I=t({x:0,y:0}),U=I[0],Y=I[1],z=t(null),R=z[0],O=z[1],H=n(null),_=n(null),W=n(null),X=function(e){O(e),W.current=e},j=R?b.getPreviewArrangement(R,o.tasks):b.detectOverlaps(o.tasks),B=Math.max(60,40*j.length+20),G=function(e,t){v&&!N&&v(t,o)},q=function(e,t){N||(E(t),K(e))},J=function(){N||E(null)},K=function(e){if(H.current){var t=H.current.getBoundingClientRect();Y({x:e.clientX-t.left+20,y:e.clientY-t.top})}},Q=function(e){if(e instanceof MouseEvent&&"mousemove"===e.type){if(w){var t=e;if(H.current){var n=H.current.getBoundingClientRect();Y({x:t.clientX-n.left+20,y:t.clientY-n.top})}}}else K(e);if(N&&L&&H.current)try{var a=e.clientX-F;if(0===a)return;var r=c*s,o=document.querySelector('[data-task-id="'.concat(N.id,'"]'));if(!o)return;var i=parseFloat(o.style.left||"0"),l=parseFloat(o.style.width||"0"),d=i,u=l;if("move"===L)d=Math.max(0,Math.min(r-l,i+a)),o.style.left="".concat(d,"px");else if("resize-left"===L){var m=l-20,f=Math.min(m,a);d=Math.max(0,i+f),u=Math.max(20,l-f),o.style.left="".concat(d,"px"),o.style.width="".concat(u,"px")}else"resize-right"===L&&(u=Math.max(20,Math.min(r-i,l+a)),o.style.width="".concat(u,"px"));var h=k.calculateDatesFromPosition(d,u,g,p,c,s),v=h.newStartDate,D=h.newEndDate,b=k.createUpdatedTask(N,v,D);O(b),X(b),A(e.clientX)}catch(e){console.error("Error in handleMouseMove:",e)}},V=function(e,t,n){u&&(e.preventDefault(),e.stopPropagation(),T(t),S(n),A(e.clientX),O(t),function(e){T(e),_.current=e}(t),X(t),document.addEventListener("mouseup",Z),document.addEventListener("mousemove",Q))},Z=function(){try{var e=_.current,t=W.current;e&&t&&h&&h(o.id,t)}catch(e){console.error("Error in handleMouseUp:",e)}finally{T(null),S(null),O(null),_.current=null,W.current=null,document.removeEventListener("mouseup",Z),document.removeEventListener("mousemove",Q)}};return a((function(){!N&&R&&h&&h(o.id,R)}),[N,R,o.id,h]),a((function(){return function(){document.removeEventListener("mouseup",Z),document.removeEventListener("mousemove",Q)}}),[]),o.tasks&&0!==o.tasks.length?e.createElement("div",{className:"relative border-b border-gray-200",style:{height:"".concat(B,"px")},onMouseMove:function(e){return Q(e)},onMouseLeave:function(){return E(null)},ref:H,"data-testid":"task-row-".concat(o.id)},j.map((function(t,n){return e.createElement(e.Fragment,{key:"task-row-".concat(n)},t.map((function(t){try{if(!(t&&t.id&&t.startDate instanceof Date&&t.endDate instanceof Date))return console.warn("Invalid task data:",t),null;var a=k.calculateTaskPixelPosition(t,g,p,c,s),r=a.leftPx,o=a.widthPx,i=(null==w?void 0:w.id)===t.id,l=(null==N?void 0:N.id)===t.id,d=40*n+10;return e.createElement(y,{key:"task-".concat(t.id),task:t,leftPx:r,widthPx:o,topPx:d,isHovered:i,isDragging:l,editMode:u,showProgress:f,onMouseDown:V,onMouseEnter:q,onMouseLeave:J,onClick:G})}catch(e){return console.error("Error rendering task:",e,t),null}})))})),(w||N)&&e.createElement(x,{task:R||N||w,position:U,dragType:L,taskId:null==N?void 0:N.id,startDate:g,endDate:p,totalMonths:c,monthWidth:s,showProgress:f})):e.createElement("div",{className:"relative h-16"},"No tasks available")},M=function(t){var n=t.months,a=t.currentMonthIndex,r=t.theme,o=void 0===r?{}:r,i=(null==o?void 0:o.backgroundHighlight)||"bg-blue-50";return e.createElement("div",{className:"flex border-b border-gray-200"},n.map((function(t,n){return e.createElement("div",{key:n,className:"w-[150px] flex-shrink-0 p-2 font-semibold text-center ".concat(n===a?i:""),"data-month":t.toISOString()},(r=t)instanceof Date?r.toLocaleString("default",{month:"short",year:"2-digit"}):"");var r})))},N=function(t){var n=t.currentMonthIndex,a=t.height,r=t.markerClass,o=void 0===r?"bg-red-500":r,i=t.label,l=void 0===i?"Today":i;return n<0?null:e.createElement("div",{className:"absolute top-0 w-px ".concat(o," z-10"),style:{left:"".concat(150*(n+.5),"px"),height:"".concat(a,"px")},"data-testid":"today-marker"},e.createElement("div",{className:"absolute -top-6 left-1/2 transform -translate-x-1/2 ".concat(o," px-1 py-0.5 rounded text-xs text-white whitespace-nowrap"),style:{top:"-10px"}},l))},T=function(t){var n=t.tasks,a=t.headerLabel,r=void 0===a?"Resources":a;t.showIcon,t.showTaskCount,t.theme;var o=Array.isArray(n)?n:[];return e.createElement("div",{className:"w-40 flex-shrink-0 z-10 bg-white shadow-sm"},e.createElement("div",{className:"p-2 font-semibold text-gray-700 border-r border-b border-gray-200 h-10.5"},r),o.map((function(t){if(!t)return null;var n=p(Array.isArray(t.tasks)?t.tasks:[]),a=Math.max(60,40*n.length+20);return e.createElement("div",{key:"taskgroup-".concat(t.id||"unknown"),className:"p-2 border-r border-b border-gray-200 font-medium",style:{height:"".concat(a,"px")},"data-testid":"task-group-label-".concat(t.id||"unknown")},e.createElement("div",{className:"font-medium"},t.name||"Unnamed"),t.description&&e.createElement("div",{className:"text-xs text-gray-500"},t.description))})))},P=function(t){var n=t.children,a=void 0===n?"Project Timeline":n,r=t.className,o=void 0===r?"":r;return e.createElement("h1",{className:"text-2xl font-bold text-gray-800 ".concat(o)},a)},L=function(t){var n=t.children,a=void 0===n?"Resources":n,r=t.className,o=void 0===r?"":r;return e.createElement("div",{className:"font-semibold text-gray-700 ".concat(o)},a)},S=function(t){var n=t.children,a=void 0===n?"Today":n,r=t.className,o=void 0===r?"":r,i=t.markerClassName,l=void 0===i?"bg-red-500":i;return e.createElement("div",{className:"px-1 py-0.5 rounded text-xs text-white whitespace-nowrap ".concat(l," ").concat(o)},a)},C=function(t){var n=t.tasks,a=void 0===n?[]:n,r=t.headerLabel,o=void 0===r?"Resources":r;t.showIcon,t.showTaskCount,t.theme;var i=t.className,l=void 0===i?"":i;return e.createElement("div",{className:"w-40 flex-shrink-0 z-10 bg-white shadow-sm ".concat(l)},e.createElement("div",{className:"p-2 font-semibold text-gray-700 border-r border-b border-gray-200 h-10.5"},o),a.map((function(t){return t?e.createElement("div",{key:"task-group-".concat(t.id||"unknown"),className:"p-2 border-r border-b border-gray-200 font-medium"},e.createElement("div",{className:"font-medium"},t.name||"Unnamed"),t.description&&e.createElement("div",{className:"text-xs text-gray-500"},t.description)):null})))},F=function(t){var n=t.months,a=void 0===n?[]:n,r=t.currentMonthIndex,o=void 0===r?-1:r,i=t.theme,l=t.className,c=void 0===l?"":l,s=(null==i?void 0:i.backgroundHighlight)||"bg-blue-50";return e.createElement("div",{className:"flex border-b border-gray-200 ".concat(c)},a.map((function(t,n){return e.createElement("div",{key:n,className:"w-[150px] flex-shrink-0 p-2 font-semibold text-center ".concat(n===o?s:"")},(a=t)instanceof Date?a.toLocaleString("default",{month:"short",year:"2-digit"}):"");var a})))},A=function(t){var n=t.task,a=t.group,r=t.leftPx,o=void 0===r?0:r,i=t.widthPx,l=void 0===i?100:i,c=t.topPx,s=void 0===c?0:c,d=t.isSelected,u=void 0!==d&&d,m=t.editMode,f=void 0===m||m,h=t.showProgress,v=void 0!==h&&h,g=t.className,p=void 0===g?"":g,D=t.onSelect,w=t.onClick,b=t.onDoubleClick;if(t.onDragStart,t.onDragEnd,!n||!n.id)return console.warn("GanttTaskItem: Invalid task data",n),null;return e.createElement("div",{className:"absolute h-8 rounded ".concat(n.color||"bg-blue-500"," flex items-center px-2 text-xs text-white font-medium ").concat(f?"cursor-move":"cursor-pointer"," ").concat(u?"ring-2 ring-white":""," ").concat(p),style:{left:"".concat(Math.max(0,o),"px"),width:"".concat(Math.max(20,l),"px"),top:"".concat(s,"px")},onClick:function(e){w&&w(n,a),D&&D(n,!u)},onDoubleClick:function(e){b&&b(n)},"data-task-id":n.id},f&&e.createElement("div",{className:"absolute left-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-l"}),e.createElement("div",{className:"truncate select-none"},n.name||"Unnamed Task"),v&&"number"==typeof n.percent&&e.createElement("div",{className:"absolute bottom-1 left-1 right-1 h-1 bg-black bg-opacity-20 rounded-full overflow-hidden"},e.createElement("div",{className:"h-full bg-white rounded-full",style:{width:"".concat(n.percent,"%")}})),f&&e.createElement("div",{className:"absolute right-0 top-0 bottom-0 w-2 bg-white bg-opacity-30 cursor-ew-resize rounded-r"}))},I=function(a){var l=a.tasks,u=void 0===l?[]:l,m=a.startDate,h=a.endDate,v=a.title,g=void 0===v?"Project Timeline":v,b=a.currentDate,k=void 0===b?new Date:b,y=a.showCurrentDateMarker,x=void 0===y||y,I=a.todayLabel,U=void 0===I?"Today":I,Y=a.editMode,z=void 0===Y||Y,R=a.theme,O=void 0===R?d:R,H=a.headerLabel,_=void 0===H?"Resources":H,W=a.showProgress,X=void 0!==W&&W,j=a.onTaskUpdate,B=a.onTaskClick,G=a.onTaskSelect,q=a.onTaskDoubleClick;a.onTaskDelete;var J=a.onTaskDateChange;a.onTaskProgressChange;var K=a.fontSize,Q=a.rowHeight,V=void 0===Q?40:Q;a.timeStep;var Z=a.children,$=n(null),ee=n(null),te=t([]),ne=te[0],ae=te[1],re=m||D(u),oe=h||w(u),ie=f(re,oe),le=ie.length,ce=k.getMonth(),se=k.getFullYear(),de=ie.findIndex((function(e){return e.getMonth()===ce&&e.getFullYear()===se})),ue=function(e){return o.toArray(Z).filter((function(t){return i(t)&&t.type===e}))},me=ue(P);ue(L);var fe,he=ue(S),ve=ue(C),ge=ue(F),pe=ue(A),De=function(e,t){if(j)try{var n=c(c({},t),{startDate:t.startDate instanceof Date?t.startDate:new Date(t.startDate),endDate:t.endDate instanceof Date?t.endDate:new Date(t.endDate)});if(j(e,n),J){var a=u.find((function(t){return t.id===e}));a&&J(t,a.tasks)}}catch(e){console.error("Error in handleTaskUpdate:",e)}else console.warn("onTaskUpdate is not defined")},we=function(e,t){if(B)try{B(e,t)}catch(e){console.error("Error in handleTaskClick:",e)}},be=function(e,t){if(ae((function(n){return t?s(s([],n,!0),[e.id],!1):n.filter((function(t){return t!==e.id}))})),G)try{G(e,t)}catch(e){console.error("Error in onTaskSelect handler:",e)}},ke=function(e){if(q)try{q(e)}catch(e){console.error("Error in onTaskDoubleClick handler:",e)}},ye={fontSize:K||"inherit"};return e.createElement("div",{ref:$,className:"w-full bg-white rounded-xl shadow-lg overflow-hidden",style:ye,"data-testid":"gantt-chart"},e.createElement("div",{className:"p-6 border-b border-gray-200"},me.length>0?r(me[0]):e.createElement(P,null,g)),e.createElement("div",{className:"relative flex"},ve.length>0?e.cloneElement(ve[0],{tasks:u,headerLabel:_,theme:O}):e.createElement(T,{tasks:u,headerLabel:_,theme:O}),e.createElement("div",{ref:ee,className:"flex-grow overflow-x-auto"},e.createElement("div",{className:"min-w-max"},ge.length>0?e.cloneElement(ge[0],{months:ie,currentMonthIndex:de,theme:O}):e.createElement(M,{months:ie,currentMonthIndex:de,theme:O}),e.createElement("div",{className:"relative"},x&&de>=0&&(he.length>0?e.cloneElement(he[0],{label:U}):e.createElement(N,{currentMonthIndex:de,height:(fe=0,u.forEach((function(e){if(e&&Array.isArray(e.tasks)){var t=p(e.tasks);fe+=Math.max(60,t.length*V+20)}else fe+=60})),fe),markerClass:O.todayMarkerColor,label:U})),pe.length>0?e.createElement("div",{className:"relative"},pe.map((function(t,n){var a,r=t.props,o=null===(a=null==r?void 0:r.task)||void 0===a?void 0:a.id,i=c(c({},r),{key:"custom-task-item-".concat(n),isSelected:!!o&&ne.includes(o),onSelect:be,onClick:we,onDoubleClick:ke});return e.cloneElement(t,i)}))):u.map((function(t){return t&&t.id?e.createElement(E,{key:"task-row-".concat(t.id),taskGroup:t,startDate:re,endDate:oe,totalMonths:le,monthWidth:150,editMode:z,showProgress:X,onTaskUpdate:De,onTaskClick:we}):null})))))))};export{d as DEFAULT_THEME,I as GanttChart,S as GanttCurrentDateMarker,L as GanttHeader,A as GanttTaskItem,C as GanttTaskList,F as GanttTimeline,P as GanttTitle,T as TaskList,E as TaskRow,g as calculateTaskPosition,p as detectTaskOverlaps,D as findEarliestDate,w as findLatestDate,m as formatDate,u as formatMonth,h as getDaysInMonth,f as getMonthsBetween,v as getStandardDayMarkers};
//# sourceMappingURL=index.esm.js.map
