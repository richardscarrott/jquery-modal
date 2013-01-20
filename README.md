## Quick start
	
### JavaScript

    $.modal.open('This is some content');
	
### Generated mark-up

    <div class="modal-overlay"></div>
   
    <div class="modal">
        <div class="modal-content">
            
            <!-- content -->
            
        </div>
        <a href="#" class="modal-close">close X</a>
    </div>

## DOCS

### Overview
This was written to address some issues I've experienced when working with a number of existing modal plugins:
		
* It dynamically sizes the modal based on it's final state, so any styles applied based on .modal * will be taken into account and the modal correctly sized.
* It avoids the use of fixed positioning to ensure users can always get to the content even if it's outside of the viewport which also means it supports touch devices and IE6.
* It allows extra classes to be added to the container element (not just the content element) to easily change and extend different 'skins'.
* It provides a constructor function to allow for multiple instances.
* It correctly positions itself on touch devices, even when zoomed in.

### Options

#### width: 'auto' (string, number)
Defines the width of the modal, if set to 'auto' the width will be automatically calculated based on size of content

#### height: 'auto' (string, number)
Defines the height of the modal, if set to 'auto' the height will be automatically calculated based on size of content

#### maxWidth: null (number)
Defines the maxium width of the modal

#### maxHeight: null (number)
Defines the maxium height of the modal

#### fitViewport: false (boolean)
If set to true the modal will be sized to fit within the viewport

#### keepAspect: false (boolean)
If set to true the modal will maintain it's original aspect ratio if / when resized
 
#### modal: true (boolean)
If set to true the page will blocked with an overlay div to stop interaction

#### openSpeed: 'fast' (string, number)
Defines speed modal will fade in. Can take any standard jQuery speed strings or number

#### closeSpeed: 'fast' (string, number)
Defines speed modal will fade out. Can take any standard jQuery speed strings or number

#### closeText: 'close X' (string)
Defines text to be applied to close element

#### extraClasses: null (string)
Defines any extra space seperated classes to be added to the outer .modal element

#### position: null (array - [top, left])
Allows final modal position to be overridden if centering is not desired

#### closeSelector: '.modal-content-close' (string)
Any elements wihtin the modal matching the closeSelector will close the modal on click

#### closeKeyCode: 27 (number)
Keycode used to close the modal, default to Esc key

#### closeOverlay: true (boolean)
Defines whether clicking on the overlay will close the modal

#### overlayOpacity: 0.5 (number)
Defines the overlay opacity; it's within JS and not CSS to a) take advantage of jQuery's cross browser opacity normalisation and b) because <= IE7 can't fadeIn translucent elements

### Callbacks

#### The following data is passed to all callbacks
    
    {
        modal (jQuery object)
        content (jQuery object)
        closeBtn (jQuery object)
        overlay (jQuery object)
    }

#### init: null (function)
See tin

#### beforeOpen: null (function)
See tin

#### afterOpen: null (function)
See tin

#### beforeClose: null (function)
See tin

#### afterClose: null (function)
See tin

### Methods
#### open $.modal.open(content, [options])
Displays content in modal using options, content can be a selector, element, HTML string, or jQuery object (anything $.fn.append() can take)

#### refresh $.modal.refresh()
Repositions modal, useful if content has changed

#### update $.modal.update(newContent, [options])
Replaces modal content with newContent, unlike $.modal(), options persist

#### loading $.modal.loading([beforeClose])
Helper method to show modal in a loading state, use .modal-isloading for styling.
A function can be passed in to be called before close; this can be useful if ajax request needs to be aborted

#### close $.modal.close([animate])
Closes modal, pass in boolean to define whether close should fade out

#### destroy $.modal.destroy()
Removes modal from DOM and unbinds all associated events

### Constructor
#### new $.rs.Modal(name, [defaults])
Creates new instance of $.rs.Modal where name (string) is used as a prefix for the generated mark-ups classNames and defaults (object) is merged in with the above options to specialise the instance.

    var myModal = new $.rs.Modal('mymodal', {
        maxWidth: 500,
        maxHeight: 600,
        fitViewport: true,
        closeText: 'X'
    });

    myModal.open('this is some content');

    // Generated mark-up
    <div class="mymodal-overlay"></div>
   
    <div class="mymodal">
        <div class="mymodal-content">
            
            <!-- content -->
            
        </div>
        <span class="mymodal-close">X</span>
    </div>

[If you have any questions or ideas you can contact me here](http://richardscarrott.co.uk/contact "Richard Scarrott")