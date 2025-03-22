"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var r=require("./GanttThemeProvider-CoueaYep.js"),o=require("react");require("date-fns");!function(r,o){void 0===o&&(o={});var t=o.insertAt;if("undefined"!=typeof document){var a=document.head||document.getElementsByTagName("head")[0],e=document.createElement("style");e.type="text/css","top"===t&&a.firstChild?a.insertBefore(e,a.firstChild):a.appendChild(e),e.styleSheet?e.styleSheet.cssText=r:e.appendChild(document.createTextNode(r))}}(":root{--color-white:#fff;--color-black:#000;--color-gray-50:#f9fafb;--color-gray-100:#f3f4f6;--color-gray-200:#e5e7eb;--color-gray-300:#d1d5db;--color-gray-400:#9ca3af;--color-gray-500:#6b7280;--color-gray-600:#4b5563;--color-gray-700:#374151;--color-gray-800:#1f2937;--color-gray-900:#111827;--color-blue-50:#eff6ff;--color-blue-100:#dbeafe;--color-blue-500:#3b82f6;--color-blue-600:#2563eb;--color-blue-700:#1d4ed8;--color-red-500:#ef4444;--color-indigo-500:#6366f1;--color-indigo-600:#4f46e5;--color-gantt-bg:var(--color-white);--color-gantt-text:var(--color-gray-800);--color-gantt-border:var(--color-gray-200);--color-gantt-highlight:var(--color-blue-50);--color-gantt-marker:var(--color-red-500);--color-gantt-task:var(--color-blue-500);--color-gantt-task-text:var(--color-white);--color-border-gantt-border:var(--color-gray-200);--rmg-tooltip-bg:var(--color-white);--rmg-tooltip-text:var(--color-gray-800);--rmg-tooltip-border:var(--color-gray-200);--rmg-resize-handle:hsla(0,0%,100%,.3);--rmg-progress-bg:rgba(0,0,0,.2);--rmg-progress-fill:var(--color-white);--rmg-shadow:rgba(0,0,0,.1);--rmg-shadow-hover:rgba(0,0,0,.2);--rmg-shadow-drag:rgba(0,0,0,.3);--rmg-animation-speed:0.25;--rmg-task-hover-transition:transform 0.15s cubic-bezier(0.2,0,0.13,2),box-shadow 0.15s cubic-bezier(0.2,0,0.13,2);--rmg-task-drag-transition:transform 0.05s cubic-bezier(0.2,0,0.13,2),box-shadow 0.05s cubic-bezier(0.2,0,0.13,2);--rmg-task-release-transition:all 0.2s cubic-bezier(0.2,0,0.13,2);--scrollbar-track:rgba(229,231,235,.5);--scrollbar-thumb:rgba(156,163,175,.7);--scrollbar-thumb-hover:hsla(220,9%,46%,.8);--scrollbar-size:8px}.dark{--color-gantt-bg:var(--color-gray-800);--color-gantt-text:var(--color-gray-100);--color-gantt-border:var(--color-gray-700);--color-gantt-highlight:var(--color-gray-700);--color-gantt-marker:var(--color-red-500);--color-gantt-task:var(--color-indigo-600);--color-gantt-task-text:var(--color-white);--color-border-gantt-border:var(--color-gray-700);--rmg-tooltip-bg:var(--color-gray-800);--rmg-tooltip-text:var(--color-gray-100);--rmg-tooltip-border:var(--color-gray-700);--rmg-resize-handle:hsla(0,0%,100%,.4);--rmg-progress-bg:rgba(0,0,0,.3);--rmg-progress-fill:var(--color-gray-200);--rmg-shadow:rgba(0,0,0,.3);--rmg-shadow-hover:rgba(0,0,0,.4);--rmg-shadow-drag:rgba(0,0,0,.5);--scrollbar-track:rgba(55,65,81,.5);--scrollbar-thumb:rgba(75,85,99,.7);--scrollbar-thumb-hover:hsla(220,9%,46%,.8)}.rmg-gantt-chart{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:var(--color-gantt-bg);color:var(--color-gantt-text);font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Noto Sans,Liberation Sans,Arial,sans-serif;font-size:16px;line-height:1.5;overflow:hidden;scrollbar-color:var(--scrollbar-thumb) var(--scrollbar-track);scrollbar-width:thin}[data-task-id]:not([data-dragging=true]){backface-visibility:hidden;transform:translateZ(0);transition:var(--rmg-task-hover-transition);will-change:transform,box-shadow}[data-task-id]:hover{box-shadow:0 3px 10px var(--rmg-shadow-hover);transform:translateY(-1px);z-index:20}[data-task-id][data-dragging=true]{box-shadow:0 5px 15px var(--rmg-shadow-drag);cursor:grabbing;opacity:.95;transition:var(--rmg-task-drag-transition);z-index:100}.rmg-task-tooltip{opacity:0;pointer-events:none;transform:translateY(5px);transition:opacity .2s ease,transform .2s ease}.rmg-task-tooltip.visible{opacity:1;transform:translateY(0)}.rmg-task-progress{background-color:var(--rmg-progress-bg);border-radius:4px;bottom:3px;height:3px;left:3px;overflow:hidden;position:absolute;right:3px}.rmg-task-progress-fill{background-color:var(--rmg-progress-fill);border-radius:4px;height:100%;transition:width .3s ease-out}.rmg-timeline-unit:hover{background-color:var(--rmg-highlight);transition:background-color .15s ease}.rmg-resize-handle{opacity:0;transition:opacity .15s ease}[data-task-id]:hover .rmg-resize-handle{opacity:1}.rmg-today-marker{animation:pulse 3s ease-in-out infinite}.rmg-gantt-scroll-container{scrollbar-color:var(--scrollbar-thumb) var(--scrollbar-track);scrollbar-width:thin}.rmg-gantt-chart::-webkit-scrollbar,.rmg-gantt-scroll-container::-webkit-scrollbar{height:var(--scrollbar-size);width:var(--scrollbar-size)}.rmg-gantt-chart::-webkit-scrollbar-track,.rmg-gantt-scroll-container::-webkit-scrollbar-track{background:var(--scrollbar-track);border-radius:12px}.rmg-gantt-chart::-webkit-scrollbar-thumb,.rmg-gantt-scroll-container::-webkit-scrollbar-thumb{background-clip:content-box;background-color:var(--scrollbar-thumb);border:2px solid transparent;border-radius:12px}.rmg-gantt-chart::-webkit-scrollbar-thumb:hover,.rmg-gantt-scroll-container::-webkit-scrollbar-thumb:hover{background-color:var(--scrollbar-thumb-hover)}.rmg-gantt-chart::-webkit-scrollbar-corner,.rmg-gantt-scroll-container::-webkit-scrollbar-corner{background-color:transparent}.rmg-gantt-scroll-container:focus{box-shadow:inset 0 0 0 2px var(--color-blue-500);outline:none}@keyframes pulse{0%{opacity:.8}50%{opacity:1}to{opacity:.8}}@keyframes update-flash{0%{box-shadow:0 0 0 2px rgba(79,70,229,.2)}50%{box-shadow:0 0 0 4px rgba(79,70,229,.4)}to{box-shadow:0 0 0 2px rgba(79,70,229,0)}}.rmg-task-updated{animation:update-flash 1s cubic-bezier(.2,0,.13,2)}.rmg-gantt-scroll-container{scroll-behavior:smooth}.rmg-auto-scrolling{scroll-behavior:auto!important}[data-task-id]{border-radius:4px;box-shadow:0 1px 3px var(--rmg-shadow)}[data-task-id] .rmg-progress-bar{background-color:var(--rmg-progress-bg);border-radius:4px;bottom:3px;height:2px;left:3px;overflow:hidden;position:absolute;right:3px;transition:height .15s ease-out}[data-task-id]:hover .rmg-progress-bar{height:3px}.rmg-progress-fill{background-color:var(--rmg-progress-fill);border-radius:4px;height:100%;position:relative;transition:width .15s ease-out}.rmg-progress-handle{background-color:#fff;border:2px solid var(--rmg-task);border-radius:50%;box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:ew-resize;height:10px;opacity:0;position:absolute;right:0;top:50%;transform:translate(50%,-50%);transition:opacity .2s ease,transform .15s ease,box-shadow .15s ease;width:10px;z-index:10}[data-task-id]:hover .rmg-progress-handle{opacity:1}.rmg-progress-handle.dragging,.rmg-progress-handle:hover{box-shadow:0 2px 5px rgba(0,0,0,.3);transform:translate(50%,-50%) scale(1.2)}.rmg-progress-tooltip{background-color:var(--rmg-tooltip-bg);border-radius:3px;color:var(--rmg-tooltip-text);font-size:10px;opacity:0;padding:2px 5px;pointer-events:none;position:absolute;right:0;top:-20px;transform:translateY(5px);transition:opacity .2s ease,transform .2s ease;white-space:nowrap}.rmg-progress-handle.dragging+.rmg-progress-tooltip,.rmg-progress-handle:hover+.rmg-progress-tooltip{opacity:1;transform:translateY(0)}@media (max-width:640px){.w-40{width:6rem}}");var t=function(t){return o.createElement(r.GanttChart,r.__assign({},t))};exports.CollisionService=r.CollisionService,Object.defineProperty(exports,"DateDisplayFormat",{enumerable:!0,get:function(){return r.DateDisplayFormat}}),exports.GanttChart=r.GanttChart,exports.GanttThemeProvider=r.GanttThemeProvider,exports.TaskItem=r.TaskItem,exports.TaskList=r.TaskList,exports.TaskRow=r.TaskRow,exports.TaskService=r.TaskService,exports.Timeline=r.Timeline,exports.TodayMarker=r.TodayMarker,exports.Tooltip=r.Tooltip,Object.defineProperty(exports,"ViewMode",{enumerable:!0,get:function(){return r.ViewMode}}),exports.ViewModeSelector=r.ViewModeSelector,exports.calculateDuration=r.calculateDuration,exports.calculateTaskPosition=r.calculateTaskPosition,exports.detectTaskOverlaps=r.detectTaskOverlaps,exports.findEarliestDate=r.findEarliestDate,exports.findLatestDate=r.findLatestDate,exports.formatDate=r.formatDate,exports.formatDateRange=r.formatDateRange,exports.formatMonth=r.formatMonth,exports.getDaysInMonth=r.getDaysInMonth,exports.getDuration=r.getDuration,exports.getMonthsBetween=r.getMonthsBetween,exports.useGanttTheme=r.useGanttTheme,exports.GanttChartWithStyles=t,exports.default=t;
//# sourceMappingURL=index.js.map
