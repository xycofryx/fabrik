var FbDateTime=new Class({Extends:FbElement,options:{dateTimeFormat:"",calendarSetup:{eventName:"click",ifFormat:"%Y/%m/%d",daFormat:"%Y/%m/%d",singleClick:true,align:"Br",range:[1900,2999],showsTime:false,timeFormat:"24",electric:true,step:2,cache:false,showOthers:false}},initialize:function(b,a){this.parent(b,a);this.hour="0";this.plugin="fabrikdate";this.minute="00";this.buttonBg="#ffffff";this.buttonBgSelected="#88dd33";this.startElement=b;this.setUpDone=false;this.setUp()},setUp:function(){this.watchButtons();if(this.options.typing===false){this.disableTyping()}this.element.getElement("img.calendarbutton").addEvent("click",function(a){if(this.cal){this.cal.show()}else{this.makeCalendar()}}.bind(this))},dateSelect:function(date){var fn=this.options.calendarSetup.dateAllowFunc;if(typeOf(fn)!=="null"&&fn!==""){eval(fn);return result}try{return disallowDate(this.cal,date)}catch(err){}},calSelect:function(b,a){var c=this.setTimeFromField(b.date);this.update(c.format("db"));if(this.cal.dateClicked){this.cal.callCloseHandler()}window.fireEvent("fabrik.date.select",this)},calClose:function(a){this.cal.hide();window.fireEvent("fabrik.date.close",this);if(this.options.hasValidations){this.form.doElementValidation(this.options.element)}},makeCalendar:function(){if(this.cal){this.cal.show();return}var j=false;this.addEventToCalOpts();var h=this.options.calendarSetup;var c=["displayArea","button"];for(var b in c){if(typeof h[c[b]]==="string"){h[c[b]]=document.getElementById(h[c[b]])}}h.inputField=this.getDateField();var a=h.inputField||h.displayArea;var e=h.inputField?h.ifFormat:h.daFormat;this.cal=null;if(a){h.date=Date.parseDate(a.value||a.innerHTML,e)}this.cal=new Calendar(h.firstDay,h.date,h.onSelect,h.onClose);this.cal.setDateStatusHandler(h.dateStatusFunc);this.cal.setDateToolTipHandler(h.dateTooltipFunc);this.cal.showsTime=h.showsTime;this.cal.time24=(h.timeFormat.toString()==="24");this.cal.weekNumbers=h.weekNumbers;if(h.multiple){cal.multiple={};for(b=h.multiple.length;--b>=0;){var g=h.multiple[b];var f=g.print("%Y%m%d");this.cal.multiple[f]=g}}this.cal.showsOtherMonths=h.showOthers;this.cal.yearStep=h.step;this.cal.setRange(h.range[0],h.range[1]);this.cal.params=h;this.cal.getDateText=h.dateText;this.cal.setDateFormat(e);this.cal.create();this.cal.refresh()},disableTyping:function(){if(typeOf(this.element)==="null"){fconsole(element+": not date element container - is this a custom template with a missing $element->containerClass div/li surrounding the element?");return}this.element.setProperty("readonly","readonly");this.element.getElements(".fabrikinput").each(function(a){a.addEvent("focus",function(b){if(typeOf(b)==="null"){return}if(b.target.hasClass("timeField")){this.element.getParent(".fabrikElementContainer").getElement(".timeButton").fireEvent("click")}else{this.options.calendarSetup.inputField=b.target.id;this.options.calendarSetup.button=this.element.id+"_img";this.addEventToCalOpts()}}.bind(this))}.bind(this))},getValue:function(){var a;if(!this.options.editable){return this.options.value}this.getElement();if(this.cal){a=this.cal.date}else{if(this.options.value===""){return""}a=new Date.parse(this.options.value)}a=this.setTimeFromField(a);return a.format("db")},setTimeFromField:function(e){if(this.options.showtime===true&&this.timeElement){var b=this.timeElement.get("value").split(":");var c=b[0]?b[0].toInt():0;var a=b[1]?b[1].toInt():0;e.setHours(c);e.setMinutes(a)}return e},watchButtons:function(){if(this.options.showtime&this.options.editable){this.getTimeField();this.getTimeButton();if(this.timeButton){this.timeButton.removeEvents("click");this.timeButton.addEvent("click",function(){this.showTime()}.bind(this));if(!this.setUpDone){if(this.timeElement){this.dropdown=this.makeDropDown();this.setAbsolutePos(this.timeElement);this.setUpDone=true}}}}},addNewEvent:function(action,js){if(action==="load"){this.loadEvents.push(js);this.runLoadEvent(js)}else{if(!this.element){this.element=$(this.strElement)}if(action==="change"){Fabrik.addEvent("fabrik.date.select",function(){var e="fabrik.date.select";typeOf(js)==="function"?js.delay(0):eval(js)})}this.element.getElements("input").each(function(i){i.addEvent(action,function(e){if(typeOf(e)==="event"){e.stop()}typeOf(js)==="function"?js.delay(0):eval(js)})}.bind(this))}},update:function(c){if(c==="invalid date"){fconsole(this.element.id+": date not updated as not valid");return}var a;if(typeOf(c)==="string"){a=Date.parse(c);if(a===null){return}}else{a=c}var b=this.options.calendarSetup.ifFormat;if(this.options.dateTimeFormat!==""&&this.options.showtime){b+=" "+this.options.dateTimeFormat}this.fireEvents(["change"]);if(typeOf(c)==="null"||c===false){return}if(!this.options.editable){if(typeOf(this.element)!=="null"){this.element.set("html",a.format(b))}return}if(this.options.hidden){a=a.format(b);this.getDateField().value=a;return}else{this.getTimeField();this.hour=a.get("hours");this.minute=a.get("minutes");this.stateTime()}this.getDateField().value=a.format(this.options.calendarSetup.ifFormat)},getDateField:function(){return this.element.getElement(".fabrikinput")},getTimeField:function(){this.timeElement=this.element.getParent(".fabrikElementContainer").getElement(".timeField");return this.timeElement},getTimeButton:function(){this.timeButton=this.element.getParent(".fabrikElementContainer").getElement(".timeButton");return this.timeButton},showCalendar:function(b,a){},getAbsolutePos:function(b){var c={x:b.offsetLeft,y:b.offsetTop};if(b.offsetParent){var a=this.getAbsolutePos(b.offsetParent);c.x+=a.x;c.y+=a.y}return c},setAbsolutePos:function(a){var b=this.getAbsolutePos(a);this.dropdown.setStyles({position:"absolute",left:b.x,top:b.y+30})},makeDropDown:function(){var b=null;var e=new Element("div",{styles:{height:"20px",curor:"move",color:"#dddddd",padding:"2px;","background-color":"#333333"},id:this.startElement+"_handle"}).appendText(this.options.timelabel);var g=new Element("div",{className:"fbDateTime",styles:{"z-index":999999,display:"none",cursor:"move",width:"264px",height:"125px",border:"1px solid #999999",backgroundColor:"#EEEEEE"}});g.appendChild(e);for(var a=0;a<24;a++){b=new Element("div",{styles:{width:"20px","float":"left",cursor:"pointer","background-color":"#ffffff",margin:"1px","text-align":"center"}});b.innerHTML=a;b.className="fbdateTime-hour";g.appendChild(b);$(b).addEvent("click",function(d){this.hour=d.target.innerHTML;this.stateTime();this.setActive()}.bind(this));$(b).addEvent("mouseover",function(d){if(this.hour!==d.target.innerHTML){d.target.setStyles({background:"#cbeefb"})}}.bind(this));$(b).addEvent("mouseout",function(d){if(this.hour!==d.target.innerHTML){b.setStyles({background:this.buttonBg})}}.bind(this))}var c=new Element("div",{styles:{clear:"both",paddingTop:"5px"}});for(a=0;a<12;a++){b=new Element("div",{styles:{width:"41px","float":"left",cursor:"pointer",background:"#ffffff",margin:"1px","text-align":"center"}});b.setStyles();b.innerHTML=":"+(a*5);b.className="fbdateTime-minute";c.appendChild(b);$(b).addEvent("click",function(d){this.minute=this.formatMinute(d.target.innerHTML);this.stateTime();this.setActive()}.bind(this));b.addEvent("mouseover",function(i){var d=i.target;if(this.minute!==this.formatMinute(d.innerHTML)){i.target.setStyles({background:"#cbeefb"})}}.bind(this));b.addEvent("mouseout",function(i){var d=i.target;if(this.minute!==this.formatMinute(d.innerHTML)){i.target.setStyles({background:this.buttonBg})}}.bind(this))}g.appendChild(c);document.addEvent("click",function(h){if(this.timeActive){var d=h.target;if(d!==this.timeButton&&d!==this.timeElement){if(!d.within(this.dropdown)){this.hideTime()}}}}.bind(this));g.injectInside(document.body);var f=new Drag.Move(g);return g},toggleTime:function(){if(this.dropdown.style.display==="none"){this.doShowTime()}else{this.hideTime()}},doShowTime:function(){this.dropdown.setStyles({display:"block"});this.timeActive=true;Fabrik.fireEvent("fabrik.date.showtime",this)},hideTime:function(){this.timeActive=false;this.dropdown.setStyles({display:"none"});this.form.doElementValidation(this.element.id);Fabrik.fireEvent("fabrik.date.hidetime",this);Fabrik.fireEvent("fabrik.date.select",this)},formatMinute:function(a){a=a.replace(":","");a.pad("2","0","left");return a},stateTime:function(){if(this.timeElement){var a=this.hour.toString().pad("2","0","left")+":"+this.minute.toString().pad("2","0","left");var b=this.timeElement.value!==a;this.timeElement.value=a;if(b){this.fireEvents(["change"])}}},showTime:function(){this.setAbsolutePos(this.timeElement);this.toggleTime();this.setActive()},setActive:function(){var a=this.dropdown.getElements(".fbdateTime-hour");a.each(function(c){c.setStyles({backgroundColor:this.buttonBg})},this);var b=this.dropdown.getElements(".fbdateTime-minute");b.each(function(c){c.setStyles({backgroundColor:this.buttonBg})},this);a[this.hour.toInt()].setStyles({backgroundColor:this.buttonBgSelected});if(typeOf(b[this.minute/5])!=="null"){b[this.minute/5].setStyles({backgroundColor:this.buttonBgSelected})}},addEventToCalOpts:function(){this.options.calendarSetup.onSelect=function(b,a){this.calSelect(b,a)}.bind(this);this.options.calendarSetup.dateStatusFunc=function(a){return this.dateSelect(a)}.bind(this);this.options.calendarSetup.onClose=function(a){this.calClose(a)}.bind(this)},cloned:function(d){this.setUpDone=false;this.hour=0;var a=this.element.getElement("img");if(a){a.id=this.element.id+"_cal_img"}var b=this.element.getElement("input");b.id=this.element.id+"_cal";this.options.calendarSetup.inputField=b.id;this.options.calendarSetup.button=this.element.id+"_img";if(this.options.hidden!==true){this.makeCalendar();this.cal.hide()}this.setUp()}});