/**
 * Dropdown elements. to show/hide elements by toggling a given class
 */
jQuery(document).ready(function(){
    //ARIA attributes
    var ariaExpanded = "aria-expanded";
    var ariaHidden = "aria-hidden";

    //Toggle elements
    jQuery('[data-toggle]').on('click keyup', function (triggerEvent) {
        triggerEvent.preventDefault();
        var $toggleButton = jQuery(this);
        var eventType 			= triggerEvent.type;
        var eventKey 			= triggerEvent.charCode || triggerEvent.keyCode || triggerEvent.which;
        var selectorToToggle 	= $toggleButton.data('toggle');
        var groupToToggle 		= $toggleButton.data('toggle-group'); //Group to hide when we toggle an element
        var activeClass			= $toggleButton.data('toggle-active-class')? $toggleButton.data('toggle-active-class') 	: 'active'; //Class used to mark the selector as active
        var hideClass			= $toggleButton.data('toggle-hide-class')? $toggleButton.data('toggle-hide-class') 		: 'hide'; //Class used to hide the group
        var $containerToToggle 	= jQuery(selectorToToggle);

        // ARIA Begin attributes
        var splitted = selectorToToggle.split(','+/\s+/g);

        //For avoiding all keys to trigger the dropdown
        if((eventType === 'keyup' && eventKey !== 27) || (eventType === 'keyup' && eventKey !== 13 && !$toggleButton.hasClass('active'))){
            return false;
        }
        for (var i = 0; i < splitted.length; i++) {
            var current = jQuery("[data-toggle*='" + splitted[i] + "']");
            var dropdownContainer = jQuery(splitted[i]);
            var list = dropdownContainer.find('ul');
            var listItems = list.find('li');

            //We set a new listener for the Escape key
            listItems.on('keyup', function (listElementEvent) {
                var keyPressed = listElementEvent.charCode || listElementEvent.keyCode || listElementEvent.which;
                if(keyPressed === 27 ){
                    //The focus is returned to the trigger
                    setTimeout(function () {
                        $toggleButton.focus();
                    }, 200);
                    //A fake click event in triggered
                    $toggleButton.click();
                    //Current listener is deleted for avoiding duplicated events
                    listItems.off();
                }
            });

            if(dropdownContainer.attr(ariaHidden)){
                if(dropdownContainer.attr(ariaHidden) === 'true'){
                    setTimeout(function () {
                        listItems.eq(0).find('a').focus();
                    }, 200);
                    dropdownContainer.attr(ariaHidden, false);
                }else{
                    dropdownContainer.attr(ariaHidden, true);
                }
            }
        }
        // ARIA End

        if(groupToToggle === undefined){
            $containerToToggle.toggleClass(hideClass, '');
            jQuery(this).toggleClass(activeClass);
        }
        //If this is configured we only allow one element visible at a given time
        else{
            var $groupToHide = jQuery(groupToToggle);
            $groupToHide.removeClass(activeClass);

            var isHidden = $containerToToggle.hasClass(hideClass);

            //Hide all the other elements fo the group
            $groupToHide.each(function(){
                var $dropdownButton = jQuery(this);
                jQuery($dropdownButton.data('toggle')).addClass(hideClass);
            });

            if(isHidden){
                $containerToToggle.toggleClass(hideClass);
                jQuery(this).toggleClass(activeClass);
            }
        }

        var $form = $containerToToggle.find("form");
        if($form.length > 0 && $form.is(":visible")) {

            //If esc key is pressed inside a form in dropdown, we make a fake click
            $form.on('keyup', function (eventForm){
                var eventKey = eventForm.charCode || eventForm.keyCode || eventForm.which;
                if(eventKey == '27'){
                    setTimeout(function () {
                        $toggleButton.focus();
                    }, 200);
                    $toggleButton.click();
                    $form.off();
                }
            });

            var $inputFocus = $form.find('input, textarea, select')
                .not(':input[type=button], :input[type=submit], :input[type=reset]');
            if($inputFocus.length > 0) {
                setTimeout(function () {
                    $inputFocus.first().focus();
                }, 200);
            }
        }
    });

    //Add Active Class
    jQuery('[data-add-class-target]').on('click', function(){
        var target = jQuery(this).data('add-class-target');
        jQuery(target).addClass('active');
    });
    //Remove Active Class
    jQuery('[data-remove-class-target]').on('click keyup', function(event){
        var eventKey = event.charCode || event.keyCode || event.which;
        var eventType = event.type;
        if(eventType == 'keyup' && eventKey != "27"){
            return false;
        }
        var target = jQuery(this).data('remove-class-target');

        jQuery(target).removeClass('active');
    });
    //Add Active Class
    jQuery('[data-toggle-class-target]').on('click', function(){
        var target 		= jQuery(this).data('toggle-class-target');
        var className 	= jQuery(this).data('toggle-class-target-value');

        if(!className){
            className = 'hide';
        }

        jQuery(target).toggleClass(className);
    });
    /**
     * Toggle with animation
     */
    jQuery('[data-toggle-animate]').on('click', function(){
        var target = jQuery(this).data('toggle-animate');
        jQuery(target).slideToggle('fast');
    });

    window.addEventListener('load', function (event) {
        $('.sticky-element').sticky({topSpacing:12, zIndex: 10});
    });
});
