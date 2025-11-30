function ueSimplePopup(popupId){
  
  var g_objPopup = jQuery('#'+popupId);
  var g_objOverlay, g_objPopupWrap;
  var g_isInEditor, g_showErrors, g_source, g_triggerType;
  var g_activeClass;
  var g_lastScrollTop, g_isOpenedOnScroll;
  var g_cookieName;
  
  /**
  * empty element id option error handle
  */
  function emptyIdOptionErrorHandle(dataElementId){
    
    if(g_isInEditor == 'no')
      return(false);
    
    if(dataElementId != '')
      return(false);
    
    if(g_showErrors == false)
      return(false);
    
    var errorMessageHtml =  '<div class="uc-editor-message uc-error">Simple Popup Widget Error: Element Id option is empty. Please add Element Id to open it in popup.</div>';
    
    //update popup html to show error message
    g_objPopup.html(errorMessageHtml);
    
  }
  
  /**
  * no element found on the page error handle
  */
  function noElementFoundErrorHandle(objDataElementId, dataElementId){
    
    if(g_isInEditor == 'no')
      return(false);
    
    if(objDataElementId.length)
      return(false);
    
    if(g_showErrors == false)
      return(false);
    
    var errorMessageHtml = '<div class="uc-editor-message uc-error">Simple Popup Widget Error: no Element found with id: "'+dataElementId+'"</div>';
    
    //update popup html to show error message
    g_objPopup.html(errorMessageHtml);
    
  }
  
  /**
  * click on trigger element
  */
  function onFoundElement(dataElementId){
    
    if(g_isInEditor == 'no')
      return(false);
    
    var objPopupElement = jQuery('#'+dataElementId);
    
    if(!objPopupElement.length)
      return(false);
    
    var successMessageHtml = '<div class="uc-editor-message uc-success">Element with id: "'+dataElementId+'" connected.</div> ';
    
    //update popup html to show error message
    g_objPopupWrap.html(successMessageHtml);
    
  }
  
  /*
  * show | hide connected elements in editor
  */ 
  function hideSectionInEditor(objDataElementId){
    
    if(g_isInEditor == 'no')
      return(false);
    
    var dataHideInEditor = g_objPopup.data('hide-connected-elements');
    
    if(dataHideInEditor == true)
      objDataElementId.hide();
    
    if(dataHideInEditor == false)
      objDataElementId.css('display', '');
    
  }
  
  /**
  * append element to popup
  */
  function appendElementToPopup(objDataElementId, dataElementId){
    
    if(g_isInEditor == 'yes'){
      
      //   onFoundElement(dataElementId);
      
      hideSectionInEditor(objDataElementId);
      
      //   return(false);
      
      //clone popup element
      var objClonedElement = objDataElementId.clone();
      
      //append popup element to popup
      g_objPopupWrap.append(objClonedElement);
      
    }else{
    //detach popup element
      var objDetachedElement = objDataElementId.detach();
            
      //append popup element to popup
      g_objPopupWrap.append(objDetachedElement);

    }
    
  }
  
  /**
  * find popup element
  */
  function findPopupElement(){
    
    if(g_source != 'id')
      return(false);
    
    var dataElementId = g_objPopup.data('element-id');
    
    //if in editor and element id option is not set, show error    
    emptyIdOptionErrorHandle(dataElementId);    
    
    //if in editor and element id object is not exist, show error    
    var objDataElementId = jQuery('#'+dataElementId);
    noElementFoundErrorHandle(objDataElementId, dataElementId);
    
    //detach element
    appendElementToPopup(objDataElementId, dataElementId);    
    
  }
  
  /**
  * debug popup for styling  */
  function debugPopup(){
    
    if(g_isInEditor == 'no')
      return(false);
    
    var isDebugModeOn = g_objPopupWrap.data('debug');
    
    if(isDebugModeOn == false)
      return(false);
    
    //add active class to overlay to open popup
    g_objOverlay.addClass(g_activeClass);
    
  }
  
  /**
  * init elementor elements
  */
  function initElementorElements(){
    var objInnerElementorElements = g_objOverlay.find(".elementor-element");
    
    if(!objInnerElementorElements || objInnerElementorElements.length == 0)
      return(false);
    
    objInnerElementorElements.each(function(){
      var objElement = jQuery(this);

      if(objElement.hasClass("elementor-sticky") == true)
        return(true)     
          
      elementorFrontend.elementsHandler.runReadyTrigger( objElement );   
    });
  }
  
  /**
  * open popup
  */
  function openPopup(){
    
    if (document.cookie.includes("ue_simple_popup_" + g_cookieName+"=true;"))
      return(false);
    
    if(g_objOverlay.hasClass(g_activeClass) == true)
      return(false);
    
    //dont run in editor
    if(g_isInEditor == 'yes')
      return(true);
    
    g_objOverlay.addClass(g_activeClass);    
    
    jQuery('body').addClass(g_activeClass);
    
    //trigger elementor popup event
    jQuery(document).trigger( 'ue_run_ready_trigger');
    
    //reinit inner elementor elements
    initElementorElements();
  }
  
  /**
  * click on trigger element
  */
  function onOpenPopupClick(){    
    
    openPopup();
    
  }
  
  /**
  * open popup after page load
  */
  function openPopupAfterLoad(){
    
    //check trigger
    var dataTriggerLoad = g_triggerType.indexOf('load') > -1;
    
    if(dataTriggerLoad == false)
      return(false);
    
    var loadDelay = g_objPopup.data('load-delay') * 1000;
    
    setTimeout(openPopup, loadDelay);
    
  }
  
  /**
  * open popup after page scroll
  */
  function openPopupAfterPageScroll(e){
    
    //check trigger
    var dataTriggerScroll = g_triggerType.indexOf('scroll') > -1;
    
    if(dataTriggerScroll == false)
      return(false);  
    
    var scrollAmountFromWindowTop = jQuery(window).scrollTop();    
    
    //look after scroll direction
    var dataDirection = g_objPopup.data('scroll-direction');
    var actualDirection;
    
    if (scrollAmountFromWindowTop > g_lastScrollTop)
      actualDirection = 'down';
    else 
    actualDirection = 'up';
    
    g_lastScrollTop = scrollAmountFromWindowTop;
    
    if(dataDirection != actualDirection)
      return(false);
    
    var scrollAmountToPopupOpen = g_objPopup.data('scroll-amount'); //percents
    
    var documentHeight = parseInt(jQuery(document).height());
    
    //get round percent number
    var scrollAmountFromWindowTopPercents = Math.floor(scrollAmountFromWindowTop / documentHeight * 100);
    
    if(dataDirection == 'down' && scrollAmountFromWindowTopPercents >= scrollAmountToPopupOpen && g_isOpenedOnScroll == false){
      openPopup();
      g_isOpenedOnScroll = true; //allows to open popup during scroll only one time
    }
    
    if(dataDirection == 'up' && scrollAmountFromWindowTopPercents <= scrollAmountToPopupOpen && g_isOpenedOnScroll == false){
      openPopup();
      g_isOpenedOnScroll = true; //allows to open popup during scroll only one time
    }
    
    
    
  }
  
  /**
  * exit intent trigger
  */
  function onExitIntent(e){
    
    var dataTriggerExit = g_triggerType.indexOf('exit') > -1;
    
    if(dataTriggerExit == false)
      return(false);
    
    var shouldShowExitIntent = !e.toElement &&  !e.relatedTarget && e.clientY < 10;
    
    if (shouldShowExitIntent)     
      openPopup();   
    
  }
  
  /**
  * opaen popup on hash
  */
  function openPopupOnHash(){
    
    var dataTriggerHash = g_triggerType.indexOf('hash') > -1;
    
    if(dataTriggerHash == false)
      return(false);
    
    //find hash in url
    var hash = window.location.hash;
    
    //remove hash char
    hash = hash.replace("#", "");
    
    if(!hash)
      return(false);
    
    var dataHash = g_objPopup.data('popup-hash');
    
    if(hash == dataHash)
      openPopup();
    
    
  }
  
  /**
  * click on close element
  */
  function onClosePopupClick(){
    
    //dont run in editor
    if(g_isInEditor == 'yes')
      return(false);
    
    if(g_objOverlay.hasClass(g_activeClass) == false)
      return(false);
    
    g_objOverlay.removeClass(g_activeClass);
    
    jQuery('body').removeClass(g_activeClass);
    
    //set cookie if needed
    setCookie();
    
  }
  
  /**
  * set cookie name
  */
  function setCookie(){
    
    var dataCookie = g_objPopup.data('cookie');
    
    if(dataCookie == false)
      return(false);
    
    //get data time values in miliseconds
    var dataCookieDays = g_objPopup.data('cookie-days') * 24 * 60 * 60 * 1000;
    var dataCookieHours = g_objPopup.data('cookie-hours') * 60 * 60 * 1000;
    var dataCookieMinutes = g_objPopup.data('cookie-minutes') * 60 * 1000;
    var dataCookieSeconds = g_objPopup.data('cookie-seconds') * 1000;
    
    var ue_expires = new Date();
    
    ue_expires.setTime(ue_expires.getTime() + dataCookieDays + dataCookieHours + dataCookieMinutes + dataCookieSeconds);
    
    document.cookie = "ue_simple_popup_" + g_cookieName+"=true; expires=" + ue_expires.toUTCString() + ";";
    
  }
  
  /**
  * on custom trigger element click
  */
  function onCustomTriggerElementClick(){
    
    //find if any opened popup exists
    var objOpenedSimplePopupOverlay = jQuery('.ue-simple-popup-overlay.'+g_activeClass);
    
    if(!objOpenedSimplePopupOverlay.length)
      return(false);
    
    //dont close popup in editor
    if(g_isInEditor == 'yes')
      return(false);
    
    objOpenedSimplePopupOverlay.removeClass(g_activeClass);
    
    jQuery('body').removeClass(g_activeClass);
    
    //set cookie if needed
    setCookie();
    
  }
  
  function initPopup(){
    
    //init vars
    g_objOverlay = g_objPopup.find('.ue-simple-popup-overlay');
    g_objPopupWrap = g_objPopup.find('.ue-simple-popup-wrapper');
    g_isInEditor = g_objPopup.data('editor');
    g_showErrors = g_objPopup.data('show-errors');
    g_source = g_objPopup.data('source');
    g_triggerType = g_objPopup.data('trigger-type');
    g_activeClass = 'uc-active';
    g_lastScrollTop = 0;
    g_isOpenedOnScroll = false;
    g_cookieName = popupId + '_cookieName';
    
    var objOpenPopup = g_objPopup.find('.ue-simple-popup-trigger');
    var objClosePopup = g_objPopup.find('.ue-simple-popup-close');
    
    //custom close element
    var objCustomCloseElements = jQuery('.uc-close-simple-popup');
    
    //find popup element
    findPopupElement();
    
    //debug for styling
    debugPopup();
    
    //init events
    objOpenPopup.on('click', onOpenPopupClick);
    
    objClosePopup.on('click', onClosePopupClick);
    
    objCustomCloseElements.on('click', onCustomTriggerElementClick)
    
    g_objOverlay.on("click", function(event){
      
      //close popup unless target isn't popup wrap object (not working in debug mode in editor)
      if (!jQuery(event.target).closest(g_objPopupWrap).length)
        onClosePopupClick();
      
    });
    
    //open popup after page load
    openPopupAfterLoad();
    
    //open popup if popup hash exist
    openPopupOnHash();
    
    var animFrameId;
    
    //open popup after page scroll
    jQuery(window).on('scroll', function(){
      
      if (animFrameId)
        cancelAnimationFrame(animFrameId);      
      
      animFrameId = requestAnimationFrame(openPopupAfterPageScroll);
      
    });
    
    //open popup before page leave    
    jQuery(document).on('mouseout', onExitIntent);
    
  }
  
  var g_isInited = false;
  
  function checkBreakPointAndInit(dataBreakPoint){
    
    var isResponsiveViewport = window.matchMedia("(max-width: "+dataBreakPoint+"px)").matches;
    
    if(isResponsiveViewport == false)
      return(false);
    
    if(g_isInited == true)
      return(false);
    
    initPopup();
    
    g_isInited = true;
    
  }
  
  //responsive mode
  function initReponsiveMode(){
    
    
    var dataResponsiveMode = g_objPopup.data('responsive-mode');
    
    if(dataResponsiveMode == false){
      
      initPopup(); //regular mode
      
      return(false);
      
    }
    
    var dataBreakPoint = g_objPopup.data('responsive-breakpoint');
    
    checkBreakPointAndInit(dataBreakPoint); //responsive mode
    
    jQuery(window).on('resize', function(){
      checkBreakPointAndInit(dataBreakPoint); //responsive mode
    });
    
  }
  
  initReponsiveMode();
  
}